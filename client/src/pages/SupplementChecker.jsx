import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Camera, Upload, AlertTriangle, CheckCircle, ShieldAlert, ArrowLeft, Loader2, Sparkles, FileText } from 'lucide-react';
import { searchMedicine } from '../services/api';
import { recognizeImageText, extractKeywordsFromText } from '../services/ocrService';
import { useGamification } from '../context/GamificationContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function SupplementChecker() {
  const { unlockBadge, addXP } = useGamification();
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'scan'

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // OCR Scan State
  const [scanImage, setScanImage] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [detectedText, setDetectedText] = useState('');
  const [matchedResults, setMatchedResults] = useState([]);
  const [scanError, setScanError] = useState('');

  // Search submit
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setHasSearched(true);
    try {
      const res = await searchMedicine(searchQuery.trim());
      setSearchResults(res.results || []);
      // Trigger Label Inspector badge
      unlockBadge('badge-09', { name: 'Label Inspector', description: 'Searched or scanned a supplement label.' });
      addXP(5, 'Searched medicine database');
    } catch (err) {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // OCR Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processImage(file);
  };

  const processImage = async (file) => {
    setScanImage(URL.createObjectURL(file));
    setScanLoading(true);
    setScanError('');
    setDetectedText('');
    setMatchedResults([]);

    try {
      const ocrResult = await recognizeImageText(file, ({ message }) => {
        setScanStatus(message);
      });

      if (!ocrResult.success || !ocrResult.text) {
        setScanError('Unable to identify the product. Please enter the product name manually.');
        return;
      }

      setDetectedText(ocrResult.text);

      // Extract candidate keywords from OCR detected text
      const extractedKeywords = extractKeywordsFromText(ocrResult.text);

      // Query database for matched substances
      let combinedMatches = [];
      for (const kw of extractedKeywords) {
        const res = await searchMedicine(kw);
        if (res && res.results) {
          combinedMatches = [...combinedMatches, ...res.results];
        }
      }

      // Deduplicate by substance ID
      const uniqueMatches = Array.from(new Map(combinedMatches.map(item => [item.id, item])).values());
      setMatchedResults(uniqueMatches);

      unlockBadge('badge-09', { name: 'Label Inspector', description: 'Searched or scanned a supplement label.' });
      addXP(10, 'Completed label OCR scan');

    } catch (err) {
      setScanError('Unable to identify the product. Please enter the product name manually.');
    } finally {
      setScanLoading(false);
    }
  };

  // Sample label simulation for instant testing without needing camera
  const loadSampleLabel = (sampleName) => {
    let mockText = '';
    if (sampleName === 'preworkout') {
      mockText = 'NITROX EXTREME FORMULA - Ingredients: Beta-Alanine, 1,3-Dimethylamylamine (DMAA), Caffeine Anhydrous, Yohimbine HCl, Flavoring.';
    } else if (sampleName === 'creatine') {
      mockText = 'PURE ATHLETIC SERIES - Creapure Creatine Monohydrate 100% Unflavored Powder. 5g per serving.';
    } else if (sampleName === 'decongestant') {
      mockText = 'SUDAFED SINUS RELIEF - Active Ingredient: Pseudoephedrine Hydrochloride 60mg per coated tablet.';
    }

    setDetectedText(mockText);
    const keywords = extractKeywordsFromText(mockText);
    searchMedicine(keywords[0] || '').then(res => {
      setMatchedResults(res.results || []);
    });
    unlockBadge('badge-09', { name: 'Label Inspector', description: 'Searched or scanned a supplement label.' });
  };

  const getStatusBadge = (statusLevel, statusText) => {
    if (statusLevel === 'green') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>🟢 {statusText || 'INFORMATION AVAILABLE'}</span>
        </span>
      );
    }
    if (statusLevel === 'yellow') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>🟡 {statusText || 'REQUIRES VERIFICATION'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>🔴 {statusText || 'POTENTIAL PROHIBITED-SUBSTANCE MATCH'}</span>
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          Medicine & Supplement Checker
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Search for a product or scan a product label to review available information.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="mb-6">
        <DisclaimerBanner compact />
      </div>

      {/* Mode Switch Tabs (Section 16: Search Product & Scan Product) */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('search')}
          className={`pb-3 px-6 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'search'
              ? 'border-[#0f2942] text-[#0f2942]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Search Product</span>
        </button>

        <button
          onClick={() => setActiveTab('scan')}
          className={`pb-3 px-6 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'scan'
              ? 'border-[#0f2942] text-[#0f2942]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Scan Product Label</span>
        </button>
      </div>

      {/* TAB 1: SEARCH PRODUCT */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Whey Protein, Creatine, Sudafed, Asthalin, Anavar..."
                  className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white focus:border-sky-500 transition"
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading || !searchQuery.trim()}
                className="px-6 py-3 bg-[#0f2942] hover:bg-[#183d63] disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg transition inline-flex items-center justify-center gap-2 shadow-xs"
              >
                {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Check Product</span>
              </button>
            </form>

            {/* Quick search suggestion chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium">Quick suggestions:</span>
              {['Creatine', 'Whey Protein', 'Sudafed', 'Asthalin', 'NitroX DMAA', 'Anavar'].map((name, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSearchQuery(name);
                    searchMedicine(name).then(res => {
                      setSearchResults(res.results || []);
                      setHasSearched(true);
                    });
                  }}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Results List */}
          {hasSearched && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">
                  Search Results ({searchResults.length})
                </h3>
                <span className="text-xs text-slate-500 italic">
                  Based on available anti-doping reference information
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-600">
                  <p className="font-medium mb-1">No exact product match found for "{searchQuery}".</p>
                  <p className="text-xs text-slate-500">
                    Always verify unknown dietary supplements and prescription medicines directly with your sports doctor or on Global DRO.
                  </p>
                </div>
              ) : (
                searchResults.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                          {item.category}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900">
                          {item.name}
                        </h4>
                      </div>
                      <div>
                        {getStatusBadge(item.statusLevel, item.status)}
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div>
                      <span className="text-xs font-bold text-slate-700 block mb-1">
                        Ingredients / Active Compounds:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.ingredients.map((ing, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Anti-Doping Relevance */}
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      <span className="text-xs font-bold text-slate-900 block mb-1">
                        Anti-Doping Relevance:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {item.antiDopingRelevance}
                      </p>
                    </div>

                    {/* Warnings */}
                    <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50">
                      <span className="text-xs font-bold text-amber-950 block mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        Warnings & Athlete Caution:
                      </span>
                      <p className="text-xs text-amber-900 leading-relaxed">
                        {item.warnings}
                      </p>
                    </div>

                    {/* Source & Safe statement */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-1">
                      <span>Source: {item.source}</span>
                      <span className="italic font-medium mt-1 sm:mt-0">
                        *Never assume 100% safe. Always verify batch certification.
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SCAN PRODUCT LABEL (OCR) */}
      {activeTab === 'scan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Upload Product Label Photo
              </h3>
              <p className="text-xs text-slate-600">
                Upload a clear image of the nutrition facts or active ingredients panel.
              </p>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-slate-400 transition bg-slate-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="label-file-input"
                className="hidden"
              />
              <label htmlFor="label-file-input" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-sm font-semibold text-[#0f2942]">Click to upload label image</span>
                <span className="text-xs text-slate-500 mt-1">PNG, JPG, or WEBP up to 10MB</span>
              </label>
            </div>

            {/* Quick Demo Test Buttons */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2">
                Or test instantly with pre-loaded sample label text:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => loadSampleLabel('preworkout')}
                  className="px-3 py-1.5 rounded-md border border-slate-200 bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition"
                >
                  ⚡ Sample High-Risk Pre-Workout Label
                </button>
                <button
                  type="button"
                  onClick={() => loadSampleLabel('creatine')}
                  className="px-3 py-1.5 rounded-md border border-slate-200 bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition"
                >
                  🥛 Sample Pure Creatine Monohydrate Label
                </button>
                <button
                  type="button"
                  onClick={() => loadSampleLabel('decongestant')}
                  className="px-3 py-1.5 rounded-md border border-slate-200 bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition"
                >
                  💊 Sample Cold / Sudafed Label
                </button>
              </div>
            </div>

            {/* Progress / Status */}
            {scanLoading && (
              <div className="p-4 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-sky-600 shrink-0" />
                <div>
                  <p className="font-semibold">Tesseract.js OCR Engine Active</p>
                  <p className="text-sky-700">{scanStatus || 'Reading image pixels...'}</p>
                </div>
              </div>
            )}

            {/* Error handling (Section 18) */}
            {scanError && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs">
                <p className="font-semibold">{scanError}</p>
                <p className="mt-1">OCR can make mistakes. Verify the information before making health or anti-doping decisions.</p>
              </div>
            )}
          </div>

          {/* Detected OCR Text & Matched Substances */}
          {detectedText && (
            <div className="space-y-6">
              {/* Detected Text Box */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-600" />
                  Detected Label Text
                </h3>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {detectedText}
                </div>
                <p className="text-[11px] text-slate-500 mt-2 italic">
                  *OCR can make mistakes. Verify the information before making health or anti-doping decisions.
                </p>
              </div>

              {/* Matched Substances */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Identified Active Compounds ({matchedResults.length})
                </h3>

                {matchedResults.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-xs text-slate-600">
                    No prohibited substances or known risk markers flagged in the detected text. However, unlisted proprietary blends may still exist. Always check third-party batch certification seals.
                  </div>
                ) : (
                  matchedResults.map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                            {item.category}
                          </span>
                          <h4 className="text-lg font-bold text-slate-900">
                            {item.name}
                          </h4>
                        </div>
                        <div>
                          {getStatusBadge(item.statusLevel, item.status)}
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-700">
                        <strong className="block text-slate-900 mb-1">Anti-Doping Information:</strong>
                        {item.antiDopingRelevance}
                      </div>

                      <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50 text-xs text-amber-900">
                        <strong className="block text-amber-950 mb-1">Warnings:</strong>
                        {item.warnings}
                      </div>

                      <div className="text-xs text-slate-500">
                        Source: {item.source}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { createWorker } from 'tesseract.js';

/**
 * Recognizes text from an image file using Tesseract.js
 * @param {File|Blob|string} imageSource
 * @param {Function} onProgress Callback for status/percentage updates
 * @returns {Promise<{text: string, confidence: number}>}
 */
export async function recognizeImageText(imageSource, onProgress = () => {}) {
  let worker = null;
  try {
    onProgress({ status: 'initializing', progress: 0.1, message: 'Initializing OCR scanner engine...' });
    
    worker = await createWorker('eng');

    onProgress({ status: 'processing', progress: 0.4, message: 'Analyzing label typography...' });

    const ret = await worker.recognize(imageSource);
    
    onProgress({ status: 'finishing', progress: 0.9, message: 'Extracting ingredient text...' });
    
    await worker.terminate();

    const rawText = ret.data.text || '';
    const confidence = ret.data.confidence || 0;

    return {
      success: true,
      text: rawText.trim(),
      confidence
    };
  } catch (err) {
    console.error('OCR scanning error:', err);
    if (worker) {
      try { await worker.terminate(); } catch (e) {}
    }
    return {
      success: false,
      text: '',
      confidence: 0,
      error: 'Unable to identify the product. Please enter the product name manually.'
    };
  }
}

/**
 * Extracts potential ingredient or substance names from OCR text
 */
export function extractKeywordsFromText(text) {
  if (!text) return [];
  const normalized = text.toLowerCase();
  
  // List of high-value substances to detect
  const candidateKeywords = [
    'creatine',
    'whey',
    'protein',
    'dmaa',
    'dimethylamylamine',
    'geranamine',
    'pseudoephedrine',
    'ephedrine',
    'salbutamol',
    'albuterol',
    'oxandrolone',
    'anavar',
    'ostarine',
    'sarm',
    'modafinil',
    'ashwagandha',
    'vitamin d',
    'clenbuterol',
    'taurine',
    'caffeine',
    'epo',
    'erythropoietin',
    'paracetamol',
    'acetaminophen',
    'xylometazoline',
    'synephrine',
    'yohimbine'
  ];

  const detected = [];
  for (const kw of candidateKeywords) {
    if (normalized.includes(kw)) {
      detected.push(kw);
    }
  }

  return detected;
}

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Send, ArrowLeft, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { sendChatMessage } from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';

const SUGGESTED_QUESTIONS = [
  "What is doping?",
  "Why can supplements be risky?",
  "What is a prohibited substance?",
  "What should I check before using a supplement?",
  "What is TUE?",
  "How can I make safer choices?"
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am the Play2Protect Educational AI Assistant. I can help answer questions about the WADA Prohibited List, supplement risks, Therapeutic Use Exemptions (TUE), and clean sport decisions.\n\nWhat would you like to ask today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend = input) => {
    const query = textToSend.trim();
    if (!query || loading) return;

    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));

      const res = await sendChatMessage(query, historyPayload);
      if (res && res.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.reply }]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: "I'm having trouble retrieving that answer right now. Please verify your connection or try another topic."
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "A temporary connection issue occurred. Please try asking again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Conversation refreshed. Ask any question about sports integrity, supplements, or banned substances."
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation & Header */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              Ask Play2Protect AI
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Ask questions about anti-doping, drug awareness and supplements.
            </p>
          </div>
          <button
            onClick={handleClear}
            className="self-start sm:self-auto text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-100 transition inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="mb-6">
        <DisclaimerBanner compact />
      </div>

      {/* Chat Conversation Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[560px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#0f2942] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-3.5 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#0f2942] text-white'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-[#0f2942] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-sm text-slate-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse delay-150"></div>
                <span className="text-xs ml-1">Consulting anti-doping guidelines...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions Pills (Section 11) */}
        <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2.5">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Suggested Questions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="text-xs bg-white hover:bg-sky-50 hover:text-sky-800 hover:border-sky-300 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition text-left disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-200 p-3 sm:p-4 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question..."
              className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white focus:border-sky-500 transition"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-[#0f2942] hover:bg-[#183d63] disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg transition inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

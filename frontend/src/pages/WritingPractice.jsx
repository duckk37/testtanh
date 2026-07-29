import React, { useState, useEffect } from 'react';
import { PenTool, CheckCircle, RefreshCcw, AlertTriangle, Target } from 'lucide-react';
import api from '../services/api';

export default function WritingPractice() {
  const [text, setText] = useState(() => {
    return localStorage.getItem('writing_draft') || '';
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Auto-save draft
  useEffect(() => {
    localStorage.setItem('writing_draft', text);
  }, [text]);

  // Calculations
  const wordCount = text.trim().split(/\s+/).filter(x => x).length;
  const charCount = text.length;
  const readingTime = Math.ceil(wordCount / 150); // assuming 150 words per minute

  const handleCheck = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/api/check-writing', { text });
      setResult(res.data);
    } catch (e) {
      alert('Có lỗi xảy ra khi kiểm tra.');
    }
    setLoading(false);
  };

  const applySuggestion = (original, suggestion) => {
    const newText = text.replace(new RegExp(`\\b${original}\\b`, 'gi'), suggestion);
    setText(newText);
    
    // update result mistakes locally to remove the applied one
    if (result) {
      setResult({
        ...result,
        mistakes: result.mistakes.filter(m => m.original !== original)
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <PenTool size={32} className="text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Luyện viết AI</h1>
        <p className="text-slate-600 dark:text-slate-300">Luyện tập kỹ năng viết, AI sẽ giúp bạn kiểm tra lỗi chính tả.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft dark:shadow-none border border-slate-200 dark:border-slate-700 overflow-hidden">
            <textarea
              className="w-full h-64 p-6 focus:outline-none resize-none text-slate-700 dark:text-slate-200 leading-relaxed"
              placeholder="Hãy viết một đoạn văn bằng tiếng Anh về chủ đề bất kỳ..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="bg-slate-50 dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span>{wordCount} từ</span>
                <span>{charCount} ký tự</span>
                <span>Đọc ~{readingTime} phút</span>
              </div>
              <button
                onClick={handleCheck}
                disabled={loading || !text.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-2 px-6 rounded-xl transition-colors flex items-center gap-2"
              >
                {loading ? <RefreshCcw className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                Kiểm tra lỗi
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft dark:shadow-none border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Target size={20} className="text-blue-500" /> Kết quả phân tích
            </h2>
            
            {!result ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-8">Hãy viết và bấm kiểm tra để xem kết quả.</p>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Độ phong phú</p>
                    <p className="text-xl font-bold text-blue-600">{result.stats.lexical_diversity}%</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Số lỗi</p>
                    <p className={`text-xl font-bold ${result.mistakes.length === 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {result.mistakes.length}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} className={result.mistakes.length > 0 ? "text-amber-500" : "text-green-500"} /> 
                    {result.mistakes.length > 0 ? "Gợi ý sửa lỗi" : "Hoàn hảo! Không có lỗi."}
                  </h3>
                  
                  {result.mistakes.length > 0 && (
                    <div className="space-y-3">
                      {result.mistakes.map((m, idx) => (
                        <div key={idx} className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm">
                          <p className="mb-2">Sai: <span className="line-through text-slate-500 dark:text-slate-400">{m.original}</span> ➔ <strong className="text-emerald-600">{m.suggestion}</strong></p>
                          <button 
                            onClick={() => applySuggestion(m.original, m.suggestion)}
                            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 py-1 px-3 rounded-lg text-xs font-bold w-full transition-colors"
                          >
                            Áp dụng sửa
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// Note: Import Target from lucide-react (missed in import list)

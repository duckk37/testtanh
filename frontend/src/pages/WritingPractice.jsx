import React, { useState } from 'react';
import { PenTool, CheckCircle, RefreshCcw, AlertTriangle, Target } from 'lucide-react';
import { API_URL } from '../config';

export default function WritingPractice() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/check-writing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        alert('Có lỗi xảy ra khi kiểm tra.');
      }
    } catch (e) {
      alert('Không kết nối được server.');
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
        <p className="text-slate-600">Luyện tập kỹ năng viết, AI sẽ giúp bạn kiểm tra lỗi chính tả.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-soft border border-slate-200 overflow-hidden">
            <textarea
              className="w-full h-64 p-6 focus:outline-none resize-none text-slate-700 leading-relaxed"
              placeholder="Hãy viết một đoạn văn bằng tiếng Anh về chủ đề bất kỳ..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center">
              <div className="text-sm text-slate-500 font-medium">
                {text.trim().split(/\s+/).filter(x => x).length} từ
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
          <div className="bg-white rounded-2xl shadow-soft border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Target size={20} className="text-blue-500" /> Kết quả phân tích
            </h2>
            
            {!result ? (
              <p className="text-slate-500 text-sm text-center py-8">Hãy viết và bấm kiểm tra để xem kết quả.</p>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Độ phong phú</p>
                    <p className="text-xl font-bold text-blue-600">{result.stats.lexical_diversity}%</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Số lỗi</p>
                    <p className={`text-xl font-bold ${result.mistakes.length === 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {result.mistakes.length}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} className={result.mistakes.length > 0 ? "text-amber-500" : "text-green-500"} /> 
                    {result.mistakes.length > 0 ? "Gợi ý sửa lỗi" : "Hoàn hảo! Không có lỗi."}
                  </h3>
                  
                  {result.mistakes.length > 0 && (
                    <div className="space-y-3">
                      {result.mistakes.map((m, idx) => (
                        <div key={idx} className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm">
                          <p className="mb-2">Sai: <span className="line-through text-slate-500">{m.original}</span> ➔ <strong className="text-emerald-600">{m.suggestion}</strong></p>
                          <button 
                            onClick={() => applySuggestion(m.original, m.suggestion)}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 py-1 px-3 rounded-lg text-xs font-bold w-full transition-colors"
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

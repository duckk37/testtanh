import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function LessonTest({ lesson, onTestPassed }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const { user } = useAuth();
  
  const resetTest = () => {
    setResult(null);
    setAnswers({});
  };

  useEffect(() => {
    if (!lesson.exam_id) return;
    
    fetch(`http://localhost:8000/exams/${lesson.exam_id}/questions`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching questions:", err);
        setLoading(false);
      });
  }, [lesson.exam_id]);

  const handleOptionSelect = (questionId, optionKey) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const token = localStorage.getItem('access_token');
    
    try {
      const res = await fetch(`http://localhost:8000/lessons/${lesson.id}/submit-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      });
      
      const data = await res.json();
      setResult(data);
      
      if (data.is_passed) {
        onTestPassed();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!lesson.exam_id) {
    return <div className="p-10 text-center text-slate-500">Bài học này không có bài kiểm tra.</div>;
  }

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Đang tải câu hỏi...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-4">Bài kiểm tra: {lesson.title}</h2>
      
      {result ? (
        <div className="text-center py-12 px-4">
          <div className={`flex justify-center mb-6 animate-bounce`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${result.is_passed ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
              {result.is_passed ? <CheckCircle2 size={56} /> : <AlertCircle size={56} />}
            </div>
          </div>
          <h3 className="text-3xl font-extrabold mb-3 text-slate-800">
            {result.is_passed ? 'Tuyệt vời! Bạn đã vượt qua' : 'Rất tiếc! Bạn chưa đạt'}
          </h3>
          <p className="text-xl text-slate-600 mb-6">Điểm của bạn: <span className={`font-black text-3xl ${result.is_passed ? 'text-green-600' : 'text-red-600'}`}>{result.score}%</span></p>
          
          <div className="flex justify-center gap-6 text-sm text-slate-500 mb-8">
            <span className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">Điểm yêu cầu: <strong>{lesson.passing_score_required}%</strong></span>
            <span className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">Cao nhất: <strong>{result.highest_score}%</strong></span>
          </div>
          
          {result.is_passed ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 inline-block">
              <p className="text-green-700 font-bold text-lg">🎉 Chúc mừng! Bạn đã mở khóa bài học tiếp theo.</p>
            </div>
          ) : (
            <button 
              onClick={resetTest}
              className="mt-2 px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 hover:scale-105 transition-all shadow-md"
            >
              Làm lại bài kiểm tra
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium">Lưu ý trước khi làm bài</p>
              <p className="text-sm mt-1">Bạn cần đạt tối thiểu <strong>{lesson.passing_score_required}%</strong> để mở khóa bài học tiếp theo.</p>
            </div>
          </div>
          {questions.map((q, index) => (
            <div key={q.id} className="p-6 border border-slate-100 rounded-2xl bg-white shadow-soft">
              <h3 className="font-bold text-lg mb-6 text-slate-800">
                <span className="text-blue-600 mr-2 bg-blue-50 px-3 py-1 rounded-lg">Câu {index + 1}</span>
                {q.content}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map(opt => {
                  const optionText = q[`option_${opt.toLowerCase()}`];
                  const isSelected = answers[q.id] === opt;
                  
                  return (
                    <button 
                      key={opt}
                      onClick={() => handleOptionSelect(q.id, opt)}
                      className={`text-left px-6 py-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 group flex items-center gap-3 ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold ring-4 ring-blue-100 shadow-sm' 
                          : 'bg-white hover:bg-blue-50/50 border-slate-200 hover:border-blue-400 text-slate-700'
                      }`}
                    >
                      <span className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 text-sm transition-colors ${isSelected ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-300 text-slate-500 group-hover:border-blue-400 group-hover:text-blue-600'}`}>
                          {opt}
                      </span>
                      <span className="text-lg">{optionText}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          
          <button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length < questions.length}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Đang nộp bài...' : 'Nộp bài & Hoàn thành'}
          </button>
        </div>
      )}
    </div>
  );
}

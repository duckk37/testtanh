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
        <div className="text-center py-8">
          <div className={`flex justify-center mb-4 ${result.is_passed ? 'text-green-500' : 'text-red-500'}`}>
            {result.is_passed ? <CheckCircle2 size={48} /> : <AlertCircle size={48} />}
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {result.is_passed ? 'Tuyệt vời! Bạn đã vượt qua' : 'Rất tiếc! Bạn chưa đạt'}
          </h3>
          <p className="text-lg">Điểm của bạn: <span className={`font-bold ${result.is_passed ? 'text-green-600' : 'text-red-600'}`}>{result.score}%</span></p>
          <p className="text-sm text-slate-500 mt-1">Điểm yêu cầu: {lesson.passing_score_required}%</p>
          <p className="text-sm text-slate-500 mt-1">Điểm cao nhất: {result.highest_score}% | Số lần thử: {result.attempts}</p>
          
          {result.is_passed ? (
            <p className="mt-4 text-green-600 font-medium">Bạn đã hoàn thành bài học này và mở khóa bài tiếp theo.</p>
          ) : (
            <button 
              onClick={resetTest}
              className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
            <div key={q.id} className="p-4 border rounded-lg bg-slate-50">
              <p className="font-medium mb-3">Câu {index + 1}: {q.content}</p>
              <div className="space-y-2">
                {['A', 'B', 'C', 'D'].map(opt => {
                  const optionText = q[`option_${opt.toLowerCase()}`];
                  const isSelected = answers[q.id] === opt;
                  
                  return (
                    <label 
                      key={opt}
                      className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name={`question-${q.id}`} 
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                        checked={isSelected}
                        onChange={() => handleOptionSelect(q.id, opt)}
                      />
                      <span className="font-medium mr-2">{opt}.</span> {optionText}
                    </label>
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

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle, XCircle } from 'lucide-react';

function ExamDetail() {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8000/exams/${examId}/questions`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching questions:", err);
        setLoading(false);
      });
  }, [examId]);

  const handleSelectOption = (questionId, option) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = () => {
    let currentScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_option) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setSubmitted(true);
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Đang tải đề thi...</div>;
  }

  if (questions.length === 0) {
    return <div className="p-10 text-center text-slate-500">Đề thi này chưa có câu hỏi nào.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-500 hover:text-blue-600 transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="font-bold text-xl text-slate-900">Làm Đề Thi Thử</h1>
          </div>
          {submitted && (
            <div className="px-4 py-2 bg-green-50 text-green-700 font-bold rounded-lg border border-green-200">
              Điểm số: {score} / {questions.length}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-semibold text-lg text-slate-900 mb-4">
                <span className="text-blue-600 mr-2">Câu {index + 1}:</span>
                {q.content}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map(opt => {
                  const optionText = q[`option_${opt.toLowerCase()}`];
                  const isSelected = answers[q.id] === opt;
                  const isCorrect = q.correct_option === opt;
                  
                  let optionClass = "border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700";
                  
                  if (isSelected && !submitted) {
                    optionClass = "border-blue-600 bg-blue-50 text-blue-700 font-medium";
                  } else if (submitted) {
                    if (isCorrect) {
                      optionClass = "border-green-500 bg-green-50 text-green-700 font-medium";
                    } else if (isSelected && !isCorrect) {
                      optionClass = "border-red-500 bg-red-50 text-red-700 font-medium";
                    } else {
                      optionClass = "border-slate-200 text-slate-400 opacity-70";
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(q.id, opt)}
                      disabled={submitted}
                      className={`text-left px-4 py-3 border-2 rounded-lg transition-colors flex items-center justify-between ${optionClass}`}
                    >
                      <span>
                        <span className="font-bold mr-2">{opt}.</span>
                        {optionText}
                      </span>
                      {submitted && isCorrect && <CheckCircle size={20} className="text-green-500" />}
                      {submitted && isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!submitted && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
            >
              Nộp Bài
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ExamDetail;

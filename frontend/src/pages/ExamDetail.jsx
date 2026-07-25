import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import { SkeletonExam } from '../components/Skeleton';
import { API_URL } from '../config';

function ExamDetail() {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  
  const timerRef = React.useRef(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/exams/${examId}`).then(res => res.json()),
      fetch(`${API_URL}/exams/${examId}/questions`).then(res => res.json())
    ])
    .then(([examData, questionsData]) => {
      setExam(examData);
      setQuestions(questionsData);
      if (examData.duration_minutes) {
        setTimeLeft(examData.duration_minutes * 60);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching exam/questions:", err);
      setLoading(false);
    });
  }, [examId]);

  useEffect(() => {
    if (timeLeft === null || submitted) return;
    
    if (timeLeft <= 0) {
      alert("Hết thời gian làm bài! Hệ thống sẽ tự động nộp bài.");
      handleSubmit(true);
      return;
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timerRef.current);
  }, [timeLeft, submitted]);

  const handleSelectOption = (questionId, option) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = (force = false) => {
    if (!force) {
      const unanswered = questions.filter(q => !answers[q.id]).length;
      if (unanswered > 0) {
        if (!window.confirm(`Bạn còn ${unanswered} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài?`)) {
          return;
        }
      } else {
        if (!window.confirm("Bạn có chắc chắn muốn nộp bài?")) return;
      }
    }

    if (timerRef.current) clearInterval(timerRef.current);

    let currentScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_option) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setSubmitted(true);
  };
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return <SkeletonExam />;
  }

  if (questions.length === 0) {
    return <div className="p-10 text-center text-slate-500 dark:text-slate-400">Đề thi này chưa có câu hỏi nào.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="font-bold text-xl text-slate-900 dark:text-slate-100">{exam?.title || "Làm Đề Thi Thử"}</h1>
          </div>
          
          {!submitted && timeLeft !== null && (
            <div className={`font-mono font-bold text-lg px-4 py-2 rounded-lg border ${timeLeft <= 60 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'}`}>
              {formatTime(timeLeft)}
            </div>
          )}
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
            <div key={q.id} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-700/50">
              <h3 className="font-bold text-xl text-slate-800 mb-6">
                <span className="text-blue-600 mr-2 bg-blue-50 px-3 py-1 rounded-lg">Câu {index + 1}</span>
                {q.content}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map(opt => {
                  const optionText = q[`option_${opt.toLowerCase()}`];
                  const isSelected = answers[q.id] === opt;
                  const isCorrect = q.correct_option === opt;
                  
                  let optionClass = "border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800";
                  
                  if (isSelected && !submitted) {
                    optionClass = "border-blue-500 bg-blue-50 text-blue-700 font-bold ring-4 ring-blue-100 shadow-sm";
                  } else if (submitted) {
                    if (isCorrect) {
                      optionClass = "border-green-500 bg-green-50 text-green-700 font-bold ring-4 ring-green-100";
                    } else if (isSelected && !isCorrect) {
                      optionClass = "border-red-500 bg-red-50 text-red-700 font-bold ring-4 ring-red-100";
                    } else {
                      optionClass = "border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(q.id, opt)}
                      disabled={submitted}
                      className={`text-left px-6 py-4 border-2 rounded-2xl transition-all duration-200 flex items-center justify-between group ${optionClass}`}
                    >
                      <span className="text-lg flex items-center gap-3">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 text-sm transition-colors ${isSelected && !submitted ? 'border-blue-500 bg-blue-600 text-white' : submitted && isCorrect ? 'border-green-500 bg-green-600 text-white' : submitted && isSelected && !isCorrect ? 'border-red-500 bg-red-600 text-white' : 'border-slate-300 text-slate-500 dark:text-slate-400 group-hover:border-blue-400 group-hover:text-blue-600'}`}>
                          {opt}
                        </span>
                        {optionText}
                      </span>
                      {submitted && isCorrect && <CheckCircle size={24} className="text-green-500 drop-shadow-sm" />}
                      {submitted && isSelected && !isCorrect && <XCircle size={24} className="text-red-500 drop-shadow-sm" />}
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

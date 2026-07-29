import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Flag, Clock, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { API_URL } from '../config';
import api from '../services/api';

export default function LessonTest({ lesson, onTestPassed }) {
  const [questions, setQuestions] = useState([]);
  const [exam, setExam] = useState(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  
  const [timeLeft, setTimeLeft] = useState(null); // seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const { user } = useAuth();
  
  const timerRef = useRef(null);

  const resetTest = () => {
    setResult(null);
    setShowReview(false);
    setAnswers({});
    setFlags({});
    setCurrentQuestionIndex(0);
    if (exam && exam.duration_minutes) {
      setTimeLeft(exam.duration_minutes * 60);
    }
  };

  useEffect(() => {
    if (!lesson.exam_id) return;
    
    // Fetch Exam Details & Questions
    Promise.all([
      api.get(`/exams/${lesson.exam_id}`).then(r => r.data),
      api.get(`/exams/${lesson.exam_id}/questions`).then(r => r.data)
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
  }, [lesson.exam_id]);

  // Timer Effect
  useEffect(() => {
    if (timeLeft === null || result !== null || submitting) return;
    
    if (timeLeft <= 0) {
      alert("Hết thời gian làm bài! Hệ thống sẽ tự động nộp bài.");
      handleSubmit(true);
      return;
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timerRef.current);
  }, [timeLeft, result, submitting]);

  const handleOptionSelect = (questionId, optionKey) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };
  
  const toggleFlag = (questionId) => {
    setFlags(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleSubmit = async (force = false) => {
    // Validate if not forced (manual submit)
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
    
    setSubmitting(true);
    
    try {
      const res = await api.post(`/lessons/${lesson.id}/submit-test`, { answers });
      const data = res.data;
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
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!lesson.exam_id) {
    return <div className="p-10 text-center text-slate-500 dark:text-slate-400">Bài học này không có bài kiểm tra.</div>;
  }

  if (loading) {
    return <div className="p-10 text-center text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      Đang tải dữ liệu bài kiểm tra...
    </div>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
      
      {/* Result View */}
      {result ? (
        <div className="text-center py-12 px-4 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-center mb-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${result.is_passed ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
              {result.is_passed ? <CheckCircle2 size={56} /> : <AlertCircle size={56} />}
            </div>
          </div>
          <h3 className="text-3xl font-extrabold mb-3 text-slate-800">
            {result.is_passed ? 'Tuyệt vời! Bạn đã vượt qua' : 'Rất tiếc! Bạn chưa đạt'}
          </h3>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">Điểm của bạn: <span className={`font-black text-4xl ${result.is_passed ? 'text-green-600' : 'text-red-600'}`}>{result.score}%</span></p>
          
          <div className="flex justify-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-8">
            <span className="bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-700/50 shadow-sm">Điểm yêu cầu: <strong className="text-slate-800">{lesson.passing_score_required}%</strong></span>
            <span className="bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-700/50 shadow-sm">Kỷ lục của bạn: <strong className="text-slate-800">{result.highest_score}%</strong></span>
          </div>
          
          {result.is_passed ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 inline-block shadow-sm">
              <p className="text-green-700 font-bold text-lg">🎉 Chúc mừng! Bạn đã mở khóa bài học tiếp theo.</p>
            </div>
          ) : (
            <button 
              onClick={resetTest}
              className="mt-2 px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 hover:scale-105 transition-all shadow-md active:scale-95"
            >
              Thử sức làm lại
            </button>
          )}

          <div className="mt-8 border-t border-slate-100 dark:border-slate-700/50 pt-8">
            <button 
              onClick={() => setShowReview(!showReview)}
              className="px-6 py-2 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:bg-slate-900 transition-colors"
            >
              {showReview ? 'Ẩn chi tiết bài làm' : 'Xem lại chi tiết bài làm'}
            </button>
            
            {showReview && (
              <div className="mt-8 text-left space-y-6">
                {questions.map((q, idx) => {
                  const selectedOpt = answers[q.id];
                  const correctOpt = q.correct_option;
                  const isCorrect = selectedOpt === correctOpt;
                  
                  return (
                    <div key={q.id} className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                      <h4 className="font-bold text-slate-800 mb-4 flex gap-2">
                        <span className="text-slate-500 dark:text-slate-400">Câu {idx + 1}:</span> {q.content}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.question_type === 'fill_in_blank' ? (
                          <div className="col-span-full">
                            <div className="px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                              <span className="text-sm font-bold text-slate-500 mr-2">Câu trả lời của bạn:</span>
                              <span className="text-slate-800 dark:text-slate-200">{selectedOpt || '(Bỏ trống)'}</span>
                            </div>
                            <div className="mt-2 px-4 py-3 rounded-lg border-2 border-green-500 bg-green-50">
                              <span className="text-sm font-bold text-green-700 mr-2">Đáp án đúng:</span>
                              <span className="text-green-800 font-medium">{correctOpt}</span>
                            </div>
                          </div>
                        ) : (
                          ['A', 'B', 'C', 'D'].map(opt => {
                            const optText = q[`option_${opt.toLowerCase()}`];
                            if (!optText) return null;
                            let optClass = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300";
                            
                            if (opt === correctOpt) {
                              optClass = "border-green-500 bg-green-50 text-green-700 font-bold ring-2 ring-green-200";
                            } else if (opt === selectedOpt && !isCorrect) {
                              optClass = "border-red-500 bg-red-50 text-red-700 font-bold ring-2 ring-red-200";
                            } else if (opt !== selectedOpt && opt !== correctOpt) {
                              optClass = "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-400 opacity-60";
                            }
                            
                            return (
                              <div key={opt} className={`px-4 py-3 rounded-lg border-2 flex items-center gap-3 ${optClass}`}>
                                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs border font-bold ${
                                  opt === correctOpt ? 'bg-green-500 border-green-600 text-white' :
                                  opt === selectedOpt && !isCorrect ? 'bg-red-500 border-red-600 text-white' :
                                  'bg-slate-100 border-slate-300'
                                }`}>{opt}</span>
                                <span className="text-sm">{optText}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                      {!isCorrect && q.question_type !== 'fill_in_blank' && (
                        <div className="mt-3 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle size={16} /> Bạn đã chọn sai. Đáp án đúng là {correctOpt}.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Exam In Progress View */
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Question Area */}
          <div className="flex-1 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 line-clamp-1">{exam?.title || lesson.title}</h2>
              {/* Timer Mobile (visible on small screens) */}
              <div className="lg:hidden bg-red-50 text-red-600 font-mono font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Clock size={16} /> {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
              ></div>
            </div>

            {questions.length > 0 && (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-bold text-lg text-slate-800 flex gap-3">
                      <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-lg shrink-0">
                        Câu {currentQuestionIndex + 1}
                      </span>
                      <span className="mt-1 leading-relaxed whitespace-pre-line">{questions[currentQuestionIndex].content}</span>
                    </h3>
                    
                    {questions[currentQuestionIndex].image_url && (
                      <div className="mb-6 flex justify-center bg-slate-50 rounded-xl p-4">
                        <img 
                          src={`${API_URL}${questions[currentQuestionIndex].image_url}`} 
                          alt="Question" 
                          className="max-h-64 object-contain rounded-lg shadow-sm border border-slate-200"
                        />
                      </div>
                    )}
                    <button 
                      onClick={() => toggleFlag(questions[currentQuestionIndex].id)}
                      className={`p-2 rounded-lg transition-colors ml-4 shrink-0 border ${
                        flags[questions[currentQuestionIndex].id] 
                          ? 'bg-orange-50 border-orange-200 text-orange-500' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:bg-slate-900'
                      }`}
                      title="Cắm cờ xem lại"
                    >
                      <Flag size={20} className={flags[questions[currentQuestionIndex].id] ? "fill-orange-500" : ""} />
                    </button>
                  </div>

                  {questions[currentQuestionIndex].question_type === 'fill_in_blank' ? (
                    <div className="mb-8">
                      <input 
                        type="text" 
                        value={answers[questions[currentQuestionIndex].id] || ''}
                        onChange={(e) => handleOptionSelect(questions[currentQuestionIndex].id, e.target.value)}
                        placeholder="Nhập câu trả lời của bạn..."
                        className="w-full px-6 py-4 text-lg border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none transition-all shadow-sm"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 mb-8">
                      {['A', 'B', 'C', 'D'].map(opt => {
                        const q = questions[currentQuestionIndex];
                        const optionText = q[`option_${opt.toLowerCase()}`];
                        if (!optionText) return null;
                        const isSelected = answers[q.id] === opt;
                        
                        return (
                          <button 
                            key={opt}
                            onClick={() => handleOptionSelect(q.id, opt)}
                            className={`text-left px-6 py-4 border-2 rounded-xl cursor-pointer transition-all duration-200 group flex items-center gap-4 ${
                              isSelected 
                                ? 'bg-blue-50/50 border-blue-500 text-slate-900 dark:text-slate-100 shadow-sm' 
                                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <span className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 text-sm font-bold transition-colors shrink-0 ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-500 text-white' 
                                : 'border-slate-300 text-slate-500 dark:text-slate-400 group-hover:border-slate-400'
                            }`}>
                                {opt}
                            </span>
                            <span className="text-[1.05rem] leading-relaxed">{optionText}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-700/50">
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft size={20} /> Trước
                  </button>
                  
                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                      className="flex items-center gap-1 px-5 py-2.5 rounded-xl font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      Tiếp theo <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubmit(false)}
                      disabled={submitting}
                      className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:bg-slate-300 transition-all shadow-sm"
                    >
                      {submitting ? 'Đang nộp...' : 'Nộp bài ngay'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar (Timer & Grid) */}
          <div className="w-full lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 pt-6 lg:pt-0 lg:pl-8 flex flex-col gap-6">
            
            {/* Timer Desktop */}
            <div className="hidden lg:flex bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex-col items-center justify-center shadow-sm">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Thời gian còn lại</span>
              <div className={`font-mono text-4xl font-black ${timeLeft <= 60 && timeLeft !== null ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
                {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
              </div>
            </div>

            {/* Question Grid */}
            <div className="bg-white dark:bg-slate-800 lg:bg-slate-50 dark:bg-slate-900 lg:border border-slate-200 dark:border-slate-700 rounded-2xl lg:p-5 flex-1">
              <div className="flex items-center gap-2 mb-4">
                <LayoutGrid size={18} className="text-slate-500 dark:text-slate-400" />
                <h3 className="font-bold text-slate-700 dark:text-slate-200">Danh sách câu hỏi</h3>
              </div>
              
              <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = currentQuestionIndex === idx;
                  const isFlagged = flags[q.id];
                  
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`relative h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${
                        isCurrent ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                      } ${
                        isAnswered 
                          ? 'bg-blue-100 text-blue-700 border-blue-200' 
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-900'
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 space-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200"></div> Đã trả lời
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"></div> Chưa trả lời
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500 border border-white"></div> Cắm cờ xem lại
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/60 lg:hidden">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors"
                >
                  Nộp bài kết thúc
                </button>
              </div>
            </div>
            
          </div>
          
        </div>
      )}
    </div>
  );
}

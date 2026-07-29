import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Brain, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const loadingTexts = [
  "Đang thu thập kết quả bài làm...",
  "Đang chấm điểm...",
  "AI đang phân tích điểm mạnh, điểm yếu...",
  "Đang tổng hợp dữ liệu ngữ pháp...",
  "Đang thiết kế Lộ trình học 7 ngày riêng cho bạn..."
];

export default function PlacementTest() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const fetchQuestions = async () => {
    const res = await api.get('/learning-path/placement-questions');
    return res.data;
  };

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['placement_questions'],
    queryFn: fetchQuestions
  });

  const generateMutation = useMutation({
    mutationFn: async (submitAnswers) => {
      try {
        const res = await api.post('/learning-path/generate', { answers: submitAnswers });
        return res.data;
      } catch (error) {
        throw new Error(error.response?.data?.detail || 'Generation failed');
      }
    },
    onSuccess: (data) => {
      navigate('/roadmap', { state: { level: data.level } });
    }
  });

  // Cycle through loading texts when mutation is pending
  useEffect(() => {
    let interval;
    if (generateMutation.isPending) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [generateMutation.isPending]);

  const handleSelect = (optionKey) => {
    if (!questions[currentQuestion]) return;
    
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: optionKey
    }));

    // Auto-advance after a short delay if it's not the last question
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(curr => curr + 1);
      }, 600);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    } else {
      generateMutation.mutate(answers);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full mb-4"
        />
        <p className="text-slate-500 font-medium">Đang chuẩn bị bài kiểm tra...</p>
      </div>
    );
  }

  if (generateMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center p-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Sparkles size={72} className="text-emerald-500 mb-8" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
          Phân tích kết quả
        </h2>
        
        <AnimatePresence mode="wait">
          <motion.p 
            key={loadingTextIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-lg text-emerald-600 dark:text-emerald-400 font-medium h-8"
          >
            {loadingTexts[loadingTextIndex]}
          </motion.p>
        </AnimatePresence>
        
        <div className="w-64 h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-8 overflow-hidden">
          <motion.div 
            className="h-full bg-emerald-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 10, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 mt-4 md:mt-8 flex flex-col min-h-[calc(100vh-8rem)] md:min-h-0">
      {/* Header & Progress */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 shrink-0"
      >
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
          <Brain size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">Kiểm Tra Đầu Vào</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Hoàn thành vài câu hỏi ngắn để AI đánh giá trình độ và xây dựng lộ trình học cho bạn.
        </p>
        
        <div className="mt-8">
          <div className="flex justify-between text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">
            <span>Câu {currentQuestion + 1} / {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
            <motion.div 
              className="bg-blue-600 h-full rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Question Card */}
      <div className="relative overflow-visible flex-1 flex flex-col justify-center min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
          >
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 leading-relaxed">
                {question?.text}
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {question && Object.entries(question.options).map(([key, value]) => {
                  const isSelected = answers[question.id] === key;
                  return (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      key={key}
                      onClick={() => handleSelect(key)}
                      className={`relative py-4 px-6 rounded-2xl border-2 text-lg font-medium transition-all text-left overflow-hidden ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-500 shadow-sm' 
                          : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:border-blue-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mr-4 font-bold text-sm ${
                          isSelected ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                          {key}
                        </span>
                        <span>{value}</span>
                      </div>
                      
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500"
                        >
                          <CheckCircle2 size={24} className="fill-current text-white dark:text-blue-900" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <motion.div 
        layout
        className="mt-8 flex justify-end shrink-0 h-[60px]"
      >
        <AnimatePresence>
          {(currentQuestion === questions.length - 1 && answers[question?.id]) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-colors flex items-center gap-3 text-lg shadow-lg shadow-emerald-500/30"
            >
              Hoàn thành & Phân tích
              <Sparkles size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

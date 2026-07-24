import React, { useState, useEffect } from 'react';
import { BookOpen, Mic, Volume2 } from 'lucide-react';
import { API_URL } from '../config';

const Flashcard = () => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for Pronunciation
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState(null);

  useEffect(() => {
    fetchReviewWords();
  }, []);

  const fetchReviewWords = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await fetch(API_URL + '/vocabularies/review', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWords(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const stringSimilarity = (s1, s2) => {
    let longer = s1.toLowerCase();
    let shorter = s2.toLowerCase();
    if (s1.length < s2.length) {
      longer = s2.toLowerCase();
      shorter = s1.toLowerCase();
    }
    let longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    
    let costs = new Array();
    for (let i = 0; i <= shorter.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= longer.length; j++) {
        if (i == 0) costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (longer.charAt(j - 1) != shorter.charAt(i - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[shorter.length] = lastValue;
    }
    return (longerLength - costs[shorter.length]) / parseFloat(longerLength);
  };

  const startPronunciationTest = (e, targetWord) => {
    e.stopPropagation();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt của bạn không hỗ trợ tính năng này. Hãy thử Chrome hoặc Edge nhé.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('');
      setScore(null);
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      
      const cleanTarget = targetWord.replace(/[^a-zA-Z0-9]/g, '');
      const cleanResult = speechResult.replace(/[^a-zA-Z0-9]/g, '');
      
      const similarity = stringSimilarity(cleanTarget, cleanResult);
      setScore(Math.round(similarity * 100));
    };

    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (e) => {
        console.error(e);
        setIsRecording(false);
    };
    
    recognition.start();
  };

  const playAudio = (e, text) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleReview = async (quality) => {
    const currentWord = words[currentIndex];
    const token = localStorage.getItem('access_token');
    
    try {
      await fetch(`${API_URL}/vocabularies/${currentWord.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quality })
      });
      
      setIsFlipped(false);
      
      setTimeout(() => {
        const newWords = [...words];
        newWords.splice(currentIndex, 1);
        setWords(newWords);
        if (currentIndex >= newWords.length) {
            setCurrentIndex(0);
        }
        // Reset pronunciation states
        setTranscript('');
        setScore(null);
      }, 150);
      
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-slate-500">Đang tải sổ tay...</div>;
  }

  if (words.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen size={48} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Hoàn thành xuất sắc!</h2>
        <p className="text-lg text-slate-600">Bạn không còn từ vựng nào cần ôn tập hôm nay.</p>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="mb-6 flex justify-between items-center text-slate-500 font-medium">
        <span>Tiến trình hôm nay</span>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
          Còn {words.length} từ
        </span>
      </div>

      <div 
        className="relative perspective-1000 w-full aspect-[4/3] cursor-pointer"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div className={`w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          <div className="absolute w-full h-full backface-hidden bg-white border-2 border-slate-100 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 hover:shadow-2xl hover:border-blue-200 transition-all">
            <h2 className="text-5xl font-bold text-slate-800">{currentWord.word}</h2>
            <p className="text-slate-400 mt-6 font-medium tracking-widest uppercase text-sm mb-8">Chạm để lật thẻ</p>
            
            <div className="flex justify-center gap-4">
              {/* AI Pronunciation Button on Front */}
              <button 
                onClick={(e) => startPronunciationTest(e, currentWord.word)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium shadow-md transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'}`}
              >
                <Mic size={20} />
                {isRecording ? 'Đang nghe...' : 'Luyện phát âm'}
              </button>

              <button
                onClick={(e) => playAudio(e, currentWord.word)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-white font-medium shadow-md hover:bg-emerald-600 hover:scale-105 transition-all"
              >
                <Volume2 size={20} />
                Nghe
              </button>
            </div>
            
            {/* AI Pronunciation Result */}
            {transcript && (
              <div className="absolute bottom-8 w-full px-8 text-center" onClick={(e) => e.stopPropagation()}>
                <p className="text-sm text-slate-500 mb-1">Bạn vừa nói:</p>
                <p className="font-medium text-slate-800 mb-2">"{transcript}"</p>
                {score !== null && (
                  <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${score >= 80 ? 'bg-green-100 text-green-700' : score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    Độ chính xác: {score}%
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="absolute w-full h-full backface-hidden bg-white border-2 border-slate-100 rounded-3xl shadow-xl flex flex-col p-8 rotate-y-180">
            <div className="flex-1 overflow-y-auto">
              <div className="flex items-baseline gap-3 mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-4xl font-bold text-slate-800">{currentWord.word}</h2>
                <span className="text-lg text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded">{currentWord.phonetic}</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Định nghĩa</h4>
                  <p className="text-xl text-slate-700">{currentWord.meaning}</p>
                </div>
                
                {currentWord.example && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ví dụ</h4>
                    <p className="text-lg text-slate-600 italic border-l-4 border-blue-200 pl-4 py-1">
                      "{currentWord.example}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
              <button 
                onClick={(e) => { e.stopPropagation(); handleReview(2); }}
                className="py-3 px-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
              >
                Khó (Học lại)
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleReview(4); }}
                className="py-3 px-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors"
              >
                Nhớ (Tốt)
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleReview(5); }}
                className="py-3 px-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 font-medium transition-colors"
              >
                Rất dễ
              </button>
            </div>
          </div>
          
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  );
};

export default Flashcard;

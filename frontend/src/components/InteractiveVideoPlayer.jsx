import React, { useState, useRef, useEffect, useMemo } from 'react';
import YouTube from 'react-youtube';
import api from '../services/api';

const mockSubtitles = [
  { id: 1, start: 1.0, end: 3.5, text: "Welcome to our interactive English lesson." },
  { id: 2, start: 3.6, end: 7.0, text: "Click on any word you do not understand." },
  { id: 3, start: 7.1, end: 12.0, text: "This is a great way to learn vocabulary in context." }
];

const InteractiveVideoPlayer = ({ youtubeId, onVideoEnd, subtitles: rawSubtitles }) => {
  const [player, setPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSubtitle, setActiveSubtitle] = useState(null);
  const [dictionaryData, setDictionaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechScore, setSpeechScore] = useState(null);
  
  const timeUpdateInterval = useRef(null);
  const activeSubtitleRef = useRef(null);

  const subtitles = useMemo(() => {
    if (!rawSubtitles || (Array.isArray(rawSubtitles) && rawSubtitles.length === 0)) {
      return mockSubtitles;
    }
    try {
      return typeof rawSubtitles === 'string' ? JSON.parse(rawSubtitles) : rawSubtitles;
    } catch (e) {
      return mockSubtitles;
    }
  }, [rawSubtitles]);

  const onReady = (event) => {
    setPlayer(event.target);
  };

  const onPlay = (event) => {
    timeUpdateInterval.current = setInterval(async () => {
      const time = await event.target.getCurrentTime();
      setCurrentTime(time);
    }, 100);
  };

  const onPause = () => {
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
    }
  };

  useEffect(() => {
    if (subtitles.length > 0) {
      const currentSub = subtitles.find(
        (sub) => currentTime >= sub.start && currentTime <= sub.end
      );
      setActiveSubtitle(currentSub || null);
    }
  }, [currentTime, subtitles]);

  useEffect(() => {
    if (activeSubtitleRef.current) {
      activeSubtitleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeSubtitle]);

  const seekTo = (time) => {
    if (player) {
      player.seekTo(time);
      player.playVideo();
    }
  };

  const handleWordClick = async (e, word) => {
    e.stopPropagation(); // Ngăn sự kiện click bubble lên câu (gây seek video)
    if (player) player.pauseVideo();
    
    const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (!cleanWord) return;

    setIsLoading(true);
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
      if (response.ok) {
        const data = await response.json();
        setDictionaryData(data[0]);
      } else {
        setDictionaryData({ error: 'Không tìm thấy từ này' });
      }
    } catch (error) {
      console.error("Lỗi tra từ:", error);
      setDictionaryData({ error: 'Đã có lỗi xảy ra khi tra từ' });
    } finally {
      setIsLoading(false);
    }
  };

  const saveVocabulary = async () => {
    if (!dictionaryData || dictionaryData.error) return;
    
    const token = localStorage.getItem('access_token');
    if (!token) return alert('Vui lòng đăng nhập để lưu từ vựng!');
    
    try {
      await api.post('/vocabularies', {
        word: dictionaryData.word,
        phonetic: dictionaryData.phonetic || '',
        meaning: dictionaryData.meanings[0]?.definitions[0]?.definition || '',
        example: dictionaryData.meanings[0]?.definitions[0]?.example || ''
      });
      
      alert('Đã lưu vào sổ tay!');
    } catch (error) {
      console.error(error);
      alert('Lỗi mạng, không thể lưu.');
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

  const startPronunciationTest = (e, targetSentence) => {
    e.stopPropagation();
    if (player) player.pauseVideo();
    
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
      setSpeechTranscript('');
      setSpeechScore(null);
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setSpeechTranscript(speechResult);
      
      const cleanTarget = targetSentence.replace(/[^a-zA-Z0-9]/g, '');
      const cleanResult = speechResult.replace(/[^a-zA-Z0-9]/g, '');
      
      const similarity = stringSimilarity(cleanTarget, cleanResult);
      setSpeechScore(Math.round(similarity * 100));
    };

    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (e) => {
        console.error(e);
        setIsRecording(false);
    };
    
    recognition.start();
  };

  const renderInteractiveSubtitle = (text) => {
    return text.split(' ').map((word, index) => (
      <span 
        key={index} 
        onClick={(e) => handleWordClick(e, word)}
        className="cursor-pointer mx-1 px-1 inline-block hover:bg-blue-100 hover:text-blue-700 transition-colors rounded"
      >
        {word}
      </span>
    ));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-6xl mx-auto">
      <div className="flex-1">
        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black relative">
          <YouTube 
            videoId={youtubeId} 
            onReady={onReady}
            onPlay={onPlay}
            onPause={onPause}
            onEnd={onVideoEnd}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: { 
                controls: 1, 
                modestbranding: 1,
                rel: 0,
                iv_load_policy: 3,
                playsinline: 1
              }
            }}
            className="w-full h-full"
            iframeClassName="absolute top-0 left-0 w-full h-full"
          />
        </div>
        
        <div className="mt-6 text-xl md:text-2xl text-center min-h-[80px] font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 w-full flex flex-col items-center justify-center relative">
          {activeSubtitle ? (
            <>
              <div>{renderInteractiveSubtitle(activeSubtitle.text)}</div>
              <button 
                onClick={(e) => startPronunciationTest(e, activeSubtitle.text)}
                className={`mt-4 text-sm px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                {isRecording ? 'Đang nghe...' : 'Luyện phát âm câu này'}
              </button>
              
              {speechTranscript && (
                <div className="mt-4 text-sm bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl w-full text-left border border-slate-100 dark:border-slate-700 shadow-inner">
                  <p className="text-slate-500 dark:text-slate-400 mb-1">Bạn đọc là:</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mb-3">"{speechTranscript}"</p>
                  {speechScore !== null && (
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${speechScore >= 80 ? 'bg-green-100 text-green-700' : speechScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      Độ chính xác: {speechScore}%
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-slate-300">...</div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-1/3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col h-[600px]">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 rounded-t-2xl">
          <h3 className="font-bold text-slate-800">Transcript (Phụ đề)</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Bấm vào câu để tua video, bấm vào từ để tra nghĩa</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {subtitles.length > 0 ? subtitles.map((sub, idx) => {
            const isActive = activeSubtitle?.id === sub.id;
            return (
              <div 
                key={idx} 
                ref={isActive ? activeSubtitleRef : null}
                onClick={() => seekTo(sub.start)}
                className={`p-3 rounded-xl cursor-pointer transition-colors ${isActive ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm' : 'hover:bg-slate-50 dark:bg-slate-900'}`}
              >
                <div className="text-xs text-slate-400 font-mono mb-1">{new Date(sub.start * 1000).toISOString().substr(14, 5)}</div>
                <div className={`text-sm ${isActive ? 'text-blue-800 font-medium' : 'text-slate-600 dark:text-slate-300'}`}>
                  {renderInteractiveSubtitle(sub.text)}
                </div>
              </div>
            );
          }) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-10">Video này chưa có phụ đề.</p>
          )}
        </div>
      </div>

      {dictionaryData && (
        <div className="mt-6 p-6 bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-slate-100 dark:border-slate-700/50 w-full relative transform transition-all animate-in fade-in slide-in-from-bottom-4">
          <button 
            onClick={() => setDictionaryData(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:text-slate-200 p-2 rounded-full hover:bg-slate-100 transition-colors"
            title="Đóng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : dictionaryData.error ? (
            <p className="text-red-500 text-center py-8">{dictionaryData.error}</p>
          ) : (
            <div className="pr-8">
              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{dictionaryData.word}</h3>
                <span className="text-lg text-slate-500 dark:text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">
                  {dictionaryData.phonetic}
                </span>
              </div>
              
              <div className="mt-4 space-y-4">
                {dictionaryData.meanings.slice(0, 2).map((meaning, idx) => (
                  <div key={idx} className="border-l-4 border-blue-100 pl-4 py-1">
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">
                      {meaning.partOfSpeech}
                    </p>
                    <p className="text-slate-700 dark:text-slate-200 text-lg">
                      {meaning.definitions[0]?.definition}
                    </p>
                    {meaning.definitions[0]?.example && (
                      <p className="text-slate-500 dark:text-slate-400 mt-2 italic flex gap-2">
                        <span className="text-blue-300">"</span>
                        {meaning.definitions[0].example}
                        <span className="text-blue-300">"</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              <button 
                onClick={saveVocabulary}
                className="mt-6 w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Lưu vào sổ tay
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveVideoPlayer;

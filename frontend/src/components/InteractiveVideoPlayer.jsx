import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';

const mockSubtitles = [
  { id: 1, start: 1.0, end: 3.5, text: "Welcome to our interactive English lesson." },
  { id: 2, start: 3.6, end: 7.0, text: "Click on any word you do not understand." },
  { id: 3, start: 7.1, end: 12.0, text: "This is a great way to learn vocabulary in context." }
];

const InteractiveVideoPlayer = ({ youtubeId, onVideoEnd }) => {
  const [player, setPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSubtitle, setActiveSubtitle] = useState(null);
  const [dictionaryData, setDictionaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const timeUpdateInterval = useRef(null);

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
    const currentSub = mockSubtitles.find(
      (sub) => currentTime >= sub.start && currentTime <= sub.end
    );
    setActiveSubtitle(currentSub || null);
  }, [currentTime]);

  const handleWordClick = async (word) => {
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

  const renderInteractiveSubtitle = (text) => {
    return text.split(' ').map((word, index) => (
      <span 
        key={index} 
        onClick={() => handleWordClick(word)}
        className="cursor-pointer mx-1 px-1 inline-block hover:bg-blue-100 hover:text-blue-700 transition-colors rounded"
      >
        {word}
      </span>
    ));
  };

  return (
    <div className="flex flex-col items-center p-4 max-w-4xl mx-auto">
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
        <YouTube 
          videoId={youtubeId} 
          onReady={onReady}
          onPlay={onPlay}
          onPause={onPause}
          onEnd={onVideoEnd}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: { controls: 1, modestbranding: 1 }
          }}
          className="w-full h-full"
        />
      </div>
      
      <div className="mt-8 text-2xl md:text-3xl text-center min-h-[80px] font-medium text-slate-700 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full flex items-center justify-center">
        {activeSubtitle ? (
          <div>{renderInteractiveSubtitle(activeSubtitle.text)}</div>
        ) : (
          <div className="text-slate-300">...</div>
        )}
      </div>

      {dictionaryData && (
        <div className="mt-6 p-6 bg-white shadow-xl rounded-2xl border border-slate-100 w-full relative transform transition-all animate-in fade-in slide-in-from-bottom-4">
          <button 
            onClick={() => setDictionaryData(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
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
                <h3 className="text-3xl font-bold text-slate-900">{dictionaryData.word}</h3>
                <span className="text-lg text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
                  {dictionaryData.phonetic}
                </span>
              </div>
              
              <div className="mt-4 space-y-4">
                {dictionaryData.meanings.slice(0, 2).map((meaning, idx) => (
                  <div key={idx} className="border-l-4 border-blue-100 pl-4 py-1">
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">
                      {meaning.partOfSpeech}
                    </p>
                    <p className="text-slate-700 text-lg">
                      {meaning.definitions[0]?.definition}
                    </p>
                    {meaning.definitions[0]?.example && (
                      <p className="text-slate-500 mt-2 italic flex gap-2">
                        <span className="text-blue-300">"</span>
                        {meaning.definitions[0].example}
                        <span className="text-blue-300">"</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              <button className="mt-6 w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium shadow-md shadow-blue-600/20 flex items-center justify-center gap-2">
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

import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Youtube, Play, Volume2 } from 'lucide-react';
import YouTube from 'react-youtube';
import { API_URL } from '../config';

// A utility to extract video ID from various YouTube URL formats
const extractVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function VideoPlayer() {
  const [inputUrl, setInputUrl] = useState('https://www.youtube.com/watch?v=sY0F8Z2wR88');
  const [videoId, setVideoId] = useState('sY0F8Z2wR88');
  const [currentTime, setCurrentTime] = useState(0);
  const [player, setPlayer] = useState(null);
  
  // Update time periodically when playing
  useEffect(() => {
    let interval;
    if (player) {
      interval = setInterval(async () => {
        try {
          const time = await player.getCurrentTime();
          setCurrentTime(time);
        } catch(e) {}
      }, 500);
    }
    return () => clearInterval(interval);
  }, [player]);

  const handleReady = (event) => {
    setPlayer(event.target);
  };

  const handleSeek = (time) => {
    if (player) {
      player.seekTo(time);
      setCurrentTime(time);
    }
  };

  const fetchTranscript = async (id) => {
    if (!id) return [];
    const res = await fetch(`${API_URL}/video/transcript?video_id=${id}`);
    if (!res.ok) throw new Error('Không thể tải phụ đề cho video này.');
    return res.json();
  };

  const { data: transcript = [], isLoading, error } = useQuery({
    queryKey: ['transcript', videoId],
    queryFn: () => fetchTranscript(videoId),
    enabled: !!videoId,
    retry: false
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const id = extractVideoId(inputUrl);
    if (id) {
      setVideoId(id);
    } else {
      alert('Link YouTube không hợp lệ!');
    }
  };

  // Find the current subtitle based on video time
  const currentSubtitle = transcript.find(
    t => currentTime >= t.start && currentTime <= (t.start + t.duration)
  );

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3">
          <Youtube className="text-red-500" size={32} /> Học qua Video
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Xem video trên YouTube kèm phụ đề song ngữ và tra từ trực tiếp.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Dán link YouTube vào đây (ví dụ: https://www.youtube.com/watch?v=...)"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
          Tải Video
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg relative">
            {videoId ? (
              <YouTube
                videoId={videoId}
                onReady={handleReady}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 1,
                  },
                }}
                className="w-full h-full absolute inset-0"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                Chưa có video nào được chọn
              </div>
            )}
          </div>
          
          <div className="bg-slate-900 rounded-2xl p-6 min-h-[120px] flex items-center justify-center text-center shadow-md">
            {isLoading ? (
              <p className="text-slate-400 font-medium">Đang tải phụ đề...</p>
            ) : error ? (
              <p className="text-red-400 font-medium">{error.message}</p>
            ) : currentSubtitle ? (
              <p className="text-2xl text-white font-medium leading-relaxed">
                {currentSubtitle.text}
              </p>
            ) : (
              <p className="text-slate-500 italic">Phụ đề sẽ hiển thị ở đây (Cần kết nối API YouTube Player để đồng bộ thời gian)</p>
            )}
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-blue-700 dark:text-blue-300 text-sm">
            <strong>Mẹo:</strong> Click vào một câu phụ đề ở danh sách bên phải để tự động tua video đến thời điểm đó!
          </div>
        </div>

        {/* Full Transcript */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Volume2 size={18} className="text-blue-500" /> Toàn bộ phụ đề
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <p className="text-slate-500 text-center py-4">Đang tải...</p>
            ) : transcript.length > 0 ? (
              transcript.map((item, idx) => {
                const isCurrent = currentTime >= item.start && currentTime <= (item.start + item.duration);
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleSeek(item.start)}
                    className={`flex gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      isCurrent 
                        ? 'bg-blue-100 dark:bg-blue-900/60 ring-2 ring-blue-400' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="text-blue-500 font-mono text-sm pt-0.5 shrink-0 w-12">
                      {Math.floor(item.start / 60)}:{(Math.floor(item.start % 60)).toString().padStart(2, '0')}
                    </span>
                    <p className={`text-sm leading-relaxed ${isCurrent ? 'text-blue-900 dark:text-blue-100 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                      {item.text}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-500 text-center py-4">Không có dữ liệu phụ đề.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

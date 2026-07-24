import React, { useState, useRef, useEffect } from 'react';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { BookPlus, Volume2 } from 'lucide-react';

export default function TranslatableText({ text, className }) {
  const [selectedWord, setSelectedWord] = useState('');
  const [definition, setDefinition] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const containerRef = useRef(null);

  // Handle Double Click to Select Word
  const handleSelection = () => {
    const selection = window.getSelection();
    const word = selection.toString().trim().replace(/[^a-zA-Z]/g, '');
    
    if (word && word.length > 1) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedWord(word.toLowerCase());
      setPopupPos({
        x: rect.left + rect.width / 2,
        y: rect.bottom + window.scrollY
      });
      setShowPopup(true);
      fetchDefinition(word.toLowerCase());
    } else {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchDefinition = async (word) => {
    setLoading(true);
    setDefinition(null);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (res.ok) {
        const data = await res.json();
        const entry = data[0];
        setDefinition({
          word: entry.word,
          phonetic: entry.phonetic || (entry.phonetics.find(p => p.text)?.text) || '',
          audio: entry.phonetics.find(p => p.audio)?.audio || '',
          meaning: entry.meanings[0].definitions[0].definition,
          example: entry.meanings[0].definitions[0].example || ''
        });
      } else {
        setDefinition({ error: 'Không tìm thấy từ này' });
      }
    } catch (e) {
      setDefinition({ error: 'Lỗi mạng' });
    }
    setLoading(false);
  };

  const saveToFlashcards = async () => {
    if (!definition || definition.error || !user) return;
    
    try {
      const res = await fetch(`${API_URL}/api/v1/vocabulary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: definition.word,
          phonetic: definition.phonetic,
          meaning: definition.meaning,
          example: definition.example,
          user_id: user.id
        })
      });
      if (res.ok) {
        alert('Đã thêm vào Flashcard cá nhân!');
        setShowPopup(false);
      }
    } catch (e) {
      alert('Có lỗi xảy ra');
    }
  };

  const playAudio = () => {
    if (definition?.audio) {
      new Audio(definition.audio).play();
    } else {
      const utterance = new SpeechSynthesisUtterance(selectedWord);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div ref={containerRef} className={className} onDoubleClick={handleSelection} onMouseUp={handleSelection}>
      {text}

      {showPopup && (
        <div 
          className="absolute z-50 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 w-72 transform -translate-x-1/2 mt-2"
          style={{ left: popupPos.x, top: popupPos.y }}
        >
          {loading ? (
            <div className="text-slate-500 text-sm text-center py-4">Đang tra từ...</div>
          ) : definition && !definition.error ? (
            <div>
              <div className="flex justify-between items-start mb-2 border-b border-slate-100 pb-2">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg capitalize">{definition.word}</h4>
                  <p className="text-slate-500 font-mono text-sm">{definition.phonetic}</p>
                </div>
                <button onClick={playAudio} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                  <Volume2 size={16} />
                </button>
              </div>
              <div className="text-sm text-slate-700 mb-3 max-h-32 overflow-y-auto">
                <p><strong>Nghĩa:</strong> {definition.meaning}</p>
                {definition.example && <p className="mt-1 italic text-slate-500 text-xs">Ví dụ: {definition.example}</p>}
              </div>
              <button 
                onClick={saveToFlashcards}
                className="w-full flex justify-center items-center gap-2 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg text-sm transition-all"
              >
                <BookPlus size={16} /> Thêm vào Sổ tay
              </button>
            </div>
          ) : (
            <div className="text-slate-500 text-sm text-center py-2">
              {definition?.error || 'Không thể lấy dữ liệu'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

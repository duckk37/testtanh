import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, User } from 'lucide-react';
import TranslatableText from './TranslatableText';
import { API_URL } from '../config';

const LessonComments = ({ lessonId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [lessonId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/lessons/${lessonId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem('access_token');
    if (!token) return alert('Vui lòng đăng nhập để bình luận');

    try {
      const response = await fetch(`${API_URL}/lessons/${lessonId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });
      
      if (response.ok) {
        setNewComment('');
        fetchComments(); // Reload comments
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="mt-8 border-t border-slate-200 pt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={24} className="text-blue-600" />
        <h3 className="text-xl font-bold text-slate-800">Thảo luận ({comments.length})</h3>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Thêm câu hỏi hoặc bình luận của bạn..."
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Gửi <Send size={16} />
        </button>
      </form>

      {isLoading ? (
        <div className="text-slate-500 text-center py-4">Đang tải bình luận...</div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold uppercase shrink-0">
                {comment.username.charAt(0)}
              </div>
              <div className="flex-1 bg-slate-50 rounded-2xl rounded-tl-none p-4 border border-slate-100">
                <div className="flex justify-between items-baseline mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{comment.username}</span>
                    {comment.role === 'admin' && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Giáo viên
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{formatDate(comment.created_at)}</span>
                </div>
                <TranslatableText text={comment.content} className="text-slate-700 whitespace-pre-line" />
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="text-center text-slate-500 py-4">Chưa có bình luận nào. Hãy là người đầu tiên thảo luận!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonComments;

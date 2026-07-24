import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Flame, BookOpen, Crown } from 'lucide-react';
import { API_URL } from '../config';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL + '/users/leaderboard')
      .then(res => res.json())
      .then(data => {
        setLeaders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching leaderboard:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  const top3 = leaders.slice(0, 3);
  const others = leaders.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white pt-12 pb-24 px-4 text-center">
        <div className="flex justify-center mb-4">
          <Trophy size={56} className="text-yellow-300 drop-shadow-md" />
        </div>
        <h1 className="text-3xl font-extrabold mb-2 text-shadow">Bảng Vàng Thành Tích</h1>
        <p className="text-blue-100 max-w-lg mx-auto opacity-90">
          Cạnh tranh cùng hàng ngàn học viên khác. Điểm số được tính từ các bài kiểm tra bạn đã hoàn thành xuất sắc!
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-10">
        
        {/* Podium (Top 3) */}
        {top3.length > 0 && (
          <div className="flex items-end justify-center gap-2 md:gap-6 mb-8 px-2">
            
            {/* Rank 2 */}
            {top3[1] && (
              <div className="flex flex-col items-center w-1/3">
                <div className="relative mb-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-200 rounded-full border-4 border-white flex items-center justify-center text-xl font-bold text-slate-500 shadow-md">
                    {top3[1].username.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-slate-300 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">2</div>
                </div>
                <div className="text-center mb-3">
                  <p className="font-bold text-slate-800 text-sm md:text-base truncate w-24">{top3[1].username}</p>
                  <p className="text-blue-600 font-black text-sm md:text-base">{top3[1].total_score}đ</p>
                </div>
                <div className="w-full h-24 md:h-32 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-xl border border-slate-200 border-b-0 shadow-inner"></div>
              </div>
            )}

            {/* Rank 1 */}
            {top3[0] && (
              <div className="flex flex-col items-center w-1/3 -mt-8 relative z-10">
                <Crown size={32} className="text-yellow-400 mb-1 drop-shadow-md animate-bounce" />
                <div className="relative mb-2">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-yellow-100 rounded-full border-4 border-white flex items-center justify-center text-3xl font-black text-yellow-600 shadow-lg ring-4 ring-yellow-400/30">
                    {top3[0].username.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">1</div>
                </div>
                <div className="text-center mb-3">
                  <p className="font-bold text-slate-900 text-base md:text-lg truncate w-28">{top3[0].username}</p>
                  <p className="text-yellow-600 font-black text-base md:text-xl">{top3[0].total_score}đ</p>
                </div>
                <div className="w-full h-32 md:h-40 bg-gradient-to-t from-yellow-300 to-yellow-100 rounded-t-xl border border-yellow-200 border-b-0 shadow-inner"></div>
              </div>
            )}

            {/* Rank 3 */}
            {top3[2] && (
              <div className="flex flex-col items-center w-1/3">
                <div className="relative mb-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 rounded-full border-4 border-white flex items-center justify-center text-xl font-bold text-orange-700 shadow-md">
                    {top3[2].username.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">3</div>
                </div>
                <div className="text-center mb-3">
                  <p className="font-bold text-slate-800 text-sm md:text-base truncate w-24">{top3[2].username}</p>
                  <p className="text-orange-600 font-black text-sm md:text-base">{top3[2].total_score}đ</p>
                </div>
                <div className="w-full h-20 md:h-24 bg-gradient-to-t from-orange-200 to-orange-50 rounded-t-xl border border-orange-200 border-b-0 shadow-inner"></div>
              </div>
            )}
          </div>
        )}

        {/* Other Ranks List */}
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
          {others.length > 0 ? others.map((user, index) => (
            <div key={user.id} className="flex items-center p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <div className="w-8 font-bold text-slate-400 text-center mr-4">{index + 4}</div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 mr-4">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800">{user.username}</p>
                <div className="flex items-center text-xs text-slate-500 mt-0.5">
                  <Flame size={12} className="text-orange-500 mr-1" /> {user.streak_count} ngày
                  <span className="mx-2">•</span>
                  <BookOpen size={12} className="text-blue-500 mr-1" /> {user.words_learned} từ vựng
                </div>
              </div>
              <div className="font-black text-slate-700">
                {user.total_score}
                <span className="text-xs text-slate-400 font-normal ml-1">đ</span>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-slate-500">
              Chưa có đủ dữ liệu để xếp hạng. Hãy là người đầu tiên bứt phá!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

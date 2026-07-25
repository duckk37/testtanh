import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Award, BookOpen, Flame, ShoppingCart, CheckCircle, Shield, PaintBucket } from 'lucide-react';
import { API_URL } from '../config';

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [quests, setQuests] = useState([]);
  const [storeItems, setStoreItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStore, setShowStore] = useState(false);
  const [buying, setBuying] = useState(false);

  const handleBuyItem = async (item) => {
    if (buying) return;
    setBuying(true);
    try {
      const res = await fetch(`${API_URL}/store/buy/${item.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        alert('Mua thành công!');
        // Update user CircleDollarSign (this is simplistic, ideally update global auth context)
        setStats(prev => ({...prev, CircleDollarSign: data.CircleDollarSign}));
        user.CircleDollarSign = data.CircleDollarSign; 
        
        if (item.type === 'theme') {
          user.active_theme = item.id;
          alert('Hãy F5 lại trang để áp dụng Theme mới cho thẻ Flashcard nhé!');
        }
      } else {
        const err = await res.json();
        alert(err.detail || 'Không đủ xu hoặc đã sở hữu!');
      }
    } catch (e) {
      alert('Có lỗi xảy ra');
    }
    setBuying(false);
  };

  useEffect(() => {
    if (user) {
      Promise.all([
        fetch(API_URL + '/users/me/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.json()),
        fetch(API_URL + '/users/me/courses', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.json()),
        fetch(API_URL + '/users/me/quests', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.json()),
        fetch(API_URL + '/store/items').then(res => res.json())
      ])
      .then(([statsData, coursesData, questsData, storeData]) => {
        setStats(statsData);
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setQuests(Array.isArray(questsData) ? questsData : []);
        setStoreItems(Array.isArray(storeData) ? storeData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar - User Info */}
        <div className="w-full md:w-1/3">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-700/50">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-8 text-white text-center">
              <div className="h-24 w-24 mx-auto bg-white dark:bg-slate-800/20 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-lg ring-4 ring-white/10">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-blue-100 mt-1">{user.email}</p>
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700/50">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" /> Huy hiệu của bạn
              </h2>
              {user.badges && user.badges.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {user.badges.map(badge => (
                    <div key={badge.id} className="bg-white dark:bg-slate-800 rounded-xl p-3 flex items-center gap-3 shadow-sm border border-slate-100 dark:border-slate-700/50">
                      <div className="text-2xl bg-slate-50 dark:bg-slate-900 w-12 h-12 rounded-lg flex items-center justify-center">{badge.icon}</div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{badge.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 text-center">Chưa có huy hiệu nào</p>
              )}
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700/50">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Nhiệm vụ hàng ngày
              </h2>
              {quests.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {quests.map(quest => {
                    const pct = Math.min(100, Math.round((quest.current_progress / quest.target_value) * 100));
                    return (
                      <div key={quest.id} className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700/50">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-slate-800 text-sm">
                            {quest.quest_type === 'learn_words' ? `Học ${quest.target_value} từ vựng` :
                             quest.quest_type === 'perfect_score' ? `Đạt 100% điểm 1 bài test` :
                             `Hoàn thành ${quest.target_value} bài học`}
                          </h3>
                          <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">+{quest.reward_coins} 🪙</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
                          <div className={`h-2 rounded-full transition-all ${quest.is_completed ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }}></div>
                        </div>
                        <div className="text-right text-xs text-slate-500 dark:text-slate-400 font-medium">{quest.current_progress} / {quest.target_value}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Đang tải nhiệm vụ...</p>
              )}
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700/50">
              <button 
                onClick={() => setShowStore(true)}
                className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors"
              >
                <ShoppingCart size={18} /> Cửa Hàng Vật Phẩm
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Dashboard */}
        <div className="w-full md:w-2/3 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Thống kê học tập</h2>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">Đang tải dữ liệu...</div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Flame className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Chuỗi ngày học</p>
                      <h3 className="text-2xl font-bold text-slate-800">{stats?.streak_count || user.streak_count} <span className="text-base font-normal text-slate-500 dark:text-slate-400">ngày</span></h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Từ vựng đã học</p>
                      <h3 className="text-2xl font-bold text-slate-800">{stats?.total_words || 0} <span className="text-base font-normal text-slate-500 dark:text-slate-400">từ</span></h3>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Điểm TB</p>
                      <h3 className="text-2xl font-bold text-slate-800">{stats?.avg_score || 0} <span className="text-base font-normal text-slate-500 dark:text-slate-400">%</span></h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-700/50">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Từ vựng học trong 7 ngày qua</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.chart_data || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                        cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="words" 
                        name="Số từ"
                        stroke="#2563eb" 
                        strokeWidth={4}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Courses Progress */}
              {courses.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-700/50">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" /> Khóa học đang học
                  </h3>
                  <div className="space-y-6">
                    {courses.map(course => (
                      <div key={course.id}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-700 dark:text-slate-200">{course.title}</span>
                          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{course.completed_lessons} / {course.total_lessons} bài ({course.progress_percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-1000 relative" 
                            style={{ width: `${course.progress_percentage}%` }}
                          >
                            <div className="absolute inset-0 bg-white dark:bg-slate-800/20 w-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Store Modal */}
      {showStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50 dark:bg-slate-900 rounded-t-2xl">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ShoppingCart className="text-yellow-500" /> Cửa hàng
              </h2>
              <div className="flex items-center gap-4">
                <div className="font-bold text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                  Của bạn: {stats?.CircleDollarSign || user.CircleDollarSign || 0} 🪙
                </div>
                <button onClick={() => setShowStore(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-300 font-bold p-2">✕</button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storeItems.map(item => (
                  <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
                    <div>
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3 text-blue-600">
                        {item.type === 'shield' ? <Shield size={24} className="text-emerald-500" /> : <PaintBucket size={24} className="text-purple-500" />}
                      </div>
                      <h3 className="font-bold text-slate-800 mb-1">{item.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{item.description}</p>
                    </div>
                    <button 
                      onClick={() => handleBuyItem(item)}
                      disabled={buying}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      Mua {item.price} 🪙
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

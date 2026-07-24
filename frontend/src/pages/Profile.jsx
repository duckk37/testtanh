import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Award, BookOpen, Flame } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:8000/users/me/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
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
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-8 text-white text-center">
              <div className="h-24 w-24 mx-auto bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-lg ring-4 ring-white/10">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-blue-100 mt-1">{user.email}</p>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" /> Huy hiệu của bạn
              </h2>
              {user.badges && user.badges.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {user.badges.map(badge => (
                    <div key={badge.id} className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-slate-100">
                      <div className="text-2xl bg-slate-50 w-12 h-12 rounded-lg flex items-center justify-center">{badge.icon}</div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{badge.name}</h3>
                        <p className="text-xs text-slate-500">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 bg-white p-4 rounded-xl border border-slate-100 text-center">Chưa có huy hiệu nào</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Dashboard */}
        <div className="w-full md:w-2/3 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Thống kê học tập</h2>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-500">Đang tải dữ liệu...</div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Flame className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Chuỗi ngày học</p>
                      <h3 className="text-2xl font-bold text-slate-800">{stats?.streak_count || user.streak_count} <span className="text-base font-normal text-slate-500">ngày</span></h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Từ vựng đã học</p>
                      <h3 className="text-2xl font-bold text-slate-800">{stats?.total_words || 0} <span className="text-base font-normal text-slate-500">từ</span></h3>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Điểm TB</p>
                      <h3 className="text-2xl font-bold text-slate-800">{stats?.avg_score || 0} <span className="text-base font-normal text-slate-500">%</span></h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

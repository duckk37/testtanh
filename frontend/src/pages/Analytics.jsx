import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { BookOpen, Flame, Activity, Brain } from 'lucide-react';
import { API_URL } from '../config';

export default function Analytics() {
  const fetchOverview = async () => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_URL}/analytics/overview`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  };

  const fetchWeakWords = async () => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_URL}/analytics/weak-words`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch weak words');
    return res.json();
  };

  const { data: overview, isLoading: loadingOverview } = useQuery({
    queryKey: ['analytics_overview'],
    queryFn: fetchOverview
  });

  const { data: weakWords = [], isLoading: loadingWeak } = useQuery({
    queryKey: ['analytics_weak'],
    queryFn: fetchWeakWords
  });

  if (loadingOverview || loadingWeak) {
    return <div className="p-8 text-center text-slate-500">Đang phân tích dữ liệu...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Báo cáo Học tập</h1>
        <p className="text-slate-500 dark:text-slate-400">Theo dõi tiến độ và tối ưu hóa việc học của bạn.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium">Chuỗi ngày</h3>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg"><Flame className="text-orange-500" size={20} /></div>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">{overview?.streak || 0}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium">Đang học</h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg"><BookOpen className="text-blue-500" size={20} /></div>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">{overview?.total_learning || 0}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium">Đã thuộc</h3>
            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg"><Brain className="text-green-500" size={20} /></div>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">{overview?.well_known || 0}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium">Cần ôn hôm nay</h3>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg"><Activity className="text-purple-500" size={20} /></div>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">{overview?.due_today || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Mức độ hoạt động (30 ngày)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview?.heatmap || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(str) => str.substring(8, 10)} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {(overview?.heatmap || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#3b82f6' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weak Words List */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Từ vựng hay quên</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Những từ bạn có điểm trí nhớ (Ease Factor) thấp nhất.</p>
          
          <div className="flex-1 space-y-4">
            {weakWords.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Tuyệt vời! Bạn chưa có từ nào vào danh sách đỏ.
              </div>
            ) : (
              weakWords.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{item.word}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate w-32 md:w-48">{item.meaning}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-md mb-1">
                      EF: {item.ease_factor.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400">Ôn {item.repetition} lần</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

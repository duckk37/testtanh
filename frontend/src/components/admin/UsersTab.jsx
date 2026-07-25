import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { API_URL } from '../../config';

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(API_URL + '/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-10 text-slate-500 dark:text-slate-400">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Danh sách Người dùng</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Học viên</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vai trò</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Chăm chỉ</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{u.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {u.role === 'admin' ? (
                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">Admin</span>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">Học viên</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {u.streak_count > 0 ? (
                    <span className="flex items-center gap-1 text-orange-600 font-bold bg-orange-50 dark:bg-orange-900/30 px-2.5 py-1 rounded-md w-fit">
                      <Flame size={16} /> {u.streak_count} ngày
                    </span>
                  ) : (
                    <span className="text-slate-400 text-sm">Chưa học</span>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">Chưa có người dùng nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

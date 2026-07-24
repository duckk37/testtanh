import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.username}</h1>
              <p className="text-blue-100 mt-1">{user.email}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-2xl">🔥</span>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Chuỗi ngày học</h2>
              <p className="text-slate-600">Bạn đã học liên tục <span className="font-bold text-orange-500">{user.streak_count}</span> ngày.</p>
            </div>
          </div>

          <hr className="border-slate-100 my-6" />

          <h2 className="text-xl font-bold text-slate-800 mb-4">🏆 Huy hiệu của bạn</h2>
          {user.badges && user.badges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user.badges.map(badge => (
                <div key={badge.id} className="border border-slate-200 rounded-lg p-4 flex items-start space-x-3 bg-slate-50">
                  <div className="text-3xl">{badge.icon}</div>
                  <div>
                    <h3 className="font-bold text-slate-800">{badge.name}</h3>
                    <p className="text-sm text-slate-600">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic">Bạn chưa có huy hiệu nào. Hãy hoàn thành các bài học và bài kiểm tra để thu thập huy hiệu nhé!</p>
          )}
        </div>
      </div>
    </div>
  );
}

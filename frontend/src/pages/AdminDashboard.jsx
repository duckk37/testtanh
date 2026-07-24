import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    const token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}` };
    
    if (activeTab === 'courses') {
      const res = await fetch('http://localhost:8000/courses', { headers });
      const data = await res.json();
      setCourses(data);
    } else {
      const res = await fetch('http://localhost:8000/admin/users', { headers });
      const data = await res.json();
      setUsers(data);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Admin Dashboard</h1>
      
      <div className="flex border-b border-slate-200 mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'courses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600'}`}
          onClick={() => setActiveTab('courses')}
        >
          Quản lý Khóa học
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600'}`}
          onClick={() => setActiveTab('users')}
        >
          Người dùng
        </button>
      </div>

      {activeTab === 'courses' && (
        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700">
            + Thêm khóa học
          </button>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tên khóa học</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {courses.map(course => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{course.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {course.price.toLocaleString()}đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 hover:text-blue-900 cursor-pointer">
                      Chỉnh sửa
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Chuỗi (Ngày)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{u.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">{u.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-orange-500 font-bold">🔥 {u.streak_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

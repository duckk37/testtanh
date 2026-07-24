import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings,
  Plus,
  Trash2,
  Edit,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  X,
  Flame
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, courses, users
  
  // Modal state
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop'
  });

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}` };
    
    try {
      const resCourses = await fetch(API_URL + '/courses', { headers });
      if (resCourses.ok) {
        const data = await resCourses.json();
        setCourses(data);
      }

      const resUsers = await fetch(API_URL + '/admin/users', { headers });
      if (resUsers.ok) {
        const data = await resUsers.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    const trimmedTitle = newCourse.title.trim();
    const trimmedDesc = newCourse.description.trim();
    
    if (!trimmedTitle || !trimmedDesc) {
      alert("Tên và mô tả không được để trống hoặc chỉ chứa khoảng trắng.");
      return;
    }
    
    const payload = {
      ...newCourse,
      title: trimmedTitle,
      description: trimmedDesc
    };

    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(API_URL + '/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert("Thêm khóa học thành công!");
        setShowAddCourseModal(false);
        setNewCourse({ title: '', description: '', price: 0, thumbnail: '' });
        fetchData(); // Refresh list
      } else {
        alert("Có lỗi xảy ra khi thêm khóa học.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối.");
    }
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();
    const trimmedTitle = editingCourse.title.trim();
    const trimmedDesc = editingCourse.description.trim();
    
    if (!trimmedTitle || !trimmedDesc) {
      alert("Tên và mô tả không được để trống hoặc chỉ chứa khoảng trắng.");
      return;
    }

    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${API_URL}/admin/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: trimmedTitle,
          description: trimmedDesc,
          price: editingCourse.price,
          thumbnail: editingCourse.thumbnail
        })
      });
      
      if (res.ok) {
        alert("Cập nhật khóa học thành công!");
        setShowEditCourseModal(false);
        setEditingCourse(null);
        fetchData(); // Refresh list
      } else {
        alert("Có lỗi xảy ra khi cập nhật khóa học.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối.");
    }
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${courseTitle}"? Hành động này không thể hoàn tác.`)) {
      return;
    }
    
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${API_URL}/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        alert("Đã xóa khóa học.");
        fetchData();
      } else {
        alert("Lỗi khi xóa khóa học.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Stats
  const totalRevenue = courses.reduce((acc, curr) => acc + curr.price, 0); // Mock revenue
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.streak_count > 0).length;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-200">
      
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm z-10 transition-colors duration-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ShieldAlert className="text-blue-600" size={24} />
            Admin Panel
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Tổng quan</span>
            {activeTab === 'overview' && <ChevronRight size={16} className="ml-auto" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'courses' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen size={20} />
            <span className="font-medium">Khóa học</span>
            {activeTab === 'courses' && <ChevronRight size={16} className="ml-auto" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'users' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users size={20} />
            <span className="font-medium">Người dùng</span>
            {activeTab === 'users' && <ChevronRight size={16} className="ml-auto" />}
          </button>
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors px-4 py-2 text-sm font-medium">
            <ChevronRight size={16} className="rotate-180" />
            Về trang chủ
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Tổng quan hệ thống</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Stat Card 1 */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="text-blue-600 dark:text-blue-400" size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tổng Học Viên</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalUsers}</p>
                </div>
              </div>
              
              {/* Stat Card 2 */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
                  <TrendingUp className="text-orange-500 dark:text-orange-400" size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Học viên năng nổ</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeUsers}</p>
                </div>
              </div>
              
              {/* Stat Card 3 */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                  <BookOpen className="text-emerald-600 dark:text-emerald-400" size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tổng Khóa học</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{courses.length}</p>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Hành động nhanh</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => { setActiveTab('courses'); setShowAddCourseModal(true); }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
                >
                  <Plus size={18} /> Thêm khóa học mới
                </button>
              </div>
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Quản trị Hệ thống</h1>
                <p className="text-slate-500 dark:text-slate-400">Quản lý khóa học, người dùng và dữ liệu hệ thống</p>
              </div>
              <button 
                onClick={() => setShowAddCourseModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
              >
                <Plus size={18} /> Thêm khóa học
              </button>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Khóa học</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mô tả ngắn</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Giá bán</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {courses.map(course => (
                    <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={course.thumbnail} alt="" className="w-16 h-12 object-cover rounded-lg shadow-sm border border-slate-200" />
                          <div className="font-bold text-slate-900 line-clamp-1">{course.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 line-clamp-2 max-w-xs">
                        {course.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-emerald-600">
                        {course.price.toLocaleString()} ₫
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => { setEditingCourse(course); setShowEditCourseModal(true); }}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors mr-2" 
                          title="Sửa khóa học"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id, course.title)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors" 
                          title="Xóa khóa học"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-slate-500">Chưa có khóa học nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Danh sách Người dùng</h1>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Học viên</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Vai trò</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Chăm chỉ</th>
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
                          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-purple-100 text-purple-700">Admin</span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-600">Học viên</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.streak_count > 0 ? (
                          <span className="flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-2.5 py-1 rounded-md w-fit">
                            <Flame size={16} /> {u.streak_count} ngày
                          </span>
                        ) : (
                          <span className="text-slate-400 text-sm">Chưa học</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Thêm Khóa Học Mới</h2>
              <button 
                onClick={() => setShowAddCourseModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddCourse} className="p-6 space-y-4 bg-slate-50">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên khóa học</label>
                <input 
                  type="text" 
                  required
                  value={newCourse.title}
                  onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Ví dụ: Pro 3M - Ôn thi THPT"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả chi tiết</label>
                <textarea 
                  required
                  rows={3}
                  value={newCourse.description}
                  onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  placeholder="Khóa học này dành cho..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giá bán (VNĐ)</label>
                  <input 
                    type="number" 
                    required
                    min={0}
                    value={newCourse.price}
                    onChange={e => setNewCourse({...newCourse, price: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Link Ảnh Bìa (URL)</label>
                  <input 
                    type="url" 
                    required
                    value={newCourse.thumbnail}
                    onChange={e => setNewCourse({...newCourse, thumbnail: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              
              {newCourse.thumbnail && (
                <div className="mt-2 text-sm text-slate-500">
                  <p className="mb-1">Xem trước ảnh bìa:</p>
                  <img src={newCourse.thumbnail} alt="Preview" className="h-24 object-cover rounded-lg border border-slate-200" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Tạo khóa học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditCourseModal && editingCourse && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Sửa Khóa Học</h2>
              <button 
                onClick={() => { setShowEditCourseModal(false); setEditingCourse(null); }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditCourse} className="p-6 space-y-4 bg-slate-50">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên khóa học</label>
                <input 
                  type="text" 
                  required
                  value={editingCourse.title}
                  onChange={e => setEditingCourse({...editingCourse, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả chi tiết</label>
                <textarea 
                  required
                  rows={3}
                  value={editingCourse.description}
                  onChange={e => setEditingCourse({...editingCourse, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giá bán (VNĐ)</label>
                  <input 
                    type="number" 
                    required
                    min={0}
                    value={editingCourse.price}
                    onChange={e => setEditingCourse({...editingCourse, price: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Link Ảnh Bìa (URL)</label>
                  <input 
                    type="url" 
                    required
                    value={editingCourse.thumbnail}
                    onChange={e => setEditingCourse({...editingCourse, thumbnail: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              
              {editingCourse.thumbnail && (
                <div className="mt-2 text-sm text-slate-500">
                  <p className="mb-1">Xem trước ảnh bìa:</p>
                  <img src={editingCourse.thumbnail} alt="Preview" className="h-24 object-cover rounded-lg border border-slate-200" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 mt-6">
                <button 
                  type="button"
                  onClick={() => { setShowEditCourseModal(false); setEditingCourse(null); }}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

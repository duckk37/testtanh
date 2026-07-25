import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, ListVideo } from 'lucide-react';
import { API_URL } from '../../config';
import CourseContentManager from './CourseContentManager';

export default function CoursesTab() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Content manager state
  const [managingCourse, setManagingCourse] = useState(null);

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(API_URL + '/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
    
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(API_URL + '/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newCourse, title: trimmedTitle, description: trimmedDesc })
      });
      
      if (res.ok) {
        alert("Thêm khóa học thành công!");
        setShowAddCourseModal(false);
        setNewCourse({ title: '', description: '', price: 0, thumbnail: '' });
        fetchCourses();
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
        fetchCourses();
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
        fetchCourses();
      } else {
        alert("Lỗi khi xóa khóa học.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-10 text-slate-500 dark:text-slate-400">Đang tải dữ liệu...</div>;

  if (managingCourse) {
    return <CourseContentManager course={managingCourse} onBack={() => setManagingCourse(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Quản trị Khóa học</h1>
          <p className="text-slate-500 dark:text-slate-400">Thêm, sửa, xóa các khóa học trong hệ thống</p>
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
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Khóa học</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mô tả ngắn</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Giá bán</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={course.thumbnail} alt="" className="w-16 h-12 object-cover rounded-lg shadow-sm border border-slate-200 dark:border-slate-600" />
                    <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{course.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 max-w-xs">
                  {course.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-emerald-600 dark:text-emerald-400">
                  {course.price.toLocaleString()} ₫
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => setManagingCourse(course)}
                    className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 p-2 rounded-lg transition-colors mr-2" 
                    title="Quản lý Nội dung"
                  >
                    <ListVideo size={18} />
                  </button>
                  <button 
                    onClick={() => { setEditingCourse(course); setShowEditCourseModal(true); }}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 p-2 rounded-lg transition-colors mr-2" 
                    title="Sửa khóa học"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCourse(course.id, course.title)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 p-2 rounded-lg transition-colors" 
                    title="Xóa khóa học"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">Chưa có khóa học nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Thêm Khóa Học Mới</h2>
              <button 
                onClick={() => setShowAddCourseModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddCourse} className="p-6 space-y-4 bg-slate-50 dark:bg-slate-800/50">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên khóa học</label>
                <input 
                  type="text" 
                  required
                  value={newCourse.title}
                  onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Ví dụ: Pro 3M - Ôn thi THPT"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mô tả chi tiết</label>
                <textarea 
                  required
                  rows={3}
                  value={newCourse.description}
                  onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  placeholder="Khóa học này dành cho..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Giá bán (VNĐ)</label>
                  <input 
                    type="number" 
                    required
                    min={0}
                    value={newCourse.price}
                    onChange={e => setNewCourse({...newCourse, price: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link Ảnh Bìa (URL)</label>
                  <input 
                    type="url" 
                    required
                    value={newCourse.thumbnail}
                    onChange={e => setNewCourse({...newCourse, thumbnail: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              
              {newCourse.thumbnail && (
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  <p className="mb-1">Xem trước ảnh bìa:</p>
                  <img src={newCourse.thumbnail} alt="Preview" className="h-24 object-cover rounded-lg border border-slate-200 dark:border-slate-600" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sửa Khóa Học</h2>
              <button 
                onClick={() => { setShowEditCourseModal(false); setEditingCourse(null); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditCourse} className="p-6 space-y-4 bg-slate-50 dark:bg-slate-800/50">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên khóa học</label>
                <input 
                  type="text" 
                  required
                  value={editingCourse.title}
                  onChange={e => setEditingCourse({...editingCourse, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mô tả chi tiết</label>
                <textarea 
                  required
                  rows={3}
                  value={editingCourse.description}
                  onChange={e => setEditingCourse({...editingCourse, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Giá bán (VNĐ)</label>
                  <input 
                    type="number" 
                    required
                    min={0}
                    value={editingCourse.price}
                    onChange={e => setEditingCourse({...editingCourse, price: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link Ảnh Bìa (URL)</label>
                  <input 
                    type="url" 
                    required
                    value={editingCourse.thumbnail}
                    onChange={e => setEditingCourse({...editingCourse, thumbnail: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              
              {editingCourse.thumbnail && (
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  <p className="mb-1">Xem trước ảnh bìa:</p>
                  <img src={editingCourse.thumbnail} alt="Preview" className="h-24 object-cover rounded-lg border border-slate-200 dark:border-slate-600" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 mt-6">
                <button 
                  type="button"
                  onClick={() => { setShowEditCourseModal(false); setEditingCourse(null); }}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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

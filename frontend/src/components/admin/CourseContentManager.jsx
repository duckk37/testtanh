import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, ListVideo, X } from 'lucide-react';
import { API_URL } from '../../config';

export default function CourseContentManager({ course, onBack }) {
  const [lessons, setLessons] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Forms
  const [lessonForm, setLessonForm] = useState({ title: '', content: '', order_num: 1, video_url: '', exam_id: '' });

  useEffect(() => {
    fetchLessons();
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch(API_URL + '/exams', {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        setExams(json);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL + `/courses/${course.id}/lessons`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        setLessons(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    const endpoint = editingItem 
      ? `/admin/lessons/${editingItem.id}` 
      : `/admin/courses/${course.id}/lessons`;
    const method = editingItem ? 'PUT' : 'POST';

    const payload = { ...lessonForm };
    payload.youtube_id = payload.video_url; // Map video_url to youtube_id for backend
    
    try {
      const res = await fetch(API_URL + endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowModal(false);
        fetchLessons();
      } else {
        alert("Có lỗi xảy ra.");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      const res = await fetch(API_URL + `/admin/lessons/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchLessons();
      } else {
        alert("Lỗi khi xóa.");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setLessonForm({ title: '', content: '', order_num: lessons.length + 1, video_url: '', exam_id: '' });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setLessonForm({ 
      title: item.title, 
      content: item.content, 
      order_num: item.order_num, 
      video_url: item.video_url || '',
      exam_id: item.exam_id || ''
    });
    setShowModal(true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white mb-4 transition-colors">
          <ArrowLeft size={16} /> Quay lại danh sách khóa học
        </button>
        <div className="flex items-end gap-6 border-b border-slate-200 dark:border-slate-700 pb-4">
          {course.thumbnail && (
            <img src={course.thumbnail} onError={(e) => { e.target.style.display = 'none'; }} alt="" className="w-24 h-16 object-cover rounded-lg shadow-sm" />
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{course.title}</h1>
            <p className="text-slate-500 dark:text-slate-400">Quản lý các bài học video của khóa học</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Danh sách Bài học
          </h2>
          <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            <Plus size={16} /> Thêm Bài học
          </button>
        </div>

        {loading ? (
          <div className="text-center p-10 text-slate-500 dark:text-slate-400">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">STT</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Tiêu đề</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Bài kiểm tra</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Video URL</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {lessons.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{item.order_num}</td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">{item.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                      {item.exam_id ? (
                        <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium border border-indigo-100">
                          Có đính kèm
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[200px]">{item.video_url || item.youtube_id}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg transition-colors mr-2">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {lessons.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">Chưa có bài học nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dynamic Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingItem ? 'Sửa Bài học' : 'Thêm Bài học'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 max-h-[70vh] overflow-y-auto">
              <form id="content-form" onSubmit={handleSaveLesson} className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">STT</label>
                    <input type="number" required value={lessonForm.order_num} onChange={e => setLessonForm({...lessonForm, order_num: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tiêu đề bài học</label>
                    <input type="text" required value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Video URL (YouTube/Vimeo)</label>
                  <input 
                    type="text" 
                    value={lessonForm.video_url} 
                    onChange={e => setLessonForm({...lessonForm, video_url: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bài kiểm tra đính kèm</label>
                  <select
                    value={lessonForm.exam_id}
                    onChange={e => setLessonForm({...lessonForm, exam_id: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="">Không có bài kiểm tra</option>
                    {exams.map(exam => (
                      <option key={exam.id} value={exam.id}>{exam.title}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Học viên sẽ phải hoàn thành bài kiểm tra này sau khi học xong.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nội dung chi tiết (Text/Markdown)</label>
                  <textarea required rows={5} value={lessonForm.content} onChange={e => setLessonForm({...lessonForm, content: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-white dark:bg-slate-800">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium">
                Hủy
              </button>
              <button type="submit" form="content-form" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm font-medium">
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

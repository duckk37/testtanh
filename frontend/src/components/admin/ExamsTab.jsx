import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, FileQuestion, Clock, Target } from 'lucide-react';
import api from '../../services/api';
import ExamQuestionManager from './ExamQuestionManager';

export default function ExamsTab() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  
  const [examForm, setExamForm] = useState({ title: '', description: '', duration_minutes: 60 });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      // The frontend can just use /exams since it's a public endpoint or admin
      const res = await api.get('/exams');
      setExams(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  const handleSave = async (e) => {
    e.preventDefault();
    const endpoint = editingItem 
      ? `/admin/exams/${editingItem.id}` 
      : `/admin/exams`;
    const method = editingItem ? 'PUT' : 'POST';

    try {
      await (method === 'PUT' ? api.put(endpoint, examForm) : api.post(endpoint, examForm));
      setShowModal(false);
      fetchExams();
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await api.delete(`/admin/exams/${id}`);
      fetchExams();
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setExamForm({ title: '', description: '', duration_minutes: 60 });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setExamForm({ 
      title: item.title, 
      description: item.description || '', 
      duration_minutes: item.duration_minutes 
    });
    setShowModal(true);
  };

  if (selectedExam) {
    return <ExamQuestionManager exam={selectedExam} onBack={() => setSelectedExam(null)} />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Ngân hàng Đề thi</h1>
          <p className="text-slate-500 dark:text-slate-400">Quản lý các bài kiểm tra trắc nghiệm và câu hỏi</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-200 dark:shadow-blue-900/20">
          <Plus size={20} />
          Tạo Bài Kiểm Tra
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="text-center p-10 text-slate-500 dark:text-slate-400">Đang tải dữ liệu...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {exams.map(item => (
              <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-shadow bg-slate-50 dark:bg-slate-900/50 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">{item.title}</h3>
                </div>
                {item.description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 flex-grow">{item.description}</p>
                )}
                
                <div className="flex gap-4 mb-5 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-700 dark:text-blue-400 font-medium">
                    <Clock size={14} /> {item.duration_minutes} phút
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center mt-auto">
                  <button 
                    onClick={() => setSelectedExam(item)} 
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium text-sm"
                  >
                    <FileQuestion size={16} /> Quản lý Câu hỏi
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(item)} className="text-slate-400 hover:text-blue-600 transition-colors p-1.5 rounded hover:bg-blue-50 dark:hover:bg-slate-800">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded hover:bg-red-50 dark:hover:bg-slate-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {exams.length === 0 && (
              <div className="col-span-full text-center py-10 text-slate-500 dark:text-slate-400">
                Chưa có đề thi nào. Hãy tạo mới!
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingItem ? 'Sửa Đề thi' : 'Thêm Đề thi'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50">
              <form id="exam-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên bài kiểm tra</label>
                  <input type="text" required value={examForm.title} onChange={e => setExamForm({...examForm, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mô tả</label>
                  <textarea rows={2} required value={examForm.description} onChange={e => setExamForm({...examForm, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                  <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thời gian (phút)</label>
                    <input type="number" required min={1} value={examForm.duration_minutes} onChange={e => setExamForm({...examForm, duration_minutes: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-white dark:bg-slate-800">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium">
                Hủy
              </button>
              <button type="submit" form="exam-form" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm font-medium">
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

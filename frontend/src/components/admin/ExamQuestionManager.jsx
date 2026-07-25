import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, X, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../../config';

export default function ExamQuestionManager({ exam, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form state
  const [form, setForm] = useState({ 
    content: '', 
    option_a: '', 
    option_b: '', 
    option_c: '', 
    option_d: '', 
    correct_option: 'A' 
  });

  useEffect(() => {
    fetchQuestions();
  }, [exam.id]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/exams/${exam.id}/questions`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
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

  const handleSave = async (e) => {
    e.preventDefault();
    const endpoint = editingItem 
      ? `/admin/questions/${editingItem.id}` 
      : `/admin/questions`;
    const method = editingItem ? 'PUT' : 'POST';

    const payload = {
      ...form,
      exam_id: exam.id
    };

    try {
      const res = await fetch(API_URL + endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowModal(false);
        fetchQuestions();
      } else {
        alert("Có lỗi xảy ra khi lưu câu hỏi.");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/questions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchQuestions();
      } else {
        alert("Lỗi khi xóa câu hỏi.");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setForm({ 
      content: '', 
      option_a: '', 
      option_b: '', 
      option_c: '', 
      option_d: '', 
      correct_option: 'A' 
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({ 
      content: item.content, 
      option_a: item.option_a, 
      option_b: item.option_b, 
      option_c: item.option_c, 
      option_d: item.option_d, 
      correct_option: item.correct_option 
    });
    setShowModal(true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4">
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white mb-4 transition-colors">
          <ArrowLeft size={16} /> Quay lại danh sách Bài kiểm tra
        </button>
        <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-700 pb-4">
          <div>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 block">Quản lý câu hỏi</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{exam.title}</h2>
          </div>
          <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
            <Plus size={18} /> Thêm Câu hỏi
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-12 text-slate-500 dark:text-slate-400">Đang tải danh sách câu hỏi...</div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                  <span className="text-blue-600 mr-2">Câu {index + 1}:</span>
                  {q.content}
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(q)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(q.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 bg-red-50 dark:bg-red-900/30 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['A', 'B', 'C', 'D'].map(opt => {
                  const isCorrect = q.correct_option === opt;
                  const optText = q[`option_${opt.toLowerCase()}`];
                  
                  return (
                    <div 
                      key={opt} 
                      className={`px-4 py-3 rounded-xl border-2 flex items-center gap-3 ${
                        isCorrect 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold' 
                          : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${
                        isCorrect ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}>{opt}</span>
                      <span className="flex-1">{optText}</span>
                      {isCorrect && <CheckCircle2 size={20} className="text-green-500" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          {questions.length === 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 p-12 text-center">
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-lg">Bài kiểm tra này chưa có câu hỏi nào.</p>
              <button onClick={openAddModal} className="text-blue-600 font-medium hover:underline">Thêm câu hỏi đầu tiên</button>
            </div>
          )}
        </div>
      )}

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingItem ? 'Sửa Câu hỏi' : 'Thêm Câu hỏi mới'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form id="question-form" onSubmit={handleSave} className="p-6 bg-slate-50 dark:bg-slate-800/50 max-h-[75vh] overflow-y-auto space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nội dung câu hỏi</label>
                <textarea 
                  required 
                  rows={3} 
                  value={form.content} 
                  onChange={e => setForm({...form, content: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none shadow-sm" 
                  placeholder="Nhập nội dung câu hỏi..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map(opt => {
                  const key = `option_${opt.toLowerCase()}`;
                  return (
                    <div key={opt}>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs">{opt}</span>
                        Đáp án {opt}
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={form[key]} 
                        onChange={e => setForm({...form, [key]: e.target.value})} 
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                        placeholder={`Nhập đáp án ${opt}...`}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Chọn Đáp án đúng</label>
                <div className="flex gap-4">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <label key={opt} className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                      form.correct_option === opt 
                        ? 'border-green-500 bg-green-50 text-green-700 font-bold' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                    }`}>
                      <input 
                        type="radio" 
                        name="correct_option" 
                        value={opt} 
                        checked={form.correct_option === opt}
                        onChange={(e) => setForm({...form, correct_option: e.target.value})}
                        className="hidden"
                      />
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                        form.correct_option === opt ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300'
                      }`}>
                        {form.correct_option === opt && <CheckCircle2 size={14} />}
                      </span>
                      Đáp án {opt}
                    </label>
                  ))}
                </div>
              </div>
            </form>

            <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-white dark:bg-slate-800">
              <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium">
                Hủy
              </button>
              <button type="submit" form="question-form" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm font-bold">
                Lưu Câu Hỏi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, ListVideo, Layers, TrendingUp, X, FileQuestion } from 'lucide-react';
import { API_URL } from '../../config';
import ExamQuestionManager from './ExamQuestionManager';

export default function CourseContentManager({ course, onBack }) {
  const [activeTab, setActiveTab] = useState('lessons'); // lessons, vocabularies, exams
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Child View states
  const [selectedExam, setSelectedExam] = useState(null);
  
  // Forms
  const [lessonForm, setLessonForm] = useState({ title: '', content: '', order_num: 1, video_url: '' });
  const [vocabForm, setVocabForm] = useState({ word: '', meaning: '', type: 'n', example_sentence: '', pronunciation: '' });
  const [examForm, setExamForm] = useState({ title: '', description: '', time_limit: 30, pass_score: 80 });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      if (activeTab === 'lessons') endpoint = `/courses/${course.id}/lessons`;
      if (activeTab === 'vocabularies') endpoint = `/courses/${course.id}/vocabularies`;
      if (activeTab === 'exams') endpoint = `/courses/${course.id}/exams`;

      const res = await fetch(API_URL + endpoint);
      if (res.ok) {
        const json = await res.json();
        setData(json);
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

  // --- Handlers for Lessons ---
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    const endpoint = editingItem 
      ? `/admin/lessons/${editingItem.id}` 
      : `/admin/courses/${course.id}/lessons`;
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const res = await fetch(API_URL + endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(lessonForm)
      });
      if (res.ok) {
        setShowModal(false);
        fetchData();
      } else {
        alert("Có lỗi xảy ra.");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  // --- Handlers for Vocabularies ---
  const handleSaveVocab = async (e) => {
    e.preventDefault();
    const endpoint = editingItem 
      ? `/admin/vocabularies/${editingItem.id}` 
      : `/admin/courses/${course.id}/vocabularies`;
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const res = await fetch(API_URL + endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(vocabForm)
      });
      if (res.ok) {
        setShowModal(false);
        fetchData();
      } else {
        alert("Có lỗi xảy ra.");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  // --- Handlers for Exams ---
  const handleSaveExam = async (e) => {
    e.preventDefault();
    const endpoint = editingItem 
      ? `/admin/exams/${editingItem.id}` 
      : `/admin/courses/${course.id}/exams`;
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const res = await fetch(API_URL + endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(examForm)
      });
      if (res.ok) {
        setShowModal(false);
        fetchData();
      } else {
        alert("Có lỗi xảy ra.");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    let endpoint = '';
    if (activeTab === 'lessons') endpoint = `/admin/lessons/${id}`;
    if (activeTab === 'vocabularies') endpoint = `/admin/vocabularies/${id}`;
    if (activeTab === 'exams') endpoint = `/admin/exams/${id}`;

    try {
      const res = await fetch(API_URL + endpoint, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Lỗi khi xóa.");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    if (activeTab === 'lessons') setLessonForm({ title: '', content: '', order_num: data.length + 1, video_url: '' });
    if (activeTab === 'vocabularies') setVocabForm({ word: '', meaning: '', type: 'n', example_sentence: '', pronunciation: '' });
    if (activeTab === 'exams') setExamForm({ title: '', description: '', time_limit: 30, pass_score: 80 });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    if (activeTab === 'lessons') setLessonForm({ title: item.title, content: item.content, order_num: item.order_num, video_url: item.video_url || '' });
    if (activeTab === 'vocabularies') setVocabForm({ word: item.word, meaning: item.meaning, type: item.type, example_sentence: item.example_sentence || '', pronunciation: item.pronunciation || '' });
    if (activeTab === 'exams') setExamForm({ title: item.title, description: item.description || '', time_limit: item.time_limit, pass_score: item.pass_score });
    setShowModal(true);
  };

  if (selectedExam) {
    return <ExamQuestionManager exam={selectedExam} onBack={() => setSelectedExam(null)} />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white mb-4 transition-colors">
          <ArrowLeft size={16} /> Quay lại danh sách khóa học
        </button>
        <div className="flex items-end gap-6 border-b border-slate-200 dark:border-slate-700 pb-4">
          {course.thumbnail && (
            <img src={course.thumbnail} alt="" className="w-24 h-16 object-cover rounded-lg shadow-sm" />
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{course.title}</h1>
            <p className="text-slate-500 dark:text-slate-400">Quản lý nội dung chi tiết của khóa học</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('lessons')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'lessons' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}
        >
          <ListVideo size={18} /> Bài học Video
        </button>
        <button 
          onClick={() => setActiveTab('vocabularies')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'vocabularies' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}
        >
          <Layers size={18} /> Flashcard / Từ vựng
        </button>
        <button 
          onClick={() => setActiveTab('exams')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'exams' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}
        >
          <TrendingUp size={18} /> Bài Kiểm Tra
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {activeTab === 'lessons' && 'Danh sách Bài học'}
            {activeTab === 'vocabularies' && 'Danh sách Từ vựng'}
            {activeTab === 'exams' && 'Danh sách Bài kiểm tra'}
          </h2>
          <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            <Plus size={16} /> Thêm mới
          </button>
        </div>

        {loading ? (
          <div className="text-center p-10 text-slate-500">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  {activeTab === 'lessons' && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">STT</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Tiêu đề</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Video URL</th>
                    </>
                  )}
                  {activeTab === 'vocabularies' && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Từ vựng</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Loại</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Ý nghĩa</th>
                    </>
                  )}
                  {activeTab === 'exams' && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Tiêu đề</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Thời gian (phút)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Điểm đạt (%)</th>
                    </>
                  )}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {data.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    {activeTab === 'lessons' && (
                      <>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{item.order_num}</td>
                        <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">{item.title}</td>
                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[200px]">{item.video_url}</td>
                      </>
                    )}
                    {activeTab === 'vocabularies' && (
                      <>
                        <td className="px-4 py-3 text-sm font-bold text-blue-600 dark:text-blue-400">{item.word}</td>
                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{item.type}</td>
                        <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">{item.meaning}</td>
                      </>
                    )}
                    {activeTab === 'exams' && (
                      <>
                        <td className="px-4 py-3 text-sm font-bold text-slate-900 dark:text-white">{item.title}</td>
                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{item.time_limit}</td>
                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{item.pass_score}%</td>
                      </>
                    )}
                    <td className="px-4 py-3 text-right">
                      {activeTab === 'exams' && (
                        <button onClick={() => setSelectedExam(item)} className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 p-2 rounded-lg transition-colors mr-2" title="Quản lý câu hỏi">
                          <FileQuestion size={16} />
                        </button>
                      )}
                      <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg transition-colors mr-2">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-slate-500">Chưa có dữ liệu.</td>
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
                {editingItem ? 'Sửa ' : 'Thêm '}
                {activeTab === 'lessons' && 'Bài học'}
                {activeTab === 'vocabularies' && 'Từ vựng'}
                {activeTab === 'exams' && 'Bài kiểm tra'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 max-h-[70vh] overflow-y-auto">
              {activeTab === 'lessons' && (
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">YouTube/Video URL (Tùy chọn)</label>
                    <input type="text" value={lessonForm.video_url} onChange={e => setLessonForm({...lessonForm, video_url: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="https://youtube.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nội dung chi tiết (Text/Markdown)</label>
                    <textarea required rows={5} value={lessonForm.content} onChange={e => setLessonForm({...lessonForm, content: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                </form>
              )}

              {activeTab === 'vocabularies' && (
                <form id="content-form" onSubmit={handleSaveVocab} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Từ vựng (Tiếng Anh)</label>
                      <input type="text" required value={vocabForm.word} onChange={e => setVocabForm({...vocabForm, word: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Từ loại (n, v, adj...)</label>
                      <input type="text" required value={vocabForm.type} onChange={e => setVocabForm({...vocabForm, type: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phát âm (IPA)</label>
                    <input type="text" value={vocabForm.pronunciation} onChange={e => setVocabForm({...vocabForm, pronunciation: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="/həˈləʊ/" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ý nghĩa (Tiếng Việt)</label>
                    <input type="text" required value={vocabForm.meaning} onChange={e => setVocabForm({...vocabForm, meaning: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Câu ví dụ</label>
                    <textarea rows={2} value={vocabForm.example_sentence} onChange={e => setVocabForm({...vocabForm, example_sentence: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                </form>
              )}

              {activeTab === 'exams' && (
                <form id="content-form" onSubmit={handleSaveExam} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên bài kiểm tra</label>
                    <input type="text" required value={examForm.title} onChange={e => setExamForm({...examForm, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mô tả</label>
                    <textarea rows={2} value={examForm.description} onChange={e => setExamForm({...examForm, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thời gian (phút)</label>
                      <input type="number" required min={1} value={examForm.time_limit} onChange={e => setExamForm({...examForm, time_limit: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Điểm đạt (%)</label>
                      <input type="number" required min={1} max={100} value={examForm.pass_score} onChange={e => setExamForm({...examForm, pass_score: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  {editingItem && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                      <span>💡</span>
                      <p>Để quản lý câu hỏi của bài thi này, vui lòng bấm vào nút biểu tượng "Câu hỏi" ở màn hình danh sách Bài kiểm tra.</p>
                    </div>
                  )}
                </form>
              )}
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

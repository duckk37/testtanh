import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import InteractiveVideoPlayer from '../components/InteractiveVideoPlayer';
import LessonTest from '../components/LessonTest';
import LessonComments from '../components/LessonComments';
import { ChevronLeft, PlayCircle, Lock, CheckCircle2, FileText, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SkeletonSidebar, SkeletonVideo } from '../components/Skeleton';
import { API_URL } from '../config';

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'test'
  const [loading, setLoading] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);

  const fetchLessons = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`${API_URL}/courses/${courseId}/lessons`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) navigate('/login');
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then(data => {
        setLessons(data);
        if (data.length > 0 && !activeLesson) {
          setActiveLesson(data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching lessons:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId, user, navigate]);

  const handleLessonSelect = (lesson) => {
    if (lesson.is_unlocked) {
      setActiveLesson(lesson);
      setActiveTab('video');
      setVideoEnded(false);
    } else {
      const prevLesson = lessons.find(l => l.order_index === lesson.order_index - 1);
      const reqScore = prevLesson ? prevLesson.passing_score_required : 80;
      alert(`Bạn cần hoàn thành ${prevLesson ? prevLesson.title : 'bài trước đó'} và đạt ${reqScore}% để mở khóa bài này!`);
    }
  };

  const handleTestPassed = () => {
    // Refresh lessons to unlock the next one
    fetchLessons();
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-slate-50">
        <SkeletonSidebar />
        <SkeletonVideo />
      </div>
    );
  }

  if (lessons.length === 0) {
    return <div className="p-10 text-center text-slate-500">Khóa học này chưa có bài học nào.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-slate-50 font-sans">
      {/* Sidebar - Lesson List */}
      <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col h-full z-10">
        <div className="p-4 border-b border-slate-200">
          <Link to="/" className="flex items-center text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors">
            <ChevronLeft size={16} />
            Quay lại trang chủ
          </Link>
          <h2 className="font-bold text-lg text-slate-900">Danh sách bài học</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {lessons.map((lesson, index) => (
            <div 
              key={lesson.id}
              onClick={() => handleLessonSelect(lesson)}
              className={`p-4 mx-3 my-2 rounded-xl flex items-start gap-3 transition-all ${
                !lesson.is_unlocked ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'cursor-pointer hover:bg-slate-50 hover:shadow-sm'
              } ${activeLesson?.id === lesson.id ? 'bg-blue-50 border border-blue-200 shadow-sm' : 'border border-transparent'}`}
            >
              <div className={`mt-0.5 ${!lesson.is_unlocked ? 'text-slate-400' : lesson.is_completed ? 'text-green-500' : activeLesson?.id === lesson.id ? 'text-blue-600' : 'text-slate-400'}`}>
                {!lesson.is_unlocked ? <Lock size={20} /> : lesson.is_completed ? <CheckCircle2 size={20} /> : <PlayCircle size={20} />}
              </div>
              <div>
                <p className={`text-sm font-medium ${activeLesson?.id === lesson.id ? 'text-blue-700' : 'text-slate-700'}`}>
                  {index + 1}. {lesson.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {!lesson.is_unlocked ? 'Đã khóa' : lesson.is_completed ? 'Đã hoàn thành' : 'Đang học'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-slate-100">
        <div className="p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header Area */}
            <div className="bg-white p-6 rounded-t-2xl shadow-soft border border-slate-100 border-b-0">
              <h1 className="text-2xl font-bold text-slate-900 mb-4">{activeLesson?.title}</h1>
              
              {/* Tabs */}
              <div className="flex space-x-4 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`pb-3 px-2 flex items-center gap-2 font-medium text-sm transition-colors relative ${
                    activeTab === 'video' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Video size={18} /> Video Bài Giảng
                  {activeTab === 'video' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-md"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('test')}
                  className={`pb-3 px-2 flex items-center gap-2 font-medium text-sm transition-colors relative ${
                    activeTab === 'test' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <FileText size={18} /> Bài Kiểm Tra
                  {activeTab === 'test' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-md"></span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="bg-white shadow-soft border border-slate-100 rounded-b-2xl overflow-hidden p-6 mb-8">
              {activeTab === 'video' && activeLesson && (
                <>
                  <p className="text-slate-600 mb-6">Xem video, bật phụ đề và click vào bất kỳ từ nào để tra nghĩa. Bạn cần xem hết video để làm bài kiểm tra.</p>
                  <InteractiveVideoPlayer 
                    key={`video-${activeLesson.id}`} 
                    youtubeId={activeLesson.youtube_id}
                    onVideoEnd={() => setVideoEnded(true)}
                  />
                  
                  {(videoEnded || activeLesson.is_completed) && (
                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => setActiveTab('test')}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Chuyển sang Bài kiểm tra
                      </button>
                    </div>
                  )}
                  
                  <LessonComments lessonId={activeLesson.id} />
                </>
              )}

              {activeTab === 'test' && activeLesson && (
                <LessonTest 
                  key={`test-${activeLesson.id}`}
                  lesson={activeLesson}
                  onTestPassed={handleTestPassed}
                />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;

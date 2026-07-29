import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import InteractiveVideoPlayer from '../components/InteractiveVideoPlayer';
import LessonTest from '../components/LessonTest';
import LessonComments from '../components/LessonComments';
import Certificate from '../components/Certificate';
import { ChevronLeft, PlayCircle, Lock, CheckCircle2, FileText, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SkeletonSidebar, SkeletonVideo } from '../components/Skeleton';
import api from '../services/api';

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState(null);
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

    Promise.all([
      api.get(`/courses/${courseId}`),
      api.get(`/courses/${courseId}/lessons`)
    ])
      .then(([courseRes, lessonsRes]) => {
        setCourse(courseRes.data);
        const data = lessonsRes.data;
        setLessons(data);
        if (data.length > 0 && !activeLesson) {
          setActiveLesson(data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        if (err.response?.status === 401) navigate('/login');
        console.error("Error fetching data:", err);
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
      if (course && course.price > 0 && !course.is_purchased) {
        navigate(`/checkout?type=course&itemId=${course.id}`);
      } else {
        const prevLesson = lessons.find(l => l.order_index === lesson.order_index - 1);
        const reqScore = prevLesson ? prevLesson.passing_score_required : 80;
        alert(`Bạn cần hoàn thành ${prevLesson ? prevLesson.title : 'bài trước đó'} và đạt ${reqScore}% để mở khóa bài này!`);
      }
    }
  };

  const handleTestPassed = () => {
    // Refresh lessons to unlock the next one
    fetchLessons();
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900">
        <SkeletonSidebar />
        <SkeletonVideo />
      </div>
    );
  }

  if (lessons.length === 0) {
    return <div className="p-10 text-center text-slate-500 dark:text-slate-400">Khóa học này chưa có bài học nào.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 font-sans">
      {/* Sidebar - Lesson List */}
      <div className="w-full md:w-80 bg-white dark:bg-slate-800/50 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-10">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-4 transition-colors">
            <ChevronLeft size={16} />
            Quay lại trang chủ
          </Link>
          <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">Danh sách bài học</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {lessons.map((lesson, index) => (
            <div 
              key={lesson.id}
              onClick={() => handleLessonSelect(lesson)}
              className={`p-4 mx-2 my-2 rounded-xl flex items-start gap-3 transition-all ${
                !lesson.is_unlocked ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:shadow-sm'
              } ${activeLesson?.id === lesson.id ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 shadow-sm' : 'border border-transparent'}`}
            >
              <div className={`mt-0.5 ${!lesson.is_unlocked ? 'text-slate-400 dark:text-slate-500 dark:text-slate-400' : lesson.is_completed ? 'text-green-500' : activeLesson?.id === lesson.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 dark:text-slate-400'}`}>
                {!lesson.is_unlocked ? <Lock size={20} /> : lesson.is_completed ? <CheckCircle2 size={20} /> : <PlayCircle size={20} />}
              </div>
              <div>
                <p className={`text-sm font-medium ${activeLesson?.id === lesson.id ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                  {index + 1}. {lesson.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {!lesson.is_unlocked ? 'Đã khóa' : lesson.is_completed ? 'Đã hoàn thành' : 'Đang học'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-transparent">
        <div className="p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header Area */}
            {course && course.price > 0 && !course.is_purchased && (
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
                <div>
                  <h3 className="font-bold text-amber-900 dark:text-amber-100 text-lg flex items-center gap-2">
                    <Lock size={18} /> Khóa học Premium
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                    Bạn đang xem bài học thử miễn phí. Mua khóa học để mở khóa toàn bộ lộ trình và làm bài kiểm tra.
                  </p>
                </div>
                <button 
                  onClick={() => navigate(`/checkout?type=course&itemId=${course.id}`)}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2.5 rounded-xl transition-colors whitespace-nowrap shadow-sm hover:shadow"
                >
                  Mua ngay ({course.price.toLocaleString('vi-VN')}đ)
                </button>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-t-2xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-700/50 border-b-0">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{activeLesson?.title}</h1>
                <Certificate 
                  courseId={courseId} 
                  isEligible={lessons.length > 0 && lessons.every(l => l.is_completed)} 
                />
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-4 border-b border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`pb-3 px-2 flex items-center gap-2 font-medium text-sm transition-colors relative ${
                    activeTab === 'video' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
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
                    activeTab === 'test' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <FileText size={18} /> Bài Kiểm Tra
                  {activeTab === 'test' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-md"></span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-b-2xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-700/50 border-t-0 min-h-[500px]">
              {activeTab === 'video' && activeLesson && (
                <div className="animate-in fade-in duration-500">
                  <p className="text-slate-600 dark:text-slate-300 mb-6">Xem video, bật phụ đề và click vào bất kỳ từ nào để tra nghĩa. Bạn cần xem hết video để làm bài kiểm tra.</p>
                  <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-slate-900">
                    <InteractiveVideoPlayer 
                      youtubeId={activeLesson.youtube_id} 
                      subtitles={activeLesson.subtitles ? JSON.parse(activeLesson.subtitles) : []}
                      onVideoEnd={() => setVideoEnded(true)}
                    />
                  </div>
                  
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
                </div>
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

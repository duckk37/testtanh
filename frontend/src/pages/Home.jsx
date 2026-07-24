import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import ExamCard from '../components/ExamCard';
import { BookOpen, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';
import { API_URL } from '../config';

function Home() {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(API_URL + '/courses').then(res => res.json()),
      fetch(API_URL + '/exams').then(res => res.json())
    ])
    .then(([coursesData, examsData]) => {
      setCourses(coursesData);
      setExams(examsData);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching data:", err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6 border border-blue-100/50 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Nền tảng học tập chuẩn Quốc tế
          </div>
          
          <h1 className="text-4xl md:text-[56px] font-extrabold mb-6 leading-[1.15] text-slate-900 tracking-tight">
            Nâng tầm tiếng Anh của bạn <br className="hidden md:block" /> 
            với <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">BGKH English</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Học tiếng Anh chưa bao giờ dễ dàng đến thế. Trải nghiệm phương pháp học video tương tác, tra từ điển tức thì và hệ thống ôn tập thông minh SM-2.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#courses" className="btn-modern btn-primary-modern px-8 w-full sm:w-auto h-[56px] text-base">
              Khám phá khóa học <ArrowRight size={18} />
            </a>
            <a href="#exams" className="btn-modern bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-[1px] px-8 w-full sm:w-auto h-[56px] text-base shadow-sm">
              Làm bài kiểm tra
            </a>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-modern p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-5 border border-blue-200/50">
              <BookOpen size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Video Tương Tác 100%</h3>
            <p className="text-[14.5px] text-slate-500 leading-relaxed">Dừng video và tra từ trực tiếp trên phụ đề. Không cần dùng thêm từ điển bên ngoài, lưu từ mới tự động vào sổ tay.</p>
          </div>
          
          <div className="card-modern p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 border border-emerald-200/50">
              <CheckCircle size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Trí Tuệ Nhân Tạo (SM-2)</h3>
            <p className="text-[14.5px] text-slate-500 leading-relaxed">Thuật toán lặp lại ngắt quãng SM-2 phân tích và nhắc bạn ôn tập đúng lúc bạn sắp quên từ vựng đó.</p>
          </div>
          
          <div className="card-modern p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-5 border border-purple-200/50">
              <Award size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Mở Khóa Lộ Trình</h3>
            <p className="text-[14.5px] text-slate-500 leading-relaxed">Phải hoàn thành bài kiểm tra đạt điểm chuẩn mới được học bài tiếp theo. Đảm bảo chất lượng đầu ra.</p>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-[32px] font-bold text-slate-900 mb-2">Khóa Học Phổ Biến</h2>
            <p className="text-slate-500">Được hàng ngàn học viên tin tưởng lựa chọn</p>
          </div>
          <a href="#" className="hidden sm:flex text-blue-600 font-bold items-center gap-1 hover:text-blue-700">
            Xem tất cả <ArrowRight size={16} />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Exams Section */}
      <div id="exams" className="bg-gradient-to-b from-white to-slate-50 border-t border-slate-100 mt-12 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-bold text-slate-900 mb-2">Luyện Thi Thực Tế</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Hệ thống ngân hàng đề thi khổng lồ được cập nhật liên tục bám sát cấu trúc đề thi chính thức.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {exams.map(exam => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

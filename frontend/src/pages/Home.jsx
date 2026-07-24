import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import ExamCard from '../components/ExamCard';
import { BookOpen, Award, CheckCircle } from 'lucide-react';

function Home() {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/courses').then(res => res.json()),
      fetch('http://localhost:8000/exams').then(res => res.json())
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
    return <div className="p-10 text-center text-slate-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Hệ thống Học Tiếng Anh Tương Tác
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl">
              Cải thiện kỹ năng Nghe - Đọc - Hiểu thông qua các khóa học video tương tác và hệ thống đề thi sát với thực tế. Tra từ điển tức thời ngay trong lúc học.
            </p>
            <div className="flex gap-4">
              <a href="#courses" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                Xem khóa học
              </a>
              <a href="#exams" className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors">
                Làm đề thi thử
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Video Tương Tác</h3>
              <p className="text-sm text-slate-600">Click để tra từ trực tiếp trên phụ đề, lưu từ vựng tự động.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Ôn Tập Thông Minh</h3>
              <p className="text-sm text-slate-600">Thuật toán SM-2 giúp ghi nhớ từ vựng hiệu quả hơn 300%.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Award size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Đề Thi Bám Sát</h3>
              <p className="text-sm text-slate-600">Ngân hàng đề thi thử bám sát cấu trúc của Bộ GD&ĐT.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Khóa Học Nổi Bật</h2>
          <div className="w-20 h-1 bg-blue-600 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Exams Section */}
      <div id="exams" className="bg-slate-100 py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Đề Thi Thử Mới Nhất</h2>
            <div className="w-20 h-1 bg-blue-600 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

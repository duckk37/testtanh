import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Map, CheckCircle, Circle, ArrowRight, BrainCircuit, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function Roadmap() {
  const navigate = useNavigate();
  
  const fetchRoadmap = async () => {
    const res = await api.get('/learning-path/current');
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['current_roadmap'],
    queryFn: fetchRoadmap
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Đang tải lộ trình...</div>;
  }

  if (data && !data.exists) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] max-w-lg mx-auto text-center px-4">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <BrainCircuit size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Chưa có Lộ trình</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
          Hãy làm một bài kiểm tra trình độ ngắn để AI thiết kế Lộ trình học 7 ngày dành riêng cho bạn!
        </p>
        <button 
          onClick={() => navigate('/placement-test')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-md text-lg w-full sm:w-auto"
        >
          Bắt đầu Test ngay
        </button>
      </div>
    );
  }

  const { level, current_day, roadmap, recommended_course_id } = data;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 mt-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 flex items-center justify-center gap-3">
          <Map className="text-emerald-500" size={36} /> Lộ trình 7 Ngày
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
          Lộ trình được AI thiết kế riêng dựa trên điểm yếu của bạn.
        </p>
        <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-xl text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/50">
          <span>Trình độ đánh giá:</span>
          <span className="uppercase text-blue-600 dark:text-blue-400">{level}</span>
        </div>
      </div>

      {recommended_course_id && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg mb-12 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Sparkles size={24} className="text-yellow-300" />
              Khóa học đề xuất cho bạn
            </h3>
            <p className="text-emerald-50 max-w-md">
              AI nhận thấy khóa học này phù hợp nhất để khắc phục các điểm yếu của bạn.
            </p>
          </div>
          <Link to={`/courses/${recommended_course_id}`} className="mt-4 md:mt-0 bg-white text-emerald-600 hover:bg-emerald-50 font-bold py-3 px-6 rounded-xl transition-colors shadow-sm whitespace-nowrap">
            Khám phá ngay
          </Link>
        </div>
      )}

      <div className="relative border-l-4 border-slate-200 dark:border-slate-700 ml-6 md:ml-12 space-y-12 pb-12">
        {roadmap && roadmap.map((dayData, index) => {
          const isCompleted = dayData.day < current_day;
          const isCurrent = dayData.day === current_day;
          const isLocked = dayData.day > current_day;
          
          return (
            <div key={index} className="relative pl-8 md:pl-12">
              {/* Timeline dot */}
              <div className={`absolute -left-[14px] md:-left-[22px] top-1 p-1 rounded-full bg-white dark:bg-slate-900 ${
                isCompleted ? 'text-emerald-500' : isCurrent ? 'text-blue-500' : 'text-slate-300 dark:text-slate-600'
              }`}>
                {isCompleted ? <CheckCircle size={28} className="bg-white dark:bg-slate-900 rounded-full" /> : <Circle size={28} className={isCurrent ? 'fill-blue-100 dark:fill-blue-900/50' : 'fill-slate-100 dark:fill-slate-800'} strokeWidth={3} />}
              </div>

              {/* Content Card */}
              <div className={`rounded-3xl p-6 md:p-8 border-2 transition-all shadow-sm ${
                isCurrent 
                  ? 'border-blue-500 bg-white dark:bg-slate-800 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-4 ring-blue-50 dark:ring-blue-900/20' 
                  : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/10 dark:border-emerald-800/30'
                    : 'border-slate-100 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-800 opacity-75'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <span className={`font-black text-xl md:text-2xl ${
                    isCompleted ? 'text-emerald-500' : isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                  }`}>
                    Ngày {dayData.day}
                  </span>
                  <div className={`h-1 flex-1 rounded-full ${isCurrent ? 'bg-blue-100 dark:bg-blue-900' : 'bg-transparent'}`}></div>
                </div>
                
                <h3 className={`text-xl font-bold mb-6 ${
                  isCurrent ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                }`}>
                  {dayData.title}
                </h3>
                
                <ul className="space-y-4 mb-8">
                  {dayData.tasks.map((task, tIdx) => (
                    <li key={tIdx} className={`flex items-start gap-3 ${isLocked ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      <div className={`mt-1 rounded-full p-1 shrink-0 ${isCurrent ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                        <CheckCircle size={14} />
                      </div>
                      <span className="leading-relaxed">{task}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent && (
                  <Link to="/courses" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                    Bắt đầu học <ArrowRight size={18} />
                  </Link>
                )}
                {isLocked && (
                  <span className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    🔒 Hãy hoàn thành các ngày trước để mở khóa
                  </span>
                )}
                {isCompleted && (
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    ✨ Đã hoàn thành
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { memo } from 'react';
import { BookOpen, Clock, Users, PlayCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.id}`} className="block group">
      <div className="bg-white dark:bg-slate-800 rounded-[22px] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-glow-hover transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-video relative overflow-hidden bg-slate-100">
          {course.thumbnail ? (
            <img 
              src={course.thumbnail} 
              alt={course.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-slate-200">
              <BookOpen size={48} />
            </div>
          )}
          <div className="absolute top-3 left-3 px-3 py-1 bg-white dark:bg-slate-800/90 backdrop-blur text-[11px] font-bold text-blue-700 rounded-full flex items-center gap-1 shadow-sm">
            <Star size={12} className="fill-blue-500 text-blue-500" /> Nổi bật
          </div>
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <div className="w-14 h-14 bg-white dark:bg-slate-800/90 rounded-full flex items-center justify-center text-blue-600 shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
              <PlayCircle size={28} />
            </div>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="font-bold text-[17px] text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          
          <div className="flex items-center gap-4 text-[13px] text-slate-500 dark:text-slate-400 mb-4">
            <div className="flex items-center gap-1.5">
              <Clock size={15} />
              <span>40+ video</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={15} />
              <span>1.2k học viên</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50/80">
            <div>
              <span className="font-bold text-[17px] text-blue-600">
                {course.price > 0 ? `${course.price.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
              </span>
            </div>
            <div className="text-[13.5px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              Vào học ngay
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(CourseCard);

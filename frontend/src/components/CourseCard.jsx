import React from 'react';
import { BookOpen, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-slate-200 relative overflow-hidden">
        {course.thumbnail ? (
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <BookOpen size={48} />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>40+ video</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>1.2k học viên</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="font-bold text-blue-600">
            {course.price > 0 ? `${course.price.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
          </span>
          <Link 
            to={`/courses/${course.id}`}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Vào học
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;

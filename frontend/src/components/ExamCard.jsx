import React, { memo } from 'react';
import { FileText, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

function ExamCard({ exam }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-5 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
        <FileText size={24} />
      </div>
      
      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
        {exam.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
        {exam.description}
      </p>
      
      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>{exam.duration_minutes} phút</span>
        </div>
        <div className="flex items-center gap-1">
          <Award size={16} />
          <span>Thi thử</span>
        </div>
      </div>

      <Link 
        to={`/exams/${exam.id}`}
        className="block w-full text-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
      >
        Làm bài
      </Link>
    </div>
  );
}

export default memo(ExamCard);

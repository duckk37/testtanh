import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import OverviewTab from '../components/admin/OverviewTab';
import CoursesTab from '../components/admin/CoursesTab';
import UsersTab from '../components/admin/UsersTab';
import VocabulariesTab from '../components/admin/VocabulariesTab';
import ExamsTab from '../components/admin/ExamsTab';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        navigate('/login');
        return;
      }
    }

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, [navigate, user, loading]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-200">
      
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm z-10 transition-colors duration-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ShieldAlert className="text-blue-600" size={24} />
            Admin Panel
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Tổng quan</span>
            {activeTab === 'overview' && <ChevronRight size={16} className="ml-auto" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'courses' ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen size={20} />
            <span className="font-medium">Khóa học</span>
            {activeTab === 'courses' && <ChevronRight size={16} className="ml-auto" />}
          </button>

          <button 
            onClick={() => setActiveTab('vocabularies')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'vocabularies' ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen size={20} />
            <span className="font-medium">Từ vựng</span>
            {activeTab === 'vocabularies' && <ChevronRight size={16} className="ml-auto" />}
          </button>

          <button 
            onClick={() => setActiveTab('exams')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'exams' ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp size={20} />
            <span className="font-medium">Đề thi</span>
            {activeTab === 'exams' && <ChevronRight size={16} className="ml-auto" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'users' ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users size={20} />
            <span className="font-medium">Người dùng</span>
            {activeTab === 'users' && <ChevronRight size={16} className="ml-auto" />}
          </button>
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4 py-2 text-sm font-medium">
            <ChevronRight size={16} className="rotate-180" />
            Về trang chủ
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'courses' && <CoursesTab />}
        {activeTab === 'vocabularies' && <VocabulariesTab />}
        {activeTab === 'exams' && <ExamsTab />}
        {activeTab === 'users' && <UsersTab />}
      </div>
    </div>
  );
}

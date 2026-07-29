import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, BookOpen, PenTool, Trophy, User, Settings, LogOut, Target, ShoppingCart, BarChart2, Youtube, MessageSquare, Map, HelpCircle } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: '/roadmap', label: 'Lộ trình AI', icon: Map, iconColor: 'text-blue-500' },
    { path: '/flashcards', label: 'Sổ tay', icon: BookOpen },
    { path: '/writing', label: 'Luyện viết', icon: PenTool, iconColor: 'text-indigo-500' },
    { path: '/quests', label: 'Nhiệm vụ', icon: Target, iconColor: 'text-orange-500' },
    { path: '/store', label: 'Cửa hàng', icon: ShoppingCart, iconColor: 'text-fuchsia-500' },
    { path: '/analytics', label: 'Thống kê', icon: BarChart2, iconColor: 'text-cyan-500' },
    { path: '/video', label: 'Học qua Video', icon: Youtube, iconColor: 'text-red-500' },
    { path: '/leaderboard', label: 'BXH', icon: Trophy, iconColor: 'text-yellow-500' },
    { path: '/guide', label: 'Hướng dẫn', icon: HelpCircle, iconColor: 'text-green-500' }
  ];

  if (user && user.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Admin', icon: Settings });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out md:static md:translate-x-0 ${isOpen ? 'translate-x-0 w-64 md:w-64' : '-translate-x-full w-64 md:w-0 overflow-hidden md:border-r-0 px-0'}`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800/60">
          <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 font-sans tracking-tight">
            EnglishMaster
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-blue-600 dark:text-blue-400' : (item.iconColor || 'text-slate-400 dark:text-slate-400')} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="px-4 mb-4">
          <button 
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl font-bold transition-colors border border-indigo-100 dark:border-indigo-800"
            onClick={() => {
              if (window.deferredPrompt) {
                window.deferredPrompt.prompt();
                window.deferredPrompt.userChoice.then(() => {
                  window.deferredPrompt = null;
                });
              } else {
                alert("Bạn có thể cài đặt ứng dụng này từ menu của trình duyệt (Install App / Add to Home Screen).");
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Tải App
          </button>
        </div>

        {user ? (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Link 
              to="/profile" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold uppercase">
                {user.username.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate dark:text-slate-200">{user.username}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
            </Link>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <LogOut size={16} /> Đăng xuất
            </button>
          </div>
        ) : (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
            >
              <User size={18} /> Đăng nhập
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

export default memo(Sidebar);

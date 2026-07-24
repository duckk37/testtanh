import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LogOut, User, Flame, Settings, BookOpen, Trophy, Moon, Sun, PenTool } from 'lucide-react';

const Home = lazy(() => import('./pages/Home'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const ExamDetail = lazy(() => import('./pages/ExamDetail'));
const Auth = lazy(() => import('./pages/Auth'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Flashcard = lazy(() => import('./pages/Flashcard'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const WritingPractice = lazy(() => import('./pages/WritingPractice'));

function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 font-sans">EnglishMaster</Link>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              title="Giao diện Sáng/Tối"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user ? (
              <>
                <div className="flex items-center space-x-1 mr-2 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 px-3 py-1.5 rounded-xl text-orange-600 dark:text-orange-400 font-bold border border-orange-100 dark:border-orange-800 shadow-sm">
                  <Flame size={18} className="text-orange-500" />
                  <span>{user.streak_count || 0}</span>
                </div>
                <div className="flex items-center space-x-1 mr-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 px-3 py-1.5 rounded-xl text-yellow-600 dark:text-yellow-400 font-bold border border-yellow-100 dark:border-yellow-800 shadow-sm">
                  <span className="text-yellow-500">🪙</span>
                  <span>{user.coins || 0}</span>
                </div>
                
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-slate-600 hover:text-blue-600 mr-2 flex items-center">
                    <Settings size={18} className="mr-1" />
                    Admin
                  </Link>
                )}
                
                <Link to="/flashcards" className="text-slate-600 hover:text-blue-600 mr-4 flex items-center">
                  <BookOpen size={18} className="mr-1" />
                  Sổ tay
                </Link>

                <Link to="/writing" className="text-slate-600 hover:text-blue-600 mr-4 flex items-center">
                  <PenTool size={18} className="mr-1 text-indigo-500" />
                  Luyện viết
                </Link>

                <Link to="/leaderboard" className="text-slate-600 hover:text-blue-600 mr-4 flex items-center font-bold">
                  <Trophy size={18} className="mr-1 text-yellow-500" />
                  BXH
                </Link>

                <Link to="/profile" className="flex items-center text-slate-600 hover:text-blue-600 mr-4">
                  <User size={18} className="mr-1" />
                  <span className="font-medium text-sm">{user.username}</span>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors"
                >
                  <LogOut size={16} className="mr-1.5" /> Đăng xuất
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-[1px] shadow-glow hover:shadow-glow-hover px-5 py-2.5 rounded-xl transition-all"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <Header />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-blue-600 font-medium">Đang tải trang...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/flashcards" element={<Flashcard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/writing" element={<WritingPractice />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/exams/:examId" element={<ExamDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

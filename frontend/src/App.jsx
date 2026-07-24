import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogOut, User, Flame, Settings, BookOpen } from 'lucide-react';

const Home = lazy(() => import('./pages/Home'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const ExamDetail = lazy(() => import('./pages/ExamDetail'));
const Auth = lazy(() => import('./pages/Auth'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Flashcard = lazy(() => import('./pages/Flashcard'));

function Header() {
  const { user, logout } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-blue-600 font-sans">EnglishMaster</Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-1 mr-4 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-1.5 rounded-xl text-orange-600 font-bold border border-orange-100 shadow-sm">
                  <Flame size={18} className="text-orange-500" />
                  <span>{user.streak_count || 0}</span>
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
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-blue-600 font-medium">Đang tải trang...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/flashcards" element={<Flashcard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/exams/:examId" element={<ExamDetail />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

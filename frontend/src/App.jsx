import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import ExamDetail from './pages/ExamDetail';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogOut, User, Flame, Settings } from 'lucide-react';

function Header() {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-blue-600 font-sans">EnglishMaster</Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-1 mr-4 bg-orange-50 px-3 py-1 rounded-full text-orange-600 font-bold border border-orange-100">
                  <Flame size={18} />
                  <span>{user.streak_count || 0}</span>
                </div>
                
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-slate-600 hover:text-blue-600 mr-2 flex items-center">
                    <Settings size={18} className="mr-1" />
                    Admin
                  </Link>
                )}

                <Link to="/profile" className="flex items-center text-slate-600 hover:text-blue-600 mr-4">
                  <User size={18} className="mr-1" />
                  <span className="font-medium text-sm">{user.username}</span>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-md transition-colors"
                >
                  <LogOut size={16} className="mr-1" /> Đăng xuất
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/exams/:examId" element={<ExamDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

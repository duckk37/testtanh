import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

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

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  // Add toggle function to handle state flipping instead of just forcing true
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto relative">
          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-medium">
              Đang tải trang...
            </div>
          }>
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
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

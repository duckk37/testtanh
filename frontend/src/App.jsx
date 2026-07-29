import React, { Suspense, lazy, useState, Component } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AIChatWidget from './components/AIChatWidget';
import { AnimatePresence, motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
const Quests = lazy(() => import('./pages/Quests'));
const Store = lazy(() => import('./pages/Store'));
const Analytics = lazy(() => import('./pages/Analytics'));
const VideoPlayer = lazy(() => import('./pages/VideoPlayer'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const PlacementTest = lazy(() => import('./pages/PlacementTest'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Guide = lazy(() => import('./pages/Guide'));
const PaymentReturn = lazy(() => import('./pages/PaymentReturn'));

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 }
};
const pageTransition = { type: "tween", ease: "anticipate", duration: 0.3 };

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="h-full"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/flashcards" element={<Flashcard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/writing" element={<WritingPractice />} />
          <Route path="/quests" element={<Quests />} />
          <Route path="/store" element={<Store />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/video" element={<VideoPlayer />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/placement-test" element={<PlacementTest />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-return" element={<PaymentReturn />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/exams/:examId" element={<ExamDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

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
            <AnimatedRoutes />
          </Suspense>
        </main>
        
        {/* Render globally available widget */}
        <AIChatWidget />
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-6 text-center">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Đã có lỗi xảy ra</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
            Hệ thống gặp sự cố ngoài ý muốn. Vui lòng tải lại trang để tiếp tục trải nghiệm học tập của bạn.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-colors"
          >
            Tải lại trang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

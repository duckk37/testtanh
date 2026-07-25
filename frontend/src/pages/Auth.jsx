import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, BookOpen } from 'lucide-react';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="card-modern w-full max-w-[452px] p-8 md:p-10">
        
        {/* Brand Header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-50 border border-blue-100 shadow-sm overflow-hidden">
            <BookOpen size={32} className="text-blue-600" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-2">Bài giảng khóa học</p>
          <h2 className="text-[24px] font-bold text-slate-900 dark:text-slate-100 mb-2">
            {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản học viên'}
          </h2>
          <p className="text-[14.5px] text-slate-500 dark:text-slate-400">
            {isLogin ? 'Đăng nhập để tiếp tục học tập trên hệ thống BGKH' : 'Bắt đầu hành trình học tập cùng BGKH'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-sm font-medium text-center mb-6 flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Họ và tên"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-modern"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <UserIcon size={19} />
              </span>
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              required
              placeholder="Địa chỉ Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-modern"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Mail size={19} />
            </span>
          </div>

          <div className="relative">
            <input
              type="password"
              required
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-modern"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock size={19} />
            </span>
          </div>

          {isLogin && (
            <div className="flex items-center gap-2 mt-2 mb-4 cursor-pointer">
              <input type="checkbox" id="remember" className="w-[18px] h-[18px] accent-blue-600 cursor-pointer" defaultChecked />
              <label htmlFor="remember" className="text-[13.5px] text-slate-500 dark:text-slate-400 cursor-pointer">Ghi nhớ đăng nhập (30 ngày)</label>
            </div>
          )}

          <div className="pt-2">
            <button type="submit" className="btn-modern btn-primary-modern">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
              <span>{isLogin ? 'Đăng nhập hệ thống' : 'Tạo tài khoản'}</span>
            </button>
          </div>
        </form>

        <div className="text-center mt-6 text-[13.5px] text-slate-500 dark:text-slate-400">
          {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-blue-700 hover:text-blue-600"
          >
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </div>

        <div className="flex justify-center items-center gap-2 flex-wrap mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50 text-[11.5px] font-bold text-slate-400">
          <span>BGKH</span>
          <div className="w-[3px] h-[3px] rounded-full bg-slate-300"></div>
          <span>Bảo mật học viên</span>
          <div className="w-[3px] h-[3px] rounded-full bg-slate-300"></div>
          <span>Học tập chất lượng cao</span>
        </div>

      </div>
    </div>
  );
}

export default Auth;

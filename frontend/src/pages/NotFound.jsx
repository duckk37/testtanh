import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm p-10 max-w-md w-full text-center border border-slate-100">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-blue-600">404</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Trang không tồn tại</h1>
        <p className="text-slate-600 mb-8">
          Đường dẫn bạn đang cố truy cập không tồn tại hoặc đã bị gỡ bỏ.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <Home size={20} />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

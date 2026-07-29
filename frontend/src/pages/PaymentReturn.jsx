import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function PaymentReturn() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Send the entire query string to the backend to verify signature and update DB
        const res = await api.get(`/checkout/vnpay_return${location.search}`);
        if (res.data.success) {
          setStatus('success');
          setMessage(res.data.message || 'Thanh toán thành công!');
        } else {
          setStatus('error');
          setMessage(res.data.message || 'Thanh toán thất bại hoặc bị hủy.');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Có lỗi xảy ra khi xác thực thanh toán.');
      }
    };

    if (location.search) {
      verifyPayment();
    } else {
      setStatus('error');
      setMessage('Không tìm thấy thông tin giao dịch.');
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4 pb-12">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 text-center border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300">
        
        {status === 'loading' && (
          <div className="py-8">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Đang xác thực...</h2>
            <p className="text-slate-500 dark:text-slate-400">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Giao dịch thành công!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">{message}</p>
            <div className="flex gap-4">
              <Link to="/store" className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-xl font-medium transition-colors">
                Cửa hàng
              </Link>
              <Link to="/roadmap" className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                Vào học ngay
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Giao dịch thất bại</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">{message}</p>
            <button 
              onClick={() => navigate(-1)} 
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-xl font-medium transition-colors"
            >
              Quay lại thử lại
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

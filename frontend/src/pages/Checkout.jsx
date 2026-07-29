import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CreditCard, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Wallet } from 'lucide-react';
import api from '../services/api';

function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const type = searchParams.get('type'); // 'course' or 'coins'
  const itemId = searchParams.get('itemId'); // courseId if type === 'course'
  const amount = parseInt(searchParams.get('amount') || '0', 10);
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [itemDetails, setItemDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (type === 'course' && itemId) {
          const res = await api.get(`/courses/${itemId}`);
          setItemDetails(res.data);
        } else if (type === 'coins' && amount > 0) {
          setItemDetails({
            title: `Gói ${amount} Coins`,
            price: amount * 200, // 200 VND / coin
            isCoins: true
          });
        } else {
          setError('Thông tin thanh toán không hợp lệ.');
        }
      } catch (err) {
        setError('Không thể tải thông tin thanh toán.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [type, itemId, amount]);

  const handlePayment = async () => {
    setProcessing(true);
    setError('');
    
    try {
      let res;
      if (type === 'course') {
        res = await api.post(`/checkout/course/${itemId}`);
      } else if (type === 'coins') {
        res = await api.post(`/checkout/coins`, { amount });
      }
      
      if (res.data && res.data.payment_url) {
        // Chuyển hướng người dùng sang Cổng thanh toán VNPay
        window.location.href = res.data.payment_url;
      } else {
        // Nếu khoá học miễn phí hoặc đã mua
        setSuccess(true);
        setProcessing(false);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Khởi tạo thanh toán thất bại. Vui lòng thử lại.');
      setProcessing(false);
    }
  };

  const handleReturn = () => {
    if (type === 'course') {
      navigate(`/courses/${itemId}`);
    } else {
      navigate('/store');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !processing && !success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 text-center border border-slate-200 dark:border-slate-700">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Lỗi thanh toán</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button onClick={() => navigate(-1)} className="btn-modern btn-primary-modern w-full py-3">Quay lại</button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 text-center border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Thanh toán thành công!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            {type === 'course' 
              ? 'Bạn đã mở khóa thành công toàn bộ nội dung khóa học.'
              : `Bạn đã nạp thành công ${amount} Coins vào tài khoản.`}
          </p>
          <button onClick={handleReturn} className="btn-modern btn-primary-modern w-full py-3">
            {type === 'course' ? 'Vào học ngay' : 'Quay lại Cửa hàng'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Chi tiết đơn hàng</h2>
              </div>
              
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100 dark:border-blue-800">
                    {type === 'course' ? <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" /> : <Wallet className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{itemDetails?.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {type === 'course' ? 'Khóa học Premium trọn đời' : 'Gói nạp tiền ảo (Coins)'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Phương thức thanh toán</h4>
                  
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'vnpay' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-slate-900 dark:text-white">Thẻ ATM nội địa / VNPay</span>
                    </div>
                    <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" alt="VNPay" className="h-6" />
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'momo' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-slate-900 dark:text-white">Ví MoMo</span>
                    </div>
                    <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="h-6 object-contain" />
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-slate-900 dark:text-white">Thẻ Tín dụng / Ghi nợ (Stripe)</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-8 h-5 bg-slate-200 dark:bg-slate-700 rounded text-[8px] font-bold flex items-center justify-center text-slate-500">VISA</div>
                      <div className="w-8 h-5 bg-slate-200 dark:bg-slate-700 rounded text-[8px] font-bold flex items-center justify-center text-slate-500">MC</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 sticky top-24">
              <div className="p-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Tóm tắt thanh toán</h3>
                
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Tạm tính</span>
                    <span className="font-medium text-slate-900 dark:text-white">{(itemDetails?.price || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Mã giảm giá</span>
                    <span className="text-slate-400 italic">Không có</span>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-slate-900 dark:text-white">Tổng cộng</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {(itemDetails?.price || 0).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handlePayment} 
                  disabled={processing}
                  className="btn-modern btn-primary-modern w-full py-4 text-base relative"
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" /> Đang xử lý...
                    </span>
                  ) : (
                    'Thanh toán ngay'
                  )}
                </button>
                
                <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
                  Bằng việc bấm Thanh toán, bạn đồng ý với Điều khoản dịch vụ của chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

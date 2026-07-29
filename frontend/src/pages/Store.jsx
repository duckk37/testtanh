import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Shield, Palette, Zap, Wallet } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Store() {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState('');

  const fetchItems = async () => {
    const res = await api.get('/store/items');
    return res.data;
  };

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['store_items'],
    queryFn: fetchItems
  });

  const buyItemMutation = useMutation({
    mutationFn: async (itemId) => {
      try {
        const res = await api.post(`/store/buy/${itemId}`);
        return res.data;
      } catch (error) {
        throw new Error(error.response?.data?.detail || 'Purchase failed');
      }
    },
    onSuccess: (data, variables) => {
      setPurchaseSuccess(`Mua vật phẩm thành công!`);
      setPurchaseError('');
      // Update local user state
      setUser(prev => ({
        ...prev,
        coins: data.new_balance || prev.coins, // Fallback if API response changes
        streak_shields: variables === 'shield_1' ? (prev.streak_shields || 0) + 1 : prev.streak_shields,
        unlocked_themes: variables.startsWith('theme_') 
          ? (prev.unlocked_themes ? `${prev.unlocked_themes},${variables}` : variables) 
          : prev.unlocked_themes,
        active_theme: variables.startsWith('theme_') ? variables : prev.active_theme
      }));
      // If applying themes requires page reload for AuthContext change, we might need a small timeout
      setTimeout(() => setPurchaseSuccess(''), 3000);
    },
    onError: (error) => {
      setPurchaseError(error.message);
      setPurchaseSuccess('');
      setTimeout(() => setPurchaseError(''), 3000);
    }
  });

  const getIcon = (type) => {
    switch (type) {
      case 'shield': return <Shield size={32} className="text-blue-500" />;
      case 'theme': return <Palette size={32} className="text-fuchsia-500" />;
      default: return <Zap size={32} className="text-yellow-500" />;
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Đang tải cửa hàng...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center justify-center gap-3">
          <ShoppingCart className="text-fuchsia-500" /> Cửa hàng
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Dùng Xu để mua các vật phẩm hữu ích và trang trí tài khoản.</p>
        
        <div className="inline-flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/30 px-4 py-2 rounded-xl text-yellow-600 dark:text-yellow-400 font-bold border border-yellow-200 dark:border-yellow-800/50 mt-4 shadow-sm">
          <span>Số dư của bạn:</span>
          <span className="text-xl">🪙 {user?.coins || 0}</span>
        </div>
      </div>

      {/* Nạp Coins Section */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Wallet className="text-blue-500" /> Nạp thêm Coins
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 p-6 rounded-3xl border border-blue-200 dark:border-blue-700 text-center shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">Gói Cơ Bản</h3>
            <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-6 flex items-center justify-center gap-1">100 <span className="text-2xl">🪙</span></div>
            <button onClick={() => navigate('/checkout?type=coins&amount=100')} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm">Mua 20.000đ</button>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40 p-6 rounded-3xl border-2 border-amber-300 dark:border-amber-600 text-center shadow-md relative transform md:-translate-y-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">PHỔ BIẾN NHẤT</div>
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-2">Gói Tiêu Chuẩn</h3>
            <div className="text-4xl font-black text-amber-600 dark:text-amber-400 mb-6 flex items-center justify-center gap-1">500 <span className="text-2xl">🪙</span></div>
            <button onClick={() => navigate('/checkout?type=coins&amount=500')} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors shadow-sm">Mua 90.000đ</button>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 p-6 rounded-3xl border border-purple-200 dark:border-purple-700 text-center shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-2">Gói Cao Cấp</h3>
            <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-6 flex items-center justify-center gap-1">1000 <span className="text-2xl">🪙</span></div>
            <button onClick={() => navigate('/checkout?type=coins&amount=1000')} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors shadow-sm">Mua 150.000đ</button>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <ShoppingCart className="text-fuchsia-500" /> Vật phẩm & Chủ đề
        </h2>
      </div>

      {purchaseSuccess && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl text-center font-medium">
          {purchaseSuccess}
        </div>
      )}
      
      {purchaseError && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center font-medium">
          {purchaseError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const isOwnedTheme = item.type === 'theme' && user?.unlocked_themes?.includes(item.id);
          
          return (
            <div 
              key={item.id} 
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-100 dark:border-slate-700 hover:border-fuchsia-200 dark:hover:border-slate-600 transition-all flex flex-col items-center text-center shadow-sm"
            >
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
                {getIcon(item.type)}
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">{item.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">{item.description}</p>
              
              {isOwnedTheme ? (
                <button 
                  disabled
                  className="w-full py-3 px-4 rounded-xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                >
                  Đã sở hữu
                </button>
              ) : (
                <button 
                  onClick={() => buyItemMutation.mutate(item.id)}
                  disabled={buyItemMutation.isPending || (user?.coins || 0) < item.price}
                  className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    (user?.coins || 0) >= item.price 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {buyItemMutation.isPending && buyItemMutation.variables === item.id ? 'Đang xử lý...' : (
                    <>
                      Mua với <span className="text-yellow-400">🪙 {item.price}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

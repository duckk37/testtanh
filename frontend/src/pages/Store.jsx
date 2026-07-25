import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Shield, Palette, Zap } from 'lucide-react';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Import this to optionally apply theme immediately

export default function Store() {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState('');

  const fetchItems = async () => {
    const res = await fetch(`${API_URL}/store/items`);
    if (!res.ok) throw new Error('Failed to fetch items');
    return res.json();
  };

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['store_items'],
    queryFn: fetchItems
  });

  const buyItemMutation = useMutation({
    mutationFn: async (itemId) => {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/store/buy/${itemId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Purchase failed');
      }
      return res.json();
    },
    onSuccess: (data, variables) => {
      setPurchaseSuccess(`Mua vật phẩm thành công!`);
      setPurchaseError('');
      // Update local user state
      setUser(prev => ({
        ...prev,
        CircleDollarSign: data.CircleDollarSign,
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
        
        <div className="inline-flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/30 px-4 py-2 rounded-xl text-yellow-600 dark:text-yellow-400 font-bold border border-yellow-200 dark:border-yellow-800/50 mt-4">
          <span>Số dư của bạn:</span>
          <span className="text-xl">🪙 {user?.CircleDollarSign || 0}</span>
        </div>
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
                  disabled={buyItemMutation.isPending || (user?.CircleDollarSign || 0) < item.price}
                  className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    (user?.CircleDollarSign || 0) >= item.price 
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

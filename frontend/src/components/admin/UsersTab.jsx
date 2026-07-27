import React, { useState, useEffect } from 'react';
import { Flame, MoreVertical, CircleDollarSign, Trash2, ShieldAlert, X } from 'lucide-react';
import { API_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  
  // Modal for adding CircleDollarSign
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [coinAmount, setCoinAmount] = useState(100);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(API_URL + '/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (targetUser) => {
    if (targetUser.id === currentUser?.id) {
      alert("Bạn không thể tự thay đổi quyền của chính mình.");
      return;
    }
    
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const confirmMsg = targetUser.role === 'admin' 
      ? `Hạ cấp ${targetUser.username} xuống học viên bình thường?` 
      : `Thăng cấp ${targetUser.username} lên làm Admin?`;
      
    if (!window.confirm(confirmMsg)) return;

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/admin/users/${targetUser.id}/role`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(`Lỗi: ${data.detail || "Không thể thay đổi quyền"}`);
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const handleDelete = async (targetUser) => {
    if (targetUser.id === currentUser?.id) {
      alert("Bạn không thể tự xóa tài khoản của chính mình.");
      return;
    }

    if (!window.confirm(`Xóa vĩnh viễn người dùng ${targetUser.username}? Hành động này KHÔNG THỂ hoàn tác!`)) return;

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/admin/users/${targetUser.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(`Lỗi: ${data.detail || "Không thể xóa người dùng"}`);
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const handleAddCoins = async (e) => {
    e.preventDefault();
    if (!selectedUser || coinAmount <= 0) return;

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/admin/users/${selectedUser.id}/coins`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coins: coinAmount })
      });
      
      if (res.ok) {
        setShowCoinModal(false);
        fetchUsers();
      } else {
        alert("Có lỗi xảy ra khi cộng xu.");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  const openCoinModal = (user) => {
    setSelectedUser(user);
    setCoinAmount(100);
    setShowCoinModal(true);
  };

  if (loading) return <div className="text-center p-10 text-slate-500 dark:text-slate-400">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 pb-20">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Danh sách Người dùng</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Học viên</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tài sản (Xu)</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Chăm chỉ</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-yellow-600 dark:text-yellow-500 font-bold flex items-center gap-1">
                      <CircleDollarSign size={14} /> {u.coins || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {u.role === 'admin' ? (
                      <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">Admin</span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800">Học viên</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {u.streak_count > 0 ? (
                      <span className="flex items-center gap-1 text-orange-600 font-bold bg-orange-50 dark:bg-orange-900/30 px-2.5 py-1 rounded-md w-fit border border-orange-100 dark:border-orange-800/50">
                        <Flame size={16} /> {u.streak_count} ngày
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm">Chưa học</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleRoleChange(u)}
                        title={u.role === 'admin' ? "Giáng cấp" : "Thăng cấp Admin"}
                        className={`p-1.5 rounded-lg transition-colors ${u.role === 'admin' ? 'text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40' : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-700'}`}
                      >
                        <ShieldAlert size={18} />
                      </button>
                      <button 
                        onClick={() => openCoinModal(u)}
                        title="Tặng Xu"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <CircleDollarSign size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(u)}
                        title="Xóa tài khoản"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">Chưa có người dùng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coin Modal */}
      {showCoinModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CircleDollarSign className="text-yellow-500" /> Tặng Xu
              </h2>
              <button onClick={() => setShowCoinModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCoins} className="p-5 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Tài khoản: <strong className="text-blue-600 dark:text-blue-400">{selectedUser?.username}</strong>
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Số Xu muốn cộng thêm</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-bold">+</span>
                  </div>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(parseInt(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-medium" 
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors shadow-sm mt-4">
                Xác nhận
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

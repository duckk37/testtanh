import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, Moon, Sun, Flame } from 'lucide-react';

export default function Header({ toggleSidebar }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/60 shadow-sm dark:shadow-none transition-colors duration-200 h-16 shrink-0">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        
        {/* Menu button */}
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Empty div for flex spacing on desktop if needed, or page title */}
        <div className="hidden md:block font-bold text-slate-800 dark:text-slate-200">
          {/* We can put page title here later using context or router */}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3 ml-auto">
          {user && (
            <>
              <div className="flex items-center space-x-1.5 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 px-3 py-1.5 rounded-xl text-orange-600 dark:text-orange-400 font-bold border border-orange-100 dark:border-orange-800/50 shadow-sm">
                <Flame size={18} className="text-orange-500" />
                <span>{user.streak_count || 0}</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 px-3 py-1.5 rounded-xl text-yellow-600 dark:text-yellow-400 font-bold border border-yellow-100 dark:border-yellow-800/50 shadow-sm">
                <span className="text-yellow-500">🪙</span>
                <span>{user.coins || 0}</span>
              </div>
            </>
          )}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            title="Giao diện Sáng/Tối"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

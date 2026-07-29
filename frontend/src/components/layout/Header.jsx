import React, { memo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, Moon, Sun, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-30 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border-b border-border shadow-glass transition-all duration-300 h-[72px] shrink-0"
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Menu button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="p-2.5 -ml-2 rounded-2xl text-slate-500 hover:bg-primary/10 hover:text-primary dark:text-slate-400 dark:hover:bg-primary/20 transition-colors"
        >
          <Menu size={24} />
        </motion.button>

        {/* Empty div for flex spacing on desktop if needed, or page title */}
        <div className="hidden md:block font-display font-bold text-lg text-slate-800 dark:text-slate-200 tracking-tight">
          {/* We can put page title here later using context or router */}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4 ml-auto">
          {user && (
            <>
              <motion.div 
                whileHover={{ y: -2 }}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/20 px-3.5 py-2 rounded-2xl text-orange-600 dark:text-orange-400 font-bold border border-orange-500/20 shadow-sm"
              >
                <Flame size={18} className="text-orange-500 drop-shadow-md" />
                <span>{user.streak_count || 0}</span>
                {user.streak_shields > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-blue-500/20 text-blue-600 dark:bg-blue-500/30 dark:text-blue-400 rounded-lg text-xs flex items-center shadow-sm" title="Khiên bảo vệ">
                    🛡️ {user.streak_shields}
                  </span>
                )}
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -2 }}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 dark:from-yellow-500/20 dark:to-amber-500/20 px-3.5 py-2 rounded-2xl text-yellow-600 dark:text-yellow-400 font-bold border border-yellow-500/20 shadow-sm"
              >
                <span className="text-yellow-500 drop-shadow-md">🪙</span>
                <span>{user.CircleDollarSign || 0}</span>
              </motion.div>
            </>
          )}
          
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            title="Giao diện Sáng/Tối"
          >
            {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default memo(Header);

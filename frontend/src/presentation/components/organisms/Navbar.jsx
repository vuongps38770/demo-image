import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useCursorStore } from '../../store/cursorStore';
import { LogOut, Sun, Moon, Sparkles } from 'lucide-react';
import Button from '../atoms/Button';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { isEnabled: isCursorEnabled, toggleCursor } = useCursorStore();

  return (
    <header className="w-full h-14 px-6 flex justify-between items-center bg-white dark:bg-black border-b border-black dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-150 font-mono">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-[#eb0004] text-white rounded-none">
          <Sparkles size={14} />
        </div>
        <span className="font-extrabold text-xs md:text-sm tracking-widest uppercase">
          IMAGE <span className="text-[#eb0004] font-black">[STUDIO]</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Cursor Toggle */}
        <button
          onClick={toggleCursor}
          className={`px-3 py-1.5 rounded-none transition-all duration-150 border text-[10px] font-bold tracking-wider ${
            isCursorEnabled
              ? 'bg-[#eb0004] text-white border-[#eb0004] active:bg-[#c00003]'
              : 'bg-white hover:bg-black hover:text-white dark:bg-black dark:hover:bg-white dark:hover:text-black text-black dark:text-zinc-400 border-black dark:border-zinc-800'
          }`}
          title="Toggle Custom Cursor"
        >
          [CURSOR: {isCursorEnabled ? 'ON' : 'OFF'}]
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-none bg-white hover:bg-black hover:text-white dark:bg-black dark:hover:bg-white dark:hover:text-black text-black dark:text-zinc-400 transition-all duration-150 border border-black dark:border-zinc-800"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={13} /> : <Sun size={13} className="text-red-500" />}
        </button>

        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-black dark:border-zinc-800">
            <span className="hidden sm:inline text-[10px] font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-widest pl-1.5">
              ({user.username})
            </span>
            
            <div className="sm:hidden flex items-center justify-center w-7 h-7 bg-zinc-100 dark:bg-zinc-950 border border-black dark:border-zinc-800 text-black dark:text-white font-bold text-xs uppercase rounded-none">
              {user.username[0]}
            </div>

            <Button
              variant="secondary"
              onClick={logout}
              className="!px-3 !py-1.5 !text-[9px] border border-black dark:border-zinc-800 flex items-center gap-1 font-bold"
            >
              <LogOut size={11} />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

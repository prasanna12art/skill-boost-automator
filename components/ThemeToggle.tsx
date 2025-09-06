import React from 'react';
import { useAppContext } from '../state/appContext';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useAppContext();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900 overflow-hidden"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Sun Icon */}
      <SunIcon
        className={`absolute w-6 h-6 text-yellow-500 transition-all duration-300 ease-in-out
          ${theme === 'dark' ? 'transform rotate-0 opacity-100' : 'transform -rotate-90 opacity-0'}`
        }
      />
      {/* Moon Icon */}
      <MoonIcon
        className={`absolute w-6 h-6 text-primary-500 transition-all duration-300 ease-in-out
          ${theme === 'light' ? 'transform rotate-0 opacity-100' : 'transform rotate-90 opacity-0'}`
        }
      />
    </button>
  );
};


import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { BookOpenIcon } from './icons/BookOpenIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-lg sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BookOpenIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              GCP Lab Companion
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

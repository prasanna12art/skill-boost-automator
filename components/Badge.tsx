
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color, className = '' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    gray: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
};

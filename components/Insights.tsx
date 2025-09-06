
import React, { useEffect } from 'react';
import { useAppContext } from '../state/appContext';
import ReactMarkdown from 'react-markdown';
import { LightbulbIcon } from './icons/LightbulbIcon';

export const Insights: React.FC = () => {
  const { insights, isLoadingInsights, fetchInsights } = useAppContext();

  useEffect(() => {
    // FIX: fetchInsights was not being called.
    if (!insights && !isLoadingInsights) {
        fetchInsights();
    }
  }, [fetchInsights, insights, isLoadingInsights]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <LightbulbIcon className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI-Powered Insights</h2>
      </div>
      {isLoadingInsights ? (
        <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mt-4"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        </div>
      ) : (
        insights && (
            <div className="prose prose-slate dark:prose-invert max-w-none prose-h3:text-lg prose-h3:font-semibold">
                <ReactMarkdown>{insights}</ReactMarkdown>
            </div>
        )
      )}
    </div>
  );
};

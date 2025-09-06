import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../state/appContext';
import { SearchIcon } from './icons/SearchIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { LabStatus, Difficulty } from '../types';
import { TagIcon } from './icons/TagIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';

// A custom hook to detect clicks outside a component
function useOutsideAlerter(ref: React.RefObject<HTMLDivElement>, callback: () => void) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);
}


export const FilterBar: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortBy,
    setSortBy,
  } = useAppContext();

  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showDifficultyFilter, setShowDifficultyFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const difficultyRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(statusRef, () => setShowStatusFilter(false));
  useOutsideAlerter(difficultyRef, () => setShowDifficultyFilter(false));
  useOutsideAlerter(sortRef, () => setShowSort(false));

  const handleStatusChange = (status: LabStatus) => {
    const newStatusFilters = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    setFilters({ ...filters, status: newStatusFilters });
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    const newDifficultyFilters = filters.difficulty.includes(difficulty)
      ? filters.difficulty.filter(d => d !== difficulty)
      : [...filters.difficulty, difficulty];
    setFilters({ ...filters, difficulty: newDifficultyFilters });
  };

  const sortOptions: { value: keyof Lab | 'default'; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'title', label: 'Title' },
    { value: 'status', label: 'Status' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'estimatedTime', label: 'Time' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row items-center gap-4">
      <div className="relative w-full sm:flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search labs by title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Status Filter */}
        <div className="relative" ref={statusRef}>
          <button
            onClick={() => setShowStatusFilter(!showStatusFilter)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            <TagIcon className="w-4 h-4" />
            Status {filters.status.length > 0 && `(${filters.status.length})`}
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${showStatusFilter ? 'rotate-180' : ''}`} />
          </button>
          {showStatusFilter && (
            <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {Object.values(LabStatus).map(status => (
                  <label key={status} className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                    <input type="checkbox" checked={filters.status.includes(status)} onChange={() => handleStatusChange(status)} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-3">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Difficulty Filter */}
        <div className="relative" ref={difficultyRef}>
          <button
            onClick={() => setShowDifficultyFilter(!showDifficultyFilter)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            <TagIcon className="w-4 h-4" />
            Difficulty {filters.difficulty.length > 0 && `(${filters.difficulty.length})`}
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${showDifficultyFilter ? 'rotate-180' : ''}`} />
          </button>
          {showDifficultyFilter && (
             <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5">
             <div className="py-1">
               {Object.values(Difficulty).map(difficulty => (
                 <label key={difficulty} className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                   <input type="checkbox" checked={filters.difficulty.includes(difficulty)} onChange={() => handleDifficultyChange(difficulty)} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                   <span className="ml-3">{difficulty}</span>
                 </label>
               ))}
             </div>
           </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative" ref={sortRef}>
           <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"
           >
            {sortBy === 'estimatedTime' ? <ArrowDownIcon className="w-4 h-4" /> : <ArrowUpIcon className="w-4 h-4" />}
            Sort By
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${showSort ? 'rotate-180' : ''}`} />
           </button>
           {showSort && (
            <div className="absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {sortOptions.map(option => (
                  <button key={option.value} onClick={() => { setSortBy(option.value); setShowSort(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

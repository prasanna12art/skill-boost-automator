
import React from 'react';
import { Lab, LabStatus, Difficulty } from '../types';
import { Badge } from './Badge';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { BarChartIcon } from './icons/BarChartIcon';
import { ClockIcon } from './icons/ClockIcon';

interface LabItemProps {
  lab: Lab;
  onSelect: (lab: Lab) => void;
}

const statusColors: { [key in LabStatus]: 'green' | 'blue' | 'yellow' | 'purple' | 'gray' } = {
  [LabStatus.Completed]: 'green',
  [LabStatus.Mastered]: 'green',
  [LabStatus.InProgress]: 'blue',
  [LabStatus.ReviewNeeded]: 'yellow',
  [LabStatus.NotStarted]: 'gray',
};

const difficultyColors: { [key in Difficulty]: 'green' | 'blue' | 'yellow' | 'red' } = {
    [Difficulty.Beginner]: 'green',
    [Difficulty.Intermediate]: 'blue',
    [Difficulty.Advanced]: 'yellow',
    [Difficulty.Expert]: 'red',
};


export const LabItem: React.FC<LabItemProps> = ({ lab, onSelect }) => {
  const progress = lab.steps.length > 0 ? (lab.steps.filter(s => s.isCompleted).length / lab.steps.length) * 100 : (lab.status === LabStatus.Completed || lab.status === LabStatus.Mastered ? 100 : 0);

  return (
    <button
      type="button"
      onClick={() => onSelect(lab)}
      aria-label={`View details for ${lab.title}, status: ${lab.status}`}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col justify-between overflow-hidden w-full text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{lab.title}</h3>
            <Badge color={statusColors[lab.status]}>{lab.status}</Badge>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 h-10 overflow-hidden">{lab.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
            {lab.gcpServices.map(service => (
                <Badge key={service} color="gray">{service}</Badge>
            ))}
        </div>

        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
                <BookOpenIcon className="w-4 h-4" />
                <span>{lab.course}</span>
            </div>
            <div className="flex items-center gap-2">
                <BarChartIcon className="w-4 h-4" />
                <Badge color={difficultyColors[lab.difficulty]} className="capitalize">{lab.difficulty}</Badge>
            </div>
            <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                <span>{lab.estimatedTime} minutes</span>
            </div>
        </div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-700/50 p-4">
        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
          <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-right mt-1">{Math.round(progress)}% Complete</p>
      </div>
    </button>
  );
};

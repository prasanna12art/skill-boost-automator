import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Lab, LabStatus } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartProps {
  labs: Lab[];
  theme: 'light' | 'dark';
}

const statusColors = {
  [LabStatus.Completed]: '#22c55e',
  [LabStatus.Mastered]: '#16a34a',
  [LabStatus.InProgress]: '#3b82f6',
  [LabStatus.ReviewNeeded]: '#eab308',
  [LabStatus.NotStarted]: '#64748b',
};

export const LabsByStatusChart: React.FC<ChartProps> = ({ labs, theme }) => {
  const statusCounts = labs.reduce((acc, lab) => {
    acc[lab.status] = (acc[lab.status] || 0) + 1;
    return acc;
  }, {} as { [key in LabStatus]: number });

  const data = {
    labels: Object.keys(statusCounts) as LabStatus[],
    datasets: [
      {
        label: '# of Labs',
        data: Object.values(statusCounts),
        backgroundColor: Object.keys(statusCounts).map(status => statusColors[status as LabStatus]),
        borderColor: theme === 'dark' ? '#1e293b' : '#ffffff', // slate-800 or white
        borderWidth: 2,
        hoverOffset: 8,
        hoverBorderColor: theme === 'dark' ? '#334155' : '#f1f5f9',
        hoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: theme === 'dark' ? '#cbd5e1' : '#475569', // slate-300 or slate-600
          boxWidth: 12,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#334155' : '#ffffff', // slate-700 or white
        titleColor: theme === 'dark' ? '#f1f5f9' : '#1e293b', // slate-100 or slate-800
        bodyColor: theme === 'dark' ? '#cbd5e1' : '#475569', // slate-300 or slate-600
        borderColor: theme === 'dark' ? '#475569' : '#e2e8f0', // slate-600 or slate-200
        borderWidth: 1,
        padding: 10,
      },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Labs by Status</h3>
      {labs.length > 0 ? (
        <div className="relative flex-grow h-64">
          <Doughnut data={data} options={options} />
        </div>
      ) : (
        <p className="text-slate-500 dark:text-slate-400 text-center flex-grow flex items-center justify-center">No lab data to display.</p>
      )}
    </div>
  );
};
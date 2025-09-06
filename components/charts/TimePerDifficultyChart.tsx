import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Lab, Difficulty } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  labs: Lab[];
  theme: 'light' | 'dark';
}

const difficultyColors = {
    [Difficulty.Beginner]: '#22c55e',
    [Difficulty.Intermediate]: '#3b82f6',
    [Difficulty.Advanced]: '#eab308',
    [Difficulty.Expert]: '#ef4444',
};

const difficultyHoverColors = {
    [Difficulty.Beginner]: '#16a34a',
    [Difficulty.Intermediate]: '#2563eb',
    [Difficulty.Advanced]: '#ca8a04',
    [Difficulty.Expert]: '#dc2626',
};

const difficultyOrder = [Difficulty.Beginner, Difficulty.Intermediate, Difficulty.Advanced, Difficulty.Expert];

export const TimePerDifficultyChart: React.FC<ChartProps> = ({ labs, theme }) => {
    const timeByDifficulty = labs.reduce((acc, lab) => {
        if (!acc[lab.difficulty]) {
            acc[lab.difficulty] = { totalTime: 0, count: 0 };
        }
        acc[lab.difficulty].totalTime += lab.estimatedTime;
        acc[lab.difficulty].count += 1;
        return acc;
    }, {} as { [key in Difficulty]: { totalTime: number; count: number } });

    const labels = difficultyOrder.filter(d => timeByDifficulty[d]);
    const chartData = labels.map(difficulty => {
        const data = timeByDifficulty[difficulty];
        return data.count > 0 ? Math.round(data.totalTime / data.count) : 0;
    });

  const data = {
    labels,
    datasets: [
      {
        label: 'Avg. Minutes',
        data: chartData,
        backgroundColor: labels.map(d => difficultyColors[d]),
        hoverBackgroundColor: labels.map(d => difficultyHoverColors[d]),
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: theme === 'dark' ? '#334155' : '#e2e8f0', // slate-700 or slate-200
            },
            ticks: {
                color: theme === 'dark' ? '#cbd5e1' : '#64748b', // slate-300 or slate-500
            }
        },
        x: {
             grid: {
                display: false,
            },
            ticks: {
                color: theme === 'dark' ? '#cbd5e1' : '#64748b', // slate-300 or slate-500
            }
        }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#334155' : '#ffffff',
        titleColor: theme === 'dark' ? '#f1f5f9' : '#1e293b',
        bodyColor: theme === 'dark' ? '#cbd5e1' : '#475569',
        borderColor: theme === 'dark' ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw} min`;
          }
        }
      },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Avg. Time by Difficulty</h3>
      {labs.length > 0 ? (
        <div className="relative flex-grow h-64">
          <Bar options={options} data={data} />
        </div>
        ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center flex-grow flex items-center justify-center">No lab data to display.</p>
        )}
    </div>
  );
};
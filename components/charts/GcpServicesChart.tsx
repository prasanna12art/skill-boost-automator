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
import { Lab } from '../../types';

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

export const GcpServicesChart: React.FC<ChartProps> = ({ labs, theme }) => {
    const serviceCounts = labs.flatMap(lab => lab.gcpServices).reduce((acc, service) => {
        acc[service] = (acc[service] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const sortedServices = Object.entries(serviceCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 7)
        .reverse(); // Reverse for horizontal chart display

    const labels = sortedServices.map(([service]) => service);
    const chartData = sortedServices.map(([, count]) => count);
    
    const data = {
        labels,
        datasets: [
          {
            label: 'Lab Count',
            data: chartData,
            backgroundColor: '#3b82f6', // primary-500
            hoverBackgroundColor: '#2563eb', // primary-600
            borderRadius: 4,
          },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    color: theme === 'dark' ? '#334155' : '#e2e8f0', // slate-700 or slate-200
                },
                ticks: {
                    color: theme === 'dark' ? '#cbd5e1' : '#64748b', // slate-300 or slate-500
                    precision: 0,
                }
            },
            y: {
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
          },
        },
    };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Most Used GCP Services</h3>
        {labs.length > 0 && sortedServices.length > 0 ? (
            <div className="relative flex-grow h-80">
                <Bar options={options} data={data} />
            </div>
        ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center flex-grow flex items-center justify-center">No GCP service data to display.</p>
        )}
    </div>
  );
};
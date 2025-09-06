
import React from 'react';
import { useAppContext } from './state/appContext';
import { Header } from './components/Header';
import { LabList } from './components/LabList';
import { LabDetailModal } from './components/LabDetailModal';
import { FilterBar } from './components/FilterBar';
import { Insights } from './components/Insights';
import { LabsByStatusChart } from './components/charts/LabsByStatusChart';
import { TimePerDifficultyChart } from './components/charts/TimePerDifficultyChart';
import { GcpServicesChart } from './components/charts/GcpServicesChart';

function App() {
  const { selectedLab, labs, theme } = useAppContext();

  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <Insights />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
                <LabsByStatusChart labs={labs} theme={theme} />
            </div>
            <div className="lg:col-span-1">
                <TimePerDifficultyChart labs={labs} theme={theme} />
            </div>
            <div className="lg:col-span-1">
                <GcpServicesChart labs={labs} theme={theme} />
            </div>
        </div>
        
        <FilterBar />
        <LabList />
      </main>
      {selectedLab && <LabDetailModal />}
    </div>
  );
}

export default App;

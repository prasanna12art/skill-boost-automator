import React from 'react';
import { useAppContext } from '../state/appContext';
import { LabItem } from './LabItem';

export const LabList: React.FC = () => {
  const { filteredLabs, selectLab } = useAppContext();

  if (filteredLabs.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No Labs Found</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredLabs.map(lab => (
        <LabItem key={lab.id} lab={lab} onSelect={(selectedLab) => selectLab(selectedLab.id)} />
      ))}
    </div>
  );
};

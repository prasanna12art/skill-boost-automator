
import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../state/appContext';
import { Badge } from './Badge';
import { LabStatus, Difficulty, LabStep } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { RefreshCwIcon } from './icons/RefreshCwIcon';
import { CheckIcon } from './icons/CheckIcon';

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


export const LabDetailModal: React.FC = () => {
  const { selectedLab, selectLab, updateLab, generateStepsForLab, runCopilot, pauseCopilot, resetCopilot } = useAppContext();
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  const isGeneratingSteps = useRef(false);

  useEffect(() => {
    if (selectedLab && selectedLab.steps.length === 0 && !isGeneratingSteps.current) {
      isGeneratingSteps.current = true;
      generateStepsForLab(selectedLab.id).finally(() => {
        isGeneratingSteps.current = false;
      });
    }
  }, [selectedLab, generateStepsForLab]);
  
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedLab?.copilotSession.logs]);

  if (!selectedLab) return null;

  const handleStepToggle = (stepId: string) => {
    const updatedSteps = selectedLab.steps.map(step =>
      step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step
    );
    updateLab({ ...selectedLab, steps: updatedSteps });
  };

  const copilotStatus = selectedLab.copilotSession.status;
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedLab.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge color={statusColors[selectedLab.status]}>{selectedLab.status}</Badge>
              <Badge color={difficultyColors[selectedLab.difficulty]}>{selectedLab.difficulty}</Badge>
            </div>
          </div>
          <button onClick={() => selectLab(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close modal">
            <CloseIcon className="w-6 h-6 text-slate-500" />
          </button>
        </header>
        
        <main className="flex-grow overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side: Steps */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Lab Steps</h3>
            {selectedLab.steps.length > 0 ? (
              <ul className="space-y-3">
                {selectedLab.steps.map((step, index) => (
                  <li key={step.id} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={`step-${step.id}`}
                      checked={step.isCompleted}
                      onChange={() => handleStepToggle(step.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor={`step-${step.id}`} className="flex-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{index + 1}. {step.title}</span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{step.instructions}</p>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-lg p-8 text-center">
                    <SparklesIcon className="w-12 h-12 text-primary-500 mb-4 animate-pulse" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Generating Lab Steps with Gemini...</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Please wait a moment.</p>
                </div>
            )}
          </div>

          {/* Right Side: Copilot */}
          <div className="flex flex-col bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">AI Copilot</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Simulate lab execution step-by-step.</p>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto bg-black text-white font-mono text-sm">
                {selectedLab.copilotSession.logs.map((log, index) => (
                    <div key={index} className="flex">
                        <span className="text-green-400 mr-2">&gt;</span>
                        <p>{log}</p>
                    </div>
                ))}
                {copilotStatus === 'Running' && (
                    <div className="flex">
                        <span className="text-green-400 mr-2">&gt;</span>
                        <span className="animate-pulse">_</span>
                    </div>
                )}
                <div ref={logsEndRef} />
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Status: <span className="font-semibold">{copilotStatus}</span>
              </div>
              <div className="flex items-center gap-2">
                {copilotStatus !== 'Running' ? (
                  <button 
                    onClick={() => runCopilot(selectedLab.id)} 
                    disabled={copilotStatus === 'Completed'}
                    className="px-3 py-1.5 bg-primary-600 text-white rounded-md flex items-center gap-2 text-sm font-semibold hover:bg-primary-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    <PlayIcon className="w-4 h-4" />
                    {copilotStatus === 'Paused' || copilotStatus === 'Error' ? 'Resume' : 'Start'}
                  </button>
                ) : (
                  <button onClick={() => pauseCopilot(selectedLab.id)} className="px-3 py-1.5 bg-amber-500 text-white rounded-md flex items-center gap-2 text-sm font-semibold hover:bg-amber-600">
                    <PauseIcon className="w-4 h-4" />
                    Pause
                  </button>
                )}
                <button 
                  onClick={() => resetCopilot(selectedLab.id)} 
                  className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                  aria-label="Reset Copilot"
                  >
                  <RefreshCwIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

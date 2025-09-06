import React, { createContext, useContext, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Lab, LabStatus, Difficulty, LabStep, CopilotSession } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_LABS } from '../constants';
import { generateLabSteps, generateInsights } from '../services/geminiService';

// FIX: Implement the AppContext to provide state and actions to the application.
interface AppContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    labs: Lab[];
    updateLab: (updatedLab: Lab) => void;
    selectedLab: Lab | null;
    selectLab: (labId: string | null) => void;
    filteredLabs: Lab[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filters: {
        status: LabStatus[];
        difficulty: Difficulty[];
    };
    setFilters: (filters: AppContextType['filters']) => void;
    sortBy: keyof Lab | 'default';
    setSortBy: (sortBy: keyof Lab | 'default') => void;
    generateStepsForLab: (labId: string) => Promise<void>;
    runCopilot: (labId: string) => void;
    pauseCopilot: (labId: string) => void;
    resetCopilot: (labId: string) => void;
    insights: string | null;
    isLoadingInsights: boolean;
    fetchInsights: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
    const [labs, setLabs] = useLocalStorage<Lab[]>('labs', INITIAL_LABS);
    const [selectedLabId, setSelectedLabId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<{ status: LabStatus[]; difficulty: Difficulty[] }>({ status: [], difficulty: [] });
    const [sortBy, setSortBy] = useState<keyof Lab | 'default'>('default');
    const [insights, setInsights] = useState<string | null>(null);
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    
    const copilotTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const updateLab = useCallback((updatedLab: Lab) => {
        setLabs(prevLabs => prevLabs.map(lab => lab.id === updatedLab.id ? updatedLab : lab));
    }, [setLabs]);

    const selectLab = (labId: string | null) => {
        setSelectedLabId(labId);
    };

    const selectedLab = useMemo(() => labs.find(lab => lab.id === selectedLabId) || null, [labs, selectedLabId]);

    const filteredLabs = useMemo(() => {
        let result = labs
            .filter(lab => lab.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(lab => filters.status.length === 0 || filters.status.includes(lab.status))
            .filter(lab => filters.difficulty.length === 0 || filters.difficulty.includes(lab.difficulty));

        if (sortBy !== 'default') {
            result.sort((a, b) => {
                if (sortBy === 'title' || sortBy === 'status' || sortBy === 'difficulty') {
                    return String(a[sortBy]).localeCompare(String(b[sortBy]));
                }
                if (sortBy === 'estimatedTime') {
                    return (a[sortBy] as number) - (b[sortBy] as number);
                }
                return 0;
            });
        }
        return result;
    }, [labs, searchTerm, filters, sortBy]);
    
    const generateStepsForLab = useCallback(async (labId: string) => {
        const lab = labs.find(l => l.id === labId);
        if (!lab || lab.steps.length > 0) return;

        try {
            const generatedStepsData = await generateLabSteps(lab.title, lab.description);
            const newSteps: LabStep[] = generatedStepsData.map((step, index) => ({
                ...step,
                id: `${lab.id}-${index + 1}`,
                isCompleted: false,
            }));
            updateLab({ ...lab, steps: newSteps });
        } catch (error) {
            console.error("Failed to generate steps for lab:", error);
        }
    }, [labs, updateLab]);

    const fetchInsights = useCallback(async () => {
        if (isLoadingInsights) return;
        setIsLoadingInsights(true);
        try {
            const result = await generateInsights(labs);
            setInsights(result);
        } catch (error) {
            console.error("Failed to fetch insights:", error);
            setInsights("Could not load insights at this time.");
        } finally {
            setIsLoadingInsights(false);
        }
    }, [labs, isLoadingInsights]);

    const runCopilot = useCallback((labId: string) => {
        setLabs(prevLabs => prevLabs.map(lab => 
            lab.id === labId 
            ? { ...lab, copilotSession: { ...lab.copilotSession, status: 'Running' } }
            : lab
        ));

        const runStep = () => {
            setLabs(currentLabs => {
                const labToUpdate = currentLabs.find(l => l.id === labId);

                if (!labToUpdate || labToUpdate.copilotSession.status !== 'Running') {
                    if (copilotTimerRef.current) clearTimeout(copilotTimerRef.current);
                    return currentLabs;
                }

                let { currentStepIndex, logs } = labToUpdate.copilotSession;
                const steps = labToUpdate.steps;

                // FIX: Type inference issue on copilotSession.status.
                // By breaking out the ternary operator into an if statement and explicitly typing the new lab object,
                // we ensure TypeScript correctly infers the type and avoids widening the status property to `string`.
                if (currentStepIndex >= steps.length) {
                    if (copilotTimerRef.current) clearTimeout(copilotTimerRef.current);
                    const newLogs = [...logs, 'Simulation completed successfully.'];
                    return currentLabs.map(l => {
                        if (l.id === labId) {
                            const updatedLab: Lab = { 
                                ...l, 
                                copilotSession: { ...l.copilotSession, status: 'Completed', logs: newLogs } 
                            };
                            return updatedLab;
                        }
                        return l;
                    });
                }

                const currentStep = steps[currentStepIndex];
                const newLogs = [...logs, `Executing step ${currentStepIndex + 1}: ${currentStep.title}...`];
                const updatedSteps = labToUpdate.steps.map((step, index) => index === currentStepIndex ? { ...step, isCompleted: true } : step);
                
                const updatedLab: Lab = {
                    ...labToUpdate,
                    steps: updatedSteps,
                    copilotSession: {
                        status: 'Running',
                        currentStepIndex: currentStepIndex + 1,
                        logs: newLogs,
                    },
                };
                
                copilotTimerRef.current = setTimeout(runStep, 1500);
                return currentLabs.map(l => l.id === labId ? updatedLab : l);
            });
        };

        copilotTimerRef.current = setTimeout(runStep, 500);
    }, [setLabs]);

    const pauseCopilot = useCallback((labId: string) => {
        if (copilotTimerRef.current) clearTimeout(copilotTimerRef.current);
        setLabs(prevLabs => prevLabs.map(lab =>
            lab.id === labId && lab.copilotSession.status === 'Running'
            ? { ...lab, copilotSession: { ...lab.copilotSession, status: 'Paused' } }
            : lab
        ));
    }, [setLabs]);

    const resetCopilot = useCallback((labId: string) => {
        if (copilotTimerRef.current) clearTimeout(copilotTimerRef.current);
        setLabs(prevLabs => prevLabs.map(lab => {
            if (lab.id === labId) {
                const resetSteps = lab.steps.map(step => ({ ...step, isCompleted: false }));
                return {
                    ...lab,
                    steps: resetSteps,
                    copilotSession: {
                        status: 'Idle',
                        currentStepIndex: 0,
                        logs: [],
                    },
                };
            }
            return lab;
        }));
    }, [setLabs]);
    
    useEffect(() => {
        return () => {
            if (copilotTimerRef.current) clearTimeout(copilotTimerRef.current);
        }
    }, []);

    const value = {
        theme,
        toggleTheme,
        labs,
        updateLab,
        selectedLab,
        selectLab,
        filteredLabs,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        sortBy,
        setSortBy,
        generateStepsForLab,
        runCopilot,
        pauseCopilot,
        resetCopilot,
        insights,
        isLoadingInsights,
        fetchInsights,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
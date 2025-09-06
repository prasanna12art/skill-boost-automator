
export enum LabStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
  ReviewNeeded = 'Review Needed',
  Mastered = 'Mastered',
}

export enum Difficulty {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert',
}

export interface LabStep {
  id: string;
  title: string;
  instructions: string;
  isCompleted: boolean;
}

export interface CopilotSession {
  status: 'Idle' | 'Running' | 'Paused' | 'Completed' | 'Error';
  currentStepIndex: number;
  logs: string[];
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  course: string;
  difficulty: Difficulty;
  status: LabStatus;
  estimatedTime: number; // in minutes
  notes: string;
  gcpServices: string[];
  steps: LabStep[];
  copilotSession: CopilotSession;
}

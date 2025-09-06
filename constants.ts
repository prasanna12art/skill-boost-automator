import { Lab, LabStatus, Difficulty } from './types';

export const INITIAL_LABS: Lab[] = [
  {
    id: '1',
    title: 'A Tour of Google Cloud Hands-on Labs',
    description: 'An introductory lab to get familiar with the Google Cloud console and Qwiklabs environment.',
    course: 'Google Cloud Essentials',
    difficulty: Difficulty.Beginner,
    status: LabStatus.Completed,
    estimatedTime: 30,
    notes: 'Straightforward introduction. The gcloud command line is powerful.',
    gcpServices: ['Cloud Console', 'Cloud Shell'],
    steps: [
        { id: '1-1', title: 'Start Lab', instructions: 'Click the "Start Lab" button.', isCompleted: true },
        { id: '1-2', title: 'Open Google Console', instructions: 'Use the provided credentials to open the Google Cloud Console in a new incognito window.', isCompleted: true },
        { id: '1-3', title: 'Activate Cloud Shell', instructions: 'Activate the Cloud Shell and explore the `gcloud` command.', isCompleted: true },
        { id: '1-4', title: 'End Lab', instructions: 'Click the "End Lab" button and submit.', isCompleted: true },
    ],
    copilotSession: {
        status: 'Completed',
        currentStepIndex: 4,
        logs: ['Session completed.'],
    }
  },
  {
    id: '2',
    title: 'Creating a Virtual Machine',
    description: 'Learn how to create a Compute Engine instance and connect to it.',
    course: 'Google Cloud Essentials',
    difficulty: Difficulty.Beginner,
    status: LabStatus.InProgress,
    estimatedTime: 45,
    notes: 'Remember to set the correct region and zone. Firewall rules are important for access.',
    gcpServices: ['Compute Engine', 'VPC Network'],
    steps: [
        { id: '2-1', title: 'Navigate to Compute Engine', instructions: 'From the main menu, go to Compute Engine > VM instances.', isCompleted: true },
        { id: '2-2', title: 'Create Instance', instructions: 'Click "Create Instance", give it a name, and choose a region/zone.', isCompleted: true },
        { id: '2-3', title: 'Allow HTTP traffic', instructions: 'In the firewall settings for the new VM, check "Allow HTTP traffic".', isCompleted: false },
        { id: '2-4', title: 'SSH into the instance', instructions: 'Once created, click the "SSH" button to connect to the VM.', isCompleted: false },
    ],
    copilotSession: {
        status: 'Idle',
        currentStepIndex: 2,
        logs: [],
    }
  },
  {
    id: '3',
    title: 'Deploy a Docker Image to a Kubernetes Cluster',
    description: 'Create a GKE cluster and deploy a containerized application.',
    course: 'Google Kubernetes Engine Deep Dive',
    difficulty: Difficulty.Intermediate,
    status: LabStatus.NotStarted,
    estimatedTime: 90,
    notes: '',
    gcpServices: ['Google Kubernetes Engine', 'Container Registry', 'Cloud Build'],
    steps: [],
    copilotSession: {
        status: 'Idle',
        currentStepIndex: 0,
        logs: [],
    }
  },
  {
    id: '4',
    title: 'Build a Serverless App with Cloud Run',
    description: 'Deploy a containerized web application on Cloud Run and explore its features.',
    course: 'Serverless on Google Cloud',
    difficulty: Difficulty.Intermediate,
    status: LabStatus.NotStarted,
    estimatedTime: 60,
    notes: '',
    gcpServices: ['Cloud Run', 'Cloud Build', 'Artifact Registry'],
    steps: [],
    copilotSession: {
        status: 'Idle',
        currentStepIndex: 0,
        logs: [],
    }
  },
];

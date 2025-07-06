export enum Phase {
  LANGUAGE_SELECTION = 'LANGUAGE_SELECTION',
  PROBLEM_RECEPTION = 'PROBLEM_RECEPTION',
  DECOMPOSITION = 'DECOMPOSITION',
  DATA_REQUIREMENTS = 'DATA_REQUIREMENTS',
  DATA_ASSESSMENT = 'DATA_ASSESSMENT',
  EVALUATION_CRITERIA = 'EVALUATION_CRITERIA',
  ANALYTICAL_APPROACH = 'ANALYTICAL_APPROACH',
  PROGRESS_TRACKING = 'PROGRESS_TRACKING',
  SOLUTION_VALIDATION = 'SOLUTION_VALIDATION',
  COMPLETED = 'COMPLETED'
}

export enum Language {
  ENGLISH = 'en',
  CHINESE = 'zh'
}

export interface UserProvidedData {
  textInput: string;
  files: File[];
  youtubeLinks: string[]; // Changed from youtubeLink: string
}

export interface AppState {
  currentPhase: Phase;
  selectedLanguage: Language;
  problemStatement: string;
  isLoading: boolean; // General loading for phase transitions/main content
  error: string | null;
  
  // Phase-specific outputs from the "agent" (Gemini)
  domainClassificationOutput: string;
  decompositionOutput: string;
  dataRequirementsOutput: string;
  userDataForAssessment: UserProvidedData; // User input for data - MODIFIED
  dataAssessmentOutput: string;
  evaluationCriteriaOutput: string; // Can be updated by user feedback
  analyticalApproachOutput: string;
  progressTrackingOutput: string; // For simplicity, a generated report
  finalValidationOutput: string;

  // Store history of agent responses for context
  agentHistory: { role: 'user' | 'model'; text: string }[];

  // Phase 5 specific for refinement
  isRefiningCriteria: boolean;
  userCriteriaFeedbackText: string;
  userRubricFile: File | null;
  userRubricFileContent: string | null; // Content of the uploaded rubric file
}

export interface PhaseDetail {
  id: Phase;
  title: string;
  description: string;
}

// Props for Phase Components
export interface PhaseProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
  callAgent: (promptContent: string, phaseInstructions: string) => Promise<string | null>;
  advancePhase: () => void;
  getParsedOutput: (jsonString: string) => any | null;
  // Add specific handlers as needed, e.g.,
  handleProblemSubmit?: () => Promise<void>;
  handleDecompositionRequest?: () => Promise<void>;
  handleDataRequirementsRequest?: () => Promise<void>;
  handleDataAssessmentRequest?: () => Promise<void>;
  handleEvaluationCriteriaRequest?: () => Promise<void>;
  handleRefineEvaluationCriteria?: () => Promise<void>; // New handler for Phase 5 refinement
  handleAnalyticalApproachRequest?: () => Promise<void>;
  handleProgressTrackingRequest?: () => Promise<void>;
  handleSolutionValidationRequest?: () => Promise<void>;
}
export type UserRole = "foreman" | "admin" | null;

export interface DailyReport {
  id: string;
  projectId: string;
  gpsLocation: string;
  date: string; // ISO string
  weather: string;
  manpower: string;
  equipmentHours: string;
  materialsUsed: string;
  progressUpdates: string;
  risksIssues: string;
  photoDataUri?: string; // Optional for now
  photoFileName?: string;
  digitalSignature: string;
  timestamp: string; // ISO string of submission
  status: "Submitted" | "Reviewed" | "Approved" | "Rejected";
  foremanName: string; // Added for clarity in lists
  generatedReport?: string; // AI generated report text
  reportSummary?: string; // AI generated summary
  pmComments?: string;
}

export interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

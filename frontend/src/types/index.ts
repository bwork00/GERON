export interface Candidate {
  id: string;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  token: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  startedAt: string;
  completedAt?: string | null;
  checklistState: string | boolean[]; // JSON string or parsed array
  selfCheckAnswers?: string | Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: string;
}

export interface NavItem {
  id: string;
  label: string;
  step: number;
}

export interface OverviewData {
  pageTitle: string;
  subtitle: string;
  navigation: NavItem[];
}

export interface WelcomeData {
  director: {
    name: string;
    title: string;
    photoUrl: string;
  };
  header: string;
  greeting: string;
  body: string[];
  ctaButtonText: string;
}

export interface BenefitItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface AboutData {
  title: string;
  heroText: string;
  description: string[];
  benefitsTitle: string;
  benefits: BenefitItem[];
  keyConclusion: string;
}

export interface ProgramItem {
  id: string;
  code: string;
  title: string;
  ageRange: string;
  subtitle: string;
  description: string;
  tools: string[];
  valueForParents: string;
  sortOrder: number;
}

export interface SelfCheckQuestion {
  id: number;
  question: string;
}

export interface ProgramsData {
  title: string;
  subtitle: string;
  programs: ProgramItem[];
  selfCheck: {
    title: string;
    instructions: string;
    questions: SelfCheckQuestion[];
  };
}

export interface VideoLessonItem {
  id: string;
  programCode: string;
  title: string;
  videoUrl: string;
  keyTakeaways: string[];
  sortOrder: number;
}

export interface VideosData {
  title: string;
  intro: string[];
  videos: VideoLessonItem[];
  managerChecklist: string[];
}

export interface ScriptSectionItem {
  id: string;
  stepNumber: number;
  title: string;
  description?: string | null;
  content: string;
  scriptTips?: string | null;
  sortOrder?: number;
}

export interface ScriptsData {
  title: string;
  introFromHeadOfSales: {
    author: string;
    position: string;
    text: string[];
  };
  pdfDownloadUrl: string;
  scriptSections: ScriptSectionItem[];
}

export interface CallSampleItem {
  id: string;
  title: string;
  category: string;
  audioFileName: string;
  durationSeconds: number;
  description?: string | null;
  sortOrder: number;
  streamUrl: string;
}

export interface CallsData {
  title: string;
  mentor: {
    title: string;
    photoUrl: string;
    introText: string[];
  };
  reflectionQuestions: string[];
  calls: CallSampleItem[];
}

export interface ChecklistItem {
  id: number;
  label: string;
}

export interface PracticeData {
  title: string;
  description: string[];
  checklistTitle: string;
  checklistItems: ChecklistItem[];
  closingMessage: string;
}

export interface CallProgressLog {
  id: string;
  candidateId: string;
  callSampleId: string;
  listenedSeconds: number;
  isCompleted: boolean;
  updatedAt: string;
  callSample?: CallSampleItem;
}

export interface CandidateProgress {
  candidateId: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  checklistState: boolean[];
  selfCheckAnswers: Record<string, string>;
  startedAt: string;
  completedAt?: string | null;
  callLogs: CallProgressLog[];
}

export interface CandidateWithLogs extends Candidate {
  progressLogs?: CallProgressLog[];
  checklistStateParsed?: boolean[];
  selfCheckAnswersParsed?: Record<string, string>;
}

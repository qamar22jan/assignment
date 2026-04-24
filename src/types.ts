export interface PersonalInfo {
  studentName: string;
  universityLogo: string;
  section: string;
  instructorName: string;
  subjectName: string;
  universityName: string;
  rollNumber: string;
  submissionDate: string;
}

export interface AssignmentInfo {
  assignmentTopic: string;
  requirements: string;
  subjectForAI: string;
  assignmentType: string;
  wordCount: string;
  referenceImage: string;
  modelId: string;
}

export type AppStep = 'step1' | 'step2' | 'loading' | 'preview';

export type CoverPageStyle =
  | 'classic' | 'modern' | 'elegant' | 'professional'
  | 'minimalist' | 'corporate' | 'gradient' | 'geometric' | 'typography' | 'academic';

export type Page = 'landing' | 'assignment-maker';

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cached_tokens: number;
  total_time_ms: number;
}

export interface GroqModelOption {
  id: string;
  label: string;
  tpmLimit: number;
  maxTokens: number;
  description: string;
}

export const GROQ_MODELS: GroqModelOption[] = [
  { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B', tpmLimit: 30000, maxTokens: 3000, description: '⚡ Fast, 30K TPM — free tier safe' },
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', tpmLimit: 12000, maxTokens: 3000, description: '⭐ Best quality, 12K TPM' },
];

export const COVER_STYLES: { id: CoverPageStyle; emoji: string; label: string }[] = [
  { id: 'classic', emoji: '🏛️', label: 'Classic' },
  { id: 'modern', emoji: '💜', label: 'Modern' },
  { id: 'elegant', emoji: '✨', label: 'Elegant' },
  { id: 'professional', emoji: '💼', label: 'Professional' },
  { id: 'minimalist', emoji: '◻️', label: 'Minimalist' },
  { id: 'corporate', emoji: '🏢', label: 'Corporate' },
  { id: 'gradient', emoji: '🌈', label: 'Gradient' },
  { id: 'geometric', emoji: '🔶', label: 'Geometric' },
  { id: 'typography', emoji: '🔤', label: 'Typography' },
  { id: 'academic', emoji: '🎓', label: 'Academic' },
];

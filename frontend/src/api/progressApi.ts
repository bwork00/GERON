import { request } from './client';
import { CandidateProgress, CallProgressLog, Candidate } from '../types';

export const progressApi = {
  // Get candidate progress
  getProgress: async (token?: string): Promise<CandidateProgress> => {
    return request<CandidateProgress>('/progress', {
      method: 'GET',
      token,
    });
  },

  // Update candidate checklist (7 boolean items)
  updateChecklist: async (checklistState: boolean[], token?: string): Promise<{ success: boolean; checklistState: boolean[] }> => {
    return request<{ success: boolean; checklistState: boolean[] }>('/progress/checklist', {
      method: 'PUT',
      body: JSON.stringify({ checklistState }),
      token,
    });
  },

  // Save answers to 7 self-check questions
  saveSelfCheck: async (answers: Record<string, string>, token?: string): Promise<{ success: boolean; selfCheckAnswers: Record<string, string> }> => {
    return request<{ success: boolean; selfCheckAnswers: Record<string, string> }>('/progress/self-check', {
      method: 'POST',
      body: JSON.stringify({ answers }),
      token,
    });
  },

  // Log audio call listen progress
  logCallProgress: async (payload: { callSampleId: string; listenedSeconds: number; isCompleted: boolean }, token?: string): Promise<{ success: boolean; log: CallProgressLog }> => {
    return request<{ success: boolean; log: CallProgressLog }>('/progress/call-log', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    });
  },

  // Complete Stage 2
  completeStage: async (token?: string): Promise<{ success: boolean; message: string; candidate: Candidate }> => {
    return request<{ success: boolean; message: string; candidate: Candidate }>('/progress/complete', {
      method: 'POST',
      token,
    });
  },
};

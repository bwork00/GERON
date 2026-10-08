import { request } from './client';
import { CandidateWithLogs } from '../types';

export interface CandidatesResponse {
  success: boolean;
  count: number;
  candidates: CandidateWithLogs[];
}

export interface InviteCandidateResponse {
  success: boolean;
  candidate: CandidateWithLogs;
  accessUrl: string;
  token: string;
}

export const adminApi = {
  // Get all candidates
  getCandidates: async (): Promise<CandidatesResponse> => {
    return request<CandidatesResponse>('/admin/candidates', {
      method: 'GET',
      isAdmin: true,
    });
  },

  // Invite candidate
  inviteCandidate: async (data: { fullName: string; phone?: string; email?: string }): Promise<InviteCandidateResponse> => {
    return request<InviteCandidateResponse>('/admin/candidates/invite', {
      method: 'POST',
      body: JSON.stringify(data),
      isAdmin: true,
    });
  },

  // Delete candidate
  deleteCandidate: async (id: string): Promise<{ success: boolean; message: string }> => {
    return request<{ success: boolean; message: string }>(`/admin/candidates/${id}`, {
      method: 'DELETE',
      isAdmin: true,
    });
  },
};

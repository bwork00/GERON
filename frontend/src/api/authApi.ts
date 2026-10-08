import { request } from './client';
import { Candidate, AdminUser } from '../types';

export interface AccessCandidateResponse {
  success: boolean;
  candidate: Candidate;
  token: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token: string;
  admin: AdminUser;
}

export const authApi = {
  // Login with existing candidate token OR register new candidate with fullName + phone
  access: async (params: { token?: string; fullName?: string; phone?: string }): Promise<AccessCandidateResponse> => {
    return request<AccessCandidateResponse>('/auth/access', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Get current candidate by Bearer candidateToken
  getMe: async (token?: string): Promise<{ success: boolean; candidate: Candidate }> => {
    return request<{ success: boolean; candidate: Candidate }>('/auth/me', {
      method: 'GET',
      token,
    });
  },

  // Admin login with username and password
  adminLogin: async (credentials: { username: string; password: string }): Promise<AdminLoginResponse> => {
    return request<AdminLoginResponse>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

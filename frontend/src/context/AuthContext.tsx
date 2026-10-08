import React, { createContext, useContext, useState, useEffect } from 'react';
import { Candidate, AdminUser } from '../types';
import { authApi } from '../api/authApi';

const DEFAULT_TOKEN = 'geron-demo-candidate-2026';

interface AuthContextType {
  candidate: Candidate | null;
  candidateToken: string | null;
  adminUser: AdminUser | null;
  adminToken: string | null;
  isLoading: boolean;
  error: string | null;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  refreshCandidate: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [candidateToken, setCandidateToken] = useState<string | null>(DEFAULT_TOKEN);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize session automatically & silently
  useEffect(() => {
    const initSession = async () => {
      try {
        // 1. Check Admin token in localStorage if mentor previously logged in
        const storedAdminToken = localStorage.getItem('geron_admin_token');
        const storedAdminData = localStorage.getItem('geron_admin_user');
        if (storedAdminToken && storedAdminData) {
          try {
            setAdminToken(storedAdminToken);
            setAdminUser(JSON.parse(storedAdminData));
          } catch {
            localStorage.removeItem('geron_admin_user');
          }
        }

        // 2. Silently initialize candidate session for backend progress persistence
        const res = await authApi.access({ token: DEFAULT_TOKEN });
        if (res.success && res.candidate) {
          setCandidate(res.candidate);
          setCandidateToken(res.token);
          localStorage.setItem('geron_candidate_token', res.token);
        }
      } catch (err) {
        console.warn('Silent session init fallback:', err);
        // Fallback default state so everything remains usable
        setCandidateToken(DEFAULT_TOKEN);
        localStorage.setItem('geron_candidate_token', DEFAULT_TOKEN);
      }
    };

    initSession();
  }, []);

  const loginAdmin = async (username: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await authApi.adminLogin({ username, password });
      if (res.success && res.token) {
        setAdminToken(res.token);
        setAdminUser(res.admin);
        localStorage.setItem('geron_admin_token', res.token);
        localStorage.setItem('geron_admin_user', JSON.stringify(res.admin));
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Неверный логин или пароль администратора');
      return false;
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('geron_admin_token');
    localStorage.removeItem('geron_admin_user');
  };

  const refreshCandidate = async () => {
    if (!candidateToken) return;
    try {
      const res = await authApi.getMe(candidateToken);
      if (res.success && res.candidate) {
        setCandidate(res.candidate);
      }
    } catch (err) {
      console.error('Error refreshing candidate:', err);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        candidate,
        candidateToken,
        adminUser,
        adminToken,
        isLoading,
        error,
        loginAdmin,
        logoutAdmin,
        refreshCandidate,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

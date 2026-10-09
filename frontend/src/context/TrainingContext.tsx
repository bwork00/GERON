import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { progressApi } from '../api/progressApi';
import { contentApi } from '../api/contentApi';
import { OverviewData } from '../types';

import { defaultOverview } from '../data/mockContent';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface TrainingContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  overview: OverviewData | null;
  checklist: boolean[];
  toggleChecklistItem: (index: number) => Promise<void>;
  selfCheckAnswers: Record<string, string>;
  setSelfCheckAnswer: (questionId: number, answer: string) => void;
  saveSelfCheckAnswers: () => Promise<boolean>;
  isSavingSelfCheck: boolean;
  isStageCompleted: boolean;
  completeStage: () => Promise<boolean>;
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  refreshProgress: () => Promise<void>;
  completedChecklistCount: number;
  activeAudioId: string | null;
  setActiveAudioId: (id: string | null) => void;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

const DEFAULT_CHECKLIST = [false, false, false, false, false, false, false];

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { candidate, candidateToken, refreshCandidate } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [overview, setOverview] = useState<OverviewData>(defaultOverview);

  // Initialize checklist from localStorage if available
  const [checklist, setChecklist] = useState<boolean[]>(() => {
    try {
      const saved = localStorage.getItem('geron_local_checklist');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CHECKLIST;
  });

  // Initialize self check answers from localStorage if available
  const [selfCheckAnswers, setSelfCheckAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('geron_local_selfcheck');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [isSavingSelfCheck, setIsSavingSelfCheck] = useState<boolean>(false);
  const [isStageCompleted, setIsStageCompleted] = useState<boolean>(() => {
    return localStorage.getItem('geron_local_completed') === 'true';
  });
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial overview
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const data = await contentApi.getOverview();
        if (data) setOverview(data);
      } catch (err) {
        console.error('Failed to load overview data:', err);
      }
    };
    fetchOverview();
  }, []);

  // Sync state when candidate changes
  useEffect(() => {
    if (!candidate) {
      setChecklist(DEFAULT_CHECKLIST);
      setSelfCheckAnswers({});
      setIsStageCompleted(false);
      return;
    }

    // Parse checklistState
    let parsedChecklist: boolean[] = DEFAULT_CHECKLIST;
    if (typeof candidate.checklistState === 'string') {
      try {
        parsedChecklist = JSON.parse(candidate.checklistState);
      } catch {
        parsedChecklist = DEFAULT_CHECKLIST;
      }
    } else if (Array.isArray(candidate.checklistState)) {
      parsedChecklist = candidate.checklistState;
    }
    setChecklist(parsedChecklist);

    // Parse selfCheckAnswers
    let parsedAnswers: Record<string, string> = {};
    if (typeof candidate.selfCheckAnswers === 'string') {
      try {
        parsedAnswers = JSON.parse(candidate.selfCheckAnswers || '{}');
      } catch {
        parsedAnswers = {};
      }
    } else if (candidate.selfCheckAnswers && typeof candidate.selfCheckAnswers === 'object') {
      parsedAnswers = candidate.selfCheckAnswers;
    }
    setSelfCheckAnswers(parsedAnswers);

    setIsStageCompleted(candidate.status === 'COMPLETED');
  }, [candidate]);

  const refreshProgress = async () => {
    if (!candidateToken) return;
    try {
      const data = await progressApi.getProgress(candidateToken);
      if (data) {
        setChecklist(data.checklistState);
        setSelfCheckAnswers(data.selfCheckAnswers);
        setIsStageCompleted(data.status === 'COMPLETED');
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  };

  const toggleChecklistItem = async (index: number) => {
    const updated = [...checklist];
    updated[index] = !updated[index];
    setChecklist(updated);

    try {
      localStorage.setItem('geron_local_checklist', JSON.stringify(updated));
    } catch {}

    showToast(
      updated[index] ? 'Пункт чек-листа отмечен' : 'Отметка с пункта снята',
      'success'
    );

    if (candidateToken) {
      try {
        await progressApi.updateChecklist(updated, candidateToken);
        refreshCandidate();
      } catch (err: any) {
        console.warn('Backend checklist sync skipped/offline:', err);
      }
    }
  };

  const setSelfCheckAnswer = (questionId: number, answer: string) => {
    setSelfCheckAnswers((prev) => {
      const next = {
        ...prev,
        [String(questionId)]: answer,
      };
      try {
        localStorage.setItem('geron_local_selfcheck', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const saveSelfCheckAnswers = async (): Promise<boolean> => {
    try {
      localStorage.setItem('geron_local_selfcheck', JSON.stringify(selfCheckAnswers));
    } catch {}

    if (candidateToken) {
      setIsSavingSelfCheck(true);
      try {
        await progressApi.saveSelfCheck(selfCheckAnswers, candidateToken);
        showToast('Ответы для самопроверки сохранены!', 'success');
        refreshCandidate();
        return true;
      } catch (err: any) {
        console.warn('Backend save skipped/offline:', err);
        showToast('Ответы для самопроверки сохранены локально!', 'success');
        return true;
      } finally {
        setIsSavingSelfCheck(false);
      }
    }

    showToast('Ответы для самопроверки сохранены!', 'success');
    return true;
  };

  const completeStage = async (): Promise<boolean> => {
    setIsStageCompleted(true);
    try {
      localStorage.setItem('geron_local_completed', 'true');
    } catch {}

    const token = candidateToken || 'geron-demo-candidate-2026';
    try {
      await progressApi.completeStage(token);
      refreshCandidate();
    } catch (err: any) {
      console.warn('Backend completeStage skipped/offline:', err);
    }

    showToast('Поздравляем! 2-й этап отбора успешно завершён!', 'success');
    return true;
  };

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const completedChecklistCount = checklist.filter(Boolean).length;

  return (
    <TrainingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        overview,
        checklist,
        toggleChecklistItem,
        selfCheckAnswers,
        setSelfCheckAnswer,
        saveSelfCheckAnswers,
        isSavingSelfCheck,
        isStageCompleted,
        completeStage,
        toasts,
        showToast,
        removeToast,
        refreshProgress,
        completedChecklistCount,
        activeAudioId,
        setActiveAudioId,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
};

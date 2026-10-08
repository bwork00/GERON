import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { progressApi } from '../api/progressApi';
import { contentApi } from '../api/contentApi';
import { OverviewData } from '../types';

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
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [checklist, setChecklist] = useState<boolean[]>(DEFAULT_CHECKLIST);
  const [selfCheckAnswers, setSelfCheckAnswers] = useState<Record<string, string>>({});
  const [isSavingSelfCheck, setIsSavingSelfCheck] = useState<boolean>(false);
  const [isStageCompleted, setIsStageCompleted] = useState<boolean>(false);
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
        setOverview(data);
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

    if (candidateToken) {
      try {
        await progressApi.updateChecklist(updated, candidateToken);
        showToast(
          updated[index] ? 'Пункт чек-листа отмечен' : 'Отметка с пункта снята',
          'success'
        );
        refreshCandidate();
      } catch (err: any) {
        // Rollback on failure
        setChecklist(checklist);
        showToast('Не удалось обновить чек-лист: ' + err.message, 'error');
      }
    }
  };

  const setSelfCheckAnswer = (questionId: number, answer: string) => {
    setSelfCheckAnswers((prev) => ({
      ...prev,
      [String(questionId)]: answer,
    }));
  };

  const saveSelfCheckAnswers = async (): Promise<boolean> => {
    if (!candidateToken) return false;
    setIsSavingSelfCheck(true);
    try {
      await progressApi.saveSelfCheck(selfCheckAnswers, candidateToken);
      showToast('Ответы для самопроверки успешно сохранены в базе!', 'success');
      refreshCandidate();
      return true;
    } catch (err: any) {
      showToast('Ошибка при сохранении ответов: ' + err.message, 'error');
      return false;
    } finally {
      setIsSavingSelfCheck(false);
    }
  };

  const completeStage = async (): Promise<boolean> => {
    const token = candidateToken || 'geron-demo-candidate-2026';
    try {
      const res = await progressApi.completeStage(token);
      if (res.success) {
        setIsStageCompleted(true);
        showToast('Поздравляем! 2-й этап отбора успешно завершён!', 'success');
        refreshCandidate();
        return true;
      }
      return false;
    } catch (err: any) {
      showToast('Ошибка при завершении этапа: ' + err.message, 'error');
      return false;
    }
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

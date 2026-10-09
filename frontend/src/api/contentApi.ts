import { request } from './client';
import {
  OverviewData,
  WelcomeData,
  AboutData,
  ProgramsData,
  VideosData,
  ScriptsData,
  CallsData,
  PracticeData,
} from '../types';
import {
  defaultOverview,
  defaultWelcome,
  defaultAbout,
  defaultPrograms,
  defaultVideos,
  defaultScripts,
  defaultCalls,
  defaultPractice,
} from '../data/mockContent';

export const contentApi = {
  getOverview: async (): Promise<OverviewData> => {
    try {
      const res = await request<OverviewData>('/content/overview');
      return res?.navigation ? res : defaultOverview;
    } catch {
      return defaultOverview;
    }
  },

  getWelcome: async (): Promise<WelcomeData> => {
    try {
      const res = await request<WelcomeData>('/content/welcome');
      return res?.header ? res : defaultWelcome;
    } catch {
      return defaultWelcome;
    }
  },

  getAbout: async (): Promise<AboutData> => {
    try {
      const res = await request<AboutData>('/content/about');
      return res?.benefits ? res : defaultAbout;
    } catch {
      return defaultAbout;
    }
  },

  getPrograms: async (): Promise<ProgramsData> => {
    try {
      const res = await request<ProgramsData>('/content/programs');
      return res?.programs ? res : defaultPrograms;
    } catch {
      return defaultPrograms;
    }
  },

  getVideos: async (): Promise<VideosData> => {
    try {
      const res = await request<VideosData>('/content/videos');
      return res?.videos ? res : defaultVideos;
    } catch {
      return defaultVideos;
    }
  },

  getScripts: async (): Promise<ScriptsData> => {
    try {
      const res = await request<ScriptsData>('/content/scripts');
      return res?.scriptSections ? res : defaultScripts;
    } catch {
      return defaultScripts;
    }
  },

  getCalls: async (): Promise<CallsData> => {
    try {
      const res = await request<CallsData>('/content/calls');
      return res?.calls ? res : defaultCalls;
    } catch {
      return defaultCalls;
    }
  },

  getPractice: async (): Promise<PracticeData> => {
    try {
      const res = await request<PracticeData>('/content/practice');
      return res?.checklistItems ? res : defaultPractice;
    } catch {
      return defaultPractice;
    }
  },
};

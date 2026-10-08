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

export const contentApi = {
  getOverview: async (): Promise<OverviewData> => {
    return request<OverviewData>('/content/overview');
  },

  getWelcome: async (): Promise<WelcomeData> => {
    return request<WelcomeData>('/content/welcome');
  },

  getAbout: async (): Promise<AboutData> => {
    return request<AboutData>('/content/about');
  },

  getPrograms: async (): Promise<ProgramsData> => {
    return request<ProgramsData>('/content/programs');
  },

  getVideos: async (): Promise<VideosData> => {
    return request<VideosData>('/content/videos');
  },

  getScripts: async (): Promise<ScriptsData> => {
    return request<ScriptsData>('/content/scripts');
  },

  getCalls: async (): Promise<CallsData> => {
    return request<CallsData>('/content/calls');
  },

  getPractice: async (): Promise<PracticeData> => {
    return request<PracticeData>('/content/practice');
  },
};

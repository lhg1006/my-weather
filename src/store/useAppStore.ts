import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings, GeolocationCoords } from '../types';

interface AppState {
  // 설정 상태
  settings: AppSettings;
  
  // 위치 상태
  currentLocation: GeolocationCoords | null;
  isLocationLoading: boolean;
  locationError: string | null;
  
  // UI 상태
  isSettingsOpen: boolean;
  isLoading: boolean;
  
  // 액션들
  updateSettings: (settings: Partial<AppSettings>) => void;
  setCurrentLocation: (location: GeolocationCoords | null) => void;
  setLocationLoading: (loading: boolean) => void;
  setLocationError: (error: string | null) => void;
  setSettingsOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  
  // 언어 변경
  changeLanguage: (language: 'ko' | 'en') => void;
  
  // 테마 변경
  changeTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const defaultSettings: AppSettings = {
  language: 'ko',
  theme: 'system',
  temperatureUnit: 'celsius',
  schedule: {
    workStartTime: '07:00',
    workEndTime: '10:00',
    leaveStartTime: '17:00',
    leaveEndTime: '19:00',
    activityStartTime: '06:00',
    activityEndTime: '22:00',
    enabled: false,
    workNotificationEnabled: false,
    leaveNotificationEnabled: false,
    activityNotificationEnabled: false,
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      settings: defaultSettings,
      currentLocation: null,
      isLocationLoading: false,
      locationError: null,
      isSettingsOpen: false,
      isLoading: false,
      
      // 설정 업데이트
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      
      // 위치 관련 액션
      setCurrentLocation: (location) =>
        set({ 
          currentLocation: location,
          locationError: location ? null : get().locationError 
        }),
      
      setLocationLoading: (loading) =>
        set({ isLocationLoading: loading }),
      
      setLocationError: (error) =>
        set({ 
          locationError: error,
          isLocationLoading: false 
        }),
      
      // UI 상태 관리
      setSettingsOpen: (open) =>
        set({ isSettingsOpen: open }),
      
      setLoading: (loading) =>
        set({ isLoading: loading }),
      
      // 언어 변경
      changeLanguage: (language) =>
        set((state) => ({
          settings: { ...state.settings, language },
        })),
      
      // 테마 변경
      changeTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),
    }),
    {
      name: 'weather-app-settings', // localStorage key
      partialize: (state) => ({ 
        settings: state.settings,
        currentLocation: state.currentLocation 
      }), // 지속할 상태만 선택
      merge: (persistedState: any, currentState: AppState) => ({
        ...currentState,
        ...persistedState,
        settings: {
          ...defaultSettings,
          ...(persistedState?.settings || {}),
        },
      }),
    }
  )
);
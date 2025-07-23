import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

interface Schedule {
  enabled: boolean;
  workStartTime: string;
  workEndTime: string;
  leaveStartTime: string;
  leaveEndTime: string;
}

interface WeatherNotifications {
  enabled: boolean;
  rainAlerts: boolean;
  temperatureAlerts: boolean;
  windAlerts: boolean;
  notifyBefore: number;
}

interface Settings {
  language: 'ko' | 'en';
  theme: 'light' | 'dark' | 'system';
  temperatureUnit: 'celsius' | 'fahrenheit';
  schedule: Schedule;
  weatherNotifications: WeatherNotifications;
}

interface AppState {
  settings: Settings;
  currentLocation: GeolocationCoords | null;
  isLocationLoading: boolean;
  locationError: string | null;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  setCurrentLocation: (coords: GeolocationCoords) => void;
  setLocationLoading: (loading: boolean) => void;
  setLocationError: (error: string | null) => void;
}

const defaultSettings: Settings = {
  language: 'ko',
  theme: 'system',
  temperatureUnit: 'celsius',
  schedule: {
    enabled: false,
    workStartTime: '08:00',
    workEndTime: '09:00',
    leaveStartTime: '18:00',
    leaveEndTime: '19:00',
  },
  weatherNotifications: {
    enabled: false,
    rainAlerts: true,
    temperatureAlerts: true,
    windAlerts: false,
    notifyBefore: 30,
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      currentLocation: null,
      isLocationLoading: false,
      locationError: null,
      isSettingsOpen: false,
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      setCurrentLocation: (coords) => set({ currentLocation: coords }),
      setLocationLoading: (loading) => set({ isLocationLoading: loading }),
      setLocationError: (error) => set({ locationError: error }),
    }),
    {
      name: 'weather-app-storage',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
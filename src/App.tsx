import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import { Settings, RefreshCw } from 'lucide-react';

import { useAppStore } from './store/useAppStore';
import { useGeolocation } from './hooks/useGeolocation';
import { useWeatherData } from './hooks/useWeatherQuery';
import { useWeatherNotifications } from './hooks/useWeatherNotifications';

import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { LocationButton } from './components/LocationButton';
import { SettingsModal } from './components/SettingsModal';
import { ScheduleCard } from './components/ScheduleCard';
import { Button, LoadingSpinner } from './components/ui';

function App() {
  const { t } = useTranslation();
  const { 
    isSettingsOpen, 
    setSettingsOpen, 
    currentLocation,
    settings 
  } = useAppStore();
  
  const { requestLocation } = useGeolocation();
  
  const {
    currentWeather,
    forecast,
    isLoading,
    isError,
    error,
    refetch
  } = useWeatherData(
    currentLocation?.latitude || null,
    currentLocation?.longitude || null
  );

  // 날씨 알림 시스템
  useWeatherNotifications({
    currentWeather: currentWeather || null
  });

  // 앱 시작 시 위치 요청
  useEffect(() => {
    if (!currentLocation) {
      requestLocation();
    }
  }, []);

  // 테마 적용
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      // 기존 테마 클래스 제거
      root.classList.remove('dark');
      
      if (settings.theme === 'dark') {
        root.classList.add('dark');
        console.log('다크 모드 적용');
      } else if (settings.theme === 'light') {
        console.log('라이트 모드 적용');
      } else {
        // system 모드
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
          console.log('시스템 다크 모드 적용');
        } else {
          console.log('시스템 라이트 모드 적용');
        }
      }
    };
    
    applyTheme();
    
    // 시스템 모드일 때 미디어 쿼리 리스너 추가
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  const handleRefresh = () => {
    refetch();
    if (!currentLocation) {
      requestLocation();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-sky-200 to-blue-200 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100 transition-all duration-500">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/60 dark:bg-slate-800/70 backdrop-blur-xl border-b border-sky-300/20 dark:border-slate-600/30 shadow-xl shadow-sky-200/30 dark:shadow-slate-900/60 transition-all duration-300">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500/20 dark:bg-blue-400/20">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                MyWeather
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                내 위치 날씨 정보
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="p-2"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen(true)}
              className="p-2"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Schedule Card */}
        <ScheduleCard />
        
        {/* Location Button */}
        <LocationButton />

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="flex flex-col items-center justify-center py-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingSpinner size="lg" className="text-blue-600 dark:text-blue-400 mb-4" />
              <p className="text-slate-600 dark:text-slate-300">
                {t('weather.loading')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {isError && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p className="mb-4 text-red-600 dark:text-red-400">
                {error?.message || t('weather.error')}
              </p>
              <Button onClick={handleRefresh}>
                {t('weather.retry')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weather Data */}
        <AnimatePresence>
          {currentWeather && !isLoading && (
            <>
              <WeatherCard weather={currentWeather} />
              
              {forecast && (
                <ForecastCard 
                  hourly={forecast.hourly} 
                  daily={forecast.daily} 
                />
              )}
            </>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {!currentLocation && !isLoading && !isError && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                {t('location.enableLocation')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            marginTop: '80px',
            background: 'rgba(255, 255, 255, 0.85)',
            color: '#1e293b',
            borderRadius: '12px',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
          className: 'dark:!bg-slate-800/85 dark:!text-slate-100 dark:!border-slate-600/30',
        }}
      />
    </div>
  );
}

export default App;
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Button, Card } from './ui';
import { X, Globe, Palette, Thermometer, Clock, Bell, CloudRain } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { t, i18n } = useTranslation();
  const { settings, updateSettings } = useAppStore();

  // 스크롤바 숨기기 위한 스타일
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  
  // 모달이 열릴 때 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // 스크롤 위치 복원
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    
    return () => {
      // 컴포넌트 언마운트 시 스타일 초기화
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLanguageChange = (language: 'ko' | 'en') => {
    updateSettings({ language });
    i18n.changeLanguage(language);
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  const handleTemperatureUnitChange = (unit: 'celsius' | 'fahrenheit') => {
    updateSettings({ temperatureUnit: unit });
  };

  const handleScheduleChange = (scheduleUpdate: Partial<typeof settings.schedule>) => {
    updateSettings({ 
      schedule: { ...settings.schedule, ...scheduleUpdate } 
    });
  };

  const handleWeatherNotificationChange = (notificationUpdate: Partial<typeof settings.weatherNotifications>) => {
    updateSettings({
      weatherNotifications: { ...settings.weatherNotifications, ...notificationUpdate }
    });
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pt-4 pb-6 px-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-full max-w-md max-h-[calc(100vh-2rem)] flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="flex flex-col h-full min-h-0">
              <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0 border-b border-slate-200 dark:border-slate-600">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-white">
                  {t('settings.title')}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div 
                className="flex-1 overflow-y-auto px-6 py-4 min-h-0 hide-scrollbar" 
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <div className="space-y-6"></div>
                {/* 언어 설정 */}
                <div>
                  <div className="flex items-center mb-3 mt-2">
                    <Globe className="w-5 h-5 text-ios-blue mr-2" />
                    <h3 className="text-sm font-medium text-gray-700 dark:text-white">
                      {t('settings.language')}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="language"
                        checked={settings.language === 'ko'}
                        onChange={() => handleLanguageChange('ko')}
                        className="sr-only"
                      />
                      <div className={`
                        flex-1 p-3 rounded-ios border-2 cursor-pointer transition-all
                        ${settings.language === 'ko' 
                          ? 'border-ios-blue bg-ios-blue/10' 
                          : 'border-gray-200 dark:border-gray-600'
                        }
                      `}>
                        <span className="text-sm font-medium text-gray-700 dark:text-white">
                          {t('settings.korean')}
                        </span>
                      </div>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="language"
                        checked={settings.language === 'en'}
                        onChange={() => handleLanguageChange('en')}
                        className="sr-only"
                      />
                      <div className={`
                        flex-1 p-3 rounded-ios border-2 cursor-pointer transition-all
                        ${settings.language === 'en' 
                          ? 'border-ios-blue bg-ios-blue/10' 
                          : 'border-gray-200 dark:border-gray-600'
                        }
                      `}>
                        <span className="text-sm font-medium text-gray-700 dark:text-white">
                          {t('settings.english')}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 테마 설정 */}
                <div>
                  <div className="flex items-center mb-3 mt-6">
                    <Palette className="w-5 h-5 text-ios-blue mr-2" />
                    <h3 className="text-sm font-medium text-gray-700 dark:text-white">
                      {t('settings.theme')}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {(['light', 'dark', 'system'] as const).map((theme) => (
                      <label key={theme} className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          checked={settings.theme === theme}
                          onChange={() => handleThemeChange(theme)}
                          className="sr-only"
                        />
                        <div className={`
                          flex-1 p-2 text-center rounded-ios border-2 cursor-pointer transition-all
                          ${settings.theme === theme 
                            ? 'border-ios-blue bg-ios-blue/10' 
                            : 'border-gray-200 dark:border-gray-600'
                          }
                        `}>
                          <span className="text-xs font-medium text-gray-700 dark:text-white">
                            {t(`settings.${theme}Mode`)}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 온도 단위 */}
                <div>
                  <div className="flex items-center mb-3 mt-6">
                    <Thermometer className="w-5 h-5 text-ios-blue mr-2" />
                    <h3 className="text-sm font-medium text-gray-700 dark:text-white">
                      {t('settings.units')}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {(['celsius', 'fahrenheit'] as const).map((unit) => (
                      <label key={unit} className="flex items-center">
                        <input
                          type="radio"
                          name="temperature"
                          checked={settings.temperatureUnit === unit}
                          onChange={() => handleTemperatureUnitChange(unit)}
                          className="sr-only"
                        />
                        <div className={`
                          flex-1 p-3 text-center rounded-ios border-2 cursor-pointer transition-all
                          ${settings.temperatureUnit === unit 
                            ? 'border-ios-blue bg-ios-blue/10' 
                            : 'border-gray-200 dark:border-gray-600'
                          }
                        `}>
                          <span className="text-sm font-medium text-gray-700 dark:text-white">
                            {t(`settings.${unit}`)}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 스케줄 설정 */}
                <div>
                  <div className="flex items-center justify-between mb-3 mt-6">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-ios-blue mr-2" />
                      <h3 className="text-sm font-medium text-gray-700 dark:text-white">
                        {t('settings.schedule')}
                      </h3>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Bell className="w-4 h-4 text-ios-blue" />
                    </button>
                  </div>
                  
                  {/* 스케줄 기능 활성화 */}
                  <div className="flex items-center justify-between p-3 border-2 rounded-ios border-gray-200 dark:border-gray-600 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-white">
                        {t('settings.enableSchedule')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t('settings.scheduleDescription')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.schedule.enabled}
                        onChange={(e) => handleScheduleChange({ enabled: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                        settings.schedule.enabled 
                          ? 'bg-ios-blue' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                          settings.schedule.enabled ? 'translate-x-5' : 'translate-x-0.5'
                        } mt-0.5`} />
                      </div>
                    </label>
                  </div>
                  
                  {settings.schedule.enabled && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                      {/* 출근 가능 시간 */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-2">
                              <span className="text-white text-xs font-bold">출</span>
                            </div>
                            <label className="text-sm font-medium text-gray-700 dark:text-white">
                              {t('settings.workTimeRange')}
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Bell className={`w-4 h-4 transition-colors duration-200 ${
                              settings.schedule.workNotificationEnabled 
                                ? 'text-emerald-500' 
                                : 'text-gray-400'
                            }`} />
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.schedule.workNotificationEnabled}
                                onChange={(e) => handleScheduleChange({ workNotificationEnabled: e.target.checked })}
                                className="sr-only"
                              />
                              <div className={`w-8 h-4 rounded-full transition-colors duration-200 ${
                                settings.schedule.workNotificationEnabled 
                                  ? 'bg-emerald-500' 
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}>
                                <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                  settings.schedule.workNotificationEnabled ? 'translate-x-4' : 'translate-x-0.5'
                                } mt-0.5`} />
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                              {t('settings.from')}
                            </label>
                            <input
                              type="time"
                              value={settings.schedule.workStartTime}
                              onChange={(e) => handleScheduleChange({ workStartTime: e.target.value })}
                              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-ios text-sm text-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                              {t('settings.to')}
                            </label>
                            <input
                              type="time"
                              value={settings.schedule.workEndTime}
                              onChange={(e) => handleScheduleChange({ workEndTime: e.target.value })}
                              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-ios text-sm text-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* 퇴근 가능 시간 */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                              <span className="text-white text-xs font-bold">퇴</span>
                            </div>
                            <label className="text-sm font-medium text-gray-700 dark:text-white">
                              {t('settings.leaveTimeRange')}
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Bell className={`w-4 h-4 transition-colors duration-200 ${
                              settings.schedule.leaveNotificationEnabled 
                                ? 'text-orange-500' 
                                : 'text-gray-400'
                            }`} />
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.schedule.leaveNotificationEnabled}
                                onChange={(e) => handleScheduleChange({ leaveNotificationEnabled: e.target.checked })}
                                className="sr-only"
                              />
                              <div className={`w-8 h-4 rounded-full transition-colors duration-200 ${
                                settings.schedule.leaveNotificationEnabled 
                                  ? 'bg-orange-500' 
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}>
                                <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                  settings.schedule.leaveNotificationEnabled ? 'translate-x-4' : 'translate-x-0.5'
                                } mt-0.5`} />
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                              {t('settings.from')}
                            </label>
                            <input
                              type="time"
                              value={settings.schedule.leaveStartTime}
                              onChange={(e) => handleScheduleChange({ leaveStartTime: e.target.value })}
                              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-ios text-sm text-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                              {t('settings.to')}
                            </label>
                            <input
                              type="time"
                              value={settings.schedule.leaveEndTime}
                              onChange={(e) => handleScheduleChange({ leaveEndTime: e.target.value })}
                              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-ios text-sm text-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* 활동 시간 */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center mr-2">
                              <span className="text-white text-xs font-bold">활</span>
                            </div>
                            <label className="text-sm font-medium text-gray-700 dark:text-white">
                              {t('settings.activityTime')}
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Bell className={`w-4 h-4 transition-colors duration-200 ${
                              settings.schedule.activityNotificationEnabled 
                                ? 'text-purple-500' 
                                : 'text-gray-400'
                            }`} />
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.schedule.activityNotificationEnabled}
                                onChange={(e) => handleScheduleChange({ activityNotificationEnabled: e.target.checked })}
                                className="sr-only"
                              />
                              <div className={`w-8 h-4 rounded-full transition-colors duration-200 ${
                                settings.schedule.activityNotificationEnabled 
                                  ? 'bg-purple-500' 
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}>
                                <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                  settings.schedule.activityNotificationEnabled ? 'translate-x-4' : 'translate-x-0.5'
                                } mt-0.5`} />
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                              {t('settings.activityStartTime')}
                            </label>
                            <input
                              type="time"
                              value={settings.schedule.activityStartTime}
                              onChange={(e) => handleScheduleChange({ activityStartTime: e.target.value })}
                              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-ios text-sm text-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                              {t('settings.activityEndTime')}
                            </label>
                            <input
                              type="time"
                              value={settings.schedule.activityEndTime}
                              onChange={(e) => handleScheduleChange({ activityEndTime: e.target.value })}
                              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-ios text-sm text-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 알림 설정 버튼 */}
                      <div className="mt-4">
                        <button className="w-full bg-ios-blue hover:bg-ios-blue/90 text-white font-medium py-3 px-4 rounded-ios transition-colors flex items-center justify-center space-x-2">
                          <Bell className="w-4 h-4" />
                          <span>{t('settings.notificationSettings')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 날씨 알림 설정 */}
                <div>
                  <div className="flex items-center justify-between mb-3 mt-6">
                    <div className="flex items-center">
                      <CloudRain className="w-5 h-5 text-ios-blue mr-2" />
                      <h3 className="text-sm font-medium text-gray-700 dark:text-white">
                        {t('settings.weatherNotifications')}
                      </h3>
                    </div>
                  </div>
                  
                  {/* 날씨 알림 기능 활성화 */}
                  <div className="flex items-center justify-between p-3 border-2 rounded-ios border-gray-200 dark:border-gray-600 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-white">
                        {t('settings.enableWeatherNotifications')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t('settings.weatherNotificationsDesc')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.weatherNotifications.enabled}
                        onChange={(e) => handleWeatherNotificationChange({ enabled: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                        settings.weatherNotifications.enabled 
                          ? 'bg-ios-blue' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                          settings.weatherNotifications.enabled ? 'translate-x-5' : 'translate-x-0.5'
                        } mt-0.5`} />
                      </div>
                    </label>
                  </div>
                  
                  {settings.weatherNotifications.enabled && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                      {/* 알림 타입 설정 */}
                      <div className="space-y-4">
                        {/* 비/눈 알림 */}
                        <div className="flex items-center justify-between p-3 border-2 rounded-ios border-gray-200 dark:border-gray-600">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-800 dark:text-gray-300">☔ {t('settings.rainAlerts')}</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.weatherNotifications.rainAlerts}
                              onChange={(e) => handleWeatherNotificationChange({ rainAlerts: e.target.checked })}
                              className="sr-only"
                            />
                            <div className={`w-8 h-4 rounded-full transition-colors duration-200 ${
                              settings.weatherNotifications.rainAlerts 
                                ? 'bg-blue-500' 
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}>
                              <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                settings.weatherNotifications.rainAlerts ? 'translate-x-4' : 'translate-x-0.5'
                              } mt-0.5`} />
                            </div>
                          </label>
                        </div>

                        {/* 온도 알림 */}
                        <div className="flex items-center justify-between p-3 border-2 rounded-ios border-gray-200 dark:border-gray-600">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-800 dark:text-gray-300">🌡️ {t('settings.temperatureAlerts')}</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.weatherNotifications.temperatureAlerts}
                              onChange={(e) => handleWeatherNotificationChange({ temperatureAlerts: e.target.checked })}
                              className="sr-only"
                            />
                            <div className={`w-8 h-4 rounded-full transition-colors duration-200 ${
                              settings.weatherNotifications.temperatureAlerts 
                                ? 'bg-orange-500' 
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}>
                              <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                settings.weatherNotifications.temperatureAlerts ? 'translate-x-4' : 'translate-x-0.5'
                              } mt-0.5`} />
                            </div>
                          </label>
                        </div>

                        {/* 바람 알림 */}
                        <div className="flex items-center justify-between p-3 border-2 rounded-ios border-gray-200 dark:border-gray-600">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-800 dark:text-gray-300">💨 {t('settings.windAlerts')}</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.weatherNotifications.windAlerts}
                              onChange={(e) => handleWeatherNotificationChange({ windAlerts: e.target.checked })}
                              className="sr-only"
                            />
                            <div className={`w-8 h-4 rounded-full transition-colors duration-200 ${
                              settings.weatherNotifications.windAlerts 
                                ? 'bg-green-500' 
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}>
                              <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                settings.weatherNotifications.windAlerts ? 'translate-x-4' : 'translate-x-0.5'
                              } mt-0.5`} />
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* 알림 타이밍 설정 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                          {t('settings.notificationTiming')}
                        </label>
                        
                        <div className="grid grid-cols-3 gap-2">
                          {[15, 30, 60].map((minutes) => (
                            <label key={minutes} className="flex items-center">
                              <input
                                type="radio"
                                name="notifyBefore"
                                checked={settings.weatherNotifications.notifyBefore === minutes}
                                onChange={() => handleWeatherNotificationChange({ notifyBefore: minutes })}
                                className="sr-only"
                              />
                              <div className={`
                                flex-1 p-3 text-center rounded-ios border-2 cursor-pointer transition-all
                                ${settings.weatherNotifications.notifyBefore === minutes 
                                  ? 'border-ios-blue bg-ios-blue/10' 
                                  : 'border-gray-200 dark:border-gray-600'
                                }
                              `}>
                                <span className="text-xs font-medium text-gray-700 dark:text-white">
                                  {t(`settings.${minutes}minutesBefore`)}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
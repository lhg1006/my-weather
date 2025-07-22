import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Button, Card } from './ui';
import { X, Globe, Palette, Thermometer, Clock, Bell } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { t, i18n } = useTranslation();
  const { settings, updateSettings } = useAppStore();
  
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


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-full max-w-md max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0 border-b border-slate-200 dark:border-slate-600">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
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

              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-6"></div>
                {/* 언어 설정 */}
                <div>
                  <div className="flex items-center mb-3">
                    <Globe className="w-5 h-5 text-ios-blue mr-2" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
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
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
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
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {t('settings.english')}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 테마 설정 */}
                <div>
                  <div className="flex items-center mb-3">
                    <Palette className="w-5 h-5 text-ios-blue mr-2" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
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
                          <span className="text-xs font-medium text-gray-900 dark:text-white">
                            {t(`settings.${theme}Mode`)}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 온도 단위 */}
                <div>
                  <div className="flex items-center mb-3">
                    <Thermometer className="w-5 h-5 text-ios-blue mr-2" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
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
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {t(`settings.${unit}`)}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 스케줄 설정 */}
                <div className="backdrop-blur-md bg-white/20 dark:bg-white/5 rounded-2xl p-6 border border-white/30 dark:border-white/10 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 backdrop-blur-sm bg-white/20 dark:bg-white/10 rounded-xl flex items-center justify-center mr-3 border border-white/30">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {t('settings.schedule')}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          일정 기반 날씨 알림
                        </p>
                      </div>
                    </div>
                    <button className="p-2 backdrop-blur-sm bg-white/30 dark:bg-white/10 rounded-xl hover:bg-white/40 dark:hover:bg-white/20 transition-all duration-200 border border-white/30">
                      <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </button>
                  </div>
                  
                  {/* 스케줄 기능 활성화 */}
                  <div className="flex items-center justify-between mb-6 p-4 backdrop-blur-sm bg-white/30 dark:bg-white/5 rounded-xl border border-white/40 dark:border-white/10">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {t('settings.enableSchedule')}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
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
                      <div className={`w-12 h-6 rounded-full transition-all duration-300 backdrop-blur-sm ${
                        settings.schedule.enabled 
                          ? 'bg-blue-500/80' 
                          : 'bg-white/40 dark:bg-white/20'
                      } border border-white/30`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${
                          settings.schedule.enabled ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5 border border-white/50`} />
                      </div>
                    </label>
                  </div>
                  
                  {settings.schedule.enabled && (
                    <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                      {/* 출근 가능 시간 */}
                      <div className="backdrop-blur-sm bg-white/20 dark:bg-white/5 rounded-xl p-4 border border-white/30 dark:border-white/10">
                        <div className="flex items-center mb-3">
                          <div className="w-6 h-6 bg-emerald-500/90 backdrop-blur-sm rounded-lg flex items-center justify-center mr-2 border border-white/30">
                            <span className="text-white text-xs font-bold">출</span>
                          </div>
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t('settings.workTimeRange')}
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                              {t('settings.from')}
                            </label>
                            <input
                              type="time"
                              value={settings.schedule.workStartTime}
                              onChange={(e) => handleScheduleChange({ workStartTime: e.target.value })}
                              className="w-full px-4 py-3 backdrop-blur-sm bg-white/40 dark:bg-white/10 border border-white/30 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                              {t('settings.to')}
                            </label>
                            <input
                              type="time"
                              value={settings.schedule.workEndTime}
                              onChange={(e) => handleScheduleChange({ workEndTime: e.target.value })}
                              className="w-full px-4 py-3 backdrop-blur-sm bg-white/40 dark:bg-white/10 border border-white/30 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* 퇴근 가능 시간 */}
                      <div className="backdrop-blur-sm bg-white/20 dark:bg-white/5 rounded-xl p-4 border border-white/30 dark:border-white/10">
                        <div className="flex items-center mb-3">
                          <div className="w-6 h-6 bg-orange-500/90 backdrop-blur-sm rounded-lg flex items-center justify-center mr-2 border border-white/30">
                            <span className="text-white text-xs font-bold">퇴</span>
                          </div>
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t('settings.leaveTimeRange')}
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-orange-600 dark:text-orange-400 font-medium mb-2">
                              {t('settings.from')}
                            </label>
                            <input
                              type="time"
                              value={settings.schedule.leaveStartTime}
                              onChange={(e) => handleScheduleChange({ leaveStartTime: e.target.value })}
                              className="w-full px-4 py-3 backdrop-blur-sm bg-white/40 dark:bg-white/10 border border-white/30 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-orange-600 dark:text-orange-400 font-medium mb-2">
                              {t('settings.to')}
                            </label>
                            <input
                              type="time"
                              value={settings.schedule.leaveEndTime}
                              onChange={(e) => handleScheduleChange({ leaveEndTime: e.target.value })}
                              className="w-full px-4 py-3 backdrop-blur-sm bg-white/40 dark:bg-white/10 border border-white/30 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* 활동 시간 */}
                      <div className="backdrop-blur-sm bg-white/20 dark:bg-white/5 rounded-xl p-4 border border-white/30 dark:border-white/10">
                        <div className="flex items-center mb-3">
                          <div className="w-6 h-6 bg-purple-500/90 backdrop-blur-sm rounded-lg flex items-center justify-center mr-2 border border-white/30">
                            <span className="text-white text-xs font-bold">활</span>
                          </div>
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            활동 시간
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-purple-600 dark:text-purple-400 font-medium mb-2">
                              {t('settings.activityStartTime')}
                            </label>
                            <input
                              type="time"
                              value={settings.schedule.activityStartTime}
                              onChange={(e) => handleScheduleChange({ activityStartTime: e.target.value })}
                              className="w-full px-4 py-3 backdrop-blur-sm bg-white/40 dark:bg-white/10 border border-white/30 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-purple-600 dark:text-purple-400 font-medium mb-2">
                              {t('settings.activityEndTime')}
                            </label>
                            <input
                              type="time"
                              value={settings.schedule.activityEndTime}
                              onChange={(e) => handleScheduleChange({ activityEndTime: e.target.value })}
                              className="w-full px-4 py-3 backdrop-blur-sm bg-white/40 dark:bg-white/10 border border-white/30 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 알림 설정 버튼 */}
                      <div className="mt-6">
                        <button className="w-full backdrop-blur-md bg-blue-500/80 hover:bg-blue-600/80 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 border border-white/30">
                          <Bell className="w-5 h-5" />
                          <span>알림 설정</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 p-6 pt-4 border-t border-slate-200 dark:border-slate-600">
                <Button
                  onClick={onClose}
                  className="w-full"
                >
                  {t('common.save')}
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
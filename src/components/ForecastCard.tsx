import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { HourlyForecast, DailyForecast } from '../types';
import { Card } from './ui';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { useAppStore } from '../store/useAppStore';
import { convertTemperature } from '../utils/temperature';

interface ForecastCardProps {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export const ForecastCard = ({ hourly, daily }: ForecastCardProps) => {
  const { t } = useTranslation();
  const { settings } = useAppStore();
  const [isDark, setIsDark] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 스크롤바 숨기기 스타일 추가
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  const locale = settings.language === 'ko' ? ko : enUS;
  
  // 다크모드 감지
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, [settings.theme]);
  
  // 다음 24시간 예보 (현재 시간부터)
  const next24Hours = hourly.slice(0, 24);
  
  // 다음 7일 예보
  const next7Days = daily.slice(0, 7);

  // 스크롤 기능
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.7, 
        delay: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {/* 시간별 예보 */}
      <Card variant="glass">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          {t('weather.hourlyForecast')}
        </h3>
        
        <div className="relative">
          {/* 왼쪽 스크롤 버튼 */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              background: isDark ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            <span className="text-slate-600 dark:text-slate-300 text-sm font-bold">‹</span>
          </button>

          {/* 오른쪽 스크롤 버튼 */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              background: isDark ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            <span className="text-slate-600 dark:text-slate-300 text-sm font-bold">›</span>
          </button>

          {/* 스크롤 컨테이너 */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto hide-scrollbar"
          >
            <div className="flex space-x-4 pb-2 px-6">
            {next24Hours.map((hour, index) => (
              <motion.div 
                key={index}
                className="flex-shrink-0 text-center p-3 rounded-xl min-w-[80px]"
                style={{
                  background: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(12px)',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(31, 38, 135, 0.2)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.7 + (index * 0.05),
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  {index === 0 ? t('time.now') : format(hour.time, 'HH:mm', { locale })}
                </p>
                
                <div 
                  className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-lg shadow-md" 
                  style={{
                    backgroundColor: isDark ? 'rgb(54 114 199 / 80%)' : 'rgb(0 122 255 / 60%)', 
                    border: isDark ? '1px solid rgb(54 114 199 / 50%)' : '1px solid rgb(0 122 255 / 30%)'
                  }}
                >
                  <img 
                    src={hour.icon.startsWith('http') ? hour.icon : `https://openweathermap.org/img/wn/${hour.icon}.png`}
                    alt={hour.description}
                    className="w-8 h-8 object-contain drop-shadow-sm"
                    style={{
                      filter: 'brightness(1.1) contrast(1.2) saturate(1.3)'
                    }}
                  />
                </div>
                
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                  {convertTemperature(hour.temperature, settings.temperatureUnit)}°
                </p>
                
                {hour.precipitation > 0 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {hour.precipitation}mm
                  </p>
                )}
              </motion.div>
            ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 주간 예보 */}
      <Card variant="glass">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          {t('weather.weeklyForecast')}
        </h3>
        
        <div className="space-y-3">
          {next7Days.map((day, index) => (
            <motion.div 
              key={index}
              className="flex items-center p-3 rounded-xl"
              style={{
                background: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(12px)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(31, 38, 135, 0.2)'
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: 1.2 + (index * 0.1),
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {/* 아이콘과 요일 영역 - 고정 너비 */}
              <div className="flex items-center w-24 flex-shrink-0">
                <div 
                  className="w-10 h-10 mr-3 flex items-center justify-center rounded-lg shadow-md" 
                  style={{
                    backgroundColor: isDark ? 'rgb(54 114 199 / 80%)' : 'rgb(0 122 255 / 60%)', 
                    border: isDark ? '1px solid rgb(54 114 199 / 50%)' : '1px solid rgb(0 122 255 / 30%)'
                  }}
                >
                  <img 
                    src={day.icon.startsWith('http') ? day.icon : `https://openweathermap.org/img/wn/${day.icon}.png`}
                    alt={day.description}
                    className="w-8 h-8 object-contain drop-shadow-sm"
                    style={{
                      filter: 'brightness(1.1) contrast(1.2) saturate(1.3)'
                    }}
                  />
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-medium leading-tight ${(() => {
                    const dayOfWeek = day.date.getDay(); // 0=일요일, 6=토요일
                    if (dayOfWeek === 0) return 'text-red-500'; // 일요일
                    if (dayOfWeek === 6) return 'text-blue-500'; // 토요일
                    return 'text-slate-900 dark:text-white'; // 평일 & 오늘
                  })()}`}>
                    {index === 0 
                      ? '오늘'
                      : `${format(day.date, 'EEE', { locale })}(${format(day.date, 'd', { locale })})`
                    }
                  </p>
                </div>
              </div>
              
              {/* 날씨 설명 영역 - 가변 너비 */}
              <div className="flex-1 text-center px-3">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {day.description}
                  {day.precipitation > 0 && (
                    <span className="text-blue-600 dark:text-blue-400 ml-1">
                      {day.precipitation}mm
                    </span>
                  )}
                </p>
              </div>
              
              {/* 온도 영역 - 고정 너비 */}
              <div className="w-16 flex-shrink-0 text-right">
                <div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {convertTemperature(day.tempMax, settings.temperatureUnit)}°
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">
                    {convertTemperature(day.tempMin, settings.temperatureUnit)}°
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
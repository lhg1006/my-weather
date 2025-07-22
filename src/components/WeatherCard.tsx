import type { WeatherData } from '../types';
import { Card } from './ui';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { convertTemperature, formatTemperature } from '../utils/temperature';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  Sun
} from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard = ({ weather }: WeatherCardProps) => {
  const { t } = useTranslation();
  const { settings } = useAppStore();
  const [isDark, setIsDark] = useState(false);
  
  // 다크모드 감지
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // MutationObserver로 클래스 변경 감지
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, [settings.theme]);

  const weatherDetails = [
    {
      icon: <Thermometer className="w-5 h-5" />,
      label: t('weather.feelLike'),
      value: formatTemperature(weather.feelsLike, settings.temperatureUnit),
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: t('weather.humidity'),
      value: `${weather.humidity}%`,
    },
    {
      icon: <Wind className="w-5 h-5" />,
      label: t('weather.windSpeed'),
      value: `${weather.windSpeed} km/h`,
    },
    {
      icon: <Eye className="w-5 h-5" />,
      label: t('weather.visibility'),
      value: `${weather.visibility} km`,
    },
    {
      icon: <Gauge className="w-5 h-5" />,
      label: t('weather.pressure'),
      value: `${weather.pressure} hPa`,
    },
    {
      icon: <Sun className="w-5 h-5" />,
      label: t('weather.uvIndex'),
      value: weather.uvIndex.toString(),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <Card variant="glass" className="mb-6">
      <div className="text-center">
        <div className="flex flex-col items-center justify-center mb-4">
          {/* 메인 날씨 아이콘 */}
          <div 
            className="w-20 h-20 mb-4 flex items-center justify-center rounded-2xl shadow-lg" 
            style={{
              backgroundColor: isDark ? 'rgb(54 114 199 / 80%)' : 'rgb(0 122 255 / 60%)', 
              border: isDark ? '1px solid rgb(54 114 199 / 50%)' : '1px solid rgb(0 122 255 / 30%)'
            }}
          >
            <img 
              src={weather.icon.startsWith('http') ? weather.icon : `https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-16 h-16 object-contain drop-shadow-lg"
              style={{
                filter: 'brightness(1.1) contrast(1.2) saturate(1.4)'
              }}
            />
          </div>
          
          <div className="text-6xl font-light text-slate-900 dark:text-white">
            {convertTemperature(weather.temperature, settings.temperatureUnit)}°
          </div>
        </div>
        
        <h2 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
          {weather.location.city}, {weather.location.country}
        </h2>
        
        <p className="text-slate-600 dark:text-slate-300 mb-6 capitalize">
          {weather.description}
        </p>

        <div className="grid grid-cols-2 gap-4">
          {weatherDetails.map((detail, index) => (
            <motion.div 
              key={index}
              className="flex items-center p-3 rounded-xl"
              style={{
                background: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(12px)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(31, 38, 135, 0.2)'
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.5 + (index * 0.1),
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <div 
                className="mr-3 w-8 h-8 flex items-center justify-center rounded-lg" 
                style={{
                  backgroundColor: isDark ? 'rgb(54 114 199 / 80%)' : 'rgb(0 122 255 / 60%)'
                }}
              >
                <div className="text-white">
                  {detail.icon}
                </div>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {detail.label}
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {detail.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {weather.precipitation > 0 && (
          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {t('weather.precipitation')}: {weather.precipitation}mm
              </span>
            </div>
          </div>
        )}
      </div>
      </Card>
    </motion.div>
  );
};
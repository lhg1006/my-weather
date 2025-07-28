import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { checkWeatherAlerts, consolidateAlerts } from '../utils/weatherNotifications';
import toast from 'react-hot-toast';
import type { WeatherData } from '../types';

interface UseInitialWeatherAlertProps {
  currentWeather: WeatherData | null;
}

export const useInitialWeatherAlert = ({ currentWeather }: UseInitialWeatherAlertProps) => {
  const { settings } = useAppStore();
  const hasShownAlert = useRef(false);

  useEffect(() => {
    // 이미 알림을 표시했거나, 날씨 데이터가 없으면 종료
    if (hasShownAlert.current || !currentWeather) return;

    // 날씨 알림이 비활성화되어 있으면 종료
    if (!settings.weatherNotifications.enabled) return;

    const alerts = checkWeatherAlerts(currentWeather);
    if (alerts.length === 0) return;

    // 사용자 설정에 따라 알림 필터링
    const filteredAlerts = alerts.filter(alert => {
      if (alert.type === 'rain' && !settings.weatherNotifications.rainAlerts) return false;
      if ((alert.type === 'cold' || alert.type === 'hot') && !settings.weatherNotifications.temperatureAlerts) return false;
      if (alert.type === 'wind' && !settings.weatherNotifications.windAlerts) return false;
      return true;
    });

    if (filteredAlerts.length === 0) return;

    // 최대 2개까지 통합하여 표시
    const consolidatedAlerts = consolidateAlerts(filteredAlerts);
    
    // 알림 표시 (1초 지연으로 앱 로딩 후 표시)
    setTimeout(() => {
      consolidatedAlerts.forEach((alert, index) => {
        setTimeout(() => {
          toast(alert.message, {
            duration: 6000,
            position: 'top-center',
            style: {
              background: alert.severity === 'high' ? '#ef4444' : 
                         alert.severity === 'medium' ? '#f97316' : '#3b82f6',
              color: 'white',
              fontWeight: '500',
              fontSize: '14px',
              padding: '12px 20px',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              maxWidth: '90vw',
            },
            icon: null, // 메시지에 이미 아이콘이 포함되어 있음
          });
        }, index * 1000); // 알림 간격을 둠
      });
    }, 1000);

    // 알림을 표시했음을 기록
    hasShownAlert.current = true;
  }, [currentWeather, settings.weatherNotifications]);
};
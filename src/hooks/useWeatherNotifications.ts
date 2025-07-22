import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { checkWeatherAlerts, consolidateAlerts, formatAlertMessage } from '../utils/weatherNotifications';
import { getCurrentTimeStatus } from '../utils/schedule';
import toast from 'react-hot-toast';
import type { WeatherData } from '../types';

interface UseWeatherNotificationsProps {
  currentWeather: WeatherData | null;
}

export const useWeatherNotifications = ({ currentWeather }: UseWeatherNotificationsProps) => {
  const { settings } = useAppStore();
  const lastNotificationTime = useRef<Record<string, number>>({});
  const checkInterval = useRef<NodeJS.Timeout | null>(null);

  // 중복 알림 방지를 위한 키 생성
  const getNotificationKey = (scheduleType: string, date: string) => {
    return `${scheduleType}-${date}`;
  };

  // 특정 시간까지 몇 분 남았는지 계산
  const getMinutesUntilTime = (targetTime: string): number => {
    const now = new Date();
    const [hours, minutes] = targetTime.split(':').map(Number);
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);
    
    // 다음날인 경우
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
    
    return Math.floor((target.getTime() - now.getTime()) / (1000 * 60));
  };

  // 날씨 알림 표시
  const showWeatherNotification = (scheduleType: string) => {
    if (!currentWeather || !settings.weatherNotifications.enabled) return;

    const alerts = checkWeatherAlerts(currentWeather);
    if (alerts.length === 0) return;

    const today = new Date().toDateString();
    const notificationKey = getNotificationKey(scheduleType, today);
    const now = Date.now();

    // 같은 날 같은 스케줄에 대해 이미 알림을 보냈는지 확인
    if (lastNotificationTime.current[notificationKey] && 
        (now - lastNotificationTime.current[notificationKey]) < 60 * 60 * 1000) { // 1시간 내 중복 방지
      return;
    }

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
    
    consolidatedAlerts.forEach((alert, index) => {
      setTimeout(() => {
        toast(formatAlertMessage(alert), {
          duration: 5000,
          position: 'top-center',
          style: {
            background: alert.severity === 'high' ? '#ef4444' : 
                       alert.severity === 'medium' ? '#f97316' : '#3b82f6',
            color: 'white',
            fontWeight: '500',
          },
          icon: alert.icon,
        });
      }, index * 1000); // 알림 간격을 둠
    });

    // 알림 시간 기록
    lastNotificationTime.current[notificationKey] = now;
  };

  // 스케줄 체크 및 알림 실행
  const checkScheduleNotifications = () => {
    if (!settings.schedule.enabled || !currentWeather) return;

    const notifyBefore = settings.weatherNotifications.notifyBefore;

    // 출근 시간 알림
    if (settings.schedule.workNotificationEnabled && settings.schedule.workStartTime) {
      const minutesUntilWork = getMinutesUntilTime(settings.schedule.workStartTime);
      if (minutesUntilWork === notifyBefore) {
        showWeatherNotification('work');
      }
    }

    // 퇴근 시간 알림
    if (settings.schedule.leaveNotificationEnabled && settings.schedule.leaveStartTime) {
      const minutesUntilLeave = getMinutesUntilTime(settings.schedule.leaveStartTime);
      if (minutesUntilLeave === notifyBefore) {
        showWeatherNotification('leave');
      }
    }

    // 활동 시간 알림
    if (settings.schedule.activityNotificationEnabled && settings.schedule.activityStartTime) {
      const minutesUntilActivity = getMinutesUntilTime(settings.schedule.activityStartTime);
      if (minutesUntilActivity === notifyBefore) {
        showWeatherNotification('activity');
      }
    }
  };

  // 1분마다 스케줄 체크
  useEffect(() => {
    if (settings.weatherNotifications.enabled && settings.schedule.enabled) {
      checkInterval.current = setInterval(checkScheduleNotifications, 60000); // 1분마다
      
      // 초기 체크도 실행
      checkScheduleNotifications();
    }

    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, [settings, currentWeather]);

  // 수동으로 현재 날씨 알림 테스트 (개발용)
  const testWeatherNotification = () => {
    showWeatherNotification('test');
  };

  return {
    testWeatherNotification
  };
};
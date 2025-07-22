import type { WeatherData } from '../types';

export interface WeatherAlert {
  type: 'rain' | 'cold' | 'hot' | 'wind';
  message: string;
  icon: string;
  severity: 'low' | 'medium' | 'high';
}

/**
 * 날씨 데이터를 기반으로 알림이 필요한 조건들을 체크
 */
export const checkWeatherAlerts = (weather: WeatherData): WeatherAlert[] => {
  const alerts: WeatherAlert[] = [];

  // 강수량 체크 (비/눈)
  if (weather.precipitation > 0) {
    if (weather.precipitation >= 5) {
      alerts.push({
        type: 'rain',
        message: `🌧️ 많은 비가 예상됩니다! 우산과 우의를 준비하세요 (${weather.precipitation}mm)`,
        icon: '🌧️',
        severity: 'high'
      });
    } else if (weather.precipitation >= 1) {
      alerts.push({
        type: 'rain',
        message: `☔ 비가 예상됩니다! 우산을 챙기세요 (${weather.precipitation}mm)`,
        icon: '☔',
        severity: 'medium'
      });
    } else {
      alerts.push({
        type: 'rain',
        message: `🌦️ 가벼운 비가 예상됩니다! 작은 우산을 준비하세요 (${weather.precipitation}mm)`,
        icon: '🌦️',
        severity: 'low'
      });
    }
  }

  // 추위 체크
  if (weather.temperature <= 0) {
    alerts.push({
      type: 'cold',
      message: `🧊 매우 추운 날씨입니다! 따뜻하게 입고 나가세요 (${weather.temperature}°C)`,
      icon: '🧊',
      severity: 'high'
    });
  } else if (weather.temperature <= 5) {
    alerts.push({
      type: 'cold',
      message: `❄️ 쌀쌀한 날씨입니다! 겉옷을 챙기세요 (${weather.temperature}°C)`,
      icon: '❄️',
      severity: 'medium'
    });
  }

  // 더위 체크
  if (weather.temperature >= 35) {
    alerts.push({
      type: 'hot',
      message: `🔥 매우 더운 날씨입니다! 물을 충분히 챙기고 시원한 곳에 머무르세요 (${weather.temperature}°C)`,
      icon: '🔥',
      severity: 'high'
    });
  } else if (weather.temperature >= 30) {
    alerts.push({
      type: 'hot',
      message: `☀️ 더운 날씨입니다! 물을 충분히 챙기세요 (${weather.temperature}°C)`,
      icon: '☀️',
      severity: 'medium'
    });
  }

  // 강풍 체크
  if (weather.windSpeed >= 25) {
    alerts.push({
      type: 'wind',
      message: `💨 매우 강한 바람입니다! 우산보다 우의를 추천해요 (${weather.windSpeed}km/h)`,
      icon: '💨',
      severity: 'high'
    });
  } else if (weather.windSpeed >= 15) {
    alerts.push({
      type: 'wind',
      message: `🌬️ 바람이 강합니다! 주의하세요 (${weather.windSpeed}km/h)`,
      icon: '🌬️',
      severity: 'medium'
    });
  }

  return alerts;
};

/**
 * 알림 메시지를 토스트에 적합한 형태로 포맷팅
 */
export const formatAlertMessage = (alert: WeatherAlert): string => {
  return `${alert.icon} ${alert.message}`;
};

/**
 * 여러 알림을 하나의 메시지로 통합 (최대 2개까지)
 */
export const consolidateAlerts = (alerts: WeatherAlert[]): WeatherAlert[] => {
  if (alerts.length === 0) return [];
  
  // 심각도 순으로 정렬
  const sortedAlerts = alerts.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });

  // 최대 2개까지만 반환
  return sortedAlerts.slice(0, 2);
};


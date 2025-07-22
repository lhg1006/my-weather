export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  feelsLike: number;
  description: string;
  icon: string;
  location: LocationData;
  timestamp: Date;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  timezone: string;
}

export interface HourlyForecast {
  time: Date;
  temperature: number;
  description: string;
  icon: string;
  precipitation: number;
}

export interface DailyForecast {
  date: Date;
  tempMax: number;
  tempMin: number;
  description: string;
  icon: string;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}


export interface WeatherNotificationSettings {
  enabled: boolean; // 날씨 알림 전체 활성화 여부
  rainAlerts: boolean; // 비/눈 알림
  temperatureAlerts: boolean; // 극한 온도 알림
  windAlerts: boolean; // 강풍 알림
  notifyBefore: number; // 몇 분 전에 알림할지 (기본 30분)
}

export interface ScheduleSettings {
  workStartTime: string; // 출근 가능 시작 시간 "07:00"
  workEndTime: string;   // 출근 가능 종료 시간 "10:00"
  leaveStartTime: string; // 퇴근 가능 시작 시간 "17:00"
  leaveEndTime: string;   // 퇴근 가능 종료 시간 "19:00"
  activityStartTime: string; // 활동 시작 시간
  activityEndTime: string;   // 활동 종료 시간
  enabled: boolean; // 스케줄 기능 사용 여부
  workNotificationEnabled: boolean; // 출근 시간 알림 여부
  leaveNotificationEnabled: boolean; // 퇴근 시간 알림 여부
  activityNotificationEnabled: boolean; // 활동 시간 알림 여부
}

export interface AppSettings {
  language: 'ko' | 'en';
  theme: 'light' | 'dark' | 'system';
  temperatureUnit: 'celsius' | 'fahrenheit';
  schedule: ScheduleSettings;
  weatherNotifications: WeatherNotificationSettings;
}

export interface WeatherApiError {
  message: string;
  code: string;
  source: 'openweather';
}

export type WeatherCondition = 
  | 'clear'
  | 'cloudy'
  | 'partlyCloudy'
  | 'rain'
  | 'snow'
  | 'thunderstorm'
  | 'fog'
  | 'mist';

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
}
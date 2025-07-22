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


export interface ScheduleSettings {
  workStartTime: string; // 출근 가능 시작 시간 "07:00"
  workEndTime: string;   // 출근 가능 종료 시간 "10:00"
  leaveStartTime: string; // 퇴근 가능 시작 시간 "17:00"
  leaveEndTime: string;   // 퇴근 가능 종료 시간 "19:00"
  activityStartTime: string; // 활동 시작 시간
  activityEndTime: string;   // 활동 종료 시간
  enabled: boolean; // 스케줄 기능 사용 여부
}

export interface AppSettings {
  language: 'ko' | 'en';
  theme: 'light' | 'dark' | 'system';
  temperatureUnit: 'celsius' | 'fahrenheit';
  schedule: ScheduleSettings;
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
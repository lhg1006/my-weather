import type { WeatherData, HourlyForecast, DailyForecast } from '../../types';
import { rateLimiter } from './rateLimiter';
import toast from 'react-hot-toast';
import { getCityNameInKorean, getCountryNameInKorean, getWeatherDescriptionInKorean } from '../../utils/locationMapping';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export class WeatherService {
  // OpenWeatherMap API
  private async fetchOpenWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      // 무료 할당량 체크
      if (!rateLimiter.canMakeCall('openweather')) {
        const stats = rateLimiter.getUsageStats();
        const remainingTime = rateLimiter.getRemainingTime('openweather');
        toast.error(`30초마다 새로고침 가능합니다 (${remainingTime}초 후)`);
        return null;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) throw new Error('OpenWeather API failed');
      
      // 성공적인 호출 기록
      rateLimiter.recordCall('openweather');
      
      const data = await response.json();
      
      // 디버깅: 원본 API 응답 데이터 확인
      console.log('🌍 OpenWeatherMap 원본 API 응답:', data);
      console.log('📍 위치 정보:', {
        원본_도시명: data.name,
        원본_국가코드: data.sys.country,
        좌표: { lat: data.coord?.lat, lon: data.coord?.lon },
        전달받은_좌표: { lat, lon }
      });
      
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        precipitation: data.rain?.['1h'] || 0,
        windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // meters to km
        uvIndex: 0, // OpenWeather free tier doesn't include UV
        feelsLike: Math.round(data.main.feels_like),
        description: getWeatherDescriptionInKorean(data.weather[0].description),
        icon: data.weather[0].icon,
        location: {
          latitude: lat,
          longitude: lon,
          city: getCityNameInKorean(data.name),
          country: getCountryNameInKorean(data.sys.country),
          timezone: 'UTC', // OpenWeather free tier doesn't include timezone
        },
        timestamp: new Date(),
      };
      
      // 디버깅: 변환된 최종 데이터 확인
      const finalData = {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        precipitation: data.rain?.['1h'] || 0,
        windSpeed: Math.round(data.wind.speed * 3.6),
        pressure: data.main.pressure,
        visibility: data.visibility / 1000,
        uvIndex: 0,
        feelsLike: Math.round(data.main.feels_like),
        description: getWeatherDescriptionInKorean(data.weather[0].description),
        icon: data.weather[0].icon,
        location: {
          latitude: lat,
          longitude: lon,
          city: getCityNameInKorean(data.name),
          country: getCountryNameInKorean(data.sys.country),
          timezone: 'UTC',
        },
        timestamp: new Date(),
      };
      
      console.log('🔄 변환된 최종 WeatherData:', finalData);
      console.log('🌏 위치 변환 결과:', {
        원본: `${data.name}, ${data.sys.country}`,
        변환후: `${getCityNameInKorean(data.name)}, ${getCountryNameInKorean(data.sys.country)}`
      });
      console.log('🌤️ 날씨 설명 번역:', {
        원본: data.weather[0].description,
        변환후: getWeatherDescriptionInKorean(data.weather[0].description)
      });
      
      return finalData;
    } catch (error) {
      console.error('OpenWeather API error:', error);
      return null;
    }
  }


  // OpenWeatherMap API에서 현재 날씨 데이터 가져오기
  public async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    // API 키 확인
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'undefined') {
      throw new Error('OpenWeatherMap API 키가 설정되지 않았습니다.');
    }

    const weatherData = await this.fetchOpenWeatherData(lat, lon);
    
    if (!weatherData) {
      throw new Error('OpenWeatherMap API 호출이 실패했습니다. API 키를 확인해주세요.');
    }

    console.log('OpenWeatherMap API에서 날씨 데이터를 성공적으로 가져왔습니다.');

    return weatherData;
  }

  // OpenWeatherMap API에서 예보 데이터 가져오기 (5일 예보)
  public async getForecastData(lat: number, lon: number): Promise<{ hourly: HourlyForecast[]; daily: DailyForecast[] }> {
    try {
      // 무료 할당량 체크
      if (!rateLimiter.canMakeCall('openweather')) {
        const remainingTime = rateLimiter.getRemainingTime('openweather');
        toast.error(`30초마다 새로고침 가능합니다 (${remainingTime}초 후)`);
        throw new Error('API 호출 한도에 도달했습니다. 잠시 후 다시 시도해주세요.');
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) throw new Error('OpenWeather Forecast API failed');
      
      // 성공적인 호출 기록
      rateLimiter.recordCall('openweather');
      
      const data = await response.json();
      
      // 시간별 예보 (오늘과 내일 24시간)
      const hourly: HourlyForecast[] = data.list.slice(0, 8).map((hour: any) => ({
        time: new Date(hour.dt * 1000),
        temperature: Math.round(hour.main.temp),
        description: hour.weather[0].description,
        icon: hour.weather[0].icon,
        precipitation: hour.rain?.['3h'] || 0,
      }));

      // 일별 예보 (5일)
      const dailyMap = new Map<string, any>();
      
      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();
        
        if (!dailyMap.has(dateKey)) {
          dailyMap.set(dateKey, {
            date,
            tempMax: item.main.temp_max,
            tempMin: item.main.temp_min,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            precipitation: item.rain?.['3h'] || 0,
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed * 3.6), // m/s to km/h
          });
        } else {
          const existing = dailyMap.get(dateKey);
          existing.tempMax = Math.max(existing.tempMax, item.main.temp_max);
          existing.tempMin = Math.min(existing.tempMin, item.main.temp_min);
          existing.precipitation += item.rain?.['3h'] || 0;
        }
      });

      const daily: DailyForecast[] = Array.from(dailyMap.values()).map(day => ({
        date: day.date,
        tempMax: Math.round(day.tempMax),
        tempMin: Math.round(day.tempMin),
        description: day.description,
        icon: day.icon,
        precipitation: Number(day.precipitation.toFixed(1)),
        humidity: day.humidity,
        windSpeed: day.windSpeed,
      }));

      return { hourly, daily };
    } catch (error) {
      console.error('OpenWeather Forecast API error:', error);
      throw error;
    }
  }
}

export const weatherService = new WeatherService();
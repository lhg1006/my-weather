import { useQuery } from '@tanstack/react-query';
import { weatherService } from '../services/weather/weatherService';

// 현재 날씨 데이터 훅 - 무료 할당량 보호를 위해 캐싱 강화
export const useCurrentWeather = (lat: number | null, lon: number | null) => {
  return useQuery({
    queryKey: ['weather', 'current', lat, lon],
    queryFn: () => weatherService.getWeatherData(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 10 * 60 * 1000, // 10분간 fresh 상태 유지 (API 호출 최소화)
    gcTime: 60 * 60 * 1000, // 1시간간 캐시 유지
    retry: 2, // 재시도 횟수 줄임
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 방지
    refetchOnMount: false, // 마운트 시 재요청 방지 (캐시 우선)
  });
};

// 예보 데이터 훅 - 더 긴 캐싱으로 API 호출 최소화
export const useForecastWeather = (lat: number | null, lon: number | null) => {
  return useQuery({
    queryKey: ['weather', 'forecast', lat, lon],
    queryFn: () => weatherService.getForecastData(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 30 * 60 * 1000, // 30분간 fresh 상태 유지 (예보는 자주 바뀌지 않음)
    gcTime: 2 * 60 * 60 * 1000, // 2시간간 캐시 유지
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// 통합 날씨 데이터 훅 (현재 + 예보)
export const useWeatherData = (lat: number | null, lon: number | null) => {
  const currentWeatherQuery = useCurrentWeather(lat, lon);
  const forecastQuery = useForecastWeather(lat, lon);

  return {
    // 현재 날씨
    currentWeather: currentWeatherQuery.data,
    isCurrentWeatherLoading: currentWeatherQuery.isLoading,
    currentWeatherError: currentWeatherQuery.error,
    
    // 예보
    forecast: forecastQuery.data,
    isForecastLoading: forecastQuery.isLoading,
    forecastError: forecastQuery.error,
    
    // 전체 상태
    isLoading: currentWeatherQuery.isLoading || forecastQuery.isLoading,
    isError: currentWeatherQuery.isError || forecastQuery.isError,
    error: currentWeatherQuery.error || forecastQuery.error,
    
    // 리프레시 함수 - 30초 간격 체크 후 실행
    refetch: async () => {
      const { rateLimiter } = await import('../services/weather/rateLimiter');
      const toast = (await import('react-hot-toast')).default;
      
      if (!rateLimiter.canMakeCall('openweather')) {
        const remainingTime = rateLimiter.getRemainingTime('openweather');
        toast.error(`30초마다 새로고침 가능합니다 (${remainingTime}초 후)`);
        return;
      }
      
      currentWeatherQuery.refetch();
      forecastQuery.refetch();
    },
  };
};
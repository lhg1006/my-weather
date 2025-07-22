import { useAppStore } from '../store/useAppStore';
import type { GeolocationCoords } from '../types';

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const {
    currentLocation,
    isLocationLoading,
    locationError,
    setCurrentLocation,
    setLocationLoading,
    setLocationError,
  } = useAppStore();

  const defaultOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000, // 10초 타임아웃
    maximumAge: 300000, // 5분간 캐시된 위치 허용
    ...options,
  };

  const getCurrentPosition = (): Promise<GeolocationCoords> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      setLocationLoading(true);
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: GeolocationCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          
          setCurrentLocation(coords);
          setLocationLoading(false);
          resolve(coords);
        },
        (error) => {
          let errorMessage: string;
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다.';
              break;
            case error.TIMEOUT:
              errorMessage = '위치 요청 시간이 초과되었습니다.';
              break;
            default:
              errorMessage = '알 수 없는 오류가 발생했습니다.';
              break;
          }
          
          setLocationError(errorMessage);
          setLocationLoading(false);
          reject(new Error(errorMessage));
        },
        defaultOptions
      );
    });
  };

  const watchPosition = (): number | null => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return null;
    }

    setLocationLoading(true);
    setLocationError(null);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords: GeolocationCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        
        setCurrentLocation(coords);
        setLocationLoading(false);
      },
      (error) => {
        let errorMessage: string;
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 권한이 거부되었습니다.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            errorMessage = '위치 요청 시간이 초과되었습니다.';
            break;
          default:
            errorMessage = '알 수 없는 오류가 발생했습니다.';
            break;
        }
        
        setLocationError(errorMessage);
        setLocationLoading(false);
      },
      defaultOptions
    );

    return watchId;
  };

  const clearWatch = (watchId: number) => {
    navigator.geolocation.clearWatch(watchId);
  };

  // 컴포넌트 마운트 시 자동으로 위치 가져오기 (선택적)
  const requestLocation = () => {
    getCurrentPosition().catch((error) => {
      console.error('Failed to get location:', error);
    });
  };

  // 위치 권한 상태 확인
  const checkPermission = async (): Promise<PermissionState> => {
    if (!navigator.permissions) {
      return 'prompt';
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state;
    } catch (error) {
      console.error('Failed to check geolocation permission:', error);
      return 'prompt';
    }
  };

  return {
    // 상태
    currentLocation,
    isLocationLoading,
    locationError,
    
    // 메서드
    getCurrentPosition,
    requestLocation,
    watchPosition,
    clearWatch,
    checkPermission,
    
    // 유틸리티
    hasLocation: currentLocation !== null,
    isSupported: 'geolocation' in navigator,
  };
};
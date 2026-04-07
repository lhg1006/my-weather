// API 무료 할당량 보호를 위한 Rate Limiter

interface ApiLimits {
  openweather: {
    callsPerMinute: number;
    callsPerDay: number;
    maxCalls: number;
  };
}

// OpenWeatherMap 무료 티어 제한 (보수적으로 설정)
const API_LIMITS: ApiLimits = {
  openweather: {
    callsPerMinute: 60,
    callsPerDay: 1000,
    maxCalls: 950, // 여유분 50개
  },
};

class RateLimiter {
  private calls: { [key: string]: number[] } = {};
  private dailyCalls: { [key: string]: { date: string; count: number } } = {};
  private lastCallTime: { [key: string]: number } = {};

  constructor() {
    // 로컬스토리지에서 일일 호출 수 복원
    const stored = localStorage.getItem('api-daily-calls');
    if (stored) {
      try {
        this.dailyCalls = JSON.parse(stored);
      } catch (error) {
        console.warn('Failed to parse stored API calls:', error);
      }
    }
    // sessionStorage에서 마지막 호출 시간 복원 (새로고침 시 유지, 탭 닫으면 리셋)
    const lastCall = sessionStorage.getItem('api-last-call-time');
    if (lastCall) {
      try {
        this.lastCallTime = JSON.parse(lastCall);
      } catch (error) {
        console.warn('Failed to parse stored last call time:', error);
      }
    }
  }

  private saveToStorage() {
    localStorage.setItem('api-daily-calls', JSON.stringify(this.dailyCalls));
  }

  private getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private cleanOldCalls(apiName: string) {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    
    if (!this.calls[apiName]) {
      this.calls[apiName] = [];
    }
    
    // 1분 이전 호출 기록 제거
    this.calls[apiName] = this.calls[apiName].filter(time => time > oneMinuteAgo);
  }

  private updateDailyCount(apiName: string) {
    const today = this.getTodayString();
    
    if (!this.dailyCalls[apiName] || this.dailyCalls[apiName].date !== today) {
      this.dailyCalls[apiName] = { date: today, count: 0 };
    }
    
    this.dailyCalls[apiName].count++;
    this.saveToStorage();
  }

  canMakeCall(apiName: 'openweather'): boolean {
    const now = Date.now();

    // 30초 간격 체크 — 단, 초기 로딩(lastCallTime 없음)이거나
    // 동시 호출(2초 이내 연속)은 허용
    const lastCall = this.lastCallTime[apiName] || 0;
    const timeSinceLastCall = now - lastCall;
    const minInterval = 30 * 1000; // 30초
    const batchWindow = 2 * 1000; // 2초 이내 동시 호출은 허용

    if (lastCall > 0 && timeSinceLastCall < minInterval && timeSinceLastCall > batchWindow) {
      return false;
    }
    
    this.cleanOldCalls(apiName);
    
    const today = this.getTodayString();
    const dailyCount = this.dailyCalls[apiName]?.date === today 
      ? this.dailyCalls[apiName].count 
      : 0;

    const minuteCalls = this.calls[apiName]?.length || 0;
    
    // 분당 호출 수 체크
    if (minuteCalls >= API_LIMITS.openweather.callsPerMinute) {
      console.warn(`OpenWeather: 분당 호출 한도 초과 (${minuteCalls}/${API_LIMITS.openweather.callsPerMinute})`);
      return false;
    }
    
    // 일일 호출 수 체크
    if (dailyCount >= API_LIMITS.openweather.maxCalls) {
      console.warn(`OpenWeather: 일일 호출 한도 초과 (${dailyCount}/${API_LIMITS.openweather.maxCalls})`);
      return false;
    }

    return true;
  }

  recordCall(apiName: 'openweather') {
    const now = Date.now();
    
    if (!this.calls[apiName]) {
      this.calls[apiName] = [];
    }
    
    this.calls[apiName].push(now);
    this.lastCallTime[apiName] = now;
    sessionStorage.setItem('api-last-call-time', JSON.stringify(this.lastCallTime));
    this.updateDailyCount(apiName);
    
    console.log(`API 호출 기록: ${apiName} (오늘: ${this.dailyCalls[apiName]?.count || 0})`);
  }

  getUsageStats() {
    const today = this.getTodayString();
    
    return {
      openweather: {
        dailyUsed: this.dailyCalls.openweather?.date === today 
          ? this.dailyCalls.openweather.count 
          : 0,
        dailyLimit: API_LIMITS.openweather.maxCalls,
        minuteUsed: this.calls.openweather?.length || 0,
        minuteLimit: API_LIMITS.openweather.callsPerMinute,
      },
    };
  }

  resetDailyLimits() {
    this.dailyCalls = {};
    this.saveToStorage();
    console.log('일일 API 호출 한도가 리셋되었습니다.');
  }

  getRemainingTime(apiName: 'openweather'): number {
    const lastCall = this.lastCallTime[apiName] || 0;
    if (lastCall === 0) return 0;
    const timeSinceLastCall = Date.now() - lastCall;
    const minInterval = 30 * 1000; // 30초
    const remainingTime = Math.ceil((minInterval - timeSinceLastCall) / 1000);

    return Math.max(0, remainingTime);
  }
}

export const rateLimiter = new RateLimiter();
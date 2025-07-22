import { useState, useEffect } from 'react';
import { Card } from './ui';
import { BarChart, Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { rateLimiter } from '../services/weather/rateLimiter';

export const ApiUsageMonitor = () => {
  const [usage, setUsage] = useState(rateLimiter.getUsageStats());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsage(rateLimiter.getUsageStats());
    }, 10000); // 10초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  const getUsageColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const resetLimits = () => {
    rateLimiter.resetDailyLimits();
    setUsage(rateLimiter.getUsageStats());
  };

  const hasHighUsage = 
    (usage.openweather.dailyUsed / usage.openweather.dailyLimit) > 0.8;

  if (!isExpanded && !hasHighUsage) {
    return (
      <div className="mb-4">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <BarChart className="w-4 h-4" />
          <span>API 사용량 보기</span>
        </button>
      </div>
    );
  }

  return (
    <Card variant="glass" className={`mb-6 ${hasHighUsage ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            무료 할당량 보호
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasHighUsage && (
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            {isExpanded ? '접기' : '펼치기'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* OpenWeatherMap */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              OpenWeatherMap
            </span>
            <span className={`text-sm font-mono ${getUsageColor(usage.openweather.dailyUsed, usage.openweather.dailyLimit)}`}>
              {usage.openweather.dailyUsed} / {usage.openweather.dailyLimit}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(usage.openweather.dailyUsed, usage.openweather.dailyLimit)}`}
              style={{
                width: `${Math.min((usage.openweather.dailyUsed / usage.openweather.dailyLimit) * 100, 100)}%`
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>일일 사용량</span>
            <span>{Math.round((usage.openweather.dailyUsed / usage.openweather.dailyLimit) * 100)}%</span>
          </div>

          {isExpanded && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              분당: {usage.openweather.minuteUsed} / {usage.openweather.minuteLimit}
            </div>
          )}
        </div>


        {/* 경고 메시지 */}
        {hasHighUsage && (
          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-800/30 rounded-md">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              OpenWeatherMap API 무료 할당량의 80%를 사용했습니다. API 호출이 제한될 수 있습니다.
            </p>
          </div>
        )}

        {/* 개발용 리셋 버튼 */}
        {isExpanded && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={resetLimits}
              className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <RefreshCw className="w-3 h-3" />
              <span>일일 카운터 리셋 (개발용)</span>
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};
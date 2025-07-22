import { Card } from './ui';
import { Code } from 'lucide-react';

export const EnvDebugger = () => {
  const openWeatherKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // 개발 환경에서만 표시
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
      <div className="flex items-start space-x-3">
        <Code className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            환경 변수 디버깅 (개발 모드)
          </h3>
          
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded">
              <span className="text-blue-600 dark:text-blue-300">VITE_OPENWEATHER_API_KEY:</span>
              <br />
              <span className="text-blue-800 dark:text-blue-100">
                {openWeatherKey ? 
                  `${openWeatherKey.substring(0, 8)}...${openWeatherKey.substring(openWeatherKey.length - 4)}` 
                  : '❌ undefined'
                }
              </span>
            </div>
            
            <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded">
              <span className="text-blue-600 dark:text-blue-300">Node 환경:</span>
              <br />
              <span className="text-blue-800 dark:text-blue-100">
                {import.meta.env.NODE_ENV || 'undefined'}
              </span>
            </div>
          </div>

          {!openWeatherKey && (
            <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 rounded text-xs text-red-800 dark:text-red-200">
🚨 OpenWeatherMap API 키가 로드되지 않았습니다. 개발 서버를 재시작해보세요.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
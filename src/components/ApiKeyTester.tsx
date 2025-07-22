import { useState } from 'react';
import { Card, Button } from './ui';
import { TestTube, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const ApiKeyTester = () => {
  const [testResults, setTestResults] = useState<{
    openweather?: { success: boolean; message: string };
  }>({});
  const [testing, setTesting] = useState(false);

  const testOpenWeatherKey = async () => {
    const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!key) {
      return { success: false, message: 'API 키가 설정되지 않음' };
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=37.5665&lon=126.9780&appid=${key}&units=metric`
      );
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, message: `성공: ${data.name} 날씨 데이터 조회됨` };
      } else {
        const error = await response.text();
        return { success: false, message: `실패 (${response.status}): ${error}` };
      }
    } catch (error) {
      return { success: false, message: `네트워크 오류: ${error}` };
    }
  };


  const runTests = async () => {
    setTesting(true);
    setTestResults({});

    try {
      const openweatherResult = await testOpenWeatherKey();

      setTestResults({
        openweather: openweatherResult
      });
    } finally {
      setTesting(false);
    }
  };

  // 개발 환경에서만 표시
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <Card className="mb-4 border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20">
      <div className="flex items-start space-x-3">
        <TestTube className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
              API 키 테스트 (개발 모드)
            </h3>
            <Button
              onClick={runTests}
              disabled={testing}
              size="sm"
              variant="secondary"
              leftIcon={testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
            >
              {testing ? '테스트 중...' : 'API 테스트'}
            </Button>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div className="space-y-2">
              {testResults.openweather && (
                <div className="flex items-start space-x-2 p-2 bg-purple-100 dark:bg-purple-800/30 rounded">
                  {testResults.openweather.success ? (
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-semibold text-purple-800 dark:text-purple-200">
                      OpenWeatherMap
                    </div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">
                      {testResults.openweather.message}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
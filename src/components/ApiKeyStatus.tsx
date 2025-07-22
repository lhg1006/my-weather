import { Card } from './ui';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const ApiKeyStatus = () => {

  const apis = [
    {
      name: 'OpenWeatherMap',
      key: import.meta.env.VITE_OPENWEATHER_API_KEY,
      required: true,
    },
  ];

  const hasAllRequiredKeys = apis
    .filter(api => api.required)
    .every(api => api.key && api.key !== 'undefined');

  if (hasAllRequiredKeys) {
    return null; // 모든 키가 있으면 컴포넌트 숨김
  }

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            API 키 설정 필요
          </h3>
          
          <div className="space-y-2 text-sm">
            {apis.map((api) => (
              <div key={api.name} className="flex items-center justify-between">
                <span className="text-yellow-700 dark:text-yellow-300">
                  {api.name}
                </span>
                <div className="flex items-center space-x-1">
                  {api.key && api.key !== 'undefined' ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 text-xs">설정됨</span>
                    </>
                  ) : api.required ? (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-red-600 text-xs">필수</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-xs">비활성화</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 p-3 bg-yellow-100 dark:bg-yellow-800/30 rounded-md">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <strong>해결 방법:</strong>
            </p>
            <ol className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
              <li>1. 프로젝트 루트에 <code>.env</code> 파일 생성</li>
              <li>2. 무료 API 키들을 다음 형식으로 추가:</li>
              <li className="ml-2 font-mono text-xs bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
                VITE_OPENWEATHER_API_KEY=your_key
              </li>
              <li>3. 개발 서버 재시작</li>
            </ol>
          </div>
        </div>
      </div>
    </Card>
  );
};
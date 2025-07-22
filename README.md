# MyWeather 🌤️

> 개인 포트폴리오 프로젝트 - 현대적인 모바일 우선 날씨 앱

스케줄 관리와 스마트 날씨 알림 기능을 갖춘 iOS 스타일의 날씨 웹 애플리케이션입니다.

## 🎯 프로젝트 개요

**MyWeather**는 단순한 날씨 정보 제공을 넘어 사용자의 일정과 연동하여 맞춤형 날씨 알림을 제공하는 스마트 날씨 앱입니다. iOS의 네이티브 앱과 유사한 사용자 경험을 웹에서 구현했습니다.

### 🌟 핵심 특징

- **스케줄 연동**: 출근/퇴근/활동 시간을 설정하여 맞춤형 날씨 알림
- **스마트 알림**: 스케줄 시간 전 날씨 상황에 따른 자동 알림 (우산, 겉옷 등)
- **iOS 디자인**: Apple HIG를 준수한 네이티브 앱 수준의 UI/UX
- **실시간 카운트다운**: "퇴근까지 3시간 12분 후" 형태의 직관적 표시
- **글래스모피즘**: 현대적인 반투명 디자인 적용

## ✨ 주요 기능

### 🕐 스케줄 관리
- 출근/퇴근/활동 시간 설정
- 실시간 카운트다운 표시
- 각 일정별 개별 알림 설정

### 🌦️ 스마트 날씨 알림
- **비/눈 알림**: 강수량에 따른 우산/우의 준비 알림
- **온도 알림**: 극한 온도 상황 시 겉옷/물 챙기기 알림  
- **바람 알림**: 강풍 시 우의 추천 알림
- **타이밍 설정**: 15/30/60분 전 맞춤 알림

### 📱 사용자 경험
- **위치 기반**: GPS 자동 감지 및 현재 위치 날씨
- **다국어**: 한국어/영어 지원
- **테마**: 라이트/다크/시스템 모드
- **반응형**: 모바일 최적화 및 PWA 지원

## 🛠️ 기술 스택

### Frontend
```
React 18 + TypeScript
Vite (빌드 도구)
Tailwind CSS (스타일링)
Framer Motion (애니메이션)
```

### 상태 관리 & 데이터
```
Zustand (전역 상태)
React Query (서버 상태)
react-i18next (다국어)
react-hot-toast (알림)
```

### API & 서비스
```
OpenWeatherMap API (날씨 데이터)
Geolocation API (위치 서비스)
Service Worker (PWA)
```

## 🎨 디자인 시스템

### iOS 네이티브 스타일
- **색상**: iOS Blue (#007AFF) 기반 컬러 팔레트
- **타이포그래피**: Inter 폰트 시스템
- **컴포넌트**: iOS HIG 준수 버튼, 카드, 스위치
- **애니메이션**: 네이티브 수준의 부드러운 전환

### 글래스모피즘 디자인
```css
background: rgba(255, 255, 255, 0.4);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.3);
```

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일 생성:
```env
VITE_OPENWEATHER_API_KEY=your_api_key
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 빌드
```bash
npm run build
npm run preview
```

## 📱 주요 구현 사항

### 실시간 스케줄 카운트다운
```typescript
const getTimeUntilLeave = () => {
  const currentMinutes = getCurrentMinutes();
  const leaveMinutes = convertToMinutes(schedule.leaveStartTime);
  let timeUntil = leaveMinutes - currentMinutes;
  
  if (timeUntil <= 0) {
    timeUntil = (24 * 60) + timeUntil; // 다음날 계산
  }
  
  const hours = Math.floor(timeUntil / 60);
  const minutes = timeUntil % 60;
  
  return hours > 0 ? `${hours}시간 ${minutes}분 후` : `${minutes}분 후`;
};
```

### 스마트 날씨 알림 시스템
```typescript
export const checkWeatherAlerts = (weather: WeatherData): WeatherAlert[] => {
  const alerts: WeatherAlert[] = [];
  
  // 강수량 체크
  if (weather.precipitation >= 5) {
    alerts.push({
      type: 'rain',
      message: `🌧️ 많은 비가 예상됩니다! 우산과 우의를 준비하세요`,
      severity: 'high'
    });
  }
  
  // 온도 체크
  if (weather.temperature <= 0) {
    alerts.push({
      type: 'cold', 
      message: `🧊 매우 추운 날씨입니다! 따뜻하게 입고 나가세요`,
      severity: 'high'
    });
  }
  
  return alerts;
};
```

### 글래스모피즘 컴포넌트
```typescript
<Card 
  variant="glass"
  style={{
    background: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 16px rgba(31, 38, 135, 0.2)'
  }}
>
```

## 📊 성능 최적화

- **React Query**: 5분 캐싱으로 불필요한 API 호출 최소화
- **Code Splitting**: 컴포넌트별 지연 로딩
- **이미지 최적화**: WebP 지원 및 lazy loading
- **번들 최적화**: Vite를 통한 트리쉐이킹

## 🎯 프로젝트 성과

### 기술적 성과
- **반응형 디자인**: 모든 모바일 기기 대응
- **접근성**: WCAG 2.1 AA 준수
- **성능**: Lighthouse 90+ 점수
- **PWA**: 홈 화면 설치 및 오프라인 지원

### UX/UI 성과  
- **직관적 인터페이스**: 원터치 접근 가능한 모든 기능
- **즉시성**: 실시간 정보 업데이트 (1초 단위 카운트다운)
- **개인화**: 사용자별 맞춤 알림 시스템

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── ui/             # 재사용 UI 컴포넌트 
│   ├── WeatherCard.tsx # 메인 날씨 카드
│   ├── ScheduleCard.tsx# 스케줄 관리 카드
│   ├── ForecastCard.tsx# 예보 정보 카드
│   └── SettingsModal.tsx # 설정 모달
├── hooks/              # 커스텀 훅
│   ├── useWeatherData.ts
│   ├── useGeolocation.ts
│   └── useWeatherNotifications.ts
├── utils/              # 유틸리티 함수
│   ├── schedule.ts     # 스케줄 로직
│   ├── weatherNotifications.ts
│   └── temperature.ts
├── store/              # Zustand 상태 관리
├── services/           # API 서비스
├── locales/            # 다국어 지원
└── types/              # TypeScript 타입
```

## 🔧 개발 도구

```bash
# 타입 체크
npm run type-check

# ESLint
npm run lint

# Prettier
npm run format
```

## 📄 라이선스

MIT License - 개인 포트폴리오 프로젝트

---

**개발자**: lhg1006
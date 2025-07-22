# 날씨 앱 🌤️

여러 날씨 API를 통합하여 정확한 평균 날씨 정보를 제공하는 iOS 스타일의 모바일 최적화 웹 앱입니다.

## ✨ 주요 기능

- **OpenWeatherMap API**: 신뢰할 수 있는 무료 날씨 데이터 제공
- **실시간 위치 기반**: GPS를 통한 현재 위치 자동 감지
- **iOS 스타일 디자인**: Apple Human Interface Guidelines 기반 UI/UX
- **다국어 지원**: 한국어/영어 언어 설정
- **다크/라이트 모드**: 시스템 설정 자동 감지 및 수동 설정
- **PWA 지원**: 모바일 홈 화면 추가 및 오프라인 지원
- **반응형 디자인**: 모든 모바일 기기에 최적화

## 🛠️ 기술 스택

### Frontend
- **React 18** + **TypeScript**
- **Vite** (빌드 도구)
- **Tailwind CSS** (스타일링)
- **Framer Motion** (애니메이션)

### 상태 관리
- **Zustand** (전역 상태 관리)
- **React Query** (서버 상태 관리)

### 다국어 & UI
- **react-i18next** (다국어 지원)
- **react-hot-toast** (알림)
- **Lucide React** (아이콘)
- **Inter 폰트** (iOS 스타일 타이포그래피)

### 날씨 API (무료)
- OpenWeatherMap API

## 🚀 시작하기

### 1. 프로젝트 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 API 키들을 추가하세요:

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

#### 무료 API 키 발급 방법:

1. **OpenWeatherMap**: [openweathermap.org](https://openweathermap.org/api) 에서 무료 계정 생성

### 3. 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📱 PWA 설정

이 앱은 Progressive Web App으로 구현되어 있어 다음 기능들을 지원합니다:

- **오프라인 지원**: 서비스 워커를 통한 캐싱
- **홈 화면 추가**: 모바일에서 앱처럼 설치 가능
- **푸시 알림**: 날씨 알림 (향후 추가 예정)
- **iOS Safari 최적화**: 주소창 숨김, Safe Area 지원

## 🌐 Vercel 배포

### 자동 배포 설정

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에 프로젝트 연결
3. 환경 변수 설정:
   - `VITE_OPENWEATHER_API_KEY`

### 수동 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

## 🎨 디자인 시스템

### iOS 스타일 컴포넌트
- **Card**: 글래스모피즘 효과가 적용된 카드
- **Button**: iOS 스타일 버튼 (Primary, Secondary, Ghost)
- **Input**: iOS 스타일 입력 필드
- **Switch**: iOS 스타일 토글 스위치

### 색상 팔레트
- **Primary**: iOS Blue (#007AFF)
- **Background**: iOS Gray scale
- **Text**: Dynamic color based on theme

### 애니메이션
- **Framer Motion**을 사용한 부드러운 전환
- **iOS 스타일** 버튼 인터랙션 (scale, haptic feedback style)

## 📊 날씨 데이터 처리

### OpenWeatherMap API 데이터
- 신뢰할 수 있는 OpenWeatherMap에서 실시간 날씨 데이터 제공
- 현재 날씨 및 5일 예보 정보
- 무료 티어에서 하루 1000회 호출 지원

### 캐싱 전략
- **React Query**를 통한 서버 상태 캐싱
- 5분간 fresh 상태 유지
- 자동 백그라운드 업데이트

## 🔧 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 타입 체크
npm run type-check

# 린트
npm run lint

# 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── ui/             # 재사용 가능한 UI 컴포넌트
│   ├── WeatherCard.tsx # 날씨 정보 카드
│   ├── ForecastCard.tsx# 예보 카드
│   └── ...
├── hooks/              # 커스텀 React 훅
├── services/           # API 서비스
├── store/              # Zustand 스토어
├── types/              # TypeScript 타입 정의
├── locales/            # 다국어 번역 파일
└── utils/              # 유틸리티 함수
```

## 🤝 기여하기

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🚨 문제 해결

### API 키 관련 오류

**문제**: `apikey=undefined` 또는 `401 Unauthorized` 오류
```
Failed to load resource: 401 (Unauthorized)
```

**해결책**:
1. 프로젝트 루트에 `.env` 파일 생성
2. 다음 내용 추가:
```env
VITE_OPENWEATHER_API_KEY=your_actual_api_key
```
3. 개발 서버 재시작: `npm run dev`

### ~~CORS 정책 오류 (AccuWeather)~~ - 제거됨

AccuWeather API는 무료가 아니고 CORS 문제가 있어서 제거되었습니다.
현재는 OpenWeatherMap 무료 API만 사용합니다.

### 개발 환경 확인

앱 실행 시 API 키 상태가 자동으로 표시됩니다:
- ✅ 녹색: API 키 정상 설정
- ❌ 빨간색: API 키 누락 (설정 필요)
- ⚪ 회색: 비활성화된 API

## 🔮 향후 계획
- [ ] 위젯 형태의 미니 날씨 정보
- [ ] 날씨 알림 시스템
- [ ] 지역별 즐겨찾기
- [ ] 날씨 히스토리 차트
- [ ] 의류 추천 기능
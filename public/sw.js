const CACHE_NAME = 'weather-app-v2';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
];

// 서비스 워커 설치
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache install failed:', error);
      })
  );
});

// 서비스 워커 활성화
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 네트워크 요청 처리
self.addEventListener('fetch', (event) => {
  // API 요청은 캐시하지 않음 (실시간 날씨 데이터)
  if (event.request.url.includes('api.openweathermap.org')) {
    
    // 네트워크 우선, 실패 시 에러
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Network unavailable' }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
          }
        );
      })
    );
    return;
  }

  // 정적 리소스는 캐시 우선
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 있으면 캐시된 버전 반환
        if (response) {
          return response;
        }

        // 캐시에 없으면 네트워크에서 가져오기
        return fetch(event.request).then((response) => {
          // 유효한 응답인지 확인
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 응답 복제 (한 번만 사용 가능하므로)
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              // chrome-extension 스킴 요청은 캐시하지 않음
              if (!event.request.url.startsWith('chrome-extension://')) {
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        });
      })
      .catch(() => {
        // 오프라인 상태에서 HTML 요청 시 기본 페이지 반환
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// 백그라운드 동기화 (선택적)
self.addEventListener('sync', (event) => {
  if (event.tag === 'weather-sync') {
    event.waitUntil(
      // 백그라운드에서 날씨 데이터 동기화
      console.log('Background sync for weather data')
    );
  }
});

// 푸시 알림 처리 (선택적)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '새로운 날씨 정보가 있습니다.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: '확인',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('날씨 앱', options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
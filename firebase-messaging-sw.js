// Import Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Workbox setup
const { precaching, routing, strategies, cacheableResponse, expiration, backgroundSync } = workbox;
const { precacheAndRoute, matchPrecache } = precaching;
const { registerRoute } = routing;
const { StaleWhileRevalidate, CacheFirst, NetworkFirst } = strategies;
const { CacheableResponsePlugin } = cacheableResponse;
const { ExpirationPlugin } = expiration;
const { BackgroundSyncPlugin } = backgroundSync;

const offlineFallbackPage = 'offline.html';

// Precache the app shell and offline page.
precacheAndRoute([
  { url: '/', revision: null },
  { url: '/index.html', revision: null },
  { url: '/index.tsx', revision: null },
  { url: '/manifest.json', revision: null },
  { url: 'https://img.icons8.com/fluency/192/play-button-circled.png', revision: null },
  { url: offlineFallbackPage, revision: null },
]);

// Strategy for navigation requests (HTML pages)
// Network first, falling back to cache, and finally to the offline page.
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      { // Custom plugin to catch fetch errors for navigations
        handlerDidError: async () => {
          // Return the precached offline page
          return await matchPrecache(offlineFallbackPage);
        }
      }
    ],
  })
);

// Strategy for CSS, JS, and other static resources from CDNs and local
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style' || request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }), // Cache opaque responses
    ],
  })
);

// Strategy for images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }), // 30 Days
    ],
  })
);

// Strategy for API calls (TMDB, etc) - Network first, then cache.
registerRoute(
  ({ url }) => url.origin === 'https://api.themoviedb.org' || url.origin === 'https://logodownload.org' || url.origin === 'https://i.ibb.co',
  new NetworkFirst({
    cacheName: 'api-data',
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxAgeSeconds: 24 * 60 * 60 }), // Cache for 1 day
    ],
  })
);


// Background Sync for failed API mutations (POST, PUT, DELETE) to ensure data is eventually saved.
const bgSyncPlugin = new BackgroundSyncPlugin('api-mutation-queue', {
  maxRetentionTime: 24 * 60, // Retry for up to 24 Hours
});

registerRoute(
  ({url, request}) => url.pathname.startsWith('/api/') && ['POST', 'PUT', 'DELETE'].includes(request.method),
  new NetworkFirst({
    plugins: [bgSyncPlugin],
  })
);

// Periodic Sync Handler
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'get-latest-content') {
    event.waitUntil(fetchAndCacheLatestContent());
  }
});

const TMDB_API_KEY = 'e095c08fa4bd9162e1552eeb58fe58be';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchAndCacheLatestContent() {
  console.log('Sincronização Periódica: Buscando conteúdo recente...');
  try {
    const trendingMoviesUrl = `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=pt-BR`;
    const trendingTvUrl = `${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}&language=pt-BR`;

    // The requests will be cached by the 'api-data' NetworkFirst strategy
    await Promise.all([
      fetch(trendingMoviesUrl),
      fetch(trendingTvUrl),
    ]);
    
    console.log('Sincronização Periódica: Conteúdo em alta (filmes e séries) foi atualizado no cache.');
  } catch (error) {
    console.error('Sincronização Periódica falhou:', error);
  }
}

// Standard service worker lifecycle events
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});


// --- Firebase Logic ---

// Import Firebase add-ons
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize Firebase for Push Notifications
const firebaseConfig = {
    apiKey: "AIzaSyAojBY9DyRazf6HCTT0TzVXjVb0rHnNrUw",
    authDomain: "grupo-streaming-brasil-aa209.firebaseapp.com",
    projectId: "grupo-streaming-brasil-aa209",
    storageBucket: "grupo-streaming-brasil-aa209.firebasestorage.app",
    messagingSenderId: "327054711097",
    appId: "1:327054711097:web:e3faaceea1dacc6ac870e8",
    measurementId: "G-2XPES2JXS4"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Push Notification Handlers
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || 'https://img.icons8.com/fluency/192/play-button-circled.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) client = clientList[i];
                }
                return client.focus();
            }
            return clients.openWindow('/');
        })
    );
});

const CACHE_NAME = 'liebesschatz-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/main.css',
  './css/animations.css',
  './css/responsive.css',
  './js/storage.js',
  './js/messages.js',
  './js/chest.js',
  './js/background.js',
  './assets/chest-closed.svg',
  './assets/chest-open.svg',
  './assets/favicon/favicon.svg',
  './assets/favicon/android-chrome-192x192.png',
  './assets/favicon/android-chrome-512x512.png',
  './assets/favicon/apple-touch-icon.png',
  './manifest.json'
];

// Install event - cache all required resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // If response is invalid, just return it
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a one-time use
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(err => {
            // If fetch fails, try to return cache for index.html
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            return err;
          });
      })
  );
});

// Handle navigation preload
self.addEventListener('navigationpreload', event => {
  event.waitUntil(
    self.registration.navigationPreload.enable()
  );
});
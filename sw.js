const CACHE_NAME = 'SearchSites-v1';
const ASSETS_TO_CACHE = [
  '/SearchSites/',
  '/SearchSites/index.html',
  '/SearchSites/styles.css',
  '/SearchSites/script_page_load.js',
  '/SearchSites/login.html',
  '/SearchSites/login.js',
  '/SearchSites/login.css',
  '/SearchSites/images/icon192.png',
  '/SearchSites/images/icon512.png',
  '/SearchSites/script.js',
  '/SearchSites/manifest.json',
  '/SearchSites/Sites.json',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
];

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Serve cached assets when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
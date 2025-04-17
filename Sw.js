const CACHE_NAME = 'quran-memorizer-v3';  // Updated version
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-192x192.png',
  '/icon-512x512.png',  // ← Added missing icon
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())  // ← Force activate new SW
  );
});

self.addEventListener('fetch', (event) => {
  // Network-first strategy
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache new responses
        const clone = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))  // Fallback to cache
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME && caches.delete(key))
    )).then(() => self.clients.claim())  // ← Control all pages
  );
});

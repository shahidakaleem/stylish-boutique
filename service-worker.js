// service-worker.js
const CACHE_NAME = 'stylish-boutique-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400..700&display=swap'
];

// Install event: Cache essential files
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.error('Service Worker: Cache failed', err))
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});

// Fetch event: Serve cached content when offline
self.addEventListener('fetch', (event) {
    console.log('Service Worker: Fetching', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(err => console.error('Service Worker: Fetch failed', err))
    );
});
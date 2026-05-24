const CACHE_NAME = 'todo-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json'
];

// Install the Service Worker and cache files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Serve cached files when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});
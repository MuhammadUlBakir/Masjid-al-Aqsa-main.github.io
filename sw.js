var cacheName = 'hello-pwa';
var filesToCache = [
  '/',
  '/test.html',
  '/css/style.css',
  '/js/main.js',
  '/images/test.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.open(cacheName).then(function(cache) {
      return cache.match(e.request).then(function(response) {
        var fetchPromise = fetch(e.request).then(function(networkResponse) {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});

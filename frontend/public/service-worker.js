self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
});

self.addEventListener('fetch', event => {
  console.log('[ServiceWorker] Fetching:', event.request.url);
  // Tu peux ajouter ici du cache, etc.
});

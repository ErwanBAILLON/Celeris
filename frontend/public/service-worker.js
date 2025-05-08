// Fichier minimal pour un service worker servant de base

const CURRENT_VERSION = '1.0.2'; // Incrémentez cette version lors des mises à jour

self.addEventListener('install', event => {
  console.log(`[SW v${CURRENT_VERSION}] Installing.`);
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log(`[SW v${CURRENT_VERSION}] Activating.`);
});

self.addEventListener('fetch', event => {
  console.log('Fetching:', event.request.url);
  if (event.request.url.includes('/projects')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          const expirationTime = 24 * 60 * 60 * 1000; // 1 jour
          const now = Date.now();
          const cachedTime = response.headers.get('date') ? new Date(response.headers.get('date')).getTime() : now;

          if (now - cachedTime > expirationTime) {
            self.registration.showNotification('Requête expirée', {
              body: 'Une requête pour "projects" a expiré.',
              icon: '/icon.png',
            });
          }
        }
        return response || fetch(event.request);
      })
    );
  }
  if (event.request.url.includes('/reminders')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          const expirationTime = 24 * 60 * 60 * 1000; // 1 jour
          const now = Date.now();
          const cachedTime = response.headers.get('date') ? new Date(response.headers.get('date')).getTime() : now;

          if (now - cachedTime > expirationTime) {
            self.registration.showNotification('Requête expirée', {
              body: 'Une requête pour "reminders" a expiré.',
              icon: '/icon.png',
            });
          }
        }
        return response || fetch(event.request);
      })
    );
  }
  if (event.request.url.includes('/tasks')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          const expirationTime = 24 * 60 * 60 * 1000; // 1 jour
          const now = Date.now();
          const cachedTime = response.headers.get('date') ? new Date(response.headers.get('date')).getTime() : now;

          if (now - cachedTime > expirationTime) {
            self.registration.showNotification('Requête expirée', {
              body: 'Une requête pour "tasks" a expiré.',
              icon: '/icon.png',
            });
          }
        }
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener('sync', event => {
  if (event.tag === 'api-queue') {
    event.waitUntil(
      (async () => {
        console.log('[SW] Syncing API requests...');
        const notificationMessage = 'Les requêtes en attente ont été envoyées avec succès.';
        self.registration.showNotification('Requêtes envoyées', {
          body: notificationMessage,
          icon: '/icon.png',
        });
      })()
    );
  }
});
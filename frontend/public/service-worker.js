// Fichier minimal pour un service worker servant de base
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

precacheAndRoute(self.__WB_MANIFEST);

const bgSyncPlugin = new BackgroundSyncPlugin('api-queue', { maxRetentionTime: 24 * 60 });

// Queue mutating API calls when offline, replay on reconnect
registerRoute(
  ({ url, request }) =>
    url.origin === self.location.origin &&
    ['POST','PUT','DELETE'].includes(request.method) &&
    /^\/(auth\/(register|login|logout)|projects|tasks|reminders)/.test(url.pathname),
  new NetworkOnly({ plugins: [bgSyncPlugin] }),
  ['POST','PUT','DELETE']
);

// --- Runtime caching ---
registerRoute(({ request }) => request.mode === 'navigate',
  new NetworkFirst({ cacheName: 'pages-cache' })
);
registerRoute(({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 })]
  })
);
registerRoute(({ request }) => ['script','style'].includes(request.destination),
  new StaleWhileRevalidate({ cacheName: 'static-resources' })
);
registerRoute(new RegExp('/auth/(register|login|logout)'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 5 * 60 })]
  })
);
registerRoute(new RegExp('^/(auth/(register|login|logout)|projects|tasks|reminders)'),
  new NetworkFirst({
    cacheName: 'api-requests',
    plugins: [
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 24 * 60 * 60 }),
      bgSyncPlugin
    ]
  })
);
// -----------------------

const CURRENT_VERSION = '1.0.2'; // Incrémentez cette version lors des mises à jour

self.addEventListener('install', event => {
  console.log(`[SW v${CURRENT_VERSION}] Installing.`);
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log(`[SW v${CURRENT_VERSION}] Activating.`);
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
        // Prévenir les clients que les requêtes en file ont été envoyées
        const allClients = await self.clients.matchAll({ includeUncontrolled: true });
        allClients.forEach(client => client.postMessage({ type: 'REQUESTS_SENT' }));
      })()
    );
  }
});
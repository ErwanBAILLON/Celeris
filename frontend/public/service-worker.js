const CURRENT_VERSION = '1.0.1'; // Incrémentez cette version lors des mises à jour

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
              icon: '/logo_celeris.studio.png',
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
              icon: '/logo_celeris.studio.png',
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
          icon: '/logo_celeris.studio.png',
        });
      })()
    );
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method === "POST") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(event.request.clone());
          return response;
        } catch (err) {
          console.error(err);
          const clonedRequest = await event.request.clone().text();
          storeRequestOffline(event.request.url, clonedRequest, event.request.method);
          return new Response(
            JSON.stringify({ success: false, message: "Request stored offline" }),
            { headers: { "Content-Type": "application/json" } }
          );
        }
      })()
    );
  } else {
    // GET request handling
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

// Fonction pour ajouter des requêtes dans IndexedDB
function storeRequestOffline(url, body, method) {
  const request = indexedDB.open("offline-requests", 1);
  request.onsuccess = () => {
    const db = request.result;
    const tx = db.transaction("requests", "readwrite");
    const store = tx.objectStore("requests");
    store.add({ url, body, method });
  };
}

// Fichier minimal pour un service worker servant de base

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
});
/* eslint-disable no-restricted-globals */

const CACHE_NAME = "app-cache-v1";
const urlsToCache = ["/", "/index.html", "/static/js/bundle.js"];

self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event: any) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

export default {
  register() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
        navigator.serviceWorker
          .register(swUrl)
          .then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }
  },

  unregister() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error("Service Worker unregistration failed:", error);
        });
    }
  }
};

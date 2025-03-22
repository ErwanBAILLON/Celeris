/* eslint-disable no-restricted-globals */
/// <reference lib="webworker" />

const CACHE_NAME = "app-cache-v1";
const urlsToCache = ["/", "/index.html", "/static/js/bundle.js", "/home"];

// Ensure `self` is treated as `ServiceWorkerGlobalScope`
declare let self: ServiceWorkerGlobalScope;

// Install event: Cache static assets
self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event: Serve from cache & cache API responses
self.addEventListener("fetch", (event: any) => {
  const request = event.request;

  if (request.url.startsWith("https://jsonplaceholder.typicode.com")) {
    // Cache API responses dynamically
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        fetch(request)
          .then((response) => {
            cache.put(request, response.clone()); // Save response in cache
            return response;
          })
          .catch(() => caches.match(request)) // Serve from cache if offline
      )
    );
  } else {
    // Serve static assets from cache
    event.respondWith(
      caches.match(request).then((response) => response || fetch(request))
    );
  }
});

// Activate event: Cleanup old caches
self.addEventListener("activate", (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
});

export default {
  register() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register(`${process.env.PUBLIC_URL}/service-worker.js`)
          .then((registration) =>
            console.log("Service Worker registered with scope:", registration.scope)
          )
          .catch((error) =>
            console.error("Service Worker registration failed:", error)
          );
      });
    }
  },

  unregister() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => registration.unregister())
        .catch((error) =>
          console.error("Service Worker unregistration failed:", error)
        );
    }
  }
};

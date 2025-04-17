module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,svg,json}',
  ],
  swDest: 'build/service-worker.js',
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.destination === 'document',
      handler: 'NetworkFirst',
    },
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
      },
    },
    {
      urlPattern: new RegExp('/auth/(register|login|logout)'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
           maxEntries: 10,
           maxAgeSeconds: 5 * 60,
        },
      },
    },
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-requests',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 24 * 60 * 60, // 1 jour
        },
        backgroundSync: {
          name: 'api-queue',
          options: {
            maxRetentionTime: 24 * 60, // 24 heures
          },
        },
      },
    },
    {
      urlPattern: new RegExp('/(auth|projects|tasks|reminders)/'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-requests',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 24 * 60 * 60, // 1 jour
        },
        backgroundSync: {
          name: 'api-queue',
          options: {
            maxRetentionTime: 24 * 60, // 24 heures
          },
        },
      },
    },
  ],
};
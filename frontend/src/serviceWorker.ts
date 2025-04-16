export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js?version=1.0.1')
        .then(registration => {
          console.log('Service Worker registered: ', registration);
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // Notify the user about the update
                    navigator.serviceWorker.controller.postMessage({ type: 'NEW_VERSION' });
                  }
                }
              };
            }
          };
        })
        .catch(registrationError => {
          console.error('Service Worker registration failed: ', registrationError);
        });
    });
  }
}

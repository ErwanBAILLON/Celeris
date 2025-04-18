export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with Workbox:', registration);
          // Affiche explicitement la propriété "scope"
          console.log('Service Worker scope:', registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  console.log('New version available, notifying client...');
                  // Envoi du message avec l'opérateur optionnel pour éviter les erreurs
                  navigator.serviceWorker.controller?.postMessage({
                    type: 'NEW_VERSION_AVAILABLE',
                  });
                  alert('Une nouvelle version est disponible. Rechargez la page pour l\'appliquer.');
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'NEW_VERSION_AVAILABLE') {
        // Utilisation d'une boîte de dialogue personnalisée
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#333';
        notification.style.color = '#fff';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
        notification.innerText = 'Une nouvelle version est disponible. Rechargez la page pour appliquer les changements.';

        const reloadButton = document.createElement('button');
        reloadButton.innerText = 'Recharger';
        reloadButton.style.marginLeft = '10px';
        reloadButton.style.backgroundColor = '#007bff';
        reloadButton.style.color = '#fff';
        reloadButton.style.border = 'none';
        reloadButton.style.padding = '5px 10px';
        reloadButton.style.borderRadius = '3px';
        reloadButton.style.cursor = 'pointer';

        reloadButton.addEventListener('click', () => {
          window.location.reload();
        });

        notification.appendChild(reloadButton);
        document.body.appendChild(notification);

        setTimeout(() => {
          notification.remove();
        }, 10000); // Supprime la notification après 10 secondes
      }
    });
  }
}
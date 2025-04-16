import { useEffect } from 'react';

const NotificationPermission = () => {
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message received from Service Worker:', event.data);
        if (event.data && event.data.type === 'NEW_VERSION_AVAILABLE') {
          if (Notification.permission === 'granted') {
            new Notification('Nouvelle version disponible', {
              body: 'Rechargez la page pour appliquer les changements.',
              icon: '/icon.png', // Remplacez par le chemin de votre icône
            });
          } else {
            alert('Une nouvelle version est disponible. Rechargez la page pour appliquer les changements.');
          }
        }
      });
    }
  }, []);

  return null;
};

export default NotificationPermission;
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
              icon: '/icon.png',
            });
          } else {
            alert('Une nouvelle version est disponible. Rechargez la page pour appliquer les changements.');
          }
        }

        if (event.data && event.data.type === 'REQUEST_EXPIRED') {
          const route = event.data.route || 'inconnue';
          if (Notification.permission === 'granted') {
            new Notification('Requête expirée', {
              body: `Une requête pour "${route}" a expiré.`,
              icon: '/icon.png',
            });
          } else {
            alert(`Une requête pour "${route}" a expiré.`);
          }
        }

        if (event.data && event.data.type === 'REQUESTS_SENT') {
          const route = event.data.route || 'inconnue';
          if (Notification.permission === 'granted') {
            new Notification('Requêtes envoyées', {
              body: `Les requêtes pour "${route}" ont été envoyées avec succès.`,
              icon: '/icon.png',
            });
          } else {
            alert(`Les requêtes pour "${route}" ont été envoyées avec succès.`);
          }
        }

        if (event.data && event.data.type === 'REQUEST_EXPIRED' && event.data.route === '/reminders') {
          if (Notification.permission === 'granted') {
            new Notification('Requête expirée', {
              body: 'Une requête pour "/reminders" a expiré.',
              icon: '/icon.png',
            });
          } else {
            alert('Une requête pour "/reminders" a expiré.');
          }
        }

        if (event.data && event.data.type === 'REQUESTS_SENT' && event.data.route === '/reminders') {
          if (Notification.permission === 'granted') {
            new Notification('Requêtes envoyées', {
              body: 'Les requêtes pour "/reminders" ont été envoyées avec succès.',
              icon: '/icon.png',
            });
          } else {
            alert('Les requêtes pour "/reminders" ont été envoyées avec succès.');
          }
        }
      });
    }
  }, []);

  return null;
};

export default NotificationPermission;
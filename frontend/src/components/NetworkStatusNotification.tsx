import { useEffect } from 'react';

const NetworkStatusNotification = () => {
  useEffect(() => {
    const notify = (status: 'en ligne' | 'hors ligne') => {
      const title = status === 'en ligne' ? 'Connexion rétablie' : 'Vous êtes hors ligne';
      const body = status === 'en ligne' ? 'La connexion internet est de nouveau active.' : 'La connexion internet est perdue.';
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/icon.png',
        });
      } else {
        alert(`Statut réseau: ${status}`);
      }
    };

    const handleOnline = () => notify('en ligne');
    const handleOffline = () => notify('hors ligne');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
};

export default NetworkStatusNotification;

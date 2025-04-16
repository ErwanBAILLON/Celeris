import { useEffect } from 'react';

const NotificationPermission = () => {
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  return null;
};

export default NotificationPermission;
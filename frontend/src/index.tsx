import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './Router';
import { register } from "./serviceWorker";
import NotificationPermission from './components/NotificationPermission';
import NetworkStatusNotification from './components/NetworkStatusNotification';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <NotificationPermission />
    <NetworkStatusNotification />
    <AppRouter />
  </React.StrictMode>
);

register();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'NEW_VERSION_AVAILABLE') {
      alert('Une nouvelle version du site est disponible. Rechargez la page pour voir les changements.');
    }
  });
}

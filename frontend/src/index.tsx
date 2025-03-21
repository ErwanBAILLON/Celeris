import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './Router';
import serviceWorker from "./serviceWorker";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

serviceWorker.register();

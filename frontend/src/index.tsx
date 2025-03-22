import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { store, persistor } from './store/store';
import AppRouter from './Router';
import serviceWorker from "./serviceWorker";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRouter />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

serviceWorker.register();

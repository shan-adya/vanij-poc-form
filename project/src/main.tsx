import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ServiceProvider } from './contexts/ServiceContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ServiceProvider>
        <App />
      </ServiceProvider>
  </React.StrictMode>
);

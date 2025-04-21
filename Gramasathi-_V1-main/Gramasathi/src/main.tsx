import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import './i18n/i18n';
import { VoiceProvider } from './hooks/VoiceContext';
import { AuthProvider } from './hooks/AuthContext';



// Provide API URL as a global variable
window.API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <VoiceProvider>
          <App />
        </VoiceProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import {LanguageProvider} from './i18n/LanguageContext';
import './index.css';

if ('serviceWorker' in navigator) {
  registerSW({immediate: true});
}

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);

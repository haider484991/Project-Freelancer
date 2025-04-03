import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import heTranslation from './locales/he.json';
import arTranslation from './locales/ar.json';

// This is necessary to avoid i18next trying to access window/document in SSR
const isBrowser = typeof window !== 'undefined';

const resources = {
  en: {
    translation: enTranslation
  },
  he: {
    translation: heTranslation
  },
  ar: {
    translation: arTranslation
  }
};

// Only initialize i18n if it hasn't been initialized yet
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'he', // Default language
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false // React already escapes by default
      },
      react: {
        useSuspense: false
      },
      // Disable features that are not compatible with SSR
      detection: {
        order: ['path', 'cookie', 'navigator'],
      },
      // Don't initialize if we're on the server
      initImmediate: isBrowser,
    });
}

export default i18n;
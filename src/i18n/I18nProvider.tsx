'use client';

import React, { useEffect } from 'react';
import i18n from './index';
import { I18nextProvider } from 'react-i18next';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if we're running in the browser before accessing localStorage
    if (typeof window !== 'undefined') {
      try {
        // Always use Hebrew language
        const langToUse = 'he';
        i18n.changeLanguage(langToUse);
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = langToUse;
      } catch (error) {
        console.error('Error initializing i18n:', error);
      }
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 
'use client';

import React, { useEffect } from 'react';
import i18n from './index';
import { I18nextProvider } from 'react-i18next';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize any client-side specific i18n settings
    const savedLang = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(savedLang);
    document.documentElement.dir = savedLang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 
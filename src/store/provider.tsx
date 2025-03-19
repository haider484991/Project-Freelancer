'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import React from 'react';
import { I18nProvider } from '../i18n/I18nProvider';
import { AppProvider } from '@/context/AppContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <I18nProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </I18nProvider>
    </Provider>
  );
}
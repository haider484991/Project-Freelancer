'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Set direction for RTL/LTR languages
    document.documentElement.dir = lng === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    // Save language preference
    localStorage.setItem('language', lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`p-2 rounded ${
          currentLanguage === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('he')}
        className={`p-2 rounded ${
          currentLanguage === 'he'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
        aria-label="Switch to Hebrew"
      >
        HE
      </button>
    </div>
  );
};

export default LanguageSwitcher; 
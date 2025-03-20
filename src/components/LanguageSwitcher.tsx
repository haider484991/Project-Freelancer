'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  
  // Initialize current language
  useEffect(() => {
    setCurrentLanguage(i18n.language || 'en');
  }, [i18n.language]);

  // Define RTL languages
  const rtlLanguages = ['he', 'ar'];
  
  const changeLanguage = (lng: string) => {
    try {
      i18n.changeLanguage(lng);
      setCurrentLanguage(lng);
      
      // Set direction for RTL/LTR languages
      const isRtlLanguage = rtlLanguages.includes(lng);
      document.documentElement.dir = isRtlLanguage ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;
      
      // Save language preference - only if in browser
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lng);
        
        // Force reload to apply RTL/LTR layout changes properly
        window.location.reload();
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Apply RTL/LTR direction on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem('language') || 'en';
        const isRtlLanguage = rtlLanguages.includes(savedLang);
        document.documentElement.dir = isRtlLanguage ? 'rtl' : 'ltr';
      } catch (error) {
        console.error('Error setting document direction:', error);
      }
    }
  }, []);

  return (
    <div className="flex items-center gap-2 bg-[#E7F0E6] px-3 py-2 rounded-md">
      <span className="text-sm text-[#2B180A] font-medium">{t('common.language')}:</span>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 ${
          currentLanguage === 'en' 
            ? 'bg-[#3DD559] text-white' 
            : 'text-[#2B180A]'
        } rounded text-xs font-medium transition-colors`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('he')}
        className={`px-2 py-1 ${
          currentLanguage === 'he' 
            ? 'bg-[#3DD559] text-white' 
            : 'text-[#2B180A]'
        } rounded text-xs font-medium transition-colors`}
        aria-label="Switch to Hebrew"
      >
        HE
      </button>
      <button
        onClick={() => changeLanguage('ar')}
        className={`px-2 py-1 ${
          currentLanguage === 'ar' 
            ? 'bg-[#3DD559] text-white' 
            : 'text-[#2B180A]'
        } rounded text-xs font-medium transition-colors`}
        aria-label="Switch to Arabic"
      >
        AR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
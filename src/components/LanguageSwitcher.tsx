'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  isMobile?: boolean;
}

// Define RTL languages outside the component to make it constant
const RTL_LANGUAGES = ['he', 'ar'];

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isMobile = false }) => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  
  // Initialize current language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
          setCurrentLanguage(savedLang);
          i18n.changeLanguage(savedLang);
        }
      } catch (error) {
        console.error('Error retrieving language:', error);
      }
    }
  }, [i18n]);

  const changeLanguage = (lng: string) => {
    try {
      i18n.changeLanguage(lng);
      setCurrentLanguage(lng);
      
      // Set direction for RTL/LTR languages
      const isRtlLanguage = RTL_LANGUAGES.includes(lng);
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
        const isRtlLanguage = RTL_LANGUAGES.includes(savedLang);
        document.documentElement.dir = isRtlLanguage ? 'rtl' : 'ltr';
      } catch (error) {
        console.error('Error setting document direction:', error);
      }
    }
  }, []);

  // Adjust style based on isMobile prop
  const containerClass = isMobile 
    ? "flex items-center gap-1 bg-[#E7F0E6] px-2 py-1 rounded-md" 
    : "flex items-center gap-2 bg-[#E7F0E6] px-3 py-2 rounded-md";

  const buttonBaseClass = isMobile 
    ? "px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors" 
    : "px-2 py-1 rounded text-xs font-medium transition-colors";

  return (
    <div className={containerClass}>
      {!isMobile && <span className="text-sm text-[#2B180A] font-medium">{t('common.language')}:</span>}
      <button
        onClick={() => changeLanguage('en')}
        className={`${buttonBaseClass} ${
          currentLanguage === 'en' 
            ? 'bg-[#3DD559] text-white' 
            : 'text-[#2B180A]'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('he')}
        className={`${buttonBaseClass} ${
          currentLanguage === 'he' 
            ? 'bg-[#3DD559] text-white' 
            : 'text-[#2B180A]'
        }`}
        aria-label="Switch to Hebrew"
      >
        HE
      </button>
      <button
        onClick={() => changeLanguage('ar')}
        className={`${buttonBaseClass} ${
          currentLanguage === 'ar' 
            ? 'bg-[#3DD559] text-white' 
            : 'text-[#2B180A]'
        }`}
        aria-label="Switch to Arabic"
      >
        AR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
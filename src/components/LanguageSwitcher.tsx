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
  const [currentLanguage, setCurrentLanguage] = useState<string>('he');
  
  // Initialize current language - force Hebrew
  useEffect(() => {
    try {
      // Always set language to Hebrew
      setCurrentLanguage('he');
      i18n.changeLanguage('he');
      
      // Set RTL direction
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'he';
      
      // Save preference if in browser
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', 'he');
      }
    } catch (error) {
      console.error('Error setting language:', error);
    }
  }, [i18n]);

  // Language picker is hidden as per requirement
  // Will be made available in the future
  return null;
};

export default LanguageSwitcher;
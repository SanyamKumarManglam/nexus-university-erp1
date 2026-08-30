import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, languageNames } from '../translations';
import { storageService } from '../services/storageService';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem(storageService.KEYS.LANGUAGE) || 'en';
  });

  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLang(langCode);
      localStorage.setItem(storageService.KEYS.LANGUAGE, langCode);
    }
  };

  const t = (key, fallback) => {
    if (key === null || key === undefined) return '';
    const langDict = translations[currentLang] || translations.en || {};
    const enDict = translations.en || {};

    if (langDict[key] !== undefined) return langDict[key];
    if (currentLang === 'en' && enDict[key] !== undefined) return enDict[key];

    // Check trimmed key
    const strKey = String(key).trim();
    if (langDict[strKey] !== undefined) return langDict[strKey];
    if (enDict[strKey] !== undefined) return currentLang === 'en' ? enDict[strKey] : (langDict[strKey] || fallback || strKey);

    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        changeLanguage,
        t,
        languageNames,
        availableLanguages: Object.keys(translations)
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

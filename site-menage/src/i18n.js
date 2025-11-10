import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationService from './services/translationService';

// Import translation files directly
import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';
import ar from './locales/ar/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar }
    },
    fallbackLng: 'fr',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    
    // إعدادات الترجمة التلقائية
    saveMissing: true,
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      console.warn(`Missing translation key: ${key} for language: ${lng}`);
      // يمكن إضافة منطق لإرسال المفاتيح المفقودة للخادم
    },
  });

// Function to change language and update document direction
i18n.on('languageChanged', (lng) => {
  // تحديث اللغة في خدمة الترجمة
  translationService.setLanguage(lng);
  
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', lng);
    if (lng === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.classList.add('rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.classList.remove('rtl');
    }
  }
});

// Set initial direction on load (only if document is available)
if (typeof document !== 'undefined') {
  const initialLng = localStorage.getItem('i18nextLng') || 'fr';
  translationService.setLanguage(initialLng);
  
  if (initialLng === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.classList.add('rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.body.classList.remove('rtl');
  }
}

export default i18n;

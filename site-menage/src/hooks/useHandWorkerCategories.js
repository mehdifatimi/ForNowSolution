import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translateHandWorkerCategories } from '../services/handWorkerTranslation';

export const useHandWorkerCategories = () => {
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/hand-worker-categories`);
      const data = await response.json();
      
      if (data.success) {
        const currentLanguage = i18n.language || 'fr';
        const translatedCategories = translateHandWorkerCategories(data.data, currentLanguage);
        setCategories(translatedCategories);
      } else {
        setError('Erreur lors du chargement des catégories');
      }
    } catch (e) {
      console.error('Error loading categories:', e);
      setError('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  // Recharger les catégories quand la langue change
  useEffect(() => {
    if (categories.length > 0) {
      const currentLanguage = i18n.language || 'fr';
      const translatedCategories = translateHandWorkerCategories(categories, currentLanguage);
      setCategories(translatedCategories);
    }
  }, [i18n.language]);

  return {
    categories,
    loading,
    error,
    loadCategories,
    setCategories
  };
};

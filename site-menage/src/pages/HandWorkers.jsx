import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import i18n from '../i18n';
import { supabase } from '../lib/supabase';
import './HandWorkers.css';

export default function HandWorkers() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [handWorkers, setHandWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  // Persist language and set direction when language changes
  useEffect(() => {
    const lang = (i18n.language || localStorage.getItem('currentLang') || 'fr').split(/[-_]/)[0].toLowerCase();
    try { localStorage.setItem('currentLang', lang); } catch {}
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
  }, [i18n.language]);

  const getCurrentLang = () => (localStorage.getItem('currentLang') || i18n.language || 'fr').split(/[-_]/)[0].toLowerCase();

  // Helper: localized value with per-lang fallback and language-specific default text
  const getLocalizedValue = (item, field) => {
    const lang = getCurrentLang();
    const value = (item && (item[`${field}_${lang}`] || item[`${field}_fr`] || item[`${field}`])) || '';
    if (value) return value;
    if (lang === 'ar') return 'غير متوفر';
    if (lang === 'en') return 'Not available';
    return 'Non disponible';
  };

  // Helper function to get image URL from Supabase Storage
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a Supabase URL, return it
    if (imagePath.includes('supabase.co/storage')) {
      return imagePath;
    }
    
    // If it's an old Laravel path, extract filename and try to get from Supabase
    if (imagePath.includes('127.0.0.1:8000') || imagePath.includes('localhost:8000') || imagePath.startsWith('/storage/') || imagePath.startsWith('/images/') || imagePath.startsWith('/uploads/')) {
      const filename = imagePath.split('/').pop();
      if (filename) {
        console.log('[HandWorkers] Converting Laravel path to Supabase:', imagePath, '-> filename:', filename);
        const { data: { publicUrl } } = supabase.storage
          .from('employees')
          .getPublicUrl(filename);
        console.log('[HandWorkers] Generated Supabase URL:', publicUrl);
        return publicUrl;
      }
      return null;
    }
    
    // If it's just a filename, try to get from Supabase Storage
    if (!imagePath.includes('/') && !imagePath.includes('http')) {
      const { data: { publicUrl } } = supabase.storage
        .from('employees')
        .getPublicUrl(imagePath);
      return publicUrl;
    }
    
    // Return as-is if it's a valid URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    return null;
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('[HandWorkers] Loading categories from Supabase');
      
      const { data, error } = await supabase
        .from('hand_worker_categories')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true });
      
      if (error) {
        console.error('[HandWorkers] Error loading categories:', error);
        setError(t('hand_workers.loading_error') + ': ' + error.message);
        return;
      }
      
      console.log('[HandWorkers] Loaded categories:', data?.length || 0);
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('[HandWorkers] Exception loading categories:', e);
      setError(t('hand_workers.loading_error') + ': ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadHandWorkers = async (categoryId) => {
    try {
      console.log('[HandWorkers] Loading hand workers for category:', categoryId);
      
      const { data, error } = await supabase
        .from('hand_workers')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_available', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[HandWorkers] Error loading hand workers:', error);
        return;
      }
      
      console.log('[HandWorkers] Loaded hand workers:', data?.length || 0);
      setHandWorkers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('[HandWorkers] Exception loading hand workers:', e);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Workers are hidden when category is selected, so we don't load them
    setHandWorkers([]);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setHandWorkers([]);
  };

  if (loading) return <div className="loading-state">{t('hand_workers.loading')}</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <main className="hand-workers-page">
              <div className="hand-workers-header">
                <div className="hand-workers-title-section">
                  <h1 className="hand-workers-title" data-aos="fade-up" data-aos-delay="100">
                    {t('hand_workers.title')}
                  </h1>
                  <p className="hand-workers-subtitle" data-aos="fade-up" data-aos-delay="200">
                    {t('hand_workers.subtitle')}
                  </p>
                  <div className="hand-workers-actions" data-aos="fade-up" data-aos-delay="300">
                    <Link 
                      to="/hand-workers/register"
                      className="register-button"
                    >
                      <i className="fas fa-user-plus"></i>
                      {t('hand_workers.register_as_worker')}
                    </Link>
                  </div>
                </div>
              </div>

      <div className="hand-workers-content">
        {!selectedCategory ? (
          <div className="categories-section">
            <h2 className="section-title" data-aos="fade-up" data-aos-delay="300">
              {t('hand_workers.choose_category')}
            </h2>
            <div className="categories-grid">
              {categories.map((category, index) => {
                const localized = {
                  ...category,
                  name: getLocalizedValue(category, 'name'),
                  description: getLocalizedValue(category, 'description'),
                  imageUrl: category.image ? getImageUrl(category.image) : null
                };
                return (
                  <CategoryCard
                    key={category.id}
                    category={localized}
                    onClick={handleCategorySelect}
                    index={index}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div className="category-details-section">
            <div className="category-header">
              <button 
                className="back-button" 
                onClick={handleBackToCategories}
                data-aos="fade-up" 
                data-aos-delay="100"
              >
                ← {t('hand_workers.back_to_categories')}
              </button>
              <h2 className="category-details-title" data-aos="fade-up" data-aos-delay="200">
                {getLocalizedValue(selectedCategory, 'name')}
              </h2>
            </div>

            <div className="category-info" data-aos="fade-up" data-aos-delay="300">
              <div className="category-info-card">
                <div className="category-info-header">
                  {(() => {
                    const imagePath = selectedCategory.image;
                    const imageUrl = imagePath ? getImageUrl(imagePath) : null;
                    return imageUrl ? (
                      <div className="category-info-image">
                        <img
                          src={imageUrl}
                          alt={getLocalizedValue(selectedCategory, 'name')}
                          className="category-detail-image"
                          onError={(e) => {
                            console.log('[HandWorkers] Detail image failed to load:', imageUrl);
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="category-info-icon" style={{display: 'none'}}>
                          {selectedCategory.icon ? (
                            <i className={selectedCategory.icon}></i>
                          ) : (
                            <i className="fas fa-tools"></i>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="category-info-icon">
                        {selectedCategory.icon ? (
                          <i className={selectedCategory.icon}></i>
                        ) : (
                          <i className="fas fa-tools"></i>
                        )}
                      </div>
                    );
                  })()}
                  <div className="category-info-details">
                    <h3>{getLocalizedValue(selectedCategory, 'name')}</h3>
                    <p>{getLocalizedValue(selectedCategory, 'description')}</p>
                  </div>
                </div>
                <div className="category-info-pricing">
                  <div className="pricing-item">
                    <span className="pricing-label">{t('hand_workers.price_per_hour')}</span>
                    <span className="pricing-value">{selectedCategory.price_per_hour} DH</span>
                  </div>
                  <div className="pricing-item">
                    <span className="pricing-label">{t('hand_workers.minimum_hours')}</span>
                    <span className="pricing-value">{selectedCategory.minimum_hours}h</span>
                  </div>
                </div>
              </div>
            </div>


            <div className="reservation-section" data-aos="fade-up" data-aos-delay="600">
              <div className="reservation-card">
                <h3>{t('hand_workers.book_service')}</h3>
                <p>{t('hand_workers.book_service_description')}</p>
                <Link 
                  to={`/hand-workers/booking?category=${selectedCategory.id}`}
                  className="booking-button"
                >
                  {t('hand_workers.book_now')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

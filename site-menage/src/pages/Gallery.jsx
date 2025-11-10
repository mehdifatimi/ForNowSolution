import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getGalleryImages, getGalleryCategories, getGalleryTypes } from '../api-supabase';
import './Gallery.css';

export default function Gallery() {
  const { t, i18n } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGalleryData();
  }, [i18n.language]);

  const loadGalleryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const locale = i18n.language || 'fr';

      // Load types
      const typesResponse = await getGalleryTypes(locale);
      const typesData = typesResponse.success ? typesResponse.data : [];
      setTypes(typesData);

      // Load categories (filtered by active type if selected)
      const categoriesResponse = await getGalleryCategories(locale, activeType?.id);
      const categoriesData = categoriesResponse.success ? categoriesResponse.data : [];
      
      // Add "All" option at the beginning
      const allCategoryOption = { id: null, name: t('gallery.categories.all'), slug: 'all' };
      setCategories([allCategoryOption, ...categoriesData]);

      // Load images (filtered by active category or type)
      const imagesResponse = await getGalleryImages(
        locale,
        activeCategory?.id || null,
        activeType?.id || null
      );
      const imagesData = imagesResponse.success ? imagesResponse.data : [];
      setGalleryImages(imagesData);

      setLoading(false);
    } catch (err) {
      console.error('Error loading gallery data:', err);
      setError(err.message || t('gallery.error_loading', 'Error loading gallery'));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeType || activeCategory) {
      loadGalleryData();
    }
  }, [activeType, activeCategory, i18n.language]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category.id === null ? null : category);
  };

  const handleTypeChange = (type) => {
    setActiveType(type.id === activeType?.id ? null : type);
    setActiveCategory(null); // Reset category when type changes
  };

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading && galleryImages.length === 0) {
    return (
      <div className="gallery-page">
        <div className="gallery-container">
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p>{t('gallery.loading', 'Loading...')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-page">
        <div className="gallery-container">
          <div style={{ textAlign: 'center', padding: '4rem', color: 'red' }}>
            <p>{error}</p>
            <button onClick={loadGalleryData} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
              {t('gallery.retry', 'Retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-container">
        <header className="gallery-header">
          <h1 className="gallery-title" data-aos="fade-up" data-aos-delay="100">
            {t('gallery.title')}
          </h1>
          <p className="gallery-description" data-aos="fade-up" data-aos-delay="200">
            {t('gallery.description')}
          </p>
        </header>

        {/* Type Filters */}
        {types.length > 0 && (
          <div className="gallery-type-filters" data-aos="fade-up" data-aos-delay="300">
            {types.map((type, index) => (
              <button
                key={type.id}
                className={`filter-button type-filter ${activeType?.id === type.id ? 'active' : ''}`}
                onClick={() => handleTypeChange(type)}
                data-aos="zoom-in"
                data-aos-delay={`${400 + index * 50}`}
              >
                {type.name}
              </button>
            ))}
          </div>
        )}

        {/* Category Filters */}
        {categories.length > 1 && (
        <div className="gallery-filters" data-aos="fade-up" data-aos-delay="300">
          {categories.map((category, index) => (
            <button
                key={category.id || 'all'}
                className={`filter-button ${activeCategory?.id === category.id || (!activeCategory && category.id === null) ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              data-aos="zoom-in"
              data-aos-delay={`${400 + index * 50}`}
            >
                {category.name}
            </button>
          ))}
        </div>
        )}

        <div className="gallery-grid">
          {galleryImages.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <p>{t('gallery.no_images', 'No images found')}</p>
            </div>
          ) : (
            galleryImages.map((image, index) => (
            <div 
              key={image.id} 
              className="gallery-item" 
              onClick={() => openModal(image)}
              data-aos="fade-up"
              data-aos-delay={`${500 + index * 100}`}
            >
              <img 
                  src={image.image_url || image.image_path}
                  alt={image.alt || image.title}
                className="gallery-image"
                loading="lazy"
                  onError={(e) => {
                    console.error('Image load error:', image.image_url);
                    e.target.src = '/placeholder-image.jpg';
                  }}
              />
              <div className="gallery-overlay">
                <h3 className="gallery-item-title">{image.title}</h3>
                  {image.category && (
                    <span className="gallery-category">{image.category.name}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {selectedImage && (
          <div className="gallery-modal" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <img 
                src={selectedImage.image_url || selectedImage.image_path}
                alt={selectedImage.alt || selectedImage.title}
                className="modal-image"
                onError={(e) => {
                  console.error('Modal image load error:', selectedImage.image_url);
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
              <div className="modal-info">
                {selectedImage.category && (
                  <>
                    <h3 className="modal-title">{selectedImage.category.name}</h3>
                    <span className="modal-category">{selectedImage.category.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

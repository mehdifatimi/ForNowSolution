import React from 'react';
import { useTranslation } from 'react-i18next';
import './Home.css';

export default function Temoignages() {
  const { t } = useTranslation();
  
  return (
    <main style={{padding:'40px 16px'}}>
      <h1 style={{textAlign:'center', marginBottom:20}}>{t('testimonials.title')}</h1>
      <div className="home-testimonials-grid">
        <figure className="home-testimonial-card">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" alt={t('testimonials.testimonial1.alt')} />
          <blockquote>{t('testimonials.testimonial1.text')}</blockquote>
          <figcaption>— {t('testimonials.testimonial1.author')}</figcaption>
        </figure>
        <figure className="home-testimonial-card">
          <img src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400&auto=format&fit=crop" alt={t('testimonials.testimonial2.alt')} />
          <blockquote>{t('testimonials.testimonial2.text')}</blockquote>
          <figcaption>— {t('testimonials.testimonial2.author')}</figcaption>
        </figure>
        <figure className="home-testimonial-card">
          <img src="https://images.unsplash.com/photo-1544005316-04ce1f3b7a1f?q=80&w=400&auto=format&fit=crop" alt={t('testimonials.testimonial3.alt')} />
          <blockquote>{t('testimonials.testimonial3.text')}</blockquote>
          <figcaption>— {t('testimonials.testimonial3.author')}</figcaption>
        </figure>
      </div>
    </main>
  );
}


import React, { useState, useEffect } from 'react';
import { getRatings, getAllRatings, submitRating } from '../api-supabase';
import './UserRating.css';

export default function UserRating() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total_ratings: 0,
    average_rating: 0,
    recent_comments: []
  });
  const [allRatings, setAllRatings] = useState([]);
  // Show all by default (can collapse with Masquer)
  const [showAllComments, setShowAllComments] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getRatings();
      if (response.success) {
        setStats(response.data);
      }
    } catch (e) {
      console.error('Error loading rating stats:', e);
    }
  };

  const loadAll = async () => {
    try {
      const response = await getAllRatings();
      // accept either {success,data:{ratings:[]}} or array
      const list = Array.isArray(response?.data) ? response.data : (response?.data?.ratings || response?.ratings || []);
      setAllRatings(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error('Error loading all ratings:', e);
    }
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
    setError('');
  };

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await submitRating({
        rating: rating,
        comment: comment.trim() || null
      });

      if (response.success) {
        setSubmitted(true);
        setStats(response.data.stats);
        setRating(0);
        setComment('');
        
        // Reset submitted state after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        setError(response.message || 'Erreur lors de l\'envoi');
      }
    } catch (e) {
      console.error('Error submitting rating:', e);
      setError(e.message || 'Erreur lors de l\'envoi de votre évaluation');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => {
      const isActive = star <= (hoveredRating || rating);
      return (
        <button
          key={star}
          type="button"
          className={`star ${isActive ? 'active' : ''}`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          onMouseLeave={handleStarLeave}
          disabled={submitted}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={isActive ? '#fbbf24' : 'none'}
              stroke={isActive ? '#f59e0b' : '#d1d5db'}
              strokeWidth="2"
            />
          </svg>
        </button>
      );
    });
  };

  const renderRecentComments = () => {
    if (!stats.recent_comments || stats.recent_comments.length === 0) {
      return null;
    }
    const sorted = [...stats.recent_comments].sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return db - da; // newest first
    });

    return (
      <div className="recent-comments">
        <div className="recent-header">
          <h4>Derniers avis</h4>
          <button
            type="button"
            className="outline-toggle"
            onClick={() => {
              setShowAllComments((v) => {
                const next = !v;
                if (next && allRatings.length === 0) {
                  loadAll();
                }
                return next;
              });
            }}
            style={{
              marginLeft: 'auto'
            }}
          >
            {showAllComments ? 'Masquer' : 'Voir tous les avis'}
          </button>
        </div>
        {showAllComments && (
          <div className="comments-grid">
            {(allRatings.length ? allRatings : sorted).sort((a,b)=> new Date(b.created_at)-new Date(a.created_at)).map((comment, index) => (
              <div key={index} className="comment-card">
                <div className="comment-rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`comment-star ${i < comment.rating ? 'filled' : ''}`}>★</span>
                  ))}
                </div>
                <div className="comment-text-area">
                  <p>"{comment.comment}"</p>
                </div>
                <small className="comment-date">{new Date(comment.created_at).toLocaleDateString('fr-FR')}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="user-rating-section">
      <div className="rating-container">
        <div className="rating-header">
          <h2 className="rating-title">Évaluez notre site 🌟</h2>
          <p className="rating-subtitle">
            Votre avis nous aide à améliorer nos services
          </p>
        </div>

        <div className="rating-stats">
          <div className="stats-item">
            <div className="stats-value">{stats.average_rating.toFixed(1)}</div>
            <div className="stats-label">Note moyenne</div>
          </div>
          <div className="stats-item">
            <div className="stats-value">{stats.total_ratings}</div>
            <div className="stats-label">Évaluations</div>
          </div>
        </div>

        {submitted ? (
          <div className="rating-success">
            <div className="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Merci pour votre évaluation !</h3>
            <p>Votre avis a été enregistré avec succès.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rating-form">
            <div className="stars-container">
              <div className="stars-wrapper">
                {renderStars()}
              </div>
              <div className="rating-text">
                {rating > 0 && (
                  <span className="selected-rating">
                    {rating} étoile{rating > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            <div className="comment-section">
              <label htmlFor="comment" className="comment-label">
                Votre avis (optionnel)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience avec nous..."
                className="comment-textarea"
                rows="4"
                maxLength="500"
              />
              <div className="comment-counter">
                {comment.length}/500 caractères
              </div>
            </div>

            {error && (
              <div className="rating-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="submit-rating-button"
              disabled={loading || rating === 0}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Envoi en cours...
                </>
              ) : (
                'Envoyer mon évaluation'
              )}
            </button>
          </form>
        )}

        {renderRecentComments()}
      </div>
    </section>
  );
}

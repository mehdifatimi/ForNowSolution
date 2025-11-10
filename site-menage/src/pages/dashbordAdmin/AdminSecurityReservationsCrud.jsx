import React, { useEffect, useState } from 'react';
import './AdminSecurityReservationsCrud.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

export default function AdminSecurityReservationsCrud({ token, onAuthError }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadReservations();
  }, [token]);

  const loadReservations = async () => {
    try {
      setError('');
      setLoading(true);
      console.log('🔑 Admin token:', token ? 'Present' : 'Missing');
      
      const res = await fetch(`${API_BASE_URL}/api/admin/security-reservations`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Response status:', res.status);
      console.log('📡 Response headers:', res.headers);

      if (res.status === 401) {
        onAuthError?.();
        return;
      }

      if (res.ok) {
        const data = await res.json();
        console.log('📊 Data received:', data);
        setReservations(Array.isArray(data) ? data : []);
      } else {
        const errorText = await res.text();
        console.error('❌ Error response:', errorText);
        setError('Erreur lors du chargement des réservations');
      }
    } catch (e) {
      console.error('❌ Network error:', e);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesType = filterType === 'all' || reservation.type_reservation === filterType;
    const matchesSearch = searchTerm === '' || 
      reservation.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.security_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
  };

  const getTypeLabel = (type) => {
    return type === 'jour' ? 'Journée' : 'Heure';
  };

  const getTypeIcon = (type) => {
    return type === 'jour' ? '📅' : '⏰';
  };

  return (
    <div className="admin-security-reservations">
      <div className="admin-header">
        <h2>Gestion des Réservations Sécurité</h2>
        <div className="admin-actions">
          <button onClick={loadReservations} className="refresh-btn">
            🔄 Actualiser
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="filters-section">
        <div className="filter-group">
          <label>Type de réservation:</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes</option>
            <option value="jour">Journée</option>
            <option value="heure">Heure</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Rechercher:</label>
          <input
            type="text"
            placeholder="Nom utilisateur, agent ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Chargement des réservations...</div>
      ) : (
        <div className="reservations-grid">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-header">
                  <div className="reservation-type">
                    <span className="type-icon">{getTypeIcon(reservation.type_reservation)}</span>
                    <span className="type-label">{getTypeLabel(reservation.type_reservation)}</span>
                  </div>
                  <div className="reservation-price">
                    {parseFloat(reservation.prix_total || 0).toFixed(2)} DH
                  </div>
                </div>

                <div className="reservation-details">
                  <div className="detail-row">
                    <span className="detail-label">👤 Client:</span>
                    <span className="detail-value">{reservation.user_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📧 Email:</span>
                    <span className="detail-value">{reservation.user_email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🛡️ Agent:</span>
                    <span className="detail-value">{reservation.security_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🎭 Rôle:</span>
                    <span className="detail-value">{reservation.security_role}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📅 Date:</span>
                    <span className="detail-value">{formatDate(reservation.date_reservation)}</span>
                  </div>
                  {reservation.type_reservation === 'heure' && (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">🕐 Début:</span>
                        <span className="detail-value">{formatTime(reservation.heure_debut)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">🕕 Fin:</span>
                        <span className="detail-value">{formatTime(reservation.heure_fin)}</span>
                      </div>
                    </>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">📝 Créé le:</span>
                    <span className="detail-value">{formatDate(reservation.created_at)}</span>
                  </div>
                </div>

                <div className="reservation-status">
                  <span className="status-badge active">Confirmée</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-reservations">
              <div className="no-reservations-icon">📋</div>
              <h3>Aucune réservation trouvée</h3>
              <p>Il n'y a pas de réservations correspondant à vos critères.</p>
            </div>
          )}
        </div>
      )}

      <div className="reservations-summary">
        <div className="summary-card">
          <h4>📊 Résumé</h4>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total réservations:</span>
              <span className="stat-value">{reservations.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">À la journée:</span>
              <span className="stat-value">{reservations.filter(r => r.type_reservation === 'jour').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">À l'heure:</span>
              <span className="stat-value">{reservations.filter(r => r.type_reservation === 'heure').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Revenus totaux:</span>
              <span className="stat-value">{reservations.reduce((sum, r) => sum + parseFloat(r.prix_total || 0), 0).toFixed(2)} DH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import './AdminSecurityEmployees.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export default function AdminSecurityEmployeesValid({ token, onAuthError }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getToken = () => token || localStorage.getItem('adminToken');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const authToken = getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/security-employees-valid`, {
        headers: { 'Authorization': `Bearer ${authToken}`, 'Accept': 'application/json' }
      });
      if (res.status === 401) { onAuthError && onAuthError(); throw new Error('Non autorisé'); }
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data.message || 'Load failed');
      setItems(data.data || []);
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Supprimer cette validation ?')) return;
    try {
      const authToken = getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/security-employees-valid/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}`, 'Accept': 'application/json' }
      });
      if (res.status === 401) { onAuthError && onAuthError(); return; }
      if (res.ok) setItems(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      console.error('Delete error', e);
    }
  };

  return (
    <main className="admin-page security-employees-page">
      <div className="security-employees-header">
        <h1>Employés Sécurité Validés</h1>
        <div className="security-employees-actions">
          <button className="security-employees-refresh-btn" onClick={load}>🔄 Rafraîchir</button>
        </div>
      </div>
      {error && (
        <div className="security-employees-alert error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
      {loading ? (
        <div className="security-employees-loading">Chargement…</div>
      ) : (
        <div className="security-employees-table-wrapper">
          <table className="security-employees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Ville</th>
                <th>Expertise</th>
                <th>Actif</th>
                <th>Validé le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(row => (
                <tr key={row.id}>
                  <td>#{row.id}</td>
                  <td>{`${row.first_name || ''} ${row.last_name || ''}`.trim() || '-'}</td>
                  <td>
                    <a href={`mailto:${row.email}`} className="security-employees-email">{row.email || '-'}</a>
                  </td>
                  <td>{row.phone || '-'}</td>
                  <td>{row.location || '-'}</td>
                  <td>{row.expertise || '-'}</td>
                  <td>{row.is_active ? '✓' : '✗'}</td>
                  <td>{row.validated_at ? new Date(row.validated_at).toLocaleString() : '-'}</td>
                  <td>
                    <button className="security-employees-delete-btn" onClick={()=>remove(row.id)}>🗑️ Supprimer</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={9} className="security-employees-empty">Aucun enregistrement</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}



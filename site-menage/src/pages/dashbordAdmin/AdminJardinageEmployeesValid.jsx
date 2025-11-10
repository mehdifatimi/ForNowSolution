import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export default function AdminJardinageEmployeesValid({ token, onAuthError }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getToken = () => token || localStorage.getItem('adminToken');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE_URL}/api/admin/jardinage-employees-valid`, {
        headers: { 'Authorization': `Bearer ${getToken()}`, 'Accept':'application/json' }
      });
      if (res.status === 401) { onAuthError && onAuthError(); return; }
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data.message || 'Load failed');
      setItems(data.data || []);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Supprimer cet enregistrement validé ?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/jardinage-employees-valid/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.status === 401) { onAuthError && onAuthError(); return; }
      if (res.ok) setItems(prev => prev.filter(i => i.id !== id));
    } catch {}
  };

  return (
    <main className="admin-page jardinage-employees-page">
      <div className="jardinage-employees-header">
        <h1>Employés Jardinage Validés</h1>
        <div className="jardinage-employees-actions">
          <button className="jardinage-employees-refresh-btn" onClick={load}>🔄 Rafraîchir</button>
        </div>
      </div>

      {error && <div className="jardinage-employees-alert error">{error}</div>}
      {loading ? (
        <div className="jardinage-employees-loading">Chargement…</div>
      ) : (
        <div className="jardinage-employees-table-wrapper">
          <table className="jardinage-employees-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Expertise</th>
                <th>Ville</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.id}>
                  <td>#{it.id}</td>
                  <td>{`${it.first_name || ''} ${it.last_name || ''}`.trim() || '-'}</td>
                  <td>{it.email || '-'}</td>
                  <td>{it.phone || '-'}</td>
                  <td>{it.expertise || '-'}</td>
                  <td>{it.location || '-'}</td>
                  <td>
                    <button className="jardinage-employees-delete-btn" onClick={()=>remove(it.id)}>🗑️ Supprimer</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={7} className="jardinage-employees-empty">Aucun élément</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}



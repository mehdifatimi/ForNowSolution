import React, { useEffect, useMemo, useState } from 'react';
import './AdminJardinageEmployees.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export default function AdminJardinageEmployees({ token, onAuthError }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const getToken = () => token || localStorage.getItem('adminToken');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const authToken = getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/jardinage-employees`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json'
        }
      });
      
      if (res.status === 401) {
        if (onAuthError) onAuthError();
        throw new Error('Non autorisé');
      }
      
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data.message || 'Load failed');
      setItems(data.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    if (filter === 'active') return items.filter(i => i.is_active);
    if (filter === 'inactive') return items.filter(i => !i.is_active);
    return items;
  }, [items, filter]);

  const toggleActive = async (id, next) => {
    try {
      const authToken = getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/jardinage-employees/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ is_active: !!next })
      });
      
      if (res.status === 401) {
        if (onAuthError) onAuthError();
        return;
      }
      
      if (res.ok) {
        setItems(prev => prev.map(i => i.id === id ? { ...i, is_active: !!next } : i));
      }
    } catch (e) {
      console.error('Error toggling active:', e);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Supprimer cet employé ?')) return;
    try {
      const authToken = getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/jardinage-employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json'
        }
      });
      
      if (res.status === 401) {
        if (onAuthError) onAuthError();
        return;
      }
      
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== id));
      }
    } catch (e) {
      console.error('Error removing employee:', e);
    }
  };

  const validateEmployee = async (id) => {
    try {
      const authToken = getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/jardinage-employees-valid`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ employee_id: id })
      });
      if (res.status === 401) {
        if (onAuthError) onAuthError();
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(()=>({message:'Erreur'}));
        alert(err.message || 'Validation échouée');
        return;
      }
      // Remove from current list after successful validation
      setItems(prev => prev.filter(i => i.id !== id));
      alert('Employé validé ✅');
    } catch (e) {
      console.error('Validate error', e);
    }
  };

  return (
    <main className="admin-page jardinage-employees-page">
      <div className="jardinage-employees-header">
        <h1>Employés Jardinage</h1>
        <div className="jardinage-employees-actions">
          <select 
            className="jardinage-employees-filter"
            value={filter} 
            onChange={e=>setFilter(e.target.value)}
          >
            <option value="all">Tous</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
          <button 
            className="jardinage-employees-refresh-btn"
            onClick={load}
          >
            🔄 Rafraîchir
          </button>
        </div>
      </div>

      {error && (
        <div className="jardinage-employees-alert error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
      {loading ? (
        <div className="jardinage-employees-loading">Chargement…</div>
      ) : (
        <div className="jardinage-employees-table-wrapper">
          <table className="jardinage-employees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Expertise</th>
                <th>Ville</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id}>
                  <td>#{emp.id}</td>
                  <td>
                    <span className="jardinage-employees-name">
                      {`${emp.first_name || ''} ${emp.last_name || ''}`.trim() || '-'}
                    </span>
                  </td>
                  <td>
                    <a 
                      href={`mailto:${emp.email}`} 
                      className="jardinage-employees-email"
                    >
                      {emp.email || '-'}
                    </a>
                  </td>
                  <td>{emp.phone || '-'}</td>
                  <td>
                    {emp.expertise ? (
                      <span className="jardinage-employees-expertise">
                        {emp.expertise}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <span className="jardinage-employees-location">
                      {emp.location || '-'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        className="jardinage-employees-checkbox"
                        checked={!!emp.is_active} 
                        onChange={e=>toggleActive(emp.id, e.target.checked)} 
                      />
                      <span className={`jardinage-employees-status ${emp.is_active ? 'active' : 'inactive'}`}>
                        {emp.is_active ? '✓ Actif' : '✗ Inactif'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{display:'flex', gap:8}}>
                      <button 
                        className="jardinage-employees-delete-btn"
                        onClick={()=>remove(emp.id)}
                      >
                        🗑️ Supprimer
                      </button>
                      <button 
                        className="jardinage-employees-refresh-btn"
                        onClick={()=>validateEmployee(emp.id)}
                      >
                        ✅ Valider
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="jardinage-employees-empty">
                    Aucun employé trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}



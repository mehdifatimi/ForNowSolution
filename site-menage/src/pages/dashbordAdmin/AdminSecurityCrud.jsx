import React, { useEffect, useState } from 'react';
import './AdminCrud.css';
import './AdminSecurityCrud.css';
import LanguageFields from '../../components/LanguageFields';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

export default function AdminSecurityCrud({ token, onAuthError }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', name_ar:'', name_fr:'', name_en:'', role_id:'', experience_years:0, description:'', description_ar:'', description_fr:'', description_en:'', is_active:true, photo:null });
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true); setError('');
      const res = await fetch(`${API_BASE_URL}/api/admin/securities`, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
      if (res.status === 401) { onAuthError?.(); return; }
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.data?.data || data.data || []);
      setItems(list);
    } catch (e) {
      setError('Impossible de charger la sécurité');
    } finally { setLoading(false); }
  };

  const loadRoles = async () => {
    try {
      setRolesLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/security-roles`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRoles(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Erreur lors du chargement des rôles:', e);
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
    loadRoles();
  }, []);

  const openCreate = () => { setEditing(null); setForm({ name:'', name_ar:'', name_fr:'', name_en:'', role_id:'', experience_years:0, description:'', description_ar:'', description_fr:'', description_en:'', is_active:true, photo:null }); setShowForm(true); };
  const openEdit = (item) => { 
    console.log('Édition de l\'item:', item);
    setEditing(item); 
    setForm({ 
      name: item.name || '', 
      name_ar: item.name_ar || '',
      name_fr: item.name_fr || '',
      name_en: item.name_en || '',
      role_id: item.role_id || '', 
      experience_years: item.experience_years || 0, 
      description: item.description || '', 
      description_ar: item.description_ar || '',
      description_fr: item.description_fr || '',
      description_en: item.description_en || '',
      is_active: !!item.is_active, 
      photo: null 
    }); 
    console.log('Formulaire pré-rempli:', { 
      name: item.name || '', 
      role_id: item.role_id || '', 
      experience_years: item.experience_years || 0, 
      description: item.description || '', 
      is_active: !!item.is_active 
    });
    setShowForm(true); 
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      if (form.role_id) fd.append('role_id', form.role_id);
      if (form.name_ar) fd.append('name_ar', form.name_ar);
      if (form.name_fr) fd.append('name_fr', form.name_fr);
      if (form.name_en) fd.append('name_en', form.name_en);
      fd.append('experience_years', String(form.experience_years||0));
      if (form.description) fd.append('description', form.description);
      if (form.description_ar) fd.append('description_ar', form.description_ar);
      if (form.description_fr) fd.append('description_fr', form.description_fr);
      if (form.description_en) fd.append('description_en', form.description_en);
      fd.append('is_active', form.is_active ? '1':'0');
      if (form.photo instanceof File) fd.append('photo', form.photo);
      
      const url = editing ? `${API_BASE_URL}/api/admin/securities/${editing.id}` : `${API_BASE_URL}/api/admin/securities`;
      const method = 'POST'; // Toujours POST pour FormData
      const headers = { 'Authorization': `Bearer ${token}`, 'Accept':'application/json' };
      
      // Pour l'édition, ajouter _method=PUT
      if (editing) {
        fd.append('_method', 'PUT');
      }
      
      console.log(`${method} ${url}`, { editing: !!editing, formData: Object.fromEntries(fd) });
      
      const res = await fetch(url, { method, headers, body: fd });
      console.log('Réponse reçue:', res.status, res.statusText);
      
      if (res.status === 401) { onAuthError?.(); return; }
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erreur de réponse:', errorText);
        throw new Error(`Échec de sauvegarde: ${res.status} - ${errorText}`);
      }
      
      const responseData = await res.json();
      console.log('Données de réponse:', responseData);
      
      setShowForm(false); 
      setEditing(null); 
      setForm({ name:'', role_id:'', experience_years:0, description:'', is_active:true, photo:null });
      await load();
    } catch (e2) { 
      console.error('Erreur de sauvegarde:', e2);
      setError(e2.message); 
    }
  };

  const removeItem = async (item) => {
    if (!window.confirm('Supprimer cet agent ?')) return;
    const res = await fetch(`${API_BASE_URL}/api/admin/securities/${item.id}`, { method:'DELETE', headers:{ 'Authorization': `Bearer ${token}` } });
    if (res.status === 401) { onAuthError?.(); return; }
    await load();
  };

  return (
    <section className="admin-card">
      <div className="admin-toolbar">
        <h2>Sécurité</h2>
        <div style={{display:'flex',gap:8}}>
          <button className="admin-crud-add-button" onClick={load} disabled={loading}>{loading? 'Chargement…' : 'Actualiser'}</button>
          <button className="admin-crud-add-button" onClick={openCreate}>+ Nouveau</button>
        </div>
      </div>

      {error && (<div className="admin-crud-error">{error}</div>)}

      <div style={{overflow:'auto'}}>
        <table className="security-admin-table">
          <thead className="admin-thead">
            <tr>
              <th className="admin-th">#</th>
              <th className="admin-th">Photo</th>
              <th className="admin-th">Nom</th>
              <th className="admin-th">Rôle</th>
              <th className="admin-th">Expérience</th>
              <th className="admin-th">Actif</th>
              <th className="admin-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id}>
                <td className="admin-td">{it.id}</td>
                <td className="admin-td">{it.photo ? <img src={`${API_BASE_URL}${it.photo.startsWith('/')?it.photo:`/storage/${it.photo.replace(/^public\//,'')}`}`} alt={it.name} className="security-agent-photo" width={40} height={40}/> : <div className="security-agent-photo placeholder">👤</div>}</td>
                <td className="admin-td">{it.name}</td>
                <td className="admin-td">{it.role?.name||'-'}</td>
                <td className="admin-td"><span className="security-experience">{it.experience_years||0} ans</span></td>
                <td className="admin-td"><span className={`security-status-badge ${it.is_active ? 'active' : 'inactive'}`}>{it.is_active? 'Actif':'Inactif'}</span></td>
                <td className="admin-td">
                  <div className="security-actions">
                    <button className="security-edit-btn" onClick={()=>openEdit(it)}>Éditer</button>
                    <button className="security-delete-btn" onClick={()=>removeItem(it)}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="security-form-overlay">
          <div className="security-form">
            <div className="security-form-header">
              <h3>{editing? `Modifier l'agent: ${editing.name}` : 'Nouvel agent'}</h3>
              <button className="security-modal-close" onClick={()=>{setShowForm(false); setEditing(null);}}>×</button>
            </div>
            <form onSubmit={save} className="security-form-grid">
              <div className="security-form-group">
                <label>Nom</label>
                <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} required/>
              </div>

              <div className="security-form-group" style={{gridColumn:'1 / -1'}}>
                <LanguageFields
                  value={{
                    name_ar: form.name_ar,
                    name_fr: form.name_fr,
                    name_en: form.name_en,
                    description_ar: form.description_ar,
                    description_fr: form.description_fr,
                    description_en: form.description_en,
                  }}
                  onChange={(v)=>setForm({...form, ...v})}
                  includeDescription={true}
                  required={false}
                />
              </div>
              <div className="security-form-group">
                <label>Rôle</label>
                <select 
                  value={form.role_id} 
                  onChange={(e)=>setForm({...form, role_id:e.target.value})}
                  disabled={rolesLoading}
                >
                  <option value="">
                    {rolesLoading ? 'Chargement des rôles...' : 'Sélectionner un rôle'}
                  </option>
                  {roles && roles.length > 0 ? (
                    roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))
                  ) : !rolesLoading && (
                    <option disabled>Aucun rôle disponible</option>
                  )}
                </select>
                {roles && roles.length > 0 && (
                  <small style={{color: '#6b7280', fontSize: '12px'}}>
                    {roles.length} rôle(s) disponible(s)
                  </small>
                )}
                {rolesLoading && (
                  <small style={{color: '#3b82f6', fontSize: '12px'}}>
                    Chargement en cours...
                  </small>
                )}
              </div>
              <div className="security-form-group">
                <label>Années d'expérience</label>
                <input type="number" min="0" max="80" value={form.experience_years} onChange={(e)=>setForm({...form, experience_years:Number(e.target.value)})}/>
              </div>
              <div className="security-form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})}/>
              </div>
              <div className="security-form-group">
                <label>Statut</label>
                <select value={form.is_active? '1':'0'} onChange={(e)=>setForm({...form, is_active:e.target.value==='1'})}>
                  <option value="1">Actif</option>
                  <option value="0">Inactif</option>
                </select>
              </div>
              <div className="security-form-group">
                <label>Photo</label>
                <input type="file" accept="image/*" onChange={(e)=>setForm({...form, photo:e.target.files?.[0]||null})}/>
              </div>
              <div className="security-form-actions">
                <button type="button" className="security-cancel-btn" onClick={()=>{setShowForm(false); setEditing(null);}}>Annuler</button>
                <button type="submit" className="security-save-btn">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}



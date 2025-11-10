import React, { useState, useEffect } from 'react';
import LanguageFields from '../../components/LanguageFields';
import { getServicesAdmin, createServiceAdmin, updateServiceAdmin, deleteServiceAdmin } from '../../api-supabase';
import './AdminServicesCrud.css';

export default function AdminServicesCrud({ token }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [formData, setFormData] = useState({ 
    icon: '', 
    title: '', 
    description: '', 
    name_ar: '',
    name_fr: '',
    name_en: '',
    description_ar: '',
    description_fr: '',
    description_en: '',
    slug: '',
    is_active: true,
    sort_order: 0,
    order: 0
  });

  // Liste d'icônes disponibles avec des icônes de ménage spécifiques
  const availableIcons = [
    '🏠', '🏢', '🪟', '👕', '🧽', '🧴', '✨', '🌟', '💎', '🎯',
    '🚿', '🛁', '🚽', '🧼', '🧻', '🧹', '🧺', '🗑️', '🧽', '🧴',
    '🏆', '⭐', '💫', '🔥', '💧', '🌊', '☀️', '🌙', '🌈', '🌸',
    '🌺', '🌻', '🌷', '🌹', '🌿', '🍃', '🌱', '🌳', '🌲', '🌴',
    '🏡', '🏘️', '🏙️', '🏗️', '🏭', '🏬', '🏪', '🏫', '🏩', '🏨',
    '🚗', '🚙', '🚐', '🚚', '🚛', '🚜', '🚲', '🛴', '🛵', '🏍️',
    '💼', '📁', '📂', '📋', '📊', '📈', '📉', '📌', '📍', '📎',
    '🔧', '🔨', '⚒️', '🛠️', '⚙️', '🔩', '⚡', '🔌', '💡', '🕯️',
    '🎨', '🖌️', '🖍️', '✏️', '✒️', '🖊️', '🖋️', '📝', '📄', '📃',
    '🎭', '🎪', '🎨', '🎬', '🎤', '🎧', '🎵', '🎶', '🎸', '🎹',
    '🧺', '🧽', '🧴', '🧼', '🧻', '🧹', '🗑️', '🚿', '🛁', '🚽',
    '🏠', '🏢', '🪟', '👕', '✨', '🌟', '💎', '🎯', '🏆', '⭐'
  ];

  useEffect(() => {
    loadServices();
  }, [token]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getServicesAdmin(token);
      setServices(Array.isArray(data) ? data : data.data || []);
    } catch (e) {
      setError('Impossible de charger les services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateServiceAdmin(token, editingService.id, formData);
      } else {
        await createServiceAdmin(token, formData);
      }
      setShowForm(false);
      setEditingService(null);
      setFormData({ icon: '', title: '', description: '', name_ar:'', name_fr:'', name_en:'', description_ar:'', description_fr:'', description_en:'', slug:'', is_active: true, sort_order: 0, order: 0 });
      loadServices();
    } catch (e) {
      setError(e.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      icon: service.icon || '',
      title: service.title || '',
      description: service.description || '',
      name_ar: service.name_ar || '',
      name_fr: service.name_fr || '',
      name_en: service.name_en || '',
      description_ar: service.description_ar || '',
      description_fr: service.description_fr || '',
      description_en: service.description_en || '',
      slug: service.slug || '',
      is_active: service.is_active !== false,
      sort_order: service.sort_order || 0,
      order: service.order || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      return;
    }
    try {
      await deleteServiceAdmin(token, id);
      loadServices();
    } catch (e) {
      setError(e.message || 'Erreur lors de la suppression');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
    setShowIconPicker(false);
    setIconSearch('');
    setFormData({ icon: '', title: '', description: '', name_ar:'', name_fr:'', name_en:'', description_ar:'', description_fr:'', description_en:'', slug:'', is_active: true, sort_order: 0, order: 0 });
  };

  const handleIconSelect = (icon) => {
    setFormData({...formData, icon});
    setShowIconPicker(false);
    setIconSearch('');
  };

  const filteredIcons = availableIcons.filter(icon => 
    iconSearch === '' || icon.includes(iconSearch)
  );

  const toggleActive = async (service) => {
    try {
      await updateServiceAdmin(token, service.id, { ...service, is_active: !service.is_active });
      loadServices();
    } catch (e) {
      setError(e.message || 'Erreur lors de la modification');
    }
  };

  if (loading) return <div className="admin-services-loading">Chargement des services...</div>;
  if (error) return <div className="admin-services-error">{error}</div>;

  return (
    <div className="admin-services-crud">
      <div className="admin-services-header">
        <h2 className="admin-services-title">Gestion des Services</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="admin-services-add-button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Nouveau Service
        </button>
      </div>

      {showForm && (
        <div className="admin-services-form-overlay">
          <div className="admin-services-form">
            <h3>{editingService ? 'Modifier' : 'Créer'} un Service</h3>
            <form onSubmit={handleSubmit}>
              <div className="admin-services-field">
                <label htmlFor="icon">Icône *</label>
                <div className="admin-services-icon-input-container">
                  <div className="admin-services-icon-display">
                    <span className="admin-services-selected-icon" title={formData.icon || 'Aucune icône sélectionnée'}>
                      {formData.icon || '🎯'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowIconPicker(!showIconPicker)}
                      className="admin-services-icon-picker-button"
                    >
                      {formData.icon ? 'Changer' : 'Choisir'} l'icône
                    </button>
                  </div>
                  
                  {showIconPicker && (
                    <div className="admin-services-icon-picker">
                      <div className="admin-services-icon-search">
                        <input
                          type="text"
                          placeholder="Rechercher une icône..."
                          value={iconSearch}
                          onChange={(e) => setIconSearch(e.target.value)}
                          className="admin-services-icon-search-input"
                        />
                      </div>
                      <div className="admin-services-icon-grid">
                        {filteredIcons.map((icon, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleIconSelect(icon)}
                            className={`admin-services-icon-option ${formData.icon === icon ? 'selected' : ''}`}
                            title={`Icône: ${icon}`}
                            aria-label={`Sélectionner l'icône ${icon}`}
                          >
                            <span className="icon-emoji">{icon}</span>
                          </button>
                        ))}
                      </div>
                      <div className="admin-services-icon-picker-footer">
                        <button
                          type="button"
                          onClick={() => setShowIconPicker(false)}
                          className="admin-services-icon-picker-close"
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <LanguageFields
                value={{
                  name_ar: formData.name_ar,
                  name_fr: formData.name_fr,
                  name_en: formData.name_en,
                  description_ar: formData.description_ar,
                  description_fr: formData.description_fr,
                  description_en: formData.description_en,
                }}
                onChange={(v) => setFormData({
                  ...formData,
                  ...v
                })}
                includeDescription={true}
                required={false}
              />

              <div className="admin-services-field">
                <label htmlFor="title">Titre (fallback)</label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Nom du service (fallback)"
                />
              </div>

              <div className="admin-services-field">
                <label htmlFor="description">Description (fallback)</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  placeholder="Description du service (fallback)"
                />
              </div>
              
              <div className="admin-services-field">
                <label htmlFor="sort_order">Ordre d'affichage</label>
                <input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>

              <div className="admin-services-field">
                <label htmlFor="order">Ordre secondaire</label>
                <input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>
              
              <div className="admin-services-field">
                <label className="admin-services-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  />
                  Service actif
                </label>
              </div>
              
              <div className="admin-services-form-actions">
                <button type="submit" className="admin-services-save-button">
                  {editingService ? 'Modifier' : 'Créer'}
                </button>
                <button type="button" onClick={handleCancel} className="admin-services-cancel-button">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-services-grid">
        {services.map((service) => (
          <div key={service.id} className={`admin-services-card ${!service.is_active ? 'inactive' : ''}`}>
            <div className="admin-services-card-header">
              <span className="admin-services-icon" title={service.icon}>
                {service.icon || '🏠'}
              </span>
              <div className="admin-services-actions">
                <button 
                  onClick={() => toggleActive(service)}
                  className={`admin-services-toggle ${service.is_active ? 'active' : 'inactive'}`}
                  title={service.is_active ? 'Désactiver' : 'Activer'}
                >
                  {service.is_active ? '✓' : '✗'}
                </button>
                <button 
                  onClick={() => handleEdit(service)}
                  className="admin-services-edit-button"
                >
                  Modifier
                </button>
                <button 
                  onClick={() => handleDelete(service.id)}
                  className="admin-services-delete-button"
                >
                  Supprimer
                </button>
              </div>
            </div>
            <h4 className="admin-services-card-title">{service.title}</h4>
            <p className="admin-services-card-description">{service.description}</p>
            <div className="admin-services-card-meta">
              <span className="admin-services-order">Ordre: {service.sort_order}</span>
              <span className={`admin-services-status ${service.is_active ? 'active' : 'inactive'}`}>
                {service.is_active ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

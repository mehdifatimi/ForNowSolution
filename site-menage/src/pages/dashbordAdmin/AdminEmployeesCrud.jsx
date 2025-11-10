import React, { useEffect, useState } from 'react';
import './AdminCrud.css';
import './AdminEmployeesCrud.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

// Helper function to get correct employee photo URL
const getEmployeePhotoUrl = (employee) => {
  if (!employee.photo) {
    return null;
  }
  
  const rawP = String(employee.photo || '');
  const p = rawP.replace(/^"|"$/g,'').trim();
  
  // If it's already an absolute URL
  if (/^https?:\/\//i.test(p)) {
    return p;
  }
  
  // If it's a path with initial slash
  if (p.startsWith('/')) {
    return `${API_BASE_URL}${p}`;
  }
  
  // If it's a storage path
  if (p.includes('storage/') || p.includes('public/')) {
    const cleanPath = p.replace(/^public\//,'').replace(/^\/?storage\//,'');
    return `${API_BASE_URL}/storage/${cleanPath}`;
  }
  
  // Try different possible paths
  const possibleUrls = [
    `${API_BASE_URL}/storage/${p}`,
    `${API_BASE_URL}/storage/app/public/${p}`,
    `${API_BASE_URL}/public/storage/${p}`,
    `${API_BASE_URL}/${p}`,
    `${API_BASE_URL}/images/${p}`,
    `${API_BASE_URL}/uploads/${p}`
  ];
  
  return possibleUrls[0];
};

export default function AdminEmployeesCrud({ token, onAuthError }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [competencies, setCompetencies] = useState({}); // id -> name
  const [updatingId, setUpdatingId] = useState(null);
  const [flash, setFlash] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeePage, setShowEmployeePage] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE_URL}/api/admin/employees`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.status === 401) { onAuthError?.(); return; }
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.data?.data || data.data || []);
      setItems(list);
    } catch (e) {
      setError("Impossible de charger les employés");
    } finally {
      setLoading(false);
    }
  };

  const loadCompetencies = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/competencies`, { headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.data || []);
      const map = {};
      list.forEach(c => { if (c?.id) map[c.id] = c.name || `#${c.id}`; });
      setCompetencies(map);
    } catch {}
  };

  useEffect(() => { load(); loadCompetencies(); }, []);

  const updateStatus = async (employeeId, status) => {
    try {
      setUpdatingId(employeeId);
      const res = await fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}/status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.status === 401) { onAuthError?.(); return; }
      if (!res.ok) throw new Error('Échec mise à jour du statut');
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const validateEmployee = async (employeeId) => {
    try {
      setUpdatingId(employeeId);
      const res = await fetch(`${API_BASE_URL}/api/admin/validate-employee/${employeeId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.status === 401) { onAuthError?.(); return; }
      if (!res.ok) throw new Error("Échec de la validation");
      await load();
      setFlash('Employé validé avec succès');
      setTimeout(() => setFlash(''), 3000);
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const showEmployeeDetailsPage = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeePage(true);
  };

  const closeEmployeeDetailsPage = () => {
    setSelectedEmployee(null);
    setShowEmployeePage(false);
  };

  return (
    <section className="admin-card">
      <div className="admin-toolbar">
        <h2>Gestion des Employés</h2>
        <button className="admin-crud-add-button" onClick={load} disabled={loading}>{loading ? 'Chargement…' : 'Actualiser'}</button>
      </div>

      {!!flash && (<div className="admin-crud-success">{flash}</div>)}
      {error && (<div className="admin-crud-error">{error}</div>)}

      <div style={{overflow:'auto'}}>
        <table className="admin-table">
          <thead className="admin-thead">
            <tr>
              <th className="admin-th">#</th>
              <th className="admin-th">Photo</th>
              <th className="admin-th">Nom</th>
              <th className="admin-th">Prénom</th>
              <th className="admin-th">Âge</th>
              <th className="admin-th">Email</th>
              <th className="admin-th">Téléphone</th>
              <th className="admin-th">Adresse</th>
              <th className="admin-th">Compétence</th>
              <th className="admin-th">Disponibilités</th>
              <th className="admin-th">Statut</th>
              <th className="admin-th">Créé</th>
              <th className="admin-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e) => (
              <tr key={e.id}>
                <td className="admin-td">{e.id}</td>
                <td className="admin-td">
                  {(() => {
                    const photoUrl = getEmployeePhotoUrl(e);
                    return photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={e.name || 'photo'}
                        className="employee-avatar"
                        width={80}
                        height={80}
                        style={{objectFit:'cover',borderRadius:999}}
                        onError={(ev) => {
                          ev.currentTarget.style.display = 'none';
                          ev.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null;
                  })()}
                  <div className="employee-avatar placeholder" style={{display: 'flex'}} aria-label="Sans photo">👤</div>
                </td>
                <td className="admin-td">{e.name}</td>
                <td className="admin-td">{e.prenom}</td>
                <td className="admin-td">{e.age}</td>
                <td className="admin-td">{e.email}</td>
                <td className="admin-td">{e.phone || '-'}</td>
                <td className="admin-td">{e.adresse}</td>
                <td className="admin-td">
                  <span className="admin-badge employee-competency-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {competencies[e.competency_id] || e.competency_name || e.competency || `#${e.competency_id}`}
                  </span>
                </td>
                <td className="admin-td"><pre className="employee-json">{typeof e.jours_disponibles === 'string' ? e.jours_disponibles : JSON.stringify(e.jours_disponibles, null, 2)}</pre></td>
                <td className="admin-td">
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span className={`status-chip ${e.status === 'accepted' ? 'accepted' : e.status === 'rejected' ? 'rejected' : 'pending'}`}> {e.status || 'pending'} </span>
                    <button className="status-approve" onClick={()=>validateEmployee(e.id)} disabled={updatingId===e.id} title="Valider">
                      ✓
                    </button>
                    <button className="status-reject" onClick={()=>updateStatus(e.id,'rejected')} disabled={updatingId===e.id} title="Refuser">
                      ✕
                    </button>
                  </div>
                </td>
                <td className="admin-td">{e.created_at ? new Date(e.created_at).toLocaleString() : ''}</td>
                <td className="admin-td">
                  <div className="employee-actions">
                    <button 
                      className="view-button" 
                      onClick={() => showEmployeeDetailsPage(e)}
                      title="Voir les détails"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Voir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Employee Details Page */}
      {showEmployeePage && selectedEmployee && (
        <div className="employee-details-page">
          <div className="page-header">
            <button className="back-button" onClick={closeEmployeeDetailsPage}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Retour à la liste
            </button>
            <h2>Détails de l'Employé</h2>
          </div>
          
          <div className="page-content">
            <div className="employee-profile-section">
              <div className="profile-photo">
                {(() => {
                  const photoUrl = getEmployeePhotoUrl(selectedEmployee);
                  return photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={selectedEmployee.name || 'photo'}
                      className="employee-large-avatar"
                      onError={(ev) => {
                        ev.currentTarget.style.display = 'none';
                        ev.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null;
                })()}
                <div className="employee-large-avatar placeholder" style={{display: 'flex'}}>
                  👤
                </div>
              </div>
              
              <div className="profile-info">
                <h3 className="employee-name">{selectedEmployee.name} {selectedEmployee.prenom}</h3>
                <p className="employee-id">ID: #{selectedEmployee.id}</p>
                <div className={`status-badge ${selectedEmployee.status === 'accepted' ? 'accepted' : selectedEmployee.status === 'rejected' ? 'rejected' : 'pending'}`}>
                  {selectedEmployee.status || 'pending'}
                </div>
              </div>
            </div>

            <div className="employee-details-grid">
              <div className="detail-section">
                <h4>Informations Personnelles</h4>
                <div className="detail-item">
                  <span className="detail-label">Nom:</span>
                  <span className="detail-value">{selectedEmployee.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Prénom:</span>
                  <span className="detail-value">{selectedEmployee.prenom}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Âge:</span>
                  <span className="detail-value">{selectedEmployee.age} ans</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedEmployee.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Téléphone:</span>
                  <span className="detail-value">{selectedEmployee.phone || 'Non renseigné'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Adresse:</span>
                  <span className="detail-value">{selectedEmployee.adresse || 'Non renseignée'}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Informations Professionnelles</h4>
                <div className="detail-item">
                  <span className="detail-label">Compétence:</span>
                  <span className="detail-value">
                    {competencies[selectedEmployee.competency_id] || selectedEmployee.competency_name || selectedEmployee.competency || `#${selectedEmployee.competency_id}`}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Statut:</span>
                  <span className="detail-value">
                    <span className={`status-chip ${selectedEmployee.status === 'accepted' ? 'accepted' : selectedEmployee.status === 'rejected' ? 'rejected' : 'pending'}`}>
                      {selectedEmployee.status || 'pending'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date d'inscription:</span>
                  <span className="detail-value">
                    {selectedEmployee.created_at ? new Date(selectedEmployee.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Non disponible'}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Disponibilités</h4>
                <div className="availability-details">
                  {(() => {
                    let availabilityData = selectedEmployee.jours_disponibles;
                    
                    // Parse string if needed
                    if (typeof availabilityData === 'string') {
                      try {
                        availabilityData = JSON.parse(availabilityData);
                      } catch (e) {
                        return <div className="availability-error">Format de données invalide</div>;
                      }
                    }
                    
                    // If it's an object with day schedules
                    if (availabilityData && typeof availabilityData === 'object') {
                      const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
                      const dayNames = {
                        'lundi': 'Lundi',
                        'mardi': 'Mardi', 
                        'mercredi': 'Mercredi',
                        'jeudi': 'Jeudi',
                        'vendredi': 'Vendredi',
                        'samedi': 'Samedi',
                        'dimanche': 'Dimanche'
                      };
                      
                      return (
                        <div className="availability-grid">
                          {days.map(day => {
                            const dayData = availabilityData[day];
                            const isAvailable = dayData && dayData.start && dayData.end;
                            
                            return (
                              <div key={day} className={`availability-day ${isAvailable ? 'available' : 'unavailable'}`}>
                                <div className="day-name">{dayNames[day]}</div>
                                {isAvailable ? (
                                  <div className="time-slot">
                                    <div className="time-range">
                                      <span className="time-icon">🕐</span>
                                      <span className="time-text">{dayData.start} - {dayData.end}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="unavailable-text">
                                    <span className="unavailable-icon">❌</span>
                                    <span>Non disponible</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    
                    // Fallback to original JSON display
                    return (
                      <pre className="availability-json">
                        {JSON.stringify(availabilityData, null, 2)}
                      </pre>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          <div className="page-footer">
            <button className="action-button approve" onClick={() => {
              validateEmployee(selectedEmployee.id);
              closeEmployeeDetailsPage();
            }} disabled={updatingId === selectedEmployee.id}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Valider l'employé
            </button>
            <button className="action-button reject" onClick={() => {
              updateStatus(selectedEmployee.id, 'rejected');
              closeEmployeeDetailsPage();
            }} disabled={updatingId === selectedEmployee.id}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Refuser l'employé
            </button>
          </div>
        </div>
      )}
    </section>
  );
}



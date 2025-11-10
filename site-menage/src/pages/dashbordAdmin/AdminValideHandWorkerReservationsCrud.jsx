import React, { useState, useEffect } from 'react';
import './AdminHandWorkerRegistrationsCrud.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export default function AdminValideHandWorkerReservationsCrud({ token, onAuthError }) {
  const [registrations, setRegistrations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load categories
      const categoriesResponse = await fetch(`${API_BASE_URL}/hand-worker-categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (categoriesResponse.status === 401) {
        onAuthError();
        return;
      }

      const categoriesData = await categoriesResponse.json();
      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }

      // Load validated registrations
      const registrationsResponse = await fetch(`${API_BASE_URL}/admin/valide-hand-worker-reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (registrationsResponse.status === 401) {
        onAuthError();
        return;
      }

      const registrationsData = await registrationsResponse.json();
      if (registrationsData.success) {
        setRegistrations(registrationsData.data);
      } else {
        setError('Erreur lors du chargement des travailleurs validés');
      }
    } catch (e) {
      console.error('Error loading data:', e);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (registrationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce travailleur validé ?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/valide-hand-worker-reservations/${registrationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        onAuthError();
        return;
      }

      const data = await response.json();
      if (data.success) {
        setSuccess('Travailleur validé supprimé avec succès');
        await loadData();
      } else {
        setError(data.message || 'Erreur lors de la suppression');
      }
    } catch (e) {
      console.error('Error deleting validated worker:', e);
      setError('Erreur lors de la suppression');
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'N/A';
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      registration.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.phone?.includes(searchTerm);
    
    const matchesCategory = categoryFilter === 'all' || registration.category_id === parseInt(categoryFilter);
    
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-hand-worker-registrations">
      <div className="admin-header">
        <h2>العمّال المعتمدون - عمال الحرف</h2>
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-label">إجمالي</span>
            <span className="stat-value">{registrations.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">معتمدين</span>
            <span className="stat-value">{registrations.filter(r => r.status === 'approved').length}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle"></i>
          {success}
        </div>
      )}

      <div className="filters-bar">
        <div className="filter-group">
          <input
            type="text"
            placeholder="بحث (الاسم، البريد، الهاتف)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">جميع الأنواع</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="registrations-table-container">
        <table className="registrations-table">
          <thead>
            <tr>
              <th>الصورة</th>
              <th>الاسم الكامل</th>
              <th>البريد الإلكتروني</th>
              <th>الهاتف</th>
              <th>نوع العمل</th>
              <th>المنطقة/العنوان</th>
              <th>سنوات الخبرة</th>
              <th>الحالة</th>
              <th>تاريخ الاعتماد</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data">
                  لا توجد تسجيلات معتمدة
                </td>
              </tr>
            ) : (
              filteredRegistrations.map(registration => (
                <tr key={registration.id}>
                  <td className="photo-cell">
                    {registration.photo ? (
                      <img 
                        src={`http://localhost:8000/storage/${registration.photo}`} 
                        alt={registration.full_name}
                        className="registration-photo"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50';
                        }}
                      />
                    ) : (
                      <div className="default-photo">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </td>
                  <td>{registration.full_name}</td>
                  <td className="email-cell">{registration.email}</td>
                  <td className="phone-cell">{registration.phone}</td>
                  <td className="category-cell">
                    {getCategoryName(registration.category_id)}
                  </td>
                  <td>
                    {registration.address && `${registration.address}, `}
                    {registration.city}
                  </td>
                  <td className="experience-cell">{registration.experience_years} سنة</td>
                  <td>
                    <span className={`status-badge status-approved`}>
                      معتمدة
                    </span>
                  </td>
                  <td>
                    {registration.approved_at ? new Date(registration.approved_at).toLocaleDateString('ar-MA') : '-'}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(registration.id)}
                      title="حذف"
                    >
                      <i className="fas fa-trash"></i>
                      <span>حذف</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


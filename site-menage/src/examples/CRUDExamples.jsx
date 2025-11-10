/**
 * أمثلة CRUD مع Supabase
 * 
 * هذا الملف يحتوي على أمثلة كاملة لجميع عمليات CRUD:
 * - CREATE (إنشاء)
 * - READ (قراءة)
 * - UPDATE (تحديث)
 * - DELETE (حذف)
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ============================================
// مثال 1: عرض قائمة الخدمات (READ)
// ============================================
export function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setLoading(true);
      setError(null);

      // جلب جميع الخدمات النشطة
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true) // حيث is_active = true
        .order('sort_order', { ascending: true }); // ترتيب حسب sort_order

      if (error) throw error;

      setServices(data || []);
    } catch (err) {
      setError(err.message);
      console.error('خطأ في جلب الخدمات:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>جاري تحميل الخدمات...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        <p>خطأ: {error}</p>
        <button onClick={loadServices}>إعادة المحاولة</button>
      </div>
    );
  }

  return (
    <div>
      <h2>قائمة الخدمات</h2>
      {services.length === 0 ? (
        <p>لا توجد خدمات متاحة</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {services.map(service => (
            <div
              key={service.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <h3>{service.name_ar || service.name_fr || service.name_en}</h3>
              <p>{service.description_ar || service.description_fr || service.description_en}</p>
              {service.price_per_m2 && (
                <p><strong>السعر:</strong> {service.price_per_m2} د.ج/م²</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// مثال 2: إنشاء خدمة جديدة (CREATE)
// ============================================
export function CreateServiceForm() {
  const [formData, setFormData] = useState({
    name_ar: '',
    name_fr: '',
    name_en: '',
    description_ar: '',
    description_fr: '',
    description_en: '',
    price_per_m2: '',
    is_active: true,
    sort_order: 0
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // إنشاء خدمة جديدة
      const { data, error } = await supabase
        .from('services')
        .insert([{
          ...formData,
          price_per_m2: formData.price_per_m2 ? parseFloat(formData.price_per_m2) : null
        }])
        .select()
        .single(); // للحصول على السجل الذي تم إنشاؤه

      if (error) throw error;

      setSuccess(true);
      // إعادة تعيين النموذج
      setFormData({
        name_ar: '',
        name_fr: '',
        name_en: '',
        description_ar: '',
        description_fr: '',
        description_en: '',
        price_per_m2: '',
        is_active: true,
        sort_order: 0
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <h2>إضافة خدمة جديدة</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffe6e6' }}>
          خطأ: {error}
        </div>
      )}
      
      {success && (
        <div style={{ color: 'green', marginBottom: '10px', padding: '10px', backgroundColor: '#e6ffe6' }}>
          تم إنشاء الخدمة بنجاح!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>الاسم (عربي):</label>
          <input
            type="text"
            value={formData.name_ar}
            onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>الاسم (فرنسي):</label>
          <input
            type="text"
            value={formData.name_fr}
            onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>الوصف (عربي):</label>
          <textarea
            value={formData.description_ar}
            onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
            rows={3}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>السعر لكل متر مربع:</label>
          <input
            type="number"
            step="0.01"
            value={formData.price_per_m2}
            onChange={(e) => setFormData({ ...formData, price_per_m2: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            {' '}نشط
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'جاري الإنشاء...' : 'إنشاء خدمة'}
        </button>
      </form>
    </div>
  );
}

// ============================================
// مثال 3: تحديث خدمة (UPDATE)
// ============================================
export function UpdateServiceForm({ serviceId, onUpdate }) {
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadService();
  }, [serviceId]);

  async function loadService() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) throw error;

      setService(data);
      setFormData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error } = await supabase
        .from('services')
        .update({
          ...formData,
          price_per_m2: formData.price_per_m2 ? parseFloat(formData.price_per_m2) : null
        })
        .eq('id', serviceId)
        .select()
        .single();

      if (error) throw error;

      setSuccess(true);
      if (onUpdate) onUpdate(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (!service) {
    return <div>الخدمة غير موجودة</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <h2>تحديث الخدمة</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          خطأ: {error}
        </div>
      )}
      
      {success && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          تم التحديث بنجاح!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>الاسم (عربي):</label>
          <input
            type="text"
            value={formData.name_ar || ''}
            onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>الوصف (عربي):</label>
          <textarea
            value={formData.description_ar || ''}
            onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
            rows={3}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>السعر لكل متر مربع:</label>
          <input
            type="number"
            step="0.01"
            value={formData.price_per_m2 || ''}
            onChange={(e) => setFormData({ ...formData, price_per_m2: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              checked={formData.is_active || false}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            {' '}نشط
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </form>
    </div>
  );
}

// ============================================
// مثال 4: حذف خدمة (DELETE)
// ============================================
export function DeleteServiceButton({ serviceId, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function handleDelete() {
    if (!confirm) {
      setConfirm(true);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      if (onDelete) onDelete();
      alert('تم حذف الخدمة بنجاح');
    } catch (err) {
      alert('خطأ في الحذف: ' + err.message);
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        padding: '8px 16px',
        backgroundColor: confirm ? '#dc3545' : '#ffc107',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: loading ? 'not-allowed' : 'pointer'
      }}
    >
      {loading
        ? 'جاري الحذف...'
        : confirm
        ? 'اضغط مرة أخرى للتأكيد'
        : 'حذف'}
    </button>
  );
}

// ============================================
// مثال 5: إنشاء حجز (CREATE Reservation)
// ============================================
export function CreateReservationForm({ serviceId, typeId }) {
  const [formData, setFormData] = useState({
    firstname: '',
    phone: '',
    location: '',
    email: '',
    message: '',
    preferred_date: '',
    size: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // الحصول على المستخدم الحالي (إن وجد)
      const { data: { user } } = await supabase.auth.getUser();

      // إنشاء الحجز
      const { data, error } = await supabase
        .from('reservations')
        .insert([{
          ...formData,
          service: 'خدمة التنظيف', // أو جلبها من serviceId
          type_id: typeId || null,
          user_id: user?.id || null,
          status: 'pending',
          size: formData.size ? parseFloat(formData.size) : null,
        }])
        .select()
        .single();

      if (error) throw error;

      setSuccess(true);
      // إعادة تعيين النموذج
      setFormData({
        firstname: '',
        phone: '',
        location: '',
        email: '',
        message: '',
        preferred_date: '',
        size: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <h2>طلب حجز</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          خطأ: {error}
        </div>
      )}
      
      {success && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>الاسم:</label>
          <input
            type="text"
            value={formData.firstname}
            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>رقم الهاتف:</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>الموقع:</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>البريد الإلكتروني:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>التاريخ المفضل:</label>
          <input
            type="datetime-local"
            value={formData.preferred_date}
            onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>المساحة (متر مربع):</label>
          <input
            type="number"
            step="0.01"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>رسالة (اختياري):</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'جاري الإرسال...' : 'إرسال طلب الحجز'}
        </button>
      </form>
    </div>
  );
}

// ============================================
// مثال 6: عرض حجوزات المستخدم (READ Reservations)
// ============================================
export function UserReservations() {
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserAndReservations();
  }, []);

  async function loadUserAndReservations() {
    try {
      setLoading(true);
      
      // الحصول على المستخدم الحالي
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        setLoading(false);
        return;
      }

      // جلب حجوزات المستخدم مع العلاقات
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          types (
            name_ar,
            name_fr
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReservations(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (!user) {
    return (
      <div>
        <p>يرجى تسجيل الدخول لعرض حجوزاتك</p>
        <a href="/login">تسجيل الدخول</a>
      </div>
    );
  }

  if (error) {
    return <div style={{ color: 'red' }}>خطأ: {error}</div>;
  }

  return (
    <div>
      <h2>حجوزاتي</h2>
      <p>مرحباً، {user.email}</p>
      
      {reservations.length === 0 ? (
        <p>لا توجد حجوزات</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {reservations.map(reservation => (
            <div
              key={reservation.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <h3>حجز #{reservation.id}</h3>
              <p><strong>الاسم:</strong> {reservation.firstname}</p>
              <p><strong>الهاتف:</strong> {reservation.phone}</p>
              <p><strong>الموقع:</strong> {reservation.location}</p>
              <p><strong>الحالة:</strong> {reservation.status}</p>
              <p><strong>التاريخ:</strong> {new Date(reservation.created_at).toLocaleDateString('ar')}</p>
              {reservation.types && (
                <p><strong>النوع:</strong> {reservation.types.name_ar || reservation.types.name_fr}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


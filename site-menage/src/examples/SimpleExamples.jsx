/**
 * أمثلة بسيطة جداً لاستخدام Supabase
 * 
 * هذه الأمثلة للمبتدئين - كود بسيط وواضح
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ============================================
// مثال 1: عرض قائمة الخدمات (بسيط جداً)
// ============================================
export function SimpleServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      // جلب الخدمات من Supabase
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('خطأ:', error);
      } else {
        setServices(data || []);
      }
    } catch (err) {
      console.error('خطأ:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>قائمة الخدمات</h2>
      {services.length === 0 ? (
        <p>لا توجد خدمات</p>
      ) : (
        <div>
          {services.map(service => (
            <div key={service.id} style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              margin: '10px 0',
              borderRadius: '8px'
            }}>
              <h3>{service.name_ar || service.name_fr}</h3>
              <p>{service.description_ar || service.description_fr}</p>
              {service.price && (
                <p><strong>السعر:</strong> {service.price} د.ج</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// مثال 2: إضافة خدمة جديدة (بسيط جداً)
// ============================================
export function SimpleAddService() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // إضافة خدمة جديدة
      const { data, error } = await supabase
        .from('services')
        .insert([{
          name_ar: name,
          description_ar: description,
          price: parseFloat(price) || 0,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        setMessage('خطأ: ' + error.message);
      } else {
        setMessage('تمت الإضافة بنجاح!');
        setName('');
        setDescription('');
        setPrice('');
      }
    } catch (err) {
      setMessage('خطأ: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>إضافة خدمة جديدة</h2>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          margin: '10px 0',
          backgroundColor: message.includes('خطأ') ? '#ffe6e6' : '#e6ffe6',
          borderRadius: '5px'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>الاسم:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>الوصف:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>السعر:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
          {loading ? 'جاري الإضافة...' : 'إضافة'}
        </button>
      </form>
    </div>
  );
}

// ============================================
// مثال 3: تسجيل الدخول (بسيط جداً)
// ============================================
export function SimpleLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // تسجيل الدخول
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        setMessage('خطأ: ' + error.message);
      } else {
        setMessage('تم تسجيل الدخول بنجاح!');
        console.log('المستخدم:', data.user);
      }
    } catch (err) {
      setMessage('خطأ: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>تسجيل الدخول</h2>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          margin: '10px 0',
          backgroundColor: message.includes('خطأ') ? '#ffe6e6' : '#e6ffe6',
          borderRadius: '5px'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>البريد الإلكتروني:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>كلمة المرور:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>
    </div>
  );
}

// ============================================
// مثال 4: تسجيل حساب جديد (بسيط جداً)
// ============================================
export function SimpleSignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // تسجيل حساب جديد
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      });

      if (error) {
        setMessage('خطأ: ' + error.message);
      } else {
        setMessage('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني.');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setMessage('خطأ: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>إنشاء حساب جديد</h2>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          margin: '10px 0',
          backgroundColor: message.includes('خطأ') ? '#ffe6e6' : '#e6ffe6',
          borderRadius: '5px'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: '15px' }}>
          <label>البريد الإلكتروني:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>كلمة المرور:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          <small>يجب أن تكون 6 أحرف على الأقل</small>
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
          {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
        </button>
      </form>
    </div>
  );
}

// ============================================
// مثال 5: التحقق من المستخدم الحالي
// ============================================
export function SimpleUserCheck() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب المستخدم الحالي
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // الاستماع لتغييرات تسجيل الدخول
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      {user ? (
        <div>
          <h2>مرحباً!</h2>
          <p>البريد: {user.email}</p>
          <p>المعرف: {user.id}</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            تسجيل الخروج
          </button>
        </div>
      ) : (
        <div>
          <h2>لم يتم تسجيل الدخول</h2>
          <p>يرجى تسجيل الدخول أولاً</p>
        </div>
      )}
    </div>
  );
}


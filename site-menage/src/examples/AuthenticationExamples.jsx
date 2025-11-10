/**
 * أمثلة Authentication مع Supabase
 * 
 * هذا الملف يحتوي على أمثلة كاملة لجميع عمليات Authentication:
 * - تسجيل حساب جديد
 * - تسجيل الدخول
 * - تسجيل الخروج
 * - استرجاع كلمة السر
 * - التحقق من حالة المستخدم
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ============================================
// مثال 1: صفحة تسجيل حساب جديد
// ============================================
export function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // تسجيل حساب جديد
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name, // معلومات إضافية
            // يمكنك إضافة المزيد من البيانات هنا
          }
        }
      });

      if (error) throw error;

      // نجح التسجيل
      setSuccess(true);
      setEmail('');
      setPassword('');
      setName('');
      
      // ملاحظة: Supabase يرسل بريد تأكيد تلقائياً
      alert('تم إنشاء الحساب! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>إنشاء حساب جديد</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          خطأ: {error}
        </div>
      )}
      
      {success && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          تم إنشاء الحساب بنجاح!
        </div>
      )}

      <form onSubmit={handleSignUp}>
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
          <small>يجب أن تكون كلمة المرور 6 أحرف على الأقل</small>
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

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        لديك حساب بالفعل؟ <a href="/login">تسجيل الدخول</a>
      </p>
    </div>
  );
}

// ============================================
// مثال 2: صفحة تسجيل الدخول
// ============================================
export function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSignIn(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // نجح تسجيل الدخول
      // يمكنك إعادة التوجيه هنا
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>تسجيل الدخول</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          خطأ: {error}
        </div>
      )}

      <form onSubmit={handleSignIn}>
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

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href="/forgot-password">نسيت كلمة المرور؟</a>
      </p>
      <p style={{ textAlign: 'center' }}>
        ليس لديك حساب؟ <a href="/signup">سجل الآن</a>
      </p>
    </div>
  );
}

// ============================================
// مثال 3: صفحة استرجاع كلمة السر
// ============================================
export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleResetPassword(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // إرسال رابط إعادة تعيين كلمة السر
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`, // رابط صفحة إعادة التعيين
      });

      if (error) throw error;

      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>استرجاع كلمة المرور</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          خطأ: {error}
        </div>
      )}
      
      {success && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
        </div>
      )}

      <form onSubmit={handleResetPassword}>
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

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href="/login">العودة لتسجيل الدخول</a>
      </p>
    </div>
  );
}

// ============================================
// مثال 4: صفحة إعادة تعيين كلمة السر
// ============================================
export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleUpdatePassword(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>إعادة تعيين كلمة المرور</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          خطأ: {error}
        </div>
      )}
      
      {success && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          تم تحديث كلمة المرور بنجاح! سيتم توجيهك إلى صفحة تسجيل الدخول...
        </div>
      )}

      <form onSubmit={handleUpdatePassword}>
        <div style={{ marginBottom: '15px' }}>
          <label>كلمة المرور الجديدة:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>تأكيد كلمة المرور:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
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
          {loading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
        </button>
      </form>
    </div>
  );
}

// ============================================
// مثال 5: Hook للتحقق من حالة المستخدم
// ============================================
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // الحصول على المستخدم الحالي
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // الاستماع لتغييرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

// ============================================
// مثال 6: مكون لحماية الصفحات (Protected Route)
// ============================================
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (!user) {
    return (
      <div>
        <h2>يجب تسجيل الدخول</h2>
        <a href="/login">تسجيل الدخول</a>
      </div>
    );
  }

  return children;
}

// ============================================
// مثال 7: زر تسجيل الخروج
// ============================================
export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // إعادة التوجيه إلى الصفحة الرئيسية
      window.location.href = '/';
    } catch (err) {
      alert('خطأ في تسجيل الخروج: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      style={{
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: loading ? 'not-allowed' : 'pointer'
      }}
    >
      {loading ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
    </button>
  );
}


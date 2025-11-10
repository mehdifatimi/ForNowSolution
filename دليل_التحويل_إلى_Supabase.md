# دليل شامل: تحويل الموقع من Laravel + MySQL إلى React + Supabase

## 📋 المحتويات
1. [مقدمة](#مقدمة)
2. [ما هو Supabase؟](#ما-هو-supabase)
3. [الفرق بين Laravel + MySQL و Supabase](#الفرق-بين-laravel--mysql-و-supabase)
4. [الخطوة 1: إنشاء مشروع Supabase](#الخطوة-1-إنشاء-مشروع-supabase)
5. [الخطوة 2: إعداد React مع Supabase](#الخطوة-2-إعداد-react-مع-supabase)
6. [الخطوة 3: إنشاء الجداول في Supabase](#الخطوة-3-إنشاء-الجداول-في-supabase)
7. [الخطوة 4: التعامل مع Authentication](#الخطوة-4-التعامل-مع-authentication)
8. [الخطوة 5: أمثلة CRUD بسيطة](#الخطوة-5-أمثلة-crud-بسيطة)
9. [الخطوة 6: أمثلة عملية](#الخطوة-6-أمثلة-عملية)

---

## مقدمة

هذا الدليل سيساعدك على تحويل موقعك من Laravel (Backend) + MySQL إلى React (Frontend) + Supabase (Backend + Database) بطريقة سهلة ومفهومة للمبتدئين.

### ما الذي ستحصل عليه؟
- ✅ موقع React يعمل مباشرة مع Supabase بدون Laravel
- ✅ Authentication جاهز (تسجيل دخول، تسجيل جديد، استرجاع كلمة السر)
- ✅ CRUD كامل للبيانات (إنشاء، قراءة، تحديث، حذف)
- ✅ قاعدة بيانات سحابية آمنة
- ✅ Real-time updates (تحديثات فورية)

---

## ما هو Supabase؟

**Supabase** هو بديل مفتوح المصدر لـ Firebase، يوفر:
- **قاعدة بيانات PostgreSQL** (أقوى من MySQL)
- **Authentication** جاهز (تسجيل دخول، OAuth، إلخ)
- **Real-time** (تحديثات فورية)
- **Storage** (تخزين الملفات)
- **API تلقائية** (لا حاجة لكتابة API يدوياً)

### المميزات للمبتدئين:
- ✅ لا حاجة لكتابة Backend معقد
- ✅ واجهة سهلة لإدارة قاعدة البيانات
- ✅ Client جاهز للاستخدام في React
- ✅ مجاني للبداية (حتى 500MB قاعدة بيانات)

---

## الفرق بين Laravel + MySQL و Supabase

### في Laravel + MySQL:
```php
// Backend (Laravel Controller)
public function getServices() {
    $services = DB::table('services')->where('is_active', true)->get();
    return response()->json($services);
}

// Frontend (React)
const response = await fetch('http://localhost:8000/api/services');
const services = await response.json();
```

**المشاكل:**
- ❌ تحتاج لكتابة API في Laravel
- ❌ تحتاج لـ PHP و Laravel
- ❌ تحتاج لإدارة الخادم
- ❌ معقد للمبتدئين

### في React + Supabase:
```javascript
// Frontend (React) - مباشرة!
import { supabase } from './lib/supabase';

const { data: services } = await supabase
  .from('services')
  .select('*')
  .eq('is_active', true);
```

**المميزات:**
- ✅ لا حاجة لـ Backend
- ✅ كود بسيط ومباشر
- ✅ سحابي (لا حاجة لخادم)
- ✅ سهل للمبتدئين

---

## الخطوة 1: إنشاء مشروع Supabase

### 1.1 إنشاء حساب في Supabase
1. اذهب إلى [supabase.com](https://supabase.com)
2. اضغط على "Start your project"
3. سجل بحساب GitHub أو Google
4. اضغط "New Project"

### 1.2 إعداد المشروع
1. **اسم المشروع**: `nettoyage-services`
2. **كلمة المرور**: اختر كلمة مرور قوية لقاعدة البيانات
3. **المنطقة**: اختر الأقرب لك (مثلاً: `West US`)
4. اضغط "Create new project"

### 1.3 الحصول على API Keys
بعد إنشاء المشروع:
1. اذهب إلى **Settings** (الإعدادات) في القائمة الجانبية
2. اضغط على **API**
3. ستجد:
   - **Project URL**: مثل `https://xxxxx.supabase.co`
   - **anon public key**: مثل `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**احفظ هذه المعلومات!** ستحتاجها لاحقاً.

---

## الخطوة 2: إعداد React مع Supabase

### 2.1 تثبيت Supabase Client
في مجلد مشروع React (`site-menage`):

```bash
npm install @supabase/supabase-js
```

### 2.2 إنشاء ملف إعداد Supabase
أنشئ ملف `src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

// استبدل هذه القيم بالقيم من Supabase Dashboard
const supabaseUrl = 'https://xxxxx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**ملاحظة:** استخدم ملف `.env` لحفظ المفاتيح بشكل آمن (راجع الملف المرفق).

---

## الخطوة 3: إنشاء الجداول في Supabase

### 3.1 طريقة 1: استخدام SQL Editor (الأسهل)

1. في Supabase Dashboard، اذهب إلى **SQL Editor**
2. اضغط **New Query**
3. انسخ محتوى ملف `supabase-schema.sql` (الموجود في المشروع)
4. الصق الكود واضغط **Run**

### 3.2 طريقة 2: استخدام Table Editor (واجهة بصرية)

1. اذهب إلى **Table Editor**
2. اضغط **New Table**
3. أدخل اسم الجدول (مثلاً: `services`)
4. أضف الأعمدة (Columns):
   - `id` - نوع: `int8` - Primary Key - Auto increment
   - `name_fr` - نوع: `text`
   - `name_ar` - نوع: `text`
   - `name_en` - نوع: `text`
   - `is_active` - نوع: `bool` - Default: `true`
   - `created_at` - نوع: `timestamptz` - Default: `now()`
   - `updated_at` - نوع: `timestamptz` - Default: `now()`

### 3.3 الجداول الأساسية المطلوبة

#### جدول `services` (الخدمات)
```sql
CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  name_fr TEXT,
  name_ar TEXT,
  name_en TEXT,
  description_fr TEXT,
  description_ar TEXT,
  description_en TEXT,
  price_per_m2 DECIMAL(10,2),
  price_4h DECIMAL(10,2),
  extra_hour_price DECIMAL(10,2),
  images JSONB,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### جدول `categories_house` (فئات المنازل)
```sql
CREATE TABLE categories_house (
  id BIGSERIAL PRIMARY KEY,
  service_id BIGINT REFERENCES services(id) ON DELETE CASCADE,
  name_fr TEXT,
  name_ar TEXT,
  name_en TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### جدول `types` (الأنواع)
```sql
CREATE TABLE types (
  id BIGSERIAL PRIMARY KEY,
  service_id BIGINT REFERENCES services(id) ON DELETE CASCADE,
  category_house_id BIGINT REFERENCES categories_house(id) ON DELETE CASCADE,
  name_fr TEXT,
  name_ar TEXT,
  name_en TEXT,
  description_fr TEXT,
  description_ar TEXT,
  description_en TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### جدول `reservations` (الحجوزات)
```sql
CREATE TABLE reservations (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  firstname TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  service TEXT,
  type TEXT,
  type_id BIGINT REFERENCES types(id) ON DELETE SET NULL,
  choixtype_id BIGINT REFERENCES type_options(id) ON DELETE SET NULL,
  size DECIMAL(10,2),
  total_price DECIMAL(10,2),
  message TEXT,
  email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  preferred_date TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**ملاحظة:** راجع ملف `supabase-schema.sql` الكامل لجميع الجداول.

### 3.4 إعداد Row Level Security (RLS)

Supabase يستخدم RLS لحماية البيانات. في SQL Editor:

```sql
-- تفعيل RLS على جدول services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بقراءة الخدمات النشطة
CREATE POLICY "Anyone can view active services"
ON services FOR SELECT
USING (is_active = true);

-- السماح للمستخدمين المسجلين بإنشاء حجوزات
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reservations"
ON reservations FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view their own reservations"
ON reservations FOR SELECT
USING (auth.uid() = user_id);
```

---

## الخطوة 4: التعامل مع Authentication

Supabase يوفر Authentication جاهز! لا حاجة لكتابة كود معقد.

### 4.1 تسجيل حساب جديد

```javascript
import { supabase } from './lib/supabase';

async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name: name, // معلومات إضافية
      }
    }
  });

  if (error) {
    console.error('خطأ في التسجيل:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}

// استخدام
const result = await signUp('user@example.com', 'password123', 'أحمد');
```

### 4.2 تسجيل الدخول

```javascript
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error('خطأ في تسجيل الدخول:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user, session: data.session };
}

// استخدام
const result = await signIn('user@example.com', 'password123');
```

### 4.3 تسجيل الخروج

```javascript
async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('خطأ في تسجيل الخروج:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
```

### 4.4 استرجاع كلمة السر

```javascript
async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://yoursite.com/reset-password', // رابط صفحة إعادة تعيين كلمة السر
  });

  if (error) {
    console.error('خطأ:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, message: 'تم إرسال رابط إعادة تعيين كلمة السر إلى بريدك' };
}
```

### 4.5 التحقق من حالة المستخدم

```javascript
import { useEffect, useState } from 'react';

function useAuth() {
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

// استخدام في Component
function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>جاري التحميل...</div>;

  if (!user) return <LoginPage />;

  return <Dashboard user={user} />;
}
```

---

## الخطوة 5: أمثلة CRUD بسيطة

### 5.1 CREATE (إنشاء)

```javascript
import { supabase } from './lib/supabase';

// إنشاء خدمة جديدة
async function createService(serviceData) {
  const { data, error } = await supabase
    .from('services')
    .insert([serviceData])
    .select()
    .single(); // للحصول على سجل واحد فقط

  if (error) {
    console.error('خطأ:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
}

// استخدام
const newService = {
  name_fr: 'Nettoyage',
  name_ar: 'تنظيف',
  name_en: 'Cleaning',
  description_fr: 'Service de nettoyage',
  is_active: true,
  sort_order: 1
};

const result = await createService(newService);
```

### 5.2 READ (قراءة)

```javascript
// جلب جميع الخدمات النشطة
async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true) // حيث is_active = true
    .order('sort_order', { ascending: true }); // ترتيب حسب sort_order

  if (error) {
    console.error('خطأ:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
}

// جلب خدمة واحدة
async function getServiceById(id) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('خطأ:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
}

// جلب مع علاقات (JOIN)
async function getServiceWithTypes(serviceId) {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      types (*)
    `)
    .eq('id', serviceId)
    .single();

  if (error) {
    console.error('خطأ:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
}
```

### 5.3 UPDATE (تحديث)

```javascript
// تحديث خدمة
async function updateService(id, updates) {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id) // حيث id = id
    .select()
    .single();

  if (error) {
    console.error('خطأ:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
}

// استخدام
const result = await updateService(1, {
  name_ar: 'تنظيف منزلي',
  is_active: false
});
```

### 5.4 DELETE (حذف)

```javascript
// حذف خدمة
async function deleteService(id) {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('خطأ:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
```

---

## الخطوة 6: أمثلة عملية

### 6.1 عرض قائمة الخدمات في React

```javascript
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      setServices(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;

  return (
    <div>
      <h2>قائمة الخدمات</h2>
      {services.map(service => (
        <div key={service.id} className="service-card">
          <h3>{service.name_ar || service.name_fr}</h3>
          <p>{service.description_ar || service.description_fr}</p>
          <p>السعر: {service.price_per_m2} د.ج/م²</p>
        </div>
      ))}
    </div>
  );
}

export default ServicesList;
```

### 6.2 حجز خدمة تلقائياً

```javascript
import { useState } from 'react';
import { supabase } from './lib/supabase';

function ReservationForm({ serviceId, typeId }) {
  const [formData, setFormData] = useState({
    firstname: '',
    phone: '',
    location: '',
    email: '',
    message: '',
    preferred_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // الحصول على المستخدم الحالي (إن وجد)
      const { data: { user } } = await supabase.auth.getUser();

      // إنشاء الحجز
      const { data, error } = await supabase
        .from('reservations')
        .insert([{
          ...formData,
          service: 'خدمة التنظيف', // أو جلبها من serviceId
          type_id: typeId,
          user_id: user?.id || null,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      setSuccess(true);
      setFormData({
        firstname: '',
        phone: '',
        location: '',
        email: '',
        message: '',
        preferred_date: ''
      });
    } catch (err) {
      alert('خطأ: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return <div className="success">تم إرسال طلب الحجز بنجاح!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="الاسم"
        value={formData.firstname}
        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
        required
      />
      <input
        type="tel"
        placeholder="رقم الهاتف"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="الموقع"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="datetime-local"
        placeholder="التاريخ المفضل"
        value={formData.preferred_date}
        onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
      />
      <textarea
        placeholder="رسالة (اختياري)"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'جاري الإرسال...' : 'إرسال طلب الحجز'}
      </button>
    </form>
  );
}

export default ReservationForm;
```

### 6.3 عرض بيانات المستخدمين والحجوزات

```javascript
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

function UserReservations() {
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserAndReservations();
  }, []);

  async function loadUserAndReservations() {
    try {
      // الحصول على المستخدم الحالي
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        setLoading(false);
        return;
      }

      // جلب حجوزات المستخدم
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
      console.error('خطأ:', err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>جاري التحميل...</div>;
  if (!user) return <div>يرجى تسجيل الدخول</div>;

  return (
    <div>
      <h2>حجوزاتي</h2>
      <p>مرحباً، {user.email}</p>
      
      {reservations.length === 0 ? (
        <p>لا توجد حجوزات</p>
      ) : (
        <div>
          {reservations.map(reservation => (
            <div key={reservation.id} className="reservation-card">
              <h3>حجز #{reservation.id}</h3>
              <p>الاسم: {reservation.firstname}</p>
              <p>الهاتف: {reservation.phone}</p>
              <p>الموقع: {reservation.location}</p>
              <p>الحالة: {reservation.status}</p>
              <p>التاريخ: {new Date(reservation.created_at).toLocaleDateString('ar')}</p>
              {reservation.types && (
                <p>النوع: {reservation.types.name_ar || reservation.types.name_fr}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserReservations;
```

### 6.4 صفحة تسجيل دخول كاملة

```javascript
import { useState } from 'react';
import { supabase } from './lib/supabase';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // نجح تسجيل الدخول
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <h2>تسجيل الدخول</h2>
      <form onSubmit={handleLogin}>
        {error && <div className="error">{error}</div>}
        
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>
      
      <p>
        ليس لديك حساب؟ <a href="/register">سجل الآن</a>
      </p>
      <p>
        <a href="/forgot-password">نسيت كلمة المرور؟</a>
      </p>
    </div>
  );
}

export default LoginPage;
```

---

## نصائح مهمة

### 1. استخدام Environment Variables
لا تضع API Keys مباشرة في الكود! استخدم ملف `.env`:

```env
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

ثم في `supabase.js`:
```javascript
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
```

### 2. معالجة الأخطاء
دائماً تحقق من الأخطاء:

```javascript
const { data, error } = await supabase.from('services').select('*');

if (error) {
  console.error('خطأ:', error.message);
  // معالجة الخطأ
  return;
}

// استخدام data
```

### 3. استخدام TypeScript (اختياري)
للمشاريع الكبيرة، استخدم TypeScript:

```typescript
interface Service {
  id: number;
  name_ar: string;
  name_fr: string;
  is_active: boolean;
}

const { data } = await supabase
  .from('services')
  .select('*')
  .returns<Service[]>();
```

---

## الخلاصة

الآن لديك:
- ✅ مشروع Supabase جاهز
- ✅ React متصل مع Supabase
- ✅ Authentication يعمل
- ✅ CRUD كامل للبيانات
- ✅ أمثلة عملية جاهزة

**الخطوات التالية:**
1. استورد البيانات من MySQL إلى Supabase
2. اختبر جميع الوظائف
3. انشر الموقع

**ملفات إضافية:**
- `supabase-schema.sql` - جميع الجداول
- `src/lib/supabase.js` - إعداد Supabase Client
- أمثلة React في مجلد `examples/`

---

## مساعدة إضافية

- [وثائق Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [React + Supabase Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-react)

**أسئلة؟** راجع الملفات المرفقة أو ابحث في الوثائق الرسمية.


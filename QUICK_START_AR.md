# دليل البدء السريع - React + Supabase

## 🚀 خطوات سريعة للبدء

### الخطوة 1: إنشاء مشروع Supabase (5 دقائق)

1. اذهب إلى [supabase.com](https://supabase.com)
2. اضغط "Start your project"
3. سجل بحساب GitHub أو Google
4. اضغط "New Project"
5. املأ البيانات:
   - **اسم المشروع**: `nettoyage-services`
   - **كلمة المرور**: اختر كلمة مرور قوية
   - **المنطقة**: اختر الأقرب لك
6. اضغط "Create new project"
7. انتظر حتى يكتمل الإنشاء (دقيقتان)

### الخطوة 2: الحصول على API Keys (دقيقة واحدة)

1. في Supabase Dashboard، اضغط **Settings** (⚙️)
2. اضغط **API**
3. انسخ:
   - **Project URL**: مثل `https://xxxxx.supabase.co`
   - **anon public key**: مثل `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### الخطوة 3: إعداد React (دقيقتان)

1. افتح مجلد `site-menage`
2. أنشئ ملف `.env` في الجذر:
```env
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
3. تأكد من تثبيت Supabase:
```bash
npm install @supabase/supabase-js
```

### الخطوة 4: إنشاء الجداول (5 دقائق)

1. في Supabase Dashboard، اضغط **SQL Editor**
2. اضغط **New Query**
3. افتح ملف `supabase-schema-complete.sql`
4. انسخ كل المحتوى والصقه في SQL Editor
5. اضغط **Run** (أو F5)
6. انتظر حتى يكتمل التنفيذ

### الخطوة 5: اختبار الاتصال (دقيقة واحدة)

أنشئ ملف `test-connection.js`:

```javascript
import { supabase } from './src/lib/supabase-setup';

async function test() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('❌ خطأ:', error);
  } else {
    console.log('✅ الاتصال ناجح!', data);
  }
}

test();
```

شغله:
```bash
node test-connection.js
```

---

## 📝 أمثلة سريعة

### 1. جلب الخدمات

```javascript
import { supabase } from './lib/supabase-setup';

const { data: services } = await supabase
  .from('services')
  .select('*')
  .eq('is_active', true);
```

### 2. إنشاء حجز

```javascript
const { data, error } = await supabase
  .from('reservations')
  .insert([{
    firstname: 'أحمد',
    phone: '0551234567',
    location: 'الجزائر',
    status: 'pending'
  }]);
```

### 3. تسجيل دخول

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

---

## 📚 الملفات المهمة

- `دليل_التحويل_إلى_Supabase.md` - الدليل الشامل
- `supabase-schema-complete.sql` - جميع الجداول
- `site-menage/src/lib/supabase-setup.js` - إعداد Supabase
- `site-menage/src/examples/AuthenticationExamples.jsx` - أمثلة Authentication
- `site-menage/src/examples/CRUDExamples.jsx` - أمثلة CRUD

---

## ❓ مشاكل شائعة

### المشكلة: "Invalid API key"
**الحل:** تأكد من نسخ المفاتيح بشكل صحيح من Supabase Dashboard

### المشكلة: "relation does not exist"
**الحل:** تأكد من تشغيل `supabase-schema-complete.sql` في SQL Editor

### المشكلة: "permission denied"
**الحل:** تحقق من Row Level Security (RLS) Policies في Supabase

---

## 🎉 تهانينا!

الآن لديك:
- ✅ مشروع Supabase جاهز
- ✅ React متصل
- ✅ قاعدة بيانات جاهزة
- ✅ Authentication جاهز

**الخطوة التالية:** ابدأ باستخدام الأمثلة في `examples/`!

---

**أسئلة؟** راجع `دليل_التحويل_إلى_Supabase.md` للتفاصيل الكاملة.


# Quick Start Guide - Migration to Supabase

## البدء السريع (5 دقائق)

### 1. إنشاء مشروع Supabase

```bash
# اذهب إلى https://supabase.com
# أنشئ حساب جديد
# أنشئ مشروع جديد
# انسخ Project URL و Anon Key
```

### 2. إعداد Environment Variables

أنشئ `site-menage/.env`:

```env
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 3. تثبيت المكتبات

```bash
cd site-menage
npm install
```

### 4. تنفيذ SQL Schema

1. افتح Supabase Dashboard > SQL Editor
2. انسخ محتوى `supabase-schema-complete.sql`
3. اضغط Run

### 5. تحديث الكود

استبدل في ملفاتك:

```javascript
// قبل
import { getServices } from './api';

// بعد
import { getServices } from './api-supabase';
```

### 6. تشغيل المشروع

```bash
npm start
```

---

## التحقق من العمل

افتح Console في المتصفح وتحقق من:

```javascript
import { supabase } from './lib/supabase';

// اختبار الاتصال
const { data, error } = await supabase.from('services').select('*');
console.log('Services:', data);
```

---

## الخطوات التالية

1. ✅ نقل البيانات من MySQL
2. ✅ تحديث جميع API calls
3. ✅ تحديث Auth Contexts
4. ✅ إعداد Storage Buckets
5. ✅ اختبار شامل

راجع `دليل_التحويل_إلى_Supabase.md` للتفاصيل الكاملة.


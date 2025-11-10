# ⚠️ إصلاح سريع: جدول jardins غير موجود

## المشكلة:
```
Could not find the table 'public.jardins' in the schema cache
```

## الحل:

### الخطوة 1: إنشاء جدول `jardins`

1. اذهب إلى **Supabase Dashboard** → **SQL Editor**
2. انسخ والصق محتوى ملف `URGENT_CREATE_JARDINS_TABLE.sql`
3. اضغط **Run** (أو F5)

### الخطوة 2: التحقق من إنشاء الجدول

بعد تشغيل SQL، تحقق من:
- اذهب إلى **Table Editor** → يجب أن ترى جدول `jardins`
- أو شغّل هذا SQL للتحقق:
```sql
SELECT * FROM jardins LIMIT 1;
```

### الخطوة 3: إضافة RLS Policies لـ jardinage_categories (إن لم تكن موجودة)

شغّل ملف `FIX_JARDINAGE_RLS.sql` أيضاً.

## بعد الإصلاح:

بعد إنشاء الجدول، يجب أن تعمل الصفحات التالية:
- ✅ `/admin/adminJardinaje/services` - إدارة الخدمات
- ✅ `/admin/adminJardinaje/categories` - إدارة الفئات
- ✅ `/jardinage` - صفحة البستنة العامة


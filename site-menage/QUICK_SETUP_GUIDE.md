# دليل الإعداد السريع - RLS Policies + Storage Buckets

## ⚡ الإعداد السريع (خطوة واحدة فقط!)

### الخطوة الوحيدة: تشغيل ملف SQL

افتح Supabase Dashboard → **SQL Editor** وافتح ملف:
**`COMPLETE_RLS_AND_STORAGE_SETUP.sql`**

اضغط **RUN** ✅

**هذا كل شيء!** الملف سيقوم بـ:
- ✅ إنشاء Buckets تلقائياً (products, gallery, employees)
- ✅ تفعيل Buckets كـ public
- ✅ إضافة RLS Policies لجميع الجداول (12 جدول)
- ✅ إضافة Storage RLS Policies (12 policies)

### ملاحظة: إنشاء Buckets يدوياً (اختياري)

إذا كنت تفضل إنشاء Buckets يدوياً من واجهة Supabase Storage:
1. افتح **Storage** → **New bucket**
2. أنشئ: `products`, `gallery`, `employees` (جميعها Public ✅)
3. ثم شغّل `COMPLETE_RLS_AND_STORAGE_SETUP.sql`

## ✅ ما سيتم إضافته

### RLS Policies للجداول (12 جدول):
- ✅ categories
- ✅ services
- ✅ category_gallery
- ✅ gallery
- ✅ products
- ✅ reservations
- ✅ employees
- ✅ categories_house
- ✅ product_types
- ✅ type_category_gallery
- ✅ promotions
- ✅ orders

### Storage Buckets (3 buckets):
- ✅ products
- ✅ gallery
- ✅ employees

### Storage RLS Policies (12 policies):
- ✅ 4 policies لكل bucket (SELECT, INSERT, UPDATE, DELETE)

## 🔍 التحقق من الإعداد

بعد تشغيل الكود، شغّل هذا للتحقق:

```sql
-- التحقق من Buckets
SELECT name, public FROM storage.buckets 
WHERE name IN ('products', 'gallery', 'employees');

-- التحقق من Table RLS Policies
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('categories', 'services', 'category_gallery', 'gallery', 'products', 'reservations', 'employees', 'categories_house', 'product_types', 'type_category_gallery', 'promotions', 'orders')
GROUP BY tablename;

-- التحقق من Storage RLS Policies
SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND (policyname LIKE '%products%' OR policyname LIKE '%gallery%' OR policyname LIKE '%employees%')
ORDER BY policyname;
```

## 📝 ملاحظات

- **جميع Buckets يجب أن تكون Public** ✅
- **جميع Policies تسمح بالقراءة العامة** ✅
- **المستخدمون المسجلون فقط يمكنهم الكتابة/الحذف** ✅

## 🚀 بعد الإعداد

بعد تشغيل `COMPLETE_RLS_AND_STORAGE_SETUP.sql`:
1. ✅ جميع صفحات Admin المحولة ستعمل
2. ✅ رفع الصور سيعمل في جميع الصفحات
3. ✅ القراءة والكتابة ستعمل بشكل صحيح


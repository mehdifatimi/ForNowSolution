# إنشاء Bucket "gallery" في Supabase Storage

## المشكلة
```
Error: Bucket "gallery" غير موجود. يرجى إنشاء bucket "gallery" في Supabase Storage أولاً.
```

## الحل: إنشاء Bucket "gallery"

### الخطوة 1: فتح Supabase Storage

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. اذهب إلى **Storage** من القائمة الجانبية (أيقونة الملفات/المجلدات)

### الخطوة 2: إنشاء Bucket جديد

1. إذا رأيت رسالة "No buckets yet" أو قائمة فارغة، اضغط **New bucket**
2. إذا كان لديك buckets موجودة، اضغط **New bucket** في أعلى الصفحة
3. في النافذة المنبثقة، أدخل:
   - **Name:** `gallery` (يجب أن يكون بالضبط هذا الاسم، بدون مسافات أو أحرف كبيرة)
   - **Public bucket:** ✅ **فعّل هذا الخيار** (مهم جداً!)
   - **File size limit:** (اختياري) يمكنك ترك القيمة الافتراضية أو تحديد حد أقصى مثل `10MB`
   - **Allowed MIME types:** (اختياري) يمكنك تحديد `image/*` للسماح بجميع أنواع الصور
4. اضغط **Create bucket**

**⚠️ مهم:** 
- تأكد من أن الاسم هو `gallery` بالضبط (بدون مسافات أو أحرف كبيرة)
- تأكد من تفعيل **Public bucket** (Toggle يجب أن يكون ON/أزرق)

### الخطوة 3: إعداد Row Level Security (RLS) Policies

بعد إنشاء bucket، يجب إضافة Policies للسماح بالقراءة والكتابة:

#### الطريقة 1: من خلال واجهة Supabase (الأسهل)

1. بعد إنشاء bucket، اضغط على **gallery** bucket
2. اذهب إلى **Policies** tab (في القائمة الجانبية أو أعلى الصفحة)
3. اضغط **New Policy**

##### Policy 1: للقراءة (SELECT)

- **Policy name**: `Allow public read access to gallery`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**: 
  ```sql
  (bucket_id = 'gallery')
  ```
- اضغط **Review** ثم **Save policy**

##### Policy 2: للرفع (INSERT)

- **Policy name**: `Allow authenticated users to upload to gallery`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **Policy definition**: 
  ```sql
  (bucket_id = 'gallery')
  ```
- اضغط **Review** ثم **Save policy**

##### Policy 3: للتحديث (UPDATE)

- **Policy name**: `Allow authenticated users to update gallery`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **Policy definition**: 
  ```sql
  (bucket_id = 'gallery')
  ```
- اضغط **Review** ثم **Save policy**

##### Policy 4: للحذف (DELETE)

- **Policy name**: `Allow authenticated users to delete from gallery`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **Policy definition**: 
  ```sql
  (bucket_id = 'gallery')
  ```
- اضغط **Review** ثم **Save policy**

#### الطريقة 2: من SQL Editor (الأسرع)

افتح Supabase Dashboard → **SQL Editor** والصق الكود التالي:

```sql
-- التحقق من أن bucket موجود و public
SELECT name, public 
FROM storage.buckets 
WHERE name = 'gallery';

-- إذا كان bucket غير موجود، أنشئه (يجب أن يكون public = true)
-- ملاحظة: عادة ما يتم إنشاء bucket من الواجهة، لكن يمكنك التحقق هنا

-- إنشاء Policies للقراءة العامة
CREATE POLICY "Allow public read access to gallery"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'gallery');

-- إنشاء Policy للرفع للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to upload to gallery"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery');

-- إنشاء Policy للتحديث للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to update gallery"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery')
WITH CHECK (bucket_id = 'gallery');

-- إنشاء Policy للحذف للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to delete from gallery"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'gallery');
```

### الخطوة 4: التحقق من الإعداد

بعد إنشاء bucket وإضافة Policies:

1. **تحقق من أن bucket موجود:**
   - في صفحة Storage، يجب أن ترى bucket اسمه `gallery`
   - يجب أن يكون **Public** (يظهر بجانبه أيقونة عامة)

2. **تحقق من Policies:**
   - اضغط على bucket `gallery`
   - اذهب إلى **Policies** tab
   - يجب أن ترى 4 policies على الأقل (SELECT, INSERT, UPDATE, DELETE)

3. **اختبر الرفع:**
   - في صفحة Storage → `gallery` bucket
   - اضغط **Upload files**
   - ارفع صورة تجريبية
   - يجب أن تعمل بدون أخطاء

### الخطوة 5: اختبار من التطبيق

بعد إتمام جميع الخطوات:

1. أعد تحميل صفحة "Gestion des Images de Galerie"
2. اضغط **+ Ajouter une Image**
3. اختر فئة وصورة
4. اضغط **Créer**
5. يجب أن تعمل العملية بنجاح

## استكشاف الأخطاء

### المشكلة: "Bucket not found"

**الحل:**
- تأكد من أن bucket اسمه `gallery` موجود (بدون مسافات أو أحرف كبيرة)
- تأكد من أنك في المشروع الصحيح في Supabase Dashboard

### المشكلة: خطأ 403 (Forbidden) عند الرفع

**الحل:**
- تأكد من أن bucket `gallery` هو **Public**
- تأكد من وجود Policy للـ INSERT للمستخدمين المسجلين
- تأكد من أنك مسجل الدخول في التطبيق

### المشكلة: خطأ 404 عند تحميل الصورة

**الحل:**
- تأكد من وجود Policy للـ SELECT للـ `public` role
- تأكد من أن الملف موجود في bucket
- تأكد من أن المسار في قاعدة البيانات صحيح

### المشكلة: لا يمكن حذف الملفات

**الحل:**
- تأكد من وجود Policy للـ DELETE للمستخدمين المسجلين

## ملاحظات مهمة

1. **Bucket name**: يجب أن يكون `gallery` بالضبط (حساس لحالة الأحرف)
2. **Public bucket**: يجب تفعيله للسماح بالوصول العام للصور
3. **Policies**: يجب إضافة policies للقراءة والكتابة والحذف
4. **File location**: الملفات يجب أن تكون في root (الجذر) من bucket، وليس في مجلد فرعي

## التحقق النهائي

بعد إتمام جميع الخطوات، جرب:

1. رفع صورة جديدة من لوحة التحكم
2. عرض الصورة في المعرض
3. حذف صورة (اختياري)

إذا عملت جميع هذه العمليات بنجاح، فالإعداد صحيح! ✅


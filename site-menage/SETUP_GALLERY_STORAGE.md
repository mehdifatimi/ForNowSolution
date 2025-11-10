# إعداد Supabase Storage لصور المعرض (Gallery)

## المشكلة
الصور لا تظهر في قسم `home-hero` على الصفحة الرئيسية.

## الحل خطوة بخطوة

### 1. إنشاء Storage Bucket للصور

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. اذهب إلى **Storage** من القائمة الجانبية
4. اضغط **New bucket**
5. أدخل المعلومات التالية:
   - **Name**: `gallery` (يجب أن يكون بالضبط هذا الاسم)
   - **Public bucket**: ✅ **فعّل هذا الخيار** (مهم جداً!)
   - **File size limit**: (اختياري) يمكنك ترك القيمة الافتراضية أو تحديد حد أقصى مثل `10MB`
   - **Allowed MIME types**: (اختياري) يمكنك تحديد `image/*` للسماح بجميع أنواع الصور
6. اضغط **Create bucket**

### 2. رفع الصور إلى Bucket

بعد إنشاء bucket `gallery`، يجب رفع الصور:

1. في صفحة Storage، اضغط على bucket `gallery`
2. اضغط **Upload files**
3. ارفع الصور التالية (أو أي صور أخرى تريدها):
   - `68efc5b6-3b1b-4187-b657-cae7427634c8.jpeg`
   - `101f1e5b-fb58-4991-89b2-468fc0adca38.jpeg`
   - `8d8c74cd-07b6-4cc4-9be5-347687e50e5f.jpeg`
   - `db507578-e92f-458a-8033-187a8e6cddd5.jpeg`
   - `83d2265a-7069-4a6a-bdd1-e760fa5504d1.jpeg`

**⚠️ مهم:** 
- ارفع الملفات مباشرة في **root** (الجذر) من bucket `gallery`
- **لا** تضعها في مجلد فرعي مثل `gallery/gallery/`
- أسماء الملفات يجب أن تطابق ما هو موجود في قاعدة البيانات (`image_path`)

### 3. إعداد Row Level Security (RLS) Policies

#### الطريقة 1: من واجهة Supabase (الأسهل)

1. في صفحة Storage → `gallery` bucket
2. اضغط على **Policies** tab
3. اضغط **New Policy**
4. أضف Policy للقراءة (SELECT):
   - **Policy name**: `Allow public read access to gallery`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `public`
   - **Policy definition**: 
     ```sql
     (bucket_id = 'gallery')
     ```
   - اضغط **Review** ثم **Save policy**

#### الطريقة 2: من SQL Editor

```sql
-- التحقق من أن bucket موجود و public
SELECT name, public 
FROM storage.buckets 
WHERE name = 'gallery';

-- إذا كان public = false، قم بتفعيله:
UPDATE storage.buckets 
SET public = true 
WHERE name = 'gallery';

-- إنشاء Policy للقراءة العامة
CREATE POLICY "Allow public read access to gallery"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'gallery');
```

### 4. التحقق من البيانات في قاعدة البيانات

تأكد من أن البيانات في جدول `gallery` صحيحة:

```sql
-- عرض جميع الصور في المعرض
SELECT 
  id,
  category_gallery_id,
  image_path,
  is_active,
  created_at
FROM gallery
WHERE is_active = true
ORDER BY created_at DESC;
```

يجب أن تكون `image_path` مثل:
- `gallery/68efc5b6-3b1b-4187-b657-cae7427634c8.jpeg`
- `gallery/101f1e5b-fb58-4991-89b2-468fc0adca38.jpeg`
- إلخ...

### 5. اختبار URL

بعد رفع الصور، جرب فتح هذه URLs في المتصفح:

```
https://xcsfqzeyooncpqbcqihm.supabase.co/storage/v1/object/public/gallery/68efc5b6-3b1b-4187-b657-cae7427634c8.jpeg
https://xcsfqzeyooncpqbcqihm.supabase.co/storage/v1/object/public/gallery/101f1e5b-fb58-4991-89b2-468fc0adca38.jpeg
```

- إذا ظهرت الصورة: ✅ الملف موجود ويعمل
- إذا ظهر خطأ 404: ❌ الملف غير موجود - يجب رفعه
- إذا ظهر خطأ 403: ❌ Bucket غير public أو Policy غير موجودة

### 6. استكشاف الأخطاء

#### المشكلة: الصور لا تظهر

1. **افتح Console في المتصفح** (F12 → Console)
2. ابحث عن رسائل تبدأ بـ `[Home]`
3. تحقق من:
   - هل يتم تحميل البيانات من Supabase؟
   - هل يتم إنشاء URLs بشكل صحيح؟
   - هل تظهر أخطاء عند تحميل الصور؟

#### المشكلة: خطأ "Bucket not found"

- تأكد من أن bucket `gallery` موجود
- تأكد من أن الاسم هو `gallery` بالضبط (بدون مسافات أو أحرف كبيرة)

#### المشكلة: خطأ 404 عند تحميل الصورة

- تأكد من أن الملف موجود في bucket `gallery`
- تأكد من أن اسم الملف يطابق `image_path` في قاعدة البيانات
- تأكد من أن الملف في root (الجذر) وليس في مجلد فرعي

#### المشكلة: خطأ 403 (Forbidden)

- تأكد من أن bucket `gallery` هو public
- تأكد من وجود RLS Policy للقراءة

### 7. التحقق النهائي

بعد إتمام جميع الخطوات:

1. أعد تحميل الصفحة الرئيسية
2. يجب أن تظهر الصور في قسم `home-hero`
3. يجب أن تتغير الصور عند النقر على الأزرار المختلفة
4. افتح Console وتحقق من عدم وجود أخطاء

## ملاحظات مهمة

- **Bucket name**: يجب أن يكون `gallery` بالضبط
- **File location**: الملفات يجب أن تكون في root (الجذر) من bucket
- **File names**: يجب أن تطابق `image_path` في قاعدة البيانات (بدون `gallery/` في البداية)
- **Public bucket**: يجب تفعيله للسماح بالوصول العام


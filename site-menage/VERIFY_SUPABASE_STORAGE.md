# دليل التحقق من إعدادات Supabase Storage

## المشكلة
الصور لا تظهر في السلة وتظهر رسالة خطأ `400 (Bad Request)` عند محاولة تحميل الصورة.

## الخطوات للتحقق والإصلاح

### 1. التحقق من أن Bucket `products` Public

#### الطريقة 1: من Dashboard
1. افتح [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. اذهب إلى **Storage** من القائمة الجانبية
4. ابحث عن bucket اسمه `products`
5. اضغط على Bucket `products`
6. تأكد من أن **Public bucket** مفعّل (Toggle يجب أن يكون ON/أزرق)

#### الطريقة 2: من SQL Editor
```sql
-- التحقق من حالة Bucket
SELECT name, public 
FROM storage.buckets 
WHERE name = 'products';

-- إذا كان public = false، قم بتفعيله:
UPDATE storage.buckets 
SET public = true 
WHERE name = 'products';
```

---

### 2. التحقق من RLS Policies للقراءة

#### الطريقة 1: من Dashboard
1. في صفحة Storage → `products` bucket
2. اضغط على **Policies** tab
3. تأكد من وجود Policy للقراءة (SELECT) للـ `public` role
4. إذا لم تكن موجودة، اضغط **New Policy** وأنشئ:

**Policy Name:** `Allow public read access`
**Allowed Operation:** `SELECT`
**Target Roles:** `public`
**Policy Definition:**
```sql
true
```

#### الطريقة 2: من SQL Editor
```sql
-- التحقق من Policies الموجودة
SELECT * 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%products%';

-- إنشاء Policy للقراءة العامة (إذا لم تكن موجودة)
CREATE POLICY "Allow public read access on products"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'products');
```

---

### 3. التحقق من وجود الملف في المكان الصحيح

#### ⚠️ مهم جداً: الموقع الصحيح للملفات

**الملفات يجب أن تكون في root bucket `products` وليس في مجلد `products/` داخل bucket!**

**المسار الصحيح:**
- ✅ **صحيح:** الملف في root bucket → `product_1762594207300_yr6mmj.jpg`
- ❌ **خطأ:** الملف في مجلد `products/` → `products/product_1762594207300_yr6mmj.jpg`

#### الطريقة 1: من Dashboard
1. افتح Supabase Dashboard → Storage → `products` bucket
2. **تأكد من أنك في root (الجذر)** - يجب أن ترى الملفات مباشرة بدون مجلدات
3. ابحث عن الملفات التالية:
   - `product_1762594207300_yr6mmj.jpg`
   - `product_1762594259837_jb5i9a.jpg`
   - `product_1762594325529_q2oacl.jpg`
   - `product_1762596881833_cr1nwi.jpg`
   - `60b67e83-9c48-4644-9635-dc024a6fed72.jpg` (أو أي ملفات أخرى)

4. **إذا كانت الملفات في مجلد `products/`:**
   - اضغط على مجلد `products/`
   - حدد جميع الملفات
   - انقلها إلى root (الجذر) باستخدام Move أو Cut/Paste

#### الطريقة 2: من SQL Editor
```sql
-- عرض جميع الملفات في bucket products (في root فقط)
SELECT name, bucket_id, created_at
FROM storage.objects
WHERE bucket_id = 'products'
AND name NOT LIKE 'products/%'  -- استبعاد الملفات في مجلد products/
ORDER BY created_at DESC
LIMIT 50;

-- البحث عن ملفات معينة
SELECT name, bucket_id, created_at
FROM storage.objects
WHERE bucket_id = 'products'
AND (
  name LIKE '%product_1762594207300_yr6mmj%' OR
  name LIKE '%product_1762594259837_jb5i9a%' OR
  name LIKE '%product_1762594325529_q2oacl%' OR
  name LIKE '%product_1762596881833_cr1nwi%' OR
  name LIKE '%60b67e83-9c48-4644-9635-dc024a6fed72%'
);

-- عرض الملفات في مجلد products/ (إذا كانت موجودة - يجب نقلها)
SELECT name, bucket_id, created_at
FROM storage.objects
WHERE bucket_id = 'products'
AND name LIKE 'products/%'
ORDER BY created_at DESC;
```

---

### 4. رفع الملف إذا لم يكن موجوداً

#### الطريقة 1: من Dashboard
1. في صفحة Storage → `products` bucket
2. **تأكد من أنك في root (الجذر)** - لا تدخل في أي مجلد
3. اضغط **Upload file**
4. اختر الملفات التالية (أو أي ملفات أخرى مفقودة):
   - `60b67e83-9c48-4644-9635-dc024a6fed72.jpg`
   - `f5244b99-6912-40c7-bba0-9b5405aaed50.jpg`
   - أو أي ملفات أخرى من Laravel storage
5. **مهم جداً:** تأكد من رفعه في **root** (الجذر) وليس في مجلد `products/`
   - يجب أن يكون المسار: `product_xxx.jpg` (في root)
   - **لا** يجب أن يكون: `products/product_xxx.jpg` (في مجلد)
6. اضغط **Upload**

#### نقل الملفات من مجلد products/ إلى root
إذا كانت الملفات موجودة في مجلد `products/`:
1. افتح مجلد `products/`
2. حدد جميع الملفات
3. اضغط **Move** أو Cut
4. ارجع إلى root (الجذر)
5. اضغط **Paste** أو Move here

#### الطريقة 2: من الكود (إذا كان الملف موجود في Laravel)
```javascript
// مثال: رفع ملف من Laravel storage إلى Supabase
const uploadToSupabase = async (filePath) => {
  // قراءة الملف من Laravel storage
  const file = await fetch(`http://127.0.0.1:8000/storage/images/products/${filePath}`);
  const blob = await file.blob();
  
  // رفعه إلى Supabase
  const { data, error } = await supabase.storage
    .from('products')
    .upload(filePath, blob, {
      cacheControl: '3600',
      upsert: true
    });
  
  if (error) {
    console.error('Error uploading:', error);
  } else {
    console.log('Uploaded successfully:', data);
  }
};
```

---

### 5. التحقق من URL الصحيح

بعد رفع الملف، يمكنك التحقق من URL الصحيح:

```javascript
// في Console المتصفح (F12)
const { data: { publicUrl } } = supabase.storage
  .from('products')
  .getPublicUrl('60b67e83-9c48-4644-9635-dc024a6fed72.jpg');

console.log('Public URL:', publicUrl);

// جرب فتح URL في المتصفح
// يجب أن تفتح الصورة مباشرة
```

---

### 6. اختبار الوصول إلى الملف

#### من المتصفح
افتح هذا URL في المتصفح (استبدل `YOUR_PROJECT_REF` و `FILENAME`):
```
https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/products/FILENAME.jpg
```

مثال:
```
https://xcsfqzeyooncpqbcqihm.supabase.co/storage/v1/object/public/products/60b67e83-9c48-4644-9635-dc024a6fed72.jpg
```

- إذا ظهرت الصورة: ✅ كل شيء يعمل بشكل صحيح
- إذا ظهر خطأ 400 أو 404: ❌ الملف غير موجود أو Bucket غير public

---

### 7. حل المشاكل الشائعة

#### المشكلة: خطأ 400 (Bad Request)
**السبب:** الملف غير موجود في المسار المحدد
**الحل:**
1. تحقق من وجود الملف في Supabase Storage
2. تحقق من اسم الملف (يجب أن يكون مطابقاً تماماً)
3. تحقق من المسار (root أو products/ folder)

#### المشكلة: خطأ 403 (Forbidden)
**السبب:** Bucket غير public أو RLS policies تمنع الوصول
**الحل:**
1. فعّل "Public bucket" في إعدادات Bucket
2. أضف RLS policy للقراءة العامة

#### المشكلة: خطأ 404 (Not Found)
**السبب:** الملف غير موجود
**الحل:**
1. ارفع الملف إلى Supabase Storage
2. تأكد من رفعه في المكان الصحيح

---

### 8. SQL Script شامل للتحقق والإصلاح

```sql
-- 1. التحقق من Bucket
SELECT name, public, created_at
FROM storage.buckets
WHERE name = 'products';

-- 2. تفعيل Bucket كـ Public (إذا لم يكن)
UPDATE storage.buckets 
SET public = true 
WHERE name = 'products';

-- 3. التحقق من RLS Policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE '%products%';

-- 4. إنشاء Policy للقراءة (إذا لم تكن موجودة)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow public read access on products'
  ) THEN
    CREATE POLICY "Allow public read access on products"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'products');
  END IF;
END $$;

-- 5. عرض الملفات في Bucket (في root فقط)
SELECT 
  name,
  bucket_id,
  created_at,
  updated_at,
  last_accessed_at,
  metadata
FROM storage.objects
WHERE bucket_id = 'products'
AND name NOT LIKE 'products/%'  -- استبعاد الملفات في مجلد products/
ORDER BY created_at DESC
LIMIT 20;

-- 6. التحقق من الملفات المحددة
SELECT 
  name,
  bucket_id,
  created_at,
  CASE 
    WHEN name LIKE 'products/%' THEN '❌ في مجلد products/ (خطأ - يجب نقلها)'
    ELSE '✅ في root (صحيح)'
  END as location_status
FROM storage.objects
WHERE bucket_id = 'products'
AND (
  name LIKE '%product_1762594207300_yr6mmj%' OR
  name LIKE '%product_1762594259837_jb5i9a%' OR
  name LIKE '%product_1762594325529_q2oacl%' OR
  name LIKE '%product_1762596881833_cr1nwi%' OR
  name LIKE '%60b67e83-9c48-4644-9635-dc024a6fed72%' OR
  name LIKE '%f5244b99-6912-40c7-bba0-9b5405aaed50%'
)
ORDER BY created_at DESC;
```

---

### 9. التحقق النهائي

بعد تطبيق جميع الخطوات، افتح Console في المتصفح (F12) وافتح صفحة السلة. يجب أن ترى:

✅ **نجاح:**
```
[CartPage] ✅ Generated URL: https://...
[CartPage] ✅ Image loaded successfully: ...
```

❌ **فشل:**
```
[CartPage] ❌ Image load error: ...
[CartPage] Image fetch response: {status: 400/403/404, ...}
```

---

## ملاحظات مهمة

1. **اسم الملف:** يجب أن يكون مطابقاً تماماً (case-sensitive في بعض الحالات)
2. **المسار:** تأكد من رفع الملف في root bucket وليس في مجلد فرعي
3. **RLS Policies:** يجب أن تكون مفعّلة للسماح بالقراءة العامة
4. **Public Bucket:** يجب أن يكون مفعّلاً للسماح بالوصول العام

---

## الدعم

إذا استمرت المشكلة بعد تطبيق جميع الخطوات:
1. تحقق من Console في المتصفح للحصول على رسائل الخطأ التفصيلية
2. تحقق من Network tab في Developer Tools لرؤية طلبات HTTP
3. تأكد من أن Supabase project نشط وليس في وضع paused


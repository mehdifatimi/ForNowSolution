# حل مشكلة الصور المفقودة (404 Error)

## المشكلة
الكود يحاول تحميل صور بأسماء غير موجودة في Supabase Storage، مما يؤدي إلى خطأ 404.

## الحل: تحديث قاعدة البيانات

### الطريقة 1: استخدام الملفات الموجودة

إذا كانت الملفات موجودة في Supabase Storage بأسماء مختلفة، يمكنك تحديث قاعدة البيانات:

```sql
-- 1. عرض جميع المنتجات مع أسماء الصور الحالية
SELECT 
  id,
  name,
  image,
  CASE 
    WHEN image LIKE '%ecb2bb5d-3bc7-4dac-9026-c178450173d0%' THEN 'مفقود'
    WHEN image LIKE '%60b67e83-9c48-4644-9635-dc024a6fed72%' THEN 'مفقود'
    WHEN image LIKE '%0800e4c0-9b3a-4374-a5b8-13ddfcd7e612%' THEN 'مفقود'
    WHEN image LIKE '%9bb3ba0a-1f3b-4612-81ed-5ee8e9a11263%' THEN 'مفقود'
    WHEN image LIKE '%c0799774-07ac-4405-92f1-59a137bd8a37%' THEN 'مفقود'
    WHEN image LIKE '%f5244b99-6912-40c7-bba0-9b5405aaed50%' THEN 'مفقود'
    ELSE 'موجود'
  END as status
FROM products
WHERE image IS NOT NULL
ORDER BY id;

-- 2. عرض الملفات الموجودة في Supabase Storage
SELECT name, created_at
FROM storage.objects
WHERE bucket_id = 'products'
AND name NOT LIKE 'products/%'
ORDER BY created_at DESC
LIMIT 20;

-- 3. تحديث قاعدة البيانات لاستخدام الملفات الموجودة
-- (يجب أن تقوم بتحديث يدوي لكل منتج بناءً على الملفات الموجودة)

-- مثال: إذا كان المنتج ID=1 يحتاج صورة، وملف product_1762594207300_yr6mmj.jpg موجود
UPDATE products 
SET image = 'https://xcsfqzeyooncpqbcqihm.supabase.co/storage/v1/object/public/products/product_1762594207300_yr6mmj.jpg'
WHERE id = 1 AND image LIKE '%ecb2bb5d-3bc7-4dac-9026-c178450173d0%';
```

### الطريقة 2: رفع الملفات المفقودة

إذا كانت الملفات موجودة في Laravel storage أو على جهازك:

1. ابحث عن الملفات التالية:
   - `ecb2bb5d-3bc7-4dac-9026-c178450173d0.jpg`
   - `60b67e83-9c48-4644-9635-dc024a6fed72.jpg`
   - `0800e4c0-9b3a-4374-a5b8-13ddfcd7e612.jpg`
   - `9bb3ba0a-1f3b-4612-81ed-5ee8e9a11263.jpg`
   - `c0799774-07ac-4405-92f1-59a137bd8a37.jpg`
   - `f5244b99-6912-40c7-bba0-9b5405aaed50.jpg`

2. ارفعها إلى Supabase Storage:
   - Supabase Dashboard → Storage → `products` bucket
   - تأكد من أنك في **root** (الجذر)
   - اضغط **Upload files**
   - اختر الملفات
   - اضغط **Upload**

### الطريقة 3: استخدام صورة افتراضية مؤقتاً

إذا لم تكن الملفات متوفرة، يمكنك استخدام صورة افتراضية:

```sql
-- تحديث جميع المنتجات التي تحتوي على صور مفقودة لاستخدام صورة افتراضية
UPDATE products 
SET image = 'https://xcsfqzeyooncpqbcqihm.supabase.co/storage/v1/object/public/products/product_1762594207300_yr6mmj.jpg'
WHERE image LIKE '%ecb2bb5d-3bc7-4dac-9026-c178450173d0%'
   OR image LIKE '%60b67e83-9c48-4644-9635-dc024a6fed72%'
   OR image LIKE '%0800e4c0-9b3a-4374-a5b8-13ddfcd7e612%'
   OR image LIKE '%9bb3ba0a-1f3b-4612-81ed-5ee8e9a11263%'
   OR image LIKE '%c0799774-07ac-4405-92f1-59a137bd8a37%'
   OR image LIKE '%f5244b99-6912-40c7-bba0-9b5405aaed50%';
```

## التحقق من الملفات الموجودة

```sql
-- عرض جميع الملفات في Supabase Storage
SELECT name, created_at, metadata
FROM storage.objects
WHERE bucket_id = 'products'
AND name NOT LIKE 'products/%'
ORDER BY created_at DESC;
```

## اختبار URL

بعد التحديث، جرب فتح URL في المتصفح:
```
https://xcsfqzeyooncpqbcqihm.supabase.co/storage/v1/object/public/products/[FILENAME]
```

- إذا ظهرت الصورة: ✅ يعمل
- إذا ظهر 404: ❌ الملف غير موجود


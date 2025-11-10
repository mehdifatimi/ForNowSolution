# دليل رفع الصور المفقودة إلى Supabase Storage

## المشكلة
الكود يحاول تحميل صور بأسماء مختلفة عن الملفات الموجودة في Supabase Storage.

## الملفات المطلوبة

### الملفات التي يحاول الكود تحميلها:
1. `ecb2bb5d-3bc7-4dac-9026-c178450173d0.jpg`
2. `60b67e83-9c48-4644-9635-dc024a6fed72.jpg`
3. `0800e4c0-9b3a-4374-a5b8-13ddfcd7e612.jpg`
4. `9bb3ba0a-1f3b-4612-81ed-5ee8e9a11263.jpg`
5. `c0799774-07ac-4405-92f1-59a137bd8a37.jpg`
6. `f5244b99-6912-40c7-bba0-9b5405aaed50.jpg`

### الملفات الموجودة حالياً في Supabase:
- `product_1762594207300_yr6mmj.jpg`
- `product_1762594259837_jb5i9a.jpg`
- `product_1762594325529_q2oacl.jpg`
- `product_1762596881833_cr1nwi.jpg`
- `product_1762597082887_d...`

## الحل: رفع الملفات المفقودة

### الطريقة 1: من Laravel Storage (إذا كان متاحاً)

إذا كانت الملفات موجودة في Laravel storage (`storage/app/public/images/products/`):

1. افتح مجلد Laravel storage:
   ```
   C:\path\to\laravel\storage\app\public\images\products\
   ```

2. ابحث عن الملفات التالية:
   - `ecb2bb5d-3bc7-4dac-9026-c178450173d0.jpg`
   - `60b67e83-9c48-4644-9635-dc024a6fed72.jpg`
   - `0800e4c0-9b3a-4374-a5b8-13ddfcd7e612.jpg`
   - `9bb3ba0a-1f3b-4612-81ed-5ee8e9a11263.jpg`
   - `c0799774-07ac-4405-92f1-59a137bd8a37.jpg`
   - `f5244b99-6912-40c7-bba0-9b5405aaed50.jpg`

3. ارفعها إلى Supabase Storage:
   - افتح Supabase Dashboard → Storage → `products` bucket
   - تأكد من أنك في **root** (الجذر)
   - اضغط **Upload files**
   - اختر الملفات
   - اضغط **Upload**

### الطريقة 2: من Supabase Dashboard مباشرة

1. افتح Supabase Dashboard → Storage → `products` bucket
2. اضغط **Upload files**
3. ارفع الملفات بأسمائها الصحيحة:
   - `ecb2bb5d-3bc7-4dac-9026-c178450173d0.jpg`
   - `60b67e83-9c48-4644-9635-dc024a6fed72.jpg`
   - `0800e4c0-9b3a-4374-a5b8-13ddfcd7e612.jpg`
   - `9bb3ba0a-1f3b-4612-81ed-5ee8e9a11263.jpg`
   - `c0799774-07ac-4405-92f1-59a137bd8a37.jpg`
   - `f5244b99-6912-40c7-bba0-9b5405aaed50.jpg`

### الطريقة 3: استخدام SQL للتحقق من الملفات المطلوبة

```sql
-- عرض جميع المنتجات مع أسماء الصور
SELECT 
  id,
  name,
  image,
  CASE 
    WHEN image LIKE '%ecb2bb5d-3bc7-4dac-9026-c178450173d0%' THEN '✅ موجود'
    WHEN image LIKE '%60b67e83-9c48-4644-9635-dc024a6fed72%' THEN '✅ موجود'
    WHEN image LIKE '%0800e4c0-9b3a-4374-a5b8-13ddfcd7e612%' THEN '✅ موجود'
    WHEN image LIKE '%9bb3ba0a-1f3b-4612-81ed-5ee8e9a11263%' THEN '✅ موجود'
    WHEN image LIKE '%c0799774-07ac-4405-92f1-59a137bd8a37%' THEN '✅ موجود'
    WHEN image LIKE '%f5244b99-6912-40c7-bba0-9b5405aaed50%' THEN '✅ موجود'
    ELSE '❌ مفقود'
  END as image_status
FROM products
WHERE image IS NOT NULL
ORDER BY id;
```

## التحقق من الملفات بعد الرفع

بعد رفع الملفات، تحقق من وجودها:

```sql
-- التحقق من وجود الملفات في Supabase Storage
SELECT name, created_at
FROM storage.objects
WHERE bucket_id = 'products'
AND (
  name LIKE '%ecb2bb5d-3bc7-4dac-9026-c178450173d0%' OR
  name LIKE '%60b67e83-9c48-4644-9635-dc024a6fed72%' OR
  name LIKE '%0800e4c0-9b3a-4374-a5b8-13ddfcd7e612%' OR
  name LIKE '%9bb3ba0a-1f3b-4612-81ed-5ee8e9a11263%' OR
  name LIKE '%c0799774-07ac-4405-92f1-59a137bd8a37%' OR
  name LIKE '%f5244b99-6912-40c7-bba0-9b5405aaed50%'
)
ORDER BY created_at DESC;
```

## اختبار URL بعد الرفع

بعد رفع الملفات، جرب فتح هذه URLs في المتصفح:

1. `https://xcsfqzeyooncpqbcqihm.supabase.co/storage/v1/object/public/products/ecb2bb5d-3bc7-4dac-9026-c178450173d0.jpg`
2. `https://xcsfqzeyooncpqbcqihm.supabase.co/storage/v1/object/public/products/60b67e83-9c48-4644-9635-dc024a6fed72.jpg`
3. `https://xcsfqzeyooncpqbcqihm.supabase.co/storage/v1/object/public/products/0800e4c0-9b3a-4374-a5b8-13ddfcd7e612.jpg`
4. `https://xcsfqzeyooncpqbcqihm.supabase.co/storage/v1/object/public/products/9bb3ba0a-1f3b-4612-81ed-5ee8e9a11263.jpg`
5. `https://xcsfqzeyooncpqbcqihm.supabase.co/storage/v1/object/public/products/c0799774-07ac-4405-92f1-59a137bd8a37.jpg`
6. `https://xcsfqzeyooncpqbcqihm.supabase.co/storage/v1/object/public/products/f5244b99-6912-40c7-bba0-9b5405aaed50.jpg`

- إذا ظهرت الصورة: ✅ الملف موجود ويعمل
- إذا ظهر خطأ 400/404: ❌ الملف غير موجود - يجب رفعه

## ملاحظة مهمة

إذا لم تكن الملفات موجودة في Laravel storage، يمكنك:
1. استخدام الصور الموجودة (`product_xxx.jpg`) كبديل مؤقت
2. أو تحديث قاعدة البيانات لتشير إلى الملفات الموجودة
3. أو رفع صور جديدة بنفس الأسماء المطلوبة


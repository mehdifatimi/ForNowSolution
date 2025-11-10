# إصلاح خطأ 400 عند رفع الصور إلى Gallery Bucket

## المشكلة
```
POST https://xcsfqzeyooncpqbcqihm.supabase.co/storage/v1/object/gallery/gallery_xxx.jpg 400 (Bad Request)
Error: Bucket "gallery" غير موجود
```

## الأسباب المحتملة

1. **Bucket غير موجود** - يجب إنشاء bucket `gallery`
2. **Bucket موجود لكن ليس public** - يجب تفعيل Public bucket
3. **RLS Policies غير موجودة** - يجب إضافة policies للـ INSERT
4. **المستخدم غير مسجل دخول** - يجب تسجيل الدخول

## الحل خطوة بخطوة

### الخطوة 1: التحقق من وجود Bucket

افتح Supabase Dashboard → **SQL Editor** والصق:

```sql
-- التحقق من وجود bucket "gallery"
SELECT name, public, created_at
FROM storage.buckets
WHERE name = 'gallery';
```

**إذا لم يكن موجوداً:**
1. اذهب إلى **Storage** → **New bucket**
2. Name: `gallery`
3. Public bucket: ✅ **فعّل**
4. اضغط **Create bucket**

### الخطوة 2: تفعيل Bucket كـ Public

```sql
-- تفعيل bucket كـ public
UPDATE storage.buckets 
SET public = true 
WHERE name = 'gallery';
```

أو من Dashboard:
1. Storage → `gallery` bucket
2. تأكد من أن **Public bucket** مفعّل (Toggle ON)

### الخطوة 3: إضافة RLS Policies

افتح Supabase Dashboard → **SQL Editor** والصق:

```sql
-- حذف Policies القديمة إذا كانت موجودة (اختياري)
DROP POLICY IF EXISTS "Allow public read access to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete from gallery" ON storage.objects;

-- Policy 1: القراءة للجميع
CREATE POLICY "Allow public read access to gallery"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'gallery');

-- Policy 2: الرفع للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to upload to gallery"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery');

-- Policy 3: التحديث للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to update gallery"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery')
WITH CHECK (bucket_id = 'gallery');

-- Policy 4: الحذف للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to delete from gallery"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'gallery');
```

### الخطوة 4: التحقق من Policies

```sql
-- عرض جميع Policies لـ gallery bucket
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%gallery%';
```

يجب أن ترى 4 policies على الأقل.

### الخطوة 5: التحقق من تسجيل الدخول

تأكد من أنك مسجل دخول في التطبيق:
1. افتح Console (F12)
2. اكتب: `localStorage.getItem('supabase.auth.token')`
3. يجب أن يكون هناك token

## الحل السريع (كل شيء في مرة واحدة) - النسخة الآمنة

افتح Supabase Dashboard → **SQL Editor** والصق:

```sql
-- 1. التحقق من Bucket
SELECT name, public FROM storage.buckets WHERE name = 'gallery';

-- 2. تفعيل Bucket كـ Public
UPDATE storage.buckets 
SET public = true 
WHERE name = 'gallery';

-- 3. إنشاء Policies (آمن - يتحقق من الوجود أولاً)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow public read access to gallery'
  ) THEN
    CREATE POLICY "Allow public read access to gallery"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'gallery');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload to gallery'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload to gallery"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'gallery');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update gallery'
  ) THEN
    CREATE POLICY "Allow authenticated users to update gallery"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'gallery') WITH CHECK (bucket_id = 'gallery');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete from gallery'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete from gallery"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'gallery');
  END IF;
END $$;
```

**✅ هذا الكود آمن تماماً:** يتحقق من وجود Policy قبل إنشائها، ولن يظهر أي تحذير أو خطأ.

### أو استخدم النسخة مع الحذف (إذا كنت متأكداً):

إذا كنت تريد حذف Policies القديمة أولاً (قد يظهر تحذير):

```sql
-- حذف Policies القديمة (اختياري - قد يظهر تحذير)
DROP POLICY IF EXISTS "Allow public read access to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete from gallery" ON storage.objects;

-- ثم إنشاء Policies جديدة
CREATE POLICY "Allow public read access to gallery"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'gallery');

CREATE POLICY "Allow authenticated users to upload to gallery"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Allow authenticated users to update gallery"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'gallery') WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Allow authenticated users to delete from gallery"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'gallery');
```

## اختبار

بعد إتمام جميع الخطوات:

1. أعد تحميل صفحة "Gestion des Images de Galerie"
2. اضغط **+ Ajouter une Image**
3. اختر فئة وصورة
4. اضغط **Créer**
5. يجب أن تعمل العملية بنجاح ✅

## استكشاف الأخطاء

### خطأ 400 (Bad Request)
**الأسباب:**
- Bucket غير موجود
- Bucket موجود لكن ليس public
- RLS policies غير موجودة أو غير صحيحة
- المستخدم غير مسجل دخول

**الحل:**
1. تأكد من وجود bucket `gallery` و public
2. أضف RLS policies كما هو موضح أعلاه
3. تأكد من تسجيل الدخول

### خطأ 403 (Forbidden)
**السبب:** لا توجد صلاحيات للرفع
**الحل:** أضف Policy للـ INSERT للمستخدمين المسجلين

### خطأ 404 (Not Found)
**السبب:** Bucket غير موجود
**الحل:** أنشئ bucket `gallery` من Dashboard

## ملاحظات مهمة

1. **Bucket name**: يجب أن يكون `gallery` بالضبط (حساس لحالة الأحرف)
2. **Public bucket**: يجب تفعيله
3. **RLS Policies**: يجب إضافة policies للقراءة والكتابة والحذف
4. **Authentication**: يجب أن يكون المستخدم مسجل دخول للرفع


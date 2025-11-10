# حل سريع: إنشاء Bucket "gallery"

## المشكلة
```
Error: Bucket "gallery" غير موجود (404)
```

## الحل السريع (3 خطوات فقط)

### الخطوة 1: إنشاء Bucket

1. افتح [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. اذهب إلى **Storage** من القائمة الجانبية
4. اضغط **New bucket** (أو **Create bucket**)
5. أدخل:
   - **Name:** `gallery` (بالضبط، بدون مسافات أو أحرف كبيرة)
   - **Public bucket:** ✅ **فعّل هذا الخيار** (مهم جداً!)
6. اضغط **Create bucket**

### الخطوة 2: إضافة RLS Policies

افتح **SQL Editor** والصق:

```sql
-- تفعيل bucket كـ public
UPDATE storage.buckets 
SET public = true 
WHERE name = 'gallery';

-- إنشاء Policies (آمن - يتحقق من الوجود أولاً)
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

### الخطوة 3: التحقق

بعد إنشاء bucket وإضافة policies:

1. أعد تحميل صفحة "Gestion des Images de Galerie"
2. اضغط **+ Ajouter une Image**
3. اختر فئة وصورة
4. اضغط **Créer**
5. يجب أن تعمل العملية بنجاح ✅

## التحقق من Bucket

```sql
-- التحقق من وجود bucket
SELECT name, public, created_at
FROM storage.buckets
WHERE name = 'gallery';
```

يجب أن ترى:
- `name = 'gallery'`
- `public = true`

## التحقق من Policies

```sql
-- التحقق من Policies
SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%gallery%';
```

يجب أن ترى 4 policies على الأقل.

## ملاحظات مهمة

1. **Bucket name**: يجب أن يكون `gallery` بالضبط (حساس لحالة الأحرف)
2. **Public bucket**: يجب تفعيله
3. **RLS Policies**: يجب إضافة policies للقراءة والكتابة والحذف
4. **Authentication**: يجب أن تكون مسجل دخول للرفع


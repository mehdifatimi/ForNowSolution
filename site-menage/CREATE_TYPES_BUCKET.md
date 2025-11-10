# إنشاء Bucket `types` في Supabase Storage

## المشكلة
Bucket `types` غير موجود، مما يسبب خطأ `Bucket not found` عند محاولة رفع الصور.

## الحل السريع

### الطريقة 1: استخدام SQL Script (موصى به)

قم بتشغيل ملف `COMPLETE_RLS_AND_STORAGE_SETUP.sql` في Supabase SQL Editor. هذا الملف سينشئ bucket `types` تلقائياً مع جميع RLS policies المطلوبة.

### الطريقة 2: إنشاء يدوي من Dashboard

1. افتح Supabase Dashboard
2. اذهب إلى **Storage** → **Buckets**
3. اضغط على **New bucket**
4. أدخل:
   - **Name**: `types`
   - **Public bucket**: ✅ (مفعل)
   - **File size limit**: `52428800` (50 MB)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/jpg`
5. اضغط **Create bucket**

### الطريقة 3: SQL مباشر

قم بتشغيل هذا SQL في Supabase SQL Editor:

```sql
-- إنشاء bucket types
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('types', 'types', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- RLS Policies لـ types bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow public read access to types'
  ) THEN
    CREATE POLICY "Allow public read access to types"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'types');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload to types'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload to types"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'types');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update types'
  ) THEN
    CREATE POLICY "Allow authenticated users to update types"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'types') WITH CHECK (bucket_id = 'types');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete from types'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete from types"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'types');
  END IF;
END $$;
```

## التحقق

بعد إنشاء bucket، تحقق من وجوده:

```sql
SELECT id, name, public, created_at
FROM storage.buckets
WHERE name = 'types';
```

يجب أن ترى النتيجة:
```
id    | name  | public | created_at
types | types | true   | [timestamp]
```

## ملاحظات

- الصور القديمة التي تحتوي على مسارات Laravel (`127.0.0.1:8000`, `localhost:8000`) سيتم تجاهلها تلقائياً
- الصور التي تحتوي على أسماء ملفات فقط (مثل `f889a860-c3b8-44bd-bb17-0ccdbac769f2.jpeg`) سيتم البحث عنها في bucket `types`
- يجب رفع الصور القديمة يدوياً إلى bucket `types` إذا كانت موجودة في Laravel storage


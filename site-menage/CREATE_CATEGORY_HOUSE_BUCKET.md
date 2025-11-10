# إنشاء Bucket `category_house` في Supabase Storage

## المشكلة
Bucket `category_house` غير موجود، مما يسبب خطأ `Bucket not found` عند محاولة رفع الصور.

## الحل السريع

### الطريقة 1: استخدام SQL Script (موصى به)

قم بتشغيل ملف `COMPLETE_RLS_AND_STORAGE_SETUP.sql` في Supabase SQL Editor. هذا الملف سينشئ bucket `category_house` تلقائياً مع جميع RLS policies المطلوبة.

### الطريقة 2: إنشاء يدوي من Dashboard

1. افتح Supabase Dashboard
2. اذهب إلى **Storage** → **Buckets**
3. اضغط على **New bucket**
4. أدخل:
   - **Name**: `category_house`
   - **Public bucket**: ✅ (مفعل)
   - **File size limit**: `52428800` (50 MB)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/jpg`
5. اضغط **Create bucket**

### الطريقة 3: SQL مباشر

قم بتشغيل هذا SQL في Supabase SQL Editor:

```sql
-- إنشاء bucket category_house
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('category_house', 'category_house', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- RLS Policies لـ category_house bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow public read access to category_house'
  ) THEN
    CREATE POLICY "Allow public read access to category_house"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'category_house');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload to category_house'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload to category_house"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'category_house');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update category_house'
  ) THEN
    CREATE POLICY "Allow authenticated users to update category_house"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'category_house') WITH CHECK (bucket_id = 'category_house');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete from category_house'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete from category_house"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'category_house');
  END IF;
END $$;
```

## التحقق

بعد إنشاء bucket، تحقق من وجوده:

```sql
SELECT id, name, public, created_at
FROM storage.buckets
WHERE name = 'category_house';
```

يجب أن ترى النتيجة:
```
id              | name            | public | created_at
category_house  | category_house  | true   | [timestamp]
```

## ملاحظات

- الصور القديمة التي تحتوي على مسارات Laravel (`127.0.0.1:8000`, `localhost:8000`) سيتم تجاهلها تلقائياً
- الصور التي تحتوي على أسماء ملفات فقط (مثل `7d728672-85cc-4457-a57f-29114e12a3ca.jpeg`) سيتم البحث عنها في bucket `category_house`
- يجب رفع الصور القديمة يدوياً إلى bucket `category_house` إذا كانت موجودة في Laravel storage


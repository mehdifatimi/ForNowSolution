-- إصلاح RLS Policies لـ employees storage bucket
-- قم بتشغيل هذا الملف في Supabase SQL Editor

-- 1. التأكد من أن bucket employees موجود و public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('employees', 'employees', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. RLS Policies لـ employees bucket
-- Policy للقراءة (SELECT)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow public read access to employees'
  ) THEN
    CREATE POLICY "Allow public read access to employees"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'employees');
  END IF;
END $$;

-- Policy للرفع (INSERT) - مهم جداً!
-- السماح للمستخدمين المسجلين في Supabase Auth
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload to employees'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload to employees"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'employees');
  END IF;
END $$;

-- Policy للرفع للـ public (للمستخدمين غير المسجلين في Supabase Auth)
-- هذا يسمح للـ Admin (الذي يستخدم adminToken) برفع الصور
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow public uploads to employees'
  ) THEN
    CREATE POLICY "Allow public uploads to employees"
    ON storage.objects FOR INSERT TO public
    WITH CHECK (bucket_id = 'employees');
  END IF;
END $$;

-- Policy للتحديث (UPDATE)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update employees'
  ) THEN
    CREATE POLICY "Allow authenticated users to update employees"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'employees') WITH CHECK (bucket_id = 'employees');
  END IF;
END $$;

-- Policy للحذف (DELETE)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete from employees'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete from employees"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'employees');
  END IF;
END $$;

-- التحقق من Policies
SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%employees%';


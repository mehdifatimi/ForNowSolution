-- ============================================
-- إضافة سياسات Row Level Security (RLS) لـ Gallery Storage
-- ============================================
-- 
-- هذا الملف يضيف السياسات المطلوبة للسماح بـ:
-- - قراءة الصور للجميع (SELECT)
-- - رفع/تحديث/حذف الصور للمستخدمين المسجلين (INSERT/UPDATE/DELETE)
--
-- الاستخدام:
-- 1. افتح Supabase Dashboard → SQL Editor
-- 2. الصق هذا الكود
-- 3. اضغط Run
-- ============================================

-- ============================================
-- الخطوة 1: التحقق من Bucket
-- ============================================
SELECT name, public, created_at
FROM storage.buckets
WHERE name = 'gallery';

-- ============================================
-- الخطوة 2: تفعيل Bucket كـ Public
-- ============================================
UPDATE storage.buckets 
SET public = true 
WHERE name = 'gallery';

-- ============================================
-- الخطوة 3: إنشاء Policies (آمن - يتحقق من الوجود أولاً)
-- ============================================
-- ملاحظة: إذا كانت Policies موجودة بالفعل، سيتم تخطيها

-- Policy 1: القراءة للجميع
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow public read access to gallery'
  ) THEN
    CREATE POLICY "Allow public read access to gallery"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'gallery');
  END IF;
END $$;

-- Policy 2: الرفع للمستخدمين المسجلين
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload to gallery'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload to gallery"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'gallery');
  END IF;
END $$;

-- Policy 3: التحديث للمستخدمين المسجلين
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update gallery'
  ) THEN
    CREATE POLICY "Allow authenticated users to update gallery"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'gallery')
    WITH CHECK (bucket_id = 'gallery');
  END IF;
END $$;

-- Policy 4: الحذف للمستخدمين المسجلين
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete from gallery'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete from gallery"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'gallery');
  END IF;
END $$;

-- ============================================
-- التحقق من Policies
-- ============================================
SELECT 
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%gallery%'
ORDER BY policyname;


-- إضافة RLS Policies لجدول gallery
-- قم بتشغيل هذا الملف في Supabase SQL Editor

-- 1. تفعيل RLS على جدول gallery
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- 2. إنشاء Policies (آمن - يتحقق من الوجود أولاً)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'gallery' 
    AND policyname = 'Allow public read access to gallery'
  ) THEN
    CREATE POLICY "Allow public read access to gallery"
    ON gallery FOR SELECT TO public, authenticated
    USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'gallery' 
    AND policyname = 'Allow authenticated users to insert gallery'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert gallery"
    ON gallery FOR INSERT TO authenticated
    WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'gallery' 
    AND policyname = 'Allow authenticated users to update gallery'
  ) THEN
    CREATE POLICY "Allow authenticated users to update gallery"
    ON gallery FOR UPDATE TO authenticated
    USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'gallery' 
    AND policyname = 'Allow authenticated users to delete gallery'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete gallery"
    ON gallery FOR DELETE TO authenticated
    USING (true);
  END IF;
END $$;

-- 3. التحقق من Policies
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'gallery'
ORDER BY policyname;


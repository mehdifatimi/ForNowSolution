-- ============================================
-- إضافة RLS Policies لجدول hand_worker_categories
-- ============================================
-- قم بتشغيل هذا الملف في Supabase SQL Editor
-- ============================================

-- تفعيل RLS
ALTER TABLE hand_worker_categories ENABLE ROW LEVEL SECURITY;

-- حذف Policies القديمة إن وجدت
DROP POLICY IF EXISTS "Allow public read access to hand_worker_categories" ON hand_worker_categories;
DROP POLICY IF EXISTS "Allow authenticated users to insert hand_worker_categories" ON hand_worker_categories;
DROP POLICY IF EXISTS "Allow authenticated users to update hand_worker_categories" ON hand_worker_categories;
DROP POLICY IF EXISTS "Allow authenticated users to delete hand_worker_categories" ON hand_worker_categories;

-- RLS Policies
CREATE POLICY "Allow public read access to hand_worker_categories"
ON hand_worker_categories FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert hand_worker_categories"
ON hand_worker_categories FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update hand_worker_categories"
ON hand_worker_categories FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete hand_worker_categories"
ON hand_worker_categories FOR DELETE TO authenticated
USING (true);

-- التحقق من Policies
SELECT 
  'RLS Policies for hand_worker_categories' as info,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'hand_worker_categories';


-- ============================================
-- إضافة RLS Policies لجدول hand_workers
-- ============================================
-- قم بتشغيل هذا الملف في Supabase SQL Editor
-- ============================================

-- تفعيل RLS
ALTER TABLE hand_workers ENABLE ROW LEVEL SECURITY;

-- حذف Policies القديمة إن وجدت
DROP POLICY IF EXISTS "Allow public read access to hand_workers" ON hand_workers;
DROP POLICY IF EXISTS "Allow authenticated users to insert hand_workers" ON hand_workers;
DROP POLICY IF EXISTS "Allow authenticated users to update hand_workers" ON hand_workers;
DROP POLICY IF EXISTS "Allow authenticated users to delete hand_workers" ON hand_workers;

-- RLS Policies
CREATE POLICY "Allow public read access to hand_workers"
ON hand_workers FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert hand_workers"
ON hand_workers FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update hand_workers"
ON hand_workers FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete hand_workers"
ON hand_workers FOR DELETE TO authenticated
USING (true);

-- التحقق من Policies
SELECT 
  'RLS Policies for hand_workers' as info,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'hand_workers';


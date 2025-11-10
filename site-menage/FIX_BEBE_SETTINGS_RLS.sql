-- ============================================
-- إصلاح RLS Policies لجدول bebe_settings
-- ============================================
-- قم بتشغيل هذا الملف في Supabase SQL Editor
-- ============================================

-- تفعيل RLS على bebe_settings
ALTER TABLE bebe_settings ENABLE ROW LEVEL SECURITY;

-- حذف Policies القديمة إن وجدت
DROP POLICY IF EXISTS "Allow public read access to bebe_settings" ON bebe_settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert bebe_settings" ON bebe_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update bebe_settings" ON bebe_settings;
DROP POLICY IF EXISTS "Allow authenticated users to delete bebe_settings" ON bebe_settings;

-- إنشاء Policies جديدة
CREATE POLICY "Allow public read access to bebe_settings"
ON bebe_settings FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert bebe_settings"
ON bebe_settings FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update bebe_settings"
ON bebe_settings FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete bebe_settings"
ON bebe_settings FOR DELETE TO authenticated
USING (true);

-- التحقق من Policies
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'bebe_settings'
ORDER BY cmd;


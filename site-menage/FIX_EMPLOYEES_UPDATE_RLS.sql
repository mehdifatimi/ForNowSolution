-- ============================================
-- إصلاح RLS Policy للتحديث في جدول employees
-- ============================================
-- قم بتشغيل هذا الملف في Supabase SQL Editor
-- ============================================

-- حذف Policy التحديث القديمة
DROP POLICY IF EXISTS "Allow authenticated users to update employees" ON employees;
DROP POLICY IF EXISTS "Allow public update employees" ON employees;

-- Policy للتحديث (UPDATE) - للجميع (للوحة الإدارة)
CREATE POLICY "Allow public update employees"
ON employees FOR UPDATE TO public, authenticated
USING (true) WITH CHECK (true);

-- Policy للتحديث للمستخدمين المسجلين (authenticated)
CREATE POLICY "Allow authenticated users to update employees"
ON employees FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

-- التحقق من Policies
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'employees'
AND cmd = 'UPDATE'
ORDER BY policyname;


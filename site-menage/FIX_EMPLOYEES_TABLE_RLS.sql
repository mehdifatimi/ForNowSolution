-- إصلاح RLS Policies لجدول employees
-- قم بتشغيل هذا الملف في Supabase SQL Editor

-- تفعيل RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- حذف Policies القديمة إن وجدت
DROP POLICY IF EXISTS "Allow public read access to employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to insert employees" ON employees;
DROP POLICY IF EXISTS "Allow public insert employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to update employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to delete employees" ON employees;

-- Policy للقراءة (SELECT) - للجميع
CREATE POLICY "Allow public read access to employees"
ON employees FOR SELECT TO public, authenticated
USING (true);

-- Policy للإدراج (INSERT) - للجميع (للتسجيل)
CREATE POLICY "Allow public insert employees"
ON employees FOR INSERT TO public, authenticated
WITH CHECK (true);

-- Policy للإدراج للمستخدمين المسجلين (authenticated)
CREATE POLICY "Allow authenticated users to insert employees"
ON employees FOR INSERT TO authenticated
WITH CHECK (true);

-- Policy للتحديث (UPDATE) - للمستخدمين المسجلين فقط
CREATE POLICY "Allow authenticated users to update employees"
ON employees FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

-- Policy للحذف (DELETE) - للمستخدمين المسجلين فقط
CREATE POLICY "Allow authenticated users to delete employees"
ON employees FOR DELETE TO authenticated
USING (true);

-- التحقق من Policies
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'employees'
ORDER BY policyname;


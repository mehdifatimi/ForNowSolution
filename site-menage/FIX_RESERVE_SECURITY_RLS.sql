-- ============================================
-- إصلاح RLS Policies لجدول reserve_security
-- ============================================
-- قم بتشغيل هذا الملف في Supabase SQL Editor
-- ============================================

-- تفعيل RLS
ALTER TABLE reserve_security ENABLE ROW LEVEL SECURITY;

-- حذف Policies القديمة إن وجدت
DROP POLICY IF EXISTS "Allow users to read their own security reservations" ON reserve_security;
DROP POLICY IF EXISTS "Allow authenticated users to insert reserve_security" ON reserve_security;
DROP POLICY IF EXISTS "Allow public insert reserve_security" ON reserve_security;
DROP POLICY IF EXISTS "Allow authenticated users to update reserve_security" ON reserve_security;
DROP POLICY IF EXISTS "Allow authenticated users to delete reserve_security" ON reserve_security;
DROP POLICY IF EXISTS "Allow public read access to reserve_security" ON reserve_security;
DROP POLICY IF EXISTS "Allow admin read access to reserve_security" ON reserve_security;

-- Policy للقراءة (SELECT) - المستخدمون يمكنهم قراءة حجوزاتهم فقط
CREATE POLICY "Allow users to read their own security reservations"
ON reserve_security FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Policy للقراءة (SELECT) - للجميع (للعرض العام)
CREATE POLICY "Allow public read access to reserve_security"
ON reserve_security FOR SELECT TO public, authenticated
USING (true);

-- Policy للإدراج (INSERT) - للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to insert reserve_security"
ON reserve_security FOR INSERT TO authenticated
WITH CHECK (true);

-- Policy للإدراج (INSERT) - للجميع (للتسجيل بدون تسجيل دخول)
CREATE POLICY "Allow public insert reserve_security"
ON reserve_security FOR INSERT TO public, authenticated
WITH CHECK (true);

-- Policy للتحديث (UPDATE) - للمستخدمين المسجلين (يمكنهم تحديث حجوزاتهم فقط)
CREATE POLICY "Allow authenticated users to update reserve_security"
ON reserve_security FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policy للحذف (DELETE) - للمستخدمين المسجلين (يمكنهم حذف حجوزاتهم فقط)
CREATE POLICY "Allow authenticated users to delete reserve_security"
ON reserve_security FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- التحقق من Policies
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'reserve_security'
ORDER BY policyname;


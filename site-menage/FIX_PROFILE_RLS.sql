-- إصلاح RLS Policies لجداول Profile (orders, reservations, reserve_security)
-- قم بتشغيل هذا الملف في Supabase SQL Editor

-- ============================================
-- 1. جدول orders
-- ============================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to read their own orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to insert orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to update orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to delete orders" ON orders;
DROP POLICY IF EXISTS "Allow public read access to orders" ON orders;

-- Policy للقراءة (SELECT) - المستخدمون يمكنهم قراءة طلباتهم فقط
CREATE POLICY "Allow users to read their own orders"
ON orders FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Policy للإدراج (INSERT) - للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to insert orders"
ON orders FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy للإدراج (INSERT) - للضيوف (guest users) - user_id يمكن أن يكون NULL
CREATE POLICY "Allow public users to insert orders"
ON orders FOR INSERT TO public
WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Policy للتحديث (UPDATE) - للمستخدمين المسجلين (يمكنهم تحديث طلباتهم فقط)
CREATE POLICY "Allow authenticated users to update orders"
ON orders FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policy للحذف (DELETE) - للمستخدمين المسجلين (يمكنهم حذف طلباتهم فقط)
CREATE POLICY "Allow authenticated users to delete orders"
ON orders FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- 2. جدول reservations
-- ============================================
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to read their own reservations" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users to insert reservations" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users to update reservations" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users to delete reservations" ON reservations;
DROP POLICY IF EXISTS "Allow public read access to reservations" ON reservations;

-- Policy للقراءة (SELECT) - المستخدمون يمكنهم قراءة حجوزاتهم فقط
CREATE POLICY "Allow users to read their own reservations"
ON reservations FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Policy للإدراج (INSERT) - للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to insert reservations"
ON reservations FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy للتحديث (UPDATE) - للمستخدمين المسجلين (يمكنهم تحديث حجوزاتهم فقط)
CREATE POLICY "Allow authenticated users to update reservations"
ON reservations FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policy للحذف (DELETE) - للمستخدمين المسجلين (يمكنهم حذف حجوزاتهم فقط)
CREATE POLICY "Allow authenticated users to delete reservations"
ON reservations FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- 3. جدول reserve_security
-- ============================================
ALTER TABLE reserve_security ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to read their own security reservations" ON reserve_security;
DROP POLICY IF EXISTS "Allow authenticated users to insert reserve_security" ON reserve_security;
DROP POLICY IF EXISTS "Allow authenticated users to update reserve_security" ON reserve_security;
DROP POLICY IF EXISTS "Allow authenticated users to delete reserve_security" ON reserve_security;
DROP POLICY IF EXISTS "Allow public read access to reserve_security" ON reserve_security;

-- Policy للقراءة (SELECT) - المستخدمون يمكنهم قراءة حجوزات الأمن الخاصة بهم فقط
CREATE POLICY "Allow users to read their own security reservations"
ON reserve_security FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Policy للإدراج (INSERT) - للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to insert reserve_security"
ON reserve_security FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy للتحديث (UPDATE) - للمستخدمين المسجلين (يمكنهم تحديث حجوزاتهم فقط)
CREATE POLICY "Allow authenticated users to update reserve_security"
ON reserve_security FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policy للحذف (DELETE) - للمستخدمين المسجلين (يمكنهم حذف حجوزاتهم فقط)
CREATE POLICY "Allow authenticated users to delete reserve_security"
ON reserve_security FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- التحقق من Policies
-- ============================================
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename IN ('orders', 'reservations', 'reserve_security')
ORDER BY tablename, cmd;


-- إصلاح RLS Policies لجدول orders
-- قم بتشغيل هذا الملف في Supabase SQL Editor

-- تفعيل RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- حذف Policies القديمة إن وجدت
DROP POLICY IF EXISTS "Allow users to read their own orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to insert orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to update orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to delete orders" ON orders;
DROP POLICY IF EXISTS "Allow public read access to orders" ON orders;

-- Policy للقراءة (SELECT) - المستخدمون يمكنهم قراءة طلباتهم فقط
CREATE POLICY "Allow users to read their own orders"
ON orders FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Policy للقراءة (SELECT) - للجميع (للعرض العام)
CREATE POLICY "Allow public read access to orders"
ON orders FOR SELECT TO public, authenticated
USING (true);

-- Policy للإدراج (INSERT) - للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to insert orders"
ON orders FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy للتحديث (UPDATE) - للمستخدمين المسجلين (يمكنهم تحديث طلباتهم فقط)
CREATE POLICY "Allow authenticated users to update orders"
ON orders FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policy للحذف (DELETE) - للمستخدمين المسجلين (يمكنهم حذف طلباتهم فقط)
CREATE POLICY "Allow authenticated users to delete orders"
ON orders FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- التحقق من Policies
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'orders'
ORDER BY policyname;


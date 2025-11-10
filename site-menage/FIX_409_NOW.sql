-- ⚠️ إصلاح عاجل: خطأ 409 عند حفظ Gallery
-- الصق هذا الكود في Supabase SQL Editor واضغط RUN

-- 1. تفعيل RLS على جدول gallery
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- 2. حذف Policies القديمة (إن وجدت) لتجنب التعارض
DROP POLICY IF EXISTS "Allow public read access to gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated users to insert gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated users to update gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated users to delete gallery" ON gallery;

-- 3. إنشاء Policies جديدة
-- Policy 1: القراءة للجميع
CREATE POLICY "Allow public read access to gallery"
ON gallery
FOR SELECT
TO public, authenticated
USING (true);

-- Policy 2: الإدراج للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to insert gallery"
ON gallery
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: التحديث للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to update gallery"
ON gallery
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 4: الحذف للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to delete gallery"
ON gallery
FOR DELETE
TO authenticated
USING (true);

-- 4. التحقق من Policies
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'gallery'
ORDER BY policyname;

-- يجب أن ترى 4 policies:
-- 1. Allow public read access to gallery (SELECT)
-- 2. Allow authenticated users to insert gallery (INSERT)
-- 3. Allow authenticated users to update gallery (UPDATE)
-- 4. Allow authenticated users to delete gallery (DELETE)


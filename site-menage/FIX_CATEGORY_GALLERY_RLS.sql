-- ⚠️ إصلاح خطأ 409 - إضافة RLS policies على category_gallery
-- المشكلة: إذا كان RLS مفعّل على category_gallery بدون policies، يفشل JOIN في SELECT

-- 1. تفعيل RLS على category_gallery
ALTER TABLE category_gallery ENABLE ROW LEVEL SECURITY;

-- 2. حذف Policies القديمة (إن وجدت)
DROP POLICY IF EXISTS "Allow public read access to category_gallery" ON category_gallery;
DROP POLICY IF EXISTS "Allow authenticated users to insert category_gallery" ON category_gallery;
DROP POLICY IF EXISTS "Allow authenticated users to update category_gallery" ON category_gallery;
DROP POLICY IF EXISTS "Allow authenticated users to delete category_gallery" ON category_gallery;

-- 3. إنشاء Policies جديدة
-- Policy 1: القراءة للجميع (مهم جداً للـ JOIN)
CREATE POLICY "Allow public read access to category_gallery"
ON category_gallery
FOR SELECT
TO public, authenticated
USING (true);

-- Policy 2: الإدراج للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to insert category_gallery"
ON category_gallery
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: التحديث للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to update category_gallery"
ON category_gallery
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 4: الحذف للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to delete category_gallery"
ON category_gallery
FOR DELETE
TO authenticated
USING (true);

-- 4. التحقق من Policies
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'category_gallery'
ORDER BY cmd;

-- يجب أن ترى 4 policies على الأقل


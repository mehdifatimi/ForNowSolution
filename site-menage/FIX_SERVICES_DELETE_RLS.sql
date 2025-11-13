-- ============================================
-- إصلاح RLS Policies لجدول services - الحذف
-- قم بتشغيل هذا الملف في Supabase SQL Editor
-- ============================================

-- تفعيل RLS على جدول services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- حذف جميع السياسات القديمة إن وجدت
DROP POLICY IF EXISTS "Allow public read access to services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to insert services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to update services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to delete services" ON services;
DROP POLICY IF EXISTS "Anyone can view active services" ON services;
DROP POLICY IF EXISTS "Allow admin to manage services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to read all services" ON services;
DROP POLICY IF EXISTS "Public can read active services" ON services;
DROP POLICY IF EXISTS "Authenticated can manage services" ON services;

-- ============================================
-- سياسات القراءة (SELECT)
-- ============================================

-- السماح للجميع بقراءة الخدمات النشطة فقط
CREATE POLICY "Public can read active services"
ON services FOR SELECT
TO public
USING (is_active = true);

-- السماح للمستخدمين المسجلين بقراءة جميع الخدمات (للإدارة)
CREATE POLICY "Authenticated can read all services"
ON services FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- سياسات الإدراج (INSERT)
-- ============================================

-- السماح للمستخدمين المسجلين بإنشاء خدمات
CREATE POLICY "Authenticated can insert services"
ON services FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- سياسات التحديث (UPDATE)
-- ============================================

-- السماح للمستخدمين المسجلين بتحديث الخدمات
CREATE POLICY "Authenticated can update services"
ON services FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- سياسات الحذف (DELETE) - الأهم!
-- ============================================

-- السماح للمستخدمين المسجلين بحذف الخدمات
-- هذه السياسة ضرورية للحذف!
CREATE POLICY "Authenticated can delete services"
ON services FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- التحقق من السياسات
-- ============================================

-- عرض جميع السياسات المطبقة
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'services'
ORDER BY policyname;

-- ============================================
-- ملاحظات مهمة:
-- ============================================
-- 1. تأكد من أن المستخدم مسجل دخول في Supabase
-- 2. تحقق من أن session صحيح: 
--    - افتح Console في المتصفح
--    - اكتب: await supabase.auth.getSession()
--    - تأكد من وجود session
-- 3. إذا استمرت المشكلة:
--    - جرب تعطيل RLS مؤقتاً: ALTER TABLE services DISABLE ROW LEVEL SECURITY;
--    - ثم أعد تفعيله بعد إصلاح المشكلة
-- 4. للتأكد من أن السياسات تعمل:
--    - جرب حذف خدمة من Supabase Dashboard مباشرة
--    - إذا نجح، المشكلة في الكود
--    - إذا فشل، المشكلة في RLS policies
-- ============================================


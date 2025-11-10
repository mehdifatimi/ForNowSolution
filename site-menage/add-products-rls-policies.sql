-- ============================================
-- إضافة سياسات Row Level Security (RLS) لجدول products
-- ============================================
-- 
-- هذا الملف يضيف السياسات المطلوبة للسماح بـ:
-- - قراءة المنتجات للجميع (SELECT)
-- - إضافة/تحديث/حذف المنتجات للمستخدمين المسجلين (INSERT/UPDATE/DELETE)
--
-- الاستخدام:
-- 1. افتح Supabase Dashboard → SQL Editor
-- 2. الصق هذا الكود
-- 3. اضغط Run
-- ============================================

-- تفعيل RLS على جدول products (إذا لم يكن مفعلاً)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- حذف السياسات القديمة إذا كانت موجودة (اختياري)
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to insert products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to update products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to delete products" ON products;

-- ============================================
-- السياسة 1: السماح بقراءة المنتجات للجميع
-- ============================================
CREATE POLICY "Allow public read access to products"
ON products
FOR SELECT
TO public, authenticated
USING (true);

-- ============================================
-- السياسة 2: السماح بإضافة منتجات للمستخدمين المسجلين
-- ============================================
CREATE POLICY "Allow authenticated users to insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- السياسة 3: السماح بتحديث المنتجات للمستخدمين المسجلين
-- ============================================
CREATE POLICY "Allow authenticated users to update products"
ON products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- السياسة 4: السماح بحذف المنتجات للمستخدمين المسجلين
-- ============================================
CREATE POLICY "Allow authenticated users to delete products"
ON products
FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- التحقق من السياسات
-- ============================================
-- يمكنك تشغيل هذا الاستعلام للتحقق من أن السياسات تم إنشاؤها بنجاح:
-- SELECT 
--   schemaname,
--   tablename,
--   policyname,
--   permissive,
--   roles,
--   cmd
-- FROM pg_policies
-- WHERE tablename = 'products';


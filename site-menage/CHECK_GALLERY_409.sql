-- تشخيص خطأ 409 عند إدراج Gallery
-- قم بتشغيل هذا الكود في Supabase SQL Editor

-- 1. التحقق من RLS على category_gallery
SELECT 
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE tablename IN ('gallery', 'category_gallery')
AND schemaname = 'public';

-- 2. التحقق من RLS policies على category_gallery
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'category_gallery';

-- 3. التحقق من وجود الفئة
SELECT id, name_fr, name_ar, name_en, is_active
FROM category_gallery
WHERE id = 2;

-- 4. التحقق من RLS policies على gallery
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'gallery'
ORDER BY cmd;

-- 5. محاولة إدراج مباشرة (للتشخيص)
-- استبدل القيم بالقيم الفعلية من Console
INSERT INTO gallery (category_gallery_id, "order", is_active, image_path)
VALUES (2, 7, true, 'gallery/test.jpg')
RETURNING *;

-- 6. التحقق من constraints
SELECT
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'gallery'::regclass;


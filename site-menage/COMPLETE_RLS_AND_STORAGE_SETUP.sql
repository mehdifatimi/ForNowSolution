-- ============================================
-- إعداد كامل: RLS Policies + Storage Buckets
-- قم بتشغيل هذا الملف في Supabase SQL Editor
-- ============================================

-- ============================================
-- الجزء 1: RLS Policies للجداول
-- ============================================

-- 1. جدول categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
DROP POLICY IF EXISTS "Allow authenticated users to insert categories" ON categories;
DROP POLICY IF EXISTS "Allow authenticated users to update categories" ON categories;
DROP POLICY IF EXISTS "Allow authenticated users to delete categories" ON categories;

CREATE POLICY "Allow public read access to categories"
ON categories FOR SELECT TO public, authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert categories"
ON categories FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update categories"
ON categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete categories"
ON categories FOR DELETE TO authenticated USING (true);

-- 2. جدول services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to insert services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to update services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to delete services" ON services;

CREATE POLICY "Allow public read access to services"
ON services FOR SELECT TO public, authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert services"
ON services FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update services"
ON services FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete services"
ON services FOR DELETE TO authenticated USING (true);

-- 3. جدول category_gallery
ALTER TABLE category_gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to category_gallery" ON category_gallery;
DROP POLICY IF EXISTS "Allow authenticated users to insert category_gallery" ON category_gallery;
DROP POLICY IF EXISTS "Allow authenticated users to update category_gallery" ON category_gallery;
DROP POLICY IF EXISTS "Allow authenticated users to delete category_gallery" ON category_gallery;

CREATE POLICY "Allow public read access to category_gallery"
ON category_gallery FOR SELECT TO public, authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert category_gallery"
ON category_gallery FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update category_gallery"
ON category_gallery FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete category_gallery"
ON category_gallery FOR DELETE TO authenticated USING (true);

-- 4. جدول gallery
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated users to insert gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated users to update gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated users to delete gallery" ON gallery;

CREATE POLICY "Allow public read access to gallery"
ON gallery FOR SELECT TO public, authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert gallery"
ON gallery FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update gallery"
ON gallery FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete gallery"
ON gallery FOR DELETE TO authenticated USING (true);

-- 5. جدول products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to insert products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to update products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to delete products" ON products;

CREATE POLICY "Allow public read access to products"
ON products FOR SELECT TO public, authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert products"
ON products FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products"
ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete products"
ON products FOR DELETE TO authenticated USING (true);

-- 6. جدول reservations
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to reservations" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users to insert reservations" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users to update reservations" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users to delete reservations" ON reservations;

CREATE POLICY "Allow public read access to reservations"
ON reservations FOR SELECT TO public, authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert reservations"
ON reservations FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update reservations"
ON reservations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete reservations"
ON reservations FOR DELETE TO authenticated USING (true);

-- 7. جدول employees
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to insert employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to update employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to delete employees" ON employees;

CREATE POLICY "Allow public read access to employees"
ON employees FOR SELECT TO public, authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert employees"
ON employees FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update employees"
ON employees FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete employees"
ON employees FOR DELETE TO authenticated USING (true);

-- 8. جدول categories_house
ALTER TABLE categories_house ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to categories_house" ON categories_house;
DROP POLICY IF EXISTS "Allow authenticated users to insert categories_house" ON categories_house;
DROP POLICY IF EXISTS "Allow authenticated users to update categories_house" ON categories_house;
DROP POLICY IF EXISTS "Allow authenticated users to delete categories_house" ON categories_house;

CREATE POLICY "Allow public read access to categories_house"
ON categories_house FOR SELECT TO public, authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert categories_house"
ON categories_house FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update categories_house"
ON categories_house FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete categories_house"
ON categories_house FOR DELETE TO authenticated USING (true);

-- 9. جدول product_types
ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to product_types" ON product_types;
DROP POLICY IF EXISTS "Allow authenticated users to insert product_types" ON product_types;
DROP POLICY IF EXISTS "Allow authenticated users to update product_types" ON product_types;
DROP POLICY IF EXISTS "Allow authenticated users to delete product_types" ON product_types;

CREATE POLICY "Allow public read access to product_types"
ON product_types FOR SELECT TO public, authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert product_types"
ON product_types FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update product_types"
ON product_types FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete product_types"
ON product_types FOR DELETE TO authenticated USING (true);

-- 10. جدول type_category_gallery
ALTER TABLE type_category_gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to type_category_gallery" ON type_category_gallery;
DROP POLICY IF EXISTS "Allow authenticated users to insert type_category_gallery" ON type_category_gallery;
DROP POLICY IF EXISTS "Allow authenticated users to update type_category_gallery" ON type_category_gallery;
DROP POLICY IF EXISTS "Allow authenticated users to delete type_category_gallery" ON type_category_gallery;

CREATE POLICY "Allow public read access to type_category_gallery"
ON type_category_gallery FOR SELECT TO public, authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert type_category_gallery"
ON type_category_gallery FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update type_category_gallery"
ON type_category_gallery FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete type_category_gallery"
ON type_category_gallery FOR DELETE TO authenticated USING (true);

-- 11. جدول promotions
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to promotions" ON promotions;
DROP POLICY IF EXISTS "Allow authenticated users to insert promotions" ON promotions;
DROP POLICY IF EXISTS "Allow authenticated users to update promotions" ON promotions;
DROP POLICY IF EXISTS "Allow authenticated users to delete promotions" ON promotions;

CREATE POLICY "Allow public read access to promotions"
ON promotions FOR SELECT TO public, authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert promotions"
ON promotions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update promotions"
ON promotions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete promotions"
ON promotions FOR DELETE TO authenticated USING (true);

-- 12. جدول orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to insert orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to update orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to delete orders" ON orders;

CREATE POLICY "Allow public read access to orders"
ON orders FOR SELECT TO public, authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert orders"
ON orders FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update orders"
ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete orders"
ON orders FOR DELETE TO authenticated USING (true);

-- ============================================
-- الجزء 2: Storage Buckets + RLS Policies
-- ============================================

-- إنشاء Buckets إذا لم تكن موجودة
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('products', 'products', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
  ('gallery', 'gallery', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
  ('employees', 'employees', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
  ('category_house', 'category_house', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
  ('types', 'types', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 1. Bucket: products
UPDATE storage.buckets 
SET public = true 
WHERE name = 'products';

-- RLS Policies لـ products bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow public read access to products'
  ) THEN
    CREATE POLICY "Allow public read access to products"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'products');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload to products'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload to products"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'products');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update products'
  ) THEN
    CREATE POLICY "Allow authenticated users to update products"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'products') WITH CHECK (bucket_id = 'products');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete from products'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete from products"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'products');
  END IF;
END $$;

-- 2. Bucket: gallery
UPDATE storage.buckets 
SET public = true 
WHERE name = 'gallery';

-- RLS Policies لـ gallery bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow public read access to gallery'
  ) THEN
    CREATE POLICY "Allow public read access to gallery"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'gallery');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload to gallery'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload to gallery"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'gallery');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update gallery'
  ) THEN
    CREATE POLICY "Allow authenticated users to update gallery"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'gallery') WITH CHECK (bucket_id = 'gallery');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete from gallery'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete from gallery"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'gallery');
  END IF;
END $$;

-- 3. Bucket: employees
UPDATE storage.buckets 
SET public = true 
WHERE name = 'employees';

-- RLS Policies لـ employees bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow public read access to employees'
  ) THEN
    CREATE POLICY "Allow public read access to employees"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'employees');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload to employees'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload to employees"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'employees');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update employees'
  ) THEN
    CREATE POLICY "Allow authenticated users to update employees"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'employees') WITH CHECK (bucket_id = 'employees');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete from employees'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete from employees"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'employees');
  END IF;
END $$;

-- 4. Bucket: category_house
UPDATE storage.buckets 
SET public = true 
WHERE name = 'category_house';

-- RLS Policies لـ category_house bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow public read access to category_house'
  ) THEN
    CREATE POLICY "Allow public read access to category_house"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'category_house');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload to category_house'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload to category_house"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'category_house');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update category_house'
  ) THEN
    CREATE POLICY "Allow authenticated users to update category_house"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'category_house') WITH CHECK (bucket_id = 'category_house');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete from category_house'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete from category_house"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'category_house');
  END IF;
END $$;

-- 5. Bucket: types
UPDATE storage.buckets 
SET public = true 
WHERE name = 'types';

-- RLS Policies لـ types bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow public read access to types'
  ) THEN
    CREATE POLICY "Allow public read access to types"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'types');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload to types'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload to types"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'types');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update types'
  ) THEN
    CREATE POLICY "Allow authenticated users to update types"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'types') WITH CHECK (bucket_id = 'types');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete from types'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete from types"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'types');
  END IF;
END $$;

-- ============================================
-- الجزء 3: التحقق من جميع Policies
-- ============================================

-- التحقق من RLS Policies للجداول
SELECT 
  'Table RLS Policies' as type,
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN (
  'categories',
  'services',
  'category_gallery',
  'gallery',
  'products',
  'reservations',
  'employees',
  'categories_house',
  'product_types',
  'type_category_gallery',
  'promotions',
  'orders'
)
ORDER BY tablename, cmd;

-- التحقق من Storage Buckets
SELECT 
  'Storage Buckets' as type,
  name as bucket_name,
  public,
  created_at
FROM storage.buckets
WHERE name IN ('products', 'gallery', 'employees', 'category_house', 'types')
ORDER BY name;

-- التحقق من Storage RLS Policies
SELECT 
  'Storage RLS Policies' as type,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND (policyname LIKE '%products%' 
     OR policyname LIKE '%gallery%'
     OR policyname LIKE '%employees%'
     OR policyname LIKE '%category_house%'
     OR policyname LIKE '%types%')
ORDER BY policyname;


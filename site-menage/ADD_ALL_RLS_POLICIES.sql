-- إضافة RLS Policies لجميع جداول Admin
-- قم بتشغيل هذا الملف في Supabase SQL Editor

-- ============================================
-- 1. جدول categories
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
DROP POLICY IF EXISTS "Allow authenticated users to insert categories" ON categories;
DROP POLICY IF EXISTS "Allow authenticated users to update categories" ON categories;
DROP POLICY IF EXISTS "Allow authenticated users to delete categories" ON categories;

CREATE POLICY "Allow public read access to categories"
ON categories FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert categories"
ON categories FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update categories"
ON categories FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete categories"
ON categories FOR DELETE TO authenticated
USING (true);

-- ============================================
-- 2. جدول services
-- ============================================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to insert services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to update services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to delete services" ON services;

CREATE POLICY "Allow public read access to services"
ON services FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert services"
ON services FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update services"
ON services FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete services"
ON services FOR DELETE TO authenticated
USING (true);

-- ============================================
-- 3. جدول category_gallery (تم إضافته سابقاً)
-- ============================================
-- تم إضافته في FIX_409_COMPLETE.sql

-- ============================================
-- 4. جدول gallery (تم إضافته سابقاً)
-- ============================================
-- تم إضافته في add-gallery-rls-policies.sql

-- ============================================
-- 5. جدول products (تم إضافته سابقاً)
-- ============================================
-- تم إضافته في add-products-rls-policies.sql

-- ============================================
-- 6. جدول reservations
-- ============================================
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to reservations" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users to insert reservations" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users to update reservations" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users to delete reservations" ON reservations;

CREATE POLICY "Allow public read access to reservations"
ON reservations FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert reservations"
ON reservations FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update reservations"
ON reservations FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete reservations"
ON reservations FOR DELETE TO authenticated
USING (true);

-- ============================================
-- 7. جدول employees
-- ============================================
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to insert employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to update employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to delete employees" ON employees;

CREATE POLICY "Allow public read access to employees"
ON employees FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert employees"
ON employees FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update employees"
ON employees FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete employees"
ON employees FOR DELETE TO authenticated
USING (true);

-- ============================================
-- 8. جدول categories_house
-- ============================================
ALTER TABLE categories_house ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to categories_house" ON categories_house;
DROP POLICY IF EXISTS "Allow authenticated users to insert categories_house" ON categories_house;
DROP POLICY IF EXISTS "Allow authenticated users to update categories_house" ON categories_house;
DROP POLICY IF EXISTS "Allow authenticated users to delete categories_house" ON categories_house;

CREATE POLICY "Allow public read access to categories_house"
ON categories_house FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert categories_house"
ON categories_house FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update categories_house"
ON categories_house FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete categories_house"
ON categories_house FOR DELETE TO authenticated
USING (true);

-- ============================================
-- 9. جدول product_types
-- ============================================
ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to product_types" ON product_types;
DROP POLICY IF EXISTS "Allow authenticated users to insert product_types" ON product_types;
DROP POLICY IF EXISTS "Allow authenticated users to update product_types" ON product_types;
DROP POLICY IF EXISTS "Allow authenticated users to delete product_types" ON product_types;

CREATE POLICY "Allow public read access to product_types"
ON product_types FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert product_types"
ON product_types FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update product_types"
ON product_types FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete product_types"
ON product_types FOR DELETE TO authenticated
USING (true);

-- ============================================
-- 10. جدول type_category_gallery
-- ============================================
ALTER TABLE type_category_gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to type_category_gallery" ON type_category_gallery;
DROP POLICY IF EXISTS "Allow authenticated users to insert type_category_gallery" ON type_category_gallery;
DROP POLICY IF EXISTS "Allow authenticated users to update type_category_gallery" ON type_category_gallery;
DROP POLICY IF EXISTS "Allow authenticated users to delete type_category_gallery" ON type_category_gallery;

CREATE POLICY "Allow public read access to type_category_gallery"
ON type_category_gallery FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert type_category_gallery"
ON type_category_gallery FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update type_category_gallery"
ON type_category_gallery FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete type_category_gallery"
ON type_category_gallery FOR DELETE TO authenticated
USING (true);

-- ============================================
-- 11. جدول promotions
-- ============================================
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to promotions" ON promotions;
DROP POLICY IF EXISTS "Allow authenticated users to insert promotions" ON promotions;
DROP POLICY IF EXISTS "Allow authenticated users to update promotions" ON promotions;
DROP POLICY IF EXISTS "Allow authenticated users to delete promotions" ON promotions;

CREATE POLICY "Allow public read access to promotions"
ON promotions FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert promotions"
ON promotions FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update promotions"
ON promotions FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete promotions"
ON promotions FOR DELETE TO authenticated
USING (true);

-- ============================================
-- 12. جدول types
-- ============================================
ALTER TABLE types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to types" ON types;
DROP POLICY IF EXISTS "Allow authenticated users to insert types" ON types;
DROP POLICY IF EXISTS "Allow authenticated users to update types" ON types;
DROP POLICY IF EXISTS "Allow authenticated users to delete types" ON types;

CREATE POLICY "Allow public read access to types"
ON types FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert types"
ON types FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update types"
ON types FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete types"
ON types FOR DELETE TO authenticated
USING (true);

-- ============================================
-- 13. جدول type_options
-- ============================================
ALTER TABLE type_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to type_options" ON type_options;
DROP POLICY IF EXISTS "Allow authenticated users to insert type_options" ON type_options;
DROP POLICY IF EXISTS "Allow authenticated users to update type_options" ON type_options;
DROP POLICY IF EXISTS "Allow authenticated users to delete type_options" ON type_options;

CREATE POLICY "Allow public read access to type_options"
ON type_options FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert type_options"
ON type_options FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update type_options"
ON type_options FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete type_options"
ON type_options FOR DELETE TO authenticated
USING (true);

-- ============================================
-- 14. جدول security_roles
-- ============================================
ALTER TABLE security_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to security_roles" ON security_roles;
DROP POLICY IF EXISTS "Allow authenticated users to insert security_roles" ON security_roles;
DROP POLICY IF EXISTS "Allow authenticated users to update security_roles" ON security_roles;
DROP POLICY IF EXISTS "Allow authenticated users to delete security_roles" ON security_roles;

CREATE POLICY "Allow public read access to security_roles"
ON security_roles FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert security_roles"
ON security_roles FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update security_roles"
ON security_roles FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete security_roles"
ON security_roles FOR DELETE TO authenticated
USING (true);

-- ============================================
-- 15. جدول reserve_security
-- ============================================
ALTER TABLE reserve_security ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to reserve_security" ON reserve_security;
DROP POLICY IF EXISTS "Allow authenticated users to insert reserve_security" ON reserve_security;
DROP POLICY IF EXISTS "Allow authenticated users to update reserve_security" ON reserve_security;
DROP POLICY IF EXISTS "Allow authenticated users to delete reserve_security" ON reserve_security;

CREATE POLICY "Allow public read access to reserve_security"
ON reserve_security FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert reserve_security"
ON reserve_security FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update reserve_security"
ON reserve_security FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete reserve_security"
ON reserve_security FOR DELETE TO authenticated
USING (true);

-- ============================================
-- 16. جدول bebe_categories
-- ============================================
ALTER TABLE bebe_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to bebe_categories" ON bebe_categories;
DROP POLICY IF EXISTS "Allow authenticated users to insert bebe_categories" ON bebe_categories;
DROP POLICY IF EXISTS "Allow authenticated users to update bebe_categories" ON bebe_categories;
DROP POLICY IF EXISTS "Allow authenticated users to delete bebe_categories" ON bebe_categories;

CREATE POLICY "Allow public read access to bebe_categories"
ON bebe_categories FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert bebe_categories"
ON bebe_categories FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update bebe_categories"
ON bebe_categories FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete bebe_categories"
ON bebe_categories FOR DELETE TO authenticated
USING (true);

-- ============================================
-- 17. جدول bebe_settings
-- ============================================
ALTER TABLE bebe_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to bebe_settings" ON bebe_settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert bebe_settings" ON bebe_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update bebe_settings" ON bebe_settings;
DROP POLICY IF EXISTS "Allow authenticated users to delete bebe_settings" ON bebe_settings;

CREATE POLICY "Allow public read access to bebe_settings"
ON bebe_settings FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert bebe_settings"
ON bebe_settings FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update bebe_settings"
ON bebe_settings FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete bebe_settings"
ON bebe_settings FOR DELETE TO authenticated
USING (true);

-- ============================================
-- 18. جدول orders
-- ============================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to insert orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to update orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to delete orders" ON orders;

CREATE POLICY "Allow public read access to orders"
ON orders FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert orders"
ON orders FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update orders"
ON orders FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete orders"
ON orders FOR DELETE TO authenticated
USING (true);

-- ============================================
-- التحقق من جميع Policies
-- ============================================
SELECT 
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
  'orders',
  'types',
  'type_options',
  'security_roles',
  'reserve_security',
  'bebe_categories',
  'bebe_settings'
)
ORDER BY tablename, cmd;


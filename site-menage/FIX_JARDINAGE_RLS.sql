-- ============================================
-- إضافة RLS Policies لجدول jardinage_categories
-- ============================================
-- قم بتشغيل هذا الملف في Supabase SQL Editor
-- ============================================

-- تفعيل RLS
ALTER TABLE jardinage_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Allow public read access to jardinage_categories" ON jardinage_categories;
DROP POLICY IF EXISTS "Allow authenticated users to insert jardinage_categories" ON jardinage_categories;
DROP POLICY IF EXISTS "Allow authenticated users to update jardinage_categories" ON jardinage_categories;
DROP POLICY IF EXISTS "Allow authenticated users to delete jardinage_categories" ON jardinage_categories;

CREATE POLICY "Allow public read access to jardinage_categories"
ON jardinage_categories FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert jardinage_categories"
ON jardinage_categories FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update jardinage_categories"
ON jardinage_categories FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete jardinage_categories"
ON jardinage_categories FOR DELETE TO authenticated
USING (true);


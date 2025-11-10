-- ============================================
-- إنشاء جدول Security Roles في Supabase
-- ============================================
-- هذا الملف يحتوي على تعريف جدول security_roles
-- قم بتشغيله في Supabase SQL Editor
-- ============================================

-- إنشاء جدول security_roles
CREATE TABLE IF NOT EXISTS security_roles (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  name_ar TEXT,
  name_fr TEXT,
  name_en TEXT,
  description TEXT,
  description_ar TEXT,
  description_fr TEXT,
  description_en TEXT,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء Trigger لتحديث updated_at
CREATE TRIGGER update_security_roles_updated_at 
BEFORE UPDATE ON security_roles 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- إنشاء Index
CREATE INDEX IF NOT EXISTS idx_security_roles_is_active ON security_roles(is_active);
CREATE INDEX IF NOT EXISTS idx_security_roles_order ON security_roles("order");

-- تفعيل RLS
ALTER TABLE security_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

-- التحقق من الجدول
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'security_roles'
ORDER BY ordinal_position;


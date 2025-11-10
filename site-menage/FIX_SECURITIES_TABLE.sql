-- ============================================
-- إصلاح جدول Securities في Supabase
-- ============================================
-- هذا الملف يضيف الأعمدة المفقودة لجدول securities
-- قم بتشغيله في Supabase SQL Editor
-- ============================================

-- إضافة الأعمدة المفقودة إذا لم تكن موجودة
DO $$ 
BEGIN
  -- إضافة عمود name إذا لم يكن موجوداً
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'securities' AND column_name = 'name') THEN
    ALTER TABLE securities ADD COLUMN name TEXT;
    -- نسخ البيانات من full_name إلى name
    UPDATE securities SET name = full_name WHERE name IS NULL;
  END IF;

  -- إضافة أعمدة الأسماء متعددة اللغات
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'securities' AND column_name = 'name_ar') THEN
    ALTER TABLE securities ADD COLUMN name_ar TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'securities' AND column_name = 'name_fr') THEN
    ALTER TABLE securities ADD COLUMN name_fr TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'securities' AND column_name = 'name_en') THEN
    ALTER TABLE securities ADD COLUMN name_en TEXT;
  END IF;

  -- إضافة أعمدة الوصف
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'securities' AND column_name = 'description') THEN
    ALTER TABLE securities ADD COLUMN description TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'securities' AND column_name = 'description_ar') THEN
    ALTER TABLE securities ADD COLUMN description_ar TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'securities' AND column_name = 'description_fr') THEN
    ALTER TABLE securities ADD COLUMN description_fr TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'securities' AND column_name = 'description_en') THEN
    ALTER TABLE securities ADD COLUMN description_en TEXT;
  END IF;

  -- إضافة عمود role_id
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'securities' AND column_name = 'role_id') THEN
    ALTER TABLE securities ADD COLUMN role_id BIGINT;
    -- إضافة Foreign Key إذا كان جدول security_roles موجوداً
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'security_roles') THEN
      ALTER TABLE securities 
      ADD CONSTRAINT fk_securities_role_id 
      FOREIGN KEY (role_id) REFERENCES security_roles(id) ON DELETE SET NULL;
    END IF;
  END IF;

  -- إضافة عمود experience_years
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'securities' AND column_name = 'experience_years') THEN
    ALTER TABLE securities ADD COLUMN experience_years INTEGER DEFAULT 0;
  END IF;
END $$;

-- إنشاء Indexes لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_securities_role_id ON securities(role_id);
CREATE INDEX IF NOT EXISTS idx_securities_is_active ON securities(is_active);
CREATE INDEX IF NOT EXISTS idx_securities_status ON securities(status);

-- تحديث RLS Policies إذا لزم الأمر
ALTER TABLE securities ENABLE ROW LEVEL SECURITY;

-- Policy للقراءة (SELECT) - للجميع
DROP POLICY IF EXISTS "Allow public read access to securities" ON securities;
CREATE POLICY "Allow public read access to securities"
ON securities FOR SELECT
TO public, authenticated
USING (true);

-- Policy للإدراج (INSERT) - للمستخدمين المسجلين
DROP POLICY IF EXISTS "Allow authenticated users to insert securities" ON securities;
CREATE POLICY "Allow authenticated users to insert securities"
ON securities FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy للتحديث (UPDATE) - للمستخدمين المسجلين
DROP POLICY IF EXISTS "Allow authenticated users to update securities" ON securities;
CREATE POLICY "Allow authenticated users to update securities"
ON securities FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

-- Policy للحذف (DELETE) - للمستخدمين المسجلين
DROP POLICY IF EXISTS "Allow authenticated users to delete securities" ON securities;
CREATE POLICY "Allow authenticated users to delete securities"
ON securities FOR DELETE
TO authenticated
USING (true);

-- تعليق
COMMENT ON TABLE securities IS 'جدول حراس الأمن (Security Agents)';
COMMENT ON COLUMN securities.role_id IS 'رابط مع جدول security_roles';
COMMENT ON COLUMN securities.experience_years IS 'سنوات الخبرة';
COMMENT ON COLUMN securities.full_name IS 'الاسم الكامل (للتوافق مع البنية القديمة)';
COMMENT ON COLUMN securities.name IS 'الاسم (للتوافق مع البنية الجديدة)';


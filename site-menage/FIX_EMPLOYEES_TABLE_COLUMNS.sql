-- ============================================
-- إصلاح أعمدة جدول Employees في Supabase
-- ============================================
-- هذا الملف يضيف الأعمدة المفقودة لجدول employees
-- قم بتشغيله في Supabase SQL Editor
-- ============================================

-- إضافة الأعمدة المفقودة إذا لم تكن موجودة
DO $$ 
BEGIN
  -- إضافة عمود is_active إذا لم يكن موجوداً
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'employees' AND column_name = 'is_active') THEN
    ALTER TABLE employees ADD COLUMN is_active BOOLEAN DEFAULT true;
    -- تحديث القيم الموجودة بناءً على status
    UPDATE employees SET is_active = (status = 'active') WHERE is_active IS NULL;
  END IF;
END $$;

-- إنشاء Indexes لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_employees_is_active ON employees(is_active);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_created_at ON employees(created_at);

-- تعليق
COMMENT ON COLUMN employees.is_active IS 'حالة تفعيل الموظف (للتوافق مع البنية الجديدة)';
COMMENT ON COLUMN employees.status IS 'حالة الموظف: pending, active, inactive';


-- ============================================
-- إصلاح جدول reserve_security في Supabase
-- ============================================
-- هذا الملف يضيف الأعمدة المفقودة لجدول reserve_security
-- قم بتشغيله في Supabase SQL Editor
-- ============================================

-- إضافة الأعمدة المفقودة إذا لم تكن موجودة
DO $$ 
BEGIN
  -- إضافة عمود type_reservation
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'reserve_security' AND column_name = 'type_reservation') THEN
    ALTER TABLE reserve_security ADD COLUMN type_reservation TEXT DEFAULT 'jour' CHECK (type_reservation IN ('jour', 'heure'));
  END IF;

  -- إضافة عمود date_reservation
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'reserve_security' AND column_name = 'date_reservation') THEN
    ALTER TABLE reserve_security ADD COLUMN date_reservation DATE;
    -- نسخ البيانات من preferred_date إذا كان موجوداً
    UPDATE reserve_security SET date_reservation = preferred_date::DATE WHERE date_reservation IS NULL AND preferred_date IS NOT NULL;
  END IF;

  -- إضافة عمود heure_debut
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'reserve_security' AND column_name = 'heure_debut') THEN
    ALTER TABLE reserve_security ADD COLUMN heure_debut TIME;
  END IF;

  -- إضافة عمود heure_fin
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'reserve_security' AND column_name = 'heure_fin') THEN
    ALTER TABLE reserve_security ADD COLUMN heure_fin TIME;
  END IF;

  -- إضافة عمود role_id للربط مع security_roles
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'reserve_security' AND column_name = 'role_id') THEN
    ALTER TABLE reserve_security ADD COLUMN role_id BIGINT;
    -- إضافة Foreign Key إذا كان جدول security_roles موجوداً
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'security_roles') THEN
      ALTER TABLE reserve_security 
      ADD CONSTRAINT fk_reserve_security_role_id 
      FOREIGN KEY (role_id) REFERENCES security_roles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- إنشاء Indexes لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_reserve_security_type_reservation ON reserve_security(type_reservation);
CREATE INDEX IF NOT EXISTS idx_reserve_security_date_reservation ON reserve_security(date_reservation);
CREATE INDEX IF NOT EXISTS idx_reserve_security_role_id ON reserve_security(role_id);

-- تعليق
COMMENT ON COLUMN reserve_security.type_reservation IS 'نوع الحجز: jour (يومي) أو heure (ساعي)';
COMMENT ON COLUMN reserve_security.date_reservation IS 'تاريخ الحجز';
COMMENT ON COLUMN reserve_security.heure_debut IS 'ساعة البداية (للحجز الساعي)';
COMMENT ON COLUMN reserve_security.heure_fin IS 'ساعة النهاية (للحجز الساعي)';
COMMENT ON COLUMN reserve_security.role_id IS 'رابط مع جدول security_roles';


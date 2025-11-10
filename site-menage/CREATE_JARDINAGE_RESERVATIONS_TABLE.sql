-- ============================================
-- إنشاء جدول حجوزات البستنة في Supabase
-- ============================================
-- قم بتشغيل هذا الملف في Supabase SQL Editor
-- ============================================

-- إنشاء جدول jardinage_reservations
CREATE TABLE IF NOT EXISTS jardinage_reservations (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  jardinage_service_id BIGINT REFERENCES jardins(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  reservation_date DATE NOT NULL,
  hours INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء Indexes لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_jardinage_reservations_user_id ON jardinage_reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_jardinage_reservations_service_id ON jardinage_reservations(jardinage_service_id);
CREATE INDEX IF NOT EXISTS idx_jardinage_reservations_status ON jardinage_reservations(status);
CREATE INDEX IF NOT EXISTS idx_jardinage_reservations_date ON jardinage_reservations(reservation_date);

-- إنشاء Trigger لتحديث updated_at تلقائياً
DROP TRIGGER IF EXISTS update_jardinage_reservations_updated_at ON jardinage_reservations;
CREATE TRIGGER update_jardinage_reservations_updated_at 
BEFORE UPDATE ON jardinage_reservations 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- تفعيل RLS
ALTER TABLE jardinage_reservations ENABLE ROW LEVEL SECURITY;

-- حذف Policies القديمة إن وجدت
DROP POLICY IF EXISTS "Allow public read access to jardinage_reservations" ON jardinage_reservations;
DROP POLICY IF EXISTS "Allow authenticated users to insert jardinage_reservations" ON jardinage_reservations;
DROP POLICY IF EXISTS "Allow authenticated users to update jardinage_reservations" ON jardinage_reservations;
DROP POLICY IF EXISTS "Allow authenticated users to delete jardinage_reservations" ON jardinage_reservations;
DROP POLICY IF EXISTS "Allow public insert access to jardinage_reservations" ON jardinage_reservations;

-- RLS Policies
CREATE POLICY "Allow public read access to jardinage_reservations"
ON jardinage_reservations FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow public insert access to jardinage_reservations"
ON jardinage_reservations FOR INSERT TO public, authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update jardinage_reservations"
ON jardinage_reservations FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete jardinage_reservations"
ON jardinage_reservations FOR DELETE TO authenticated
USING (true);

-- التحقق من النجاح
SELECT 
  '✅ Table jardinage_reservations created successfully!' as status,
  COUNT(*) as total_rows
FROM jardinage_reservations;


-- ============================================
-- إنشاء جدول حجوزات العمال اليدويين في Supabase
-- ============================================
-- قم بتشغيل هذا الملف في Supabase SQL Editor
-- ============================================

-- إنشاء جدول hand_worker_reservations
CREATE TABLE IF NOT EXISTS hand_worker_reservations (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_first_name TEXT NOT NULL,
  client_last_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  category_id BIGINT REFERENCES hand_worker_categories(id) ON DELETE SET NULL,
  hand_worker_id BIGINT REFERENCES hand_workers(id) ON DELETE SET NULL,
  service_description TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TIME,
  duration_hours DECIMAL(5,2),
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  total_price DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  admin_notes TEXT,
  client_notes TEXT,
  estimated_completion_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء Indexes لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_hand_worker_reservations_user_id ON hand_worker_reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_hand_worker_reservations_category_id ON hand_worker_reservations(category_id);
CREATE INDEX IF NOT EXISTS idx_hand_worker_reservations_hand_worker_id ON hand_worker_reservations(hand_worker_id);
CREATE INDEX IF NOT EXISTS idx_hand_worker_reservations_status ON hand_worker_reservations(status);
CREATE INDEX IF NOT EXISTS idx_hand_worker_reservations_preferred_date ON hand_worker_reservations(preferred_date);

-- إنشاء Trigger لتحديث updated_at تلقائياً
CREATE TRIGGER update_hand_worker_reservations_updated_at 
BEFORE UPDATE ON hand_worker_reservations 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- تفعيل RLS
ALTER TABLE hand_worker_reservations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Allow public read access to hand_worker_reservations" ON hand_worker_reservations;
DROP POLICY IF EXISTS "Allow authenticated users to insert hand_worker_reservations" ON hand_worker_reservations;
DROP POLICY IF EXISTS "Allow public insert hand_worker_reservations" ON hand_worker_reservations;
DROP POLICY IF EXISTS "Allow authenticated users to update hand_worker_reservations" ON hand_worker_reservations;
DROP POLICY IF EXISTS "Allow authenticated users to delete hand_worker_reservations" ON hand_worker_reservations;

-- Policy للقراءة (SELECT) - للجميع
CREATE POLICY "Allow public read access to hand_worker_reservations"
ON hand_worker_reservations FOR SELECT TO public, authenticated
USING (true);

-- Policy للإدراج (INSERT) - للجميع (للتسجيل)
CREATE POLICY "Allow public insert hand_worker_reservations"
ON hand_worker_reservations FOR INSERT TO public, authenticated
WITH CHECK (true);

-- Policy للإدراج للمستخدمين المسجلين (authenticated)
CREATE POLICY "Allow authenticated users to insert hand_worker_reservations"
ON hand_worker_reservations FOR INSERT TO authenticated
WITH CHECK (true);

-- Policy للتحديث (UPDATE) - للجميع (للوحة الإدارة)
CREATE POLICY "Allow public update hand_worker_reservations"
ON hand_worker_reservations FOR UPDATE TO public, authenticated
USING (true) WITH CHECK (true);

-- Policy للحذف (DELETE) - للمستخدمين المسجلين فقط
CREATE POLICY "Allow authenticated users to delete hand_worker_reservations"
ON hand_worker_reservations FOR DELETE TO authenticated
USING (true);

-- تعليق
COMMENT ON TABLE hand_worker_reservations IS 'جدول حجوزات العمال اليدويين (Hand Worker Reservations)';


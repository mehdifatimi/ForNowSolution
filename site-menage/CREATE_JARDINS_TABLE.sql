-- ============================================
-- إنشاء جدول jardins (خدمات البستنة) في Supabase
-- ============================================
-- قم بتشغيل هذا الملف في Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS jardins (
  id BIGSERIAL PRIMARY KEY,
  jardinage_category_id BIGINT REFERENCES jardinage_categories(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  price DECIMAL(10,2),
  duration INTEGER,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء Trigger لتحديث updated_at تلقائياً
CREATE TRIGGER update_jardins_updated_at 
BEFORE UPDATE ON jardins 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- تفعيل RLS
ALTER TABLE jardins ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access to jardins"
ON jardins FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert jardins"
ON jardins FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update jardins"
ON jardins FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete jardins"
ON jardins FOR DELETE TO authenticated
USING (true);

-- إنشاء Indexes
CREATE INDEX IF NOT EXISTS idx_jardins_category_id ON jardins(jardinage_category_id);
CREATE INDEX IF NOT EXISTS idx_jardins_is_active ON jardins(is_active);


-- ============================================
-- ⚠️ URGENT: إنشاء جدول jardins في Supabase
-- ============================================
-- انسخ هذا الكود بالكامل والصقه في Supabase SQL Editor
-- ثم اضغط Run (أو F5)
-- ============================================

-- 1. إنشاء جدول jardins
CREATE TABLE IF NOT EXISTS public.jardins (
  id BIGSERIAL PRIMARY KEY,
  jardinage_category_id BIGINT REFERENCES public.jardinage_categories(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  price DECIMAL(10,2),
  duration INTEGER,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. إنشاء Trigger لتحديث updated_at تلقائياً
DROP TRIGGER IF EXISTS update_jardins_updated_at ON public.jardins;
CREATE TRIGGER update_jardins_updated_at 
BEFORE UPDATE ON public.jardins 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 3. تفعيل RLS
ALTER TABLE public.jardins ENABLE ROW LEVEL SECURITY;

-- 4. حذف Policies القديمة إن وجدت
DROP POLICY IF EXISTS "Allow public read access to jardins" ON public.jardins;
DROP POLICY IF EXISTS "Allow authenticated users to insert jardins" ON public.jardins;
DROP POLICY IF EXISTS "Allow authenticated users to update jardins" ON public.jardins;
DROP POLICY IF EXISTS "Allow authenticated users to delete jardins" ON public.jardins;

-- 5. إنشاء RLS Policies
CREATE POLICY "Allow public read access to jardins"
ON public.jardins FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert jardins"
ON public.jardins FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update jardins"
ON public.jardins FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete jardins"
ON public.jardins FOR DELETE TO authenticated
USING (true);

-- 6. إنشاء Indexes
CREATE INDEX IF NOT EXISTS idx_jardins_category_id ON public.jardins(jardinage_category_id);
CREATE INDEX IF NOT EXISTS idx_jardins_is_active ON public.jardins(is_active);

-- 7. التحقق من إنشاء الجدول
SELECT 
  '✅ Table jardins created successfully!' as status,
  COUNT(*) as row_count
FROM public.jardins;


-- ============================================
-- إعداد كامل لجدول jardins في Supabase
-- ============================================
-- قم بتشغيل هذا الملف في Supabase SQL Editor
-- ============================================

-- 1. إنشاء جدول jardins (إذا لم يكن موجوداً)
CREATE TABLE IF NOT EXISTS public.jardins (
  id BIGSERIAL PRIMARY KEY,
  jardinage_category_id BIGINT REFERENCES public.jardinage_categories(id) ON DELETE CASCADE,
  name TEXT,
  name_ar TEXT,
  name_fr TEXT,
  name_en TEXT,
  description TEXT,
  description_ar TEXT,
  description_fr TEXT,
  description_en TEXT,
  slug TEXT,
  image_url TEXT,
  price DECIMAL(10,2),
  duration INTEGER,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. إضافة الأعمدة المفقودة (إذا كان الجدول موجوداً بالفعل)
ALTER TABLE public.jardins 
ADD COLUMN IF NOT EXISTS name_ar TEXT,
ADD COLUMN IF NOT EXISTS name_fr TEXT,
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_ar TEXT,
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- 3. إنشاء Trigger لتحديث updated_at تلقائياً
DROP TRIGGER IF EXISTS update_jardins_updated_at ON public.jardins;
CREATE TRIGGER update_jardins_updated_at 
BEFORE UPDATE ON public.jardins 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 4. تفعيل RLS
ALTER TABLE public.jardins ENABLE ROW LEVEL SECURITY;

-- 5. حذف Policies القديمة إن وجدت
DROP POLICY IF EXISTS "Allow public read access to jardins" ON public.jardins;
DROP POLICY IF EXISTS "Allow authenticated users to insert jardins" ON public.jardins;
DROP POLICY IF EXISTS "Allow authenticated users to update jardins" ON public.jardins;
DROP POLICY IF EXISTS "Allow authenticated users to delete jardins" ON public.jardins;

-- 6. إنشاء RLS Policies
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

-- 7. إنشاء Indexes
CREATE INDEX IF NOT EXISTS idx_jardins_category_id ON public.jardins(jardinage_category_id);
CREATE INDEX IF NOT EXISTS idx_jardins_is_active ON public.jardins(is_active);

-- 8. إدراج البيانات
INSERT INTO public.jardins (
  id, 
  jardinage_category_id, 
  name, 
  image_url, 
  description, 
  price, 
  duration, 
  is_active, 
  created_at, 
  updated_at, 
  name_ar, 
  name_fr, 
  name_en, 
  description_ar, 
  description_fr, 
  description_en, 
  slug, 
  "order"
) VALUES 
(
  10, 
  2, 
  'mehdi fatimi', 
  'http://localhost:8000/uploads/jardinage/1761223637_reservation.jpg', 
  'sdfghgfdsasdfg', 
  200.00, 
  2, 
  true, 
  '2025-10-23 10:47:17'::timestamptz, 
  '2025-10-23 10:47:17'::timestamptz, 
  NULL, 
  'mehdi fatimi', 
  NULL, 
  NULL, 
  'sdfghgfdsasdfg', 
  NULL, 
  NULL, 
  0
),
(
  11, 
  3, 
  'Mehdi', 
  'http://localhost:8000/uploads/jardinage/1761224098_section.png', 
  'wrtgwwwcerxeqf', 
  12345.00, 
  3, 
  true, 
  '2025-10-23 10:54:58'::timestamptz, 
  '2025-10-23 10:54:58'::timestamptz, 
  NULL, 
  'Mehdi', 
  NULL, 
  NULL, 
  'wrtgwwwcerxeqf', 
  NULL, 
  NULL, 
  0
)
ON CONFLICT (id) DO UPDATE SET
  jardinage_category_id = EXCLUDED.jardinage_category_id,
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at,
  name_ar = EXCLUDED.name_ar,
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  description_ar = EXCLUDED.description_ar,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  slug = EXCLUDED.slug,
  "order" = EXCLUDED."order";

-- 9. التحقق من النجاح
SELECT 
  '✅ Table jardins setup completed!' as status,
  COUNT(*) as total_rows
FROM public.jardins;


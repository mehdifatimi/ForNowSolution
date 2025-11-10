-- ============================================
-- إدراج بيانات jardins في Supabase
-- ============================================
-- قم بتشغيل هذا الملف في Supabase SQL Editor
-- ============================================
-- ملاحظة: تم تحويل البيانات من Laravel إلى PostgreSQL syntax
-- ============================================

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

-- التحقق من البيانات
SELECT * FROM public.jardins WHERE id IN (10, 11);


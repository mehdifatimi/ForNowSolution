-- ============================================
-- إدراج بيانات Type Options في Supabase
-- ============================================
-- هذا الملف يحتوي على بيانات Type Options من Laravel
-- قم بتشغيله في Supabase SQL Editor
-- ============================================

-- ملاحظة: الصور تحتوي على مسارات Laravel القديمة
-- يجب رفع الصور إلى Supabase Storage bucket "types" أو "products"
-- ثم تحديث مسارات الصور في قاعدة البيانات

INSERT INTO type_options (
  id, 
  type_id, 
  name_ar, 
  name_fr, 
  name_en, 
  description_ar, 
  description_fr, 
  description_en, 
  image, 
  created_at, 
  updated_at
) VALUES
(1, 18, 'السوشي', 'Sushi', 'Sushi', 'ar: طبق ياباني تقليدي مصنوع من الأرز المتبل بالخل مع السمك النيء أو المطبوخ والخضروات.', 'Plat japonais traditionnel à base de riz vinaigré accompagné de poisson cru ou cuit et de légumes.', 'Traditional Japanese dish made of vinegared rice combined with raw or cooked fish and vegetables.', 'http://127.0.0.1:8000/storage/images/products/aa367391-e8a8-4ad3-8d19-44b73af3c1da.jpeg', '2025-11-06 13:17:20', '2025-11-06 13:17:20'),
(2, 18, 'ووك', 'Wok Chaud', 'Hot Wok', 'أطباق آسيوية تُطهى بسرعة في مقلاة ووك ساخنة مع خضروات طازجة، لحم أو نودلز ونكهات قوية', 'Plats asiatiques sautés rapidement dans un wok chaud avec des légumes frais, de la viande ou des nouilles et des saveurs intenses.', 'Asian-style dishes quickly stir-fried in a hot wok with fresh vegetables, meat or noodles, and bold flavors.', 'http://127.0.0.1:8000/storage/images/products/459c446b-cc77-445c-8888-89008e00b938.jpeg', '2025-11-06 13:19:23', '2025-11-06 13:19:38')
ON CONFLICT (id) DO UPDATE SET
  type_id = EXCLUDED.type_id,
  name_ar = EXCLUDED.name_ar,
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  description_ar = EXCLUDED.description_ar,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  image = EXCLUDED.image,
  updated_at = EXCLUDED.updated_at;

-- ============================================
-- ملاحظات مهمة:
-- ============================================
-- 1. الصور تحتوي على مسارات Laravel القديمة
--    يجب رفع الصور إلى Supabase Storage bucket "types" أو "products"
--    ثم تحديث مسارات الصور في قاعدة البيانات
--
-- 2. بعد رفع الصور إلى Supabase Storage، يمكنك تحديث المسارات باستخدام:
--    UPDATE type_options 
--    SET image = REPLACE(image, 'http://127.0.0.1:8000/storage/images/products/', 'https://xcsfqzeyooncpqbcqihm.supabase.co/storage/v1/object/public/types/')
--    WHERE image LIKE 'http://127.0.0.1:8000/storage/images/products/%';
-- ============================================


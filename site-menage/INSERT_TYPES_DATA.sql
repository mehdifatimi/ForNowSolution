-- ============================================
-- إدراج بيانات Types في Supabase
-- ============================================
-- هذا الملف يحتوي على بيانات Types من Laravel
-- قم بتشغيله في Supabase SQL Editor
-- ============================================

-- إضافة عمود "name" إذا لم يكن موجوداً
ALTER TABLE types ADD COLUMN IF NOT EXISTS name TEXT;

-- إضافة عمود "description" إذا لم يكن موجوداً
ALTER TABLE types ADD COLUMN IF NOT EXISTS description TEXT;

-- ملاحظة: الصور تحتوي على مسارات Laravel القديمة
-- يجب رفع الصور إلى Supabase Storage bucket "types" أو "products"
-- ثم تحديث مسارات الصور في قاعدة البيانات

INSERT INTO types (
  id, 
  service_id, 
  category_id, 
  category_house_id, 
  name,
  name_ar, 
  name_fr, 
  name_en, 
  description, 
  description_ar, 
  description_fr, 
  description_en, 
  image, 
  is_active, 
  "order", 
  created_at, 
  updated_at
) VALUES
(1, 1, NULL, 1, 'Villa', 'فيلا', 'Villa', 'Villa', '', 'تنظيف وصيانة الفلل الراقية بمستوى عالٍ من الدقة والاهتمام بالتفاصيل.', 'Nettoyage et entretien des villas de luxe avec une attention aux détails.', 'Luxury villa cleaning and maintenance with great attention to detail.', 'http://127.0.0.1:8000/storage/images/products/f889a860-c3b8-44bd-bb17-0ccdbac769f2.jpeg', true, 0, '2025-11-01 07:58:09', '2025-11-03 14:30:39'),
(2, 1, NULL, 1, 'Maison d''hôte', 'دار الضيافة', 'Maison d''hôte', 'Guest House', '', 'خدمات تنظيف واستقبال احترافية لدور الضيافة الصغيرة والمتوسطة.', 'Services de nettoyage et d''accueil pour maisons d''hôtes et petites auberges.', 'Cleaning and hospitality services for guest houses and small inns.', 'http://127.0.0.1:8000/storage/images/products/88798318-2709-4a5c-9c47-730c71f4bfd2.jpeg', true, 0, '2025-11-01 07:58:43', '2025-11-03 14:30:18'),
(3, 1, NULL, 1, 'Maison', 'منزل', 'Maison', 'House', '', 'تنظيف شامل للمنازل يشمل الأرضيات والنوافذ والمطابخ والحمامات.', 'Nettoyage complet des maisons : sols, vitres, cuisines et salles de bain.', 'Complete house cleaning: floors, windows, kitchens, and bathrooms.', 'http://127.0.0.1:8000/storage/images/products/3a46e97c-c40b-40ad-a02b-7502f3c322eb.jpeg', true, 0, '2025-11-01 07:59:14', '2025-11-03 14:29:52'),
(4, 1, NULL, 1, 'Appartement', 'شقة', 'Appartement', 'Apartment', '', 'تنظيف وصيانة الشقق المفروشة والمنازل العائلية بشكل يومي أو أسبوعي.', 'Nettoyage et entretien des appartements meublés et des résidences familiales.', 'Cleaning and maintenance for furnished apartments and family homes.', 'http://127.0.0.1:8000/storage/images/products/8ae3db77-fd2a-4fcd-8af7-97a639e9f289.jpeg', true, 0, '2025-11-01 07:59:43', '2025-11-03 14:29:29'),
(5, 1, NULL, 1, 'Hôtel', 'فندق', 'Hôtel', 'Hotel', '', 'خدمات تنظيف الغرف والممرات ومرافق الفنادق باحترافية عالية.', 'Services de nettoyage des chambres et des espaces hôteliers avec un haut niveau de professionnalisme.', 'Professional cleaning services for hotel rooms and facilities.', 'http://127.0.0.1:8000/storage/images/products/02c7931a-6b4b-48b6-a382-5ac797678cb8.jpeg', true, 0, '2025-11-01 08:00:08', '2025-11-03 14:28:35'),
(6, 1, NULL, 1, 'Resort Hôtel', 'منتجع فندقي', 'Resort Hôtel', 'Resort Hotel', '', 'خدمات تنظيف وصيانة كاملة مخصصة للمنتجعات والفنادق الفاخرة.', 'Services complets de nettoyage et d''entretien pour les hôtels et resorts de luxe.', 'Full cleaning and maintenance services for luxury hotels and resorts.', 'http://127.0.0.1:8000/storage/images/products/0849b02c-05e9-44a7-8fc0-01644da114cb.jpeg', true, 0, '2025-11-01 08:00:35', '2025-11-03 14:29:03'),
(7, 1, NULL, 2, 'Italienne', 'إيطالية', 'Italienne', 'Italian', '', 'المطبخ الإيطالي مشهور بالبيتزا والمعكرونة واستخدام زيت الزيتون الطازج.', 'La cuisine italienne est célèbre pour ses pizzas, ses pâtes et son huile d''olive.', 'Italian cuisine is known for its pizzas, pastas, and use of fresh olive oil.', 'http://127.0.0.1:8000/storage/images/products/2730c8f3-7267-448c-9acf-94ef79e624aa.jpeg', true, 0, '2025-11-01 08:01:07', '2025-11-03 14:27:31'),
(8, 1, NULL, 2, 'Marocaine', 'مغربية', 'Marocaine', 'Moroccan', '', 'المطبخ المغربي من أغنى المطابخ في العالم، يتميز بالتوابل مثل الزعفران والكمون والحريرة والطاجين.', 'La cuisine marocaine est riche en épices et en saveurs, célèbre pour le tajine et la harira.', 'Moroccan cuisine is rich in spices and flavors, famous for tagine and harira.', 'http://127.0.0.1:8000/storage/images/products/6861f1bf-69d9-476a-b536-c8eefd0066cd.jpeg', true, 0, '2025-11-01 08:01:37', '2025-11-03 14:27:00'),
(9, 1, NULL, 2, 'Française', 'فرنسية', 'Française', 'French', '', 'المطبخ الفرنسي يعتبر من أرقى مطابخ العالم، يشتهر بالصلصات والمعجنات الراقية.', 'La cuisine française est réputée pour sa finesse, ses sauces et ses pâtisseries élégantes.', 'French cuisine is known for its elegance, sauces, and refined pastries.', 'http://127.0.0.1:8000/storage/images/products/fde6b694-ee98-427a-a55b-1a3656167565.jpeg', true, 0, '2025-11-01 08:02:06', '2025-11-03 14:26:35'),
(10, 1, NULL, 2, 'Arabe du Golfe', 'عربية خليجية', 'Arabe du Golfe', 'Gulf Arabic', '', 'المطبخ الخليجي يتميز بأطباق الأرز والبهارات القوية مثل الكبسة والمجبوس.', 'La cuisine du Golfe arabe se distingue par ses plats à base de riz et d''épices fortes comme le kabsa et le machbous.', 'Gulf Arabic cuisine features rice-based dishes with strong spices like kabsa and machboos.', 'http://127.0.0.1:8000/storage/images/products/a1828f63-0b65-49b3-88c0-bce2d3303c54.jpeg', true, 0, '2025-11-01 08:02:35', '2025-11-03 14:25:13'),
(11, 1, NULL, 2, 'Internationale', 'دولية', 'Internationale', 'International', '', 'المطبخ الدولي يقدم مزيجاً من أشهر أطباق العالم بنكهات متنوعة.', 'La cuisine internationale offre un mélange de plats célèbres du monde entier.', 'International cuisine offers a mix of famous dishes from around the world.', 'http://127.0.0.1:8000/storage/images/products/cbeacdb7-5627-4141-84d3-976d3b747c27.jpeg', true, 0, '2025-11-01 08:03:27', '2025-11-03 14:24:29'),
(12, 1, NULL, 2, 'Égyptienne', 'مصرية', 'Égyptienne', 'Egyptian', '', 'المطبخ المصري يعتمد على مكونات بسيطة بنكهات قوية مثل الكشري والفول.', 'La cuisine égyptienne utilise des ingrédients simples avec des saveurs puissantes, comme le koshari et le foul.', 'Egyptian cuisine uses simple ingredients with bold flavors, such as koshari and fava beans.', 'http://127.0.0.1:8000/storage/images/products/b55586a0-4856-4883-ab13-fc2832988326.jpeg', true, 0, '2025-11-03 12:21:40', '2025-11-03 14:24:00'),
(13, 1, NULL, 2, 'Turque', 'تركية', 'Turque', 'Turkish', '', 'المطبخ التركي يجمع بين نكهات الشرق والغرب، ويشتهر بالكباب والبقلاوة.', 'La cuisine turque combine les saveurs de l''Orient et de l''Occident, célèbre pour ses kebabs et baklavas.', 'Turkish cuisine blends Eastern and Western flavors, known for kebabs and baklava.', 'http://127.0.0.1:8000/storage/images/products/9c86808e-f787-47a0-a7c9-0889a7b89bac.jpeg', true, 0, '2025-11-03 12:22:25', '2025-11-03 14:23:24'),
(14, 1, NULL, 2, 'Coréenne', 'كورية', 'Coréenne', 'Korean', '', 'المطبخ الكوري يتميز بأطعمة صحية ومتوازنة مثل الكيمتشي والبيبمباب.', 'La cuisine coréenne est connue pour ses plats équilibrés et sains tels que le kimchi et le bibimbap.', 'Korean cuisine is known for its healthy and balanced dishes like kimchi and bibimbap.', 'http://127.0.0.1:8000/storage/images/products/f9cace86-619c-422a-a6f1-6d6bf93ded4e.jpeg', true, 0, '2025-11-03 12:23:12', '2025-11-03 14:22:53'),
(15, 1, NULL, 2, 'Mexicaine', 'مكسيكية', 'Mexicaine', 'Mexican', '', 'المطبخ المكسيكي مشهور بتوابله القوية وأطباقه الغنية مثل التاكو والإنشيلادا.', 'La cuisine mexicaine est réputée pour ses épices fortes et ses plats savoureux comme les tacos et les enchiladas.', 'Mexican cuisine is famous for its bold spices and dishes like tacos and enchiladas.', 'http://127.0.0.1:8000/storage/images/products/a32f802a-ecc0-4014-a3d0-99e4b14ab7b8.jpeg', true, 0, '2025-11-03 12:23:59', '2025-11-03 14:22:26'),
(16, 1, NULL, 2, 'Espagnole', 'إسبانية', 'Espagnole', 'Spanish', '', 'المطبخ الإسباني يجمع بين البساطة والتنوع، أشهر أطباقه الباييا والتاباس.', 'La cuisine espagnole allie simplicité et variété, avec des plats emblématiques comme la paella et les tapas.', 'Spanish cuisine combines simplicity and variety, featuring dishes like paella and tapas.', 'http://127.0.0.1:8000/storage/images/products/e223c690-5631-474b-a682-bff438bf1d2b.jpeg', true, 0, '2025-11-03 12:24:55', '2025-11-03 14:21:56'),
(17, 1, NULL, 2, 'Allemande', 'ألمانية', 'Allemande', 'German', '', 'المطبخ الألماني يتميز بأطباقه الغنية بالنكهات مثل النقانق والبطاطس واللحوم المطهية ببطء.', 'La cuisine allemande se distingue par ses saveurs riches, ses saucisses et ses plats mijotés.', 'German cuisine is known for its rich flavors, sausages, and slow-cooked meats.', 'http://127.0.0.1:8000/storage/images/products/8442cdb0-811d-4031-a3c8-90cd076822a4.jpeg', true, 0, '2025-11-03 12:27:52', '2025-11-03 14:21:12'),
(18, 1, NULL, 2, 'Cuisine Asiatique', 'المطبخ الآسيوي', 'Cuisine Asiatique', 'Asian Cuisine', '', 'يقدم المطبخ الآسيوي مجموعة متنوعة من الأطباق التقليدية الشهية، بما في ذلك الأطعمة الصينية، اليابانية، التايلاندية، والكورية، مع مزيج غني من النكهات والتوابل المميزة.', 'La cuisine asiatique propose une variété de plats traditionnels délicieux, y compris les cuisines chinoise, japonaise, thaïlandaise et coréenne, avec un mélange riche de saveurs et d''épices caractéristiques.', 'Asian cuisine offers a diverse range of delicious traditional dishes, including Chinese, Japanese, Thai, and Korean foods, with a rich blend of distinctive flavors and spices.', 'http://127.0.0.1:8000/storage/images/products/2b7e9cdd-5b97-43c7-9da6-0e72bc0c356a.jpeg', true, 0, '2025-11-06 12:04:55', '2025-11-06 13:22:12')
ON CONFLICT (id) DO UPDATE SET
  service_id = EXCLUDED.service_id,
  category_id = EXCLUDED.category_id,
  category_house_id = EXCLUDED.category_house_id,
  name = EXCLUDED.name,
  name_ar = EXCLUDED.name_ar,
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  image = EXCLUDED.image,
  is_active = EXCLUDED.is_active,
  "order" = EXCLUDED."order",
  updated_at = EXCLUDED.updated_at;

-- ============================================
-- ملاحظات مهمة:
-- ============================================
-- 1. الصور تحتوي على مسارات Laravel القديمة
--    يجب رفع الصور إلى Supabase Storage bucket "types" أو "products"
--    ثم تحديث مسارات الصور في قاعدة البيانات
--
-- 2. إذا كان جدول types لا يحتوي على عمود "name"،
--    يمكنك إضافته باستخدام:
--    ALTER TABLE types ADD COLUMN IF NOT EXISTS name TEXT;
--
-- 3. بعد رفع الصور إلى Supabase Storage، يمكنك تحديث المسارات باستخدام:
--    UPDATE types 
--    SET image = REPLACE(image, 'http://127.0.0.1:8000/storage/images/products/', 'https://xcsfqzeyooncpqbcqihm.supabase.co/storage/v1/object/public/types/')
--    WHERE image LIKE 'http://127.0.0.1:8000/storage/images/products/%';
-- ============================================


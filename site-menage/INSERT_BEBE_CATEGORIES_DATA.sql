-- ============================================
-- إدراج بيانات Bebe Categories في Supabase
-- ============================================
-- هذا الملف يحتوي على بيانات Bebe Categories من Laravel
-- قم بتشغيله في Supabase SQL Editor
-- ============================================

INSERT INTO bebe_categories (
  id, 
  name, 
  name_ar, 
  name_fr, 
  name_en, 
  slug, 
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
(1, 'Chambre Bébé', 'غرفة الطفل', 'Chambre Bébé', 'Baby Room', NULL, 'Aménagement et décoration de chambre pour bébé', 'ترتيب وتزيين غرفة الطفل', 'Aménagement et décoration de chambre pour bébé', 'Baby room layout and decoration', '/images/bebe/chambre.jpg', true, 0, '2025-10-22 09:04:11'::timestamptz, '2025-10-31 09:20:29'::timestamptz),
(2, 'Mobilier Bébé', 'أثاث الطفل', 'Mobilier Bébé', 'Baby Furniture', NULL, 'Sélection et installation de mobilier adapté aux bébés', 'اختيار وتركيب الأثاث المناسب للأطفال', 'Sélection et installation de mobilier adapté aux bébés', 'Selection and installation of furniture suitable for babies', '/images/bebe/mobilier.jpg', true, 0, '2025-10-22 09:04:11'::timestamptz, '2025-10-31 09:22:05'::timestamptz),
(3, 'Décoration Bébé', 'ديكور الطفل', 'Décoration Bébé', 'Baby Decoration', NULL, 'Décoration et accessoires pour créer un environnement douillet', 'تزيين واكسسوارات لخلق بيئة ممتعة للطفل', 'Décoration et accessoires pour créer un environnement douillet', 'Decoration and accessories to create a pleasant environment for the baby', '/images/bebe/decoration.jpg', true, 0, '2025-10-22 09:04:11'::timestamptz, '2025-10-31 09:22:43'::timestamptz),
(4, 'Sécurité Bébé', 'سلامة الطفل', 'Sécurité Bébé', 'Baby Safety', NULL, 'Installation d''équipements de sécurité pour protéger bébé', 'تركيب معدات السلامة لحماية الطفل', 'Installation d''équipements de sécurité pour protéger bébé', 'Installation of safety equipment to protect the baby', '/images/bebe/securite.jpg', true, 0, '2025-10-22 09:04:11'::timestamptz, '2025-10-31 09:23:29'::timestamptz)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_ar = EXCLUDED.name_ar,
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  image = EXCLUDED.image,
  is_active = EXCLUDED.is_active,
  "order" = EXCLUDED."order",
  updated_at = EXCLUDED.updated_at;

-- التحقق من البيانات
SELECT 
  id,
  name,
  name_ar,
  name_fr,
  name_en,
  is_active,
  "order"
FROM bebe_categories
ORDER BY "order", id;


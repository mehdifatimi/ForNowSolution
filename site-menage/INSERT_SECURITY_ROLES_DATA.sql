-- ============================================
-- إدراج بيانات Security Roles في Supabase
-- ============================================
-- هذا الملف يحتوي على بيانات Security Roles من Laravel
-- قم بتشغيله في Supabase SQL Editor
-- ============================================

INSERT INTO security_roles (
  id, 
  name, 
  name_ar, 
  name_fr, 
  name_en, 
  description, 
  description_ar, 
  description_fr, 
  description_en, 
  is_active, 
  "order", 
  created_at, 
  updated_at
) VALUES 
(1, 'Agent de sécurité', 'حارس أمن 1', 'Agent de sécurité', 'General Security Officer', 'Agent de sécurité général', 'ضابط الأمن العام', 'Agent de sécurité général', 'Security Officer', true, 0, '2025-10-14 13:25:09'::timestamptz, '2025-10-30 13:22:15'::timestamptz),
(2, 'Superviseur sécurité', 'مشرف الأمن', 'Superviseur sécurité', 'Security Supervisor', 'Superviseur d''équipe de sécurité', 'مشرف فريق الأمن', 'Superviseur d''équipe de sécurité', 'Security Team Supervisor', true, 0, '2025-10-14 13:25:10'::timestamptz, '2025-10-30 13:26:03'::timestamptz),
(3, 'Agent de sûreté', 'ضابط أمن', 'Agent de sûreté', 'Security officer', 'Agent spécialisé en sûreté', 'ضابط أمن متخصص', 'Agent spécialisé en sûreté', 'Specialized security officer', true, 0, '2025-10-14 13:25:10'::timestamptz, '2025-10-30 13:23:44'::timestamptz),
(4, 'Chef de sécurité', 'مدير الأمن', 'Chef de sécurité', 'Security Manager', 'Responsable de la sécurité', 'رئيس الأمن', 'Responsable de la sécurité', 'Head of Security', true, 0, '2025-10-14 13:25:10'::timestamptz, '2025-10-30 13:24:44'::timestamptz)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_ar = EXCLUDED.name_ar,
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
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
FROM security_roles
ORDER BY "order", id;


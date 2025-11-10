-- إصلاح Sequence لجدول hand_worker_categories
-- قم بتشغيل هذا الملف في Supabase SQL Editor

-- 1. التحقق من القيمة الحالية للـ sequence
SELECT 
  'Current sequence value' as info,
  last_value,
  is_called
FROM hand_worker_categories_id_seq;

-- 2. الحصول على أعلى id موجود في الجدول
SELECT 
  'Max ID in table' as info,
  COALESCE(MAX(id), 0) as max_id
FROM hand_worker_categories;

-- 3. إعادة تعيين sequence إلى القيمة الصحيحة
-- هذا سيضمن أن القيمة التالية ستكون أكبر من أي id موجود
SELECT setval(
  'hand_worker_categories_id_seq',
  COALESCE((SELECT MAX(id) FROM hand_worker_categories), 0) + 1,
  false
) as new_sequence_value;

-- 4. التحقق من القيمة الجديدة
SELECT 
  'New sequence value' as info,
  last_value,
  is_called
FROM hand_worker_categories_id_seq;

-- 5. التحقق من عدد السجلات
SELECT 
  'Total records' as info,
  COUNT(*) as count
FROM hand_worker_categories;


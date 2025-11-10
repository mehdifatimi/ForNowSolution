# إصلاح RLS Policies لجدول Types

## المشكلة
إذا كانت صفحة `/admin/housekeeping/types` تظهر "Aucun type trouvé"، قد تكون المشكلة في RLS policies.

## الحل

قم بتشغيل هذا SQL في Supabase SQL Editor:

```sql
-- تفعيل RLS على جدول types
ALTER TABLE types ENABLE ROW LEVEL SECURITY;

-- حذف Policies القديمة إذا كانت موجودة
DROP POLICY IF EXISTS "Allow public read access to types" ON types;
DROP POLICY IF EXISTS "Allow authenticated users to insert types" ON types;
DROP POLICY IF EXISTS "Allow authenticated users to update types" ON types;
DROP POLICY IF EXISTS "Allow authenticated users to delete types" ON types;

-- إنشاء Policies جديدة
CREATE POLICY "Allow public read access to types"
ON types FOR SELECT TO public, authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert types"
ON types FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update types"
ON types FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete types"
ON types FOR DELETE TO authenticated USING (true);

-- التحقق من Policies
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'types'
ORDER BY cmd;
```

## التحقق من البيانات

قم بتشغيل هذا SQL للتحقق من وجود البيانات:

```sql
-- التحقق من عدد Types
SELECT COUNT(*) as total_types FROM types;

-- عرض جميع Types
SELECT id, name, name_fr, name_ar, name_en, category_house_id, is_active 
FROM types 
ORDER BY id;
```

## التحقق من Console Logs

افتح Developer Console في المتصفح (F12) وتحقق من:
- `[AdminTypesCrud] Loaded types: X types`
- `[AdminTypesCrud] Types data: [...]`

إذا كان العدد 0، فالمشكلة في:
1. البيانات لم يتم إدراجها بعد - قم بتشغيل `INSERT_TYPES_DATA.sql`
2. RLS policies تمنع القراءة - قم بتشغيل SQL أعلاه


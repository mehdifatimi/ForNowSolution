# إصلاح RLS Policies لجدول Type Options

## المشكلة
إذا كانت صفحة "Gestion des options" تظهر "0 option trouvée"، قد تكون المشكلة في RLS policies.

## الحل

قم بتشغيل هذا SQL في Supabase SQL Editor:

```sql
-- تفعيل RLS على جدول type_options
ALTER TABLE type_options ENABLE ROW LEVEL SECURITY;

-- حذف Policies القديمة إذا كانت موجودة
DROP POLICY IF EXISTS "Allow public read access to type_options" ON type_options;
DROP POLICY IF EXISTS "Allow authenticated users to insert type_options" ON type_options;
DROP POLICY IF EXISTS "Allow authenticated users to update type_options" ON type_options;
DROP POLICY IF EXISTS "Allow authenticated users to delete type_options" ON type_options;

-- إنشاء Policies جديدة
CREATE POLICY "Allow public read access to type_options"
ON type_options FOR SELECT TO public, authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert type_options"
ON type_options FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update type_options"
ON type_options FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete type_options"
ON type_options FOR DELETE TO authenticated USING (true);

-- التحقق من Policies
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'type_options'
ORDER BY cmd;
```

## التحقق من البيانات

قم بتشغيل هذا SQL للتحقق من وجود البيانات:

```sql
-- التحقق من عدد Type Options
SELECT COUNT(*) as total_options FROM type_options;

-- عرض جميع Type Options
SELECT id, type_id, name_fr, name_ar, name_en, image 
FROM type_options 
ORDER BY type_id, id;

-- عرض Type Options لنوع معين (مثلاً type_id = 18)
SELECT id, type_id, name_fr, name_ar, name_en, image 
FROM type_options 
WHERE type_id = 18
ORDER BY id;
```

## التحقق من Console Logs

افتح Developer Console في المتصفح (F12) وتحقق من:
- `[AdminTypesCrud] Loading type options for type_id: 18`
- `[AdminTypesCrud] Loaded type options: X options`
- `[AdminTypesCrud] Type options data: [...]`

إذا كان العدد 0، فالمشكلة في:
1. البيانات لم يتم إدراجها بعد - قم بتشغيل `INSERT_TYPE_OPTIONS_DATA.sql`
2. RLS policies تمنع القراءة - قم بتشغيل SQL أعلاه
3. `type_id` غير صحيح - تحقق من أن `type_id = 18` موجود في جدول `types`


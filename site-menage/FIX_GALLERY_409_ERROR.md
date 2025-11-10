# إصلاح خطأ 409 عند حفظ بيانات Gallery

## المشكلة
```
Failed to load resource: the server responded with a status of 409 (Conflict)
Error saving gallery image
```

## الأسباب المحتملة

1. **RLS Policy غير موجودة** - يجب إضافة policies لجدول `gallery`
2. **Foreign key constraint** - `category_gallery_id` غير موجود في جدول `category_gallery`
3. **مشكلة في البيانات** - بيانات غير صحيحة

## الحل خطوة بخطوة

### الخطوة 1: إضافة RLS Policies لجدول gallery

افتح Supabase Dashboard → **SQL Editor** والصق:

```sql
-- تفعيل RLS على جدول gallery
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- حذف Policies القديمة (إذا كانت موجودة)
DROP POLICY IF EXISTS "Allow public read access to gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated users to insert gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated users to update gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated users to delete gallery" ON gallery;

-- Policy 1: القراءة للجميع
CREATE POLICY "Allow public read access to gallery"
ON gallery
FOR SELECT
TO public, authenticated
USING (true);

-- Policy 2: الإدراج للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to insert gallery"
ON gallery
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: التحديث للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to update gallery"
ON gallery
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 4: الحذف للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to delete gallery"
ON gallery
FOR DELETE
TO authenticated
USING (true);
```

### الخطوة 2: التحقق من وجود الفئات

```sql
-- التحقق من وجود فئات في category_gallery
SELECT id, name_fr, name_ar, name_en
FROM category_gallery
WHERE is_active = true
ORDER BY id;
```

يجب أن ترى قائمة بالفئات. إذا كانت القائمة فارغة، يجب إضافة فئات أولاً.

### الخطوة 3: التحقق من Foreign Key

```sql
-- التحقق من أن category_gallery_id موجود
-- استبدل 1 برقم الفئة التي تحاول استخدامها
SELECT id FROM category_gallery WHERE id = 1;
```

إذا لم يكن موجوداً، يجب استخدام فئة موجودة.

### الخطوة 4: التحقق من Policies

```sql
-- عرض جميع Policies على جدول gallery
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'gallery';
```

يجب أن ترى 4 policies على الأقل.

## الحل السريع (كل شيء في مرة واحدة)

```sql
-- 1. تفعيل RLS
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- 2. إنشاء Policies (آمن - يتحقق من الوجود أولاً)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'gallery' 
    AND policyname = 'Allow public read access to gallery'
  ) THEN
    CREATE POLICY "Allow public read access to gallery"
    ON gallery FOR SELECT TO public, authenticated
    USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'gallery' 
    AND policyname = 'Allow authenticated users to insert gallery'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert gallery"
    ON gallery FOR INSERT TO authenticated
    WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'gallery' 
    AND policyname = 'Allow authenticated users to update gallery'
  ) THEN
    CREATE POLICY "Allow authenticated users to update gallery"
    ON gallery FOR UPDATE TO authenticated
    USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'gallery' 
    AND policyname = 'Allow authenticated users to delete gallery'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete gallery"
    ON gallery FOR DELETE TO authenticated
    USING (true);
  END IF;
END $$;
```

## اختبار

بعد إضافة Policies:

1. أعد تحميل صفحة "Gestion des Images de Galerie"
2. اضغط **+ Ajouter une Image**
3. اختر فئة موجودة وصورة
4. اضغط **Créer**
5. يجب أن تعمل العملية بنجاح ✅

## استكشاف الأخطاء

### خطأ 409 (Conflict)
**الأسباب:**
- RLS policy تمنع الإدراج
- Foreign key constraint violation
- بيانات غير صحيحة

**الحل:**
1. أضف RLS policies كما هو موضح أعلاه
2. تأكد من أن `category_gallery_id` موجود في جدول `category_gallery`
3. تأكد من تسجيل الدخول

### خطأ 23503 (Foreign key violation)
**السبب:** `category_gallery_id` غير موجود
**الحل:** استخدم فئة موجودة من القائمة المنسدلة

### خطأ 42501 (Permission denied)
**السبب:** RLS policy تمنع العملية
**الحل:** أضف RLS policies كما هو موضح أعلاه


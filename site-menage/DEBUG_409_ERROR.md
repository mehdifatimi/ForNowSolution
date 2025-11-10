# تشخيص خطأ 409 - Gallery Insert

## المشكلة
خطأ 409 (Conflict) عند محاولة إدراج صورة في جدول `gallery` رغم أن:
- ✅ RLS policies موجودة
- ✅ المستخدم مسجل دخول
- ✅ البيانات صحيحة
- ✅ الصورة رُفعت بنجاح

## الأسباب المحتملة

### 1. مشكلة في Foreign Key Constraint
```sql
-- التحقق من أن category_gallery_id موجود
SELECT id FROM category_gallery WHERE id = 2;
```

### 2. مشكلة في RLS Policy للإدراج
```sql
-- التحقق من RLS policy للإدراج
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'gallery'
AND cmd = 'INSERT';
```

يجب أن ترى:
- `policyname`: "Allow authenticated users to insert gallery"
- `cmd`: "INSERT"
- `roles`: "{authenticated}"
- `with_check`: "true"

### 3. مشكلة في نوع البيانات
```sql
-- التحقق من بنية جدول gallery
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'gallery'
ORDER BY ordinal_position;
```

### 4. مشكلة في RLS على جدول category_gallery
```sql
-- التحقق من RLS على category_gallery
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'category_gallery';
```

إذا كان RLS مفعّل على `category_gallery` بدون policies للقراءة، قد يفشل JOIN في SELECT.

## الحلول

### الحل 1: التحقق من RLS على category_gallery
```sql
-- تفعيل RLS على category_gallery (إن لم يكن مفعّل)
ALTER TABLE category_gallery ENABLE ROW LEVEL SECURITY;

-- إضافة policy للقراءة
DROP POLICY IF EXISTS "Allow public read access to category_gallery" ON category_gallery;
CREATE POLICY "Allow public read access to category_gallery"
ON category_gallery FOR SELECT TO public, authenticated
USING (true);
```

### الحل 2: إعادة إنشاء RLS Policy للإدراج
```sql
-- حذف policy القديم
DROP POLICY IF EXISTS "Allow authenticated users to insert gallery" ON gallery;

-- إنشاء policy جديد
CREATE POLICY "Allow authenticated users to insert gallery"
ON gallery
FOR INSERT
TO authenticated
WITH CHECK (true);
```

### الحل 3: محاولة الإدراج مباشرة من SQL
```sql
-- محاولة إدراج مباشرة (للتشخيص)
INSERT INTO gallery (category_gallery_id, "order", is_active, image_path)
VALUES (2, 7, true, 'gallery/test.jpg')
RETURNING *;
```

إذا نجح هذا، المشكلة في الكود. إذا فشل، المشكلة في قاعدة البيانات.

### الحل 4: التحقق من Constraints
```sql
-- عرض جميع constraints على جدول gallery
SELECT
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'gallery'::regclass;
```

## خطوات التشخيص

1. **افتح Console في المتصفح (F12)**
2. **جرب إضافة صورة جديدة**
3. **انظر إلى Console logs** - يجب أن ترى:
   ```
   [Gallery] Insert response: { ... }
   [Gallery] Error saving gallery image: { ... }
   [Gallery] Full error object: { ... }
   [Gallery] Detailed error message: ...
   ```
4. **انسخ تفاصيل الخطأ الكاملة** وأرسلها

## معلومات مفيدة للتشخيص

من Console logs الحالية:
- ✅ `category_gallery_id`: 2
- ✅ `order`: 7
- ✅ `is_active`: true
- ✅ `image_path`: "gallery/gallery_1762602701458_0abtbh.jpg"
- ✅ User ID: 90c6141f-b4c5-489a-bae3-6257cb52d882
- ✅ Authenticated: true

المشكلة ليست في البيانات أو المصادقة. يجب فحص:
1. RLS policies على `category_gallery`
2. Constraints على `gallery`
3. نوع البيانات في `gallery`


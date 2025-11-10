# إصلاح Row Level Security (RLS) لجدول category_gallery

## المشكلة
إذا ظهر خطأ عند محاولة إضافة/تحديث/حذف فئات المعرض:
```
new row violates row-level security policy for table "category_gallery"
```

## الحل: إضافة سياسات RLS

### الطريقة السريعة: استخدام SQL Editor

افتح Supabase Dashboard → **SQL Editor** والصق الكود التالي:

```sql
-- تفعيل RLS على جدول category_gallery
ALTER TABLE category_gallery ENABLE ROW LEVEL SECURITY;

-- السماح بقراءة الفئات للجميع
CREATE POLICY "Allow public read access to category_gallery"
ON category_gallery
FOR SELECT
TO public, authenticated
USING (true);

-- السماح بإضافة فئات للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to insert category_gallery"
ON category_gallery
FOR INSERT
TO authenticated
WITH CHECK (true);

-- السماح بتحديث الفئات للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to update category_gallery"
ON category_gallery
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- السماح بحذف الفئات للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to delete category_gallery"
ON category_gallery
FOR DELETE
TO authenticated
USING (true);
```

### التحقق من السياسات

```sql
-- عرض جميع السياسات على جدول category_gallery
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'category_gallery';
```

## ملاحظات

- هذه السياسات تسمح لأي مستخدم مسجل بإدارة فئات المعرض
- للإنتاج، قد ترغب في تقييد الوصول للمستخدمين المصرح لهم فقط


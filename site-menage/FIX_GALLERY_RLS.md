# إصلاح Row Level Security (RLS) لجدول gallery

## المشكلة
إذا ظهر خطأ عند محاولة إضافة/تحديث/حذف صور المعرض:
```
new row violates row-level security policy for table "gallery"
```

## الحل: إضافة سياسات RLS

### الطريقة السريعة: استخدام SQL Editor

افتح Supabase Dashboard → **SQL Editor** والصق الكود التالي:

```sql
-- تفعيل RLS على جدول gallery
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- السماح بقراءة الصور للجميع
CREATE POLICY "Allow public read access to gallery"
ON gallery
FOR SELECT
TO public, authenticated
USING (true);

-- السماح بإضافة صور للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to insert gallery"
ON gallery
FOR INSERT
TO authenticated
WITH CHECK (true);

-- السماح بتحديث الصور للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to update gallery"
ON gallery
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- السماح بحذف الصور للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to delete gallery"
ON gallery
FOR DELETE
TO authenticated
USING (true);
```

### التحقق من السياسات

```sql
-- عرض جميع السياسات على جدول gallery
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'gallery';
```

## ملاحظات

- هذه السياسات تسمح لأي مستخدم مسجل بإدارة صور المعرض
- للإنتاج، قد ترغب في تقييد الوصول للمستخدمين المصرح لهم فقط


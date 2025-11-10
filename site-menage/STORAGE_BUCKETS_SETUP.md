# إعداد Storage Buckets في Supabase

## Buckets المطلوبة

يجب إنشاء 3 buckets في Supabase Storage:

1. **products** - لصور المنتجات
2. **gallery** - لصور المعرض
3. **employees** - لصور الموظفين

## خطوات إنشاء Buckets

### الطريقة 1: من واجهة Supabase (الأسهل)

1. افتح [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. اذهب إلى **Storage** من القائمة الجانبية
4. لكل bucket:

#### Bucket: products
1. اضغط **New bucket**
2. أدخل:
   - **Name:** `products`
   - **Public bucket:** ✅ **فعّل** (مهم جداً!)
3. اضغط **Create bucket**

#### Bucket: gallery
1. اضغط **New bucket**
2. أدخل:
   - **Name:** `gallery`
   - **Public bucket:** ✅ **فعّل** (مهم جداً!)
3. اضغط **Create bucket**

#### Bucket: employees
1. اضغط **New bucket**
2. أدخل:
   - **Name:** `employees`
   - **Public bucket:** ✅ **فعّل** (مهم جداً!)
3. اضغط **Create bucket**

### الطريقة 2: من SQL Editor (إذا لم تعمل الواجهة)

```sql
-- إنشاء bucket products
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('products', 'products', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- إنشاء bucket gallery
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('gallery', 'gallery', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- إنشاء bucket employees
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('employees', 'employees', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true;
```

## RLS Policies للـ Storage

بعد إنشاء Buckets، شغّل `COMPLETE_RLS_AND_STORAGE_SETUP.sql` لإضافة RLS Policies.

أو شغّل هذا الكود:

```sql
-- تفعيل Buckets كـ public
UPDATE storage.buckets 
SET public = true 
WHERE name IN ('products', 'gallery', 'employees');

-- RLS Policies لـ products
CREATE POLICY "Allow public read access to products"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'products');

CREATE POLICY "Allow authenticated users to upload to products"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Allow authenticated users to update products"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'products') WITH CHECK (bucket_id = 'products');

CREATE POLICY "Allow authenticated users to delete from products"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'products');

-- RLS Policies لـ gallery
CREATE POLICY "Allow public read access to gallery"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'gallery');

CREATE POLICY "Allow authenticated users to upload to gallery"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Allow authenticated users to update gallery"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'gallery') WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Allow authenticated users to delete from gallery"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'gallery');

-- RLS Policies لـ employees
CREATE POLICY "Allow public read access to employees"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'employees');

CREATE POLICY "Allow authenticated users to upload to employees"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'employees');

CREATE POLICY "Allow authenticated users to update employees"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'employees') WITH CHECK (bucket_id = 'employees');

CREATE POLICY "Allow authenticated users to delete from employees"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'employees');
```

## التحقق من Buckets

```sql
-- التحقق من وجود Buckets
SELECT name, public, created_at
FROM storage.buckets
WHERE name IN ('products', 'gallery', 'employees');
```

يجب أن ترى:
- `name = 'products'`, `public = true`
- `name = 'gallery'`, `public = true`
- `name = 'employees'`, `public = true`

## التحقق من Storage RLS Policies

```sql
-- التحقق من Storage Policies
SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND (policyname LIKE '%products%' 
     OR policyname LIKE '%gallery%'
     OR policyname LIKE '%employees%')
ORDER BY policyname;
```

يجب أن ترى 12 policies على الأقل (4 لكل bucket).

## ملاحظات مهمة

1. **Public Buckets**: جميع Buckets يجب أن تكون `public = true` للسماح بالقراءة العامة
2. **RLS Policies**: يجب إضافة policies للقراءة والكتابة والحذف
3. **Upload Location**: رفع الملفات في **root** الـ bucket (ليس في subfolder)
4. **File Size**: الحد الأقصى 50MB لكل ملف (يمكن تعديله)


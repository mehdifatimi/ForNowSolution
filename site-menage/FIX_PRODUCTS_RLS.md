# حل مشكلة Row Level Security (RLS) لجدول Products

## المشكلة
عند محاولة إضافة منتج جديد، يظهر الخطأ:
```
new row violates row-level security policy for table "products"
```

## السبب
Supabase يستخدم Row Level Security (RLS) لحماية البيانات. يجب إضافة سياسات تسمح بـ:
- **SELECT**: قراءة المنتجات
- **INSERT**: إضافة منتجات جديدة
- **UPDATE**: تحديث المنتجات
- **DELETE**: حذف المنتجات

## الحل: إضافة سياسات RLS

### الطريقة 1: استخدام Supabase Dashboard (الأسهل)

1. افتح Supabase Dashboard → **Authentication** → **Policies**
2. اختر جدول **`products`**
3. اضغط **New Policy**

#### سياسة 1: السماح بقراءة المنتجات للجميع (SELECT)

- **Policy Name**: `Allow public read access to products`
- **Allowed Operation**: `SELECT`
- **Policy Definition**: 
  ```sql
  true
  ```
- **Target Roles**: `public`, `authenticated`

#### سياسة 2: السماح بإضافة منتجات للمستخدمين المسجلين (INSERT)

- **Policy Name**: `Allow authenticated users to insert products`
- **Allowed Operation**: `INSERT`
- **Policy Definition**: 
  ```sql
  auth.role() = 'authenticated'
  ```
- **Target Roles**: `authenticated`

#### سياسة 3: السماح بتحديث المنتجات للمستخدمين المسجلين (UPDATE)

- **Policy Name**: `Allow authenticated users to update products`
- **Allowed Operation**: `UPDATE`
- **Policy Definition**: 
  ```sql
  auth.role() = 'authenticated'
  ```
- **Target Roles**: `authenticated`

#### سياسة 4: السماح بحذف المنتجات للمستخدمين المسجلين (DELETE)

- **Policy Name**: `Allow authenticated users to delete products`
- **Allowed Operation**: `DELETE`
- **Policy Definition**: 
  ```sql
  auth.role() = 'authenticated'
  ```
- **Target Roles**: `authenticated`

### الطريقة 2: استخدام SQL Editor (الأسرع)

افتح Supabase Dashboard → **SQL Editor** والصق الكود التالي:

```sql
-- 1. تفعيل RLS على جدول products (إذا لم يكن مفعلاً)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. السماح بقراءة المنتجات للجميع
CREATE POLICY "Allow public read access to products"
ON products
FOR SELECT
TO public, authenticated
USING (true);

-- 3. السماح بإضافة منتجات للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 4. السماح بتحديث المنتجات للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to update products"
ON products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. السماح بحذف المنتجات للمستخدمين المسجلين
CREATE POLICY "Allow authenticated users to delete products"
ON products
FOR DELETE
TO authenticated
USING (true);
```

### الطريقة 3: سياسات أكثر أماناً (للمستخدمين المصرح لهم فقط)

إذا كنت تريد تقييد الوصول للمستخدمين المصرح لهم فقط (مثل الأدمن):

```sql
-- تفعيل RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- قراءة المنتجات للجميع
CREATE POLICY "Allow public read access to products"
ON products
FOR SELECT
TO public, authenticated
USING (true);

-- إضافة/تحديث/حذف للمستخدمين المصرح لهم فقط
-- (يجب أن يكون لديك جدول admins أو roles للتحقق من الصلاحيات)

-- مثال: إذا كان لديك جدول admins
CREATE POLICY "Allow admins to insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
    AND admins.is_active = true
  )
);

CREATE POLICY "Allow admins to update products"
ON products
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
    AND admins.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
    AND admins.is_active = true
  )
);

CREATE POLICY "Allow admins to delete products"
ON products
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email'
    AND admins.is_active = true
  )
);
```

## التحقق من السياسات

بعد إضافة السياسات، تحقق من وجودها:

```sql
-- عرض جميع السياسات على جدول products
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'products';
```

## اختبار

بعد إضافة السياسات:

1. تأكد من تسجيل الدخول في التطبيق
2. حاول إضافة منتج جديد
3. يجب أن تعمل العملية بنجاح

## ملاحظات مهمة

1. **السياسات البسيطة (الطريقة 2)**: تسمح لأي مستخدم مسجل بإضافة/تحديث/حذف المنتجات. مناسبة للتطوير والاختبار.

2. **السياسات الآمنة (الطريقة 3)**: تقيد الوصول للمستخدمين المصرح لهم فقط. مناسبة للإنتاج.

3. **إذا كنت تريد السماح للجميع بإضافة المنتجات** (غير موصى به للإنتاج):
   ```sql
   CREATE POLICY "Allow anyone to insert products"
   ON products
   FOR INSERT
   TO public
   WITH CHECK (true);
   ```

## استكشاف الأخطاء

إذا استمرت المشكلة:

1. تحقق من أن RLS مفعّل:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'products';
   ```
   يجب أن يكون `rowsecurity = true`

2. تحقق من وجود السياسات:
   ```sql
   SELECT policyname, cmd 
   FROM pg_policies 
   WHERE tablename = 'products';
   ```

3. تحقق من أن المستخدم مسجل:
   - افتح Console في المتصفح
   - اكتب: `localStorage.getItem('supabase.auth.token')`
   - يجب أن يكون هناك token

4. إذا كنت تستخدم سياسات الأدمن، تحقق من أن المستخدم موجود في جدول `admins`:
   ```sql
   SELECT * FROM admins WHERE email = 'your-email@example.com';
   ```


# إصلاح خطأ "invalid input syntax for type boolean" في Storage Policies

## المشكلة
عند محاولة إضافة Policy لـ Storage bucket، يظهر الخطأ:
```
ERROR: 22P02: invalid input syntax for type boolean: "products"
```

## الحل

### الطريقة 1: استخدام واجهة Supabase (الأسهل والأكثر موثوقية)

1. اذهب إلى **Storage** → اختر bucket `products`
2. اضغط على **Policies** في القائمة الجانبية
3. اضغط **New Policy**
4. اختر **Create a policy from scratch** أو **For full customization**

5. للقراءة (SELECT):
   - **Policy name**: `Public Read`
   - **Allowed operation**: `SELECT`
   - **Target roles**: اتركه فارغاً أو اختر `public`
   - **USING expression**: 
     ```
     bucket_id = 'products'
     ```
   - اضغط **Review** ثم **Save**

6. للكتابة (INSERT):
   - **Policy name**: `Public Upload`
   - **Allowed operation**: `INSERT`
   - **Target roles**: اتركه فارغاً أو اختر `public`
   - **WITH CHECK expression**:
     ```
     bucket_id = 'products'
     ```
   - اضغط **Review** ثم **Save**

7. للتحديث (UPDATE):
   - **Policy name**: `Public Update`
   - **Allowed operation**: `UPDATE`
   - **Target roles**: اتركه فارغاً أو اختر `public`
   - **USING expression**:
     ```
     bucket_id = 'products'
     ```
   - اضغط **Review** ثم **Save**

8. للحذف (DELETE):
   - **Policy name**: `Public Delete`
   - **Allowed operation**: `DELETE`
   - **Target roles**: اتركه فارغاً أو اختر `public`
   - **USING expression**:
     ```
     bucket_id = 'products'
     ```
   - اضغط **Review** ثم **Save**

### الطريقة 2: استخدام SQL Editor (إذا فشلت الطريقة 1)

انسخ والصق الكود التالي في SQL Editor:

```sql
-- حذف Policies القديمة إن وجدت (اختياري)
DROP POLICY IF EXISTS "Public Read" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Policy للقراءة
CREATE POLICY "Public Read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- Policy للكتابة
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'products');

-- Policy للتحديث
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');

-- Policy للحذف
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'products');
```

### الطريقة 3: إذا استمر الخطأ (استخدام صيغة بديلة)

إذا استمر الخطأ، جرب هذه الصيغة:

```sql
-- Policy للقراءة
CREATE POLICY "Public Read"
ON storage.objects FOR SELECT
TO public
USING ((bucket_id)::text = 'products'::text);

-- Policy للكتابة
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK ((bucket_id)::text = 'products'::text);

-- Policy للتحديث
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO public
USING ((bucket_id)::text = 'products'::text)
WITH CHECK ((bucket_id)::text = 'products'::text);

-- Policy للحذف
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
TO public
USING ((bucket_id)::text = 'products'::text);
```

## ملاحظات مهمة

1. **Public bucket**: تأكد من أن الـ bucket **public** (يظهر أيقونة 🔓)
2. **TO public**: هذا يسمح للجميع بالوصول (إذا كان الـ bucket public)
3. **إذا كنت تريد فقط للمستخدمين المسجلين**: استبدل `TO public` بـ `TO authenticated`

## التحقق من الإعداد

بعد إضافة Policies:
1. اذهب إلى **Storage** → **products** → **Policies**
2. يجب أن ترى 4 Policies (Read, Upload, Update, Delete)
3. جرب رفع صورة من التطبيق

## استكشاف الأخطاء

### الخطأ: "policy already exists"
- احذف الـ Policy القديم أولاً ثم أنشئه مرة أخرى
- أو استخدم `DROP POLICY IF EXISTS` قبل الإنشاء

### الخطأ: "permission denied"
- تأكد من أنك تستخدم حساب Admin
- أو تأكد من أن RLS مفعل على `storage.objects`

### الخطأ: "bucket not found"
- تأكد من أن الـ bucket موجود واسمه `products` بالضبط
- تأكد من أنك في المشروع الصحيح


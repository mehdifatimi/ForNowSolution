# إعداد Supabase Storage لصور المنتجات

## المشكلة
Bucket `products` غير موجود في Supabase Storage، مما يسبب خطأ "Bucket not found" عند محاولة رفع صور المنتجات.

## الحل

### الخطوة 1: فتح Supabase Storage
1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **Storage** من القائمة الجانبية

### الخطوة 2: إنشاء Bucket جديد
1. اضغط على **New bucket** أو **Create bucket**
2. أدخل المعلومات التالية:
   - **Name**: `products`
   - **Public bucket**: ✅ **فعّل هذا الخيار** (مهم جداً!)
   - **File size limit**: (اختياري) يمكنك ترك القيمة الافتراضية أو تحديد حد أقصى مثل `5MB`
   - **Allowed MIME types**: (اختياري) يمكنك تحديد `image/*` للسماح بجميع أنواع الصور

3. اضغط **Create bucket**

### الخطوة 3: إعداد Row Level Security (RLS) Policies

بعد إنشاء الـ bucket، يجب إضافة Policies للسماح بالقراءة والكتابة:

#### الطريقة 1: من خلال واجهة Supabase (أسهل)

1. بعد إنشاء الـ bucket، اضغط على **Policies** بجانب اسم الـ bucket
2. اضغط **New Policy**
3. اختر **For full customization** أو **Create a policy from scratch**

4. أضف Policy للقراءة (SELECT):
   - **Policy name**: `Allow public read access`
   - **Allowed operation**: `SELECT`
   - **Policy definition**: 
     ```sql
     (bucket_id = 'products')
     ```
   - اضغط **Review** ثم **Save policy**

5. أضف Policy للكتابة (INSERT):
   - **Policy name**: `Allow authenticated insert`
   - **Allowed operation**: `INSERT`
   - **Policy definition**:
     ```sql
     (bucket_id = 'products')
     ```
   - اضغط **Review** ثم **Save policy**

**ملاحظة**: إذا كان الـ bucket **public**، يمكنك استخدام نفس الشرط للجميع.

#### الطريقة 2: من خلال SQL Editor (أسرع)

1. اذهب إلى **SQL Editor**
2. انسخ والصق الكود التالي:

```sql
-- Policy للسماح للجميع بقراءة الصور
CREATE POLICY "Allow public read access to products"
ON storage.objects FOR SELECT
USING ((bucket_id)::text = 'products'::text);

-- Policy للسماح للجميع برفع الصور (إذا كان الـ bucket public)
CREATE POLICY "Allow public insert to products"
ON storage.objects FOR INSERT
WITH CHECK ((bucket_id)::text = 'products'::text);

-- Policy للسماح للجميع بتحديث الصور
CREATE POLICY "Allow public update to products"
ON storage.objects FOR UPDATE
USING ((bucket_id)::text = 'products'::text);

-- Policy للسماح للجميع بحذف الصور
CREATE POLICY "Allow public delete to products"
ON storage.objects FOR DELETE
USING ((bucket_id)::text = 'products'::text);
```

**أو استخدام صيغة أبسط (إذا كان الـ bucket public):**

```sql
-- Policy للسماح للجميع بقراءة الصور
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Policy للسماح للجميع برفع الصور
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');

-- Policy للسماح للجميع بتحديث الصور
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products');

-- Policy للسماح للجميع بحذف الصور
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'products');
```

**ملاحظة**: إذا ظهر خطأ "invalid input syntax for type boolean"، استخدم الصيغة الأولى مع `::text` cast.

3. اضغط **Run**

### الخطوة 4: التحقق من الإعداد

1. اذهب إلى **Storage** → **products**
2. تأكد من أن الـ bucket **Public** (يظهر أيقونة 🔓)
3. جرب رفع صورة من خلال التطبيق

## ملاحظات مهمة

1. **Public bucket**: يجب أن يكون الـ bucket **public** حتى يمكن الوصول إلى الصور من المتصفح
2. **RLS Policies**: حتى لو كان الـ bucket public، قد تحتاج Policies للسماح بالكتابة
3. **File paths**: الكود يستخدم مسار بسيط مثل `filename.jpg` داخل الـ bucket (بدون `products/` prefix)

## بعد الإعداد

بعد إنشاء الـ bucket وإضافة Policies، يجب أن:
- ✅ تختفي رسالة "Bucket not found"
- ✅ يمكن رفع صور المنتجات بنجاح
- ✅ يمكن عرض الصور في التطبيق

## استكشاف الأخطاء

### الخطأ: "Bucket not found"
- تأكد من أن اسم الـ bucket هو `products` بالضبط (بدون مسافات أو أحرف كبيرة)
- تأكد من أن الـ bucket تم إنشاؤه في المشروع الصحيح

### الخطأ: "new row violates row-level security policy"
- تأكد من إضافة Policies للـ bucket
- تأكد من أن المستخدم مسجل دخول (authenticated) إذا كنت تستخدم policy للـ authenticated users

### الصور لا تظهر
- تأكد من أن الـ bucket **public**
- تحقق من أن URL الصورة صحيح
- افتح URL الصورة مباشرة في المتصفح للتحقق


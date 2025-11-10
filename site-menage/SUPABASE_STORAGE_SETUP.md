# إعداد Supabase Storage لرفع صور الموظفين

## المشكلة
عند محاولة رفع صورة موظف، قد يظهر خطأ:
- `Failed to retrieve folder contents from "employees": Failed to fetch`
- هذا يعني أن bucket "employees" غير موجود أو غير مُعد بشكل صحيح

## الحل خطوة بخطوة

### 1. إنشاء Storage Bucket

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. اذهب إلى **Storage** في القائمة الجانبية (أيقونة الملفات/المجلدات)
4. إذا رأيت رسالة "No buckets yet" أو قائمة فارغة، اضغط **New bucket**
5. في النافذة المنبثقة، أدخل:
   - **Name:** `employees` (يجب أن يكون بالضبط هذا الاسم)
   - **Public bucket:** ✅ فعّل هذا الخيار (لإتاحة الصور للعامة)
   - **File size limit:** اتركه افتراضي أو ضع حد (مثل 5MB)
   - **Allowed MIME types:** اتركه فارغاً أو أضف `image/*`
6. اضغط **Create bucket**

**⚠️ مهم:** تأكد من أن الاسم هو `employees` بالضبط (بدون مسافات أو أحرف كبيرة)

### 2. إعداد Policies (الصلاحيات) - مهم جداً!

**إذا كان bucket عام (Public):**
- عادة لا تحتاج Policies إضافية
- لكن إذا ظهرت أخطاء، أضف Policies التالية:

#### الطريقة 1: استخدام واجهة Supabase (الأسهل)

1. بعد إنشاء bucket، اضغط على **employees** bucket
2. اذهب إلى **Policies** (في القائمة الجانبية)
3. اضغط **New Policy**
4. اختر **"For full customization"** أو **"Use template"**
5. أضف Policy للرفع (Upload):
   - **Policy name:** `Allow public uploads`
   - **Allowed operation:** `INSERT`
   - **Target roles:** `public`
   - في حقل **USING expression**، اكتب:
     ```
     bucket_id = 'employees'
     ```
   - في حقل **WITH CHECK expression** (إن وجد)، اكتب:
     ```
     bucket_id = 'employees'
     ```
   - اضغط **Save policy**

6. أضف Policy للقراءة (Read):
   - **Policy name:** `Allow public reads`
   - **Allowed operation:** `SELECT`
   - **Target roles:** `public`
   - في حقل **USING expression**، اكتب:
     ```
     bucket_id = 'employees'
     ```
   - اضغط **Save policy**

#### الطريقة 2: استخدام SQL Editor (للمستخدمين المتقدمين)

1. اذهب إلى **SQL Editor** في Supabase Dashboard
2. نفذ هذا الكود:

```sql
-- Policy للرفع
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'employees');

-- Policy للقراءة
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'employees');
```

**⚠️ مهم:** 
- استخدم `bucket_id = 'employees'` بدون `::text`
- تأكد من أن الاسم بين علامات اقتباس مفردة `'employees'`
- لا تضع `::text` في النهاية

**ملاحظة:** إذا كان bucket عام، قد لا تحتاج هذه Policies. جرب أولاً بدونها.

### 3. (اختياري) إعداد RLS

إذا كنت تريد حماية الصور:
- اترك **Public bucket** معطلاً
- أضف Policies أكثر تفصيلاً

## حل مشكلة "Failed to fetch"

**⚠️ ملاحظة مهمة:** 
- هذا الخطأ قد يظهر في **Supabase Dashboard** عند محاولة عرض محتويات bucket فارغ
- هذا **طبيعي** إذا كان bucket جديداً ولا يحتوي على ملفات بعد
- الخطأ **لن يؤثر** على رفع الملفات من الكود

إذا ظهر الخطأ `Failed to retrieve folder contents from "employees": Failed to fetch`:

### الحل 1: التحقق من وجود Bucket
1. اذهب إلى **Storage** في Supabase Dashboard
2. تحقق من وجود bucket باسم `employees`
3. إذا لم يكن موجوداً، أنشئه كما هو موضح أعلاه

### الحل 2: التحقق من الصلاحيات
1. اضغط على bucket `employees`
2. اذهب إلى **Policies**
3. تأكد من وجود Policies للـ `public` role
4. إذا لم تكن موجودة، أضفها كما هو موضح أعلاه

### الحل 3: التحقق من RLS
1. في صفحة bucket، تحقق من **RLS enabled**
2. إذا كان مفعّل، تأكد من وجود Policies صحيحة
3. أو عطّل RLS مؤقتاً للاختبار

### الحل 4: استخدام bucket مختلف
إذا استمرت المشكلة، يمكنك:
1. إنشاء bucket جديد باسم مختلف (مثل `employee-photos`)
2. تحديث الكود في `SecurityRegister.jsx`:
   ```javascript
   .from('employee-photos')  // بدلاً من 'employees'
   ```

## ملاحظات

- إذا لم تقم بإنشاء bucket، سيتم حفظ البيانات بدون صورة (الكود يتعامل مع هذا)
- الصور ستكون متاحة للعامة إذا كان bucket عام
- يمكنك تغيير اسم bucket في الكود إذا أردت

## اختبار

بعد الإعداد:
1. أعد تحميل الصفحة (F5)
2. جرب رفع نموذج مع صورة
3. تحقق من Console (F12) لرؤية أي أخطاء
4. تحقق من أن الصورة تظهر في Storage
5. تحقق من أن URL الصورة يعمل


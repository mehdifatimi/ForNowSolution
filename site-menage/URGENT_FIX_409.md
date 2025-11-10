# ⚠️ إصلاح عاجل: خطأ 409 عند حفظ Gallery

## المشكلة
```
Failed to load resource: the server responded with a status of 409
Error saving gallery image
```

## الحل السريع (3 دقائق)

### الخطوة 1: افتح Supabase SQL Editor

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. اضغط **SQL Editor** من القائمة الجانبية

### الخطوة 2: الصق هذا الكود واضغط RUN

```sql
-- تفعيل RLS
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- حذف Policies القديمة (إن وجدت)
DROP POLICY IF EXISTS "Allow public read access to gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated users to insert gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated users to update gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated users to delete gallery" ON gallery;

-- إنشاء Policies جديدة
CREATE POLICY "Allow public read access to gallery"
ON gallery FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert gallery"
ON gallery FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update gallery"
ON gallery FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete gallery"
ON gallery FOR DELETE TO authenticated
USING (true);
```

### الخطوة 3: التحقق

```sql
-- التحقق من Policies
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'gallery';
```

يجب أن ترى 4 policies:
- `Allow public read access to gallery` (SELECT)
- `Allow authenticated users to insert gallery` (INSERT)
- `Allow authenticated users to update gallery` (UPDATE)
- `Allow authenticated users to delete gallery` (DELETE)

### الخطوة 4: اختبار

1. أعد تحميل صفحة "Gestion des Images de Galerie"
2. تأكد من تسجيل الدخول
3. جرب إضافة صورة جديدة
4. يجب أن تعمل ✅

## إذا لم يعمل

### تحقق من تسجيل الدخول

افتح Console في المتصفح (F12) وتحقق من:
```
[Gallery] User session: Authenticated
[Gallery] User ID: [رقم المستخدم]
```

إذا رأيت `Not authenticated`، يجب تسجيل الدخول أولاً.

### تحقق من الفئة

```sql
-- التحقق من وجود فئات
SELECT id, name_fr, name_ar, name_en
FROM category_gallery
WHERE is_active = true;
```

يجب أن ترى قائمة بالفئات. إذا كانت فارغة، أضف فئات أولاً.

## ملاحظة مهمة

خطأ 409 عادة يعني:
- ❌ RLS policies غير موجودة → **الحل: أضف Policies كما هو موضح أعلاه**
- ❌ المستخدم غير مسجل دخول → **الحل: سجل دخول**
- ❌ Foreign key constraint → **الحل: استخدم فئة موجودة**


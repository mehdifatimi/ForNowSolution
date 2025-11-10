# إضافة حقل metadata إلى جدول employees

## المشكلة
خطأ: `Could not find the 'metadata' column of 'employees' in the schema cache`

## الحل السريع

### الطريقة 1: استخدام SQL Editor (الأسهل)

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. اذهب إلى **SQL Editor** في القائمة الجانبية
4. انسخ والصق هذا الكود:

```sql
ALTER TABLE employees ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
```

5. اضغط **Run** أو **Execute**

### الطريقة 2: استخدام Table Editor

1. اذهب إلى **Table Editor** في Supabase Dashboard
2. اختر جدول **employees**
3. اضغط **Add Column** أو **Add a new column**
4. املأ الحقول:
   - **Name:** `metadata`
   - **Type:** `jsonb`
   - **Default value:** `{}`
   - **Nullable:** ✅ (يمكن أن يكون NULL)
5. اضغط **Save**

## التحقق

بعد إضافة الحقل:
1. اذهب إلى **Table Editor** → **employees**
2. تحقق من وجود عمود `metadata`
3. جرب إرسال النموذج مرة أخرى

## ملاحظة

- الحقل `metadata` سيحتوي على البيانات الإضافية (birth_date, age, expertise, إلخ)
- إذا كان الجدول يحتوي على بيانات، سيتم إضافة `{}` كقيمة افتراضية


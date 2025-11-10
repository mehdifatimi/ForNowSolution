# إصلاح عاجل: RLS Policies لـ bebe_settings

## المشكلة
```
new row violates row-level security policy for table "bebe_settings"
```

## الحل السريع

قم بتشغيل هذا SQL في Supabase SQL Editor **فوراً**:

```sql
-- تفعيل RLS على bebe_settings
ALTER TABLE bebe_settings ENABLE ROW LEVEL SECURITY;

-- حذف Policies القديمة
DROP POLICY IF EXISTS "Allow public read access to bebe_settings" ON bebe_settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert bebe_settings" ON bebe_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update bebe_settings" ON bebe_settings;
DROP POLICY IF EXISTS "Allow authenticated users to delete bebe_settings" ON bebe_settings;

-- إنشاء Policies جديدة
CREATE POLICY "Allow public read access to bebe_settings"
ON bebe_settings FOR SELECT TO public, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert bebe_settings"
ON bebe_settings FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update bebe_settings"
ON bebe_settings FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete bebe_settings"
ON bebe_settings FOR DELETE TO authenticated
USING (true);
```

## التحقق من Policies

بعد تشغيل SQL، تحقق من وجود Policies:

```sql
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'bebe_settings';
```

يجب أن ترى 4 policies:
- SELECT (public, authenticated)
- INSERT (authenticated)
- UPDATE (authenticated)
- DELETE (authenticated)

## ملاحظة مهمة

تأكد من أنك **مسجل دخول** في Supabase (authenticated user) قبل محاولة إضافة/تحديث/حذف البيانات.


# إضافة الجداول المفقودة في Supabase

## المشكلة
الجداول التالية غير موجودة في Supabase:
- `promotions` (العروض الترويجية)
- `securities` (حراس الأمن)
- `reserve_security` (حجوزات الأمن)

## الحل

### الخطوة 1: فتح Supabase SQL Editor
1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **SQL Editor** من القائمة الجانبية

### الخطوة 2: نسخ ولصق الكود التالي

انسخ الكود التالي والصقه في SQL Editor ثم اضغط **Run**:

```sql
-- ============================================
-- جدول العروض الترويجية (Promotions)
-- ============================================
CREATE TABLE IF NOT EXISTS promotions (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount DECIMAL(5,2) NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- جدول حراس الأمن (Securities)
-- ============================================
CREATE TABLE IF NOT EXISTS securities (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  photo TEXT,
  photo_url TEXT,
  address TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- جدول حجوزات الأمن (Security Reservations)
-- ============================================
CREATE TABLE IF NOT EXISTS reserve_security (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  security_id BIGINT REFERENCES securities(id) ON DELETE SET NULL,
  firstname TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT,
  message TEXT,
  total_price DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  preferred_date TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- إنشاء Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);
CREATE INDEX IF NOT EXISTS idx_promotions_is_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_securities_status ON securities(status);
CREATE INDEX IF NOT EXISTS idx_securities_is_active ON securities(is_active);
CREATE INDEX IF NOT EXISTS idx_reserve_security_user_id ON reserve_security(user_id);
CREATE INDEX IF NOT EXISTS idx_reserve_security_security_id ON reserve_security(security_id);
CREATE INDEX IF NOT EXISTS idx_reserve_security_status ON reserve_security(status);

-- ============================================
-- إنشاء Triggers لتحديث updated_at تلقائياً
-- ============================================
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_securities_updated_at BEFORE UPDATE ON securities
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reserve_security_updated_at BEFORE UPDATE ON reserve_security
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### الخطوة 3: التحقق من إنشاء الجداول
1. اذهب إلى **Table Editor** في Supabase Dashboard
2. تأكد من وجود الجداول التالية:
   - `promotions`
   - `securities`
   - `reserve_security`

### الخطوة 4: إعداد Row Level Security (RLS) - اختياري
إذا كنت تريد حماية البيانات، يمكنك إضافة RLS Policies:

```sql
-- تفعيل RLS على الجداول
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE securities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserve_security ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بقراءة العروض النشطة
CREATE POLICY "Anyone can view active promotions"
ON promotions FOR SELECT
USING (is_active = true);

-- السماح للجميع بقراءة حراس الأمن النشطين
CREATE POLICY "Anyone can view active securities"
ON securities FOR SELECT
USING (is_active = true);

-- السماح للمستخدمين المسجلين بإنشاء حجوزات أمنية
CREATE POLICY "Users can create security reservations"
ON reserve_security FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- السماح للمستخدمين بقراءة حجوزاتهم الخاصة
CREATE POLICY "Users can view their own security reservations"
ON reserve_security FOR SELECT
USING (auth.uid() = user_id);
```

## ملاحظة
إذا كنت تريد أن تكون الجداول متاحة للجميع (بدون RLS)، يمكنك تخطي الخطوة 4.

## بعد إضافة الجداول
بعد إضافة الجداول، يجب أن تختفي الأخطاء التالية:
- `Could not find the table 'public.promotions'`
- `Could not find the table 'public.securities'`
- `Could not find the table 'public.reserve_security'`


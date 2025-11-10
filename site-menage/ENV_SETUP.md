# إعداد ملف .env

## المتغيرات المطلوبة

أضف الأسطر التالية إلى ملف `site-menage/.env`:

```env
# Supabase Configuration (مطلوب)
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

## كيفية الحصول على قيم Supabase

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. اذهب إلى **Settings** > **API**
4. انسخ:
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **anon/public key** → `REACT_APP_SUPABASE_ANON_KEY`

## مثال

```env
REACT_APP_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
```

## ملاحظات

- ⚠️ **لا ترفع ملف `.env` إلى Git** - احتفظ به محلياً فقط
- ✅ استخدم `.env.example` كقالب
- ✅ راجع `QUICK_START_AR.md` للخطوات الكاملة

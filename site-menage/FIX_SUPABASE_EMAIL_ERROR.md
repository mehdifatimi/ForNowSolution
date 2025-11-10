# حل مشكلة "Email address is invalid" في Supabase

## المشكلة
البريد الإلكتروني صحيح (مثل `simo@gmail.com`) لكن Supabase يرفضه مع خطأ 400.

## الحل خطوة بخطوة

### الخطوة 1: التحقق من Site URL

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. اذهب إلى **Authentication** → **Settings**
4. في قسم **Site URL**، أضف:
   ```
   http://localhost:3000
   ```
5. اضغط **Save changes**

### الخطوة 2: إعداد Redirect URLs

1. في نفس الصفحة (Authentication → Settings)
2. ابحث عن قسم **URL Configuration** أو **Redirect URLs**
3. أضف:
   ```
   http://localhost:3000
   http://localhost:3000/**
   ```
4. اضغط **Save changes**

### الخطوة 3: تعطيل Email Confirmation (للتطوير فقط)

**⚠️ مهم جداً:** خيار Email Confirmation موجود في صفحة **Providers الرئيسية** وليس في إعدادات Email.

**الخطوات:**

1. اذهب إلى **Authentication** → **Providers** (أو **Sign In / Providers**)
2. **لا تدخل** إلى إعدادات Email (لا تضغط على السهم)
3. في **أعلى الصفحة الرئيسية** (قبل قائمة Providers)، ستجد:
   - رسالة: **"Users will need to confirm their email address before signing in"**
   - بجانبها يوجد **Toggle Switch** (مفتاح تبديل) - يجب أن يكون **أخضر** (مفعّل)
4. **اضغط على التبديل** لتعطيله (سيصبح رمادي/معطّل)
5. اضغط **Save changes** في الأسفل

**ملاحظة:** 
- هذا الخيار موجود في الصفحة الرئيسية لـ Providers، وليس داخل إعدادات Email
- هذا للتطوير فقط. في الإنتاج، يجب تفعيل Email Confirmation

### الخطوة 4: التحقق من Email Provider

1. اذهب إلى **Authentication** → **Providers**
2. تأكد من أن **Email** provider **مفعّل** (Enabled) - يجب أن يظهر **"Enabled"** بجانب Email
3. (اختياري) اضغط على **Email** لفتح الإعدادات والتحقق من:
   - **Enable Email provider** = ON (أخضر)
   - باقي الخيارات حسب احتياجاتك

### الخطوة 5: اختبار مرة أخرى

بعد تطبيق جميع الخطوات:
1. أعد تحميل الصفحة (F5)
2. جرب التسجيل مرة أخرى
3. افتح Console (F12) لرؤية أي أخطاء

## إذا استمرت المشكلة

### حل بديل 1: التحقق من المفاتيح

1. افتح ملف `.env` في مجلد `site-menage`
2. تأكد من وجود:
   ```
   REACT_APP_SUPABASE_URL=https://xcsfqzeyooncpqbcqihm.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. أعد تشغيل المشروع:
   ```bash
   npm start
   ```

### حل بديل 2: التحقق من إعدادات المشروع

1. في Supabase Dashboard، اذهب إلى **Settings** → **General**
2. تحقق من **Project URL** و **API URL**
3. تأكد من أنها تطابق المفاتيح في ملف `.env`

### حل بديل 3: إنشاء مستخدم يدوياً للاختبار

1. في Supabase Dashboard، اذهب إلى **Authentication** → **Users**
2. اضغط **Add user** → **Create new user**
3. أدخل بريد إلكتروني وكلمة مرور
4. جرب تسجيل الدخول بهذا المستخدم

## معلومات إضافية

- **Status Code:** 400 (Bad Request)
- **Error Message:** "Email address is invalid"
- **Email Tested:** simo@gmail.com (صحيح)

هذا الخطأ عادة ما يكون بسبب:
- Site URL غير مضبوط
- Redirect URLs غير مضبوطة
- Email Confirmation مفعّل بدون إعدادات صحيحة

## بعد الحل

بعد حل المشكلة، يمكنك:
1. تفعيل Email Confirmation للإنتاج
2. إضافة Redirect URLs للإنتاج
3. اختبار التسجيل والتسجيل الدخول


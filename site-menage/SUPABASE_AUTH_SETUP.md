# إعداد Supabase Authentication

## خطوات إعداد المصادقة في Supabase

### 1. تفعيل Email Authentication

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. اذهب إلى **Authentication** → **Providers**
4. فعّل **Email** provider

### 2. إعداد Email Confirmation (اختياري)

إذا كنت تريد تفعيل تأكيد البريد الإلكتروني:

1. في **Authentication** → **Settings**
2. فعّل **Enable email confirmations**
3. أضف **Site URL** (مثل: `http://localhost:3000` للتطوير)

**ملاحظة:** إذا كنت تريد تسجيل الدخول مباشرة بدون تأكيد البريد:
- اترك **Enable email confirmations** معطلاً

### 3. إعداد Redirect URLs

1. في **Authentication** → **URL Configuration**
2. أضف **Redirect URLs**:
   - `http://localhost:3000` (للتطوير)
   - `https://yourdomain.com` (للإنتاج)

### 4. اختبار التسجيل

بعد الإعداد، جرب التسجيل مرة أخرى. إذا ظهر خطأ:

1. افتح **Console** في المتصفح (F12)
2. ابحث عن رسالة الخطأ الكاملة
3. تحقق من:
   - كلمة المرور تحتوي على 6 أحرف على الأقل
   - البريد الإلكتروني صحيح
   - Email provider مفعّل في Supabase

### 5. حل المشاكل الشائعة

#### خطأ 400 (Bad Request)
- تحقق من أن Email provider مفعّل
- تأكد من أن كلمة المرور تحتوي على 6 أحرف على الأقل
- تحقق من صحة البريد الإلكتروني

#### خطأ "Email already registered"
- البريد الإلكتروني مسجل مسبقاً
- استخدم تسجيل الدخول بدلاً من التسجيل

#### خطأ "Invalid email" حتى مع بريد إلكتروني صحيح
إذا ظهر خطأ "Email address is invalid" حتى مع بريد إلكتروني صحيح مثل `simo@gmail.com`:

1. **تحقق من إعدادات Supabase:**
   - اذهب إلى **Authentication** → **Settings**
   - تحقق من أن **Enable email confirmations** مفعّل أو معطّل حسب احتياجاتك
   - تحقق من **Site URL** - يجب أن يكون `http://localhost:3000` للتطوير

2. **تحقق من Email Provider:**
   - اذهب إلى **Authentication** → **Providers**
   - تأكد من أن **Email** provider مفعّل
   - تحقق من أن **Confirm email** معطّل للتطوير (أو مفعّل للإنتاج)

3. **تحقق من Redirect URLs:**
   - اذهب إلى **Authentication** → **URL Configuration**
   - أضف `http://localhost:3000` في **Redirect URLs**
   - أضف `http://localhost:3000/**` أيضاً

4. **تحقق من Console:**
   - افتح Console (F12) في المتصفح
   - ابحث عن رسائل الخطأ الكاملة
   - تحقق من البيانات المرسلة في `Attempting signup with:`

5. **حلول إضافية:**
   - جرب بريد إلكتروني مختلف
   - تأكد من أن كلمة المرور تحتوي على 6 أحرف على الأقل
   - تحقق من أن الاسم يحتوي على حرفين على الأقل

### 6. إعدادات إضافية (اختياري)

#### تعطيل Email Confirmation للتطوير
- في **Authentication** → **Settings**
- عطّل **Enable email confirmations**
- سيتم تسجيل الدخول مباشرة بعد التسجيل

#### إعداد SMTP مخصص
- في **Authentication** → **Settings** → **SMTP Settings**
- أضف معلومات SMTP لإرسال رسائل التأكيد من بريدك الخاص

## ملاحظات مهمة

- في بيئة التطوير، يمكنك تعطيل Email Confirmation لتسهيل الاختبار
- في بيئة الإنتاج، يُنصح بتفعيل Email Confirmation للأمان
- تأكد من إضافة Redirect URLs الصحيحة لتجنب أخطاء إعادة التوجيه


# اختبار الاتصال مع Supabase

## ✅ تم الإعداد!

المفاتيح جاهزة في ملف `.env`

---

## 🧪 اختبار سريع

### الطريقة 1: من Console المتصفح

1. شغّل المشروع:
```bash
npm start
```

2. افتح المتصفح على `http://localhost:3000`
3. اضغط F12 لفتح Developer Tools
4. اذهب إلى Console
5. اكتب:

```javascript
import { supabase } from './lib/supabase';

// اختبار الاتصال
supabase.from('services').select('*').limit(1).then(({ data, error }) => {
  if (error) {
    console.error('❌ خطأ:', error);
  } else {
    console.log('✅ الاتصال ناجح!', data);
  }
});
```

### الطريقة 2: من ملف React

أنشئ ملف `TestConnection.jsx`:

```javascript
import { useEffect } from 'react';
import { supabase } from './lib/supabase';

function TestConnection() {
  useEffect(() => {
    async function test() {
      console.log('🔍 اختبار الاتصال...');
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('❌ خطأ:', error.message);
        alert('خطأ في الاتصال: ' + error.message);
      } else {
        console.log('✅ الاتصال ناجح!', data);
        alert('الاتصال ناجح! عدد السجلات: ' + (data?.length || 0));
      }
    }
    
    test();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>اختبار الاتصال</h2>
      <p>افتح Console (F12) لرؤية النتيجة</p>
    </div>
  );
}

export default TestConnection;
```

ثم استخدمه في `App.jsx`:

```javascript
import TestConnection from './TestConnection';

function App() {
  return <TestConnection />;
}
```

---

## ✅ إذا ظهرت رسالة "Success"

**ممتاز!** الاتصال يعمل. يمكنك الآن:
- استخدام `supabase` في أي مكان
- جلب البيانات
- إضافة/تحديث/حذف البيانات

---

## ❌ إذا ظهر خطأ

### خطأ: "relation does not exist"
**الحل:** لم يتم إنشاء الجداول بعد. اذهب إلى Supabase Dashboard > SQL Editor وشغّل `supabase-schema-complete.sql`

### خطأ: "Invalid API key"
**الحل:** تحقق من ملف `.env` - تأكد من نسخ المفاتيح بشكل صحيح

### خطأ: "Network error"
**الحل:** تحقق من اتصال الإنترنت

---

## 📝 معلومات المشروع

- **URL**: `https://xcsfqzeyooncpqbcqihm.supabase.co`
- **Dashboard**: https://supabase.com/dashboard/project/xcsfqzeyooncpqbcqihm

---

**جاهز للاستخدام! 🚀**


# ورقة غش سريعة - Supabase للمبتدئين

## 📋 العمليات الأساسية

### 1. القراءة (READ)

```javascript
// جلب جميع السجلات
const { data, error } = await supabase
  .from('services')
  .select('*');

// جلب سجلات مع شرط
const { data } = await supabase
  .from('services')
  .select('*')
  .eq('is_active', true);

// جلب سجل واحد فقط
const { data } = await supabase
  .from('services')
  .select('*')
  .eq('id', 1)
  .single();
```

### 2. الإضافة (CREATE)

```javascript
// إضافة سجل واحد
const { data, error } = await supabase
  .from('services')
  .insert([{
    name_ar: 'تنظيف',
    price: 5000
  }]);

// إضافة عدة سجلات
const { data, error } = await supabase
  .from('services')
  .insert([
    { name_ar: 'تنظيف 1', price: 5000 },
    { name_ar: 'تنظيف 2', price: 6000 }
  ]);
```

### 3. التحديث (UPDATE)

```javascript
// تحديث سجل
const { data, error } = await supabase
  .from('services')
  .update({ price: 6000 })
  .eq('id', 1);
```

### 4. الحذف (DELETE)

```javascript
// حذف سجل
const { error } = await supabase
  .from('services')
  .delete()
  .eq('id', 1);
```

---

## 🔍 الفلترة (Filtering)

```javascript
// حيث is_active = true
.eq('is_active', true)

// حيث price أكبر من 1000
.gt('price', 1000)

// حيث price أقل من 5000
.lt('price', 5000)

// حيث name يحتوي على "تنظيف"
.ilike('name_ar', '%تنظيف%')

// عدة شروط
.eq('is_active', true)
.gt('price', 1000)
```

---

## 📊 الترتيب والحد

```javascript
// ترتيب تصاعدي
.order('created_at', { ascending: true })

// ترتيب تنازلي
.order('created_at', { ascending: false })

// جلب 10 سجلات فقط
.limit(10)

// تخطي أول 5 سجلات
.range(5, 14) // من 5 إلى 14
```

---

## 🔐 Authentication

```javascript
// تسجيل حساب جديد
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// تسجيل الدخول
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// تسجيل الخروج
await supabase.auth.signOut();

// جلب المستخدم الحالي
const { data: { user } } = await supabase.auth.getUser();

// الاستماع لتغييرات تسجيل الدخول
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Event:', event);
  console.log('User:', session?.user);
});
```

---

## ⚠️ معالجة الأخطاء

```javascript
const { data, error } = await supabase
  .from('services')
  .select('*');

if (error) {
  console.error('خطأ:', error.message);
  // معالجة الخطأ
} else {
  console.log('البيانات:', data);
  // استخدام البيانات
}
```

---

## 💡 نصائح

1. **دائماً تحقق من `error`** قبل استخدام `data`
2. **استخدم `async/await`** للكود الأسهل
3. **استخدم `.single()`** لجلب سجل واحد فقط
4. **استخدم `useEffect`** لجلب البيانات عند تحميل الصفحة
5. **احفظ المفاتيح في `.env`** ولا ترفعها إلى Git

---

## 🎯 أمثلة سريعة

### جلب الخدمات النشطة فقط

```javascript
const { data } = await supabase
  .from('services')
  .select('*')
  .eq('is_active', true)
  .order('created_at', { ascending: false })
  .limit(10);
```

### البحث في الخدمات

```javascript
const { data } = await supabase
  .from('services')
  .select('*')
  .ilike('name_ar', '%تنظيف%');
```

### جلب حجوزات المستخدم الحالي

```javascript
const { data: { user } } = await supabase.auth.getUser();

const { data } = await supabase
  .from('reservations')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

---

**احفظ هذه الورقة واستخدمها كمرجع سريع!** 📝


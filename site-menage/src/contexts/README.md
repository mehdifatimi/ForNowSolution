# Auth Contexts - Supabase Integration

## الملفات المتوفرة

### 1. `EmployeeAuthContext.jsx` ✅ محدث
- يستخدم Supabase Auth للتحقق من الموظفين
- يقرأ بيانات الموظف من جدول `user_employees`
- متوافق مع الكود الحالي

### 2. `UserAuthContext.jsx` ✅ جديد
- للمستخدمين العاديين
- يستخدم Supabase Auth مباشرة
- يدعم Login, Register, Logout

### 3. `AdminAuthContext.jsx` ✅ جديد
- للمدراء
- يستخدم `adminLogin` من `api-supabase.js`
- يقرأ بيانات Admin من جدول `admins`

---

## كيفية الاستخدام

### في `App.jsx`

```jsx
import { UserAuthProvider } from './contexts/UserAuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { EmployeeAuthProvider } from './contexts/EmployeeAuthContext';

function App() {
  return (
    <UserAuthProvider>
      <AdminAuthProvider>
        <EmployeeAuthProvider>
          {/* باقي التطبيق */}
        </EmployeeAuthProvider>
      </AdminAuthProvider>
    </UserAuthProvider>
  );
}
```

### استخدام User Auth

```jsx
import { useUserAuth } from './contexts/UserAuthContext';

function MyComponent() {
  const { user, loading, login, logout, register } = useUserAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### استخدام Employee Auth

```jsx
import { useEmployeeAuth } from './contexts/EmployeeAuthContext';

function EmployeeComponent() {
  const { employee, loading, login, logout } = useEmployeeAuth();

  // استخدام كما كان من قبل
}
```

### استخدام Admin Auth

```jsx
import { useAdminAuth } from './contexts/AdminAuthContext';

function AdminComponent() {
  const { admin, loading, login, logout } = useAdminAuth();

  // استخدام كما كان من قبل
}
```

---

## ملاحظات مهمة

1. **Employee Auth**: 
   - يتطلب أن يكون الموظف موجوداً في جدول `user_employees`
   - يجب أن يكون `status = true`

2. **User Auth**:
   - يستخدم Supabase Auth مباشرة
   - ينشئ profile تلقائياً في `user_profiles` عند التسجيل

3. **Admin Auth**:
   - يستخدم `adminLogin` من `api-supabase.js`
   - يتطلب أن يكون Admin موجوداً في جدول `admins` مع `is_active = true`

---

## التوافق مع الكود القديم

جميع Contexts تحافظ على التوافق مع الكود القديم:
- `localStorage` keys تبقى كما هي
- نفس structure للـ return values
- نفس error handling



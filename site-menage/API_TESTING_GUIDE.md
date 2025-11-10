# دليل اختبار الـ API والتحقق من JSON Response

## ✅ التصحيحات المُطبقة

### 1. Backend (Laravel) - `EmployeeController.php`

**قبل التصحيح:**
```php
return response()->json([...], 201);
```

**بعد التصحيح:**
```php
return response()->json([
    'success' => true,
    'message' => 'Employee created successfully',
    'data' => $employee,
], 201)->header('Content-Type', 'application/json');
```

**التحسينات:**
- ✅ إضافة `Content-Type: application/json` header بشكل صريح
- ✅ معالجة الأخطاء وإرجاع JSON دائماً
- ✅ معالجة ValidationException وإرجاع JSON
- ✅ Logging للأخطاء

### 2. Frontend (React) - `EmployeeRegister.jsx`

**قبل التصحيح:**
```javascript
const res = await fetch(`${API_BASE_URL}/api/employees`, {
    method: 'POST',
    body: fd
});
const data = await res.json(); // ❌ يسبب خطأ إذا كان HTML
```

**بعد التصحيح:**
```javascript
const res = await fetch(`${API_BASE_URL}/api/employees`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json', // ✅ نطلب JSON صراحة
    },
    body: fd
});

// ✅ التحقق من Content-Type قبل parsing
const contentType = res.headers.get('content-type');
const isJson = contentType && contentType.includes('application/json');

const responseText = await res.text();
let data;

if (isJson) {
    try {
        data = JSON.parse(responseText);
    } catch (jsonError) {
        throw new Error(`Invalid JSON response: ${jsonError.message}`);
    }
} else {
    throw new Error(
        `Server returned non-JSON response (${res.status} ${res.statusText}). ` +
        `Content-Type: ${contentType || 'unknown'}. ` +
        `Response preview: ${responseText.substring(0, 200)}`
    );
}
```

## 🧪 كيفية اختبار الـ API في المتصفح

### طريقة 1: استخدام Developer Tools (Console)

1. **افتح المتصفح** واضغط `F12` لفتح Developer Tools
2. **اذهب إلى تبويب Console**
3. **شغّل الكود التالي:**

```javascript
// اختبار POST request
fetch('http://127.0.0.1:8000/api/employees', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'Test',
        prenom: 'User',
        age: 25,
        email: 'test@example.com',
        adresse: 'Test Address',
        competency_id: 1,
        jours_disponibles: {
            lundi: { start: '09:00', end: '17:00' }
        }
    })
})
.then(res => {
    console.log('Status:', res.status);
    console.log('Content-Type:', res.headers.get('content-type'));
    return res.text();
})
.then(text => {
    console.log('Response:', text);
    try {
        const json = JSON.parse(text);
        console.log('✅ Valid JSON:', json);
    } catch(e) {
        console.error('❌ Not JSON:', text.substring(0, 200));
    }
})
.catch(err => console.error('Error:', err));
```

### طريقة 2: استخدام Network Tab

1. **افتح Developer Tools** (`F12`)
2. **اذهب إلى تبويب Network**
3. **قم بإرسال الطلب** من التطبيق
4. **انقر على الطلب** `/api/employees`
5. **تحقق من:**
   - **Headers → Response Headers:** يجب أن يحتوي على `Content-Type: application/json`
   - **Preview:** يجب أن يظهر JSON منسق
   - **Response:** يجب أن يكون JSON صحيح

### طريقة 3: استخدام curl (Terminal)

```bash
curl -X POST http://127.0.0.1:8000/api/employees \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "prenom": "User",
    "age": 25,
    "email": "test@example.com",
    "adresse": "Test Address",
    "competency_id": 1,
    "jours_disponibles": {
      "lundi": {"start": "09:00", "end": "17:00"}
    }
  }'
```

**التحقق من النتيجة:**
```bash
# إذا كان JSON صحيح، ستظهر:
{"success":true,"message":"Employee created successfully","data":{...}}

# إذا كان HTML، ستظهر:
<!DOCTYPE html>...
```

### طريقة 4: استخدام Postman أو Insomnia

1. **أنشئ طلب جديد** (New Request)
2. **اختر Method:** `POST`
3. **URL:** `http://127.0.0.1:8000/api/employees`
4. **Headers:**
   - `Accept: application/json`
   - `Content-Type: application/json`
5. **Body → raw → JSON:**
```json
{
    "name": "Test",
    "prenom": "User",
    "age": 25,
    "email": "test@example.com",
    "adresse": "Test Address",
    "competency_id": 1,
    "jours_disponibles": {
        "lundi": {"start": "09:00", "end": "17:00"}
    }
}
```
6. **أرسل الطلب** وتحقق من:
   - **Status Code:** يجب أن يكون `201 Created`
   - **Content-Type:** يجب أن يكون `application/json`
   - **Response Body:** يجب أن يكون JSON صحيح

## 🔍 كيفية التحقق من أن الـ endpoint يرجع JSON

### علامات JSON صحيح:
- ✅ Status Code: `200`, `201`, `422`, `500` (ولكن Response يكون JSON)
- ✅ Content-Type header: `application/json`
- ✅ Response Body يبدأ بـ `{` أو `[`
- ✅ يمكن parsing باستخدام `JSON.parse()`

### علامات HTML (خطأ):
- ❌ Content-Type: `text/html`
- ❌ Response Body يبدأ بـ `<!DOCTYPE html>`
- ❌ Status Code قد يكون `200` ولكن المحتوى HTML

## 🛠️ نصائح إضافية

### 1. التأكد من أن Laravel يرجع JSON دائماً

في `bootstrap/app.php`:
```php
->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->render(function (\Exception $e, $request) {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getStatusCode() ?? 500);
        }
    });
})
```

### 2. إضافة Middleware للتحقق من Accept header

```php
// app/Http/Middleware/ForceJsonResponse.php
public function handle(Request $request, Closure $next)
{
    if ($request->is('api/*')) {
        $request->headers->set('Accept', 'application/json');
    }
    return $next($request);
}
```

### 3. استخدام `expectsJson()` في Laravel

```php
if ($request->expectsJson()) {
    return response()->json([...]);
}
```

## ✅ Checklist للتحقق

- [ ] الـ Backend يعمل على `http://127.0.0.1:8000`
- [ ] الـ Route موجود في `routes/api.php`
- [ ] الـ Controller يرجع `response()->json()`
- [ ] الـ Content-Type header موجود في Response
- [ ] الـ Frontend يرسل `Accept: application/json`
- [ ] الـ Frontend يتحقق من Content-Type قبل parsing
- [ ] الأخطاء تُعاد كـ JSON وليس HTML

## 📝 ملاحظات مهمة

1. **FormData vs JSON:**
   - عند إرسال `FormData` (مثل رفع ملفات)، لا تضيف `Content-Type` header يدوياً
   - المتصفح يضيفه تلقائياً مع boundary

2. **CORS:**
   - تأكد من أن `config/cors.php` مُعد بشكل صحيح
   - الـ origin يجب أن يكون مسموح به

3. **Validation Errors:**
   - Laravel يرجع validation errors كـ JSON تلقائياً إذا كان `Accept: application/json` موجود


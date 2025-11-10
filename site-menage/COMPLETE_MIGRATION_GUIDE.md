# دليل التحويل الكامل لصفحات Admin إلى Supabase

## ✅ الملفات المحولة بالفعل

1. **AdminCategoriesCrud.jsx** ✅
2. **AdminCategoryGalleryCrud.jsx** ✅
3. **AdminGalleryCrud.jsx** ✅
4. **AdminProductCrud.jsx** ✅
5. **AdminServicesCrud.jsx** ✅ (يستخدم api-supabase.js)
6. **AdminCategoryHouseCrud.jsx** ✅ (جزئياً - loadCategoriesHouse و loadServices)

## 📝 قالب التحويل

### 1. استبدال الاستيراد

```javascript
// ❌ قبل
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

// ✅ بعد
import { supabase } from '../../lib/supabase';
```

### 2. تحويل loadData

```javascript
// ❌ قبل
const loadData = async () => {
  try {
    setLoading(true);
    const response = await fetch(`${API_BASE_URL}/api/admin/table_name`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (response.status === 401) {
      onAuthError();
      return;
    }

    if (response.ok) {
      const data = await response.json();
      setData(data.data || []);
    } else {
      setError('Erreur lors du chargement');
    }
  } catch (err) {
    console.error('Error loading data:', err);
    setError('Erreur de connexion');
  } finally {
    setLoading(false);
  }
};

// ✅ بعد
const loadData = async () => {
  try {
    setLoading(true);
    setError('');
    
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading data:', error);
      setError('Erreur lors du chargement: ' + error.message);
      return;
    }

    setData(data || []);
  } catch (err) {
    console.error('Exception loading data:', err);
    setError('Erreur de connexion: ' + err.message);
  } finally {
    setLoading(false);
  }
};
```

### 3. تحويل handleSubmit

```javascript
// ❌ قبل
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setError('');
    const url = editingItem 
      ? `${API_BASE_URL}/api/admin/table_name/${editingItem.id}`
      : `${API_BASE_URL}/api/admin/table_name`;
    
    const method = editingItem ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.status === 401) {
      onAuthError();
      return;
    }

    if (response.ok) {
      await loadData();
      setShowForm(false);
      setEditingItem(null);
      resetForm();
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Erreur lors de la sauvegarde');
    }
  } catch (err) {
    console.error('Error saving data:', err);
    setError('Erreur de connexion');
  }
};

// ✅ بعد
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setError('');
    
    let data, error;
    
    if (editingItem) {
      // Update existing item
      const { data: updateData, error: updateError } = await supabase
        .from('table_name')
        .update(formData)
        .eq('id', editingItem.id)
        .select();
      data = updateData && updateData.length > 0 ? updateData[0] : null;
      error = updateError;
    } else {
      // Create new item
      const { data: insertData, error: insertError } = await supabase
        .from('table_name')
        .insert([formData])
        .select();
      data = insertData && insertData.length > 0 ? insertData[0] : null;
      error = insertError;
    }

    if (error) {
      console.error('Error saving data:', error);
      setError('Erreur lors de la sauvegarde: ' + error.message);
      return;
    }

    await loadData();
    setShowForm(false);
    setEditingItem(null);
    resetForm();
  } catch (err) {
    console.error('Exception saving data:', err);
    setError('Erreur de connexion: ' + err.message);
  }
};
```

### 4. تحويل handleDelete

```javascript
// ❌ قبل
const handleDelete = async (id) => {
  if (window.confirm('Êtes-vous sûr de vouloir supprimer ?')) {
    try {
      setError('');
      const response = await fetch(`${API_BASE_URL}/api/admin/table_name/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.status === 401) {
        onAuthError();
        return;
      }

      if (response.ok) {
        await loadData();
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Error deleting data:', err);
      setError('Erreur de connexion');
    }
  }
};

// ✅ بعد
const handleDelete = async (id) => {
  if (window.confirm('Êtes-vous sûr de vouloir supprimer ?')) {
    try {
      setError('');
      
      const { error } = await supabase
        .from('table_name')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting data:', error);
        setError('Erreur lors de la suppression: ' + error.message);
        return;
      }

      await loadData();
    } catch (err) {
      console.error('Exception deleting data:', err);
      setError('Erreur de connexion: ' + err.message);
    }
  }
};
```

### 5. تحويل uploadImage (إذا كان موجوداً)

```javascript
// ❌ قبل
const uploadImage = async (file) => {
  try {
    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/admin/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: formDataUpload
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du téléchargement (${response.status})`);
    }

    const data = await response.json();
    return data.image_url || data.url;
  } catch (err) {
    console.error('Erreur lors du téléchargement:', err);
    setError('Erreur lors du téléchargement: ' + err.message);
    return null;
  } finally {
    setUploadingImage(false);
  }
};

// ✅ بعد
const uploadImage = async (file) => {
  try {
    setUploadingImage(true);
    
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
    const filePath = `category_house/${fileName}`;

    const { data, error } = await supabase.storage
      .from('category_house') // أو اسم bucket المناسب
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('category_house')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error('Erreur lors du téléchargement:', err);
    setError('Erreur lors du téléchargement: ' + err.message);
    return null;
  } finally {
    setUploadingImage(false);
  }
};
```

## 📋 قائمة الملفات المتبقية

### ملفات رئيسية:
- [ ] AdminReservationCrud.jsx
- [ ] AdminTypesCrud.jsx
- [ ] AdminCategoryHouseCrud.jsx (إكمال)
- [ ] AdminTypeCategoryGalleryCrud.jsx
- [ ] AdminEmployeesCrud.jsx
- [ ] AdminOrdersCrud.jsx
- [ ] AdminCartCrud.jsx
- [ ] AdminPromotionsCrud.jsx
- [ ] AdminRatingCrud.jsx

### ملفات Bebe:
- [ ] AdminBebeServicesCrud.jsx
- [ ] AdminBebeReservationsCrud.jsx
- [ ] AdminBebeCategoriesCrud.jsx
- [ ] AdminBebeEmployees.jsx
- [ ] AdminBebeEmployeesValid.jsx
- [ ] AdminBebeRatingsCrud.jsx

### ملفات Jardinage:
- [ ] AdminJardinageServicesCrud.jsx
- [ ] AdminJardinageReservationsCrud.jsx
- [ ] AdminJardinageCategoriesCrud.jsx
- [ ] AdminJardinageEmployees.jsx
- [ ] AdminJardinageEmployeesValid.jsx
- [ ] AdminJardinageRatingsCrud.jsx

### ملفات Security:
- [ ] AdminSecurityCrud.jsx
- [ ] AdminSecurityEmployees.jsx
- [ ] AdminSecurityEmployeesValid.jsx
- [ ] AdminSecurityReservationsCrud.jsx
- [ ] AdminSecurityRolesCrud.jsx

### ملفات HandWorker:
- [ ] AdminHandWorkersCrud.jsx
- [ ] AdminHandWorkerCategoriesCrud.jsx
- [ ] AdminHandWorkerEmployees.jsx
- [ ] AdminHandWorkerReservationsCrud.jsx
- [ ] AdminHandWorkerRegistrationsCrud.jsx
- [ ] AdminValideHandWorkerReservationsCrud.jsx

## 🔐 إضافة RLS Policies

بعد تحويل كل ملف، تأكد من إضافة RLS policies للجدول المقابل في `ADD_ALL_RLS_POLICIES.sql`.

## 📝 ملاحظات

1. **إزالة جميع مراجع API_BASE_URL**: استخدم `grep` للبحث عن `API_BASE_URL` في الملف
2. **إزالة جميع fetch calls**: استبدلها بـ `supabase.from()`
3. **إزالة token من headers**: Supabase يتعامل مع المصادقة تلقائياً
4. **إضافة معالجة أخطاء**: استخدم `console.error` و `setError`
5. **التحقق من أسماء الجداول**: تأكد من أن اسم الجدول في Supabase يطابق ما في الكود


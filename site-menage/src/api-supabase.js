/**
 * Supabase API Client
 * This file replaces the Laravel API calls with Supabase client calls
 */

import { supabase } from './lib/supabase';

// Resolve current language from i18next/localStorage with fallback
const getCurrentLocale = () => {
  try {
    const lng = localStorage.getItem('i18nextLng');
    if (lng && ['fr','ar','en'].includes(lng)) return lng;
  } catch (_) {}
  return 'fr';
};

// Helper to get localized field name
const getLocalizedField = (obj, field, locale) => {
  const localeMap = { fr: 'fr', ar: 'ar', en: 'en' };
  const lang = localeMap[locale] || 'fr';
  return obj[`${field}_${lang}`] || obj[field] || obj[`${field}_fr`] || '';
};

// Global error handler
const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error?.message?.includes('JWT')) {
    // Clear tokens and redirect to login
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    window.dispatchEvent(new CustomEvent('adminAuthError'));
  }
  throw error;
};

// ============================================
// AUTHENTICATION
// ============================================

/**
 * Admin Authentication
 */
export async function adminLogin(email, password) {
  try {
    // Note: For admin auth, you might want to use a custom auth table
    // or use Supabase Auth with custom claims. This is a simplified version.
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      throw new Error('Invalid credentials');
    }

    // In production, use Supabase Auth or verify password hash
    // For now, this is a placeholder - you'll need to implement proper password verification
    // You might want to use Supabase Auth with custom user metadata instead

    // Create a session token (in production, use Supabase Auth)
    const token = btoa(JSON.stringify({ id: data.id, email: data.email }));
    
    return {
      message: 'Login successful',
      admin: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        is_active: data.is_active,
      },
      token: token,
    };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function adminLogout() {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    return { message: 'Logout successful' };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function adminProfile() {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Not authenticated');

    // Decode token and get admin data
    const adminData = JSON.parse(atob(token));
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', adminData.id)
      .single();

    if (error) throw error;

    return {
      admin: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        is_active: data.is_active,
      }
    };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

/**
 * User Authentication (using Supabase Auth)
 */
export async function userLogin(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Login successful',
      token: data.session.access_token,
      user: data.user,
    };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function userRegister(email, password, name) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        }
      }
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Registration successful',
      user: data.user,
    };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function userLogout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { message: 'Logout successful' };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// ============================================
// CONTACTS
// ============================================

export async function postContact(form) {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([{
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getContacts() {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Admin Contacts CRUD
export async function getContactsAdmin(token) {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function createContactAdmin(token, contactData) {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([contactData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function updateContactAdmin(token, id, contactData) {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .update(contactData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function deleteContactAdmin(token, id) {
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Contact deleted successfully' };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// ============================================
// SERVICES
// ============================================

export async function getServices(locale = getCurrentLocale()) {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    // Map data to include localized fields
    return data.map(service => ({
      ...service,
      title: getLocalizedField(service, 'name', locale),
      description: getLocalizedField(service, 'description', locale),
    }));
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getServiceById(id, locale = getCurrentLocale()) {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      title: getLocalizedField(data, 'name', locale),
      description: getLocalizedField(data, 'description', locale),
    };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Admin Services CRUD
export async function getServicesAdmin(token) {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function createServiceAdmin(token, serviceData) {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function updateServiceAdmin(token, id, serviceData) {
  try {
    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function deleteServiceAdmin(token, id) {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Service deleted successfully' };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// ============================================
// CATEGORIES HOUSE
// ============================================

export async function getCategoriesHouse(locale = getCurrentLocale(), serviceId = null) {
  try {
    let query = supabase
      .from('categories_house')
      .select('*');

    if (serviceId) {
      query = query.eq('service_id', serviceId);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(cat => ({
      ...cat,
      name: getLocalizedField(cat, 'name', locale),
      description: getLocalizedField(cat, 'description', locale),
    }));
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getCategoryHouseById(id, locale = getCurrentLocale()) {
  try {
    const { data, error } = await supabase
      .from('categories_house')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      name: getLocalizedField(data, 'name', locale),
      description: getLocalizedField(data, 'description', locale),
    };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// ============================================
// TYPES
// ============================================

export async function getTypes(locale = getCurrentLocale(), serviceId = null, categoryHouseId = null) {
  try {
    let query = supabase
      .from('types')
      .select('*');

    if (serviceId) {
      query = query.eq('service_id', serviceId);
    }
    if (categoryHouseId) {
      query = query.eq('category_house_id', categoryHouseId);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(type => ({
      ...type,
      name: getLocalizedField(type, 'name', locale),
      description: getLocalizedField(type, 'description', locale),
    }));
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getTypeById(id, locale = getCurrentLocale()) {
  try {
    const { data, error } = await supabase
      .from('types')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      name: getLocalizedField(data, 'name', locale),
      description: getLocalizedField(data, 'description', locale),
    };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// ============================================
// TYPE OPTIONS
// ============================================

export async function getTypeOptions(typeId, locale = getCurrentLocale()) {
  try {
    let query = supabase
      .from('type_options')
      .select('*');

    if (typeId) {
      query = query.eq('type_id', typeId);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(option => ({
      ...option,
      name: getLocalizedField(option, 'name', locale),
      description: getLocalizedField(option, 'description', locale),
    }));
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// ============================================
// RESERVATIONS
// ============================================

export async function createReservation(reservationData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('reservations')
      .insert([{
        ...reservationData,
        user_id: user?.id || null,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getReservationsAdmin(token) {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function createReservationAdmin(token, reservationData) {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .insert([reservationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function updateReservationAdmin(token, id, reservationData) {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .update(reservationData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function deleteReservationAdmin(token, id) {
  try {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Reservation deleted successfully' };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function updateReservationStatus(token, id, status) {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// ============================================
// RATINGS
// ============================================

export async function getRatings() {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getAllRatings() {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function submitRating(ratingData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get user IP (client-side approximation)
    const userIp = await fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => data.ip)
      .catch(() => 'unknown');

    const { data, error } = await supabase
      .from('ratings')
      .insert([{
        ...ratingData,
        user_id: user?.id || null,
        user_ip: userIp,
        user_agent: navigator.userAgent,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Admin Rating CRUD functions
export async function getRatingsAdmin(token) {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function createRatingAdmin(token, ratingData) {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .insert([ratingData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function updateRatingAdmin(token, id, ratingData) {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .update(ratingData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function deleteRatingAdmin(token, id) {
  try {
    const { error } = await supabase
      .from('ratings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Rating deleted successfully' };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// ============================================
// PRODUCTS
// ============================================

export async function getProductsAdmin(token) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// ============================================
// EMPLOYEES
// ============================================

export async function getEmployeesAdmin(token) {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getConfirmedEmployeesAdmin(token) {
  try {
    // Note: This might need to be adjusted based on your actual table structure
    // Assuming there's a confirmed_employees table or a status field
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// ============================================
// PROMOTIONS
// ============================================

export async function getPromotionsAdmin(token) {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// ============================================
// SECURITY
// ============================================

export async function getSecuritiesAdmin(token) {
  try {
    const { data, error } = await supabase
      .from('securities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getSecurityReservationsAdmin(token) {
  try {
    const { data, error } = await supabase
      .from('reserve_security')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// ============================================
// ORDERS
// ============================================

export async function getOrdersAdmin(token) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// ============================================
// GALLERY
// ============================================

export async function getGalleryImages(locale = getCurrentLocale(), categoryId = null, typeId = null) {
  try {
    let query = supabase
      .from('gallery')
      .select('*');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    if (typeId) {
      query = query.eq('type_id', typeId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getGalleryCategories(locale = getCurrentLocale(), typeId = null) {
  try {
    let query = supabase
      .from('category_gallery')
      .select('*');

    if (typeId) {
      query = query.eq('type_category_gallery_id', typeId);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getGalleryTypes(locale = getCurrentLocale()) {
  try {
    const { data, error } = await supabase
      .from('type_category_gallery')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// ============================================
// ADMIN CRUD
// ============================================

export async function getAdmins(token) {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function createAdmin(token, adminData) {
  try {
    const { data, error } = await supabase
      .from('admins')
      .insert([adminData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function updateAdmin(token, id, adminData) {
  try {
    const { data, error } = await supabase
      .from('admins')
      .update(adminData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function deleteAdmin(token, id) {
  try {
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Admin deleted successfully' };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Export supabase client for direct use if needed
export { supabase };


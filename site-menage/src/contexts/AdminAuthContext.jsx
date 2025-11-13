import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { adminLogin } from '../api-supabase';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاولة استعادة الجلسة
    const token = localStorage.getItem('adminToken');
    const adminDataStr = localStorage.getItem('adminData');
    
    if (token && adminDataStr) {
      try {
        const adminData = JSON.parse(adminDataStr);
        setAdmin(adminData);
      } catch (e) {
        console.error('Error parsing admin data:', e);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
    }
    setLoading(false);
  }, []);

  const loadAdminProfile = async (adminId) => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', adminId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setAdmin(data);
      localStorage.setItem('adminData', JSON.stringify(data));
    } catch (error) {
      console.error('Error loading admin profile:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // استخدام adminLogin من api-supabase
      const response = await adminLogin(email, password);
      
      if (response.token && response.admin) {
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminData', JSON.stringify(response.admin));
        setAdmin(response.admin);
        return response;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      setAdmin(null);
    } catch (error) {
      console.error('Admin logout error:', error);
      // Continue with logout even if there's an error
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      setAdmin(null);
    }
  };

  const value = {
    admin,
    loading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}




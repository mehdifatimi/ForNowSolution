/**
 * مثال على كيفية تحديث Auth Context لاستخدام Supabase
 * 
 * هذا الملف يوضح كيفية تحويل EmployeeAuthContext أو أي Auth Context آخر
 * لاستخدام Supabase Auth بدلاً من Laravel API
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// ============================================
// مثال 1: User Auth Context (للمستخدمين العاديين)
// ============================================

const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // الحصول على الجلسة الحالية
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // الاستماع لتغييرات الجلسة
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email, password, name) => {
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
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within UserAuthProvider');
  }
  return context;
}

// ============================================
// مثال 2: Employee Auth Context (للموظفين)
// ============================================

const EmployeeAuthContext = createContext(null);

export function EmployeeAuthProvider({ children }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاولة استعادة الجلسة من localStorage
    const storedEmployee = localStorage.getItem('employeeData');
    if (storedEmployee) {
      try {
        setEmployee(JSON.parse(storedEmployee));
      } catch (e) {
        console.error('Error parsing stored employee data:', e);
      }
    }
    setLoading(false);

    // يمكنك أيضاً استخدام Supabase Auth مع custom user metadata
    // أو استخدام جدول user_employees منفصل
  }, []);

  const login = async (email, password) => {
    try {
      // الطريقة 1: استخدام Supabase Auth مع custom metadata
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // التحقق من أن المستخدم موظف
      if (data.user.user_metadata.role !== 'employee') {
        throw new Error('Access denied. Employee account required.');
      }

      // الحصول على بيانات الموظف من جدول user_employees
      const { data: employeeData, error: empError } = await supabase
        .from('user_employees')
        .select('*')
        .eq('email', email)
        .single();

      if (empError) throw empError;

      setEmployee(employeeData);
      localStorage.setItem('employeeToken', data.session.access_token);
      localStorage.setItem('employeeData', JSON.stringify(employeeData));

      return employeeData;
    } catch (error) {
      console.error('Employee login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employeeData');
      setEmployee(null);
    } catch (error) {
      console.error('Employee logout error:', error);
      throw error;
    }
  };

  const value = {
    employee,
    loading,
    login,
    logout,
  };

  return (
    <EmployeeAuthContext.Provider value={value}>
      {children}
    </EmployeeAuthContext.Provider>
  );
}

export function useEmployeeAuth() {
  const context = useContext(EmployeeAuthContext);
  if (!context) {
    throw new Error('useEmployeeAuth must be used within EmployeeAuthProvider');
  }
  return context;
}

// ============================================
// مثال 3: Admin Auth Context (للمدراء)
// ============================================

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاولة استعادة الجلسة
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const adminData = JSON.parse(atob(token));
        // التحقق من صحة البيانات
        loadAdminProfile(adminData.id);
      } catch (e) {
        console.error('Error parsing admin token:', e);
        localStorage.removeItem('adminToken');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
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
    } catch (error) {
      console.error('Error loading admin profile:', error);
      localStorage.removeItem('adminToken');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // الطريقة 1: استخدام Supabase Auth مع admin role
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // التحقق من أن المستخدم admin
      if (data.user.user_metadata.role !== 'admin') {
        throw new Error('Access denied. Admin account required.');
      }

      // الحصول على بيانات Admin من جدول admins
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (adminError) throw adminError;

      const token = data.session.access_token;
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminData', JSON.stringify(adminData));
      setAdmin(adminData);

      return {
        admin: adminData,
        token: token,
      };
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
      throw error;
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

// ============================================
// مثال على الاستخدام في Component
// ============================================

/*
// في App.jsx أو index.js
import { UserAuthProvider } from './examples/AuthContext-Supabase-Example';

function App() {
  return (
    <UserAuthProvider>
      <YourApp />
    </UserAuthProvider>
  );
}

// في Component
import { useUserAuth } from './examples/AuthContext-Supabase-Example';

function MyComponent() {
  const { user, loading, login, logout } = useUserAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
*/


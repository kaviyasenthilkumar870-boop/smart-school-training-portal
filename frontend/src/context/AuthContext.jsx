import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

// Demo sample credentials for quick role switching in the portal
export const DEMO_ACCOUNTS = {
  admin: {
    email: 'admin@smartschool.edu',
    password: 'password123',
    role: 'admin',
    name: 'Dr. Sarah Jenkins',
    title: 'Portal Director'
  },
  staff: {
    email: 'trainer.david@smartschool.edu',
    password: 'password123',
    role: 'staff',
    name: 'David Martinez',
    schoolName: 'Greenwood High & Oakridge Academy'
  },
  student: {
    email: 'emma.student@greenwood.edu',
    password: 'password123',
    role: 'student',
    name: 'Emma Watson',
    schoolName: 'Greenwood High School'
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smart_school_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('smart_school_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and check current user session
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('smart_school_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('smart_school_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification fallback:', err.message);
          // Clear invalid or stale session
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('smart_school_token', res.token);
      localStorage.setItem('smart_school_user', JSON.stringify(res.user));
      return { success: true, user: res.user };
    } catch (err) {
      // Check if this matches a demo account when backend might be in mock mode
      const matchedDemoKey = Object.keys(DEMO_ACCOUNTS).find(
        k => DEMO_ACCOUNTS[k].email.toLowerCase() === email.toLowerCase() && DEMO_ACCOUNTS[k].password === password
      );

      if (matchedDemoKey && (!err.status || err.message.includes('Failed to fetch') || err.message.includes('Network'))) {
        // Fallback demo user for immediate UI exploration
        const demoInfo = DEMO_ACCOUNTS[matchedDemoKey];
        const mockUser = {
          _id: `mock-${matchedDemoKey}-101`,
          name: demoInfo.name,
          email: demoInfo.email,
          role: demoInfo.role,
          schoolId: matchedDemoKey === 'student' ? 'sch_greenwood_01' : null,
          schoolName: demoInfo.schoolName || 'Smart School System',
          assignedSchoolIds: matchedDemoKey === 'staff' ? ['sch_greenwood_01', 'sch_oakridge_02'] : []
        };
        const mockToken = `mock-token-${matchedDemoKey}`;
        setUser(mockUser);
        setToken(mockToken);
        localStorage.setItem('smart_school_token', mockToken);
        localStorage.setItem('smart_school_user', JSON.stringify(mockUser));
        return { success: true, user: mockUser, isFallback: true };
      }

      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const loginAsDemo = async (role) => {
    const demo = DEMO_ACCOUNTS[role];
    if (demo) {
      return login(demo.email, demo.password);
    }
    return { success: false, error: 'Unknown role' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smart_school_token');
    localStorage.removeItem('smart_school_user');
  };

  const value = {
    user,
    token,
    loading,
    login,
    loginAsDemo,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isStudent: user?.role === 'student'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

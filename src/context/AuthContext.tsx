import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type UserRole = 'super_admin' | 'staff' | 'driver' | 'guide' | 'customer';

export type StaffPermission =
  | 'bookings_view'
  | 'bookings_create'
  | 'bookings_edit'
  | 'bookings_assign'
  | 'bookings_cancel'
  | 'customers_view'
  | 'customers_edit'
  | 'vehicles_view'
  | 'vehicles_manage'
  | 'drivers_view'
  | 'drivers_manage'
  | 'guides_view'
  | 'guides_manage'
  | 'packages_view'
  | 'packages_manage'
  | 'payments_view'
  | 'payments_manage'
  | 'reports_view'
  | 'reports_export'
  | 'website_cms'
  | 'staff_manage';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl: string;
  status: 'active' | 'inactive' | 'suspended';
  permissions: StaffPermission[];
  jobTitle?: string;
  department?: string;
  assignedVehicleId?: string;
  languages?: string[];
  rating?: number;
}

// Pre-seeded Demo Accounts for immediate role testing
export const DEMO_USERS: Record<UserRole, AuthUser> = {
  super_admin: {
    id: 'usr-admin-001',
    fullName: 'Chathura Madhuranga (Director)',
    email: 'admin@jplankatours.com',
    phone: '+94 77 123 4567',
    role: 'super_admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    status: 'active',
    jobTitle: 'Managing Director & Super Admin',
    department: 'Executive Management',
    permissions: [
      'bookings_view', 'bookings_create', 'bookings_edit', 'bookings_assign', 'bookings_cancel',
      'customers_view', 'customers_edit',
      'vehicles_view', 'vehicles_manage',
      'drivers_view', 'drivers_manage',
      'guides_view', 'guides_manage',
      'packages_view', 'packages_manage',
      'payments_view', 'payments_manage',
      'reports_view', 'reports_export',
      'website_cms',
      'staff_manage'
    ]
  },
  staff: {
    id: 'usr-staff-002',
    fullName: 'Anuki Jayawardena',
    email: 'staff@jplankatours.com',
    phone: '+94 71 888 2345',
    role: 'staff',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    status: 'active',
    jobTitle: 'Senior Operations Coordinator',
    department: 'Tour Operations & Bookings',
    permissions: [
      'bookings_view', 'bookings_create', 'bookings_edit', 'bookings_assign',
      'customers_view',
      'vehicles_view',
      'drivers_view',
      'guides_view',
      'packages_view',
      'reports_view'
    ]
  },
  driver: {
    id: 'usr-driver-003',
    fullName: 'Sunil Perera',
    email: 'driver.sunil@jplankatours.com',
    phone: '+94 77 456 7890',
    role: 'driver',
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80',
    status: 'active',
    jobTitle: 'Senior Highway & Safari Chauffeur',
    department: 'Transport & Fleet',
    assignedVehicleId: 'kdh-van',
    languages: ['English', 'Sinhala'],
    rating: 4.9,
    permissions: []
  },
  guide: {
    id: 'usr-guide-004',
    fullName: 'Chaminda Fernando',
    email: 'guide.chaminda@jplankatours.com',
    phone: '+94 76 345 6789',
    role: 'guide',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    status: 'active',
    jobTitle: 'SLTDA National Tourist Guide Lecturer',
    department: 'Tour Guiding & Heritage',
    languages: ['English', 'German', 'Sinhala'],
    rating: 5.0,
    permissions: []
  },
  customer: {
    id: 'usr-cust-005',
    fullName: 'David Miller',
    email: 'david@example.com',
    phone: '+44 7911 123456',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    status: 'active',
    permissions: []
  }
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<{ success: boolean; role: UserRole }>;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  hasPermission: (permission: StaffPermission) => boolean;
  updateUser: (updated: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('jp_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS.super_admin;
      }
    }
    // Default to Super Admin for seamless development inspection
    return DEMO_USERS.super_admin;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('jp_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('jp_active_user');
    }
  }, [user]);

  // Login handler
  const login = async (email: string, requestedRole?: UserRole): Promise<{ success: boolean; role: UserRole }> => {
    setIsLoading(true);

    // Check if email matches one of the demo users
    const matchedRole = (Object.keys(DEMO_USERS) as UserRole[]).find(
      r => DEMO_USERS[r].email.toLowerCase() === email.toLowerCase()
    );

    const targetRole = requestedRole || matchedRole || 'customer';
    const targetUser = DEMO_USERS[targetRole];

    // Try Supabase auth if user exists
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        // Logged in with Supabase
      }
    } catch {
      // Continue with role profile
    }

    setUser(targetUser);
    setIsLoading(false);
    return { success: true, role: targetRole };
  };

  // Direct 1-click role switcher for testing all 4 portals
  const loginAsRole = (role: UserRole) => {
    setUser(DEMO_USERS[role]);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jp_active_user');
    try {
      supabase.auth.signOut();
    } catch {}
  };

  const hasPermission = (permission: StaffPermission): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    if (user.role !== 'staff') return false;
    return user.permissions.includes(permission);
  };

  const updateUser = (updated: Partial<AuthUser>) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, ...updated } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsRole,
        logout,
        hasPermission,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

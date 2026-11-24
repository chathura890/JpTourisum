import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth, type UserRole, type StaffPermission } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  requiredPermission?: StaffPermission;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission
}) => {
  const { user, isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role
  const isRoleAllowed = allowedRoles.includes(user.role);

  // If role not allowed
  if (!isRoleAllowed) {
    const roleDashboardMap: Record<UserRole, string> = {
      super_admin: '/admin/dashboard',
      staff: '/staff/dashboard',
      driver: '/driver/dashboard',
      guide: '/guide/dashboard',
      customer: '/dashboard'
    };

    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-4">
            <i className="fas fa-shield-halved"></i>
          </div>
          <h2 className="text-2xl font-black text-forest mb-2">Access Denied</h2>
          <p className="text-sm text-charcoal/70 mb-6 leading-relaxed">
            Your current account role (<strong>{user.role.toUpperCase()}</strong>) is not authorized to access this section of the JP Lanka Tours system.
          </p>
          <Link
            to={roleDashboardMap[user.role]}
            className="w-full py-3 bg-forest hover:bg-forest/90 text-safari-gold font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md block text-center"
          >
            Go to Your Authorized Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // If staff and specific permission is required
  if (user.role === 'staff' && requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center mt-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <i className="fas fa-lock text-amber-500 text-3xl mb-3"></i>
        <h3 className="text-xl font-bold text-forest mb-2">Restricted Module</h3>
        <p className="text-xs text-charcoal/70 mb-4">
          You do not have permission (<code>{requiredPermission}</code>) to access this module. Please contact the Super Admin to request access.
        </p>
        <Link to="/staff/dashboard" className="text-xs font-bold text-forest underline">
          Back to Staff Operations
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};

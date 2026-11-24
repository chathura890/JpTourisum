import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout, loginAsRole, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  if (!user) return null;

  // Role Badge Styling
  const roleBadges: Record<UserRole, { label: string; color: string; icon: string }> = {
    super_admin: { label: 'SUPER ADMIN', color: 'bg-safari-gold text-forest', icon: 'fa-shield-halved' },
    staff: { label: 'STAFF PORTAL', color: 'bg-emerald-600 text-white', icon: 'fa-id-card-clip' },
    driver: { label: 'DRIVER PORTAL', color: 'bg-amber-600 text-white', icon: 'fa-steering-wheel' },
    guide: { label: 'TOUR GUIDE', color: 'fa-user-tie bg-indigo-600 text-white', icon: 'fa-compass' },
    customer: { label: 'CUSTOMER', color: 'bg-gray-600 text-white', icon: 'fa-user' }
  };

  // Nav item definition
  interface NavItem {
    label: string;
    path: string;
    icon: string;
    badge?: string;
    permission?: string;
  }

  // Role-Specific Navigation Menus
  let navItems: NavItem[] = [];

  if (user.role === 'super_admin') {
    navItems = [
      { label: 'Dashboard Overview', path: '/admin/dashboard', icon: 'fa-chart-pie' },
      { label: 'Bookings & Orders', path: '/admin/bookings', icon: 'fa-calendar-check', badge: 'New' },
      { label: 'Website CMS (Home)', path: '/admin/cms', icon: 'fa-laptop-code' },
      { label: 'Destinations', path: '/admin/destinations', icon: 'fa-map-location-dot' },
      { label: 'Attractions', path: '/admin/attractions', icon: 'fa-monument' },
      { label: 'Tour Packages', path: '/admin/packages', icon: 'fa-umbrella-beach' },
      { label: 'Vehicles Fleet', path: '/admin/vehicles', icon: 'fa-car-side' },
      { label: 'Staff Management', path: '/admin/staff', icon: 'fa-users-gear' },
      { label: 'Drivers Fleet', path: '/admin/drivers', icon: 'fa-id-card' },
      { label: 'Tour Guides', path: '/admin/guides', icon: 'fa-user-tie' },
      { label: 'Customers', path: '/admin/customers', icon: 'fa-users' },
      { label: 'Payments & Invoices', path: '/admin/payments', icon: 'fa-receipt' },
      { label: 'Reviews & Feedback', path: '/admin/reviews', icon: 'fa-star' },
      { label: 'Contact Messages', path: '/admin/messages', icon: 'fa-envelope-open-text', badge: '2' },
      { label: 'Reports & Analytics', path: '/admin/reports', icon: 'fa-chart-line' },
      { label: 'System Settings', path: '/admin/settings', icon: 'fa-gear' },
    ];
  } else if (user.role === 'staff') {
    navItems = [
      { label: 'Operations Dashboard', path: '/staff/dashboard', icon: 'fa-chart-pie' },
      ...(hasPermission('bookings_view') ? [{ label: 'Bookings Queue', path: '/staff/bookings', icon: 'fa-calendar-check' }] : []),
      ...(hasPermission('customers_view') ? [{ label: 'Customers', path: '/staff/customers', icon: 'fa-users' }] : []),
      ...(hasPermission('vehicles_view') ? [{ label: 'Fleet Status', path: '/staff/vehicles', icon: 'fa-car-side' }] : []),
      ...(hasPermission('drivers_view') ? [{ label: 'Drivers', path: '/staff/drivers', icon: 'fa-id-card' }] : []),
      ...(hasPermission('guides_view') ? [{ label: 'Tour Guides', path: '/staff/guides', icon: 'fa-user-tie' }] : []),
      ...(hasPermission('packages_view') ? [{ label: 'Packages', path: '/staff/packages', icon: 'fa-umbrella-beach' }] : []),
      { label: 'Customer Messages', path: '/staff/messages', icon: 'fa-envelope-open-text' },
      ...(hasPermission('reports_view') ? [{ label: 'Operations Reports', path: '/staff/reports', icon: 'fa-chart-line' }] : []),
      { label: 'My Profile', path: '/staff/profile', icon: 'fa-user-gear' }
    ];
  } else if (user.role === 'driver') {
    navItems = [
      { label: 'Driver Dashboard', path: '/driver/dashboard', icon: 'fa-gauge-high' },
      { label: 'Active Trip Tracker', path: '/driver/active-trip', icon: 'fa-route', badge: 'Live' },
      { label: 'My Assigned Trips', path: '/driver/trips', icon: 'fa-calendar-days' },
      { label: 'My Assigned Vehicle', path: '/driver/vehicle', icon: 'fa-van-shuttle' },
      { label: 'Driver Profile & Docs', path: '/driver/profile', icon: 'fa-id-card' }
    ];
  } else if (user.role === 'guide') {
    navItems = [
      { label: 'Guide Dashboard', path: '/guide/dashboard', icon: 'fa-compass' },
      { label: 'Active Tour Itinerary', path: '/guide/active-tour', icon: 'fa-map-location-dot', badge: 'Live' },
      { label: 'My Assigned Tours', path: '/guide/tours', icon: 'fa-calendar-check' },
      { label: 'Guide Profile & Badges', path: '/guide/profile', icon: 'fa-id-badge' }
    ];
  }

  const handleRoleSwitch = (targetRole: UserRole) => {
    loginAsRole(targetRole);
    const routes: Record<UserRole, string> = {
      super_admin: '/admin/dashboard',
      staff: '/staff/dashboard',
      driver: '/driver/dashboard',
      guide: '/guide/dashboard',
      customer: '/dashboard'
    };
    navigate(routes[targetRole]);
    setIsProfileMenuOpen(false);
  };

  const currentBadge = roleBadges[user.role];

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex text-charcoal">
      
      {/* ---------------------------------------------------- */}
      {/* SIDEBAR (Desktop Fixed, Mobile Drawer)               */}
      {/* ---------------------------------------------------- */}
      <aside className={`fixed inset-y-0 left-0 z-40 bg-[#0f2416] text-white flex flex-col justify-between transition-all duration-300 shadow-2xl ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Brand / Logo */}
        <div>
          <div className="h-20 flex items-center justify-between px-5 border-b border-white/10">
            <Link to="/" className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-safari-gold text-forest flex items-center justify-center font-black text-xl flex-shrink-0 shadow">
                JP
              </div>
              {isSidebarOpen && (
                <div className="truncate">
                  <span className="font-black text-lg text-white block tracking-tight leading-none">
                    JP LANKA TOURS
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-safari-gold mt-1 block">
                    Business Portal
                  </span>
                </div>
              )}
            </Link>

            <button 
              type="button" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          {/* Role Pill Indicator */}
          <div className="px-4 py-3 border-b border-white/10 bg-black/20 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${currentBadge.color} tracking-wider truncate`}>
                <i className={`fas ${currentBadge.icon} mr-1`}></i>
                {isSidebarOpen ? currentBadge.label : user.role[0].toUpperCase()}
              </span>
            </div>
            {isSidebarOpen && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)] custom-scrollbar">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && item.path !== '/staff/dashboard' && item.path !== '/driver/dashboard' && item.path !== '/guide/dashboard' && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all group relative ${
                    isActive
                      ? 'bg-safari-gold text-forest shadow-md font-bold'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <i className={`fas ${item.icon} text-sm flex-shrink-0 w-5 text-center ${isActive ? 'text-forest' : 'text-safari-gold group-hover:scale-110 transition-transform'}`}></i>
                  
                  {isSidebarOpen && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}

                  {isSidebarOpen && item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      isActive ? 'bg-forest text-white' : 'bg-safari-gold text-forest'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer in Sidebar */}
        <div className="p-4 border-t border-white/10 bg-black/25">
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              src={user.avatarUrl} 
              alt={user.fullName} 
              className="w-9 h-9 rounded-full object-cover border-2 border-safari-gold/50 flex-shrink-0" 
            />
            {isSidebarOpen && (
              <div className="truncate flex-1">
                <div className="text-xs font-bold text-white truncate">{user.fullName}</div>
                <div className="text-[10px] text-gray-400 truncate">{user.email}</div>
              </div>
            )}
            {isSidebarOpen && (
              <button 
                type="button"
                onClick={logout}
                title="Log Out"
                className="text-gray-400 hover:text-rose-400 p-1 transition-colors"
              >
                <i className="fas fa-right-from-bracket text-xs"></i>
              </button>
            )}
          </div>
        </div>

      </aside>

      {/* Backdrop for Mobile Drawer */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
        ></div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTENT AREA                                    */}
      {/* ---------------------------------------------------- */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
      }`}>
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between shadow-sm">
          
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-charcoal items-center justify-center transition-colors"
              title="Toggle Sidebar"
            >
              <i className={`fas ${isSidebarOpen ? 'fa-indent' : 'fa-outdent'} text-sm`}></i>
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-charcoal flex items-center justify-center"
            >
              <i className="fas fa-bars text-sm"></i>
            </button>

            <Link to="/" target="_blank" className="text-xs font-bold text-forest hover:text-safari-gold transition-colors flex items-center gap-1.5 bg-forest/5 hover:bg-forest/10 px-3 py-1.5 rounded-xl">
              <i className="fas fa-arrow-up-right-from-square text-[10px]"></i>
              <span className="hidden sm:inline">View Public Website</span>
            </Link>
          </div>

          {/* Quick Role Switcher (For testing all 4 roles effortlessly) */}
          <div className="hidden xl:flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-[11px] font-bold border border-gray-200">
            <span className="px-2 text-gray-400 uppercase text-[9px] tracking-wider">Test Role:</span>
            <button
              onClick={() => handleRoleSwitch('super_admin')}
              className={`px-2.5 py-1 rounded-lg transition-all ${user.role === 'super_admin' ? 'bg-forest text-safari-gold shadow-xs' : 'text-gray-600 hover:text-black'}`}
            >
              Super Admin
            </button>
            <button
              onClick={() => handleRoleSwitch('staff')}
              className={`px-2.5 py-1 rounded-lg transition-all ${user.role === 'staff' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:text-black'}`}
            >
              Staff
            </button>
            <button
              onClick={() => handleRoleSwitch('driver')}
              className={`px-2.5 py-1 rounded-lg transition-all ${user.role === 'driver' ? 'bg-amber-600 text-white shadow-xs' : 'text-gray-600 hover:text-black'}`}
            >
              Driver
            </button>
            <button
              onClick={() => handleRoleSwitch('guide')}
              className={`px-2.5 py-1 rounded-lg transition-all ${user.role === 'guide' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-black'}`}
            >
              Tour Guide
            </button>
          </div>

          {/* Right Profile & Notifications */}
          <div className="flex items-center gap-3">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-charcoal flex items-center justify-center relative transition-colors"
              >
                <i className="far fa-bell text-sm"></i>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
                    <span className="font-bold text-xs uppercase text-forest tracking-wider">Notifications</span>
                    <span className="text-[10px] text-gray-400">2 New</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-forest/5 rounded-xl">
                      <div className="font-bold text-forest">New Booking Received</div>
                      <p className="text-gray-500 text-[11px]">Ref: JP-2026-8941 for 7 Days / 2 Guests.</p>
                      <span className="text-[9px] text-gray-400 mt-1 block">15 mins ago</span>
                    </div>
                    <div className="p-2.5 bg-amber-500/5 rounded-xl">
                      <div className="font-bold text-amber-800">Vehicle Assigned</div>
                      <p className="text-gray-500 text-[11px]">Toyota KDH Van assigned to Sunil Perera.</p>
                      <span className="text-[9px] text-gray-400 mt-1 block">1 hour ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors"
              >
                <span className="text-xs font-bold text-forest hidden md:block max-w-[120px] truncate">
                  {user.fullName.split(' ')[0]}
                </span>
                <img 
                  src={user.avatarUrl} 
                  alt={user.fullName} 
                  className="w-8 h-8 rounded-full object-cover border border-forest/30" 
                />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50">
                  <div className="p-3 bg-gray-50 rounded-xl mb-2">
                    <div className="font-bold text-xs text-forest">{user.fullName}</div>
                    <div className="text-[11px] text-gray-500 truncate">{user.email}</div>
                    <span className={`text-[9px] font-black uppercase mt-1 inline-block px-2 py-0.5 rounded ${currentBadge.color}`}>
                      {currentBadge.label}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Switch Role Portal:
                    </div>
                    {(['super_admin', 'staff', 'driver', 'guide'] as UserRole[]).map(r => (
                      <button
                        key={r}
                        onClick={() => handleRoleSwitch(r)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                          user.role === r ? 'bg-forest text-safari-gold font-bold' : 'hover:bg-gray-100 text-charcoal'
                        }`}
                      >
                        <span className="capitalize">{r.replace('_', ' ')}</span>
                        {user.role === r && <i className="fas fa-check text-[10px]"></i>}
                      </button>
                    ))}

                    <div className="border-t border-gray-100 my-2"></div>
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <i className="fas fa-right-from-bracket"></i>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* Content View */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};


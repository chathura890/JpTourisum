import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layout/PublicLayout';
import { AdminLayout } from './layout/AdminLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import Booking from './pages/public/Booking';
import Vehicles from './pages/public/Vehicles';
import Drivers from './pages/public/Drivers';
import Packages from './pages/public/Packages';
import About from './pages/public/About';
import Feedback from './pages/public/Feedback';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/Dashboard';

// Management & Role Portals
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminCMS } from './pages/admin/AdminCMS';
import { AdminStaff } from './pages/admin/AdminStaff';
import { AdminDrivers } from './pages/admin/AdminDrivers';
import { AdminGuides } from './pages/admin/AdminGuides';
import { AdminVehicles } from './pages/admin/AdminVehicles';
import { AdminPayments } from './pages/admin/AdminPayments';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { GuideDashboard } from './pages/guide/GuideDashboard';

function App() {
  return (
    <Router>
      <Routes>
        
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="packages" element={<Packages />} />
          <Route path="about" element={<About />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="contact" element={<Contact />} />
          <Route path="book" element={<Booking />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* 1. SUPER ADMIN PORTAL (/admin/*) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="cms" element={<AdminCMS />} />
          <Route path="destinations" element={<AdminCMS />} />
          <Route path="attractions" element={<AdminCMS />} />
          <Route path="packages" element={<AdminCMS />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="guides" element={<AdminGuides />} />
          <Route path="customers" element={<AdminStaff />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="reviews" element={<AdminDashboard />} />
          <Route path="messages" element={<StaffDashboard />} />
          <Route path="reports" element={<AdminDashboard />} />
          <Route path="settings" element={<AdminCMS />} />
        </Route>

        {/* 2. STAFF OPERATIONS PORTAL (/staff/*) */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={['staff', 'super_admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="customers" element={<AdminStaff />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="guides" element={<AdminGuides />} />
          <Route path="packages" element={<AdminCMS />} />
          <Route path="messages" element={<StaffDashboard />} />
          <Route path="reports" element={<AdminDashboard />} />
          <Route path="profile" element={<StaffDashboard />} />
        </Route>

        {/* 3. DRIVER MOBILE-FIRST PORTAL (/driver/*) */}
        <Route
          path="/driver"
          element={
            <ProtectedRoute allowedRoles={['driver', 'super_admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DriverDashboard />} />
          <Route path="active-trip" element={<DriverDashboard />} />
          <Route path="trips" element={<DriverDashboard />} />
          <Route path="vehicle" element={<DriverDashboard />} />
          <Route path="profile" element={<DriverDashboard />} />
        </Route>

        {/* 4. TOUR GUIDE PORTAL (/guide/*) */}
        <Route
          path="/guide"
          element={
            <ProtectedRoute allowedRoles={['guide', 'super_admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<GuideDashboard />} />
          <Route path="active-tour" element={<GuideDashboard />} />
          <Route path="tours" element={<GuideDashboard />} />
          <Route path="profile" element={<GuideDashboard />} />
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;

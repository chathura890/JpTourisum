import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth, type UserRole, DEMO_USERS } from '../../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const roleRedirectMap: Record<UserRole, string> = {
    super_admin: '/admin/dashboard',
    staff: '/staff/dashboard',
    driver: '/driver/dashboard',
    guide: '/guide/dashboard',
    customer: '/dashboard'
  };

  const handleRoleQuickLogin = (role: UserRole) => {
    loginAsRole(role);
    navigate(roleRedirectMap[role]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await login(email);
      navigate(roleRedirectMap[res.role]);
    } catch {
      setErrorMsg('Login failed. Please check credentials or use 1-click role buttons below.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center pt-24 pb-8 px-4 overflow-hidden">
      {/* Background with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img 
          src={`${import.meta.env.BASE_URL}login-bg.jpg`} 
          alt="Sri Lanka Background" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 w-full flex-1 flex items-center justify-center">
        
        {/* Glass Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[480px] bg-[#142618]/90 backdrop-blur-md border border-white/20 rounded-[28px] shadow-2xl p-6 sm:p-8 my-8 text-white"
        >
          <div className="mb-6 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#facc15] block mb-1">
              JP Lanka Tours Portal Access
            </span>
            <h2 className="text-3xl text-white mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Welcome Back
            </h2>
            <p className="text-gray-300 text-xs">
              Log in to access your administrative dashboard, operations, driver route, or trip bookings.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs">
              {errorMsg}
            </div>
          )}

          {/* QUICK 1-CLICK DEMO ACCESS BUTTONS */}
          <div className="mb-6 bg-black/30 p-3.5 rounded-2xl border border-white/10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#facc15] block text-center">
              ⚡ Instant 1-Click Role Login:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleRoleQuickLogin('super_admin')}
                className="py-2 px-2.5 rounded-xl bg-[#facc15] text-[#1a3622] hover:bg-[#eab308] transition-all flex items-center justify-center gap-1.5 shadow-sm text-center"
              >
                <i className="fa-solid fa-shield-halved text-xs"></i>
                <span>Super Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('staff')}
                className="py-2 px-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all flex items-center justify-center gap-1.5 shadow-sm text-center"
              >
                <i className="fa-solid fa-id-card-clip text-xs"></i>
                <span>Staff Portal</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('driver')}
                className="py-2 px-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-500 transition-all flex items-center justify-center gap-1.5 shadow-sm text-center"
              >
                <i className="fa-solid fa-steering-wheel text-xs"></i>
                <span>Driver Portal</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('guide')}
                className="py-2 px-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center justify-center gap-1.5 shadow-sm text-center"
              >
                <i className="fa-solid fa-compass text-xs"></i>
                <span>Tour Guide</span>
              </button>
            </div>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-3 text-[10px] text-gray-400 uppercase tracking-wider">or login with email</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            {/* Email Address */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-regular fa-envelope text-gray-400 text-xs"></i>
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-[#facc15] transition-all text-white placeholder-gray-400"
                placeholder="Email Address (e.g. admin@jplankatours.com)"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-solid fa-lock text-gray-400 text-xs"></i>
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-10 py-3 text-xs focus:outline-none focus:border-[#facc15] transition-all text-white placeholder-gray-400"
                placeholder="Password"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white"
              >
                <i className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'} text-xs`}></i>
              </button>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-xs mt-2"
            >
              {isLoading ? 'Verifying Account...' : 'Sign In to Portal'}
              {!isLoading && <i className="fa-solid fa-arrow-right text-xs"></i>}
            </button>
          </form>

          {/* Customer Portal Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => handleRoleQuickLogin('customer')}
              className="text-[11px] text-gray-300 hover:text-[#facc15] underline transition-colors"
            >
              Or access Customer My Trips Dashboard ({DEMO_USERS.customer.email})
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400 border-t border-white/10 pt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#facc15] font-bold hover:underline">
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Login;

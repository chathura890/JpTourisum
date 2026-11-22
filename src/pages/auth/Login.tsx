import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center pt-24 pb-8 px-4 overflow-hidden">
      {/* Absolute Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="/login-bg.jpg" 
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
          transition={{ duration: 0.6 }}
          className="w-full max-w-[420px] bg-[#1a1a1a]/40 backdrop-blur-md border border-white/20 rounded-[24px] shadow-2xl p-8 md:p-10 my-8"
        >
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl text-white mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>Welcome Back</h2>
            <p className="text-gray-300 text-sm">Log in to your account and continue your journey across Sri Lanka.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Address */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-regular fa-envelope text-gray-400"></i>
              </div>
              <input 
                type="email" 
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#facc15] transition-all text-white placeholder-gray-400"
                placeholder="Email Address"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-solid fa-lock text-gray-400"></i>
              </div>
              <input 
                type="password" 
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-11 py-3.5 text-sm focus:outline-none focus:border-[#facc15] transition-all text-white placeholder-gray-400"
                placeholder="Password"
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white focus:outline-none">
                <i className="fa-regular fa-eye-slash"></i>
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded-[4px] border border-gray-400 group-hover:border-[#facc15] flex items-center justify-center transition-colors bg-transparent">
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-[#4fa4ff] hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Logging In...' : 'Log In'}
              {!isLoading && <i className="fa-solid fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-4 text-[11px] text-gray-400 uppercase tracking-wider">or</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* Social Logins */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 bg-transparent border border-white/40 text-white py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
              <i className="fa-brands fa-apple text-[20px]"></i>
              Continue with Apple
            </button>
          </div>

          <div className="mt-8 text-center text-xs font-medium text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#facc15] hover:text-white transition-colors">
              Create Account <i className="fa-solid fa-arrow-right text-[10px] ml-1"></i>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom Features Bar */}
      <div className="relative z-20 w-full pb-4 hidden lg:flex justify-between items-end px-8">
        <div className="flex gap-12">
          <div className="flex items-center gap-3 text-white">
            <i className="fas fa-shield-alt text-[#facc15] text-2xl"></i>
            <div>
              <h4 className="font-bold text-sm">Secure Booking</h4>
              <p className="text-xs text-gray-300">Your safety is our priority</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-white">
            <i className="fas fa-lock text-[#facc15] text-2xl"></i>
            <div>
              <h4 className="font-bold text-sm">Your Data is Protected</h4>
              <p className="text-xs text-gray-300">We value your privacy</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-white">
            <i className="fas fa-map-marker-alt text-[#facc15] text-2xl"></i>
            <div>
              <h4 className="font-bold text-sm">Plan and Manage Your Journeys</h4>
              <p className="text-xs text-gray-300">All in one place</p>
            </div>
          </div>
        </div>
        <div>
          <span 
            className="text-white text-3xl drop-shadow-md flex flex-col items-end"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            More Than a Trip
            <span className="text-[#facc15] -mt-1 ml-4 text-2xl">It's an Experience</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;

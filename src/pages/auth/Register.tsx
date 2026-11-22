import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
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
          <div className="mb-6 text-center md:text-left">
            <h2 className="text-3xl text-white mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>Start Your Journey</h2>
            <p className="text-gray-300 text-sm">Create your account and explore the beauty of Sri Lanka.</p>
          </div>

          <form onSubmit={() => {}} className="space-y-4">
            
            {/* Full Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-regular fa-user text-gray-400"></i>
              </div>
              <input 
                type="text" 
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#facc15] transition-all text-white placeholder-gray-400"
                placeholder="Full Name"
              />
            </div>

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

            {/* Phone Number Group */}
            <div className="flex bg-white/10 border border-white/20 rounded-xl focus-within:border-[#facc15] transition-all overflow-hidden">
              <div className="flex items-center pl-4 pr-2 border-r border-white/20 bg-transparent">
                <i className="fa-solid fa-phone text-gray-400 text-sm mr-2"></i>
                <div className="relative">
                  <select className="bg-transparent text-sm text-white font-medium focus:outline-none appearance-none pr-4 cursor-pointer">
                    <option value="+94" className="text-black">+94</option>
                    <option value="+1" className="text-black">+1</option>
                    <option value="+44" className="text-black">+44</option>
                    <option value="+61" className="text-black">+61</option>
                  </select>
                  <i className="fa-solid fa-chevron-down text-gray-400 text-[10px] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                </div>
              </div>
              <input 
                type="tel" 
                required
                className="flex-1 bg-transparent py-3.5 px-3 text-sm focus:outline-none text-white placeholder-gray-400"
                placeholder="Phone Number"
              />
            </div>

            {/* Country Dropdown */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-solid fa-globe text-gray-400"></i>
              </div>
              <select 
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-10 py-3.5 text-sm focus:outline-none focus:border-[#facc15] transition-all text-gray-400 appearance-none cursor-pointer"
              >
                <option value="" disabled defaultValue="">Select Your Country</option>
                <option value="lk" className="text-black">Sri Lanka</option>
                <option value="us" className="text-black">United States</option>
                <option value="uk" className="text-black">United Kingdom</option>
                <option value="au" className="text-black">Australia</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <i className="fa-solid fa-chevron-down text-gray-400 text-[10px]"></i>
              </div>
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

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-solid fa-lock text-gray-400"></i>
              </div>
              <input 
                type="password" 
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-11 py-3.5 text-sm focus:outline-none focus:border-[#facc15] transition-all text-white placeholder-gray-400"
                placeholder="Confirm Password"
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white focus:outline-none">
                <i className="fa-regular fa-eye-slash"></i>
              </button>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 py-2 group">
              <div className="mt-0.5 w-4 h-4 rounded-[4px] border border-gray-400 group-hover:border-[#facc15] flex flex-shrink-0 items-center justify-center transition-colors bg-transparent cursor-pointer">
              </div>
              <span className="text-xs text-gray-300 leading-relaxed cursor-pointer">
                I agree to the <Link to="/terms" className="font-bold text-[#4fa4ff] hover:text-white transition-colors">Terms & Conditions</Link> and <Link to="/privacy" className="font-bold text-[#4fa4ff] hover:text-white transition-colors">Privacy Policy</Link>
              </span>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
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
            Already have an account?{' '}
            <Link to="/login" className="text-[#facc15] hover:text-white transition-colors">
              Sign In <i className="fa-solid fa-arrow-right text-[10px] ml-1"></i>
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

export default Register;

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RegionModal from './RegionModal';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.vehicles'), path: '/vehicles' },
    { name: t('nav.drivers'), path: '/drivers' },
    { name: t('nav.packages'), path: '/packages' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.feedback'), path: '/feedback' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const currentLang = i18n.language || 'en';

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-3'
          : isHome
          ? 'bg-transparent py-5'
          : 'bg-white shadow-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex flex-col text-forest">
            <div className="flex items-center gap-1">
              <i className={`fas fa-car-side text-[28px] ${isScrolled || !isHome ? 'text-forest' : 'text-white'}`}></i>
              <span className={`text-2xl font-black tracking-tight uppercase leading-none ${isScrolled || !isHome ? 'text-forest' : 'text-white drop-shadow-md'}`}>
                TOUR RIDES
              </span>
            </div>
            <span className={`text-[9px] tracking-[0.2em] font-medium uppercase mt-1 pl-1 ${isScrolled || !isHome ? 'text-charcoal' : 'text-white drop-shadow-sm'}`}>
              Explore • Travel • Experience
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-semibold text-[13px] uppercase tracking-wide transition-colors hover:text-safari-gold ${
                isScrolled || !isHome ? 'text-charcoal' : 'text-white drop-shadow-md'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <div className={`flex items-center gap-1 font-semibold text-[13px] uppercase px-3 py-1.5 rounded-full border transition-colors ${
                isScrolled || !isHome 
                  ? 'border-gray-200 text-charcoal hover:border-forest bg-gray-50/50' 
                  : 'border-white/30 text-white hover:bg-white/10 backdrop-blur-sm'
              }`}>
              <i className="fas fa-globe text-[14px]"></i>
              <select 
                value={currentLang} 
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent outline-none cursor-pointer text-[13px] font-semibold uppercase appearance-none"
              >
                <option value="en" className="text-charcoal">EN</option>
                <option value="si" className="text-charcoal">සිං</option>
                <option value="ta" className="text-charcoal">தமிழ்</option>
              </select>
            </div>
          </div>

          <Link
            to="/login"
            className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${
              isScrolled || !isHome 
                ? 'border-gray-200 text-charcoal hover:border-forest bg-gray-50/50 hover:bg-forest hover:text-white' 
                : 'border-white/30 text-white hover:bg-white/10 backdrop-blur-sm'
            }`}
          >
            <i className="fas fa-user text-[16px]"></i>
          </Link>

          <Link
            to="/book"
            className="bg-forest hover:bg-jungle text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            {t('nav.bookNow')}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`lg:hidden ${isScrolled || !isHome ? 'text-forest' : 'text-white drop-shadow-md'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <i className="fas fa-times text-[28px]"></i> : <i className="fas fa-bars text-[28px]"></i>}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-charcoal text-lg font-medium"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-px bg-gray-100 my-2"></div>
              
              <div className="flex justify-between items-center text-charcoal">
                <span className="font-medium">Language</span>
                <select 
                  value={currentLang}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-bold outline-none cursor-pointer"
                >
                  <option value="en">English (EN)</option>
                  <option value="si">සිංහල (SI)</option>
                  <option value="ta">தமிழ் (TA)</option>
                </select>
              </div>

              <div className="flex mt-4">
                <Link
                  to="/book"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 text-center bg-forest text-white rounded-lg font-bold"
                >
                  {t('nav.bookNow')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RegionModal 
        isOpen={isLangMenuOpen} 
        onClose={() => setIsLangMenuOpen(false)} 
      />
    </header>
  );
};

export default Navbar;

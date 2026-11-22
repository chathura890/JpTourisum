import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-20 bg-[#07171e] text-gray-300 py-12 md:py-16 border-t border-white/10 overflow-hidden">
      {/* Optional faint mandala background can be added here if available */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at top left, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Column 1: Logo & Description (Spans 2 on large screens for more space if needed, or 1) */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              {/* Mockup Logo */}
              <div className="w-12 h-12 flex items-center justify-center text-[#facc15]">
                <i className="fa-solid fa-sun text-4xl -ml-2 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-wider text-white leading-none">
                  SRI LANKA
                </span>
                <span className="text-[8px] tracking-[0.2em] font-medium uppercase mt-1 text-gray-400">
                  Tourism & Vehicle Booking
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-8 text-gray-300">
              Explore the wonder of Sri Lanka with our curated travel experiences and reliable vehicle bookings.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="text-[#facc15] hover:text-white transition-colors text-xl">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-[#facc15] hover:text-white transition-colors text-xl">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-[#facc15] hover:text-white transition-colors text-xl">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-[#facc15] hover:text-white transition-colors text-xl">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="#" className="text-[#facc15] hover:text-white transition-colors text-xl">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Explore Destinations */}
          <div>
            <h4 className="text-[#facc15] text-2xl mb-6" style={{ fontFamily: "'Dancing Script', cursive" }}>Explore Destinations</h4>
            <ul className="space-y-3">
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Colombo</Link></li>
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Kandy</Link></li>
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Galle</Link></li>
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Ella</Link></li>
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Wildlife Safari</Link></li>
            </ul>
          </div>

          {/* Column 3: Our Vehicles */}
          <div>
            <h4 className="text-[#facc15] text-2xl mb-6" style={{ fontFamily: "'Dancing Script', cursive" }}>Our Vehicles</h4>
            <ul className="space-y-3">
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Luxury Vans</Link></li>
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Budget Cars</Link></li>
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Self-Drive</Link></li>
            </ul>
          </div>

          {/* Column 4: Travel Guide */}
          <div>
            <h4 className="text-[#facc15] text-2xl mb-6" style={{ fontFamily: "'Dancing Script', cursive" }}>Travel Guide</h4>
            <ul className="space-y-3">
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Budget Cars</Link></li>
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Self-Drive</Link></li>
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Travel Blog</Link></li>
              <li><Link to="#" className="text-sm hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Tour Packages</Link></li>
            </ul>
          </div>

          {/* Column 5: Useful Info */}
          <div>
            <h4 className="text-[#facc15] text-2xl mb-6" style={{ fontFamily: "'Dancing Script', cursive" }}>Useful Info</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="text-sm hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-sm hover:text-white transition-colors">Partner With Us</Link></li>
            </ul>
          </div>

          {/* Column 6: Support & Contact */}
          <div className="lg:col-span-1">
            <h4 className="text-[#facc15] text-2xl mb-6" style={{ fontFamily: "'Dancing Script', cursive" }}>Support & Contact</h4>
            <ul className="space-y-4 mb-6">
              <li className="flex items-center gap-3">
                <i className="fas fa-phone text-[#facc15] flex-shrink-0 text-sm"></i>
                <span className="text-sm">+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-envelope text-[#facc15] flex-shrink-0 text-sm"></i>
                <span className="text-sm">support@srilankatourism.com</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-location-dot text-[#facc15] flex-shrink-0 text-sm mt-1"></i>
                <span className="text-sm">Colombo, Sri Lanka</span>
              </li>
            </ul>
            
            {/* Payment Methods */}
            <div className="flex gap-2 mb-3">
              <div className="bg-white w-10 h-6 flex items-center justify-center rounded">
                <i className="fab fa-cc-visa text-blue-800 text-xl"></i>
              </div>
              <div className="bg-white w-10 h-6 flex items-center justify-center rounded">
                <i className="fab fa-cc-mastercard text-red-600 text-xl"></i>
              </div>
              <div className="bg-white w-10 h-6 flex items-center justify-center rounded">
                <i className="fab fa-cc-amex text-blue-500 text-xl"></i>
              </div>
              <div className="bg-white w-10 h-6 flex items-center justify-center rounded">
                <i className="fab fa-cc-paypal text-blue-900 text-xl"></i>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 mb-3 text-[11px] text-gray-300">
              <div className="flex items-center gap-1.5 text-safari-gold font-bold mb-0.5">
                <i className="fas fa-shield-halved"></i>
                <span>Tourist Police & Hotline: 1912</span>
              </div>
              <p className="text-[10px] text-gray-400">24/7 National Tourist Assistance</p>
            </div>

            <p className="text-[11px] text-gray-400 leading-tight">
              Approved by Sri Lanka Tourism<br/>Development Authority (SLTDA)
            </p>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sri Lanka Tourism & Vehicle Booking. All Rights Reserved.</p>
          <p>Designed for unforgettable journeys</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

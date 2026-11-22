import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen min-h-[800px] flex flex-col justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/12.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 container mx-auto px-4 md:px-8 mt-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-3xl"
        >
          <h1 className="text-white drop-shadow-lg font-black mb-4 flex flex-col">
            <span className="text-3xl md:text-5xl lg:text-6xl tracking-tight text-gray-100">Your Adventure</span>
            <span className="text-5xl md:text-7xl lg:text-8xl tracking-tight text-white mt-1">Starts Here</span>
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 font-medium drop-shadow-md max-w-xl leading-relaxed">
            Book your transport, island tours and return journey —<br className="hidden md:block" /> all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => navigate('/book')}
              className="bg-safari-gold hover:bg-amber-warm text-charcoal font-bold text-sm uppercase tracking-wide px-8 py-3.5 rounded-full transition-all w-full sm:w-auto text-center"
            >
              BOOK YOUR JOURNEY
            </button>
            <button 
              onClick={() => navigate('/safari')}
              className="bg-transparent hover:bg-white/10 border border-white text-white font-bold text-sm uppercase tracking-wide px-8 py-3.5 rounded-full transition-all w-full sm:w-auto text-center"
            >
              EXPLORE SAFARI
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Area: Booking Widget and Features */}
      <div className="relative z-20 container mx-auto px-4 md:px-8 mt-auto mb-10">
        
        {/* Booking Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full bg-white rounded-xl shadow-2xl p-2 md:p-3 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            
            {/* From */}
            <div className="flex-1 w-full px-4 py-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">From</label>
              <div className="flex items-center text-charcoal">
                <i className="fas fa-location-dot text-gray-400 mr-2 flex-shrink-0" style={{fontSize: '16px'}}></i>
                <input 
                  type="text" 
                  placeholder="Colombo" 
                  defaultValue="Colombo"
                  className="w-full bg-transparent text-sm font-medium focus:outline-none"
                />
              </div>
            </div>

            {/* To */}
            <div className="flex-1 w-full px-4 py-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">To</label>
              <div className="flex items-center text-charcoal">
                <i className="fas fa-location-dot text-gray-400 mr-2 flex-shrink-0" style={{fontSize: '16px'}}></i>
                <input 
                  type="text" 
                  placeholder="Where to?" 
                  defaultValue="Sigiriya, Kandy, etc."
                  className="w-full bg-transparent text-sm font-medium focus:outline-none"
                />
              </div>
            </div>

            {/* Date */}
            <div className="flex-1 w-full px-4 py-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Travel Date</label>
              <div className="flex items-center text-charcoal">
                <i className="fas fa-calendar text-gray-400 mr-2 flex-shrink-0" style={{fontSize: '16px'}}></i>
                <input 
                  type="text" 
                  placeholder="Select Date"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.value === "" ? (e.target.type = "text") : null)}
                  className="w-full bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Passengers */}
            <div className="w-full lg:w-32 px-4 py-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Passengers</label>
              <div className="flex items-center text-charcoal">
                <input 
                  type="number" 
                  min="1"
                  defaultValue="2"
                  className="w-full bg-transparent text-sm font-medium focus:outline-none"
                />
              </div>
            </div>
            
            {/* Vehicle Type */}
            <div className="flex-1 w-full px-4 py-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Vehicle Type</label>
              <div className="flex items-center text-charcoal">
                <select className="w-full bg-transparent text-sm font-medium focus:outline-none appearance-none cursor-pointer">
                  <option>All Vehicles</option>
                  <option>Safari Jeep</option>
                  <option>Car</option>
                  <option>Van</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="w-full lg:w-auto pl-0 lg:pl-3 pt-3 lg:pt-0">
              <button 
                onClick={() => navigate('/book')}
                className="bg-forest hover:bg-jungle text-white font-bold text-sm uppercase rounded-lg py-4 px-8 transition-all shadow-md w-full lg:w-auto whitespace-nowrap"
              >
                Search Vehicles
              </button>
            </div>
          </div>
        </motion.div>

        {/* Features below widget */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-white font-medium text-sm"
        >
          <div className="flex items-center gap-2">
            <i className="fas fa-shield-halved text-white" style={{fontSize: '20px'}}></i>
            <span>Secure<br/>Booking</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fas fa-star text-white" style={{fontSize: '20px'}}></i>
            <span>Trusted<br/>Service</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fas fa-leaf text-white" style={{fontSize: '20px'}}></i>
            <span>Unforgettable<br/>Experiences</span>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
};

export default Hero;

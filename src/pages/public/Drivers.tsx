
import { motion } from 'framer-motion';

const MOCK_DRIVERS = [
  { id: 'd1', name: 'Sunil Perera', experience: '12 Years', languages: 'English, Sinhala', rating: 4.9, reviews: 342, image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', role: 'Safari Tracker' },
  { id: 'd2', name: 'Nilantha Silva', experience: '8 Years', languages: 'English, Sinhala, Basic German', rating: 4.8, reviews: 156, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', role: 'Transport Driver' },
  { id: 'd3', name: 'Chaminda Fernando', experience: '15 Years', languages: 'English, Sinhala, Tamil', rating: 5.0, reviews: 521, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', role: 'Safari Tracker' },
  { id: 'd4', name: 'Ruwan Kumara', experience: '5 Years', languages: 'English, Sinhala', rating: 4.7, reviews: 89, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', role: 'Transport Driver' },
];

const Drivers = () => {
  return (
    <div className="pt-28 pb-20 bg-off-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-forest mb-4">Our Professional Drivers</h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Experienced, verified, and passionate about wildlife. Our drivers and safari trackers are the key to your unforgettable journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_DRIVERS.map((driver, idx) => (
            <motion.div 
              key={driver.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col items-center text-center group"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg relative">
                <img src={driver.image} alt={driver.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 right-0 bg-forest text-white p-1.5 rounded-full border-2 border-white">
                  <i className="fas fa-shield-halved" style={{fontSize: '16px'}}></i>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-forest mb-1">{driver.name}</h3>
              <span className="text-sm font-semibold text-safari-gold mb-4 uppercase tracking-wider">{driver.role}</span>
              
              <div className="w-full space-y-3 text-sm text-charcoal/70 mb-6">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="flex items-center gap-1.5"><i className="fas fa-star text-safari-gold fill-safari-gold" style={{fontSize: '16px'}}></i> Rating</span>
                  <span className="font-bold text-charcoal">{driver.rating} ({driver.reviews})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="flex items-center gap-1.5">Experience</span>
                  <span className="font-bold text-charcoal">{driver.experience}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="flex items-center gap-1.5"><i className="fas fa-language text-forest" style={{fontSize: '16px'}}></i></span>
                  <span className="font-semibold text-charcoal text-right">{driver.languages}</span>
                </div>
              </div>
              
              <button className="w-full py-2.5 bg-gray-50 hover:bg-forest hover:text-white text-forest font-bold rounded-xl transition-colors border border-gray-200">
                View Profile
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Drivers;

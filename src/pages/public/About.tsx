
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="pt-28 pb-20 bg-off-white min-h-screen overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Story Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-24">
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-safari-gold rounded-3xl transform translate-x-4 translate-y-4 opacity-50"></div>
            <img 
              src="https://images.unsplash.com/photo-1547970810-dc1eac3ac11c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Yala Safari" 
              className="w-full h-auto rounded-3xl relative z-10 shadow-xl object-cover"
            />
          </div>
          
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-black text-forest mb-6">Our Mission to Share the Wilderness</h1>
            <p className="text-lg text-charcoal/80 mb-6 leading-relaxed">
              Founded by passionate local wildlife enthusiasts, Yala Safari was built to bridge the gap between travelers and the raw, untouched beauty of Sri Lanka's wildlife.
            </p>
            <p className="text-lg text-charcoal/80 mb-8 leading-relaxed">
              We realized that coordinating transport from a hotel, finding a reliable safari jeep, and getting back safely was often stressful for tourists. We created this platform to handle the entire journey seamlessly.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-safari-gold mb-2">5k+</span>
                <span className="text-sm font-bold text-forest uppercase tracking-wider">Happy Travelers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-black text-safari-gold mb-2">50+</span>
                <span className="text-sm font-bold text-forest uppercase tracking-wider">Verified Vehicles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-forest mb-4">Why Choose Us</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-forest/10 text-forest rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-shield-halved" style={{fontSize: '32px'}}></i>
            </div>
            <h3 className="text-xl font-bold text-forest mb-3">Safe & Reliable</h3>
            <p className="text-charcoal/70 text-sm">All our drivers and trackers are verified, trained, and deeply experienced.</p>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-safari-gold/20 text-amber-warm rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-leaf" style={{fontSize: '32px'}}></i>
            </div>
            <h3 className="text-xl font-bold text-forest mb-3">Eco-Conscious</h3>
            <p className="text-charcoal/70 text-sm">We adhere to strict park rules to ensure minimal impact on wildlife habitats.</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-forest/10 text-forest rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-map"  ></i>
            </div>
            <h3 className="text-xl font-bold text-forest mb-3">End-to-End</h3>
            <p className="text-charcoal/70 text-sm">From your hotel doorstep into the jungle and back, we manage the entire trip.</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-safari-gold/20 text-amber-warm rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-users" style={{fontSize: '32px'}}></i>
            </div>
            <h3 className="text-xl font-bold text-forest mb-3">Local Experts</h3>
            <p className="text-charcoal/70 text-sm">Our trackers know the park inside out, maximizing your wildlife sightings.</p>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default About;

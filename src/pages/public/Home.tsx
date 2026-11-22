import { motion } from 'framer-motion';

import Hero from '../../components/public/Hero';
import JourneyTimeline from '../../components/public/JourneyTimeline';
import VehicleCard from '../../components/common/VehicleCard';
import { useNavigate } from 'react-router-dom';

const MOCK_VEHICLES = [
  {
    id: 'v1',
    name: 'Toyota KDH Super Roof',
    type: 'Van',
    image: 'https://images.unsplash.com/photo-1542318721-a53d6ebef427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    capacity: 9,
    luggage: 5,
    ac: true,
    driverIncluded: true,
    pricePerKm: 0.85,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 'v2',
    name: 'Toyota Axio',
    type: 'Car',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    capacity: 3,
    luggage: 2,
    ac: true,
    driverIncluded: true,
    pricePerKm: 0.65,
    rating: 4.9,
    reviews: 89
  },
  {
    id: 'v3',
    name: 'Toyota Land Cruiser',
    type: 'Luxury SUV',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    capacity: 5,
    luggage: 4,
    ac: true,
    driverIncluded: true,
    pricePerKm: 1.20,
    rating: 5.0,
    reviews: 42
  }
];

const FEATURES = [
  {
    icon: <i className="fas fa-map w-8 h-8 text-safari-gold" ></i>,
    title: "Island-Wide Coverage",
    description: "From coastal beaches to misty mountains and dense national parks, we cover every corner of Sri Lanka."
  },
  {
    icon: <i className="fas fa-shield w-8 h-8 text-safari-gold" style={{fontSize: '24px'}}></i>,
    title: "Verified Drivers",
    description: "Travel with peace of mind. All our drivers are rigorously vetted, licensed, and deeply knowledgeable."
  },
  {
    icon: <i className="fas fa-compass w-8 h-8 text-safari-gold" style={{fontSize: '24px'}}></i>,
    title: "Tailored Experiences",
    description: "Customize your journey. Whether it's a wildlife safari or cultural tour, we shape the trip around you."
  },
  {
    icon: <i className="fas fa-clock w-8 h-8 text-safari-gold" style={{fontSize: '24px'}}></i>,
    title: "24/7 Support",
    description: "Our dedicated team is available around the clock to ensure your journey is flawless from start to finish."
  }
];

const fadeInUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-off-white overflow-hidden">
      <Hero />
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {FEATURES.map((feature, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                className="flex flex-col items-start p-6 rounded-2xl hover:bg-off-white transition-colors group cursor-pointer"
              >
                <div className="bg-forest/5 p-4 rounded-xl mb-6 group-hover:bg-safari-gold/20 group-hover:scale-110 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-forest mb-3">{feature.title}</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Complete Journey Section */}
      <section className="py-24 bg-off-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-safari-gold/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-forest/10 rounded-full blur-3xl -ml-40 -mb-40"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1a3622_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest/5 text-forest font-semibold text-sm mb-6">
              <i className="fas fa-leaf text-safari-gold" style={{fontSize: '16px'}}></i>
              <span>Seamless Travel</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-forest mb-6 tracking-tight">Complete Journey Experience</h2>
            <p className="text-lg md:text-xl text-charcoal/70 max-w-2xl mx-auto mb-16 leading-relaxed">
              From your doorstep to the heart of the island, and safely back. We handle every detail of your travel adventure effortlessly.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <JourneyTimeline />
          </motion.div>
        </div>
      </section>
      
      {/* The Wildlife & Island Experience Section */}
      <section className="py-24 bg-forest text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1547970810-dc1eac3ac11c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Leopard background" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/95 to-forest/50"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-safari-gold font-semibold text-sm mb-6 backdrop-blur-md">
                <i className="fas fa-star" style={{fontSize: '16px'}}></i>
                <span>Premium Safaris</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-white leading-tight">
                The Ultimate <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-safari-gold to-amber-200">Island Safari</span>
              </h2>
              <p className="text-lg md:text-xl mb-6 text-gray-300 leading-relaxed font-light">
                Sri Lanka is filled with historical monuments, beautiful beaches, and famous wildlife sanctuaries boasting the highest density of leopards in the world.
              </p>
              
              <div className="grid grid-cols-2 gap-4 md:gap-6 mb-10">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors">
                  <h4 className="font-bold text-safari-gold text-xl md:text-2xl mb-2">Morning</h4>
                  <p className="text-sm text-gray-300">6:00 AM - 10:00 AM<br/>Best for predators</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors">
                  <h4 className="font-bold text-safari-gold text-xl md:text-2xl mb-2">Evening</h4>
                  <p className="text-sm text-gray-300">2:30 PM - 6:30 PM<br/>Best for elephants</p>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/safari')}
                className="group bg-safari-gold hover:bg-amber-warm text-forest font-bold py-4 px-8 rounded-full transition-all shadow-lg flex items-center gap-2 hover:gap-4"
              >
                <span>Explore Safari Packages</span>
                <i className="fas fa-chevron-right transition-all" style={{fontSize: '20px'}}></i>
              </button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4 pt-12">
                <div className="overflow-hidden rounded-3xl shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1581404117765-1d48c823023e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Leopard" className="w-full h-64 object-cover hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="overflow-hidden rounded-3xl shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1544605927-4632ce6fdbfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Elephant" className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="overflow-hidden rounded-3xl shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1534948216015-843149f72be3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Safari Jeep" className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="overflow-hidden rounded-3xl shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1629731697334-01047eef090d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Peacock" className="w-full h-64 object-cover hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Vehicles Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest/5 text-forest font-semibold text-sm mb-4">
                <i className="fas fa-award text-safari-gold" style={{fontSize: '16px'}}></i>
                <span>Premium Fleet</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-forest mb-4 tracking-tight">Luxury Transport Options</h2>
              <p className="text-lg text-charcoal/70 leading-relaxed">
                Choose from our fleet of comfortable, air-conditioned vehicles for your journey to any destination. All vehicles include a professional, English-speaking driver.
              </p>
            </div>
            <button 
              onClick={() => navigate('/vehicles')}
              className="text-forest font-bold hover:text-safari-gold transition-colors flex items-center gap-2 group flex-shrink-0"
            >
              <span className="underline underline-offset-4">View All Vehicles</span>
              <i className="fas fa-chevron-right group-hover:translate-x-1 transition-transform" style={{fontSize: '18px'}}></i>
            </button>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {MOCK_VEHICLES.map((vehicle) => (
              <motion.div key={vehicle.id} variants={fadeInUp} className="h-full">
                <VehicleCard 
                  vehicle={vehicle} 
                  onBook={() => navigate('/book')} 
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Blog Section */}
      <section className="py-24 bg-off-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest/5 text-forest font-semibold text-sm mb-4">
                <i className="fas fa-book-open text-safari-gold" style={{fontSize: '16px'}}></i>
                <span>Travel Stories</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-forest mb-4 tracking-tight">From Our Blog</h2>
              <p className="text-lg text-charcoal/70 leading-relaxed">
                Discover hidden gems, travel tips, and stories from across the beautiful island of Sri Lanka.
              </p>
            </div>
            <button 
              className="text-forest font-bold hover:text-safari-gold transition-colors flex items-center gap-2 group flex-shrink-0"
            >
              <span className="underline underline-offset-4">Read All Articles</span>
              <i className="fas fa-chevron-right group-hover:translate-x-1 transition-transform" style={{fontSize: '18px'}}></i>
            </button>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Blog Post 1 */}
            <motion.div variants={fadeInUp} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1582239459520-410a568bba06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Sigiriya Rock" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-forest">
                  Destinations
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><i className="far fa-calendar"></i> Oct 12, 2026</span>
                  <span className="flex items-center gap-1"><i className="far fa-clock"></i> 5 min read</span>
                </div>
                <h3 className="text-xl font-bold text-forest mb-3 group-hover:text-safari-gold transition-colors">
                  A Guide to Climbing Sigiriya Rock Fortress
                </h3>
                <p className="text-charcoal/70 text-sm mb-6 line-clamp-3">
                  Everything you need to know about visiting the ancient rock fortress of Sigiriya, including the best time to climb and what to expect on your journey to the top.
                </p>
                <button className="text-forest font-semibold text-sm hover:text-safari-gold transition-colors flex items-center gap-2">
                  Read More <i className="fas fa-arrow-right text-[12px]"></i>
                </button>
              </div>
            </motion.div>

            {/* Blog Post 2 */}
            <motion.div variants={fadeInUp} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1544256673-db66894c7e6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Yala Safari" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-forest">
                  Wildlife
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><i className="far fa-calendar"></i> Oct 05, 2026</span>
                  <span className="flex items-center gap-1"><i className="far fa-clock"></i> 8 min read</span>
                </div>
                <h3 className="text-xl font-bold text-forest mb-3 group-hover:text-safari-gold transition-colors">
                  Spotting Leopards in Yala National Park
                </h3>
                <p className="text-charcoal/70 text-sm mb-6 line-clamp-3">
                  Yala is famously known for its high density of leopards. Here's our comprehensive guide to maximizing your chances of seeing these elusive big cats in the wild.
                </p>
                <button className="text-forest font-semibold text-sm hover:text-safari-gold transition-colors flex items-center gap-2">
                  Read More <i className="fas fa-arrow-right text-[12px]"></i>
                </button>
              </div>
            </motion.div>

            {/* Blog Post 3 */}
            <motion.div variants={fadeInUp} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Sri Lankan Tea Plantation" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-forest">
                  Culture
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><i className="far fa-calendar"></i> Sep 28, 2026</span>
                  <span className="flex items-center gap-1"><i className="far fa-clock"></i> 6 min read</span>
                </div>
                <h3 className="text-xl font-bold text-forest mb-3 group-hover:text-safari-gold transition-colors">
                  The Scenic Train Ride to Ella
                </h3>
                <p className="text-charcoal/70 text-sm mb-6 line-clamp-3">
                  Considered one of the most beautiful train journeys in the world. Discover the breathtaking views of tea plantations and misty mountains from Kandy to Ella.
                </p>
                <button className="text-forest font-semibold text-sm hover:text-safari-gold transition-colors flex items-center gap-2">
                  Read More <i className="fas fa-arrow-right text-[12px]"></i>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;

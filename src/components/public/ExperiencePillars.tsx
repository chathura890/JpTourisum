import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PILLARS = [
  {
    id: 'heritage',
    title: 'Heritage & Culture',
    sinhalaTag: 'අසිරිමත් උරුමය',
    subtitle: '2,500+ Years of Sacred Civilizations',
    image: 'https://images.unsplash.com/photo-1582239459520-410a568bba06?auto=format&fit=crop&w=800&q=80',
    description: 'Explore 8 UNESCO World Heritage sites including the towering Sigiriya Lion Rock and the sacred Temple of the Tooth in Kandy.',
    icon: 'fa-monument',
    highlights: ['Sigiriya Lion Citadel', 'Kandy Dalada Maligawa', 'Dambulla Cave Frescoes'],
    modeFilter: 'cultural'
  },
  {
    id: 'wildlife',
    title: 'Wild & Biodiversity',
    sinhalaTag: 'වනජීවී ආශ්චර්යය',
    subtitle: 'Big Cats, Wild Elephants & Whales',
    image: 'https://images.unsplash.com/photo-1547970810-dc1eac3ac11c?auto=format&fit=crop&w=800&q=80',
    description: 'Encounter the world’s highest density of wild leopards in Yala, the legendary Minneriya Elephant Gathering, and ocean giants.',
    icon: 'fa-paw',
    highlights: ['Yala Leopard Safari', 'Minneriya Elephant Gathering', 'Mirissa Whale Safari'],
    modeFilter: 'wildlife'
  },
  {
    id: 'scenic',
    title: 'Scenic Highlands & Coasts',
    sinhalaTag: 'සුන්දර සොබාසිරිය',
    subtitle: 'Misty Mountains & Golden Beaches',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
    description: 'Bask on palm-fringed tropical coastlines and take the world’s most scenic blue train through lush rolling Ceylon tea estates.',
    icon: 'fa-mountain-sun',
    highlights: ['Nine Arch Bridge in Ella', 'Nuwara Eliya Tea Valleys', 'Unawatuna & Mirissa Bays'],
    modeFilter: 'scenic'
  },
  {
    id: 'adventure',
    title: 'Thrills & Adventure',
    sinhalaTag: 'ත්‍රාසජනක අත්දැකීම්',
    subtitle: 'Surfing, Trekking & White Water',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: 'Catch clean point-breaks in Weligama, conquer the heights of Ella Rock, or raft the roaring rapids of the Kelani River.',
    icon: 'fa-person-hiking',
    highlights: ['Surfing in Weligama', 'Kitulgala White Water Rafting', 'Horton Plains & World’s End'],
    modeFilter: 'adventure'
  },
  {
    id: 'culinary',
    title: 'Ceylon Spices & Flavours',
    sinhalaTag: 'සිලෝන් රස රහස්',
    subtitle: 'Authentic Island Gastronomy',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    description: 'Savour the world’s purest Ceylon cinnamon, fragrant curries infused with fresh coconut milk, and fiery coastal seafood delicacies.',
    icon: 'fa-utensils',
    highlights: ['Spice Garden Walkthrough', 'Authentic Claypot Curries', 'Ceylon Tea Masterclass'],
    modeFilter: 'cultural'
  },
  {
    id: 'wellness',
    title: 'Ayurveda & Wellness',
    sinhalaTag: 'සුවතාවය හා ආයුර්වේදය',
    subtitle: 'Ancient Indigenous Healing & Peace',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Rejuvenate your senses with 3,000-year-old Hela Wedakam herbal treatments, warm medicinal oil therapy, and yoga by the ocean.',
    icon: 'fa-spa',
    highlights: ['Holistic Herbal Baths', 'Ayurvedic Wellness Retreats', 'Oceanfront Sunrise Yoga'],
    modeFilter: 'scenic'
  }
];

export const ExperiencePillars: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest/5 border border-forest/15 text-forest font-semibold text-xs tracking-wider uppercase mb-3">
            <i className="fas fa-sun text-safari-gold"></i>
            <span>Inspired by Official Sri Lanka Tourism</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-forest tracking-tight mb-4">
            The 6 Pillars of <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-safari-gold">Ceylon Wonder</span>
          </h2>
          <p className="text-base md:text-lg text-charcoal/70 leading-relaxed">
            Sri Lanka is more than just a tropical island. Explore the six signature pillars that make every journey deeply memorable and uniquely diverse.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PILLARS.map((pillar) => (
            <motion.div
              key={pillar.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-md hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              {/* Image & Header Overlay */}
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={pillar.image} 
                  alt={pillar.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20"></div>

                {/* Sinhala Tag Badge */}
                <div className="absolute top-4 left-4 bg-safari-gold/90 backdrop-blur-sm text-forest font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  {pillar.sinhalaTag}
                </div>

                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center text-sm">
                  <i className={`fas ${pillar.icon}`}></i>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] text-gray-300 uppercase tracking-widest block font-medium mb-1">
                    {pillar.subtitle}
                  </span>
                  <h3 className="text-2xl font-black text-white drop-shadow">
                    {pillar.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs md:text-sm text-charcoal/75 leading-relaxed mb-5">
                    {pillar.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {pillar.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-forest font-semibold">
                        <i className="fas fa-check-circle text-safari-gold text-xs"></i>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/packages')}
                  className="w-full py-3 bg-gray-50 group-hover:bg-forest text-forest group-hover:text-safari-gold font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200 group-hover:border-forest"
                >
                  <span>Plan This Experience</span>
                  <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const TravelSeasonsGuide: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState<'nov-apr' | 'may-oct'>('nov-apr');

  return (
    <section className="py-20 md:py-24 bg-off-white relative overflow-hidden border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest/5 border border-forest/15 text-forest font-semibold text-xs tracking-wider uppercase mb-3">
            <i className="fas fa-cloud-sun text-safari-gold"></i>
            <span>Island Travel Climate Guide</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-forest tracking-tight mb-4">
            When is the <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-safari-gold">Best Time to Visit?</span>
          </h2>
          <p className="text-base text-charcoal/70 leading-relaxed">
            Sri Lanka is a year-round sunshine destination! Thanks to its two alternating monsoons, while one coast enjoys gentle showers, the opposite coast sparkles under clear blue skies.
          </p>
        </div>

        {/* Season Toggle Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white p-1.5 rounded-2xl shadow-md border border-gray-200">
            <button
              type="button"
              onClick={() => setSelectedSeason('nov-apr')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                selectedSeason === 'nov-apr'
                  ? 'bg-forest text-safari-gold shadow-md'
                  : 'text-charcoal/70 hover:text-forest'
              }`}
            >
              <i className="fas fa-umbrella-beach"></i>
              <span>Nov – Apr (South & West Coast Peak)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedSeason('may-oct')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                selectedSeason === 'may-oct'
                  ? 'bg-forest text-safari-gold shadow-md'
                  : 'text-charcoal/70 hover:text-forest'
              }`}
            >
              <i className="fas fa-water"></i>
              <span>May – Oct (East Coast & Elephants)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Season Showcase Card */}
        <motion.div
          key={selectedSeason}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-xl mb-12"
        >
          {selectedSeason === 'nov-apr' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-safari-gold block mb-1">
                  Peak Golden Season • Calmer Oceans
                </span>
                <h3 className="text-3xl font-black text-forest mb-4">
                  November to April: Southern Shores & Big Cats
                </h3>
                <p className="text-sm text-charcoal/75 leading-relaxed mb-6">
                  The ideal window to explore the southern and western coastlines. The seas at Galle, Mirissa, and Bentota are flat and calm, making it the prime season for <strong>Blue Whale watching</strong>, beach relaxation, and <strong>Yala leopard safaris</strong>.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8 text-xs">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <strong className="block text-forest text-sm mb-1 font-bold">Top Regions:</strong>
                    <span className="text-charcoal/80">Galle, Mirissa, Yala, Colombo, Bentota, Kandy</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <strong className="block text-forest text-sm mb-1 font-bold">Key Highlights:</strong>
                    <span className="text-charcoal/80">Whale Watching, Stilt Fishing, Yala Safaris, Tea Hills</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/packages')}
                  className="px-6 py-3.5 bg-forest hover:bg-forest/90 text-safari-gold font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <span>Explore Nov-Apr Packages</span>
                  <i className="fas fa-arrow-right text-xs"></i>
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-2xl h-80 relative">
                <img 
                  src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1000&q=80" 
                  alt="Southern Coast Sri Lanka" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-bold text-safari-gold">Avg Temp: 28°C - 32°C</span>
                  <div className="font-black text-lg">Southern Coast & UNESCO Forts</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-safari-gold block mb-1">
                  Surfing & Elephant Gathering Season
                </span>
                <h3 className="text-3xl font-black text-forest mb-4">
                  May to October: East Coast & Cultural Wonders
                </h3>
                <p className="text-sm text-charcoal/75 leading-relaxed mb-6">
                  While south coast experiences monsoon swells, Sri Lanka's East Coast (Trincomalee, Nilaveli, Arugam Bay) enjoys pristine sunshine and calm crystal-clear waters. This is also the peak time for <strong>The Great Elephant Gathering</strong> at Minneriya.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8 text-xs">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <strong className="block text-forest text-sm mb-1 font-bold">Top Regions:</strong>
                    <span className="text-charcoal/80">Sigiriya, Minneriya, Trincomalee, Pasikudah, Arugam Bay</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <strong className="block text-forest text-sm mb-1 font-bold">Key Highlights:</strong>
                    <span className="text-charcoal/80">Minneriya Gathering (300+ Elephants), Arugam Bay Surf, Pigeon Island Snorkeling</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/packages')}
                  className="px-6 py-3.5 bg-forest hover:bg-forest/90 text-safari-gold font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <span>Explore May-Oct Packages</span>
                  <i className="fas fa-arrow-right text-xs"></i>
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-2xl h-80 relative">
                <img 
                  src="https://images.unsplash.com/photo-1544605927-4632ce6fdbfa?auto=format&fit=crop&w=1000&q=80" 
                  alt="Elephant Gathering Minneriya" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-bold text-safari-gold">Avg Temp: 29°C - 33°C</span>
                  <div className="font-black text-lg">Minneriya Gathering & East Coast Waters</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Official Travel Logistics Mini-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center text-xl flex-shrink-0">
              <i className="fas fa-passport text-safari-gold"></i>
            </div>
            <div>
              <h5 className="font-bold text-sm text-forest mb-1">Sri Lanka ETA / Visa</h5>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Most travelers can apply for an Electronic Travel Authorization online via the official portal before landing at BIA Airport.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center text-xl flex-shrink-0">
              <i className="fas fa-money-bill-wave text-safari-gold"></i>
            </div>
            <div>
              <h5 className="font-bold text-sm text-forest mb-1">Currency & Payment</h5>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Sri Lankan Rupee (LKR) is official currency. Major cards (Visa, MasterCard) are accepted in resorts and supermarkets.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-xl flex-shrink-0">
              <i className="fas fa-phone-volume text-emerald-600"></i>
            </div>
            <div>
              <h5 className="font-bold text-sm text-forest mb-1">Tourist Safety & 1912</h5>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Sri Lanka Tourism operates a 24/7 dedicated Tourist Assistance Hotline at <strong>1912</strong> alongside <strong>1990 Emergency Ambulance</strong>.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

interface TourComparisonHeroProps {
  activeMode: 'custom' | 'packages';
  onSelectMode: (mode: 'custom' | 'packages') => void;
}

const TourComparisonHero: React.FC<TourComparisonHeroProps> = ({ activeMode, onSelectMode }) => {
  return (
    <div className="mb-12">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest/5 border border-forest/15 text-forest font-semibold text-xs tracking-wider uppercase mb-3">
          <i className="fas fa-compass text-safari-gold"></i>
          <span>Flexible Sri Lanka Tour Planning</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-forest tracking-tight mb-4">
          How Would You Like to <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-safari-gold">Explore Sri Lanka?</span>
        </h1>
        <p className="text-base md:text-lg text-charcoal/75 leading-relaxed">
          Choose between building your fully bespoke dream itinerary step-by-step or selecting from our hand-crafted, stress-free holiday packages.
        </p>
      </div>

      {/* Two Visually Distinct Cards (Comparison) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* CARD 01 – CUSTOM TOUR */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          onClick={() => onSelectMode('custom')}
          className={`cursor-pointer rounded-3xl p-8 transition-all relative flex flex-col justify-between border-2 ${
            activeMode === 'custom'
              ? 'bg-white border-forest shadow-2xl ring-4 ring-forest/10'
              : 'bg-white/80 border-gray-200 hover:border-forest/50 hover:shadow-xl'
          }`}
        >
          {activeMode === 'custom' && (
            <div className="absolute top-4 right-4 bg-forest text-safari-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <i className="fas fa-check-circle"></i> Selected
            </div>
          )}

          <div>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-forest flex items-center justify-center text-2xl mb-6 shadow-inner">
              <i className="fa-solid fa-wand-magic-sparkles text-safari-gold"></i>
            </div>
            
            <span className="text-xs font-bold uppercase tracking-widest text-safari-gold block mb-1">
              Personalized Tailor-Made Journey
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-forest mb-3">
              Build Your Own Tour
            </h2>
            <p className="text-sm text-charcoal/70 mb-6 leading-relaxed">
              Create your perfect Sri Lankan adventure. Choose where to go, what to see, when to travel, and how to explore.
            </p>

            {/* Highlights */}
            <div className="border-t border-gray-100 pt-5 mb-8">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">What You Get:</h4>
              <ul className="space-y-2.5 text-sm text-charcoal/80">
                <li className="flex items-center gap-2.5">
                  <i className="fas fa-check text-safari-gold text-sm flex-shrink-0"></i>
                  <span><strong>Fully personalized itinerary</strong> across the island</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <i className="fas fa-check text-safari-gold text-sm flex-shrink-0"></i>
                  <span><strong>Select your own attractions</strong> per destination</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <i className="fas fa-check text-safari-gold text-sm flex-shrink-0"></i>
                  <span><strong>Flexible travel duration</strong> & departure timing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <i className="fas fa-check text-safari-gold text-sm flex-shrink-0"></i>
                  <span><strong>Choose your preferred vehicle</strong> (Sedan, Van, SUV, Bus)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <i className="fas fa-check text-safari-gold text-sm flex-shrink-0"></i>
                  <span><strong>With or without</strong> a licensed tour guide</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <i className="fas fa-check text-safari-gold text-sm flex-shrink-0"></i>
                  <span><strong>Dynamic estimated pricing</strong> updated live</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            type="button"
            className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeMode === 'custom'
                ? 'bg-forest text-white shadow-lg hover:bg-forest/90'
                : 'bg-forest/10 text-forest hover:bg-forest hover:text-white'
            }`}
          >
            <span>CREATE MY CUSTOM TOUR</span>
            <i className="fas fa-arrow-right text-xs"></i>
          </button>
        </motion.div>

        {/* CARD 02 – OUR TOUR PACKAGES */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          onClick={() => onSelectMode('packages')}
          className={`cursor-pointer rounded-3xl p-8 transition-all relative flex flex-col justify-between border-2 ${
            activeMode === 'packages'
              ? 'bg-[#0f2416] text-white border-safari-gold shadow-2xl ring-4 ring-safari-gold/20'
              : 'bg-white/80 border-gray-200 hover:border-safari-gold/50 hover:shadow-xl'
          }`}
        >
          {activeMode === 'packages' && (
            <div className="absolute top-4 right-4 bg-safari-gold text-forest text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <i className="fas fa-check-circle"></i> Selected
            </div>
          )}

          <div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner ${
              activeMode === 'packages' ? 'bg-white/10 text-safari-gold' : 'bg-forest/5 text-forest'
            }`}>
              <i className="fa-solid fa-umbrella-beach text-safari-gold"></i>
            </div>
            
            <span className="text-xs font-bold uppercase tracking-widest text-safari-gold block mb-1">
              Curated All-Inclusive Holidays
            </span>
            <h2 className={`text-2xl md:text-3xl font-black mb-3 ${
              activeMode === 'packages' ? 'text-white' : 'text-forest'
            }`}>
              Explore Our Tour Packages
            </h2>
            <p className={`text-sm mb-6 leading-relaxed ${
              activeMode === 'packages' ? 'text-gray-300' : 'text-charcoal/70'
            }`}>
              Discover professionally planned Sri Lanka holidays with carefully selected destinations and travel experiences.
            </p>

            {/* Highlights */}
            <div className={`border-t pt-5 mb-8 ${activeMode === 'packages' ? 'border-white/10' : 'border-gray-100'}`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                activeMode === 'packages' ? 'text-gray-400' : 'text-gray-400'
              }`}>What You Get:</h4>
              <ul className={`space-y-2.5 text-sm ${activeMode === 'packages' ? 'text-gray-200' : 'text-charcoal/80'}`}>
                <li className="flex items-center gap-2.5">
                  <i className="fas fa-check text-safari-gold text-sm flex-shrink-0"></i>
                  <span><strong>Ready-made itineraries</strong> expertly balanced</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <i className="fas fa-check text-safari-gold text-sm flex-shrink-0"></i>
                  <span><strong>Carefully selected destinations</strong> & top highlights</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <i className="fas fa-check text-safari-gold text-sm flex-shrink-0"></i>
                  <span><strong>Preplanned travel experiences</strong> with zero stress</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <i className="fas fa-check text-safari-gold text-sm flex-shrink-0"></i>
                  <span><strong>Clear package inclusions</strong> and transparent exclusions</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <i className="fas fa-check text-safari-gold text-sm flex-shrink-0"></i>
                  <span><strong>Configured package pricing</strong> with guaranteed rates</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <i className="fas fa-check text-safari-gold text-sm flex-shrink-0"></i>
                  <span><strong>Easy 1-click booking</strong> without manual planning</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            type="button"
            className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeMode === 'packages'
                ? 'bg-safari-gold text-forest shadow-lg hover:bg-amber-300'
                : 'bg-forest/10 text-forest hover:bg-forest hover:text-white'
            }`}
          >
            <span>EXPLORE OUR PACKAGES</span>
            <i className="fas fa-arrow-right text-xs"></i>
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default TourComparisonHero;

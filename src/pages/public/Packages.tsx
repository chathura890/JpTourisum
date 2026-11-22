import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TourComparisonHero from '../../components/packages/TourComparisonHero';
import { CustomTourStepper } from '../../components/packages/CustomTourStepper';
import { CuratedPackagesList } from '../../components/packages/CuratedPackagesList';

const Packages = () => {
  const location = useLocation();
  const [activeMode, setActiveMode] = useState<'custom' | 'packages'>('custom');

  // Check URL query parameters (e.g. ?mode=packages or ?mode=custom)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'packages' || mode === 'custom') {
      setActiveMode(mode);
    }
  }, [location.search]);

  return (
    <div className="pt-28 pb-24 bg-off-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Comparison Hero with the 2 distinct cards */}
        <TourComparisonHero 
          activeMode={activeMode} 
          onSelectMode={(mode) => setActiveMode(mode)} 
        />

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white p-1.5 rounded-2xl shadow-md border border-gray-200">
            <button
              type="button"
              onClick={() => setActiveMode('custom')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                activeMode === 'custom'
                  ? 'bg-forest text-safari-gold shadow-md'
                  : 'text-charcoal/70 hover:text-forest'
              }`}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              <span>Custom Tour Builder (8 Steps)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('packages')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                activeMode === 'packages'
                  ? 'bg-forest text-safari-gold shadow-md'
                  : 'text-charcoal/70 hover:text-forest'
              }`}
            >
              <i className="fa-solid fa-umbrella-beach"></i>
              <span>Our Curated Packages</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display Area */}
        {activeMode === 'custom' ? (
          <div>
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-xs font-bold text-safari-gold uppercase tracking-widest block">Option 01</span>
                <h3 className="text-2xl font-black text-forest">Personalized Tour Builder</h3>
              </div>
              <span className="text-xs text-gray-500 hidden sm:block">Step-by-step custom itinerary</span>
            </div>
            <CustomTourStepper />
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-xs font-bold text-safari-gold uppercase tracking-widest block">Option 02</span>
                <h3 className="text-2xl font-black text-forest">Company-Designed Sri Lanka Holiday Packages</h3>
              </div>
              <span className="text-xs text-gray-500 hidden sm:block">Preplanned stress-free vacations</span>
            </div>
            <CuratedPackagesList />
          </div>
        )}

        {/* Trust & Guarantee Banner */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-white rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-forest/5 text-forest flex items-center justify-center text-xl flex-shrink-0">
              <i className="fas fa-shield-alt text-safari-gold"></i>
            </div>
            <div>
              <h5 className="font-bold text-sm text-forest">SLTDA Certified</h5>
              <p className="text-xs text-charcoal/70">Approved by Sri Lanka Tourism Development Authority</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-forest/5 text-forest flex items-center justify-center text-xl flex-shrink-0">
              <i className="fas fa-hand-holding-dollar text-safari-gold"></i>
            </div>
            <div>
              <h5 className="font-bold text-sm text-forest">No Hidden Fees</h5>
              <p className="text-xs text-charcoal/70">100% transparent pricing for vehicles, fuel & tolls</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-forest/5 text-forest flex items-center justify-center text-xl flex-shrink-0">
              <i className="fas fa-calendar-check text-safari-gold"></i>
            </div>
            <div>
              <h5 className="font-bold text-sm text-forest">Flexible Changes</h5>
              <p className="text-xs text-charcoal/70">Free date adjustment up to 48 hours before arrival</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-forest/5 text-forest flex items-center justify-center text-xl flex-shrink-0">
              <i className="fas fa-headset text-safari-gold"></i>
            </div>
            <div>
              <h5 className="font-bold text-sm text-forest">24/7 Road Support</h5>
              <p className="text-xs text-charcoal/70">Instant WhatsApp coordination during your entire trip</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Packages;

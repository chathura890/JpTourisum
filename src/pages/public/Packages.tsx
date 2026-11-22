
import { useSettings } from '../../context/SettingsContext';

const Packages = () => {
  const { formatPrice } = useSettings();

  return (
    <div className="pt-28 pb-20 bg-off-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-forest mb-4">Complete Tour Packages</h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            All-inclusive packages from your location to any destination and back. Transparent pricing with no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Basic */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col">
            <h3 className="text-2xl font-bold text-forest mb-2">Essential Safari</h3>
            <p className="text-charcoal/60 text-sm mb-6">Perfect for self-arriving guests</p>
            <div className="text-4xl font-black text-charcoal mb-8">{formatPrice(45)} <span className="text-base font-medium text-gray-400">/ person</span></div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3"><i className="fas fa-check text-safari-gold flex-shrink-0" style={{fontSize: '20px'}}></i> <span className="text-sm text-charcoal/80">4-Hour Safari Jeep Ride</span></li>
              <li className="flex items-start gap-3"><i className="fas fa-check text-safari-gold flex-shrink-0" style={{fontSize: '20px'}}></i> <span className="text-sm text-charcoal/80">Park Entrance Fees</span></li>
              <li className="flex items-start gap-3"><i className="fas fa-check text-safari-gold flex-shrink-0" style={{fontSize: '20px'}}></i> <span className="text-sm text-charcoal/80">Experienced Tracker</span></li>
              <li className="flex items-start gap-3"><i className="fas fa-check text-safari-gold flex-shrink-0" style={{fontSize: '20px'}}></i> <span className="text-sm text-charcoal/80">Bottled Water</span></li>
            </ul>
            <button className="w-full py-3 rounded-xl font-bold border-2 border-forest text-forest hover:bg-forest hover:text-white transition-colors">Select Package</button>
          </div>

          {/* Premium */}
          <div className="bg-forest rounded-3xl p-8 shadow-2xl flex flex-col relative transform md:-translate-y-4 border-2 border-safari-gold">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-safari-gold text-forest font-bold px-4 py-1 rounded-full text-sm uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Complete Journey</h3>
            <p className="text-gray-300 text-sm mb-6">Full transport + safari from anywhere</p>
            <div className="text-4xl font-black text-safari-gold mb-8">Custom <span className="text-base font-medium text-gray-300">quote</span></div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3"><i className="fas fa-check text-safari-gold flex-shrink-0" style={{fontSize: '20px'}}></i> <span className="text-sm text-gray-200">A/C Transport (To & From)</span></li>
              <li className="flex items-start gap-3"><i className="fas fa-check text-safari-gold flex-shrink-0" style={{fontSize: '20px'}}></i> <span className="text-sm text-gray-200">Half-Day Safari Jeep</span></li>
              <li className="flex items-start gap-3"><i className="fas fa-check text-safari-gold flex-shrink-0" style={{fontSize: '20px'}}></i> <span className="text-sm text-gray-200">Park Entrance Fees</span></li>
              <li className="flex items-start gap-3"><i className="fas fa-check text-safari-gold flex-shrink-0" style={{fontSize: '20px'}}></i> <span className="text-sm text-gray-200">Expert Tracker & Driver</span></li>
              <li className="flex items-start gap-3"><i className="fas fa-check text-safari-gold flex-shrink-0" style={{fontSize: '20px'}}></i> <span className="text-sm text-gray-200">Refreshments</span></li>
            </ul>
            <button className="w-full py-3 rounded-xl font-bold bg-safari-gold text-forest hover:bg-amber-warm transition-colors shadow-lg">Get Custom Quote</button>
          </div>

          {/* Luxury */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col">
            <h3 className="text-2xl font-bold text-forest mb-2">Luxury Full Day</h3>
            <p className="text-charcoal/60 text-sm mb-6">The ultimate wildlife experience</p>
            <div className="text-4xl font-black text-charcoal mb-8">{formatPrice(120)} <span className="text-base font-medium text-gray-400">/ person</span></div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3"><i className="fas fa-check text-safari-gold flex-shrink-0" style={{fontSize: '20px'}}></i> <span className="text-sm text-charcoal/80">Full-Day Safari (12 Hours)</span></li>
              <li className="flex items-start gap-3"><i className="fas fa-check text-safari-gold flex-shrink-0" style={{fontSize: '20px'}}></i> <span className="text-sm text-charcoal/80">Luxury Modified Jeep</span></li>
              <li className="flex items-start gap-3"><i className="fas fa-check text-safari-gold flex-shrink-0" style={{fontSize: '20px'}}></i> <span className="text-sm text-charcoal/80">Breakfast & Lunch Included</span></li>
              <li className="flex items-start gap-3"><i className="fas fa-check text-safari-gold flex-shrink-0" style={{fontSize: '20px'}}></i> <span className="text-sm text-charcoal/80">Premium Photography Seats</span></li>
            </ul>
            <button className="w-full py-3 rounded-xl font-bold border-2 border-forest text-forest hover:bg-forest hover:text-white transition-colors">Select Package</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Packages;

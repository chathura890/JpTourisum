import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';
import { 
  DESTINATIONS, 
  ATTRACTIONS, 
  TOUR_VEHICLES, 
  TOUR_GUIDE_OPTIONS, 
  ADDITIONAL_SERVICES
} from '../../data/tourData';
import { tourService, type CustomTourState, type PriceBreakdown } from '../../services/tourService';

const STEP_DEFINITIONS = [
  { step: 1, title: 'Destinations', question: 'Where do you want to travel?', icon: 'fa-map-location-dot' },
  { step: 2, title: 'Attractions', question: 'What places would you like to visit?', icon: 'fa-monument' },
  { step: 3, title: 'Dates & Duration', question: 'When would you like to travel?', icon: 'fa-calendar-days' },
  { step: 4, title: 'Vehicle', question: 'Which vehicle would you prefer?', icon: 'fa-car-side' },
  { step: 5, title: 'Tour Guide', question: 'Would you like a professional tour guide?', icon: 'fa-user-tie' },
  { step: 6, title: 'Add-ons', question: 'Would you like any additional services?', icon: 'fa-compass' },
  { step: 7, title: 'Price Summary', question: 'Your estimated tour price', icon: 'fa-receipt' },
  { step: 8, title: 'Guest Details', question: 'Almost there! Tell us about yourself', icon: 'fa-clipboard-check' },
];

export const CustomTourStepper: React.FC = () => {
  const { formatPrice } = useSettings();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{ referenceId: string; message: string } | null>(null);

  // Form State
  const [tourState, setTourState] = useState<CustomTourState>(() => {
    // Default 5-day tour starting tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    const end = new Date(tomorrow);
    end.setDate(end.getDate() + 5);

    return {
      selectedDestinationIds: ['galle', 'ella', 'kandy'],
      selectedAttractionIds: ['galle-fort', 'galle-lighthouse', 'nine-arch-bridge', 'little-adams-peak', 'temple-tooth'],
      startDate: tomorrow.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      days: 6,
      nights: 5,
      departureTime: '08:00',
      selectedVehicleId: 'kdh-van',
      passengers: 2,
      luggage: 2,
      guideOption: 'licensed_guide',
      guideLanguage: 'English',
      selectedServiceIds: ['scenic-train-tickets'],
      guest: {
        fullName: '',
        email: '',
        phone: '',
        country: '',
        pickupLocation: 'Bandaranaike International Airport (CMB)',
        specialNotes: ''
      }
    };
  });

  // Calculate Days & Nights when dates change
  const handleDateChange = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const days = nights + 1;
      setTourState(prev => ({
        ...prev,
        startDate: startStr,
        endDate: endStr,
        days: Math.max(1, days),
        nights: Math.max(0, nights)
      }));
    } else {
      setTourState(prev => ({ ...prev, startDate: startStr, endDate: endStr }));
    }
  };

  // Toggle Destination
  const toggleDestination = (destId: string) => {
    setTourState(prev => {
      const exists = prev.selectedDestinationIds.includes(destId);
      let updatedDestinations = exists 
        ? prev.selectedDestinationIds.filter(id => id !== destId)
        : [...prev.selectedDestinationIds, destId];

      // Remove attractions belonging to deselected destination
      const remainingAttractions = prev.selectedAttractionIds.filter(attrId => {
        const attr = ATTRACTIONS.find(a => a.id === attrId);
        return attr && updatedDestinations.includes(attr.destinationId);
      });

      // Auto-select must-see attractions of newly added destination
      if (!exists) {
        const newMustSees = ATTRACTIONS.filter(a => a.destinationId === destId && a.mustSee).map(a => a.id);
        newMustSees.forEach(msId => {
          if (!remainingAttractions.includes(msId)) remainingAttractions.push(msId);
        });
      }

      return {
        ...prev,
        selectedDestinationIds: updatedDestinations,
        selectedAttractionIds: remainingAttractions
      };
    });
  };

  // Toggle Attraction
  const toggleAttraction = (attrId: string) => {
    setTourState(prev => {
      const exists = prev.selectedAttractionIds.includes(attrId);
      return {
        ...prev,
        selectedAttractionIds: exists 
          ? prev.selectedAttractionIds.filter(id => id !== attrId)
          : [...prev.selectedAttractionIds, attrId]
      };
    });
  };

  // Filtered attractions based on selected destinations (Requirement #2)
  const availableAttractions = useMemo(() => {
    return ATTRACTIONS.filter(attr => tourState.selectedDestinationIds.includes(attr.destinationId));
  }, [tourState.selectedDestinationIds]);

  // Total estimated attraction visiting time
  const totalAttractionHours = useMemo(() => {
    return tourState.selectedAttractionIds.reduce((sum, id) => {
      const a = ATTRACTIONS.find(item => item.id === id);
      return sum + (a ? a.durationHours : 0);
    }, 0);
  }, [tourState.selectedAttractionIds]);

  // Pacing Warning
  const isPacingWarning = useMemo(() => {
    const maxCapacityHours = tourState.days * 5.5; // ~5.5 visiting hours per day excluding driving
    return totalAttractionHours > maxCapacityHours && tourState.days > 0;
  }, [totalAttractionHours, tourState.days]);

  // Live Price Calculation
  const priceBreakdown: PriceBreakdown = useMemo(() => {
    return tourService.calculateCustomPrice(tourState);
  }, [tourState]);

  // Selected vehicle capacity check
  const selectedVehicle = TOUR_VEHICLES.find(v => v.id === tourState.selectedVehicleId) || TOUR_VEHICLES[0];
  const isVehicleOvercapacity = tourState.passengers > selectedVehicle.maxPassengers;

  // Validation before proceeding
  const validateStep = (step: number): { valid: boolean; error?: string } => {
    if (step === 1 && tourState.selectedDestinationIds.length === 0) {
      return { valid: false, error: 'Please select at least 1 destination to proceed.' };
    }
    if (step === 2 && tourState.selectedAttractionIds.length === 0) {
      return { valid: false, error: 'Please select at least 1 attraction you wish to visit.' };
    }
    if (step === 3 && (!tourState.startDate || !tourState.endDate || tourState.days < 1)) {
      return { valid: false, error: 'Please select valid travel dates.' };
    }
    if (step === 4 && isVehicleOvercapacity) {
      return { valid: false, error: `The selected vehicle only seats up to ${selectedVehicle.maxPassengers} passengers. Please choose a larger vehicle.` };
    }
    if (step === 8) {
      if (!tourState.guest.fullName.trim()) return { valid: false, error: 'Please enter your full name.' };
      if (!tourState.guest.email.trim() || !tourState.guest.email.includes('@')) return { valid: false, error: 'Please enter a valid email address.' };
      if (!tourState.guest.phone.trim()) return { valid: false, error: 'Please enter your contact phone or WhatsApp number.' };
    }
    return { valid: true };
  };

  const [stepError, setStepError] = useState<string | null>(null);

  const handleNext = () => {
    const check = validateStep(currentStep);
    if (!check.valid) {
      setStepError(check.error || 'Please review your selections.');
      return;
    }
    setStepError(null);
    setCurrentStep(prev => Math.min(8, prev + 1));
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStepError(null);
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // Submit Booking
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateStep(8);
    if (!check.valid) {
      setStepError(check.error || 'Please fill in required fields.');
      return;
    }

    setIsSubmitting(true);
    setStepError(null);

    try {
      const res = await tourService.submitCustomTourBooking(tourState, priceBreakdown);
      setConfirmationData({
        referenceId: res.referenceId,
        message: res.message
      });
    } catch {
      setStepError('An unexpected error occurred. Please try again or message our WhatsApp team.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      
      {/* ---------------------------------------------------- */}
      {/* HORIZONTAL STEPPER (Desktop) & COMPACT (Mobile)      */}
      {/* ---------------------------------------------------- */}
      <div className="bg-[#0f2416] text-white p-6 md:p-8 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-safari-gold font-bold text-xs uppercase tracking-widest mb-1">
              <span>Step 0{currentStep} of 08</span>
              <span>•</span>
              <span>{STEP_DEFINITIONS[currentStep - 1].title}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white">
              {STEP_DEFINITIONS[currentStep - 1].question}
            </h3>
          </div>

          {/* Quick Real-Time Cost Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl flex items-center justify-between md:justify-end gap-4">
            <div className="text-left md:text-right">
              <span className="text-[11px] text-gray-300 block uppercase tracking-wider font-semibold">Estimated Price</span>
              <span className="text-xl md:text-2xl font-black text-safari-gold">
                {formatPrice(priceBreakdown.estimatedTotal)}
              </span>
            </div>
            <div className="h-8 w-px bg-white/20 hidden md:block"></div>
            <div className="text-right text-xs text-gray-300 hidden md:block">
              <div>{tourState.days} Days / {tourState.nights} Nights</div>
              <div>{tourState.passengers} Guests</div>
            </div>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="relative pt-2">
          {/* Desktop Stepper */}
          <div className="hidden lg:grid grid-cols-8 gap-2 relative z-10">
            {STEP_DEFINITIONS.map(def => {
              const isDone = def.step < currentStep;
              const isCurrent = def.step === currentStep;

              return (
                <button
                  key={def.step}
                  type="button"
                  onClick={() => {
                    if (def.step < currentStep || validateStep(currentStep).valid) {
                      setStepError(null);
                      setCurrentStep(def.step);
                    }
                  }}
                  className={`flex flex-col items-center group transition-all text-left ${
                    isCurrent ? 'opacity-100' : isDone ? 'opacity-90 cursor-pointer' : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all mb-2 shadow-md ${
                    isDone 
                      ? 'bg-safari-gold text-forest' 
                      : isCurrent 
                        ? 'bg-white text-forest ring-4 ring-safari-gold/40 scale-110' 
                        : 'bg-white/15 text-white'
                  }`}>
                    {isDone ? <i className="fas fa-check"></i> : `0${def.step}`}
                  </div>
                  <span className={`text-[11px] text-center font-semibold tracking-tight ${isCurrent ? 'text-safari-gold font-bold' : 'text-gray-300'}`}>
                    {def.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Compact Progress Indicator */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="flex-1 bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-safari-gold h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 8) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-safari-gold min-w-max">
              Step {currentStep}/8
            </span>
          </div>
        </div>
      </div>

      {/* Validation Alert */}
      {stepError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 md:mx-10 mt-6 rounded-r-xl flex items-center justify-between text-red-700 text-sm">
          <div className="flex items-center gap-3">
            <i className="fas fa-circle-exclamation text-red-500 text-lg"></i>
            <span>{stepError}</span>
          </div>
          <button onClick={() => setStepError(null)} className="text-red-400 hover:text-red-700">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* STEP CONTENT CONTAINER                               */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 md:p-10">
        <AnimatePresence mode="wait">
          
          {/* STEP 01 – DESTINATIONS */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h4 className="text-xl font-bold text-forest">Choose Your Destinations</h4>
                  <p className="text-sm text-charcoal/70">
                    Select the key cities and regions you wish to visit. You can pick multiple locations across Sri Lanka.
                  </p>
                </div>
                <div className="bg-forest/5 border border-forest/15 px-4 py-1.5 rounded-full text-xs font-bold text-forest">
                  {tourState.selectedDestinationIds.length} Destination{tourState.selectedDestinationIds.length !== 1 ? 's' : ''} Selected
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {DESTINATIONS.map(dest => {
                  const isSelected = tourState.selectedDestinationIds.includes(dest.id);
                  return (
                    <div
                      key={dest.id}
                      onClick={() => toggleDestination(dest.id)}
                      className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all group relative flex flex-col justify-between ${
                        isSelected 
                          ? 'border-forest ring-4 ring-forest/10 bg-forest/5 shadow-xl' 
                          : 'border-gray-200 hover:border-forest/40 hover:shadow-lg bg-white'
                      }`}
                    >
                      {/* Image */}
                      <div className="relative h-44 overflow-hidden">
                        <img 
                          src={dest.image} 
                          alt={dest.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
                        
                        {/* Checkbox indicator */}
                        <div className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-forest text-safari-gold shadow-md' : 'bg-white/80 text-gray-400 backdrop-blur-sm'
                        }`}>
                          <i className={`fas ${isSelected ? 'fa-check text-xs' : 'fa-plus text-[10px]'}`}></i>
                        </div>

                        {dest.popularTag && (
                          <span className="absolute top-3 left-3 bg-safari-gold text-forest font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {dest.popularTag}
                          </span>
                        )}

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[11px] text-gray-300 uppercase tracking-widest block font-medium">{dest.region}</span>
                          <h5 className="font-bold text-lg leading-snug drop-shadow">{dest.name}</h5>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-charcoal/70 line-clamp-3 mb-3 leading-relaxed">
                          {dest.description}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
                          <span>Rec. Stay: {dest.recommendedDays} Days</span>
                          <span className={`font-bold ${isSelected ? 'text-forest' : 'text-gray-400'}`}>
                            {isSelected ? 'Selected' : '+ Add to tour'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 02 – ATTRACTIONS (Automatic Destination-Attraction Relationship) */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h4 className="text-xl font-bold text-forest">Attractions in Your Selected Destinations</h4>
                  <p className="text-sm text-charcoal/70">
                    Automatically filtered based on your destinations. Choose sights, experiences, and cultural landmarks.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-forest/5 border border-forest/15 px-3 py-1.5 rounded-xl text-xs font-bold text-forest">
                    {tourState.selectedAttractionIds.length} Sights Chosen
                  </div>
                  <div className="bg-safari-gold/20 border border-safari-gold/40 px-3 py-1.5 rounded-xl text-xs font-bold text-forest">
                    ~{totalAttractionHours} Visiting Hours
                  </div>
                </div>
              </div>

              {/* Group Attractions by Destination */}
              {tourState.selectedDestinationIds.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
                  <p className="text-amber-800 font-semibold mb-2">No destinations selected!</p>
                  <button 
                    onClick={() => setCurrentStep(1)} 
                    className="bg-forest text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Go Back & Select Destinations
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {tourState.selectedDestinationIds.map(destId => {
                    const dest = DESTINATIONS.find(d => d.id === destId);
                    const destAttractions = availableAttractions.filter(a => a.destinationId === destId);

                    return (
                      <div key={destId} className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-safari-gold"></span>
                            <h5 className="text-lg font-bold text-forest">{dest?.name}</h5>
                            <span className="text-xs text-gray-500 font-medium">({destAttractions.length} Attractions)</span>
                          </div>
                          <span className="text-xs text-forest/70 font-semibold">{dest?.region}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {destAttractions.map(attr => {
                            const isSelected = tourState.selectedAttractionIds.includes(attr.id);

                            return (
                              <div
                                key={attr.id}
                                onClick={() => toggleAttraction(attr.id)}
                                className={`cursor-pointer rounded-xl border p-4 transition-all flex gap-3 relative ${
                                  isSelected 
                                    ? 'bg-white border-forest ring-2 ring-forest/20 shadow-md' 
                                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                }`}
                              >
                                <img 
                                  src={attr.image} 
                                  alt={attr.name} 
                                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0" 
                                />

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-1 mb-1">
                                    <h6 className="font-bold text-sm text-forest truncate">{attr.name}</h6>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                                      isSelected ? 'bg-forest text-safari-gold' : 'border border-gray-300 text-transparent'
                                    }`}>
                                      <i className="fas fa-check"></i>
                                    </div>
                                  </div>

                                  <p className="text-[11px] text-charcoal/70 line-clamp-2 mb-2 leading-relaxed">
                                    {attr.description}
                                  </p>

                                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-semibold">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-charcoal">
                                      <i className="far fa-clock mr-1"></i>{attr.durationHours} hrs
                                    </span>
                                    <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                                      {attr.entranceFeeUSD > 0 ? `Entry: $${attr.entranceFeeUSD}` : 'Free Entry'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 03 – DATES & DURATION */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h4 className="text-xl font-bold text-forest">Travel Dates & Pace Planning</h4>
                  <p className="text-sm text-charcoal/70">
                    Inspired by Booking.com date-range selector. Pick your tour start and end dates.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-2">
                        <i className="fas fa-plane-arrival mr-2 text-safari-gold"></i>Start Date
                      </label>
                      <input 
                        type="date" 
                        value={tourState.startDate}
                        onChange={(e) => handleDateChange(e.target.value, tourState.endDate)}
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-charcoal focus:outline-none focus:border-forest shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-2">
                        <i className="fas fa-plane-departure mr-2 text-safari-gold"></i>End Date
                      </label>
                      <input 
                        type="date" 
                        value={tourState.endDate}
                        min={tourState.startDate}
                        onChange={(e) => handleDateChange(tourState.startDate, e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-charcoal focus:outline-none focus:border-forest shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Calculated summary pill */}
                  <div className="bg-white border border-forest/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-forest text-safari-gold flex items-center justify-center text-xl font-black">
                        {tourState.days}
                      </div>
                      <div>
                        <div className="font-bold text-forest text-base">
                          {tourState.days} Days / {tourState.nights} Nights Adventure
                        </div>
                        <div className="text-xs text-charcoal/70">
                          {tourState.startDate} to {tourState.endDate}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Daily Departure Time
                      </label>
                      <select 
                        value={tourState.departureTime}
                        onChange={(e) => setTourState(prev => ({ ...prev, departureTime: e.target.value }))}
                        className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-bold text-forest focus:outline-none"
                      >
                        <option value="06:30">06:30 AM (Best for wildlife/early climbers)</option>
                        <option value="08:00">08:00 AM (Recommended Standard)</option>
                        <option value="09:30">09:30 AM (Relaxed holiday pace)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Duration warning if overloaded */}
                {isPacingWarning && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
                    <i className="fas fa-triangle-exclamation text-amber-600 text-lg flex-shrink-0 mt-0.5"></i>
                    <div>
                      <strong className="block font-bold">Pacing Advice: Tight Itinerary Detected!</strong>
                      You have selected {tourState.selectedAttractionIds.length} attractions requiring ~{totalAttractionHours} hours within a {tourState.days}-day tour. We recommend extending your trip by 1 or 2 days for a relaxed, enjoyable experience across Sri Lankan scenic roads.
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 04 – VEHICLE */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Passengers & Luggage Filters */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-8 flex flex-wrap items-center justify-between gap-6">
                <div>
                  <h5 className="font-bold text-forest text-sm">Select Passenger & Luggage Requirements</h5>
                  <p className="text-xs text-charcoal/70">We filter available private vehicles based on your capacity requirements.</p>
                </div>

                <div className="flex items-center gap-6">
                  {/* Passengers */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-charcoal">Passengers:</span>
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                      <button 
                        type="button" 
                        onClick={() => setTourState(prev => ({ ...prev, passengers: Math.max(1, prev.passengers - 1) }))}
                        className="px-3 py-1.5 hover:bg-gray-100 text-charcoal font-bold"
                      >-</button>
                      <span className="px-3 py-1.5 text-xs font-bold text-forest">{tourState.passengers}</span>
                      <button 
                        type="button" 
                        onClick={() => setTourState(prev => ({ ...prev, passengers: prev.passengers + 1 }))}
                        className="px-3 py-1.5 hover:bg-gray-100 text-charcoal font-bold"
                      >+</button>
                    </div>
                  </div>

                  {/* Luggage */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-charcoal">Large Bags:</span>
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                      <button 
                        type="button" 
                        onClick={() => setTourState(prev => ({ ...prev, luggage: Math.max(0, prev.luggage - 1) }))}
                        className="px-3 py-1.5 hover:bg-gray-100 text-charcoal font-bold"
                      >-</button>
                      <span className="px-3 py-1.5 text-xs font-bold text-forest">{tourState.luggage}</span>
                      <button 
                        type="button" 
                        onClick={() => setTourState(prev => ({ ...prev, luggage: prev.luggage + 1 }))}
                        className="px-3 py-1.5 hover:bg-gray-100 text-charcoal font-bold"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TOUR_VEHICLES.map(vehicle => {
                  const isSelected = tourState.selectedVehicleId === vehicle.id;
                  const isExceeded = tourState.passengers > vehicle.maxPassengers;

                  return (
                    <div
                      key={vehicle.id}
                      onClick={() => {
                        if (!isExceeded) {
                          setTourState(prev => ({ ...prev, selectedVehicleId: vehicle.id }));
                        }
                      }}
                      className={`rounded-2xl border-2 transition-all p-5 flex flex-col justify-between relative ${
                        isSelected 
                          ? 'border-forest bg-forest/5 shadow-xl ring-2 ring-forest/20' 
                          : isExceeded
                            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 bg-white hover:border-forest/40 hover:shadow-md cursor-pointer'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 bg-forest text-safari-gold text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Selected
                        </span>
                      )}

                      <div>
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.name} 
                          className="w-full h-36 object-cover rounded-xl mb-4" 
                        />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-safari-gold block mb-1">
                          {vehicle.type}
                        </span>
                        <h5 className="font-bold text-base text-forest mb-2">{vehicle.name}</h5>
                        <p className="text-xs text-charcoal/70 mb-4">{vehicle.description}</p>

                        <div className="grid grid-cols-2 gap-2 text-xs text-charcoal/80 mb-4 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-1.5">
                            <i className="fas fa-users text-safari-gold"></i>
                            <span>Max {vehicle.maxPassengers} Seats</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <i className="fas fa-suitcase text-safari-gold"></i>
                            <span>Max {vehicle.maxLuggage} Bags</span>
                          </div>
                        </div>

                        <ul className="space-y-1.5 text-[11px] text-gray-500 mb-4">
                          {vehicle.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <i className="fas fa-check text-emerald-600 text-[10px]"></i>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-gray-400 block leading-none">Daily Rate</span>
                          <span className="text-lg font-black text-forest">{formatPrice(vehicle.pricePerDayUSD)}</span>
                          <span className="text-[10px] text-gray-500"> / day</span>
                        </div>
                        <button
                          type="button"
                          disabled={isExceeded}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                            isSelected 
                              ? 'bg-forest text-white' 
                              : isExceeded 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-100 text-forest hover:bg-forest hover:text-white'
                          }`}
                        >
                          {isSelected ? 'Chosen' : isExceeded ? 'Too Small' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 05 – TOUR GUIDE */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h4 className="text-xl font-bold text-forest">Tour Guide Options</h4>
                  <p className="text-sm text-charcoal/70">
                    Choose whether you want a dedicated licensed tourist guide lecturer or driver-only option.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {TOUR_GUIDE_OPTIONS.map(opt => {
                    const isSelected = tourState.guideOption === opt.type;

                    return (
                      <div
                        key={opt.type}
                        onClick={() => setTourState(prev => ({ ...prev, guideOption: opt.type }))}
                        className={`cursor-pointer rounded-2xl border-2 p-6 transition-all relative flex flex-col justify-between ${
                          isSelected 
                            ? 'border-forest bg-forest/5 shadow-xl ring-2 ring-forest/20' 
                            : 'border-gray-200 bg-white hover:border-forest/40 hover:shadow-md'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-4 right-4 bg-forest text-safari-gold text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                            Selected
                          </div>
                        )}

                        <div>
                          <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center text-xl mb-4">
                            <i className={`fas ${opt.type === 'licensed_guide' ? 'fa-id-badge' : 'fa-steering-wheel text-safari-gold'}`}></i>
                          </div>

                          <h5 className="font-bold text-lg text-forest mb-2">{opt.title}</h5>
                          <p className="text-xs text-charcoal/70 mb-4 leading-relaxed">{opt.description}</p>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-gray-400 block">Cost</span>
                            <span className="text-lg font-black text-forest">
                              {opt.pricePerDayUSD === 0 ? 'Included (Free)' : `${formatPrice(opt.pricePerDayUSD)} / day`}
                            </span>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                            isSelected ? 'bg-forest text-white' : 'bg-gray-100 text-charcoal'
                          }`}>
                            {isSelected ? 'Active' : 'Choose'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* If licensed guide is selected, show language selector */}
                {tourState.guideOption === 'licensed_guide' && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                    <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">
                      <i className="fas fa-language mr-2"></i>Preferred Guide Language
                    </label>
                    <select
                      value={tourState.guideLanguage}
                      onChange={(e) => setTourState(prev => ({ ...prev, guideLanguage: e.target.value }))}
                      className="w-full bg-white border border-emerald-300 rounded-xl px-4 py-3 text-sm font-semibold text-charcoal focus:outline-none focus:border-emerald-600"
                    >
                      {TOUR_GUIDE_OPTIONS.find(o => o.type === 'licensed_guide')?.languagesAvailable.map(lang => (
                        <option key={lang} value={lang}>{lang} Speaking Guide</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-emerald-800 mt-2">
                      All our guides are officially licensed by the Sri Lanka Tourism Development Authority (SLTDA).
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 06 – ADDITIONAL SERVICES */}
          {currentStep === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h4 className="text-xl font-bold text-forest">Enhance Your Journey (Optional Add-ons)</h4>
                <p className="text-sm text-charcoal/70">
                  Select handpicked authentic experiences, private safaris, and airport services.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ADDITIONAL_SERVICES.map(srv => {
                  const isSelected = tourState.selectedServiceIds.includes(srv.id);

                  return (
                    <div
                      key={srv.id}
                      onClick={() => {
                        setTourState(prev => ({
                          ...prev,
                          selectedServiceIds: isSelected 
                            ? prev.selectedServiceIds.filter(id => id !== srv.id)
                            : [...prev.selectedServiceIds, srv.id]
                        }));
                      }}
                      className={`cursor-pointer rounded-2xl border-2 p-5 transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'border-forest bg-forest/5 shadow-xl ring-2 ring-forest/20' 
                          : 'border-gray-200 bg-white hover:border-forest/40 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-safari-gold/20 text-forest flex items-center justify-center text-lg">
                            <i className={`fas ${srv.icon}`}></i>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
                            {srv.category}
                          </span>
                        </div>

                        <h5 className="font-bold text-base text-forest mb-2">{srv.title}</h5>
                        <p className="text-xs text-charcoal/70 leading-relaxed mb-4">{srv.description}</p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-gray-400 block">Rate</span>
                          <span className="text-base font-black text-forest">
                            {srv.priceUSD === 0 ? 'Complimentary' : formatPrice(srv.priceUSD)}
                          </span>
                          {srv.perPerson && srv.priceUSD > 0 && <span className="text-[10px] text-gray-500"> / person</span>}
                        </div>

                        <button
                          type="button"
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-forest text-safari-gold shadow-md' : 'border border-gray-300 text-gray-400'
                          }`}
                        >
                          <i className={`fas ${isSelected ? 'fa-check' : 'fa-plus'} text-xs`}></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 07 – PRICE SUMMARY */}
          {currentStep === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h4 className="text-2xl font-black text-forest">Transparent Estimated Tour Price</h4>
                  <p className="text-sm text-charcoal/70">
                    Live calculated based on your travel duration, vehicle type, tour guide choice, and included attractions.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 mb-6 shadow-sm">
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Itemized Breakdown:</h5>

                  <div className="space-y-3.5 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <div>
                        <span className="font-bold text-forest">Private Vehicle ({selectedVehicle.name})</span>
                        <div className="text-xs text-gray-500">{tourState.days} Days @ {formatPrice(selectedVehicle.pricePerDayUSD)}/day (Fuel & Highway Tolls Included)</div>
                      </div>
                      <span className="font-bold text-charcoal">{formatPrice(priceBreakdown.vehicleCost)}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <div>
                        <span className="font-bold text-forest">Dedicated Chauffeur Allowance & Services</span>
                        <div className="text-xs text-gray-500">Accommodation, meals, and driver support for {tourState.days} days</div>
                      </div>
                      <span className="font-bold text-charcoal">{formatPrice(priceBreakdown.driverAllowance)}</span>
                    </div>

                    {priceBreakdown.tourGuideCost > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div>
                          <span className="font-bold text-forest">Licensed Tour Guide ({tourState.guideLanguage})</span>
                          <div className="text-xs text-gray-500">{tourState.days} Days certified SLTDA Guide Lecturer</div>
                        </div>
                        <span className="font-bold text-charcoal">{formatPrice(priceBreakdown.tourGuideCost)}</span>
                      </div>
                    )}

                    {priceBreakdown.attractionEntranceFees > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div>
                          <span className="font-bold text-forest">Attraction Entrance Fees (Estimated)</span>
                          <div className="text-xs text-gray-500">For {tourState.passengers} passenger(s) across selected ticketed monuments</div>
                        </div>
                        <span className="font-bold text-charcoal">{formatPrice(priceBreakdown.attractionEntranceFees)}</span>
                      </div>
                    )}

                    {priceBreakdown.additionalServicesCost > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div>
                          <span className="font-bold text-forest">Additional Experiences & Transfers</span>
                          <div className="text-xs text-gray-500">{tourState.selectedServiceIds.length} Add-on service(s) selected</div>
                        </div>
                        <span className="font-bold text-charcoal">{formatPrice(priceBreakdown.additionalServicesCost)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 text-xs text-gray-500">
                      <span>Government Tourism Cess & Handling (5%)</span>
                      <span>{formatPrice(priceBreakdown.taxesAndServiceFees)}</span>
                    </div>

                    <div className="pt-4 border-t-2 border-forest/30 flex justify-between items-baseline">
                      <div>
                        <span className="text-lg md:text-xl font-black text-forest">Estimated Total</span>
                        <span className="text-xs text-gray-400 block">Price in your selected currency ({tourState.passengers} Guests)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl md:text-4xl font-black text-forest">
                          {formatPrice(priceBreakdown.estimatedTotal)}
                        </span>
                        <span className="text-xs text-safari-gold font-bold block">
                          ≈ {formatPrice(Math.round(priceBreakdown.estimatedTotal / tourState.passengers))} / person
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
                  <i className="fas fa-info-circle text-amber-600 text-base flex-shrink-0 mt-0.5"></i>
                  <div>
                    <strong>Price Transparency Guarantee:</strong> This estimate is based on typical mileage and listed rates. No payment is required today. We will review your custom itinerary and confirm the final guaranteed quote via WhatsApp/Email.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 08 – GUEST DETAILS & BOOKING */}
          {currentStep === 8 && (
            <motion.div
              key="step8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h4 className="text-2xl font-black text-forest">Almost There! Tell Us About Yourself</h4>
                  <p className="text-sm text-charcoal/70">
                    We will send your finalized itinerary and confirmation details directly to you.
                  </p>
                </div>

                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. John Smith"
                      value={tourState.guest.fullName}
                      onChange={(e) => setTourState(prev => ({ ...prev, guest: { ...prev.guest, fullName: e.target.value } }))}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input 
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={tourState.guest.email}
                        onChange={(e) => setTourState(prev => ({ ...prev, guest: { ...prev.guest, email: e.target.value } }))}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                        Phone / WhatsApp (with country code) *
                      </label>
                      <input 
                        type="tel"
                        required
                        placeholder="+1 234 567 8900"
                        value={tourState.guest.phone}
                        onChange={(e) => setTourState(prev => ({ ...prev, guest: { ...prev.guest, phone: e.target.value } }))}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                        Country / Nationality
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. United Kingdom"
                        value={tourState.guest.country}
                        onChange={(e) => setTourState(prev => ({ ...prev, guest: { ...prev.guest, country: e.target.value } }))}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                        Pickup Location in Sri Lanka
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. BIA Airport or Hotel in Colombo"
                        value={tourState.guest.pickupLocation}
                        onChange={(e) => setTourState(prev => ({ ...prev, guest: { ...prev.guest, pickupLocation: e.target.value } }))}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                      Special Requests / Hotel Preferences (Optional)
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Mention any dietary needs, preferred hotel star rating, child safety seats, or custom stops..."
                      value={tourState.guest.specialNotes}
                      onChange={(e) => setTourState(prev => ({ ...prev, guest: { ...prev.guest, specialNotes: e.target.value } }))}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest"
                    ></textarea>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-[#0f2416] text-white p-5 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-300 block">Total Estimated Tour Price:</span>
                      <span className="text-2xl font-black text-safari-gold">{formatPrice(priceBreakdown.estimatedTotal)}</span>
                    </div>
                    <div className="text-right text-xs text-gray-300">
                      <div>{tourState.days} Days | {tourState.selectedDestinationIds.length} Regions</div>
                      <div>{tourState.selectedAttractionIds.length} Sights Included</div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-safari-gold hover:bg-amber-400 text-forest font-black rounded-xl text-base uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Submitting Your Custom Tour...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Custom Tour Request</span>
                        <i className="fas fa-arrow-right"></i>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ---------------------------------------------------- */}
      {/* BOTTOM ACTION BAR (Back & Continue Buttons)          */}
      {/* ---------------------------------------------------- */}
      <div className="bg-gray-50 border-t border-gray-200 p-6 md:px-10 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            currentStep === 1 
              ? 'opacity-0 pointer-events-none' 
              : 'bg-white border border-gray-300 text-charcoal hover:bg-gray-100 shadow-sm'
          }`}
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back</span>
        </button>

        {currentStep < 8 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-3.5 bg-forest hover:bg-forest/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
          >
            <span>Continue to Step 0{currentStep + 1}</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        ) : null}
      </div>

      {/* ---------------------------------------------------- */}
      {/* SUCCESS CONFIRMATION MODAL                           */}
      {/* ---------------------------------------------------- */}
      {confirmationData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-8 text-center shadow-2xl relative"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4">
              <i className="fas fa-circle-check"></i>
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-safari-gold block mb-1">
              Booking Request Received
            </span>
            <h3 className="text-2xl font-black text-forest mb-2">
              Your Custom Tour is Ready!
            </h3>
            <p className="text-sm text-charcoal/70 mb-6 leading-relaxed">
              Thank you, <strong>{tourState.guest.fullName}</strong>. Our tour coordinators have received your custom {tourState.days}-day itinerary.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Reference ID:</span>
                <span className="font-bold text-forest">{confirmationData.referenceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span className="font-semibold">{tourState.days} Days / {tourState.nights} Nights</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Destinations:</span>
                <span className="font-semibold">{tourState.selectedDestinationIds.length} Regions Chosen</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Total:</span>
                <span className="font-black text-forest">{formatPrice(priceBreakdown.estimatedTotal)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/94771234567?text=Hello%20JP%20Lanka%20Tours,%20I%20just%20submitted%20Custom%20Tour%20Ref:%20${confirmationData.referenceId}%20for%20${tourState.days}%20days.%20Can%20we%20discuss?`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <i className="fab fa-whatsapp text-base"></i>
                <span>Instant WhatsApp Confirmation</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setConfirmationData(null);
                  setCurrentStep(1);
                }}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-charcoal font-bold rounded-xl text-xs uppercase tracking-wider"
              >
                Done / Plan Another Tour
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

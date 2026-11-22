import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';
import { TOUR_PACKAGES, type TourPackage } from '../../data/tourData';
import { tourService } from '../../services/tourService';

export const CuratedPackagesList: React.FC = () => {
  const { formatPrice } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePackageModal, setActivePackageModal] = useState<TourPackage | null>(null);
  const [bookingPackage, setBookingPackage] = useState<TourPackage | null>(null);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelDate: '',
    passengers: 2,
    specialNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{ referenceId: string; message: string; packageTitle: string } | null>(null);

  const categories = ['All', 'All-Rounder', 'Wildlife', 'Scenic', 'Cultural'];

  const filteredPackages = selectedCategory === 'All'
    ? TOUR_PACKAGES
    : TOUR_PACKAGES.filter(p => p.category === selectedCategory);

  const handleOpenBooking = (pkg: TourPackage) => {
    setActivePackageModal(null);
    setBookingPackage(pkg);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 14);
    setBookingForm({
      fullName: '',
      email: '',
      phone: '',
      travelDate: tomorrow.toISOString().split('T')[0],
      passengers: 2,
      specialNotes: ''
    });
  };

  const handleSubmitPackageBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingPackage) return;

    setIsSubmitting(true);
    try {
      const res = await tourService.submitPackageBooking(bookingPackage, bookingForm);
      setConfirmationData({
        referenceId: res.referenceId,
        message: res.message,
        packageTitle: bookingPackage.title
      });
      setBookingPackage(null);
    } catch {
      alert('Failed to submit booking. Please reach us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              selectedCategory === cat
                ? 'bg-forest text-safari-gold shadow-md'
                : 'bg-white border border-gray-200 text-charcoal hover:bg-gray-100'
            }`}
          >
            {cat === 'All' ? 'All Packages' : cat}
          </button>
        ))}
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
        {filteredPackages.map(pkg => (
          <motion.div
            key={pkg.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between"
          >
            {/* Image Header */}
            <div className="relative h-64 overflow-hidden">
              <img 
                src={pkg.image} 
                alt={pkg.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30"></div>
              
              {pkg.badge && (
                <div className="absolute top-4 left-4 bg-safari-gold text-forest font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {pkg.badge}
                </div>
              )}

              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                <i className="far fa-clock mr-1 text-safari-gold"></i>
                {pkg.durationDays} Days / {pkg.durationNights} Nights
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-2xl font-black text-white drop-shadow mb-1">{pkg.title}</h3>
                <p className="text-xs text-gray-200 line-clamp-1">{pkg.subtitle}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                {/* Destinations pill list */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {pkg.destinations.map(d => (
                    <span key={d} className="bg-forest/5 text-forest font-semibold text-xs px-2.5 py-1 rounded-lg">
                      <i className="fas fa-location-dot text-safari-gold text-[10px] mr-1"></i>{d}
                    </span>
                  ))}
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-2 gap-3 text-xs text-charcoal/80 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-van-shuttle text-safari-gold"></i>
                    <span className="truncate">{pkg.vehicleType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-user-check text-safari-gold"></i>
                    <span>{pkg.guideIncluded ? 'Licensed Guide Included' : 'Experienced Chauffeur'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-route text-safari-gold"></i>
                    <span>{pkg.itinerary.length} Day Schedule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-shield-halved text-safari-gold"></i>
                    <span>100% Guaranteed Pacing</span>
                  </div>
                </div>

                {/* Included Highlights Preview */}
                <h5 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Package Inclusions:</h5>
                <ul className="space-y-1.5 text-xs text-charcoal/70 mb-6">
                  {pkg.inclusions.slice(0, 4).map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <i className="fas fa-check text-emerald-600 text-xs mt-0.5"></i>
                      <span>{inc}</span>
                    </li>
                  ))}
                  {pkg.inclusions.length > 4 && (
                    <li className="text-[11px] text-forest font-bold pl-4">
                      + {pkg.inclusions.length - 4} more inclusions...
                    </li>
                  )}
                </ul>
              </div>

              {/* Price & Action Buttons */}
              <div className="pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-400 block leading-tight">Starting From</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-3xl font-black text-forest">{formatPrice(pkg.pricePerPersonUSD)}</span>
                    <span className="text-xs text-gray-500 font-medium">/ person</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActivePackageModal(pkg)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-300 text-forest text-xs font-bold hover:bg-gray-50 transition-colors"
                  >
                    View Itinerary
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenBooking(pkg)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-forest hover:bg-forest/90 text-safari-gold text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Book Package</span>
                    <i className="fas fa-arrow-right text-[10px]"></i>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ---------------------------------------------------- */}
      {/* ITINERARY & DETAILS MODAL                            */}
      {/* ---------------------------------------------------- */}
      {activePackageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative my-8"
          >
            {/* Modal Header */}
            <div className="relative h-60 md:h-72">
              <img src={activePackageModal.image} alt={activePackageModal.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2416] via-black/40 to-black/30"></div>
              
              <button
                type="button"
                onClick={() => setActivePackageModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-bold text-safari-gold uppercase tracking-widest block mb-1">
                  {activePackageModal.durationDays} Days / {activePackageModal.durationNights} Nights Detailed Itinerary
                </span>
                <h3 className="text-2xl md:text-3xl font-black drop-shadow">{activePackageModal.title}</h3>
                <p className="text-sm text-gray-200">{activePackageModal.subtitle}</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              
              {/* Day-by-day Itinerary */}
              <h4 className="text-lg font-bold text-forest mb-4 flex items-center gap-2">
                <i className="fas fa-calendar-check text-safari-gold"></i>
                Day-by-Day Journey Itinerary:
              </h4>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-forest/20 mb-8">
                {activePackageModal.itinerary.map((day) => (
                  <div key={day.day} className="relative pl-10">
                    <div className="absolute left-1.5 top-0 w-5 h-5 rounded-full bg-forest text-safari-gold text-[10px] font-bold flex items-center justify-center border-2 border-white shadow">
                      {day.day}
                    </div>

                    <h5 className="font-bold text-sm text-forest mb-1">Day {day.day}: {day.title}</h5>
                    <p className="text-xs text-charcoal/70 mb-3 leading-relaxed">{day.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {day.highlights.map((h, i) => (
                        <span key={i} className="bg-gray-100 text-charcoal/80 text-[11px] px-2.5 py-0.5 rounded-full font-medium">
                          ✦ {h}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50 rounded-2xl border border-gray-100 mb-8 text-xs">
                <div>
                  <h5 className="font-bold text-forest mb-3 flex items-center gap-2">
                    <i className="fas fa-check-circle text-emerald-600"></i> What’s Included:
                  </h5>
                  <ul className="space-y-1.5 text-charcoal/75">
                    {activePackageModal.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <i className="fas fa-check text-emerald-600 text-[10px] mt-0.5"></i>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-rose-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-times-circle text-rose-600"></i> What’s Excluded:
                  </h5>
                  <ul className="space-y-1.5 text-charcoal/75">
                    {activePackageModal.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <i className="fas fa-times text-rose-500 text-[10px] mt-0.5"></i>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <span className="text-xs text-gray-400 block">Package Price</span>
                  <span className="text-2xl font-black text-forest">{formatPrice(activePackageModal.pricePerPersonUSD)}</span>
                  <span className="text-xs text-gray-500 font-medium"> / person</span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActivePackageModal(null)}
                    className="px-5 py-2.5 bg-gray-100 text-charcoal text-xs font-bold rounded-xl"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenBooking(activePackageModal)}
                    className="px-6 py-2.5 bg-forest hover:bg-forest/90 text-safari-gold text-xs font-bold rounded-xl shadow-lg"
                  >
                    Book This Package
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* QUICK PACKAGE BOOKING MODAL                          */}
      {/* ---------------------------------------------------- */}
      {bookingPackage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative my-8"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-safari-gold uppercase tracking-wider block">Reserve Package</span>
                <h4 className="text-xl font-black text-forest">{bookingPackage.title}</h4>
              </div>
              <button 
                type="button"
                onClick={() => setBookingPackage(null)} 
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-black flex items-center justify-center"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitPackageBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">Full Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={bookingForm.fullName}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-forest"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">Email *</label>
                  <input 
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">Phone / WhatsApp *</label>
                  <input 
                    type="tel"
                    required
                    placeholder="+1 555 0192"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">Travel Start Date *</label>
                  <input 
                    type="date"
                    required
                    value={bookingForm.travelDate}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, travelDate: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">Guests Count</label>
                  <select
                    value={bookingForm.passengers}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, passengers: Number(e.target.value) }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-forest"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 15, 20].map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">Special Notes / Upgrades</label>
                <textarea 
                  rows={2}
                  placeholder="Any hotel tier preference, pickup flight number, or dietary notes..."
                  value={bookingForm.specialNotes}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, specialNotes: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-forest"
                ></textarea>
              </div>

              {/* Price Calculation Box */}
              <div className="bg-[#0f2416] text-white p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-300 block">Total Package Cost ({bookingForm.passengers} Guests):</span>
                  <span className="text-2xl font-black text-safari-gold">
                    {formatPrice(bookingPackage.pricePerPersonUSD * bookingForm.passengers)}
                  </span>
                </div>
                <div className="text-right text-xs text-gray-300">
                  <div>{bookingPackage.durationDays}D / {bookingPackage.durationNights}N</div>
                  <div>Includes Private Vehicle</div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-safari-gold hover:bg-amber-400 text-forest font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Confirming Reservation...' : 'Confirm Package Booking'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-8 text-center shadow-2xl relative"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4">
              <i className="fas fa-circle-check"></i>
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-safari-gold block mb-1">
              Reservation Received
            </span>
            <h3 className="text-2xl font-black text-forest mb-2">
              Package Booked Successfully!
            </h3>
            <p className="text-sm text-charcoal/70 mb-6">
              Your reservation for <strong>{confirmationData.packageTitle}</strong> has been logged under reference code <strong>{confirmationData.referenceId}</strong>.
            </p>

            <a
              href={`https://wa.me/94771234567?text=Hello%20JP%20Lanka%20Tours,%20I%20have%20booked%20package%20Ref:%20${confirmationData.referenceId}%20(${encodeURIComponent(confirmationData.packageTitle)}).%20Please%20confirm.`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg mb-3"
            >
              <i className="fab fa-whatsapp text-base"></i>
              <span>Chat with Travel Coordinator</span>
            </a>

            <button
              type="button"
              onClick={() => setConfirmationData(null)}
              className="w-full py-2.5 bg-gray-100 text-charcoal text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

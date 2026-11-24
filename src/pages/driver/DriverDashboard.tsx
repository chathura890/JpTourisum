import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminDataService, type BookingRecord } from '../../services/adminDataService';

const TRIP_STEPS: { key: BookingRecord['tripProgress']; label: string; icon: string; nextAction: string }[] = [
  { key: 'accepted', label: 'Trip Accepted', icon: 'fa-circle-check', nextAction: 'Start Heading to Pickup' },
  { key: 'on_the_way', label: 'On The Way', icon: 'fa-car-side', nextAction: 'Confirm Arrived at Pickup' },
  { key: 'arrived_pickup', label: 'Arrived at Pickup', icon: 'fa-location-dot', nextAction: 'Passenger Boarded' },
  { key: 'passenger_picked_up', label: 'Passenger In', icon: 'fa-user-check', nextAction: 'Start Journey' },
  { key: 'trip_started', label: 'Trip Started', icon: 'fa-route', nextAction: 'Arrived at Destination' },
  { key: 'arrived_destination', label: 'At Destination', icon: 'fa-hotel', nextAction: 'Complete & End Trip' },
  { key: 'trip_completed', label: 'Trip Completed', icon: 'fa-flag-checkered', nextAction: 'Trip Concluded' },
];

export const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>(() => adminDataService.getBookings());
  const [activeTab, setActiveTab] = useState<'active' | 'vehicle' | 'history'>('active');

  // Find active booking for this driver or fallback to first assigned booking
  const activeBooking = bookings.find(b => 
    (b.assignedDriverId === user?.id || b.assignedDriverName === user?.fullName || !b.assignedDriverId) &&
    b.status !== 'completed' && b.status !== 'cancelled'
  ) || bookings[0];

  const currentStepIndex = TRIP_STEPS.findIndex(s => s.key === (activeBooking?.tripProgress || 'accepted'));

  const handleAdvanceStep = () => {
    if (!activeBooking) return;
    if (currentStepIndex >= TRIP_STEPS.length - 1) return;

    const nextStep = TRIP_STEPS[currentStepIndex + 1].key;
    const updated = adminDataService.updateDriverTripProgress(
      activeBooking.id,
      nextStep,
      `Driver status advanced to ${TRIP_STEPS[currentStepIndex + 1].label}`
    );

    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const handleStepClick = (stepKey: BookingRecord['tripProgress']) => {
    if (!activeBooking) return;
    const stepObj = TRIP_STEPS.find(s => s.key === stepKey);
    const updated = adminDataService.updateDriverTripProgress(
      activeBooking.id,
      stepKey,
      `Manual status update to ${stepObj?.label || stepKey}`
    );
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const completedTrips = bookings.filter(b => b.status === 'completed');

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12">
      
      {/* Driver Status Topbar */}
      <div className="bg-forest rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-safari-gold text-forest flex items-center justify-center font-black text-xl shadow-md">
              <i className="fa-solid fa-steering-wheel"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-white">{user?.fullName || 'Sunil Perera'}</h1>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <p className="text-xs text-gray-300">
                Tourist Chauffeur • KDH Luxury Van (WP-CAD-8842)
              </p>
            </div>
          </div>

          <a
            href="tel:1912"
            className="px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            title="Emergency Tourist Police Hotline"
          >
            <i className="fa-solid fa-phone-volume animate-bounce"></i>
            SOS 1912
          </a>
        </div>
      </div>

      {/* Driver Mobile Nav Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-xs text-xs font-bold text-center">
        <button
          onClick={() => setActiveTab('active')}
          className={`py-2 rounded-xl transition-all ${activeTab === 'active' ? 'bg-forest text-safari-gold shadow-xs' : 'text-gray-500 hover:text-black'}`}
        >
          <i className="fa-solid fa-route mr-1"></i> Active Trip
        </button>
        <button
          onClick={() => setActiveTab('vehicle')}
          className={`py-2 rounded-xl transition-all ${activeTab === 'vehicle' ? 'bg-forest text-safari-gold shadow-xs' : 'text-gray-500 hover:text-black'}`}
        >
          <i className="fa-solid fa-van-shuttle mr-1"></i> My Vehicle
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 rounded-xl transition-all ${activeTab === 'history' ? 'bg-forest text-safari-gold shadow-xs' : 'text-gray-500 hover:text-black'}`}
        >
          <i className="fa-solid fa-clock-rotate-left mr-1"></i> History ({completedTrips.length})
        </button>
      </div>

      {/* TAB 1: ACTIVE TRIP */}
      {activeTab === 'active' && activeBooking && (
        <div className="space-y-4">
          
          {/* Main Active Trip Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
            
            {/* Header / Ref */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-safari-gold uppercase tracking-wider block">
                  Current Assignment
                </span>
                <span className="font-mono text-base font-black text-forest">
                  #{activeBooking.referenceId}
                </span>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <i className={`fa-solid ${TRIP_STEPS[currentStepIndex]?.icon || 'fa-route'} text-xs`}></i>
                {TRIP_STEPS[currentStepIndex]?.label || 'Trip Active'}
              </span>
            </div>

            {/* Passenger Contacts Box */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-gray-900 text-sm">{activeBooking.customerName}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <i className="fa-solid fa-globe text-[11px] text-gray-400"></i>
                    {activeBooking.customerCountry} • {activeBooking.passengers} Adults, {activeBooking.luggage} Bags
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Call Button */}
                  <a
                    href={`tel:${activeBooking.customerPhone}`}
                    className="w-10 h-10 rounded-2xl bg-forest text-safari-gold flex items-center justify-center text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
                    title="Call Guest"
                  >
                    <i className="fa-solid fa-phone"></i>
                  </a>

                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/${activeBooking.customerPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-base shadow-md hover:scale-105 active:scale-95 transition-all"
                    title="Chat on WhatsApp"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Pickup Location</span>
                  <p className="font-bold text-gray-800 line-clamp-1">{activeBooking.pickupLocation}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeBooking.pickupLocation)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-600 font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    <i className="fa-solid fa-map-location-dot"></i> Open Google Maps
                  </a>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Dates & Tour</span>
                  <p className="font-bold text-gray-800 line-clamp-1">
                    {activeBooking.packageTitle || 'Custom Ceylon Tour'}
                  </p>
                  <span className="text-[11px] text-gray-500">
                    {activeBooking.startDate} ({activeBooking.days} Days)
                  </span>
                </div>
              </div>
            </div>

            {/* LIVE 7-STEP TRIP LIFECYCLE PROGRESS */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-forest uppercase tracking-wider">
                  Live Trip Progress Tracker
                </span>
                <span className="text-xs font-bold text-gray-400">
                  Step {currentStepIndex + 1} of 7
                </span>
              </div>

              {/* Step Badges Row */}
              <div className="grid grid-cols-7 gap-1">
                {TRIP_STEPS.map((s, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <button
                      key={s.key}
                      onClick={() => handleStepClick(s.key)}
                      className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-safari-gold text-forest font-black shadow-xs ring-2 ring-forest'
                          : isDone
                          ? 'bg-emerald-100 text-emerald-800 font-bold'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                      title={s.label}
                    >
                      <i className={`fa-solid ${s.icon} text-xs`}></i>
                      <span className="text-[8px] mt-0.5 font-bold uppercase truncate max-w-full px-0.5">
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* BIG TAP-TO-ADVANCE BUTTON */}
              {currentStepIndex < TRIP_STEPS.length - 1 ? (
                <button
                  onClick={handleAdvanceStep}
                  className="w-full py-4 bg-forest hover:bg-forest/90 active:scale-98 text-safari-gold font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-forward-step text-base"></i>
                  <span>Tap to Advance: {TRIP_STEPS[currentStepIndex + 1]?.nextAction}</span>
                </button>
              ) : (
                <div className="w-full py-3 bg-emerald-600 text-white font-black text-sm rounded-2xl text-center shadow-xs flex items-center justify-center gap-2">
                  <i className="fa-solid fa-flag-checkered"></i>
                  Tour Completed Successfully!
                </div>
              )}
            </div>

            {/* TIMELINE LOG */}
            {activeBooking.tripProgressTimeline && activeBooking.tripProgressTimeline.length > 0 && (
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Logged Milestones & Timestamps
                </span>
                <div className="space-y-1.5 text-xs">
                  {activeBooking.tripProgressTimeline.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl text-gray-700">
                      <span className="font-bold flex items-center gap-2">
                        <i className="fa-solid fa-check text-emerald-600 text-[10px]"></i>
                        {item.step.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            {activeBooking.specialNotes && (
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 block mb-0.5">
                  <i className="fa-solid fa-note-sticky mr-1"></i> Guest Special Instructions:
                </span>
                <p className="text-amber-800">{activeBooking.specialNotes}</p>
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 2: MY VEHICLE */}
      {activeTab === 'vehicle' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <span className="text-[10px] font-bold text-safari-gold uppercase tracking-wider block">Assigned Chauffeur Vehicle</span>
            <h2 className="text-lg font-black text-forest">Toyota KDH Super GL Luxury Van</h2>
            <p className="text-xs text-gray-500">License Plate: WP CAD-8842</p>
          </div>

          <div className="h-44 rounded-2xl overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
              alt="Toyota KDH"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-forest text-safari-gold px-2.5 py-1 rounded-xl text-xs font-black">
              Inspection Passed
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-50 p-3 rounded-xl">
              <span className="text-gray-400 font-bold block text-[10px] uppercase">Passenger Seats</span>
              <p className="font-bold text-gray-800">8 Passengers + Luggage</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <span className="text-gray-400 font-bold block text-[10px] uppercase">AC & Amenities</span>
              <p className="font-bold text-gray-800">Dual AC, WiFi, Cool Box</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <span className="text-gray-400 font-bold block text-[10px] uppercase">Fuel Tank</span>
              <p className="font-bold text-emerald-600">Full (Diesel)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <span className="text-gray-400 font-bold block text-[10px] uppercase">Next Service Due</span>
              <p className="font-bold text-gray-800">In 4,500 KM</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRIP HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {completedTrips.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center text-gray-400 border border-gray-100">
              <i className="fa-solid fa-road text-3xl mb-2 block"></i>
              No completed trips logged yet.
            </div>
          ) : (
            completedTrips.map(b => (
              <div key={b.id} className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-forest">{b.referenceId}</span>
                  <h4 className="font-bold text-gray-900">{b.customerName} ({b.customerCountry})</h4>
                  <p className="text-gray-400 text-[11px]">{b.days} Days • {b.packageTitle || 'Custom Tour'}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold block mb-1">
                    Completed
                  </span>
                  <span className="text-forest font-black">${b.totalPriceUSD}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};

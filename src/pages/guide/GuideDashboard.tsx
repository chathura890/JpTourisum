import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminDataService, type BookingRecord } from '../../services/adminDataService';

export const GuideDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings] = useState<BookingRecord[]>(() => adminDataService.getBookings());
  const [activeTab, setActiveTab] = useState<'itinerary' | 'log' | 'tours'>('itinerary');

  // Find active tour or fallback
  const activeTour = bookings.find(b => 
    b.assignedGuideId || b.assignedGuideName === user?.fullName || b.status === 'in_progress'
  ) || bookings[0];

  // Completed attractions checklist state
  const [completedAttractions, setCompletedAttractions] = useState<string[]>([]);
  const [guideNotes, setGuideNotes] = useState<string[]>([
    'Day 1: Met guests at CMB Airport on time. Smooth transfer to Colombo hotel.',
    'Day 2: Morning cultural tour of Galle Fort completed. Guests enjoyed the lighthouse walk.'
  ]);
  const [newNote, setNewNote] = useState('');

  const toggleAttraction = (name: string) => {
    if (completedAttractions.includes(name)) {
      setCompletedAttractions(completedAttractions.filter(a => a !== name));
    } else {
      setCompletedAttractions([...completedAttractions, name]);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setGuideNotes(prev => [...prev, newNote.trim()]);
    setNewNote('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Guide Header Banner */}
      <div className="bg-forest rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
              <i className="fa-solid fa-compass"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white">{user?.fullName || 'Rohana Wijesinghe'}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-safari-gold text-forest">
                  SLTDA LICENSED
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                National Tourist Guide Lecturer • Cultural & Wildlife Specialist
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/20 self-start sm:self-auto text-xs">
            <span className="text-gray-300 block text-[10px] uppercase font-bold">Daily Guide Rate</span>
            <span className="text-safari-gold font-black text-base">$50.00 USD</span>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-xs text-xs font-bold text-center">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`py-2 rounded-xl transition-all ${activeTab === 'itinerary' ? 'bg-forest text-safari-gold shadow-xs' : 'text-gray-500 hover:text-black'}`}
        >
          <i className="fa-solid fa-map-location-dot mr-1"></i> Active Tour
        </button>
        <button
          onClick={() => setActiveTab('log')}
          className={`py-2 rounded-xl transition-all ${activeTab === 'log' ? 'bg-forest text-safari-gold shadow-xs' : 'text-gray-500 hover:text-black'}`}
        >
          <i className="fa-solid fa-book-open mr-1"></i> Field Log ({guideNotes.length})
        </button>
        <button
          onClick={() => setActiveTab('tours')}
          className={`py-2 rounded-xl transition-all ${activeTab === 'tours' ? 'bg-forest text-safari-gold shadow-xs' : 'text-gray-500 hover:text-black'}`}
        >
          <i className="fa-solid fa-calendar-check mr-1"></i> Tour Schedule
        </button>
      </div>

      {/* TAB 1: ACTIVE TOUR */}
      {activeTab === 'itinerary' && activeTour && (
        <div className="space-y-4">
          
          {/* Tour Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-safari-gold uppercase tracking-wider block">
                  Assigned Guided Tour
                </span>
                <h3 className="text-base font-black text-forest">
                  {activeTour.packageTitle || 'Classic Sri Lanka Heritage & Wildlife'}
                </h3>
                <span className="text-xs text-gray-500 font-mono">Ref: {activeTour.referenceId}</span>
              </div>

              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold self-start sm:self-auto">
                <i className="fa-solid fa-circle-check text-[10px] mr-1"></i> Tour Active
              </span>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Group Leader</span>
                <p className="font-bold text-gray-900">{activeTour.customerName}</p>
                <p className="text-gray-500">{activeTour.customerCountry}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Party Size</span>
                <p className="font-bold text-gray-900">{activeTour.passengers} Adults</p>
                <p className="text-gray-500">{activeTour.days} Days / {activeTour.nights} Nights</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Assigned Chauffeur</span>
                <p className="font-bold text-forest">{activeTour.assignedDriverName || 'Sunil Perera'}</p>
                <p className="text-gray-500">KDH Luxury Van</p>
              </div>
            </div>

            {/* Attractions Visited Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-forest text-xs uppercase tracking-wider">
                  Attractions & Site Progress Checklist
                </h4>
                <span className="text-xs font-bold text-emerald-700">
                  {completedAttractions.length} Visited
                </span>
              </div>

              <div className="space-y-2">
                {[
                  'Galle Fort & Lighthouse Walk',
                  'Dutch Reformed Church & Maritime Museum',
                  'Kandy Temple of the Sacred Tooth Relic',
                  'Peradeniya Royal Botanical Gardens',
                  'Nine Arch Bridge & Little Adam\'s Peak',
                  'Yala National Park Afternoon Leopard Safari'
                ].map((attr) => {
                  const isChecked = completedAttractions.includes(attr);
                  return (
                    <div
                      key={attr}
                      onClick={() => toggleAttraction(attr)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        isChecked
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                          : 'bg-white border-gray-100 hover:border-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs transition-colors ${
                          isChecked ? 'bg-emerald-600 text-white' : 'border border-gray-300'
                        }`}>
                          {isChecked && <i className="fa-solid fa-check text-[10px]"></i>}
                        </div>
                        <span className={`font-bold ${isChecked ? 'line-through text-emerald-700' : ''}`}>
                          {attr}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {isChecked ? 'Completed' : 'Pending Visit'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guest Notes */}
            {activeTour.specialNotes && (
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 block mb-1">
                  <i className="fa-solid fa-comment-dots mr-1"></i> Guest Dietary & Cultural Notes:
                </span>
                <p className="text-amber-800 leading-relaxed">{activeTour.specialNotes}</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: FIELD LOG */}
      {activeTab === 'log' && (
        <div className="space-y-4">
          <form onSubmit={handleAddNote} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-3">
            <h3 className="font-black text-forest text-xs uppercase tracking-wider">
              Add New Field Log Entry
            </h3>
            <textarea
              rows={3}
              required
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Record notes on today's route, weather, site timings, or guest feedback..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-forest text-safari-gold font-bold text-xs rounded-xl shadow-xs hover:bg-forest/90 transition-all flex items-center gap-1.5"
              >
                <i className="fa-solid fa-plus text-[10px]"></i> Post Log Entry
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {guideNotes.map((note, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs text-xs space-y-1">
                <div className="flex items-center justify-between text-gray-400 text-[10px]">
                  <span>Log #{guideNotes.length - idx}</span>
                  <span>Today</span>
                </div>
                <p className="text-gray-800 font-medium leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TOURS SCHEDULE */}
      {activeTab === 'tours' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
          <h3 className="font-black text-forest text-sm">Upcoming Guided Tour Assignments</h3>
          <div className="space-y-3 text-xs">
            {bookings.slice(0, 3).map(b => (
              <div key={b.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-gray-400 block">{b.referenceId}</span>
                  <h4 className="font-bold text-gray-900">{b.packageTitle || 'Tailored Tour'}</h4>
                  <p className="text-gray-500 text-[11px]">{b.startDate} to {b.endDate} ({b.days} Days)</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-forest/10 text-forest text-[10px] font-bold block mb-1">
                    Confirmed
                  </span>
                  <span className="text-[11px] text-gray-400">{b.passengers} Guests</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

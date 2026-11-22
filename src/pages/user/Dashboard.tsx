import { useState } from 'react';

import { Link } from 'react-router-dom';

const MOCK_BOOKINGS = [
  { id: 'BK-7829', status: 'Upcoming', date: 'Oct 24, 2026', package: 'Luxury Full Day', passengers: 2, total: 240, type: 'Safari + Transport' },
  { id: 'BK-7102', status: 'Completed', date: 'Sep 12, 2026', package: 'Essential Safari', passengers: 4, total: 180, type: 'Safari Only' },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  return (
    <div className="pt-28 pb-20 bg-off-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="w-20 h-20 bg-forest text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                JD
              </div>
              <h2 className="text-xl font-bold text-center text-charcoal">John Doe</h2>
              <p className="text-sm text-center text-gray-500 mb-6">john@example.com</p>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'bookings' ? 'bg-forest text-white' : 'text-charcoal hover:bg-gray-50'}`}
                >
                  <i className="fas fa-calendar" style={{fontSize: '18px'}}></i> My Bookings
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'profile' ? 'bg-forest text-white' : 'text-charcoal hover:bg-gray-50'}`}
                >
                  <i className="fas fa-user" style={{fontSize: '18px'}}></i> Profile Settings
                </button>
                <Link 
                  to="/login"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-red-500 hover:bg-red-50"
                >
                  <i className="fas fa-right-from-bracket" style={{fontSize: '18px'}}></i> Sign Out
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-3xl font-black text-forest mb-6">My Bookings</h2>
                
                <div className="space-y-6">
                  {MOCK_BOOKINGS.map(booking => (
                    <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-lg text-charcoal">{booking.package}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            booking.status === 'Upcoming' ? 'bg-amber-warm/20 text-amber-900' : 'bg-green-100 text-green-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5"><i className="fas fa-calendar" style={{fontSize: '16px'}}></i> {booking.date}</div>
                          <div className="flex items-center gap-1.5"><i className="fas fa-location-dot" style={{fontSize: '16px'}}></i> {booking.type}</div>
                          <div className="flex items-center gap-1.5"><i className="fas fa-user" style={{fontSize: '16px'}}></i> {booking.passengers} Passengers</div>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-auto flex items-center justify-between md:flex-col md:items-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Paid</p>
                          <p className="text-2xl font-black text-charcoal">${booking.total}</p>
                        </div>
                        <button className="flex items-center gap-1 text-sm font-bold text-forest hover:text-jungle">
                          View Details <i className="fas fa-chevron-right" style={{fontSize: '16px'}}></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-3xl font-black text-forest mb-8">Profile Settings</h2>
                
                <form className="space-y-6 max-w-xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-charcoal mb-2">First Name</label>
                      <input type="text" defaultValue="John" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-charcoal mb-2">Last Name</label>
                      <input type="text" defaultValue="Doe" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-charcoal mb-2">Email Address</label>
                    <input type="email" defaultValue="john@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-charcoal mb-2">Phone Number</label>
                    <input type="tel" defaultValue="+94 77 123 4567" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest" />
                  </div>

                  <button type="button" className="bg-forest text-white font-bold py-3 px-8 rounded-xl hover:bg-jungle transition-colors">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

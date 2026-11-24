import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { adminDataService, type BookingRecord } from '../../services/adminDataService';
import { InvoiceModal } from '../../components/admin/InvoiceModal';

export const AdminDashboard: React.FC = () => {
  const { formatPrice } = useSettings();
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'year' | 'all'>('30days');
  const [bookings, setBookings] = useState<BookingRecord[]>(() => adminDataService.getBookings());
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<BookingRecord | null>(null);

  const staff = adminDataService.getStaff();
  const drivers = adminDataService.getDrivers();
  const guides = adminDataService.getGuides();
  const vehicles = adminDataService.getVehicles();

  // Calculated Statistics
  const stats = useMemo(() => {
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'under_review').length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'driver_assigned').length;
    const completedTours = bookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

    const totalRevenue = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalPriceUSD, 0);

    const pendingPayments = bookings
      .filter(b => b.paymentStatus === 'pending')
      .reduce((sum, b) => sum + b.totalPriceUSD, 0);

    const availableVehicles = vehicles.length - bookings.filter(b => b.status === 'on_the_way' || b.status === 'in_progress').length;

    return {
      totalBookings,
      todaysBookings: 2,
      pendingBookings,
      confirmedBookings,
      completedTours,
      cancelledBookings,
      totalCustomers: 142,
      totalStaff: staff.length,
      totalDrivers: drivers.length,
      totalGuides: guides.length,
      totalVehicles: vehicles.length,
      availableVehicles: Math.max(0, availableVehicles),
      totalRevenue,
      pendingPayments
    };
  }, [bookings, staff, drivers, guides, vehicles]);

  // Quick Status Updater
  const handleUpdateStatus = (id: string, newStatus: BookingRecord['status']) => {
    const updated = adminDataService.updateBooking(id, { status: newStatus });
    setBookings(prev => prev.map(b => b.id === id ? updated : b));
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-safari-gold block mb-1">
            Business Intelligence & Operations
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-forest">
            Super Admin Overview
          </h1>
        </div>

        {/* Date Filter */}
        <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-2xl border border-gray-200 shadow-xs text-xs font-bold">
          <button
            onClick={() => setDateFilter('today')}
            className={`px-3 py-1.5 rounded-xl transition-all ${dateFilter === 'today' ? 'bg-forest text-safari-gold' : 'text-gray-600 hover:text-black'}`}
          >
            Today
          </button>
          <button
            onClick={() => setDateFilter('7days')}
            className={`px-3 py-1.5 rounded-xl transition-all ${dateFilter === '7days' ? 'bg-forest text-safari-gold' : 'text-gray-600 hover:text-black'}`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateFilter('30days')}
            className={`px-3 py-1.5 rounded-xl transition-all ${dateFilter === '30days' ? 'bg-forest text-safari-gold' : 'text-gray-600 hover:text-black'}`}
          >
            This Month
          </button>
          <button
            onClick={() => setDateFilter('year')}
            className={`px-3 py-1.5 rounded-xl transition-all ${dateFilter === 'year' ? 'bg-forest text-safari-gold' : 'text-gray-600 hover:text-black'}`}
          >
            This Year
          </button>
        </div>
      </div>

      {/* Primary Financial Metric Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f2416] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs text-gray-300 uppercase tracking-wider block font-semibold">Total Revenue (Gross)</span>
              <h3 className="text-3xl md:text-4xl font-black text-safari-gold mt-1">
                {formatPrice(stats.totalRevenue)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-safari-gold flex items-center justify-center text-xl">
              <i className="fas fa-wallet"></i>
            </div>
          </div>
          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <i className="fas fa-arrow-trend-up"></i>
            <span>+18.4% growth vs previous month</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider block font-semibold">Pending Payments</span>
              <h3 className="text-3xl font-black text-amber-600 mt-1">
                {formatPrice(stats.pendingPayments)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl">
              <i className="fas fa-clock-rotate-left"></i>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Awaiting deposit or final confirmation
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider block font-semibold">Fleet Availability</span>
              <h3 className="text-3xl font-black text-forest mt-1">
                {stats.availableVehicles} <span className="text-sm font-normal text-gray-400">/ {stats.totalVehicles} Vehicles</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center text-xl">
              <i className="fas fa-van-shuttle"></i>
            </div>
          </div>
          <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <i className="fas fa-check-circle"></i>
            <span>High availability for upcoming bookings</span>
          </div>
        </div>
      </div>

      {/* 14 Key Statistics Cards Grid */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Operations & Booking Pulse</h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-[11px] text-gray-400 block font-semibold uppercase">Total Bookings</span>
            <span className="text-2xl font-black text-forest">{stats.totalBookings}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-[11px] text-gray-400 block font-semibold uppercase">Pending Review</span>
            <span className="text-2xl font-black text-amber-600">{stats.pendingBookings}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-[11px] text-gray-400 block font-semibold uppercase">Confirmed</span>
            <span className="text-2xl font-black text-emerald-600">{stats.confirmedBookings}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-[11px] text-gray-400 block font-semibold uppercase">Completed Tours</span>
            <span className="text-2xl font-black text-forest">{stats.completedTours}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-[11px] text-gray-400 block font-semibold uppercase">Active Drivers</span>
            <span className="text-2xl font-black text-charcoal">{stats.totalDrivers}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-[11px] text-gray-400 block font-semibold uppercase">Tour Guides</span>
            <span className="text-2xl font-black text-charcoal">{stats.totalGuides}</span>
          </div>
        </div>
      </div>

      {/* Analytics Visuals & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Monthly Booking Trends (Bar Representation) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-lg text-forest">Monthly Booking & Inbound Influx</h4>
              <p className="text-xs text-gray-500">Seasonal trend over the last 6 months</p>
            </div>
            <span className="text-xs font-bold bg-forest/5 text-forest px-3 py-1 rounded-full">
              Sri Lanka Season 2026
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="space-y-4 pt-2">
            {[
              { month: 'Jun 2026', count: 18, pct: 45, rev: '$7,200' },
              { month: 'Jul 2026', count: 24, pct: 60, rev: '$9,840' },
              { month: 'Aug 2026', count: 32, pct: 80, rev: '$13,440' },
              { month: 'Sep 2026', count: 20, pct: 50, rev: '$8,200' },
              { month: 'Oct 2026', count: 28, pct: 70, rev: '$11,760' },
              { month: 'Nov 2026', count: 42, pct: 100, rev: '$18,900' }
            ].map(item => (
              <div key={item.month} className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-600 font-semibold">
                  <span>{item.month} ({item.count} Tours)</span>
                  <span className="text-forest font-bold">{item.rev}</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-forest to-safari-gold h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Destinations Ranking */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-lg text-forest">Top Booked Destinations</h4>
              <span className="text-xs text-safari-gold font-bold">Live Data</span>
            </div>

            <div className="space-y-3.5">
              {[
                { name: 'Galle & Southern Coast', pct: 92, tag: 'Beaches & Fort' },
                { name: 'Ella & Highlands', pct: 86, tag: 'Nine Arch Bridge' },
                { name: 'Yala National Park', pct: 78, tag: 'Leopard Safaris' },
                { name: 'Kandy & Cultural Capital', pct: 74, tag: 'Tooth Relic' },
                { name: 'Sigiriya Lion Rock', pct: 68, tag: 'Ancient Citadel' },
              ].map((dest, i) => (
                <div key={dest.name} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-forest text-safari-gold font-black flex items-center justify-center text-[10px]">
                      0{i + 1}
                    </span>
                    <div>
                      <strong className="block text-forest">{dest.name}</strong>
                      <span className="text-[10px] text-gray-400">{dest.tag}</span>
                    </div>
                  </div>
                  <span className="font-bold text-forest">{dest.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/admin/destinations"
            className="w-full mt-6 py-2.5 rounded-xl border border-gray-200 text-center font-bold text-xs text-forest hover:bg-forest hover:text-white transition-all block"
          >
            Manage Destinations CMS
          </Link>
        </div>

      </div>

      {/* Recent Bookings Queue Table */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h4 className="font-bold text-lg text-forest">Recent Tour Bookings Queue</h4>
            <p className="text-xs text-gray-500">Live booking submissions requiring staff assignment and review</p>
          </div>
          <Link
            to="/admin/bookings"
            className="px-4 py-2 bg-forest text-safari-gold text-xs font-bold rounded-xl hover:bg-forest/90 transition-all flex items-center gap-1.5 shadow"
          >
            <span>Manage All Bookings</span>
            <i className="fas fa-arrow-right text-[10px]"></i>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4 font-bold">Reference</th>
                <th className="py-3 px-4 font-bold">Guest</th>
                <th className="py-3 px-4 font-bold">Schedule</th>
                <th className="py-3 px-4 font-bold">Assigned Crew</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Price</th>
                <th className="py-3 px-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-charcoal">
              {bookings.slice(0, 5).map(b => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-forest">
                    {b.referenceId}
                    <span className="block text-[10px] text-gray-400 font-normal capitalize">
                      {b.bookingType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <strong className="block text-forest">{b.customerName}</strong>
                    <span className="text-[10px] text-gray-400">{b.customerCountry} • {b.passengers} Guests</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium">{b.startDate}</span>
                    <span className="block text-[10px] text-gray-400">{b.days} Days / {b.nights} Nights</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {b.assignedDriverName ? (
                      <span className="text-emerald-700 font-semibold block">
                        <i className="fas fa-steering-wheel text-safari-gold mr-1"></i>{b.assignedDriverName}
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold block">Unassigned</span>
                    )}
                    {b.assignedGuideName && (
                      <span className="text-indigo-700 font-semibold text-[10px] block">
                        <i className="fas fa-compass text-safari-gold mr-1"></i>{b.assignedGuideName}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'confirmed' || b.status === 'driver_assigned' ? 'bg-emerald-100 text-emerald-800' :
                      b.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      b.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-forest">
                    {formatPrice(b.totalPriceUSD)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedInvoiceBooking(b)}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-forest hover:text-safari-gold text-gray-600 flex items-center justify-center transition-colors"
                        title="Print / View Invoice"
                      >
                        <i className="fas fa-file-invoice text-xs"></i>
                      </button>
                      {b.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                          title="Confirm Booking"
                        >
                          Confirm
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}

    </div>
  );
};

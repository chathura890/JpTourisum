import React, { useState, useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { adminDataService, type BookingRecord, type DriverMember, type GuideMember } from '../../services/adminDataService';
import { InvoiceModal } from '../../components/admin/InvoiceModal';

export const AdminBookings: React.FC = () => {
  const { formatPrice } = useSettings();
  const [bookings, setBookings] = useState<BookingRecord[]>(() => adminDataService.getBookings());
  const drivers: DriverMember[] = useMemo(() => adminDataService.getDrivers(), []);
  const guides: GuideMember[] = useMemo(() => adminDataService.getGuides(), []);
  const vehicles = useMemo(() => adminDataService.getVehicles(), []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'custom_tour' | 'package_booking'>('all');

  // Modals
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<BookingRecord | null>(null);
  const [assignModalBooking, setAssignModalBooking] = useState<BookingRecord | null>(null);
  const [detailsModalBooking, setDetailsModalBooking] = useState<BookingRecord | null>(null);

  // Assignment Modal Form State
  const [assignDriverId, setAssignDriverId] = useState('');
  const [assignVehicleId, setAssignVehicleId] = useState('');
  const [assignGuideId, setAssignGuideId] = useState('');

  // Open Assignment Modal
  const openAssignModal = (b: BookingRecord) => {
    setAssignModalBooking(b);
    setAssignDriverId(b.assignedDriverId || '');
    setAssignVehicleId(b.assignedVehicleId || '');
    setAssignGuideId(b.assignedGuideId || '');
  };

  const handleSaveAssignment = () => {
    if (!assignModalBooking) return;
    const driverObj = drivers.find(d => d.id === assignDriverId);
    const guideObj = guides.find(g => g.id === assignGuideId);

    const updated = adminDataService.updateBooking(assignModalBooking.id, {
      assignedDriverId: assignDriverId || undefined,
      assignedDriverName: driverObj?.fullName || undefined,
      assignedVehicleId: assignVehicleId || undefined,
      assignedGuideId: assignGuideId || undefined,
      assignedGuideName: guideObj?.fullName || undefined,
      status: assignDriverId ? 'driver_assigned' : assignModalBooking.status
    });

    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    setAssignModalBooking(null);
  };

  const handleStatusChange = (id: string, status: BookingRecord['status']) => {
    const updated = adminDataService.updateBooking(id, { status });
    setBookings(prev => prev.map(b => b.id === id ? updated : b));
  };

  const handlePaymentStatusChange = (id: string, paymentStatus: BookingRecord['paymentStatus']) => {
    const updated = adminDataService.updateBooking(id, { paymentStatus });
    setBookings(prev => prev.map(b => b.id === id ? updated : b));
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = 
        b.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.packageTitle && b.packageTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesType = typeFilter === 'all' || b.bookingType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [bookings, searchQuery, statusFilter, typeFilter]);

  const getStatusBadge = (status: BookingRecord['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800"><i className="fa-solid fa-circle-check text-[10px]"></i> Confirmed</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800"><i className="fa-solid fa-clock text-[10px]"></i> Pending Review</span>;
      case 'driver_assigned':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800"><i className="fa-solid fa-id-card text-[10px]"></i> Driver Assigned</span>;
      case 'in_progress':
      case 'on_the_way':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800"><i className="fa-solid fa-route text-[10px]"></i> On Trip</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-800"><i className="fa-solid fa-flag-checkered text-[10px]"></i> Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800"><i className="fa-solid fa-ban text-[10px]"></i> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-safari-gold block mb-1">
            Reservations & Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-forest">
            Tour Bookings Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage custom tour requests, package bookings, crew assignments, and client invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-forest text-safari-gold rounded-2xl text-xs font-black shadow-xs">
            Total: {bookings.length} Bookings
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              placeholder="Search by Reference ID (e.g. JP-2026), guest name, email, or tour..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs p-1"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${typeFilter === 'all' ? 'bg-forest text-safari-gold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('custom_tour')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${typeFilter === 'custom_tour' ? 'bg-forest text-safari-gold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Custom Tours
            </button>
            <button
              onClick={() => setTypeFilter('package_booking')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${typeFilter === 'package_booking' ? 'bg-forest text-safari-gold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Packages
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Statuses' },
            { id: 'pending', label: 'Pending Review' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'driver_assigned', label: 'Driver Assigned' },
            { id: 'in_progress', label: 'On Trip' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-safari-gold text-forest shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-6">Ref & Date</th>
                <th className="py-4 px-6">Customer & Guest</th>
                <th className="py-4 px-6">Tour & Itinerary</th>
                <th className="py-4 px-6">Crew & Vehicle</th>
                <th className="py-4 px-6">Price & Payment</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <i className="fa-solid fa-clipboard-list text-3xl mb-2 block"></i>
                    No bookings found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                    
                    {/* Ref & Date */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-mono font-black text-forest block text-sm">
                        {b.referenceId}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                      <div className="mt-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.bookingType === 'custom_tour' ? 'bg-amber-100 text-amber-900' : 'bg-purple-100 text-purple-900'
                        }`}>
                          {b.bookingType === 'custom_tour' ? 'Custom Tour' : 'Package'}
                        </span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-900 text-sm">{b.customerName}</p>
                      <p className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <i className="fa-solid fa-globe text-[10px] text-gray-400"></i> {b.customerCountry}
                      </p>
                      <p className="text-gray-400 text-[11px]">{b.customerPhone}</p>
                    </td>

                    {/* Tour Info */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-900 line-clamp-1">
                        {b.packageTitle || 'Tailored Sri Lanka Route'}
                      </p>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        <i className="fa-regular fa-calendar text-[10px] mr-1"></i>
                        {b.startDate} → {b.endDate}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                        <span><i className="fa-solid fa-clock text-[10px] mr-0.5 text-gray-400"></i> {b.days}D / {b.nights}N</span>
                        <span>•</span>
                        <span><i className="fa-solid fa-users text-[10px] mr-0.5 text-gray-400"></i> {b.passengers} Pax</span>
                      </div>
                    </td>

                    {/* Crew & Vehicle */}
                    <td className="py-4 px-6 space-y-1">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">Driver:</span>
                        {b.assignedDriverName ? (
                          <span className="text-xs font-bold text-forest flex items-center gap-1">
                            <i className="fa-solid fa-steering-wheel text-[10px] text-emerald-600"></i>
                            {b.assignedDriverName}
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-600 font-bold italic">Unassigned</span>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">Guide:</span>
                        {b.assignedGuideName ? (
                          <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                            <i className="fa-solid fa-compass text-[10px]"></i>
                            {b.assignedGuideName}
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-400">No Guide Req.</span>
                        )}
                      </div>
                    </td>

                    {/* Price & Payment */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <p className="font-black text-forest text-sm">
                        {formatPrice(b.totalPriceUSD)}
                      </p>
                      <select
                        value={b.paymentStatus}
                        onChange={(e) => handlePaymentStatusChange(b.id, e.target.value as BookingRecord['paymentStatus'])}
                        className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                          b.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="pending">Pending Payment</option>
                        <option value="paid">Paid in Full</option>
                        <option value="partially_paid">Partially Paid</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="space-y-1">
                        <div>{getStatusBadge(b.status)}</div>
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as BookingRecord['status'])}
                          className="text-[10px] bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 text-gray-700 font-medium"
                        >
                          <option value="pending">Pending</option>
                          <option value="under_review">Under Review</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="driver_assigned">Driver Assigned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Assign Crew / Vehicle Button */}
                        <button
                          onClick={() => openAssignModal(b)}
                          title="Assign Driver & Vehicle"
                          className="p-2 bg-forest/5 hover:bg-forest text-forest hover:text-white rounded-xl transition-all"
                        >
                          <i className="fa-solid fa-users-gear text-xs"></i>
                        </button>

                        {/* View Tour Details */}
                        <button
                          onClick={() => setDetailsModalBooking(b)}
                          title="View Itinerary & Details"
                          className="p-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl transition-all"
                        >
                          <i className="fa-solid fa-eye text-xs"></i>
                        </button>

                        {/* Invoice Button */}
                        <button
                          onClick={() => setSelectedInvoiceBooking(b)}
                          title="View & Print Customer Invoice"
                          className="p-2 bg-safari-gold/20 hover:bg-safari-gold text-forest rounded-xl transition-all font-bold"
                        >
                          <i className="fa-solid fa-file-invoice-dollar text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGN CREW MODAL */}
      {assignModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-forest">Assign Crew & Vehicle</h3>
                <p className="text-xs text-gray-500">
                  Booking #{assignModalBooking.referenceId} — {assignModalBooking.customerName}
                </p>
              </div>
              <button 
                onClick={() => setAssignModalBooking(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Select Driver */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  <i className="fa-solid fa-steering-wheel mr-1 text-forest"></i> Assign Driver
                </label>
                <select
                  value={assignDriverId}
                  onChange={(e) => setAssignDriverId(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-forest"
                >
                  <option value="">-- No Driver Assigned --</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.experienceYears}y exp • {d.languages.join(', ')}) - Status: {d.status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Vehicle */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  <i className="fa-solid fa-car-side mr-1 text-forest"></i> Assign Vehicle
                </label>
                <select
                  value={assignVehicleId}
                  onChange={(e) => setAssignVehicleId(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-forest"
                >
                  <option value="">-- No Vehicle Assigned --</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.type}) • Max {v.maxPassengers} Pax / {v.maxLuggage} Bags
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Tour Guide */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  <i className="fa-solid fa-compass mr-1 text-forest"></i> Assign Tour Guide (Optional)
                </label>
                <select
                  value={assignGuideId}
                  onChange={(e) => setAssignGuideId(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-forest"
                >
                  <option value="">-- No Guide Assigned --</option>
                  {guides.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.fullName} (Specialty: {g.specializations.slice(0, 2).join(', ')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl text-blue-800 text-[11px] flex gap-2">
                <i className="fa-solid fa-circle-info text-blue-600 mt-0.5"></i>
                <p>Assigning a driver will automatically notify them and show this booking directly in their live Driver Mobile Portal.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setAssignModalBooking(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignment}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-forest text-safari-gold hover:bg-forest/90 transition-all shadow-sm"
              >
                Save & Notify Crew
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {detailsModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-safari-gold tracking-widest">
                  Tour Details
                </span>
                <h3 className="text-lg font-black text-forest">
                  {detailsModalBooking.packageTitle || 'Custom Sri Lanka Tour'}
                </h3>
              </div>
              <button 
                onClick={() => setDetailsModalBooking(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Client</span>
                  <p className="font-bold text-gray-900">{detailsModalBooking.customerName}</p>
                  <p className="text-gray-500">{detailsModalBooking.customerEmail}</p>
                  <p className="text-gray-500">{detailsModalBooking.customerPhone}</p>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Dates & Duration</span>
                  <p className="font-bold text-gray-900">{detailsModalBooking.startDate} to {detailsModalBooking.endDate}</p>
                  <p className="text-gray-500">{detailsModalBooking.days} Days / {detailsModalBooking.nights} Nights</p>
                  <p className="text-gray-500">{detailsModalBooking.passengers} Adults • Pickup: {detailsModalBooking.pickupLocation}</p>
                </div>
              </div>

              {/* Destinations */}
              {detailsModalBooking.destinations && detailsModalBooking.destinations.length > 0 && (
                <div>
                  <span className="font-bold text-gray-700 block mb-1">Destinations Included:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {detailsModalBooking.destinations.map(d => (
                      <span key={d} className="px-2.5 py-1 bg-forest/10 text-forest rounded-lg font-bold text-[11px]">
                        <i className="fa-solid fa-location-dot text-safari-gold mr-1"></i> {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Attractions */}
              {detailsModalBooking.attractions && detailsModalBooking.attractions.length > 0 && (
                <div>
                  <span className="font-bold text-gray-700 block mb-1">Attractions & Sightseeing:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {detailsModalBooking.attractions.map(a => (
                      <span key={a} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-[11px] font-medium">
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Notes */}
              {detailsModalBooking.specialNotes && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-900 block mb-0.5">Guest Notes / Requests:</span>
                  <p className="text-amber-800">{detailsModalBooking.specialNotes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setDetailsModalBooking(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INVOICE MODAL */}
      <InvoiceModal
        booking={selectedInvoiceBooking}
        isOpen={!!selectedInvoiceBooking}
        onClose={() => setSelectedInvoiceBooking(null)}
      />
    </div>
  );
};

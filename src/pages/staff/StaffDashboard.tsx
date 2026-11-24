import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminDataService, type BookingRecord, type ContactMessage } from '../../services/adminDataService';
import { InvoiceModal } from '../../components/admin/InvoiceModal';

export const StaffDashboard: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>(() => adminDataService.getBookings());
  const [messages, setMessages] = useState<ContactMessage[]>(() => adminDataService.getMessages());
  const drivers = adminDataService.getDrivers();
  const vehicles = adminDataService.getVehicles();

  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<BookingRecord | null>(null);

  // Quick Assignment State
  const [assigningBooking, setAssigningBooking] = useState<BookingRecord | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  // Reply message modal
  const [replyingMessage, setReplyingMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  // Operations Stats
  const pendingQueue = bookings.filter(b => b.status === 'pending' || b.status === 'under_review');
  const activeTrips = bookings.filter(b => b.status === 'in_progress' || b.status === 'on_the_way');
  const unassignedDrivers = bookings.filter(b => !b.assignedDriverId && b.status !== 'cancelled');
  const newMessages = messages.filter(m => m.status === 'new');

  const handleOpenAssign = (b: BookingRecord) => {
    setAssigningBooking(b);
    setSelectedDriverId(b.assignedDriverId || '');
    setSelectedVehicleId(b.assignedVehicleId || '');
  };

  const handleSaveAssign = () => {
    if (!assigningBooking) return;
    const driverObj = drivers.find(d => d.id === selectedDriverId);
    const updated = adminDataService.updateBooking(assigningBooking.id, {
      assignedDriverId: selectedDriverId || undefined,
      assignedDriverName: driverObj?.fullName || undefined,
      assignedVehicleId: selectedVehicleId || undefined,
      status: selectedDriverId ? 'driver_assigned' : assigningBooking.status
    });
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    setAssigningBooking(null);
  };

  const handleQuickConfirm = (id: string) => {
    const updated = adminDataService.updateBooking(id, { status: 'confirmed' });
    setBookings(prev => prev.map(b => b.id === id ? updated : b));
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingMessage) return;
    const updated = messages.map(m => m.id === replyingMessage.id ? {
      ...m,
      status: 'replied' as const,
      assignedStaff: user?.fullName || 'Staff Coordinator'
    } : m);
    setMessages(updated);
    adminDataService.saveMessages(updated);
    setReplyingMessage(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-forest rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-safari-gold text-forest tracking-wider uppercase inline-block mb-3">
            Operations & Dispatch Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-relaxed">
            Here is your daily operational dispatch board. Manage pending traveler requests, coordinate chauffeur fleet, and respond to incoming inquiries.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
          <i className="fa-solid fa-headset text-[180px]"></i>
        </div>
      </div>

      {/* Staff Action KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Pending Approvals</span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              <i className="fa-solid fa-clock"></i>
            </span>
          </div>
          <p className="text-2xl font-black text-forest mt-2">{pendingQueue.length}</p>
          <span className="text-[11px] text-amber-600 font-bold block mt-0.5">Need Review</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Unassigned Bookings</span>
            <span className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
              <i className="fa-solid fa-user-xmark"></i>
            </span>
          </div>
          <p className="text-2xl font-black text-forest mt-2">{unassignedDrivers.length}</p>
          <span className="text-[11px] text-red-600 font-bold block mt-0.5">Require Chauffeur</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Active Tours on Road</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              <i className="fa-solid fa-route"></i>
            </span>
          </div>
          <p className="text-2xl font-black text-forest mt-2">{activeTrips.length}</p>
          <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">Live in Progress</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">New Inquiries</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <i className="fa-solid fa-envelope-open-text"></i>
            </span>
          </div>
          <p className="text-2xl font-black text-forest mt-2">{newMessages.length}</p>
          <span className="text-[11px] text-blue-600 font-bold block mt-0.5">Customer Messages</span>
        </div>
      </div>

      {/* Main Operations Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Bookings Dispatch Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-forest flex items-center gap-2">
              <i className="fa-solid fa-list-check text-safari-gold"></i>
              Action Required Bookings Queue
            </h2>
            <span className="text-xs text-gray-500 font-bold">
              {pendingQueue.length} Pending Actions
            </span>
          </div>

          <div className="space-y-3">
            {pendingQueue.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center text-gray-400">
                <i className="fa-solid fa-circle-check text-3xl text-emerald-500 mb-2 block"></i>
                All booking requests have been reviewed and dispatched!
              </div>
            ) : (
              pendingQueue.map(b => (
                <div key={b.id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <span className="font-mono text-xs font-black text-forest">{b.referenceId}</span>
                      <h4 className="font-bold text-gray-900 text-sm">{b.customerName} ({b.customerCountry})</h4>
                      <p className="text-xs text-gray-500">{b.packageTitle || 'Custom Sri Lanka Tour'}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        {b.status}
                      </span>
                      <span className="text-xs font-black text-forest">${b.totalPriceUSD}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-bold">Dates</span>
                      <p className="font-bold">{b.startDate} → {b.endDate}</p>
                      <span className="text-[11px] text-gray-400">{b.days} Days / {b.nights} Nights</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 block font-bold">Pickup & Pax</span>
                      <p className="font-bold">{b.passengers} Pax ({b.luggage} Bags)</p>
                      <span className="text-[11px] text-gray-400 line-clamp-1">{b.pickupLocation}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 block font-bold">Assigned Chauffeur</span>
                      {b.assignedDriverName ? (
                        <p className="font-bold text-emerald-700">{b.assignedDriverName}</p>
                      ) : (
                        <p className="font-bold text-red-500 italic">Not Assigned</p>
                      )}
                    </div>
                  </div>

                  {b.specialNotes && (
                    <div className="bg-gray-50 p-2.5 rounded-xl text-[11px] text-gray-600">
                      <span className="font-bold text-gray-700">Special Request: </span>
                      {b.specialNotes}
                    </div>
                  )}

                  {/* Staff Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    {hasPermission('bookings_edit') && (
                      <button
                        onClick={() => handleOpenAssign(b)}
                        className="px-3 py-1.5 bg-forest text-safari-gold rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-forest/90"
                      >
                        <i className="fa-solid fa-user-plus text-[10px]"></i>
                        {b.assignedDriverId ? 'Reassign Driver' : 'Assign Chauffeur'}
                      </button>
                    )}

                    {hasPermission('bookings_edit') && b.status === 'pending' && (
                      <button
                        onClick={() => handleQuickConfirm(b.id)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all"
                      >
                        <i className="fa-solid fa-check mr-1 text-[10px]"></i> Confirm
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedInvoiceBooking(b)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all"
                    >
                      <i className="fa-solid fa-receipt mr-1 text-[10px]"></i> Invoice
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Incoming Customer Inquiries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-forest flex items-center gap-2">
              <i className="fa-solid fa-comments text-safari-gold"></i>
              Guest Inquiries
            </h2>
            <span className="text-xs text-gray-500 font-bold">{messages.length} Total</span>
          </div>

          <div className="space-y-3">
            {messages.map(m => (
              <div key={m.id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs">{m.fullName}</h4>
                    <p className="text-[11px] text-gray-400">{m.email} • {m.phone}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    m.status === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {m.status}
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded-2xl">
                  <p className="font-bold text-forest text-xs mb-1">{m.subject}</p>
                  <p className="text-gray-600 text-[11px] line-clamp-3 leading-relaxed">{m.message}</p>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-gray-400">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                  {m.status === 'new' ? (
                    <button
                      onClick={() => {
                        setReplyingMessage(m);
                        setReplyText(`Dear ${m.fullName},\n\nThank you for contacting JP Lanka Tours! We would be delighted to assist you with your inquiry.\n\nWarm regards,\nJP Lanka Tours Team`);
                      }}
                      className="px-3 py-1 bg-forest text-safari-gold rounded-lg font-bold text-xs hover:bg-forest/90"
                    >
                      <i className="fa-solid fa-reply mr-1"></i> Reply
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-bold text-[10px]">
                      ✓ Handled by {m.assignedStaff || 'Staff'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ASSIGN DRIVER MODAL */}
      {assigningBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-forest">Assign Chauffeur & Vehicle</h3>
              <button
                onClick={() => setAssigningBooking(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Driver</label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                >
                  <option value="">-- Choose Chauffeur --</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.status}) • {d.languages.join('/')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Vehicle</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                >
                  <option value="">-- Choose Fleet Vehicle --</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setAssigningBooking(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssign}
                className="px-5 py-2 bg-forest text-safari-gold rounded-xl font-bold hover:bg-forest/90"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPLY MESSAGE MODAL */}
      {replyingMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSendReply} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-forest">Reply to Customer</h3>
                <p className="text-[11px] text-gray-500">To: {replyingMessage.fullName} ({replyingMessage.email})</p>
              </div>
              <button
                type="button"
                onClick={() => setReplyingMessage(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Your Response Message</label>
              <textarea
                rows={5}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setReplyingMessage(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-forest text-safari-gold rounded-xl font-bold hover:bg-forest/90 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-paper-plane text-[10px]"></i> Send Response
              </button>
            </div>
          </form>
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

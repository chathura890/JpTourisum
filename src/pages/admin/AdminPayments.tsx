import React, { useState, useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { adminDataService, type InvoiceRecord, type BookingRecord } from '../../services/adminDataService';
import { InvoiceModal } from '../../components/admin/InvoiceModal';

export const AdminPayments: React.FC = () => {
  const { formatPrice } = useSettings();
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => adminDataService.getInvoices());
  const bookings = adminDataService.getBookings();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<BookingRecord | null>(null);

  // Financial statistics
  const stats = useMemo(() => {
    const totalCollected = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalUSD, 0);
    const pendingTotal = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.totalUSD, 0);
    const taxCollected = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.taxUSD, 0);
    return {
      totalCollected,
      pendingTotal,
      taxCollected,
      paidCount: invoices.filter(i => i.status === 'paid').length,
      pendingCount: invoices.filter(i => i.status === 'pending').length,
    };
  }, [invoices]);

  const handleToggleStatus = (id: string, status: InvoiceRecord['status']) => {
    const updated = invoices.map(i => i.id === id ? { ...i, status } : i);
    setInvoices(updated);
    adminDataService.saveInvoices(updated);
  };

  const handleViewInvoice = (inv: InvoiceRecord) => {
    const b = bookings.find(b => b.referenceId === inv.bookingReference);
    if (b) {
      setSelectedInvoiceBooking(b);
    } else {
      // Fallback pseudo booking record for invoice modal
      const pseudoBooking: BookingRecord = {
        id: inv.id,
        referenceId: inv.bookingReference,
        bookingType: 'custom_tour',
        customerName: inv.customerName,
        customerEmail: inv.customerEmail,
        customerPhone: '+94 77 000 0000',
        customerCountry: 'International',
        pickupLocation: 'Bandaranaike International Airport (CMB)',
        startDate: inv.issuedDate,
        endDate: inv.dueDate,
        days: 7,
        nights: 6,
        passengers: 2,
        luggage: 2,
        status: inv.status === 'paid' ? 'confirmed' : 'pending',
        tripProgress: 'accepted',
        totalPriceUSD: inv.totalUSD,
        paymentStatus: inv.status,
        packageTitle: inv.tourTitle,
        createdAt: inv.issuedDate
      };
      setSelectedInvoiceBooking(pseudoBooking);
    }
  };

  const filteredInvoices = filterStatus === 'all'
    ? invoices
    : invoices.filter(i => i.status === filterStatus);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-safari-gold block mb-1">
            Accounts, Billing & Receipts
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-forest">
            Payments & Invoices
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track customer payments, issue official tax receipts, and print PDF-ready invoices.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Total Revenue Collected</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <i className="fa-solid fa-sack-dollar text-base"></i>
            </div>
          </div>
          <p className="text-2xl font-black text-forest mt-3">{formatPrice(stats.totalCollected)}</p>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
            {stats.paidCount} Fully Paid Invoices
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Pending Payments</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <i className="fa-solid fa-clock-rotate-left text-base"></i>
            </div>
          </div>
          <p className="text-2xl font-black text-forest mt-3">{formatPrice(stats.pendingTotal)}</p>
          <span className="text-[11px] text-amber-600 font-bold mt-1 block">
            {stats.pendingCount} Invoices Awaiting Payment
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Tourism Tax Collected (8%)</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <i className="fa-solid fa-file-invoice text-base"></i>
            </div>
          </div>
          <p className="text-2xl font-black text-forest mt-3">{formatPrice(stats.taxCollected)}</p>
          <span className="text-[11px] text-blue-600 font-bold mt-1 block">
            SLTDA Remittance Compliant
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Payment Gateways</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <i className="fa-solid fa-credit-card text-base"></i>
            </div>
          </div>
          <p className="text-2xl font-black text-forest mt-3">Stripe & Direct</p>
          <span className="text-[11px] text-purple-600 font-bold mt-1 block">
            Cards, Bank Transfer, Cash on Arrival
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-xs text-xs font-bold overflow-x-auto">
        {['all', 'paid', 'pending', 'refunded'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl capitalize transition-all whitespace-nowrap ${
              filterStatus === status ? 'bg-forest text-safari-gold shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            {status} ({status === 'all' ? invoices.length : invoices.filter(i => i.status === status).length})
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-6">Invoice # & Booking Ref</th>
                <th className="py-4 px-6">Customer Name & Email</th>
                <th className="py-4 px-6">Tour & Duration</th>
                <th className="py-4 px-6">Payment Method</th>
                <th className="py-4 px-6">Amount (USD)</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="font-mono font-bold text-forest block text-sm">{inv.invoiceNumber}</span>
                    <span className="text-[11px] text-gray-400 font-mono">Ref: {inv.bookingReference}</span>
                  </td>

                  <td className="py-4 px-6">
                    <p className="font-bold text-gray-900">{inv.customerName}</p>
                    <p className="text-gray-400 text-[11px]">{inv.customerEmail}</p>
                  </td>

                  <td className="py-4 px-6">
                    <p className="font-bold text-gray-800 line-clamp-1">{inv.tourTitle}</p>
                    <p className="text-gray-400 text-[11px]">{inv.duration} • Due: {inv.dueDate}</p>
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-bold">
                      <i className="fa-solid fa-money-check text-xs text-forest"></i>
                      {inv.paymentMethod}
                    </span>
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    <p className="font-black text-forest text-sm">{formatPrice(inv.totalUSD)}</p>
                    <span className="text-[10px] text-gray-400 block font-normal">
                      Incl. {formatPrice(inv.taxUSD)} Tax
                    </span>
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    <select
                      value={inv.status}
                      onChange={(e) => handleToggleStatus(inv.id, e.target.value as InvoiceRecord['status'])}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                        inv.status === 'paid' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        inv.status === 'pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-red-50 text-red-800 border-red-200'
                      }`}
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>

                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleViewInvoice(inv)}
                      className="px-3 py-1.5 bg-safari-gold/20 hover:bg-safari-gold text-forest rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ml-auto"
                    >
                      <i className="fa-solid fa-print"></i> View / Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        booking={selectedInvoiceBooking}
        isOpen={!!selectedInvoiceBooking}
        onClose={() => setSelectedInvoiceBooking(null)}
      />

    </div>
  );
};

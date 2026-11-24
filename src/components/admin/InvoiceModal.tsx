import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import type { BookingRecord } from '../../services/adminDataService';

interface InvoiceModalProps {
  booking: BookingRecord | null;
  isOpen?: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, onClose }) => {
  const { formatPrice } = useSettings();

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${booking.referenceId.replace('JP-', '')}`;
  const subtotal = Math.round(booking.totalPriceUSD * 0.95);
  const tax = booking.totalPriceUSD - subtotal;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 md:p-10 shadow-2xl relative my-8 text-charcoal print:p-0 print:shadow-none print:m-0">
        
        {/* Controls (Hidden on Print) */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Official Customer Invoice</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-forest text-safari-gold font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-forest/90 transition-all flex items-center gap-2 shadow"
            >
              <i className="fas fa-print"></i>
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-black flex items-center justify-center"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Invoice Body (Printed) */}
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl bg-forest text-safari-gold font-black text-lg flex items-center justify-center">
                  JP
                </div>
                <h2 className="text-xl font-black text-forest tracking-tight">JP LANKA TOURS</h2>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Registered Tourism & Inbound Tour Operator (SLTDA)<br />
                Galle Road, Colombo 03, Sri Lanka<br />
                Hotline: +94 11 234 5678 | WhatsApp: +94 77 123 4567<br />
                Email: bookings@jplankatours.com
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-2xl font-black text-forest block">INVOICE</span>
              <span className="text-xs font-bold text-gray-500 block">#{invoiceNumber}</span>
              <span className="text-xs text-gray-400 block mt-1">Date: {new Date(booking.createdAt).toLocaleDateString()}</span>
              <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                booking.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                Payment: {booking.paymentStatus.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Bill To & Tour Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-2xl text-xs border border-gray-100">
            <div>
              <h5 className="font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To (Guest):</h5>
              <p className="font-bold text-sm text-forest mb-0.5">{booking.customerName}</p>
              <p className="text-gray-600">{booking.customerEmail}</p>
              <p className="text-gray-600">{booking.customerPhone}</p>
              <p className="text-gray-600">{booking.customerCountry}</p>
            </div>

            <div>
              <h5 className="font-bold text-gray-400 uppercase tracking-wider mb-2">Tour Reservation Details:</h5>
              <p><strong className="text-forest">Reference ID:</strong> {booking.referenceId}</p>
              <p><strong className="text-forest">Tour Type:</strong> {booking.bookingType === 'custom_tour' ? 'Bespoke Custom Tour' : booking.packageTitle}</p>
              <p><strong className="text-forest">Schedule:</strong> {booking.startDate} to {booking.endDate} ({booking.days}D / {booking.nights}N)</p>
              <p><strong className="text-forest">Party Size:</strong> {booking.passengers} Guest(s) • {booking.luggage} Bag(s)</p>
              <p><strong className="text-forest">Pickup:</strong> {booking.pickupLocation}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0f2416] text-white">
                <tr>
                  <th className="py-3 px-4 font-bold">Item Description</th>
                  <th className="py-3 px-4 font-bold text-center">Duration / Qty</th>
                  <th className="py-3 px-4 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-charcoal/80">
                <tr>
                  <td className="py-3 px-4">
                    <strong className="block text-forest">Tour Package & Itinerary Execution</strong>
                    <span className="text-[11px] text-gray-500">
                      {booking.bookingType === 'custom_tour' ? `${booking.destinations?.length || 4} Destinations Private Journey` : booking.packageTitle}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">{booking.days} Days</td>
                  <td className="py-3 px-4 text-right font-semibold">{formatPrice(Math.round(subtotal * 0.65))}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <strong className="block text-forest">Chauffeur Driven Private Vehicle & Fuel</strong>
                    <span className="text-[11px] text-gray-500">Dedicated A/C transport, airport handling, highway tolls included</span>
                  </td>
                  <td className="py-3 px-4 text-center">Full Tour</td>
                  <td className="py-3 px-4 text-right font-semibold">{formatPrice(Math.round(subtotal * 0.25))}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <strong className="block text-forest">Guided Experiences & Park Services</strong>
                    <span className="text-[11px] text-gray-500">Attraction entrance coordinator & 24/7 on-road support</span>
                  </td>
                  <td className="py-3 px-4 text-center">{booking.passengers} Guests</td>
                  <td className="py-3 px-4 text-right font-semibold">{formatPrice(Math.round(subtotal * 0.1))}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex flex-col items-end text-xs space-y-1.5 pt-2">
            <div className="flex justify-between w-64 text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between w-64 text-gray-600">
              <span>Tourism Cess & Taxes (5%):</span>
              <span className="font-semibold">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between w-64 pt-2 border-t border-gray-200 text-sm font-black text-forest">
              <span>Grand Total:</span>
              <span className="text-base text-safari-gold font-black">{formatPrice(booking.totalPriceUSD)}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-gray-100 text-[11px] text-gray-400 text-center leading-relaxed">
            Thank you for choosing JP Lanka Tours! We look forward to offering you an unforgettable Sri Lankan experience.<br />
            For immediate support, contact our 24/7 coordinator on WhatsApp at <strong>+94 77 123 4567</strong>.
          </div>

        </div>

      </div>
    </div>
  );
};


import { supabase } from '../lib/supabase';
import { 
  DESTINATIONS, 
  ATTRACTIONS, 
  TOUR_VEHICLES, 
  TOUR_GUIDE_OPTIONS, 
  ADDITIONAL_SERVICES, 
  TOUR_PACKAGES,
  type Destination, 
  type Attraction, 
  type TourVehicle, 
  type TourGuideOption, 
  type AdditionalService, 
  type TourPackage 
} from '../data/tourData';

export interface CustomTourState {
  selectedDestinationIds: string[];
  selectedAttractionIds: string[];
  startDate: string;
  endDate: string;
  days: number;
  nights: number;
  departureTime: string;
  selectedVehicleId: string;
  passengers: number;
  luggage: number;
  guideOption: 'none' | 'chauffeur' | 'licensed_guide';
  guideLanguage: string;
  selectedServiceIds: string[];
  guest: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    pickupLocation: string;
    specialNotes: string;
  };
}

export interface PriceBreakdown {
  vehicleCost: number;
  driverAllowance: number;
  tourGuideCost: number;
  attractionEntranceFees: number;
  additionalServicesCost: number;
  subtotal: number;
  taxesAndServiceFees: number;
  estimatedTotal: number;
  isQuoteRequired: boolean;
}

export const tourService = {
  // Fetch Destinations (Supabase with fallback)
  async getDestinations(): Promise<Destination[]> {
    try {
      const { data, error } = await supabase.from('destinations').select('*');
      if (!error && data && data.length > 0) {
        return data as Destination[];
      }
    } catch {
      // Fallback to offline curated data
    }
    return DESTINATIONS;
  },

  // Fetch Attractions for given destination IDs
  async getAttractionsForDestinations(destinationIds: string[]): Promise<Attraction[]> {
    if (!destinationIds || destinationIds.length === 0) return [];
    
    try {
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .in('destination_id', destinationIds);
      if (!error && data && data.length > 0) {
        return data as Attraction[];
      }
    } catch {
      // Fallback
    }

    return ATTRACTIONS.filter(attr => destinationIds.includes(attr.destinationId));
  },

  // Get Vehicles
  getVehicles(): TourVehicle[] {
    return TOUR_VEHICLES;
  },

  // Get Tour Guide Options
  getGuideOptions(): TourGuideOption[] {
    return TOUR_GUIDE_OPTIONS;
  },

  // Get Additional Services
  getAdditionalServices(): AdditionalService[] {
    return ADDITIONAL_SERVICES;
  },

  // Get Tour Packages
  async getTourPackages(): Promise<TourPackage[]> {
    try {
      const { data, error } = await supabase.from('tour_packages').select('*');
      if (!error && data && data.length > 0) {
        return data as TourPackage[];
      }
    } catch {
      // Fallback
    }
    return TOUR_PACKAGES;
  },

  // Calculate live dynamic price
  calculateCustomPrice(state: CustomTourState): PriceBreakdown {
    const days = Math.max(1, state.days);
    const vehicle = TOUR_VEHICLES.find(v => v.id === state.selectedVehicleId) || TOUR_VEHICLES[0];
    
    // Vehicle & Driver
    const vehicleCost = (vehicle?.pricePerDayUSD || 45) * days;
    const driverAllowance = 15 * days; // Chauffeur per-diem & highway handling

    // Tour Guide
    let tourGuideCost = 0;
    if (state.guideOption === 'licensed_guide') {
      tourGuideCost = 35 * days;
    }

    // Attractions Entrance Fees (per passenger)
    const selectedAttractions = ATTRACTIONS.filter(a => state.selectedAttractionIds.includes(a.id));
    const totalSinglePersonEntrance = selectedAttractions.reduce((sum, a) => sum + (a.entranceFeeUSD || 0), 0);
    const attractionEntranceFees = totalSinglePersonEntrance * Math.max(1, state.passengers);

    // Additional Services
    let additionalServicesCost = 0;
    state.selectedServiceIds.forEach(serviceId => {
      const s = ADDITIONAL_SERVICES.find(srv => srv.id === serviceId);
      if (s) {
        if (s.perPerson) {
          additionalServicesCost += s.priceUSD * Math.max(1, state.passengers);
        } else {
          additionalServicesCost += s.priceUSD;
        }
      }
    });

    const subtotal = vehicleCost + driverAllowance + tourGuideCost + attractionEntranceFees + additionalServicesCost;
    const taxesAndServiceFees = Math.round(subtotal * 0.05); // 5% government tourism cess & handling
    const estimatedTotal = subtotal + taxesAndServiceFees;

    return {
      vehicleCost,
      driverAllowance,
      tourGuideCost,
      attractionEntranceFees,
      additionalServicesCost,
      subtotal,
      taxesAndServiceFees,
      estimatedTotal,
      isQuoteRequired: days > 14 || state.passengers > 20
    };
  },

  // Submit Custom Tour Booking
  async submitCustomTourBooking(state: CustomTourState, price: PriceBreakdown): Promise<{ success: boolean; referenceId: string; message: string }> {
    const referenceId = `JP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const bookingPayload = {
      reference_id: referenceId,
      booking_type: 'custom_tour',
      destinations: state.selectedDestinationIds,
      attractions: state.selectedAttractionIds,
      start_date: state.startDate,
      end_date: state.endDate,
      duration_days: state.days,
      duration_nights: state.nights,
      departure_time: state.departureTime,
      vehicle_id: state.selectedVehicleId,
      passengers: state.passengers,
      luggage: state.luggage,
      guide_option: state.guideOption,
      guide_language: state.guideLanguage,
      additional_services: state.selectedServiceIds,
      guest_name: state.guest.fullName,
      guest_email: state.guest.email,
      guest_phone: state.guest.phone,
      guest_country: state.guest.country,
      pickup_location: state.guest.pickupLocation,
      special_notes: state.guest.specialNotes,
      estimated_total: price.estimatedTotal,
      created_at: new Date().toISOString()
    };

    // Save to localStorage as immediate offline cache
    try {
      const existing = JSON.parse(localStorage.getItem('jp_tour_bookings') || '[]');
      existing.unshift(bookingPayload);
      localStorage.setItem('jp_tour_bookings', JSON.stringify(existing));
    } catch {
      // Ignore localStorage errors
    }

    // Try Supabase insert
    try {
      await supabase.from('tour_bookings').insert([bookingPayload]);
    } catch {
      // Continue even if Supabase table is not configured yet
    }

    return {
      success: true,
      referenceId,
      message: 'Your custom tour request has been submitted successfully!'
    };
  },

  // Submit Package Booking
  async submitPackageBooking(packageItem: TourPackage, guestData: any): Promise<{ success: boolean; referenceId: string; message: string }> {
    const referenceId = `PKG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const bookingPayload = {
      reference_id: referenceId,
      booking_type: 'package_booking',
      package_id: packageItem.id,
      package_title: packageItem.title,
      duration_days: packageItem.durationDays,
      duration_nights: packageItem.durationNights,
      total_price: packageItem.pricePerPersonUSD * (guestData.passengers || 1),
      guest_name: guestData.fullName,
      guest_email: guestData.email,
      guest_phone: guestData.phone,
      travel_date: guestData.travelDate,
      passengers: guestData.passengers,
      special_notes: guestData.specialNotes,
      created_at: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('jp_package_bookings') || '[]');
      existing.unshift(bookingPayload);
      localStorage.setItem('jp_package_bookings', JSON.stringify(existing));
    } catch {}

    try {
      await supabase.from('package_bookings').insert([bookingPayload]);
    } catch {}

    return {
      success: true,
      referenceId,
      message: 'Your tour package reservation has been confirmed!'
    };
  }
};

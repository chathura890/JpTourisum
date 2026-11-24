import { DESTINATIONS, ATTRACTIONS, TOUR_PACKAGES, TOUR_VEHICLES } from '../data/tourData';

export interface BookingRecord {
  id: string;
  referenceId: string;
  bookingType: 'custom_tour' | 'package_booking';
  packageTitle?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry: string;
  pickupLocation: string;
  startDate: string;
  endDate: string;
  days: number;
  nights: number;
  passengers: number;
  luggage: number;
  assignedVehicleId?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedGuideId?: string;
  assignedGuideName?: string;
  status: 'pending' | 'under_review' | 'confirmed' | 'driver_assigned' | 'vehicle_assigned' | 'guide_assigned' | 'on_the_way' | 'in_progress' | 'completed' | 'cancelled';
  tripProgress: 'accepted' | 'on_the_way' | 'arrived_pickup' | 'passenger_picked_up' | 'trip_started' | 'arrived_destination' | 'trip_completed';
  tripProgressTimeline?: { step: string; timestamp: string; note?: string }[];
  totalPriceUSD: number;
  paymentStatus: 'pending' | 'paid' | 'partially_paid' | 'failed' | 'refunded';
  specialNotes?: string;
  destinations?: string[];
  attractions?: string[];
  createdAt: string;
}

export interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  jobPosition: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  permissions: string[];
  joiningDate: string;
  avatarUrl: string;
}

export interface DriverMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  experienceYears: number;
  languages: string[];
  assignedVehicleId?: string;
  assignedVehicleName?: string;
  rating: number;
  totalTrips: number;
  status: 'available' | 'on_trip' | 'off_duty' | 'suspended';
  avatarUrl: string;
}

export interface GuideMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  experienceYears: number;
  languages: string[];
  specializations: string[];
  dailyRateUSD: number;
  rating: number;
  totalTours: number;
  status: 'available' | 'on_tour' | 'off_duty' | 'suspended';
  avatarUrl: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  issuedDate: string;
  dueDate: string;
  tourTitle: string;
  duration: string;
  subtotalUSD: number;
  taxUSD: number;
  totalUSD: number;
  status: 'pending' | 'paid' | 'refunded';
  paymentMethod: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'replied' | 'resolved';
  createdAt: string;
  assignedStaff?: string;
}

export interface ReviewRecord {
  id: string;
  customerName: string;
  customerCountry: string;
  rating: number;
  tourTitle: string;
  comment: string;
  status: 'approved' | 'pending' | 'hidden';
  date: string;
  isVerified: boolean;
}

export interface WebsiteCMSData {
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    videoUrl: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    touristHotline: string;
    ambulanceHotline: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

// Initial Seed Data
const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'b-101',
    referenceId: 'JP-2026-8941',
    bookingType: 'custom_tour',
    customerName: 'David & Emily Miller',
    customerEmail: 'david@example.com',
    customerPhone: '+44 7911 123456',
    customerCountry: 'United Kingdom',
    pickupLocation: 'Bandaranaike International Airport (CMB)',
    startDate: '2026-12-10',
    endDate: '2026-12-16',
    days: 7,
    nights: 6,
    passengers: 2,
    luggage: 3,
    assignedVehicleId: 'kdh-van',
    assignedDriverId: 'usr-driver-003',
    assignedDriverName: 'Sunil Perera',
    assignedGuideId: 'usr-guide-004',
    assignedGuideName: 'Chaminda Fernando',
    status: 'driver_assigned',
    tripProgress: 'on_the_way',
    tripProgressTimeline: [
      { step: 'accepted', timestamp: '2026-11-23 09:30 AM', note: 'Trip accepted by Sunil Perera' },
      { step: 'on_the_way', timestamp: '2026-11-23 10:15 AM', note: 'En route to Airport Terminal' }
    ],
    totalPriceUSD: 875,
    paymentStatus: 'paid',
    specialNotes: 'Require infant car safety seat and English/German guide.',
    destinations: ['galle', 'ella', 'kandy', 'yala'],
    attractions: ['galle-fort', 'nine-arch-bridge', 'temple-tooth', 'yala-safari-game-drive'],
    createdAt: '2026-11-22T10:15:00Z'
  },
  {
    id: 'b-102',
    referenceId: 'JP-2026-7822',
    bookingType: 'package_booking',
    packageTitle: 'Classic Wonders of Ceylon (7D/6N)',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@gmail.com',
    customerPhone: '+1 415 555 2671',
    customerCountry: 'United States',
    pickupLocation: 'The Kingsbury Hotel, Colombo',
    startDate: '2026-11-28',
    endDate: '2026-12-04',
    days: 7,
    nights: 6,
    passengers: 3,
    luggage: 4,
    assignedVehicleId: 'kdh-van',
    assignedDriverId: 'usr-driver-003',
    assignedDriverName: 'Sunil Perera',
    status: 'confirmed',
    tripProgress: 'accepted',
    totalPriceUSD: 1620,
    paymentStatus: 'paid',
    specialNotes: 'Vegetarian meals preferred.',
    createdAt: '2026-11-21T14:20:00Z'
  },
  {
    id: 'b-103',
    referenceId: 'JP-2026-6419',
    bookingType: 'custom_tour',
    customerName: 'Marcus & Lena Weber',
    customerEmail: 'marcus.weber@web.de',
    customerPhone: '+49 170 1234567',
    customerCountry: 'Germany',
    pickupLocation: 'Cinnamon Grand, Colombo',
    startDate: '2026-12-02',
    endDate: '2026-12-06',
    days: 5,
    nights: 4,
    passengers: 2,
    luggage: 2,
    status: 'pending',
    tripProgress: 'accepted',
    totalPriceUSD: 640,
    paymentStatus: 'pending',
    specialNotes: 'Interested in Sigiriya sunrise climb and spice gardens.',
    destinations: ['sigiriya', 'kandy'],
    attractions: ['sigiriya-rock', 'pidurangala-rock', 'temple-tooth'],
    createdAt: '2026-11-23T08:00:00Z'
  },
  {
    id: 'b-104',
    referenceId: 'JP-2026-5210',
    bookingType: 'package_booking',
    packageTitle: 'Wild Leopards & Southern Coast (5D/4N)',
    customerName: 'Antoine Laurent',
    customerEmail: 'antoine.laurent@paris.fr',
    customerPhone: '+33 6 12 34 56 78',
    customerCountry: 'France',
    pickupLocation: 'Bandaranaike International Airport (CMB)',
    startDate: '2026-11-15',
    endDate: '2026-11-19',
    days: 5,
    nights: 4,
    passengers: 2,
    luggage: 2,
    assignedVehicleId: 'suv-prado',
    assignedDriverId: 'usr-driver-003',
    assignedDriverName: 'Sunil Perera',
    status: 'completed',
    tripProgress: 'trip_completed',
    totalPriceUSD: 840,
    paymentStatus: 'paid',
    createdAt: '2026-11-10T12:00:00Z'
  }
];

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'usr-staff-002',
    fullName: 'Anuki Jayawardena',
    email: 'staff@jplankatours.com',
    phone: '+94 71 888 2345',
    jobPosition: 'Senior Operations Coordinator',
    department: 'Tour Operations',
    status: 'active',
    permissions: ['bookings_view', 'bookings_create', 'bookings_edit', 'bookings_assign', 'customers_view', 'vehicles_view', 'drivers_view', 'guides_view', 'reports_view'],
    joiningDate: '2024-03-15',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'usr-staff-003',
    fullName: 'Kavindu Senanayake',
    email: 'kavindu@jplankatours.com',
    phone: '+94 77 999 1234',
    jobPosition: 'Customer Relations Executive',
    department: 'Customer Support',
    status: 'active',
    permissions: ['bookings_view', 'customers_view', 'customers_edit'],
    joiningDate: '2025-01-10',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  }
];

const INITIAL_DRIVERS: DriverMember[] = [
  {
    id: 'usr-driver-003',
    fullName: 'Sunil Perera',
    email: 'driver.sunil@jplankatours.com',
    phone: '+94 77 456 7890',
    licenseNumber: 'WP-DL-89210-SP',
    experienceYears: 12,
    languages: ['English', 'Sinhala'],
    assignedVehicleId: 'kdh-van',
    assignedVehicleName: 'Toyota KDH Super Roof (WP-ND-8941)',
    rating: 4.9,
    totalTrips: 342,
    status: 'on_trip',
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'usr-driver-004',
    fullName: 'Nilantha Silva',
    email: 'nilantha@jplankatours.com',
    phone: '+94 71 567 8901',
    licenseNumber: 'WP-DL-77341-NS',
    experienceYears: 8,
    languages: ['English', 'Sinhala', 'Basic German'],
    assignedVehicleId: 'car',
    assignedVehicleName: 'Toyota Axio Hybrid (WP-CAB-1234)',
    rating: 4.8,
    totalTrips: 156,
    status: 'available',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'usr-driver-005',
    fullName: 'Ruwan Kumara',
    email: 'ruwan@jplankatours.com',
    phone: '+94 78 678 9012',
    licenseNumber: 'SP-DL-55120-RK',
    experienceYears: 6,
    languages: ['English', 'Sinhala'],
    assignedVehicleId: 'suv-prado',
    assignedVehicleName: 'Toyota Land Cruiser Prado (SP-KD-9988)',
    rating: 4.7,
    totalTrips: 89,
    status: 'available',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
  }
];

const INITIAL_GUIDES: GuideMember[] = [
  {
    id: 'usr-guide-004',
    fullName: 'Chaminda Fernando',
    email: 'guide.chaminda@jplankatours.com',
    phone: '+94 76 345 6789',
    licenseNumber: 'SLTDA/NTGL/2012/849',
    experienceYears: 15,
    languages: ['English', 'German', 'Sinhala'],
    specializations: ['Ancient Heritage', 'Buddhism', 'Bird Watching'],
    dailyRateUSD: 35,
    rating: 5.0,
    totalTours: 521,
    status: 'on_tour',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'usr-guide-005',
    fullName: 'Roshini Alwis',
    email: 'roshini@jplankatours.com',
    phone: '+94 77 222 3456',
    licenseNumber: 'SLTDA/NTGL/2018/120',
    experienceYears: 9,
    languages: ['English', 'French', 'Sinhala'],
    specializations: ['Wildlife Safari', 'Tea Country', 'Culinary & Spices'],
    dailyRateUSD: 35,
    rating: 4.9,
    totalTours: 230,
    status: 'available',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
  }
];

const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-8941',
    bookingReference: 'JP-2026-8941',
    customerName: 'Sarah & Mark Jenkins',
    customerEmail: 'sarah.jenkins@gmail.com',
    issuedDate: '2026-11-20',
    dueDate: '2026-11-28',
    tourTitle: 'Classic Wonders of Ceylon (7D/6N)',
    duration: '7 Days / 6 Nights',
    subtotalUSD: 1140,
    taxUSD: 60,
    totalUSD: 1200,
    status: 'paid',
    paymentMethod: 'Credit Card (Stripe)'
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-7823',
    bookingReference: 'JP-2026-7823',
    customerName: 'Dr. Michael Chang',
    customerEmail: 'mchang@stanford.edu',
    issuedDate: '2026-11-21',
    dueDate: '2026-12-05',
    tourTitle: 'Exclusive Leopard & Heritage Circuit',
    duration: '10 Days / 9 Nights',
    subtotalUSD: 1539,
    taxUSD: 81,
    totalUSD: 1620,
    status: 'paid',
    paymentMethod: 'Bank Wire Transfer'
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-6419',
    bookingReference: 'JP-2026-6419',
    customerName: 'Marcus & Lena Weber',
    customerEmail: 'marcus.weber@web.de',
    issuedDate: '2026-11-23',
    dueDate: '2026-12-02',
    tourTitle: 'Custom Sigiriya & Kandy Journey',
    duration: '5 Days / 4 Nights',
    subtotalUSD: 608,
    taxUSD: 32,
    totalUSD: 640,
    status: 'pending',
    paymentMethod: 'Cash on Arrival'
  }
];

const INITIAL_CMS: WebsiteCMSData = {
  hero: {
    title: 'Your Adventure Starts Here',
    subtitle: 'Book your transport, island tours and return journey — all in one place.',
    ctaPrimary: 'BOOK YOUR JOURNEY',
    ctaSecondary: 'EXPLORE SAFARI',
    videoUrl: '12.mp4'
  },
  contact: {
    phone: '+94 11 234 5678',
    whatsapp: '+94 77 123 4567',
    email: 'support@srilankatourism.com',
    address: 'JP Lanka Tours HQ, Galle Road, Colombo 03, Sri Lanka',
    touristHotline: '1912 (24/7 National Tourist Assistance)',
    ambulanceHotline: '1990 (Suwa Seriya Emergency)'
  },
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    youtube: 'https://youtube.com'
  }
};

class AdminDataService {
  // Local cache loaders with fallback
  private getStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch {}
    return fallback;
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  // BOOKINGS
  getBookings(): BookingRecord[] {
    return this.getStorage<BookingRecord[]>('jp_admin_bookings', INITIAL_BOOKINGS);
  }

  saveBookings(bookings: BookingRecord[]): void {
    this.setStorage('jp_admin_bookings', bookings);
  }

  updateBooking(id: string, updates: Partial<BookingRecord>): BookingRecord {
    const list = this.getBookings();
    const index = list.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');

    const updated = { ...list[index], ...updates };
    list[index] = updated;
    this.saveBookings(list);
    return updated;
  }

  // Driver Trip Lifecycle Update (Requirement #7)
  updateDriverTripProgress(
    bookingId: string, 
    progressStep: BookingRecord['tripProgress'],
    note?: string
  ): BookingRecord {
    const list = this.getBookings();
    const index = list.findIndex(b => b.id === bookingId);
    if (index === -1) throw new Error('Trip not found');

    const booking = list[index];
    const timeline = booking.tripProgressTimeline || [];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString();
    
    timeline.push({ step: progressStep, timestamp, note });

    // Map progress step to overall booking status
    let status = booking.status;
    if (progressStep === 'trip_completed') status = 'completed';
    else if (progressStep === 'trip_started' || progressStep === 'passenger_picked_up') status = 'in_progress';
    else if (progressStep === 'on_the_way') status = 'on_the_way';

    const updated: BookingRecord = {
      ...booking,
      tripProgress: progressStep,
      tripProgressTimeline: timeline,
      status
    };

    list[index] = updated;
    this.saveBookings(list);
    return updated;
  }

  // STAFF MANAGEMENT (Requirement #5)
  getStaff(): StaffMember[] {
    return this.getStorage<StaffMember[]>('jp_admin_staff', INITIAL_STAFF);
  }

  saveStaff(staffList: StaffMember[]): void {
    this.setStorage('jp_admin_staff', staffList);
  }

  addStaff(member: Omit<StaffMember, 'id'>): StaffMember {
    const list = this.getStaff();
    const newStaff: StaffMember = {
      ...member,
      id: `usr-staff-${Date.now().toString().slice(-4)}`
    };
    list.unshift(newStaff);
    this.saveStaff(list);
    return newStaff;
  }

  updateStaff(id: string, updates: Partial<StaffMember>): StaffMember {
    const list = this.getStaff();
    const index = list.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Staff member not found');
    list[index] = { ...list[index], ...updates };
    this.saveStaff(list);
    return list[index];
  }

  // DRIVERS
  getDrivers(): DriverMember[] {
    return this.getStorage<DriverMember[]>('jp_admin_drivers', INITIAL_DRIVERS);
  }

  saveDrivers(drivers: DriverMember[]): void {
    this.setStorage('jp_admin_drivers', drivers);
  }

  addDriver(driver: Omit<DriverMember, 'id'>): DriverMember {
    const list = this.getDrivers();
    const newDriver: DriverMember = {
      ...driver,
      id: `usr-driver-${Date.now().toString().slice(-4)}`
    };
    list.unshift(newDriver);
    this.saveDrivers(list);
    return newDriver;
  }

  updateDriver(id: string, updates: Partial<DriverMember>): DriverMember {
    const list = this.getDrivers();
    const index = list.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Driver not found');
    list[index] = { ...list[index], ...updates };
    this.saveDrivers(list);
    return list[index];
  }

  // TOUR GUIDES
  getGuides(): GuideMember[] {
    return this.getStorage<GuideMember[]>('jp_admin_guides', INITIAL_GUIDES);
  }

  saveGuides(guides: GuideMember[]): void {
    this.setStorage('jp_admin_guides', guides);
  }

  addGuide(guide: Omit<GuideMember, 'id'>): GuideMember {
    const list = this.getGuides();
    const newGuide: GuideMember = {
      ...guide,
      id: `usr-guide-${Date.now().toString().slice(-4)}`
    };
    list.unshift(newGuide);
    this.saveGuides(list);
    return newGuide;
  }

  updateGuide(id: string, updates: Partial<GuideMember>): GuideMember {
    const list = this.getGuides();
    const index = list.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Guide not found');
    list[index] = { ...list[index], ...updates };
    this.saveGuides(list);
    return list[index];
  }

  // VEHICLES
  getVehicles() {
    return this.getStorage('jp_admin_vehicles', TOUR_VEHICLES);
  }

  saveVehicles(vehicles: any[]) {
    this.setStorage('jp_admin_vehicles', vehicles);
  }

  // DESTINATIONS
  getDestinations() {
    return this.getStorage('jp_admin_destinations', DESTINATIONS);
  }

  saveDestinations(destinations: any[]) {
    this.setStorage('jp_admin_destinations', destinations);
  }

  // ATTRACTIONS
  getAttractions() {
    return this.getStorage('jp_admin_attractions', ATTRACTIONS);
  }

  saveAttractions(attractions: any[]) {
    this.setStorage('jp_admin_attractions', attractions);
  }

  // PACKAGES
  getPackages() {
    return this.getStorage('jp_admin_packages', TOUR_PACKAGES);
  }

  savePackages(packages: any[]) {
    this.setStorage('jp_admin_packages', packages);
  }

  // CMS
  getCMS(): WebsiteCMSData {
    return this.getStorage<WebsiteCMSData>('jp_admin_cms', INITIAL_CMS);
  }

  saveCMS(cms: WebsiteCMSData): void {
    this.setStorage('jp_admin_cms', cms);
  }

  // INVOICES
  getInvoices(): InvoiceRecord[] {
    return this.getStorage<InvoiceRecord[]>('jp_admin_invoices', INITIAL_INVOICES);
  }

  saveInvoices(invoices: InvoiceRecord[]): void {
    this.setStorage('jp_admin_invoices', invoices);
  }

  // REVIEWS
  getReviews(): ReviewRecord[] {
    return this.getStorage<ReviewRecord[]>('jp_admin_reviews', [
      {
        id: 'rev-1',
        customerName: 'Marcus Weber',
        customerCountry: 'Germany',
        rating: 5,
        tourTitle: 'Classic Wonders of Ceylon',
        comment: 'Exceptional 7-day trip across Sri Lanka! Sunil our driver was outstanding and our guide was deeply knowledgeable.',
        status: 'approved',
        date: '2026-11-18',
        isVerified: true
      },
      {
        id: 'rev-2',
        customerName: 'Sarah Jenkins',
        customerCountry: 'United Kingdom',
        rating: 5,
        tourTitle: 'Yala Leopard Safari',
        comment: 'We saw 3 leopards in Yala! Booking process was seamless and the KDH Van was super comfortable with AC.',
        status: 'approved',
        date: '2026-11-15',
        isVerified: true
      }
    ]);
  }

  saveReviews(reviews: ReviewRecord[]): void {
    this.setStorage('jp_admin_reviews', reviews);
  }

  // CONTACT MESSAGES
  getMessages(): ContactMessage[] {
    return this.getStorage<ContactMessage[]>('jp_admin_messages', [
      {
        id: 'msg-1',
        fullName: 'Dr. Robert Taylor',
        email: 'robert.taylor@cambridge.edu',
        phone: '+44 1223 762100',
        subject: 'Private Birdwatching & Heritage Tour for 4 Adults in January',
        message: 'Looking for a specialized wildlife tracker and ornithological guide for a 10-day tour covering Bundala, Sinharaja, and Horton Plains.',
        status: 'new',
        createdAt: '2026-11-23T06:30:00Z'
      },
      {
        id: 'msg-2',
        fullName: 'Elena Rostova',
        email: 'elena.rostova@yandex.ru',
        phone: '+7 916 555 4321',
        subject: 'Airport Transfer to Mirissa with Russian speaking driver',
        message: 'Can we book an airport transfer for 3 passengers arriving on EK650 with Russian assistance?',
        status: 'replied',
        createdAt: '2026-11-22T14:10:00Z',
        assignedStaff: 'Anuki Jayawardena'
      }
    ]);
  }

  saveMessages(messages: ContactMessage[]): void {
    this.setStorage('jp_admin_messages', messages);
  }
}

export const adminDataService = new AdminDataService();

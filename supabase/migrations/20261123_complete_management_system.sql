-- ====================================================================
-- JP LANKA TOURS – COMPLETE DATABASE SCHEMA & ROLE-BASED ACCESS CONTROL
-- Super Admin, Staff, Drivers, Tour Guides, and Customers
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM ('super_admin', 'staff', 'driver', 'guide', 'customer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status_type AS ENUM (
    'pending', 'under_review', 'confirmed', 'driver_assigned',
    'vehicle_assigned', 'guide_assigned', 'on_the_way',
    'in_progress', 'completed', 'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_type AS ENUM ('pending', 'paid', 'partially_paid', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE trip_progress_type AS ENUM (
    'accepted', 'on_the_way', 'arrived_pickup', 'passenger_picked_up',
    'trip_started', 'arrived_destination', 'trip_completed'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role_type NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. STAFF PROFILES & PERMISSIONS
CREATE TABLE IF NOT EXISTS public.staff_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_position TEXT NOT NULL,
  department TEXT NOT NULL,
  permissions TEXT[] NOT NULL DEFAULT '{}',
  joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. DRIVER PROFILES
CREATE TABLE IF NOT EXISTS public.driver_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  license_number TEXT NOT NULL,
  experience_years INT NOT NULL DEFAULT 5,
  languages TEXT[] NOT NULL DEFAULT '{"English", "Sinhala"}',
  assigned_vehicle_id TEXT,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
  total_trips INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'on_trip', 'off_duty', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TOUR GUIDE PROFILES
CREATE TABLE IF NOT EXISTS public.guide_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  license_number TEXT NOT NULL,
  experience_years INT NOT NULL DEFAULT 5,
  languages TEXT[] NOT NULL DEFAULT '{"English", "Sinhala"}',
  specializations TEXT[] NOT NULL DEFAULT '{"Heritage", "Wildlife", "Birding"}',
  daily_rate_usd NUMERIC(10,2) NOT NULL DEFAULT 35.00,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
  total_tours INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'on_tour', 'off_duty', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Car', 'Van', 'Luxury SUV', 'Mini Bus', 'Bus', 'Safari Jeep')),
  reg_number TEXT NOT NULL UNIQUE,
  brand_model TEXT NOT NULL,
  passenger_capacity INT NOT NULL,
  luggage_capacity INT NOT NULL,
  has_ac BOOLEAN NOT NULL DEFAULT TRUE,
  daily_price_usd NUMERIC(10,2) NOT NULL,
  per_km_price_usd NUMERIC(10,2) NOT NULL DEFAULT 0.85,
  availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'booked', 'maintenance')),
  image TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. DESTINATIONS & ATTRACTIONS
CREATE TABLE IF NOT EXISTS public.destinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  province TEXT NOT NULL,
  district TEXT,
  short_description TEXT NOT NULL,
  full_description TEXT,
  cover_image TEXT NOT NULL,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  map_coordinates JSONB,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  popularity_status TEXT NOT NULL DEFAULT 'normal',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attractions (
  id TEXT PRIMARY KEY,
  destination_id TEXT NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  duration_hours NUMERIC(3,1) NOT NULL DEFAULT 2.0,
  entrance_fee_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  must_see BOOLEAN NOT NULL DEFAULT FALSE,
  opening_hours TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. TOUR PACKAGES
CREATE TABLE IF NOT EXISTS public.tour_packages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category TEXT NOT NULL,
  badge TEXT,
  duration_days INT NOT NULL,
  duration_nights INT NOT NULL,
  price_per_person_usd NUMERIC(10,2) NOT NULL,
  image TEXT NOT NULL,
  destinations TEXT[] NOT NULL DEFAULT '{}',
  vehicle_type TEXT NOT NULL,
  guide_included BOOLEAN NOT NULL DEFAULT TRUE,
  inclusions TEXT[] NOT NULL DEFAULT '{}',
  exclusions TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_id TEXT NOT NULL UNIQUE,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('custom_tour', 'package_booking')),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  package_id TEXT REFERENCES public.tour_packages(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INT NOT NULL,
  duration_nights INT NOT NULL,
  status booking_status_type NOT NULL DEFAULT 'pending',
  trip_progress trip_progress_type NOT NULL DEFAULT 'accepted',
  passengers INT NOT NULL DEFAULT 2,
  luggage INT NOT NULL DEFAULT 2,
  assigned_vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE SET NULL,
  assigned_driver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_guide_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  guest_country TEXT,
  pickup_location TEXT NOT NULL,
  special_notes TEXT,
  total_price_usd NUMERIC(10,2) NOT NULL,
  payment_status payment_status_type NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. PAYMENTS & INVOICES
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount_usd NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status payment_status_type NOT NULL DEFAULT 'pending',
  gateway_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT NOT NULL UNIQUE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  subtotal_usd NUMERIC(10,2) NOT NULL,
  tax_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_usd NUMERIC(10,2) NOT NULL,
  status payment_status_type NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'overall',
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. CONTACT MESSAGES & ENQUIRIES
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'replied', 'resolved')),
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. WEBSITE CMS CONTENT
CREATE TABLE IF NOT EXISTS public.website_cms (
  section_key TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content_json JSONB NOT NULL DEFAULT '{}',
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. ACTIVITY AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}',
  ip_address TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_cms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check user role
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS user_role_type AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Super Admin has universal access
CREATE POLICY super_admin_all_profiles ON public.profiles FOR ALL USING (public.get_current_role() = 'super_admin');
CREATE POLICY super_admin_all_bookings ON public.bookings FOR ALL USING (public.get_current_role() = 'super_admin');
CREATE POLICY super_admin_all_payments ON public.payments FOR ALL USING (public.get_current_role() = 'super_admin');
CREATE POLICY super_admin_all_invoices ON public.invoices FOR ALL USING (public.get_current_role() = 'super_admin');
CREATE POLICY super_admin_all_cms ON public.website_cms FOR ALL USING (public.get_current_role() = 'super_admin');
CREATE POLICY super_admin_all_logs ON public.activity_logs FOR ALL USING (public.get_current_role() = 'super_admin');

-- Staff can view & edit bookings if permitted
CREATE POLICY staff_bookings ON public.bookings FOR ALL USING (public.get_current_role() = 'staff');

-- Drivers can only view their own assigned trips
CREATE POLICY driver_assigned_bookings ON public.bookings
  FOR SELECT USING (
    public.get_current_role() = 'driver' AND assigned_driver_id = auth.uid()
  );

CREATE POLICY driver_update_progress ON public.bookings
  FOR UPDATE USING (
    public.get_current_role() = 'driver' AND assigned_driver_id = auth.uid()
  ) WITH CHECK (
    public.get_current_role() = 'driver' AND assigned_driver_id = auth.uid()
  );

-- Guides can only view their own assigned tours
CREATE POLICY guide_assigned_bookings ON public.bookings
  FOR SELECT USING (
    public.get_current_role() = 'guide' AND assigned_guide_id = auth.uid()
  );

-- Customers can view only their own bookings
CREATE POLICY customer_own_bookings ON public.bookings
  FOR SELECT USING (
    customer_id = auth.uid() OR guest_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );

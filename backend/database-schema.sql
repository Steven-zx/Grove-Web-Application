-- Grove Web Application Database Schema
-- Run these SQL commands in your Supabase SQL Editor

-- 1. User Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    importance VARCHAR(50) DEFAULT 'Medium', -- Low, Medium, High, Urgent
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create policy for announcements (everyone can read)
CREATE POLICY "Anyone can view announcements" ON public.announcements
    FOR SELECT TO authenticated USING (true);

-- 3. Amenities Table
CREATE TABLE IF NOT EXISTS public.amenities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INTEGER DEFAULT 1,
    hourly_rate DECIMAL(10,2) DEFAULT 0.00,
    available_hours VARCHAR(255) DEFAULT '8:00 AM - 10:00 PM',
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for amenities
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;

-- Create policy for amenities (everyone can read)
CREATE POLICY "Anyone can view amenities" ON public.amenities
    FOR SELECT TO authenticated USING (true);

-- Insert default amenities
INSERT INTO public.amenities (name, description, capacity, image_url) VALUES
('Swimming Pool', 'Olympic-sized swimming pool with lane markings', 50, '/src/assets/pool.jpg'),
('Basketball Court', 'Full-size basketball court with professional hoops', 10, '/src/assets/basketball.jpg'),
('Clubhouse', 'Multi-purpose clubhouse for events and gatherings', 100, '/src/assets/clubhouse.jpg'),
('Tennis Court', 'Professional tennis court with net and seating', 4, null),
('Gym', 'Fully equipped fitness center', 20, null),
('Function Hall', 'Large hall for parties and celebrations', 150, null);

-- 4. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE,
    amenity_type VARCHAR(255) NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    resident_name VARCHAR(255) NOT NULL,
    purpose TEXT,
    mobile_number VARCHAR(20),
    guest_count INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = user_id);

-- 5. Visitors Table
CREATE TABLE IF NOT EXISTS public.visitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    resident_name VARCHAR(255) NOT NULL,
    visitor_name VARCHAR(255) NOT NULL,
    visit_date DATE NOT NULL,
    visit_purpose TEXT,
    mobile_number VARCHAR(20),
    vehicle_info VARCHAR(255),
    residence_address TEXT,
    num_visitors INTEGER DEFAULT 1,
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- active, expired, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for visitors
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Create policies for visitors
CREATE POLICY "Users can view own visitors" ON public.visitors
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own visitor entries" ON public.visitors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Concerns Table (Issue Reports)
CREATE TABLE IF NOT EXISTS public.concerns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reporter_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    issue_type VARCHAR(100) NOT NULL, -- Maintenance, Security, Noise, Cleanliness, etc.
    email VARCHAR(255),
    phone VARCHAR(20),
    description TEXT NOT NULL,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'unread', -- unread, in-progress, resolved, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for concerns
ALTER TABLE public.concerns ENABLE ROW LEVEL SECURITY;

-- Create policies for concerns
CREATE POLICY "Users can view own concerns" ON public.concerns
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create concerns" ON public.concerns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Create indexes for better performance
CREATE INDEX idx_announcements_created_at ON public.announcements(created_at DESC);
CREATE INDEX idx_announcements_category ON public.announcements(category);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_visitors_user_id ON public.visitors(user_id);
CREATE INDEX idx_visitors_qr_code ON public.visitors(qr_code);
CREATE INDEX idx_concerns_user_id ON public.concerns(user_id);
CREATE INDEX idx_concerns_status ON public.concerns(status);

-- 8. Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_visitors_updated_at
    BEFORE UPDATE ON public.visitors
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_concerns_updated_at
    BEFORE UPDATE ON public.concerns
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 10. Insert sample data for testing

-- Sample announcements
INSERT INTO public.announcements (title, description, category, importance) VALUES
('Welcome to Grove Community!', 'Welcome to our beautiful residential community. We hope you enjoy all the amenities we have to offer.', 'General', 'Medium'),
('Pool Maintenance Schedule', 'The swimming pool will be undergoing routine maintenance every Sunday from 6:00 AM to 8:00 AM.', 'Maintenance', 'High'),
('New Basketball Court Rules', 'Please note the new rules for the basketball court: Maximum 2 hours per booking, clean up after use.', 'Sports', 'Medium'),
('Security Update', 'New security measures have been implemented. All visitors must now register through the mobile app.', 'Security', 'Urgent');

-- Sample concerns for testing
INSERT INTO public.concerns (reporter_name, location, issue_type, email, description, status) VALUES
('John Doe', 'Main Gate', 'Security', 'john@example.com', 'Gate lock appears to be malfunctioning during night hours.', 'unread'),
('Jane Smith', 'Pool Area', 'Cleanliness', 'jane@example.com', 'Pool area needs more frequent cleaning, especially around the changing rooms.', 'in-progress');
-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO CREATE BOOKING TABLES

DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;

-- 1. Create Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    patient_name text,
    patient_age text,
    patient_gender text,
    patient_phone text,
    symptoms text,
    doctor_id text REFERENCES doctors(id) ON DELETE CASCADE,
    doctor_name text,
    date text,
    time text,
    status text DEFAULT 'pending'
);

-- Disable RLS so frontend can freely insert/update
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- 2. Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    doctor_name text,
    type text,
    message text,
    appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Disable RLS so frontend can freely insert/read
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Run this in your Supabase SQL Editor
-- Extends profiles table to store patient data collected at registration

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;

-- Add duty_hours to doctors for ScheduleAgent to read
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS duty_hours text DEFAULT 'Mon-Fri, 9 AM - 5 PM';

-- Verify
SELECT id, name, role, age, gender, phone FROM profiles LIMIT 5;
SELECT id, name, specialty, duty_hours FROM doctors LIMIT 5;

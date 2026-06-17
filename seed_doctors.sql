-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 1. Create the Doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id text PRIMARY KEY,
    name text,
    specialty text,
    "specialtyId" text,
    rating numeric,
    reviews integer,
    experience text,
    image text,
    bio text,
    availability text
);

-- Delete existing to ensure a clean slate if user runs it again
TRUNCATE TABLE doctors CASCADE;

-- 2. Insert the dummy data into your live Supabase database
INSERT INTO doctors (id, name, specialty, "specialtyId", rating, reviews, experience, image, bio, availability) VALUES
('doc-01', 'Dr. James Smith', 'Neurologist', 'neurology', 4.8, 234, '12+ years', 'https://i.pravatar.cc/250?img=11', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-02', 'Dr. Mary Johnson', 'Neurologist', 'neurology', 4.9, 189, '15+ years', 'https://i.pravatar.cc/250?img=12', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-03', 'Dr. Robert Williams', 'Neurologist', 'neurology', 4.7, 312, '10+ years', 'https://i.pravatar.cc/250?img=13', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-04', 'Dr. Patricia Brown', 'Neurologist', 'neurology', 4.9, 456, '20+ years', 'https://i.pravatar.cc/250?img=14', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-05', 'Dr. John Jones', 'Neurologist', 'neurology', 4.6, 120, '8+ years', 'https://i.pravatar.cc/250?img=15', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM'),

('doc-06', 'Dr. Jennifer Garcia', 'Cardiologist', 'cardiology', 4.8, 340, '14+ years', 'https://i.pravatar.cc/250?img=21', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-07', 'Dr. Michael Miller', 'Cardiologist', 'cardiology', 4.9, 410, '18+ years', 'https://i.pravatar.cc/250?img=22', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-08', 'Dr. Linda Davis', 'Cardiologist', 'cardiology', 4.7, 275, '11+ years', 'https://i.pravatar.cc/250?img=23', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-09', 'Dr. William Rodriguez', 'Cardiologist', 'cardiology', 4.9, 520, '22+ years', 'https://i.pravatar.cc/250?img=24', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-10', 'Dr. Elizabeth Martinez', 'Cardiologist', 'cardiology', 4.6, 150, '9+ years', 'https://i.pravatar.cc/250?img=25', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM'),

('doc-11', 'Dr. David Hernandez', 'Orthopedic Surgeon', 'orthopedics', 4.8, 290, '13+ years', 'https://i.pravatar.cc/250?img=31', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-12', 'Dr. Barbara Lopez', 'Orthopedic Surgeon', 'orthopedics', 4.9, 360, '16+ years', 'https://i.pravatar.cc/250?img=32', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-13', 'Dr. Richard Gonzalez', 'Orthopedic Surgeon', 'orthopedics', 4.7, 240, '10+ years', 'https://i.pravatar.cc/250?img=33', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-14', 'Dr. Susan Wilson', 'Orthopedic Surgeon', 'orthopedics', 4.9, 410, '19+ years', 'https://i.pravatar.cc/250?img=34', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-15', 'Dr. Joseph Anderson', 'Orthopedic Surgeon', 'orthopedics', 4.6, 130, '7+ years', 'https://i.pravatar.cc/250?img=35', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM'),

('doc-16', 'Dr. Jessica Thomas', 'Neurosurgeon', 'neurosurgery', 4.8, 310, '15+ years', 'https://i.pravatar.cc/250?img=41', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-17', 'Dr. Thomas Taylor', 'Neurosurgeon', 'neurosurgery', 4.9, 380, '20+ years', 'https://i.pravatar.cc/250?img=42', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-18', 'Dr. Sarah Moore', 'Neurosurgeon', 'neurosurgery', 4.7, 260, '12+ years', 'https://i.pravatar.cc/250?img=43', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-19', 'Dr. Charles Jackson', 'Neurosurgeon', 'neurosurgery', 4.9, 430, '25+ years', 'https://i.pravatar.cc/250?img=44', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-20', 'Dr. Karen Martin', 'Neurosurgeon', 'neurosurgery', 4.6, 140, '9+ years', 'https://i.pravatar.cc/250?img=45', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM'),

('doc-21', 'Dr. Daniel Lee', 'Ophthalmologist', 'ophthalmology', 4.8, 330, '14+ years', 'https://i.pravatar.cc/250?img=51', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-22', 'Dr. Lisa Perez', 'Ophthalmologist', 'ophthalmology', 4.9, 400, '18+ years', 'https://i.pravatar.cc/250?img=52', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-23', 'Dr. Matthew Thompson', 'Ophthalmologist', 'ophthalmology', 4.7, 280, '11+ years', 'https://i.pravatar.cc/250?img=53', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-24', 'Dr. Nancy White', 'Ophthalmologist', 'ophthalmology', 4.9, 450, '21+ years', 'https://i.pravatar.cc/250?img=54', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-25', 'Dr. Anthony Harris', 'Ophthalmologist', 'ophthalmology', 4.6, 160, '8+ years', 'https://i.pravatar.cc/250?img=55', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM'),

('doc-26', 'Dr. Betty Sanchez', 'Plastic Surgeon', 'cosmetic', 4.8, 350, '16+ years', 'https://i.pravatar.cc/250?img=61', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-27', 'Dr. Mark Clark', 'Plastic Surgeon', 'cosmetic', 4.9, 420, '22+ years', 'https://i.pravatar.cc/250?img=62', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-28', 'Dr. Margaret Ramirez', 'Plastic Surgeon', 'cosmetic', 4.7, 300, '13+ years', 'https://i.pravatar.cc/250?img=63', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-29', 'Dr. Donald Lewis', 'Plastic Surgeon', 'cosmetic', 4.9, 470, '24+ years', 'https://i.pravatar.cc/250?img=64', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-30', 'Dr. Sandra Robinson', 'Plastic Surgeon', 'cosmetic', 4.6, 170, '10+ years', 'https://i.pravatar.cc/250?img=65', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM'),

('doc-31', 'Dr. Steven Walker', 'Dentist', 'dentistry', 4.8, 370, '15+ years', 'https://i.pravatar.cc/250?img=66', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-32', 'Dr. Ashley Young', 'Dentist', 'dentistry', 4.9, 440, '19+ years', 'https://i.pravatar.cc/250?img=67', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-33', 'Dr. Paul Allen', 'Dentist', 'dentistry', 4.7, 320, '12+ years', 'https://i.pravatar.cc/250?img=68', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-34', 'Dr. Kimberly King', 'Dentist', 'dentistry', 4.9, 490, '23+ years', 'https://i.pravatar.cc/250?img=69', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-35', 'Dr. Andrew Wright', 'Dentist', 'dentistry', 4.6, 180, '9+ years', 'https://i.pravatar.cc/250?img=70', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM'),

('doc-36', 'Dr. Emily Scott', 'Anesthesiologist', 'anesthesia', 4.8, 390, '17+ years', 'https://i.pravatar.cc/250?img=16', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-37', 'Dr. Joshua Torres', 'Anesthesiologist', 'anesthesia', 4.9, 460, '21+ years', 'https://i.pravatar.cc/250?img=17', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-38', 'Dr. Donna Nguyen', 'Anesthesiologist', 'anesthesia', 4.7, 340, '14+ years', 'https://i.pravatar.cc/250?img=18', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-39', 'Dr. Kenneth Hill', 'Anesthesiologist', 'anesthesia', 4.9, 510, '26+ years', 'https://i.pravatar.cc/250?img=19', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-40', 'Dr. Michelle Flores', 'Anesthesiologist', 'anesthesia', 4.6, 190, '11+ years', 'https://i.pravatar.cc/250?img=20', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM'),

('doc-41', 'Dr. Kevin Green', 'Pulmonologist', 'pulmonology', 4.8, 320, '16+ years', 'https://i.pravatar.cc/250?img=21', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-42', 'Dr. Carol Adams', 'Pulmonologist', 'pulmonology', 4.9, 390, '20+ years', 'https://i.pravatar.cc/250?img=22', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-43', 'Dr. Brian Nelson', 'Pulmonologist', 'pulmonology', 4.7, 270, '13+ years', 'https://i.pravatar.cc/250?img=23', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-44', 'Dr. Amanda Baker', 'Pulmonologist', 'pulmonology', 4.9, 440, '22+ years', 'https://i.pravatar.cc/250?img=24', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-45', 'Dr. George Hall', 'Pulmonologist', 'pulmonology', 4.6, 150, '10+ years', 'https://i.pravatar.cc/250?img=25', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM'),

('doc-46', 'Dr. Melissa Rivera', 'Hepatologist', 'hepatology', 4.8, 340, '15+ years', 'https://i.pravatar.cc/250?img=26', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-47', 'Dr. Edward Campbell', 'Hepatologist', 'hepatology', 4.9, 410, '19+ years', 'https://i.pravatar.cc/250?img=27', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-48', 'Dr. Deborah Mitchell', 'Hepatologist', 'hepatology', 4.7, 290, '12+ years', 'https://i.pravatar.cc/250?img=28', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-49', 'Dr. Ronald Carter', 'Hepatologist', 'hepatology', 4.9, 460, '23+ years', 'https://i.pravatar.cc/250?img=29', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-50', 'Dr. Stephanie Roberts', 'Hepatologist', 'hepatology', 4.6, 170, '9+ years', 'https://i.pravatar.cc/250?img=30', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM'),

('doc-51', 'Dr. Timothy Gomez', 'ENT Specialist', 'ent', 4.8, 360, '14+ years', 'https://i.pravatar.cc/250?img=31', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-52', 'Dr. Rebecca Phillips', 'ENT Specialist', 'ent', 4.9, 430, '18+ years', 'https://i.pravatar.cc/250?img=32', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-53', 'Dr. Jason Evans', 'ENT Specialist', 'ent', 4.7, 310, '11+ years', 'https://i.pravatar.cc/250?img=33', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-54', 'Dr. Sharon Turner', 'ENT Specialist', 'ent', 4.9, 480, '21+ years', 'https://i.pravatar.cc/250?img=34', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-55', 'Dr. Jeffrey Diaz', 'ENT Specialist', 'ent', 4.6, 190, '8+ years', 'https://i.pravatar.cc/250?img=35', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM'),

('doc-56', 'Dr. Laura Parker', 'Nephrologist', 'nephrology', 4.8, 380, '17+ years', 'https://i.pravatar.cc/250?img=36', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-57', 'Dr. Ryan Cruz', 'Nephrologist', 'nephrology', 4.9, 450, '22+ years', 'https://i.pravatar.cc/250?img=37', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-58', 'Dr. Cynthia Edwards', 'Nephrologist', 'nephrology', 4.7, 330, '13+ years', 'https://i.pravatar.cc/250?img=38', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-59', 'Dr. Jacob Collins', 'Nephrologist', 'nephrology', 4.9, 500, '25+ years', 'https://i.pravatar.cc/250?img=39', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-60', 'Dr. Kathleen Reyes', 'Nephrologist', 'nephrology', 4.6, 210, '10+ years', 'https://i.pravatar.cc/250?img=40', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM'),

('doc-61', 'Dr. Gary Stewart', 'Gastroenterologist', 'gastroenterology', 4.8, 310, '15+ years', 'https://i.pravatar.cc/250?img=41', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-62', 'Dr. Amy Morris', 'Gastroenterologist', 'gastroenterology', 4.9, 380, '19+ years', 'https://i.pravatar.cc/250?img=42', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-63', 'Dr. Nicholas Morales', 'Gastroenterologist', 'gastroenterology', 4.7, 260, '12+ years', 'https://i.pravatar.cc/250?img=43', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-64', 'Dr. Shirley Murphy', 'Gastroenterologist', 'gastroenterology', 4.9, 430, '24+ years', 'https://i.pravatar.cc/250?img=44', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-65', 'Dr. Eric Cook', 'Gastroenterologist', 'gastroenterology', 4.6, 140, '9+ years', 'https://i.pravatar.cc/250?img=45', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM'),

('doc-66', 'Dr. Angela Rogers', 'Urologist', 'urology', 4.8, 330, '16+ years', 'https://i.pravatar.cc/250?img=46', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-67', 'Dr. Stephen Gutierrez', 'Urologist', 'urology', 4.9, 400, '20+ years', 'https://i.pravatar.cc/250?img=47', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-68', 'Dr. Helen Ortiz', 'Urologist', 'urology', 4.7, 280, '13+ years', 'https://i.pravatar.cc/250?img=48', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-69', 'Dr. Jonathan Morgan', 'Urologist', 'urology', 4.9, 450, '21+ years', 'https://i.pravatar.cc/250?img=49', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-70', 'Dr. Anna Cooper', 'Urologist', 'urology', 4.6, 160, '10+ years', 'https://i.pravatar.cc/250?img=50', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM'),

('doc-71', 'Dr. Larry Peterson', 'Pancreatologist', 'pancreas', 4.8, 350, '14+ years', 'https://i.pravatar.cc/250?img=51', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-72', 'Dr. Brenda Bailey', 'Pancreatologist', 'pancreas', 4.9, 420, '18+ years', 'https://i.pravatar.cc/250?img=52', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-73', 'Dr. Scott Reed', 'Pancreatologist', 'pancreas', 4.7, 300, '11+ years', 'https://i.pravatar.cc/250?img=53', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-74', 'Dr. Pamela Kelly', 'Pancreatologist', 'pancreas', 4.9, 470, '23+ years', 'https://i.pravatar.cc/250?img=54', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-75', 'Dr. Justin Howard', 'Pancreatologist', 'pancreas', 4.6, 180, '9+ years', 'https://i.pravatar.cc/250?img=55', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM'),

('doc-76', 'Dr. Nicole Ramos', 'Pediatrician', 'pediatrics', 4.8, 370, '15+ years', 'https://i.pravatar.cc/250?img=56', 'Committed to providing the best patient care.', 'Mon-Fri, 9 AM - 5 PM'),
('doc-77', 'Dr. Raymond Kim', 'Pediatrician', 'pediatrics', 4.9, 440, '19+ years', 'https://i.pravatar.cc/250?img=57', 'Specializes in advanced treatments and comprehensive care.', 'Tue-Sat, 10 AM - 6 PM'),
('doc-78', 'Dr. Katherine Cox', 'Pediatrician', 'pediatrics', 4.7, 320, '12+ years', 'https://i.pravatar.cc/250?img=58', 'Expert focused on preventive medicine.', 'Mon-Thu, 8 AM - 4 PM'),
('doc-79', 'Dr. Gregory Ward', 'Pediatrician', 'pediatrics', 4.9, 490, '22+ years', 'https://i.pravatar.cc/250?img=59', 'Renowned with a track record of successful cases.', 'Wed-Sun, 9 AM - 5 PM'),
('doc-80', 'Dr. Samantha Richardson', 'Pediatrician', 'pediatrics', 4.6, 200, '10+ years', 'https://i.pravatar.cc/250?img=60', 'Utilizing the latest technology for diagnostics.', 'Weekdays, 11 AM - 7 PM')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    specialty = EXCLUDED.specialty,
    "specialtyId" = EXCLUDED."specialtyId",
    rating = EXCLUDED.rating,
    reviews = EXCLUDED.reviews,
    experience = EXCLUDED.experience,
    image = EXCLUDED.image,
    bio = EXCLUDED.bio,
    availability = EXCLUDED.availability;

-- 3. Temporarily disable Row Level Security so your React frontend can read the doctors list!
ALTER TABLE doctors DISABLE ROW LEVEL SECURITY;

-- 4. Create the Profiles table 
CREATE TABLE IF NOT EXISTS profiles (
    id uuid references auth.users not null primary key,
    name text,
    role text
);

-- 5. Cascade delete setup
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey,
ADD CONSTRAINT profiles_id_fkey
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 6. Temporarily disable Row Level Security on profiles
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

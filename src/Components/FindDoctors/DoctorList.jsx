import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconArrowLeft, IconSearch, IconLoader2 } from '@tabler/icons-react';
import DoctorCard from './DoctorCard';
import SmartBookingModal from './SmartBookingModal';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { supabase } from '../../supabaseClient';
import { enrichDoctor } from './doctorAssets';

const DoctorList = ({ selectedSpecialty, onBack, onBookAppointment, initialSortBy = 'default', aiContext = null }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [sortBy, setSortBy] = useState(initialSortBy);

  useEffect(() => {
    let mounted = true;

    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const url = `https://xrqpszhccwafmscantvk.supabase.co/rest/v1/doctors?specialtyId=eq.${selectedSpecialty.id}&select=*&limit=8`;
        const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycXBzemhjY3dhZm1zY2FudHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNDIyNDAsImV4cCI6MjA4ODkxODI0MH0.NZID4kac880DjiIghbqrD0VeBGcV8AvZMFWCLqj4BIw";

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          console.error("HTTP Fetch failed:", await response.text());
        } else if (mounted) {
          const data = await response.json();
          const enriched = (data || []).map((doc, i) =>
            enrichDoctor(doc, i, selectedSpecialty.id)
          );
          setDoctors(enriched);
        }
      } catch (err) {
        console.error('Unexpected error during native fetch:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (selectedSpecialty?.id) {
      fetchDoctors();
      return () => {
        mounted = false;
      };
    } else {
      setLoading(false);
      return () => { mounted = false; };
    }
  }, [selectedSpecialty]);

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortBy === 'rating_desc') return (b.rating ?? 0) - (a.rating ?? 0);
    if (sortBy === 'rating_asc') return (a.rating ?? 0) - (b.rating ?? 0);
    return 0;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 px-4 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={onBack}
                className="p-2 cursor-pointer rounded-full hover:bg-sky-100 text-sky-600 transition-colors"
              >
                <IconArrowLeft size={24} />
              </button>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-sky-900">
                  {selectedSpecialty.name} Specialists
                </h2>
                <p className="text-sky-700/80 font-medium text-sm mt-1">
                  {selectedSpecialty.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden md:block">
                Sort
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-44 px-3 py-2 rounded-full border border-sky-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 cursor-pointer"
              >
                <option value="default">Recommended</option>
                <option value="rating_desc">Rating: high to low</option>
                <option value="rating_asc">Rating: low to high</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-sky-200 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all bg-white"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <IconLoader2 size={48} className="text-sky-500 animate-spin mb-4" />
              <p className="text-sky-800 font-medium">Fetching best specialists...</p>
            </div>
          ) : (
            /* Doctors Grid */
            <>
              {sortedDoctors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sortedDoctors.map((doctor, index) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      index={index}
                      onBookClick={() => setSelectedDoctorForBooking(doctor)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-sky-100 shadow-sm">
                  <p className="text-lg text-gray-500 font-medium">No specialists found matching your search.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-sky-500 hover:text-sky-600 font-medium hover:underline cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </>
          )}

          <SmartBookingModal 
          isOpen={!!selectedDoctorForBooking} 
          onClose={() => setSelectedDoctorForBooking(null)} 
          doctor={selectedDoctorForBooking} 
          prefillSymptoms={aiContext?.symptoms || ''}
          prefillDiagnosis={
            aiContext?.fromAI
              ? {
                  specialty: selectedSpecialty?.name || null,
                  specialtyId: selectedSpecialty?.id || null,
                  confidence: typeof aiContext?.confidence === 'number' ? aiContext.confidence : 0,
                  keywords: [],
                  source: 'hf_model',
                  diseaseLabel: aiContext?.diseaseLabel || null,
                }
              : null
          }
        />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DoctorList;

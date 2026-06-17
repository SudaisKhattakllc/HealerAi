import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconCalendarEvent, IconStethoscope } from '@tabler/icons-react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

const BookingModal = ({ isOpen, onClose, doctor }) => {
  const { user, role } = useAuth();
  const todayStr = new Date().toISOString().split('T')[0];
  const formatTime12 = (timeStr) => {
    if (!timeStr) return '';
    const [hRaw, mRaw] = timeStr.split(':');
    const h = Number(hRaw);
    const m = Number(mRaw ?? '0');
    if (Number.isNaN(h) || Number.isNaN(m)) return timeStr;
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = ((h + 11) % 12) + 1;
    return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
  };
  const timeOptions = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'];
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    date: '',
    time: '',
    symptoms: '',
    termsAccepted: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  if (!isOpen || !doctor) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.termsAccepted) return;
    
    console.log('BookingModal: user =>', user?.email, '| role =>', role);

    setFeedback({ type: '', message: '' });

    if (!user || role?.toLowerCase() !== 'patient') {
      setFeedback({ type: 'error', message: `You need to log in as a Patient to book an appointment. Current role: "${role || 'none'}".` });
      return;
    }

    setLoading(true);

    try {
      if (form.date && form.date < todayStr) {
        setFeedback({ type: 'error', message: 'Please select a valid upcoming date.' });
        return;
      }

      // 1. Create Appointment in database
      const { data: appointment, error: apptError } = await supabase.from('appointments').insert([{
        patient_id: user.id,
        patient_name: form.name,
        patient_age: form.age,
        patient_gender: form.gender,
        patient_phone: form.phone,
        symptoms: form.symptoms,
        doctor_id: doctor.id,
        doctor_name: doctor.name,
        date: form.date,
        time: form.time,
        status: 'pending'
      }]).select().single();

      if (apptError) throw apptError;

      // 2. Create Notification directed at this exact Doctor name
      const { error: notifError } = await supabase.from('notifications').insert([{
        patient_id: user.id,
        doctor_name: doctor.name,
        type: 'new_booking',
        message: `New Request from ${form.name} (${form.age} ${form.gender}). Symptoms: "${form.symptoms}". Requested for: ${form.date} at ${form.time}.`,
        appointment_id: appointment.id
      }]);

      if (notifError) throw notifError;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);

    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Unable to book appointment right now. Please try again in a moment.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-sky-500 to-sky-700 p-6 text-white relative flex-shrink-0">
            <button onClick={onClose} className="absolute top-5 right-5 p-1 rounded-full text-white/70 hover:text-white hover:bg-sky-400/30 transition cursor-pointer">
              <IconX size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-1">Book Appointment</h2>
            <p className="text-sky-100 text-sm flex items-center gap-1.5 font-medium">
              <IconStethoscope size={16} /> Requesting {doctor.name} - {doctor.specialty}
            </p>
          </div>

          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
            {success ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-pulse">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5 text-green-500 shadow-inner">
                  <IconCalendarEvent size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Request Sent!</h3>
                <p className="text-gray-500 text-sm max-w-sm">
                  Your booking request has been completely processed and sent to {doctor.name}. You will be notified in your bell icon once the doctor confirms the schedule.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {feedback.message && (
                  <div className={`rounded-2xl border px-4 py-3 text-sm ${feedback.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                    {feedback.message}
                  </div>
                )}
                
                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
                    <input required name="name" value={form.name} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white text-gray-800" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                    <input required name="phone" value={form.phone} onChange={handleChange} type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white text-gray-800" placeholder="+1 234 567 8900" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Age</label>
                    <input required name="age" value={form.age} onChange={handleChange} type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white text-gray-800" placeholder="e.g. 35" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white text-gray-800 cursor-pointer">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Disease / Symptoms</label>
                  <textarea required name="symptoms" value={form.symptoms} onChange={handleChange} rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition resize-none bg-gray-50 focus:bg-white text-gray-800" placeholder="Briefly describe what you are experiencing..."></textarea>
                </div>

                {/* AI Agent Hooks */}
                <div className="bg-sky-50/50 rounded-2xl p-5 border border-sky-100">
                  <p className="text-sm text-sky-800 font-bold mb-4 flex items-center gap-1.5">
                    <IconCalendarEvent size={18} className="text-sky-500" /> Schedule Preferences (For AI Agent)
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input required name="date" min={todayStr} value={form.date} onChange={handleChange} type="date" className="w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition text-sky-900 bg-white" />
                    </div>
                    <div>
                      <select
                        required
                        name="time"
                        value={form.time}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition text-sky-900 bg-white cursor-pointer"
                      >
                        <option value="">Select time</option>
                        {timeOptions.map((t) => (
                          <option key={t} value={t}>{formatTime12(t)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <input required name="termsAccepted" checked={form.termsAccepted} onChange={handleChange} type="checkbox" className="mt-1 w-5 h-5 text-sky-600 rounded border-gray-300 focus:ring-sky-500 cursor-pointer" />
                  <label className="text-xs text-gray-600 leading-relaxed cursor-pointer" onClick={() => setForm(prev => ({...prev, termsAccepted: !prev.termsAccepted}))}>
                    <span className="font-bold text-gray-700">Fill plz and Accept conditions:</span> I confirm that the above details are accurate. I accept the conditions to send this secure medical request to {doctor.name}.
                  </label>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading || !form.termsAccepted}
                    className="w-full bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white font-bold py-4 rounded-xl shadow-[0_8px_20px_rgba(56,189,248,0.25)] hover:shadow-[0_12px_28px_rgba(56,189,248,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] text-lg"
                  >
                    {loading ? 'Transmitting...' : 'Send to Doctor'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;

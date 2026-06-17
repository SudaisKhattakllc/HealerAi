import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconX,
  IconRobot,
  IconStethoscope,
  IconCalendarEvent,
  IconClock,
  IconUser,
  IconLoader2,
  IconAlertTriangle,
  IconBrain,
  IconDeviceFloppy
} from '@tabler/icons-react';
import { useAuth } from '../../context/AuthContext';
import { PatientDataAgent } from '../../agents/PatientDataAgent';
import { ScheduleAgent, getAvailableDates } from '../../agents/ScheduleAgent';
import { BookingAgent } from '../../agents/BookingAgent';
import { DiagnosisAgent } from '../../agents/DiagnosisAgent';
import Supervisor, { onNotify } from '../../agents/SupervisorAgent';
import { supabase } from '../../supabaseClient';

/**
 * SmartBookingModal (v3 — Auto-Correction Agent)
 * ──────────────────────────────────────────────────────────────
 * FIXED ISSUE: "Empty Profile Data"
 * 
 * New Feature: If the Agent finds that your profile is incomplete (missing Age, Gender, etc.),
 * it will automatically turn those fields into INPUTS.
 * When you click "Book", the Agent will:
 *   1. Update your Profile in the database PERMANENTLY.
 *   2. Complete the booking.
 * 
 * This ensures that patients only have to fill their info ONCE, and the Agent 
 * remembers it forever.
 */

// ── Set your BioBERT endpoint here (null = keyword-matching only) ──
const BIOBERT_ENDPOINT = null;

// ─────────────────────────────────────────────────────────────────────
// Supervisor Toast Component
// ─────────────────────────────────────────────────────────────────────
function SupervisorToast({ notifications }) {
  if (!notifications.length) return null;
  const latest = notifications[notifications.length - 1];
  const colorMap = {
    error:   'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    info:    'bg-sky-50 border-sky-200 text-sky-700',
  };
  const cls = colorMap[latest.type] || colorMap.info;
  return (
    <AnimatePresence>
      <motion.div
        key={latest.timestamp}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={`flex items-start gap-2 text-xs rounded-xl border px-3 py-2 mb-3 shadow-sm ${cls}`}
      >
        <IconAlertTriangle size={14} className="mt-0.5 shrink-0" />
        <span><strong>{latest.agent}:</strong> {latest.text}</span>
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Inline Symptom Analyser Widget
// ─────────────────────────────────────────────────────────────────────
function InlineSymptomAnalyser({ currentSymptoms, onResult }) {
  const [analysing, setAnalysing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyse = async () => {
    if (!currentSymptoms.trim()) return;
    setAnalysing(true);
    setResult(null);
    const diagnosis = await Supervisor.runDiagnosis(currentSymptoms, BIOBERT_ENDPOINT);
    setAnalysing(false);
    if (diagnosis?.specialty) {
      setResult(diagnosis);
      onResult(diagnosis);
    } else {
      setResult({ specialty: null });
    }
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleAnalyse}
        disabled={analysing || !currentSymptoms.trim()}
        className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition border cursor-pointer ${
          currentSymptoms.trim() 
          ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100 shadow-sm' 
          : 'bg-gray-50 border-gray-100 text-gray-400 opacity-60'
        }`}
      >
        {analysing ? (
          <><IconLoader2 size={13} className="animate-spin" /> Analysing…</>
        ) : (
          <><IconBrain size={13} /> {currentSymptoms.trim() ? "Identify Your Illness (AI)" : "Type symptoms to enable AI"}</>
        )}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 overflow-hidden"
          >
            {result.specialty ? (
              <div className="flex items-center gap-2 text-xs bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2">
                <span className="text-indigo-700">
                  <strong>AI detected:</strong> {result.specialty}
                  {result.confidence ? ` (${Math.round(result.confidence * 100)}% confident)` : ''}
                </span>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-1 pl-1">
                Could not identify a specialty. Try describing more symptoms.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Main Modal
// ─────────────────────────────────────────────────────────────────────
const SmartBookingModal = ({
  isOpen,
  onClose,
  doctor,
  prefillSymptoms = '',
  prefillDiagnosis = null,
}) => {
  const { user, role } = useAuth();
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

  // Agent states
  const [agentLoading, setAgentLoading]   = useState(false);
  const [patientProfile, setPatientProfile] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [scheduleInfo, setScheduleInfo]   = useState('');

  // Editable Profile state (for auto-correction)
  const [editProfile, setEditProfile] = useState({
    name: '', age: '', gender: '', phone: ''
  });

  // User selections
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms]         = useState(prefillSymptoms);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [diagnosisCtx, setDiagnosisCtx] = useState(prefillDiagnosis);

  // States
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [supervisorMsgs, setSupervisorMsgs] = useState([]);

  // Register Supervisor notifications
  useEffect(() => {
    onNotify((msg) => {
      if (msg.type === 'error' || msg.type === 'warning') {
        setSupervisorMsgs((prev) => [...prev.slice(-4), msg]);
      }
    });
  }, []);

  // ── Run agents when modal opens ─────────────────────────────────
  useEffect(() => {
    if (!isOpen || !doctor || !user) return;

    setPatientProfile(null);
    setSelectedDate('');
    setSelectedTime('');
    setSymptoms(prefillSymptoms);
    setDiagnosisCtx(prefillDiagnosis);
    setSuccess(false);
    setSupervisorMsgs([]);
    setTermsAccepted(false);

    const runAgents = async () => {
      setAgentLoading(true);

      const profile = await Supervisor.run('PatientDataAgent', PatientDataAgent, [user.id]);
      if (profile) {
        setPatientProfile(profile);
        setEditProfile({
          name: profile.name || '',
          age: profile.age || '',
          gender: profile.gender || '',
          phone: profile.phone || ''
        });
      }

      const scheduleResult = await Supervisor.run('ScheduleAgent', ScheduleAgent, [doctor.id, new Date().toISOString().split('T')[0]]);
      if (scheduleResult) {
        setScheduleInfo(scheduleResult.dutyHours);
        const dates = getAvailableDates(scheduleResult.dutyHours);
        setAvailableDates(dates);
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
          const firstSlots = await Supervisor.run('ScheduleAgent', ScheduleAgent, [doctor.id, dates[0]]);
          if (firstSlots) setAvailableSlots(firstSlots.availableSlots);
        }
      }

      setAgentLoading(false);
    };

    runAgents();
  }, [isOpen, doctor, user, prefillSymptoms, prefillDiagnosis]);

  // ── Date change ───────────────────────────────────────────────
  const handleDateChange = useCallback(async (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    const result = await Supervisor.run('ScheduleAgent', ScheduleAgent, [doctor.id, date]);
    if (result) setAvailableSlots(result.availableSlots);
  }, [doctor]);

  // ── Submit via Supervisor + Profile Update ─────────────────────
  const handleSubmit = async () => {
    if (!termsAccepted || !selectedDate || !selectedTime || !symptoms.trim()) return;
    
    // Check if profile fields are filled (Auto-Correction logic)
    if (!editProfile.age || !editProfile.gender || !editProfile.phone) {
      setSupervisorMsgs((prev) => [...prev, {
        type: 'warning', agent: 'Supervisor', 
        text: 'Please fill in your Age, Gender, and Phone to continue.',
        timestamp: new Date().toISOString()
      }]);
      return;
    }

    setSubmitting(true);

    // 1. Permanently update profile in background if it was missing data
    if (!patientProfile?.age || !patientProfile?.gender || !patientProfile?.phone) {
      console.log('[Supervisor] Auto-correcting patient profile in database...');
      const { error: upError } = await supabase
        .from('profiles')
        .update({
          age: parseInt(editProfile.age),
          gender: editProfile.gender,
          phone: editProfile.phone
        })
        .eq('id', user.id);
      
      if (upError) console.warn('[Supervisor] Profile update failed:', upError.message);
      else console.log('[Supervisor] Profile corrected permanently.');
    }

    // 2. Run Booking Pipeline
    const result = await Supervisor.runBookingPipeline({
      userId: user.id,
      doctor,
      date: selectedDate,
      time: selectedTime,
      symptoms,
      agentContext: diagnosisCtx,
    });

    setSubmitting(false);

    if (result?.success) {
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 3500);
    }
  };

  if (!isOpen || !doctor) return null;

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
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-sky-700 p-5 text-white relative flex-shrink-0">
            <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-white/70 hover:text-white hover:bg-sky-400/30 transition cursor-pointer">
              <IconX size={22} />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <IconRobot size={20} className="text-sky-200" />
              <span className="text-sky-100 text-xs font-bold uppercase tracking-widest">AI-Powered Booking</span>
            </div>
            <h2 className="text-xl font-bold">{doctor.name}</h2>
            <p className="text-sky-100 text-sm flex items-center gap-1.5 mt-0.5">
              <IconStethoscope size={14} /> {doctor.specialty} · {scheduleInfo || doctor.availability}
            </p>
          </div>

          <div className="p-5 overflow-y-auto flex-1 scrollbar-hide">
            <SupervisorToast notifications={supervisorMsgs} />

            {success ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5 text-green-500">
                  <IconCalendarEvent size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Appointment Booked!</h3>
                <p className="text-gray-500 text-sm max-w-xs">Your request has been sent. Your profile was also updated automatically.</p>
              </div>
            ) : agentLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <IconLoader2 size={40} className="text-sky-400 animate-spin" />
                <p className="text-sky-700 font-medium text-sm">Agents fetching your data...</p>
              </div>
            ) : (
              <div className="space-y-5">
                
                {/* ── AUTO-CORRECTION PROFILE SECTION ── */}
                <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 shadow-inner">
                  <div className="flex items-center gap-2 mb-3">
                    <IconUser size={16} className="text-sky-500" />
                    <p className="text-[10px] font-bold text-sky-700 uppercase tracking-widest">
                      {patientProfile?.age ? "Your Profile (Confirmed)" : "Complete Your Profile (One-time)"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Name (Read-only) */}
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase">Name</label>
                      <p className="text-sm font-semibold text-gray-800">{editProfile.name || '—'}</p>
                    </div>

                    {/* Age (Editable if missing) */}
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase">Age</label>
                      {!patientProfile?.age ? (
                        <input 
                          type="number" 
                          value={editProfile.age} 
                          onChange={e => setEditProfile({...editProfile, age: e.target.value})}
                          className="w-full text-sm font-semibold text-sky-700 bg-white border border-sky-200 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-sky-400"
                          placeholder="Ex: 25"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-gray-800">{patientProfile.age}</p>
                      )}
                    </div>

                    {/* Gender (Editable if missing) */}
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase">Gender</label>
                      {!patientProfile?.gender ? (
                        <select 
                          value={editProfile.gender} 
                          onChange={e => setEditProfile({...editProfile, gender: e.target.value})}
                          className="w-full text-sm font-semibold text-sky-700 bg-white border border-sky-200 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-sky-400"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <p className="text-sm font-semibold text-gray-800 capitalize">{patientProfile.gender}</p>
                      )}
                    </div>

                    {/* Phone (Editable if missing) */}
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase">Phone</label>
                      {!patientProfile?.phone ? (
                        <input 
                          type="tel" 
                          value={editProfile.phone} 
                          onChange={e => setEditProfile({...editProfile, phone: e.target.value})}
                          className="w-full text-sm font-semibold text-sky-700 bg-white border border-sky-200 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-sky-400"
                          placeholder="+92..."
                        />
                      ) : (
                        <p className="text-sm font-semibold text-gray-800">{patientProfile.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  {!patientProfile?.age && (
                    <div className="mt-3 flex items-center gap-1.5 text-[9px] text-sky-600 font-medium">
                      <IconDeviceFloppy size={10} />
                      <p>Agent will save these details permanently on booking.</p>
                    </div>
                  )}
                </div>

                {/* Symptoms Section */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Disease / Symptoms</label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none resize-none bg-gray-50 focus:bg-white text-gray-800 text-sm"
                    placeholder="Briefly describe symptoms..."
                  />
                  {!prefillDiagnosis && (
                    <InlineSymptomAnalyser currentSymptoms={symptoms} onResult={diag => setDiagnosisCtx(diag)} />
                  )}
                </div>

                {/* Selected Date */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Date</label>
                  <div className="flex flex-wrap gap-2">
                    {availableDates.map((date) => (
                      <button
                        key={date}
                        onClick={() => handleDateChange(date)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${selectedDate === date ? 'bg-sky-500 text-white border-sky-500 shadow' : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300'}`}
                      >
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Time */}
                {selectedDate && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Time Slot</label>
                    <div className="flex flex-wrap gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${selectedTime === slot ? 'bg-sky-500 text-white border-sky-500 shadow' : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300'}`}
                        >
                          {formatTime12(slot)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Terms */}
                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-sky-600 rounded border-gray-300 cursor-pointer"
                  />
                  <label className="text-xs text-gray-600 leading-relaxed cursor-pointer" onClick={() => setTermsAccepted((p) => !p)}>
                    <span className="font-bold text-gray-700">I confirm</span> that all provided data is accurate.
                  </label>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !termsAccepted || !selectedDate || !selectedTime || !symptoms.trim()}
                  className="w-full bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                >
                  {submitting ? (
                    <><IconLoader2 size={20} className="animate-spin" /> Finalizing Booking...</>
                  ) : (
                    <><IconRobot size={20} /> Confirm &amp; Send to Doctor</>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SmartBookingModal;

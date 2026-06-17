import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBell, IconHistory, IconBellRinging } from '@tabler/icons-react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

const SUPABASE_URL = 'https://xrqpszhccwafmscantvk.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycXBzemhjY3dhZm1zY2FudHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNDIyNDAsImV4cCI6MjA4ODkxODI0MH0.NZID4kac880DjiIghbqrD0VeBGcV8AvZMFWCLqj4BIw';

async function nativeFetch(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' }
  });
  if (!res.ok) { console.error('nativeFetch error:', res.status, path); return null; }
  return res.json();
}

async function nativePatch(path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(body)
  });
  return res.ok;
}

async function nativeInsert(path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'POST',
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(body)
  });
  return res.ok;
}

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState('notifications'); // 'notifications' | 'history'
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);
  const [apptById, setApptById] = useState({});
  const [confirmingId, setConfirmingId] = useState(null);
  const { user, role } = useAuth();
  const dropdownRef = useRef(null);

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

  const normalizeName = (value) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const safeParseAgentContext = (value) => {
    if (!value) return null;
    if (typeof value === 'object') return value;
    if (typeof value !== 'string') return null;
    try { return JSON.parse(value); } catch { return null; }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    if (!user || !role) return;
    try {
      if (role.toLowerCase() === 'patient') {
        // Patient ONLY sees booking_confirmed messages — never doctor's new_booking requests
        const data = await nativeFetch(
          `notifications?patient_id=eq.${user.id}&type=eq.booking_confirmed&select=*&order=created_at.desc`
        );
        if (data) setNotifications(data);

        // Also fetch full appointment history for the History tab
        const appts = await nativeFetch(
          `appointments?patient_id=eq.${user.id}&select=*&order=created_at.desc`
        );
        if (appts) setHistory(appts);

      } else if (role.toLowerCase() === 'doctor') {
        const profiles = await nativeFetch(`profiles?id=eq.${user.id}&select=name&limit=1`);
        const doctorName = profiles?.[0]?.name;
        console.log('NotificationDropdown: Doctor name =>', doctorName);
        if (!doctorName) return;

        const data = await nativeFetch(
          `notifications?type=eq.new_booking&is_read=eq.false&select=*&order=created_at.desc`
        );

        const filtered = (data || []).filter((n) => normalizeName(n?.doctor_name) === normalizeName(doctorName));
        setNotifications(filtered);
      }
    } catch (err) {
      console.error('fetchNotifications error:', err);
    }
  };

  useEffect(() => {
    if (!user || !role) return;
    fetchNotifications();

    let channel;
    const timer = setTimeout(() => {
      channel = supabase
        .channel(`notif-${user.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () => fetchNotifications())
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications' }, () => fetchNotifications())
        .subscribe();
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (channel) supabase.removeChannel(channel);
    };
  }, [user, role]);

  useEffect(() => {
    const isDoctor = role?.toLowerCase() === 'doctor';
    if (!isDoctor) return;
    if (!notifications?.length) return;

    let cancelled = false;

    const fetchMissingAppointments = async () => {
      const ids = notifications
        .filter((n) => n?.type === 'new_booking' && n?.appointment_id)
        .map((n) => n.appointment_id)
        .filter((id) => !apptById[id]);

      const unique = Array.from(new Set(ids));
      for (const id of unique) {
        const appts = await nativeFetch(`appointments?id=eq.${id}&select=*&limit=1`);
        const appt = appts?.[0];
        if (cancelled) return;
        if (appt) {
          setApptById((prev) => ({ ...prev, [id]: appt }));
        }
      }
    };

    fetchMissingAppointments();
    return () => { cancelled = true; };
  }, [notifications, role, apptById]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id) => {
    await nativePatch(`notifications?id=eq.${id}`, { is_read: true });
    fetchNotifications();
  };

  const confirmBooking = async (notif) => {
    try {
      if (confirmingId === notif.id) return;
      setConfirmingId(notif.id);

      const appts = await nativeFetch(`appointments?id=eq.${notif.appointment_id}&select=*&limit=1`);
      const appt = appts?.[0];
      if (!appt) return;

      // If appointment already confirmed, just mark this request read.
      if ((appt.status || '').toLowerCase() === 'confirmed') {
        await nativePatch(`notifications?id=eq.${notif.id}`, { is_read: true });
        fetchNotifications();
        return;
      }

      // Dedupe: only one booking_confirmed per appointment_id
      const existing = await nativeFetch(
        `notifications?patient_id=eq.${notif.patient_id}&type=eq.booking_confirmed&appointment_id=eq.${notif.appointment_id}&select=id&limit=1`
      );
      if (existing?.length) {
        await nativePatch(`appointments?id=eq.${appt.id}`, { status: 'confirmed' });
        await nativePatch(`notifications?id=eq.${notif.id}`, { is_read: true });
        fetchNotifications();
        return;
      }

      await nativePatch(`appointments?id=eq.${appt.id}`, { status: 'confirmed' });
      await nativePatch(`notifications?id=eq.${notif.id}`, { is_read: true });

      await nativeInsert('notifications', {
        patient_id: notif.patient_id,
        type: 'booking_confirmed',
        message: `Confirmed. Your appointment with ${appt.doctor_name} is scheduled for ${appt.date} at ${formatTime12(appt.time)}. Noted symptoms: "${appt.symptoms}".`,
        appointment_id: notif.appointment_id,
        is_read: false
      });

      fetchNotifications();
    } catch (err) {
      console.error('confirmBooking error:', err);
    } finally {
      setConfirmingId(null);
    }
  };

  const isPatient = role?.toLowerCase() === 'patient';
  const isDoctor = role?.toLowerCase() === 'doctor';

  const statusColor = { pending: 'bg-yellow-400', confirmed: 'bg-green-500', cancelled: 'bg-red-400' };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-sky-500 transition cursor-pointer flex items-center justify-center"
      >
        <IconBell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-sm border border-white"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-sky-100 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-50 to-white px-5 py-4 border-b border-sky-100 flex justify-between items-center">
              <h3 className="font-bold text-sky-950 text-lg">
                {isPatient ? 'My Health Updates' : 'Patient Requests'}
              </h3>
              {unreadCount > 0 ? (
                <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-bold">
                  {unreadCount} New
                </span>
              ) : (
                <span className="text-xs text-gray-400 font-medium">Up to date</span>
              )}
            </div>

            {/* Tab Switcher — only for Patients */}
            {isPatient && (
              <div className="flex border-b border-sky-50">
                <button
                  onClick={() => setTab('notifications')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors ${tab === 'notifications' ? 'text-sky-600 border-b-2 border-sky-500 bg-sky-50/50' : 'text-gray-400 hover:text-sky-400'}`}
                >
                  <IconBellRinging size={14} /> Notifications
                </button>
                <button
                  onClick={() => setTab('history')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors ${tab === 'history' ? 'text-sky-600 border-b-2 border-sky-500 bg-sky-50/50' : 'text-gray-400 hover:text-sky-400'}`}
                >
                  <IconHistory size={14} /> Booking History
                </button>
              </div>
            )}

            <div className="max-h-[420px] overflow-y-auto w-full">
              {/* NOTIFICATIONS TAB */}
              {(tab === 'notifications' || isDoctor) && (
                <>
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <IconBell size={40} className="text-sky-200 mb-3" />
                      <p className="text-gray-500 font-medium text-sm">No new notifications.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-sky-50">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`p-5 transition-colors ${notif.is_read ? 'bg-white' : 'bg-sky-50/40'}`}>
                          <div className="flex items-start gap-3">
                            <div className="pt-1.5 flex-shrink-0">
                              <div className={`w-2 h-2 rounded-full ${notif.is_read ? 'bg-gray-300' : 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]'}`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              {isDoctor && notif.type === 'new_booking' ? (
                                (() => {
                                  const appt = apptById[notif.appointment_id];
                                  const ctx = safeParseAgentContext(appt?.agent_context);
                                  const diseaseLabel = ctx?.diseaseLabel || ctx?.biobert_label || null;
                                  return (
                                    <div className="rounded-2xl border border-sky-100 bg-white px-4 py-3">
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            New appointment request
                                          </p>
                                          <p className="mt-1 text-base font-extrabold text-slate-900 truncate">
                                            {appt?.patient_name || 'Patient'}
                                          </p>
                                          <p className="mt-0.5 text-xs text-slate-600">
                                            {appt?.patient_age ? `${appt.patient_age} yr` : 'Age —'}{appt?.patient_gender ? ` · ${appt.patient_gender}` : ''}{appt?.patient_phone ? ` · ${appt.patient_phone}` : ''}
                                          </p>
                                          {appt?.patient_email && (
                                            <p className="mt-0.5 text-xs text-slate-600 truncate">
                                              {appt.patient_email}
                                            </p>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Time</p>
                                          <p className="mt-1 text-sm font-bold text-slate-900">
                                            {appt?.date ? `${appt.date}` : '—'}
                                          </p>
                                          <p className="text-sm font-bold text-slate-900">
                                            {appt?.time ? formatTime12(appt.time) : '—'}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="mt-3 grid grid-cols-1 gap-2">
                                        {diseaseLabel && (
                                          <div className="text-xs font-semibold text-slate-700">
                                            Possible condition: <span className="font-extrabold text-slate-900">{diseaseLabel}</span>
                                          </div>
                                        )}
                                        <div className={`text-sm leading-relaxed ${notif.is_read ? 'text-slate-500' : 'text-slate-700'}`}>
                                          {appt?.symptoms ? `"${appt.symptoms}"` : (notif.message || 'No details provided.')}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()
                              ) : (
                                <p className={`text-sm leading-relaxed break-words ${notif.is_read ? 'text-gray-500' : 'text-sky-950 font-medium'}`}>
                                  {notif.message}
                                </p>
                              )}
                              {!notif.is_read && isDoctor && notif.type === 'new_booking' && (
                                <button
                                  onClick={() => confirmBooking(notif)}
                                  disabled={confirmingId === notif.id}
                                  className="mt-3 w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                  Confirm Appointment
                                </button>
                              )}
                              {!notif.is_read && isPatient && (
                                <button onClick={() => markAsRead(notif.id)} className="mt-2 text-xs text-sky-400 hover:text-sky-600 font-bold cursor-pointer">
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* HISTORY TAB — Patients only */}
              {tab === 'history' && isPatient && (
                <>
                  {history.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <IconHistory size={40} className="text-sky-200 mb-3" />
                      <p className="text-gray-500 font-medium text-sm">No appointment history yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-sky-50">
                      {history.map(appt => (
                        <div key={appt.id} className="p-4 hover:bg-sky-50/30 transition-colors">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <p className="text-sm font-bold text-sky-900">{appt.doctor_name}</p>
                            <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full capitalize ${statusColor[appt.status] || 'bg-gray-400'}`}>
                              {appt.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{appt.date} at {formatTime12(appt.time)}</p>
                          <p className="text-xs text-gray-400 mt-0.5 italic truncate">"{appt.symptoms}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;

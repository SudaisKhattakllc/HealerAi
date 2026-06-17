/**
 * AGENT 2: ScheduleAgent
 * ─────────────────────────────────────────────────────────────────────
 * Reads the doctor's duty_hours and existing confirmed appointments.
 * Returns a list of AVAILABLE time slots for a specific doctor on a date.
 * Used to present the patient with 1-click booking slots instead of
 * making them manually type a date and time.
 *
 * FUTURE: When real Office Hours are provided, this agent will match
 * doctor duty shifts precisely and block already-booked time slots.
 */

const SUPABASE_URL = 'https://xrqpszhccwafmscantvk.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycXBzemhjY3dhZm1zY2FudHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNDIyNDAsImV4cCI6MjA4ODkxODI0MH0.NZID4kac880DjiIghbqrD0VeBGcV8AvZMFWCLqj4BIw';

// Default working hours: 9 AM - 5 PM, 1-hour slots
const DEFAULT_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

/**
 * @param {string} doctorId - ID from the doctors table (e.g. 'doc-01')
 * @param {string} date - Date string in YYYY-MM-DD format
 * @returns {Promise<{ doctorName: string, dutyHours: string, availableSlots: string[], bookedSlots: string[] }>}
 */
export async function ScheduleAgent(doctorId, date) {
  if (!doctorId || !date) {
    console.warn('[ScheduleAgent] Missing doctorId or date.');
    return { availableSlots: DEFAULT_SLOTS, bookedSlots: [], dutyHours: 'Mon-Fri, 9 AM - 5 PM', doctorName: '' };
  }

  try {
    console.log(`[ScheduleAgent] Checking schedule for doctor: ${doctorId} on ${date}`);

    // 1. Fetch doctor's duty hours from doctors table
    const docRes = await fetch(
      `${SUPABASE_URL}/rest/v1/doctors?id=eq.${doctorId}&select=name,duty_hours,availability&limit=1`,
      { headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } }
    );
    const docData = await docRes.json();
    const doctor = docData?.[0];
    const dutyHours = doctor?.duty_hours || doctor?.availability || 'Mon-Fri, 9 AM - 5 PM';
    const doctorName = doctor?.name || '';

    // 2. Fetch already booked (confirmed/pending) appointment times for this doctor on this date
    const bookedRes = await fetch(
      `${SUPABASE_URL}/rest/v1/appointments?doctor_id=eq.${doctorId}&date=eq.${date}&status=neq.cancelled&select=time`,
      { headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } }
    );
    const bookedData = await bookedRes.json();
    const bookedSlots = bookedData?.map(a => a.time?.substring(0, 5)) ?? [];

    // 3. Filter available slots
    const availableSlots = DEFAULT_SLOTS.filter(slot => !bookedSlots.includes(slot));

    console.log(`[ScheduleAgent] Doctor: ${doctorName} | Duty: ${dutyHours}`);
    console.log(`[ScheduleAgent] Booked: ${bookedSlots.join(', ')} | Available: ${availableSlots.join(', ')}`);

    return { doctorName, dutyHours, availableSlots, bookedSlots };
  } catch (err) {
    console.error('[ScheduleAgent]  Error:', err);
    return { availableSlots: DEFAULT_SLOTS, bookedSlots: [], dutyHours: 'Mon-Fri, 9 AM - 5 PM', doctorName: '' };
  }
}

/**
 * Helper: Get the next 7 available days based on doctor's duty schedule text.
 * "Mon-Fri" → skips weekends automatically.
 * @param {string} dutyHoursText
 * @returns {string[]} Array of date strings YYYY-MM-DD
 */
export function getAvailableDates(dutyHoursText = '') {
  const text = dutyHoursText.toLowerCase();
  const worksWeekend = text.includes('sat') || text.includes('sun') || text.includes('weekends');
  const dates = [];
  const today = new Date();

  for (let i = 1; dates.length < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const day = d.getDay(); // 0=Sun, 6=Sat
    if (!worksWeekend && (day === 0 || day === 6)) continue;
    dates.push(d.toISOString().split('T')[0]);
  }

  return dates;
}

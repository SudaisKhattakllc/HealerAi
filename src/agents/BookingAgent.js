/**
 * AGENT 3: BookingAgent
 * ─────────────────────────────────────────────────────────────────────
 * The orchestration agent. Combines patient profile data from
 * PatientDataAgent + available slots from ScheduleAgent and sends the
 * booking automatically to the doctor's notification bell.
 *
 * This is the key automation agent that eliminates the entire manual
 * booking form. Patient only confirms — Agent does the rest.
 *
 * CHAIN:
 *   PatientDataAgent(userId) → patientProfile
 *   ScheduleAgent(doctorId, date) → availableSlots
 *   BookingAgent.autoBook(userId, doctor, date, time, symptoms)
 *        → inserts appointment + notification to doctor
 */

const SUPABASE_URL = 'https://xrqpszhccwafmscantvk.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycXBzemhjY3dhZm1zY2FudHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNDIyNDAsImV4cCI6MjA4ODkxODI0MH0.NZID4kac880DjiIghbqrD0VeBGcV8AvZMFWCLqj4BIw';
import { PatientDataAgent } from './PatientDataAgent';

async function nativeInsert(table, body) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errText = await res.text();
      let errorDetail;
      try {
        const errJson = JSON.parse(errText);
        errorDetail = errJson.message || errJson.hint || errText;
      } catch (e) {
        errorDetail = errText;
      }
      console.error(`[BookingAgent] Insert to ${table} failed:`, errorDetail);
      throw new Error(`Supabase Error: ${errorDetail}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (err) {
    console.error(`[BookingAgent] Connection error during insert to ${table}:`, err.message);
    throw err;
  }
}

/**
 * Auto-books an appointment using patient profile data.
 * No manual form filling required.
 *
 * @param {string} userId - Logged-in patient's Supabase UUID
 * @param {object} doctor - Doctor object from doctors table { id, name, specialty }
 * @param {string} date - Selected date (YYYY-MM-DD)
 * @param {string} time - Selected time slot (HH:MM)
 * @param {string} symptoms - From BIOBERT DiagnosisAgent or short patient input
 * @param {object|null} agentContext - Optional BIOBERT metadata { biobert_label, confidence, keywords }
 * @returns {Promise<{ success: boolean, appointment: object|null, error: string|null }>}
 */
export async function BookingAgent(userId, doctor, date, time, symptoms, agentContext = null) {
  console.log('[BookingAgent] Starting automated booking...');

  // Step 1: Retrieve patient profile automatically
  const patient = await PatientDataAgent(userId);
  if (!patient) {
    return { success: false, appointment: null, error: 'Could not fetch patient profile. Please ensure you are logged in.' };
  }
  console.log('[BookingAgent] Patient profile:', patient.name, patient.age, patient.gender);

  // Step 2: Create the appointment record
  const appointmentPayload = {
    patient_id: userId,
    patient_name: patient.name,
    patient_age: patient.age,
    patient_gender: patient.gender,
    patient_phone: patient.phone,
    patient_email: patient.email, // Now added to table
    symptoms: symptoms,
    doctor_id: doctor.id,
    doctor_name: doctor.name,
    date: date,
    time: time,
    status: 'pending',
    // Agent context for future BIOBERT traceability
    agent_context: agentContext ? JSON.stringify(agentContext) : null
  };

  const appointment = await nativeInsert('appointments', appointmentPayload);
  if (!appointment) {
    return { success: false, appointment: null, error: 'Failed to create appointment in database.' };
  }
  console.log('[BookingAgent] Appointment created:', appointment.id);

  // Step 3: Send notification to the doctor's bell
  const message = `New request from ${patient.name} (${patient.age || '?'} yr, ${patient.gender || '?'}).` +
    ` Symptoms: "${symptoms}". Requested: ${date} at ${time}.`;

  const notification = await nativeInsert('notifications', {
    patient_id: userId,
    doctor_name: doctor.name,
    type: 'new_booking',
    message: message,
    appointment_id: appointment.id,
    is_read: false
  });

  if (!notification) {
    console.warn('[BookingAgent] Appointment created but notification failed to send.');
  } else {
    console.log('[BookingAgent] Notification sent to doctor:', doctor.name);
  }

  return { success: true, appointment, error: null };
}

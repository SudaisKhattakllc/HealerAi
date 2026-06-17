/**
 * AGENT 1: PatientDataAgent
 * ─────────────────────────────────────────────────────────────────────
 * Retrieves a patient's full profile from Supabase using their User ID.
 * This is the data collected at registration (name, age, gender, phone).
 * Used by BookingAgent to auto-fill the booking form without manual input.
 */

const SUPABASE_URL = 'https://xrqpszhccwafmscantvk.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycXBzemhjY3dhZm1zY2FudHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNDIyNDAsImV4cCI6MjA4ODkxODI0MH0.NZID4kac880DjiIghbqrD0VeBGcV8AvZMFWCLqj4BIw';

/**
 * @param {string} userId - Supabase Auth User UUID
 * @returns {Promise<{name, age, gender, phone, email, role} | null>}
 */
export async function PatientDataAgent(userId) {
  if (!userId) {
    console.warn('[PatientDataAgent] No userId provided.');
    return null;
  }

  try {
    console.log(`[PatientDataAgent] Fetching profile for user: ${userId}`);

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=name,age,gender,phone,email,role&limit=1`,
      {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      console.error('[PatientDataAgent] HTTP error:', res.status);
      return null;
    }

    const data = await res.json();
    const profile = data?.[0] ?? null;

    if (profile) {
      console.log('[PatientDataAgent] Profile retrieved:', profile);
    } else {
      console.warn('[PatientDataAgent] No profile found for user.');
    }

    return profile;
  } catch (err) {
    console.error('[PatientDataAgent] Unexpected error:', err);
    return null;
  }
}

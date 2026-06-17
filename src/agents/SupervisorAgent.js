/**
 * SUPERVISOR AGENT — Supervisor
 * ─────────────────────────────────────────────────────────────────────
 * Acts as the central orchestrator for all sub-agents.
 * Responsibilities:
 *   • Retries failed agent calls (up to MAX_RETRIES times)
 *   • Enforces timeouts so UI never freezes
 *   • Collects and broadcasts patient-facing error notifications
 *   • Logs every agent lifecycle event for debugging
 *
 * USAGE (replace direct agent calls with this):
 *   const patient = await Supervisor.run('PatientDataAgent', PatientDataAgent, [userId]);
 *   const slots   = await Supervisor.run('ScheduleAgent',    ScheduleAgent,    [doctorId, date]);
 *   const result  = await Supervisor.run('BookingAgent',     BookingAgent,     [userId, doctor, date, time, symptoms]);
 *
 * The Supervisor will:
 *   → Retry on failure (default 3 attempts)
 *   → Call your onNotify callback with human-readable status messages
 *   → Return null on total failure so callers can handle gracefully
 */

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1200; // wait 1.2 s between retries
const DEFAULT_TIMEOUT_MS = 12000; // 12 s max per agent call

// ─────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────

/** Pause for `ms` milliseconds */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Wraps a promise with a hard timeout */
function withTimeout(promise, ms, agentName) {
  const timer = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`[Supervisor] ${agentName} timed out after ${ms / 1000}s`)), ms)
  );
  return Promise.race([promise, timer]);
}

// ─────────────────────────────────────────────────────────────────────
// Friendly error messages shown to the patient
// ─────────────────────────────────────────────────────────────────────
const FRIENDLY_ERRORS = {
  PatientDataAgent:  'Could not load your profile. Please check your internet connection and try again.',
  ScheduleAgent:     'Failed to load available appointment slots. Please try selecting a different date.',
  BookingAgent:      'Your appointment could not be booked. Please try again or contact support.',
  DiagnosisAgent:    'Symptom analysis is temporarily unavailable. You can still book manually.',
  default:           'Something went wrong. Please refresh the page and try again.',
};

// ─────────────────────────────────────────────────────────────────────
// Supervisor state (simple in-memory log, readable by the UI)
// ─────────────────────────────────────────────────────────────────────
const _log = [];
let _notifyCallback = null; // UI registers this to receive live messages

/**
 * Register a callback that the Supervisor calls whenever it has news.
 * Your UI component calls this once on mount:
 *   Supervisor.onNotify((msg) => setToastMessage(msg));
 *
 * @param {(message: { type: 'info'|'warning'|'error'|'success', text: string, agent: string }) => void} cb
 */
export function onNotify(cb) {
  _notifyCallback = cb;
}

function _emit(type, agent, text) {
  const entry = { type, agent, text, timestamp: new Date().toISOString() };
  _log.push(entry);
  console.log(`[Supervisor][${type.toUpperCase()}] ${agent}: ${text}`);
  if (_notifyCallback) _notifyCallback(entry);
}

/** Returns the full supervisor log (for debug panels) */
export function getSupervisorLog() {
  return [..._log];
}

// ─────────────────────────────────────────────────────────────────────
// Core: run an agent with retry + timeout
// ─────────────────────────────────────────────────────────────────────

/**
 * Run any agent function under Supervisor control.
 *
 * @param {string}   agentName  - Human-readable name, e.g. 'BookingAgent'
 * @param {Function} agentFn    - The async agent function to call
 * @param {Array}    args       - Arguments to pass to the agent
 * @param {object}   [options]
 * @param {number}   [options.retries=MAX_RETRIES]        - Max retry attempts
 * @param {number}   [options.timeoutMs=DEFAULT_TIMEOUT_MS] - Per-attempt timeout
 * @returns {Promise<any|null>} - Agent result, or null on total failure
 */
export async function run(agentName, agentFn, args = [], options = {}) {
  const retries   = options.retries   ?? MAX_RETRIES;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  _emit('info', agentName, `▶ Starting (max ${retries} attempts)…`);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      _emit('info', agentName, `Attempt ${attempt}/${retries}…`);

      const result = await withTimeout(agentFn(...args), timeoutMs, agentName);

      // Some agents return { success: false } instead of throwing
      if (result && typeof result === 'object' && result.success === false) {
        throw new Error(result.error || 'Agent returned success=false');
      }

      _emit('success', agentName, `Completed on attempt ${attempt}.`);
      return result;

    } catch (err) {
      const isLast = attempt === retries;
      _emit(
        isLast ? 'error' : 'warning',
        agentName,
        `${isLast ? 'Failed' : 'Retrying'} attempt ${attempt}: ${err.message}`
      );

      if (!isLast) {
        _emit('info', agentName, `Retrying in ${RETRY_DELAY_MS / 1000}s…`);
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  // All retries exhausted — emit patient-facing error
  const friendlyMsg = FRIENDLY_ERRORS[agentName] || FRIENDLY_ERRORS.default;
  _emit('error', agentName, friendlyMsg);
  return null;
}

// ─────────────────────────────────────────────────────────────────────
// Convenience: Full automated booking pipeline
// ─────────────────────────────────────────────────────────────────────

/**
 * Runs the full booking pipeline under Supervisor control:
 *   PatientDataAgent → ScheduleAgent (optional) → BookingAgent
 *
 * @param {object} params
 * @param {string} params.userId
 * @param {object} params.doctor      - { id, name, specialty }
 * @param {string} params.date        - YYYY-MM-DD
 * @param {string} params.time        - HH:MM
 * @param {string} params.symptoms
 * @param {object} [params.agentContext] - BioBERT metadata
 * @returns {Promise<{ success: boolean, appointment: object|null, error: string|null }>}
 */
export async function runBookingPipeline({ userId, doctor, date, time, symptoms, agentContext = null }) {
  const { PatientDataAgent } = await import('./PatientDataAgent');
  const { BookingAgent }     = await import('./BookingAgent');

  try {
    // Step 1: Patient profile
    const patient = await run('PatientDataAgent', PatientDataAgent, [userId]);
    if (!patient) {
      throw new Error(FRIENDLY_ERRORS.PatientDataAgent);
    }

    // Step 2: Book appointment
    const result = await run('BookingAgent', BookingAgent, [userId, doctor, date, time, symptoms, agentContext]);
    if (!result) {
      throw new Error(FRIENDLY_ERRORS.BookingAgent);
    }

    _emit('success', 'Supervisor', 'Booking pipeline completed successfully.');
    return result;
  } catch (err) {
    _emit('error', 'Supervisor', `Booking Pipeline failed: ${err.message}`);
    return { success: false, appointment: null, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────────────
// Convenience: Diagnosis + Doctor suggestion pipeline
// ─────────────────────────────────────────────────────────────────────

/**
 * Runs symptom diagnosis under Supervisor control.
 * Optionally calls BioBERT first, falls back to keyword matching.
 *
 * @param {string} symptomText
 * @param {string|null} biobertEndpoint - Your BioBERT API URL (or null to skip)
 * @returns {Promise<object|null>} DiagnosisAgent result
 */
export async function runDiagnosis(symptomText, biobertEndpoint = null) {
  const { DiagnosisAgent } = await import('./DiagnosisAgent');
  _emit('info', 'Supervisor', `Running diagnosis on: "${symptomText.slice(0, 60)}"`);

  const result = await run('DiagnosisAgent', DiagnosisAgent, [symptomText, biobertEndpoint], {
    retries: 2, // fewer retries for diagnosis (non-blocking)
    timeoutMs: 10000,
  });

  if (!result || !result.specialty) {
    _emit('warning', 'Supervisor', 'No specialty identified — patient can still book manually.');
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────
// Export default for convenience
// ─────────────────────────────────────────────────────────────────────
const Supervisor = { run, runBookingPipeline, runDiagnosis, onNotify, getSupervisorLog };
export default Supervisor;

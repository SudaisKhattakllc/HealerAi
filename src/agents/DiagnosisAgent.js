/**
 * AGENT 4: DiagnosisAgent (BioBERT-ready)
 * ─────────────────────────────────────────────────────────────────────
 * Analyzes patient-entered symptom text and predicts the medical specialty.
 *
 * MODES (automatic, in priority order):
 *   1. BioBERT API call  — if `biobertEndpoint` is provided
 *   2. Keyword Matching  — instant offline fallback (always works)
 *
 * OUTPUT: {
 *   specialty, specialtyId, confidence, keywords, source,
 *   biobert_label?, biobert_score?, biobert_model?
 * }
 * → specialty feeds into SuggestAgent to filter relevant doctors
 * → source tells BookingAgent where the diagnosis came from
 */

// ─────────────────────────────────────────────────────────────────────
// Symptom → Specialty keyword map
// When BioBERT is active this is the fallback only
// ─────────────────────────────────────────────────────────────────────
const SYMPTOM_MAP = [
  { keywords: ['headache', 'migraine', 'seizure', 'stroke', 'paralysis', 'numbness', 'dizziness', 'tremor', 'parkinson'], specialty: 'Neurology',        specialtyId: 'neurology' },
  { keywords: ['chest pain', 'heart', 'palpitation', 'shortness of breath', 'blood pressure', 'cardiac', 'arrhythmia', 'cholesterol'], specialty: 'Cardiology', specialtyId: 'cardiology' },
  { keywords: ['bone', 'joint', 'fracture', 'arthritis', 'knee', 'back pain', 'spine', 'shoulder', 'hip', 'tendon'], specialty: 'Orthopedics', specialtyId: 'orthopedics' },
  { keywords: ['brain surgery', 'spinal cord', 'disc', 'herniated', 'neurosurgery', 'tumor brain'], specialty: 'Neurosurgery', specialtyId: 'neurosurgery' },
  { keywords: ['eye', 'vision', 'cataract', 'glaucoma', 'retina', 'lasik', 'blind', 'pupil'], specialty: 'Ophthalmology', specialtyId: 'ophthalmology' },
  { keywords: ['skin', 'cosmetic', 'plastic', 'rhinoplasty', 'liposuction', 'botox', 'scar'], specialty: 'Cosmetic Surgery', specialtyId: 'cosmetic' },
  { keywords: ['tooth', 'teeth', 'dental', 'gum', 'cavity', 'braces', 'molar', 'root canal', 'orthodontic'], specialty: 'Dentistry', specialtyId: 'dentistry' },
  { keywords: ['anesthesia', 'sedation', 'pain management', 'chronic pain', 'nerve block'], specialty: 'Anesthesiology', specialtyId: 'anesthesia' },
  { keywords: ['lung', 'cough', 'asthma', 'breathing', 'copd', 'pneumonia', 'respiratory', 'bronchitis', 'wheezing'], specialty: 'Pulmonology', specialtyId: 'pulmonology' },
  { keywords: ['liver', 'hepatitis', 'cirrhosis', 'jaundice', 'fatty liver', 'bilirubin'], specialty: 'Hepatology', specialtyId: 'hepatology' },
  { keywords: ['ear', 'nose', 'throat', 'tonsil', 'sinus', 'hearing loss', 'ent', 'nasal', 'snoring'], specialty: 'ENT', specialtyId: 'ent' },
  { keywords: ['kidney', 'renal', 'dialysis', 'nephrology', 'proteinuria', 'creatinine', 'uremia'], specialty: 'Nephrology', specialtyId: 'nephrology' },
  { keywords: ['stomach', 'gastric', 'digestion', 'acid reflux', 'ibs', 'crohn', 'ulcer', 'endoscopy', 'colonoscopy'], specialty: 'Gastroenterology', specialtyId: 'gastroenterology' },
  { keywords: ['urinary', 'prostate', 'bladder', 'kidney stone', 'uti', 'urology', 'ureter', 'incontinence'], specialty: 'Urology', specialtyId: 'urology' },
  { keywords: ['pancreas', 'diabetes', 'insulin', 'glucose', 'endocrine', 'thyroid', 'hormone'], specialty: 'Pancreatology', specialtyId: 'pancreas' },
  { keywords: ['child', 'infant', 'baby', 'pediatric', 'newborn', 'toddler', 'vaccination', 'growth'], specialty: 'Pediatrics', specialtyId: 'pediatrics' },
];

// ─────────────────────────────────────────────────────────────────────
// BioBERT label → our specialtyId mapping
// Extend this as your model's output labels become known
// ─────────────────────────────────────────────────────────────────────
const BIOBERT_LABEL_MAP = {
  'Cardiovascular Diseases':  { specialty: 'Cardiology',       specialtyId: 'cardiology' },
  'Neurological Disorders':   { specialty: 'Neurology',        specialtyId: 'neurology' },
  'Respiratory Diseases':     { specialty: 'Pulmonology',      specialtyId: 'pulmonology' },
  'Gastrointestinal Disorders': { specialty: 'Gastroenterology', specialtyId: 'gastroenterology' },
  'Musculoskeletal Disorders':{ specialty: 'Orthopedics',      specialtyId: 'orthopedics' },
  'Endocrine Disorders':      { specialty: 'Pancreatology',    specialtyId: 'pancreas' },
  'Renal/Urological Disorders': { specialty: 'Nephrology',     specialtyId: 'nephrology' },
  'Pediatric Conditions':     { specialty: 'Pediatrics',       specialtyId: 'pediatrics' },
  'Ophthalmological Disorders': { specialty: 'Ophthalmology',  specialtyId: 'ophthalmology' },
  'ENT Disorders':            { specialty: 'ENT',              specialtyId: 'ent' },
  // add more as you discover your model's actual label strings
};

// ─────────────────────────────────────────────────────────────────────
// Internal: Keyword-matching fallback
// ─────────────────────────────────────────────────────────────────────
function _keywordMatch(symptomText) {
  const lower = symptomText.toLowerCase();
  const scores = [];

  for (const entry of SYMPTOM_MAP) {
    const matched = entry.keywords.filter((kw) => lower.includes(kw));
    if (matched.length > 0) {
      scores.push({ ...entry, score: matched.length, matchedKeywords: matched });
    }
  }

  if (scores.length === 0) return null;

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];
  const confidence = Math.min(0.5 + best.score * 0.15, 0.99);

  return {
    specialty: best.specialty,
    specialtyId: best.specialtyId,
    confidence: parseFloat(confidence.toFixed(2)),
    keywords: best.matchedKeywords,
    source: 'keyword_matching',
  };
}

// ─────────────────────────────────────────────────────────────────────
// Internal: Real BioBERT API call
// ─────────────────────────────────────────────────────────────────────
async function _callBioBERT(symptomText, endpoint) {
  console.log('[DiagnosisAgent] Calling BioBERT at:', endpoint);

  // POST to your FastAPI / HuggingFace Inference Endpoint
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: symptomText }),
  });

  if (!res.ok) {
    throw new Error(`BioBERT HTTP ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();

  // HuggingFace Inference API returns: [[{ label, score }, ...]]
  // Adjust the path below if your custom model returns differently
  const topResult = Array.isArray(data[0]) ? data[0][0] : data[0];
  if (!topResult?.label) throw new Error('BioBERT returned no label');

  const labelMap = BIOBERT_LABEL_MAP[topResult.label];
  return {
    specialty:      labelMap?.specialty   ?? topResult.label,
    specialtyId:    labelMap?.specialtyId ?? topResult.label.toLowerCase(),
    confidence:     parseFloat((topResult.score ?? 0.8).toFixed(2)),
    keywords:       [],             // BioBERT doesn't return keywords
    source:         'biobert',
    biobert_label:  topResult.label,
    biobert_score:  topResult.score,
    biobert_model:  'BioBERT (custom)',
  };
}

// ─────────────────────────────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────────────────────────────

/**
 * Analyzes symptoms and returns a specialty prediction.
 * Automatically uses BioBERT if endpoint is provided; falls back to keywords.
 *
 * @param {string}      symptomText      - Free-text symptom description
 * @param {string|null} biobertEndpoint  - Your BioBERT API URL, or null
 * @returns {Promise<{
 *   specialty: string|null,
 *   specialtyId: string|null,
 *   confidence: number,
 *   keywords: string[],
 *   source: 'biobert'|'keyword_matching'|'keyword_fallback'|'none',
 *   biobert_label?: string,
 *   biobert_score?: number
 * }>}
 */
export async function DiagnosisAgent(symptomText, biobertEndpoint = null) {
  if (!symptomText || symptomText.trim().length < 3) {
    return { specialty: null, specialtyId: null, confidence: 0, keywords: [], source: 'none' };
  }

  // ── Mode 1: Try BioBERT ──────────────────────────────────────────
  if (biobertEndpoint) {
    try {
      const result = await _callBioBERT(symptomText, biobertEndpoint);
      console.log(`[DiagnosisAgent] BioBERT -> ${result.specialty} (${(result.confidence * 100).toFixed(0)}%)`);
      return result;
    } catch (err) {
      console.warn('[DiagnosisAgent] BioBERT failed, falling back to keyword matching:', err.message);
    }
  }

  // ── Mode 2: Keyword fallback ─────────────────────────────────────
  const kwResult = _keywordMatch(symptomText);
  if (!kwResult) {
    console.log('[DiagnosisAgent] No specialty matched for:', symptomText);
    return { specialty: null, specialtyId: null, confidence: 0, keywords: [], source: 'keyword_fallback' };
  }

  console.log(`[DiagnosisAgent] Keyword -> ${kwResult.specialty} (${(kwResult.confidence * 100).toFixed(0)}%) | ${kwResult.keywords.join(', ')}`);
  return kwResult;
}

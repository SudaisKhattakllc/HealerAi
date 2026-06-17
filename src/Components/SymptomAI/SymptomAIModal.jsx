import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconX, IconLoader2, IconArrowRight, IconStethoscope } from '@tabler/icons-react';
import Supervisor from '../../agents/SupervisorAgent';

function scoreSpecialty({ diseaseLabel = '', symptomsText = '' }) {
  const text = `${diseaseLabel} ${symptomsText}`.toLowerCase();

  const rules = [
    {
      id: 'cardiology',
      keywords: [
        'cardio','heart','myocard','arrhythm','hypertension','angina','ischemia','infarction','mi ','heart failure','cardiac','palpitation','tachy','brady',
        'chest pain','chest tight','shortness of breath','sob','blood pressure','cholesterol'
      ],
    },
    {
      id: 'gastroenterology',
      keywords: [
        'gastro','gerd','reflux','heartburn','ulcer','ibs','ibd','crohn','colitis','diarrhea','constipation','nausea','vomit','abdominal','stomach',
        'hepat','liver','jaundice','cirrhosis'
      ],
    },
    {
      id: 'pulmonology',
      keywords: [
        'pulmo','lung','respir','copd','asthma','pneumonia','bronch','wheez','cough','breath','shortness of breath','dyspnea'
      ],
    },
    {
      id: 'neurology',
      keywords: [
        'neuro','stroke','migraine','headache','seiz','epilep','parkinson','tremor','dizziness','numb','tingl','weakness','nerve','neuropathy'
      ],
    },
    {
      id: 'orthopedics',
      keywords: [
        'ortho','fracture','arthritis','joint','knee','hip','shoulder','back pain','spine','bone','musculo','sprain','tendon'
      ],
    },
    {
      id: 'ophthalmology',
      keywords: [
        'ophthal','eye','vision','cataract','glaucoma','retina','blur','blind','conjunct','dry eye'
      ],
    },
    {
      id: 'ent',
      keywords: [
        'ent','sinus','tonsil','throat','ear','hearing','nasal','nose','snor','laryng','otitis'
      ],
    },
    {
      id: 'nephrology',
      keywords: [
        'nephro','renal','kidney','dialysis','creatinine','proteinuria','uremia'
      ],
    },
    {
      id: 'urology',
      keywords: [
        'urolog','uti','urinary','bladder','prostate','ureter','stone','kidney stone','incontinence'
      ],
    },
    {
      id: 'hepatology',
      keywords: [
        'hepat','liver','hepatitis','cirrhosis','jaundice','bilirubin','fatty liver'
      ],
    },
    {
      id: 'pediatrics',
      keywords: [
        'pediatric','child','newborn','infant','toddler'
      ],
    },
    {
      id: 'dentistry',
      keywords: [
        'dental','tooth','teeth','gum','cavity','braces','root canal'
      ],
    },
    {
      id: 'anesthesia',
      keywords: [
        'anesthesia','anaesthesia','sedation','pain management','nerve block'
      ],
    },
    {
      id: 'cosmetic',
      keywords: [
        'cosmetic','plastic','rhinoplasty','liposuction','botox','scar','aesthetic'
      ],
    },
    {
      id: 'pancreas',
      keywords: [
        'pancrea','diabetes','insulin','glucose','endocrine','hormone'
      ],
    },
  ];

  const scored = rules.map((r) => ({
    id: r.id,
    score: r.keywords.reduce((s, kw) => (text.includes(kw) ? s + 1 : s), 0),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}

export default function SymptomAIModal({ isOpen, onClose, onContinue }) {
  const [symptoms, setSymptoms] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // { diseaseLabel, confidence, model }

  const examples = useMemo(() => ([
    'Chest tightness with shortness of breath and palpitations',
    'Persistent heartburn and nausea after meals',
    'Dry cough with wheezing and difficulty breathing',
  ]), []);

  const handleDiagnose = async () => {
    const text = symptoms.trim();
    if (text.length < 3) return;
    setSubmitting(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Diagnosis failed.');

      setResult({
        diseaseLabel: data?.diseaseLabel || 'Unknown',
        confidence: typeof data?.confidence === 'number' ? data.confidence : null,
        model: data?.model || null,
      });
    } catch (e) {
      setError(e?.message || 'Diagnosis failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = async () => {
    if (!result?.diseaseLabel) return;
    const best = scoreSpecialty({ diseaseLabel: result.diseaseLabel, symptomsText: symptoms.trim() });
    let specialtyId = best?.score >= 1 ? best.id : null;

    // Tight fallback: use our in-app diagnosis keyword engine if mapping is uncertain
    if (!specialtyId) {
      const diag = await Supervisor.runDiagnosis(symptoms.trim(), null);
      if (diag?.specialtyId) specialtyId = diag.specialtyId;
    }

    onContinue?.({
      symptoms: symptoms.trim(),
      diseaseLabel: result.diseaseLabel,
      confidence: result.confidence,
      specialtyId,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.();
          }}
        >
          <motion.div
            initial={{ y: 18, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-2xl"
          >
            <div className="relative rounded-3xl border border-white/50 bg-white/70 backdrop-blur-2xl shadow-[0_20px_80px_rgba(15,23,42,0.25)] overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-br from-sky-200/60 via-white/20 to-sky-300/60 blur-2xl opacity-70 pointer-events-none" />

              <div className="relative p-6 sm:p-7">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-white/60 transition cursor-pointer"
                  aria-label="Close"
                >
                  <IconX size={18} />
                </button>

                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
                    <IconStethoscope size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      Symptom analysis
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Describe your symptoms in one or two sentences. Then continue to find specialists.
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                    Symptoms
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={4}
                    placeholder="Example: chest pain while walking, shortness of breath, dizziness"
                    className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    {examples.map((ex) => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => setSymptoms(ex)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200/80 bg-white/60 hover:bg-white/90 text-slate-700 transition cursor-pointer"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                )}

                {result && (
                  <div className="mt-4 rounded-3xl border border-sky-100 bg-white/70 px-5 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Result</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">{result.diseaseLabel}</p>
                      </div>
                      <div className="text-sm text-slate-600 font-semibold">
                        {typeof result.confidence === 'number' ? `Confidence: ${Math.round(result.confidence * 100)}%` : 'Confidence: —'}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleDiagnose}
                    disabled={submitting || symptoms.trim().length < 3}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white font-bold py-3.5 px-4 shadow-sm hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <IconLoader2 size={18} className="animate-spin" />
                        Analysing
                      </>
                    ) : (
                      'Run analysis'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!result?.diseaseLabel || submitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 text-white font-bold py-3.5 px-4 shadow-sm hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to doctors
                    <IconArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


import 'dotenv/config';
import { DiagnosisAgent } from '../src/agents/DiagnosisAgent.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const inputs = String(req.body?.inputs ?? '').trim();
    if (!inputs) {
      return res.status(400).json({ error: 'Please provide symptom text.' });
    }

    const HF_TOKEN = process.env.HF_TOKEN;
    const HF_MODEL = process.env.HF_MODEL || 'DrSyedFaizan/medReport';

    let diseaseLabel = null;
    let confidence = null;
    let raw = [];
    let model = HF_MODEL;
    let source = 'huggingface';

    try {
      if (!HF_TOKEN) {
        throw new Error('HF_TOKEN is not configured; using offline diagnosis fallback.');
      }

      const hfRes = await fetch(`https://api-inference.huggingface.co/models/${encodeURIComponent(HF_MODEL)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ inputs }),
      });

      const text = await hfRes.text();
      let data = null;
      try { data = JSON.parse(text); } catch { data = null; }

      if (!hfRes.ok) {
        throw new Error((data && (data.error || data.message)) ? (data.error || data.message) : text || `HF request failed with ${hfRes.status}`);
      }

      const ranked = Array.isArray(data?.[0]) ? data[0] : (Array.isArray(data) ? data : []);
      raw = ranked;
      const top = ranked?.[0];
      diseaseLabel = top?.label ?? null;
      confidence = typeof top?.score === 'number' ? top.score : null;
    } catch (hfErr) {
      const fallback = await DiagnosisAgent(inputs, null);
      diseaseLabel = fallback?.specialty || 'Unknown condition';
      confidence = typeof fallback?.confidence === 'number' ? fallback.confidence : 0.55;
      raw = [];
      model = `${HF_MODEL} (offline fallback)`;
      source = 'offline_fallback';
      console.warn('[api/diagnose] Hugging Face failed, using offline fallback:', hfErr?.message || hfErr);
    }

    return res.status(200).json({ diseaseLabel, confidence, raw, model, source });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
}

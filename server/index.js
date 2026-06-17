import 'dotenv/config';
import express from 'express';
import { DiagnosisAgent } from '../src/agents/DiagnosisAgent.js';

const app = express();
app.use(express.json({ limit: '256kb' }));

const PORT = process.env.PORT ? Number(process.env.PORT) : 5174;
const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL = process.env.HF_MODEL || 'DrSyedFaizan/medReport';

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/diagnose', async (req, res) => {
  try {
    if (!HF_TOKEN) {
      return res.status(500).json({ error: 'Server is missing HF_TOKEN in environment.' });
    }

    const inputs = (req.body?.inputs ?? '').toString().trim();
    if (inputs.length < 3) {
      return res.status(400).json({ error: 'Please provide symptom text.' });
    }

    let diseaseLabel = null;
    let confidence = null;
    let raw = [];
    let model = HF_MODEL;
    let source = 'huggingface';

    try {
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

    return res.json({
      diseaseLabel,
      confidence,
      raw,
      model,
      source,
    });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);
});


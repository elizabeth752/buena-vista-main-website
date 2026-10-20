// ═══════════════════════════════════════════════════════════════════════════
// /api/feedback — 1–3 star feedback from /review/, forwarded to CTM.
//
// Same shape as /api/lead (key stays server-side, body rebuilt from an
// allowlist, phone rewritten to E.164) but a DIFFERENT reactor, on purpose:
//
//   - A complaint is not an admissions lead. Posting it to the lead reactor
//     would page admissions as if a patient were calling and count it as a
//     Google Ads conversion.
//   - The lead reactor has no field for free text. CTM silently drops fields it
//     does not recognise, so the feedback itself would vanish while CTM still
//     answered status:"success".
//
// The feedback reactor must define these custom fields, spelled exactly:
//     custom_fields[feedback]   what the person wrote
//     custom_fields[rating]     1, 2 or 3
//
// Answers JSON (not a redirect): the page shows its own thank-you state, and
// /thank-you/?sent=1 must stay reserved for real leads, since that page view
// is the Google Ads conversion.
//
// ENVIRONMENT (set in Vercel, never committed):
//     CTM_FEEDBACK_REACTOR_ID   required — the feedback reactor
//     CTM_FEEDBACK_KEY          optional — that reactor's ?key=, if it differs
//                               from CTM_FORMREACTOR_KEY

import { toE164, rateLimited, redactDigits } from './lead.js';

export const config = { maxDuration: 15 };

const CTM_ENDPOINT = 'https://api.calltrackingmetrics.com/api/v1/formreactor';

const MAX_FEEDBACK_LEN = 4000;
const MAX_FIELD_LEN = 512;
const MAX_BODY_BYTES = 64_000;

/** Rebuild the CTM body from the form, or return a reason it cannot be sent. */
export function buildFeedbackPayload(fields) {
  const phone = toE164(fields.get('phone_number'));
  if (!phone) return { error: 'phone' };

  const feedback = (fields.get('feedback') || '').trim();
  if (!feedback) return { error: 'empty' };

  const rating = Number(fields.get('rating'));
  if (![1, 2, 3].includes(rating)) return { error: 'rating' };

  const out = new URLSearchParams();
  out.set('phone_number', phone);
  out.set('custom_fields[feedback]', feedback.slice(0, MAX_FEEDBACK_LEN));
  out.set('custom_fields[rating]', String(rating));
  for (const name of ['caller_name', 'email_address']) {
    const value = (fields.get(name) || '').trim();
    if (value) out.set(name, value.slice(0, MAX_FIELD_LEN));
  }
  return { payload: out };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (c) => {
      total += c.length;
      if (total > MAX_BODY_BYTES) reject(new Error('TOO_LARGE'));
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method' });
  }

  const reactor = process.env.CTM_FEEDBACK_REACTOR_ID;
  const key = process.env.CTM_FEEDBACK_KEY || process.env.CTM_FORMREACTOR_KEY;
  if (!reactor || !key) {
    console.error('[feedback] CTM_FEEDBACK_REACTOR_ID or key is not set');
    return res.status(503).json({ ok: false, error: 'config' });
  }

  let raw;
  try {
    raw = await readBody(req);
  } catch (err) {
    if (err.message === 'TOO_LARGE') return res.status(413).json({ ok: false, error: 'too-large' });
    console.error('[feedback] body read failed', err);
    return res.status(400).json({ ok: false, error: 'read' });
  }

  const fields = new URLSearchParams(raw);

  // Honeypot and rate limit: answer like a success so a bot learns nothing.
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
          || req.headers['x-real-ip'] || '';
  if (fields.get('rv_extra') || rateLimited(ip)) {
    console.log('[feedback] discarded as spam');
    return res.status(200).json({ ok: true });
  }

  const { payload, error } = buildFeedbackPayload(fields);
  if (error) return res.status(422).json({ ok: false, error });

  let ctm;
  try {
    const upstream = await fetch(`${CTM_ENDPOINT}/${reactor}?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString(),
    });
    ctm = await upstream.json().catch(() => ({}));
  } catch (err) {
    console.error('[feedback] upstream request failed', err);
    return res.status(502).json({ ok: false, error: 'upstream' });
  }

  // CTM answers HTTP 200 with status:"error" on a rejection.
  if (ctm.status !== 'success') {
    console.error('[feedback] CTM rejected the submission', { text: redactDigits(ctm.text) });
    return res.status(502).json({ ok: false, error: 'rejected' });
  }

  console.log('[feedback] accepted', { trackback: ctm.trackback_id });
  return res.status(200).json({ ok: true });
}

// ═══════════════════════════════════════════════════════════════════════════
// /api/lead — the CTM FormReactor proxy for the main Buena Vista site.
//
// Adapted from the same file on the landing page, which has been in production
// since 2026-08-20. This site posts to a DIFFERENT reactor, and the reactor's
// custom fields are named differently, so the two are not interchangeable.
//
// WHY THE FORM DOES NOT POST STRAIGHT TO CTM.
// The FormReactor endpoint authenticates with a key in the query string:
//
//     POST .../api/v1/formreactor/{REACTOR_ID}?key={KEY}
//
// Putting that URL in client-side code publishes both halves. Anyone reading
// the page source could then write straight into Buena Vista's admissions
// queue at any volume. That is not hypothetical: the same shape of endpoint
// was attacked on another site in this account on 2026-08-13 — roughly 35
// submissions in 7 minutes, each firing a staff notification and paging two
// people 59 times. The key lives in a Vercel env var and never reaches the
// browser.
//
// SECOND THING IT FIXES. CTM only accepts E.164 phone numbers:
//     +14805551234    -> success
//     4805551234      -> "phone number is invalid"
//     (480) 555-1234  -> "phone number is invalid"
// Nobody types +1, so toE164() rewrites what they do type. Without this the
// form would appear to work while every lead was silently discarded.
//
// ENVIRONMENT (set in Vercel, never committed):
//     CTM_FORMREACTOR_KEY    required — the ?key= value
//     CTM_FORM_REACTOR_ID    optional — override the reactor without a deploy

export const config = { maxDuration: 15 };

const CTM_ENDPOINT = 'https://api.calltrackingmetrics.com/api/v1/formreactor';

// The main-site reactor. The landing page uses a different one on purpose:
// separate reactors keep the two traffic sources separable in CTM reporting.
const DEFAULT_REACTOR =
  'FRT472ABB2C5B9B141A2DBE35A5E3D5774FA9A2965DB7EF8E4D3DE9BE48BA095304';

// ── WHAT MAY BE FORWARDED ──────────────────────────────────────────────────
// The body is rebuilt from this allowlist rather than proxied through. A
// pass-through would let anyone posting to /api/lead set arbitrary reactor
// parameters — including ones that change routing or notification behaviour —
// simply by adding fields. Anything not named here is dropped in silence.
//
// ⚠️ CTM SILENTLY DROPS FIELDS IT DOES NOT RECOGNISE, and still answers
// status:"success". A typo here does not fail loudly; it just means that value
// never appears on the lead. Every name below is spelled the way THIS reactor
// spells it, taken from its own generated curl example:
//
//     custom_fields[insurance_provider]   the carrier they picked
//     custom_fields[id]                   member / policy ID
//     custom_fields[consent_calls]        note the plural — the form field is
//                                         consent_call, CTM's is consent_calls
//     custom_fields[consent_sms]
//
// The reactor also accepts date_of_birth, other_insurance_info, group and
// insurance_phone. We deliberately do not ask for those: four fields is what
// the form asks and a reactor field with nothing to put in it is not a reason
// to lengthen it.
const ALLOWED = new Set([
  'caller_name',
  'phone_number',
  'email_address',
  'custom_fields[insurance_provider]',
  'custom_fields[id]',
  'custom_fields[consent_calls]',
  'custom_fields[consent_sms]',
  'paid_attribution[gclid]',
  'paid_attribution[campaign_id]',
  'paid_attribution[adgroup_id]',
  'paid_attribution[creative_id]',
  'paid_attribution[form_id]',
  'paid_attribution[source]',
  'paid_attribution[medium]',
  'paid_attribution[campaign]',
]);

// Caps on what a single field may carry. CTM will take far more, but no
// genuine value in any of these fields is long, and an unbounded field is how
// a form endpoint becomes a place to store other people's payloads.
const MAX_FIELD_LEN = 512;
const MAX_BODY_BYTES = 64_000;

/** Turn whatever a human typed into E.164, or null if it cannot be one. */
export function toE164(raw) {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (/^\+[1-9]\d{7,14}$/.test(trimmed)) return trimmed;     // already E.164
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;             // US/CA local
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.length > 11 && digits.length <= 15) return `+${digits}`;
  return null;                                                // too short to guess
}

// ── SPAM CHECKS ────────────────────────────────────────────────────────────
// ⚠️ EVERY RULE HERE IS A FALSE-POSITIVE RISK ON A CRISIS LEAD. They are
// deliberately narrow: patterns no real person filling in a rehab enquiry
// produces. Do not add "looks foreign", "odd spelling", or anything that
// penalises how a name is written. When unsure, let it through — a missed spam
// is cheap, a missed patient is not.
const MIN_FILL_MS = 3000;

const NAME_SPAM = [
  /\b(you have|new message|message\s*[№#]|click here|read now)\b/i,
  /[№]/,                                     // numero sign — not on a US keyboard
  /https?:\/\/|www\.|\.(com|net|ru|xyz)\b/i, // a URL in a name field
  /[✀-➿☀-⛿\uD83C-\uDBFF]/,                   // dingbats/emoji in a name
];

/** Reason to reject as spam, or null to let it through. */
export function spamReason(fields, now = Date.now()) {
  // Honeypot: a field hidden from people, irresistible to form-fillers.
  if (fields.get('company_website')) return 'honeypot';

  const renderedAt = Number(fields.get('rendered_at'));
  // Only judge a timestamp that parses and is in the past. A clock-skewed or
  // garbled value must never cost someone their enquiry.
  if (Number.isFinite(renderedAt) && renderedAt > 0) {
    const elapsed = now - renderedAt;
    if (elapsed >= 0 && elapsed < MIN_FILL_MS) return 'too-fast';
  }

  const name = fields.get('caller_name') || '';
  if (NAME_SPAM.some((re) => re.test(name))) return 'name-pattern';
  if (name.length > 80) return 'name-length';   // a payload, not a person

  return null;
}

// ── RATE LIMIT ─────────────────────────────────────────────────────────────
// Per-instance and in-memory: serverless gives no shared state, so this is a
// speed bump rather than a wall. It still matters — a burst from one source
// mostly lands on one warm instance, which is the shape these attacks take.
// The durable fix for volume is Vercel Firewall rate limiting at the edge.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map();

export function rateLimited(ip, now = Date.now()) {
  if (!ip) return false;                       // never punish an unknown IP
  const fresh = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  fresh.push(now);
  hits.set(ip, fresh);
  if (hits.size > 5000) {                      // bound the map
    for (const [k, v] of hits) {
      if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return fresh.length > RATE_MAX;
}

/**
 * Build the body CTM receives from the allowlist.
 * Returns null if there is no usable phone number — the one field the reactor
 * cannot do without.
 */
export function buildPayload(fields) {
  const out = new URLSearchParams();

  const phone = toE164(fields.get('phone_number'));
  if (!phone) return null;
  out.set('phone_number', phone);

  for (const name of ALLOWED) {
    if (name === 'phone_number') continue;
    const value = (fields.get(name) || '').trim();
    if (value) out.set(name, value.slice(0, MAX_FIELD_LEN));
  }

  // An unticked checkbox posts nothing at all, which would leave the consent
  // fields blank on the lead and make "did not consent" indistinguishable from
  // "form predates consent capture". Record the negative explicitly.
  for (const key of ['custom_fields[consent_calls]', 'custom_fields[consent_sms]']) {
    if (!out.has(key)) out.set(key, 'no');
  }
  return out;
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

/**
 * Mask any run of 5+ digits so an upstream message that quotes the submitted
 * value cannot carry it into the logs. Short runs (status codes, field counts)
 * survive because they are what makes an error message useful.
 */
export function redactDigits(text) {
  return text == null ? null : String(text).replace(/\d{5,}/g, (d) => '#'.repeat(d.length));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.CTM_FORMREACTOR_KEY;
  if (!key) {
    // Never fail a lead silently. Loud in logs, generic to the visitor.
    console.error('[lead] CTM_FORMREACTOR_KEY is not set');
    return fail(res, 'config');
  }

  let raw;
  try {
    raw = await readBody(req);
  } catch (err) {
    if (err.message === 'TOO_LARGE') return fail(res, 'too-large');
    console.error('[lead] body read failed', err);
    return fail(res, 'read');
  }

  const fields = new URLSearchParams(raw);

  // Drop spam before it reaches CTM, but show the sender the ordinary
  // thank-you page. Telling a bot why it failed just teaches whoever wrote it.
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
          || req.headers['x-real-ip'] || '';
  const spam = rateLimited(ip) ? 'rate-limit' : spamReason(fields);
  if (spam) {
    console.log('[lead] discarded as spam', { reason: spam });
    return redirect(res, '/thank-you/');
  }

  const payload = buildPayload(fields);
  if (!payload) {
    // ⚠️ NEVER LOG THE ACTUAL NUMBER. This is a contact detail submitted to an
    // addiction-treatment intake form; writing it into Vercel's runtime logs
    // puts it in a third-party store with its own retention, searchable by
    // anyone with project access. The debugging need is the SHAPE, not the
    // value. Letters are masked too, so someone typing "call my mom Susan"
    // into the phone field does not land in the logs verbatim.
    const attempted = (fields.get('phone_number') || '')
      .replace(/\d/g, '#')
      .replace(/[^\s\d#()+.-]/g, 'x')
      .slice(0, 40);
    console.error('[lead] unusable phone number', { shape: attempted });
    return fail(res, 'phone');
  }

  const reactor = process.env.CTM_FORM_REACTOR_ID || DEFAULT_REACTOR;
  const url = `${CTM_ENDPOINT}/${reactor}?key=${encodeURIComponent(key)}`;

  let ctm;
  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString(),
    });
    ctm = await upstream.json().catch(() => ({}));
  } catch (err) {
    console.error('[lead] upstream request failed', err);
    return fail(res, 'upstream');
  }

  // CTM returns HTTP 200 with status:"error" — treat that as the failure it is.
  if (ctm.status !== 'success') {
    console.error('[lead] CTM rejected the submission', { text: redactDigits(ctm.text) });
    return fail(res, 'rejected');
  }

  console.log('[lead] accepted', { trackback: ctm.trackback_id });
  return redirect(res, '/thank-you/');
}

function redirect(res, path) {
  // 303 so the browser follows with GET and a refresh cannot resubmit.
  res.statusCode = 303;
  res.setHeader('Location', path);
  res.end();
}

function fail(res, reason) {
  // The visitor still reaches a human-shaped page; `issue` is for us, and the
  // thank-you page uses it to surface the phone number more prominently.
  return redirect(res, `/thank-you/?issue=${encodeURIComponent(reason)}`);
}

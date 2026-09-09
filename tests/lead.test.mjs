// Tests for api/lead.js.
//
// ⚠️ NOTHING HERE TALKS TO CTM. Every assertion is against the pure functions.
// A "test" submission to a live FormReactor lands in the real admissions queue
// and pages real staff — that happened on another account in this workspace and
// it must not happen again. The one thing these tests cannot prove is that CTM
// accepts the field names; that is verified by watching a single real
// submission from the deployed site appear on a lead in CTM.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { toE164, spamReason, rateLimited, buildPayload, redactDigits } from '../api/lead.js';

test('toE164 accepts the shapes people actually type', () => {
  assert.equal(toE164('(480) 555-1234'), '+14805551234');
  assert.equal(toE164('480-555-1234'), '+14805551234');
  assert.equal(toE164('480.555.1234'), '+14805551234');
  assert.equal(toE164('4805551234'), '+14805551234');
  assert.equal(toE164('14805551234'), '+14805551234');
  assert.equal(toE164('+14805551234'), '+14805551234');
  assert.equal(toE164('  +1 480 555 1234 '), '+14805551234');
});

test('toE164 refuses what cannot be a number', () => {
  assert.equal(toE164(''), null);
  assert.equal(toE164(null), null);
  assert.equal(toE164('call me'), null);
  assert.equal(toE164('555-1234'), null);          // too short
});

const form = (o) => new URLSearchParams(o);

test('spam checks catch the patterns, not the people', () => {
  assert.equal(spamReason(form({ company_website: 'x' })), 'honeypot');
  assert.equal(spamReason(form({ caller_name: 'You have 1 new message' })), 'name-pattern');
  assert.equal(spamReason(form({ caller_name: 'visit http://spam.ru' })), 'name-pattern');
  assert.equal(spamReason(form({ caller_name: 'a'.repeat(81) })), 'name-length');

  // Real people, in the shapes real people come in.
  assert.equal(spamReason(form({ caller_name: "Mary-Jane O'Brien" })), null);
  assert.equal(spamReason(form({ caller_name: 'José Álvarez-Núñez' })), null);
  assert.equal(spamReason(form({ caller_name: '李伟' })), null);
});

test('a too-fast submission is spam, a skewed clock is not', () => {
  const now = 1_000_000;
  assert.equal(spamReason(form({ rendered_at: String(now - 500) }), now), 'too-fast');
  assert.equal(spamReason(form({ rendered_at: String(now - 9000) }), now), null);
  assert.equal(spamReason(form({ rendered_at: String(now + 60_000) }), now), null); // future clock
  assert.equal(spamReason(form({ rendered_at: 'garbage' }), now), null);
  assert.equal(spamReason(form({}), now), null);                                    // no JS
});

test('rate limit trips on the sixth, and never on an unknown IP', () => {
  const ip = '203.0.113.7';
  for (let i = 0; i < 5; i++) assert.equal(rateLimited(ip), false, `hit ${i + 1}`);
  assert.equal(rateLimited(ip), true);
  assert.equal(rateLimited(''), false);
});

test('payload uses the field names this reactor expects', () => {
  const p = buildPayload(form({
    phone_number: '(480) 555-1234',
    caller_name: 'Jane Doe',
    email_address: 'jane@example.com',
    'custom_fields[insurance_provider]': 'Aetna',
    'custom_fields[id]': 'ABC123',
    'custom_fields[consent_calls]': 'yes',
    'custom_fields[consent_sms]': 'yes',
    'paid_attribution[gclid]': 'Cj0KC',
  }));
  assert.equal(p.get('phone_number'), '+14805551234');
  assert.equal(p.get('caller_name'), 'Jane Doe');
  assert.equal(p.get('custom_fields[insurance_provider]'), 'Aetna');
  assert.equal(p.get('custom_fields[id]'), 'ABC123');
  assert.equal(p.get('custom_fields[consent_calls]'), 'yes');
  assert.equal(p.get('paid_attribution[gclid]'), 'Cj0KC');
});

test('anything not on the allowlist is dropped', () => {
  const p = buildPayload(form({
    phone_number: '4805551234',
    'custom_fields[date_of_birth]': '1990-01-01',   // real reactor field, not ours
    notify_email: 'attacker@example.com',           // routing override attempt
    tag_list: 'whatever',
  }));
  assert.equal(p.get('custom_fields[date_of_birth]'), null);
  assert.equal(p.get('notify_email'), null);
  assert.equal(p.get('tag_list'), null);
});

test('an unticked consent box is recorded as a no, not as absence', () => {
  const p = buildPayload(form({ phone_number: '4805551234' }));
  assert.equal(p.get('custom_fields[consent_calls]'), 'no');
  assert.equal(p.get('custom_fields[consent_sms]'), 'no');
});

test('no phone number means no submission', () => {
  assert.equal(buildPayload(form({ caller_name: 'Jane' })), null);
  assert.equal(buildPayload(form({ phone_number: 'call me' })), null);
});

test('long values are truncated rather than forwarded whole', () => {
  const p = buildPayload(form({ phone_number: '4805551234', caller_name: 'a'.repeat(9000) }));
  assert.equal(p.get('caller_name').length, 512);
});

test('log redaction keeps the diagnosis and drops the person', () => {
  assert.equal(redactDigits('number 14805551234 invalid'), 'number ########### invalid');
  assert.equal(redactDigits('status 404'), 'status 404');   // short runs survive
  assert.equal(redactDigits(null), null);
});

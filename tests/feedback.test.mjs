// Tests for api/feedback.js.
//
// ⚠️ NOTHING HERE TALKS TO CTM, for the same reason as lead.test.mjs: a test
// submission to a live reactor reaches real staff.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildFeedbackPayload } from '../api/feedback.js';

const form = (o) => new URLSearchParams(o);

test('builds the CTM body with feedback and rating as custom fields', () => {
  const { payload, error } = buildFeedbackPayload(form({
    phone_number: '(480) 555-1234',
    caller_name: 'Pat',
    email_address: 'pat@example.com',
    feedback: '  The nights were loud.  ',
    rating: '2',
  }));
  assert.equal(error, undefined);
  assert.equal(payload.get('phone_number'), '+14805551234');
  assert.equal(payload.get('custom_fields[feedback]'), 'The nights were loud.');
  assert.equal(payload.get('custom_fields[rating]'), '2');
  assert.equal(payload.get('caller_name'), 'Pat');
  assert.equal(payload.get('email_address'), 'pat@example.com');
});

test('leaves optional fields out instead of sending them blank', () => {
  const { payload } = buildFeedbackPayload(form({ phone_number: '4805551234', feedback: 'x', rating: '1' }));
  assert.equal(payload.has('caller_name'), false);
  assert.equal(payload.has('email_address'), false);
});

test('refuses what CTM would reject or what the page never sends', () => {
  assert.equal(buildFeedbackPayload(form({ feedback: 'x', rating: '1' })).error, 'phone');
  assert.equal(buildFeedbackPayload(form({ phone_number: '4805551234', feedback: '   ', rating: '1' })).error, 'empty');
  assert.equal(buildFeedbackPayload(form({ phone_number: '4805551234', feedback: 'x', rating: '5' })).error, 'rating');
});

test('caps runaway feedback', () => {
  const { payload } = buildFeedbackPayload(form({ phone_number: '4805551234', feedback: 'a'.repeat(9000), rating: '3' }));
  assert.equal(payload.get('custom_fields[feedback]').length, 4000);
});

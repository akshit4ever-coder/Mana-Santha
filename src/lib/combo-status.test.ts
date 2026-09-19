import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getValidActiveCombos,
  isComboCurrentlyValid,
  rangesOverlap,
} from './combo-status.ts';

test('only the date-valid active combo is accepted for today', () => {
  const today = new Date('2026-09-19T12:00:00Z');
  const combos = [
    { id: 'past', status: 'active', date_valid_from: '2026-09-18', date_valid_to: '2026-09-18' },
    { id: 'today', status: 'active', date_valid_from: '2026-09-19', date_valid_to: '2026-09-19' },
    { id: 'tomorrow', status: 'active', date_valid_from: '2026-09-20', date_valid_to: '2026-09-20' },
    { id: 'inactive', status: 'inactive', date_valid_from: '2026-09-19', date_valid_to: '2026-09-19' },
  ];

  const valid = getValidActiveCombos(combos, today);
  assert.deepEqual(valid.map((combo) => combo.id), ['today']);
  assert.equal(isComboCurrentlyValid(combos[1], today), true);
  assert.equal(isComboCurrentlyValid(combos[0], today), false);
  assert.equal(isComboCurrentlyValid(combos[2], today), false);
});

test('date ranges overlap only when the active windows intersect', () => {
  assert.equal(rangesOverlap('2026-09-19', '2026-09-19', '2026-09-19', '2026-09-19'), true);
  assert.equal(rangesOverlap('2026-09-19', '2026-09-20', '2026-09-20', '2026-09-21'), true);
  assert.equal(rangesOverlap('2026-09-19', '2026-09-20', '2026-09-21', '2026-09-22'), false);
  assert.equal(rangesOverlap(null, null, '2026-09-20', '2026-09-20'), true);
});

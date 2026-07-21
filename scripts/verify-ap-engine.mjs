// Verifies the Attitudinal Psyche engine: all 24 types reachable, deterministic,
// and content coverage is complete across locales.
import assert from 'node:assert/strict';
import {
  ALL_TYPES,
  ASPECT_KEYS,
  POSITION_KEYS,
  STATEMENTS,
  STATEMENT_IDS,
  decodeType,
  scoreLikert,
} from '../src/pages/ap/apEngine.js';
import { getApContent, TYPE_NICKNAMES } from '../src/pages/ap/apContent.js';

const LETTER_ASPECT = { V: 'volition', L: 'logic', E: 'emotion', F: 'physics' };
const LOCALES = ['en', 'zh', 'ja', 'ko'];

// Build Likert answers that give aspects strictly decreasing scores in `order`.
function answersFor(order) {
  const rating = Object.fromEntries(order.map((aspect, index) => [aspect, 5 - index])); // 5,4,3,2
  return Object.fromEntries(STATEMENTS.map((s) => [s.id, rating[s.aspect]]));
}

let checks = 0;

// 1. Exactly 24 unique types; 5 statements per aspect.
assert.equal(ALL_TYPES.length, 24, 'expected 24 permutations');
assert.equal(new Set(ALL_TYPES).size, 24, 'permutations must be unique');
assert.equal(STATEMENTS.length, 20, 'expected 20 statements');
for (const aspect of ASPECT_KEYS) {
  assert.equal(STATEMENTS.filter((s) => s.aspect === aspect).length, 5, `${aspect}: 5 statements`);
}
checks += 1;

// 2. Every type is reachable and produced deterministically.
for (const code of ALL_TYPES) {
  const order = code.split('').map((letter) => LETTER_ASPECT[letter]);
  const answers = answersFor(order);
  const a = scoreLikert(answers);
  const b = scoreLikert(answers);
  assert.equal(a.code, code, `answers for ${order} should yield ${code}, got ${a.code}`);
  assert.equal(a.code, b.code, 'scoring must be deterministic');
  assert.equal(a.answeredCount, STATEMENT_IDS.length, 'all statements counted');
  assert.deepEqual(decodeType(code).map((e) => e.aspect), order, 'decodeType round-trip');
}
checks += 1;

// 3. Tie-break falls back to fixed precedence (V > L > E > F) when all equal.
const allNeutral = Object.fromEntries(STATEMENT_IDS.map((id) => [id, 3]));
const tie = scoreLikert(allNeutral);
assert.equal(tie.code, 'VLEF', `balanced input should tie-break to VLEF, got ${tie.code}`);
checks += 1;

// 4. Invalid codes rejected.
assert.equal(decodeType('VVLE'), null, 'duplicate letters invalid');
assert.equal(decodeType('VLE'), null, 'short code invalid');
assert.equal(decodeType('XLEF'), null, 'unknown letter invalid');
checks += 1;

// 5. Content coverage per locale.
for (const locale of LOCALES) {
  const c = getApContent(locale);
  assert.ok(c.ui && c.summary && c.faq?.length, `${locale}: base content`);
  assert.ok(Array.isArray(c.ui.scaleLabels) && c.ui.scaleLabels.length === 5, `${locale}: 5 scale labels`);
  assert.ok(c.ui.scaleLabels.every(Boolean) && c.ui.instruction && c.ui.showResult, `${locale}: scale/ui copy`);
  for (const id of STATEMENT_IDS) {
    assert.ok(c.statements[id], `${locale}/${id}: statement text`);
  }
  for (const aspect of ASPECT_KEYS) {
    assert.ok(c.aspects[aspect]?.label && c.aspects[aspect]?.def, `${locale}/${aspect}: aspect`);
    for (const position of POSITION_KEYS) {
      assert.ok(c.blocks[aspect][position], `${locale}/${aspect}/${position}: block`);
    }
  }
  for (const position of POSITION_KEYS) {
    assert.ok(c.positions[position]?.ordinal && c.positions[position]?.def, `${locale}/${position}: position`);
  }
}
checks += 1;

// 6. All 24 types have a nickname.
for (const code of ALL_TYPES) {
  assert.ok(TYPE_NICKNAMES[code], `missing nickname for ${code}`);
}
checks += 1;

console.log(`AP engine verified: ${checks} check groups, 24 types, ${LOCALES.length} locales, ${STATEMENT_IDS.length} statements.`);

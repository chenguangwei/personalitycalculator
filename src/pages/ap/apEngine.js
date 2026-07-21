// Attitudinal Psyche typing engine.
// Ranks the four aspects (Volition, Logic, Emotion, Physics) into positions
// 1st..4th via forced-choice ranking + Borda scoring, producing one of the
// 24 four-letter types (e.g. VLEF).

export const ASPECT_KEYS = ['volition', 'logic', 'emotion', 'physics'];

export const ASPECT_LETTER = {
  volition: 'V',
  logic: 'L',
  emotion: 'E',
  physics: 'F',
};

export const LETTER_ASPECT = {
  V: 'volition',
  L: 'logic',
  E: 'emotion',
  F: 'physics',
};

// Position keys in rank order: index 0 = 1st position.
export const POSITION_KEYS = ['confident', 'flexible', 'insecure', 'unbothered'];

// Deterministic tie-break precedence (lower wins the higher position).
const PRECEDENCE = { volition: 0, logic: 1, emotion: 2, physics: 3 };

// Likert statements: each is rated 1..5 (Disagree..Agree). 5 per aspect,
// interleaved V/L/E/F. The engine owns the id -> aspect map; text lives in apContent.
export const STATEMENTS = [
  { id: 's1', aspect: 'volition' },
  { id: 's2', aspect: 'logic' },
  { id: 's3', aspect: 'emotion' },
  { id: 's4', aspect: 'physics' },
  { id: 's5', aspect: 'volition' },
  { id: 's6', aspect: 'logic' },
  { id: 's7', aspect: 'emotion' },
  { id: 's8', aspect: 'physics' },
  { id: 's9', aspect: 'volition' },
  { id: 's10', aspect: 'logic' },
  { id: 's11', aspect: 'emotion' },
  { id: 's12', aspect: 'physics' },
  { id: 's13', aspect: 'volition' },
  { id: 's14', aspect: 'logic' },
  { id: 's15', aspect: 'emotion' },
  { id: 's16', aspect: 'physics' },
  { id: 's17', aspect: 'volition' },
  { id: 's18', aspect: 'logic' },
  { id: 's19', aspect: 'emotion' },
  { id: 's20', aspect: 'physics' },
];

export const STATEMENT_IDS = STATEMENTS.map((statement) => statement.id);
export const SCALE_MAX = 5;

// answers: { s1: 4, s2: 2, ... } each 1..5. Sums per aspect, ranks them -> type.
export function scoreLikert(answers) {
  const totals = { volition: 0, logic: 0, emotion: 0, physics: 0 };
  const counts = { volition: 0, logic: 0, emotion: 0, physics: 0 };

  STATEMENTS.forEach(({ id, aspect }) => {
    const value = answers[id];
    if (typeof value === 'number' && value >= 1 && value <= SCALE_MAX) {
      totals[aspect] += value;
      counts[aspect] += 1;
    }
  });

  const avg = (aspect) => (counts[aspect] ? totals[aspect] / counts[aspect] : 0);

  const order = [...ASPECT_KEYS].sort((a, b) => avg(b) - avg(a) || PRECEDENCE[a] - PRECEDENCE[b]);
  const code = order.map((aspect) => ASPECT_LETTER[aspect]).join('');

  const percents = Object.fromEntries(
    ASPECT_KEYS.map((aspect) => [aspect, counts[aspect] ? Math.round(((avg(aspect) - 1) / (SCALE_MAX - 1)) * 100) : 0]),
  );

  const answeredCount = STATEMENT_IDS.filter((id) => typeof answers[id] === 'number').length;

  return { code, order, totals, percents, answeredCount };
}

// Returns [{ aspect, position, positionIndex }] in position order for a type code.
export function decodeType(code) {
  const letters = String(code || '').toUpperCase().split('');
  const aspects = letters.map((letter) => LETTER_ASPECT[letter]).filter(Boolean);
  const unique = new Set(aspects);
  if (aspects.length !== 4 || unique.size !== 4) return null;
  return aspects.map((aspect, index) => ({
    aspect,
    position: POSITION_KEYS[index],
    positionIndex: index,
  }));
}

export function isValidType(code) {
  return decodeType(code) !== null;
}

// Axis helpers for the 2x2 position map.
// Confident: positions 1 & 2. Result-oriented (monologue): positions 1 & 4.
export function positionAxes(positionIndex) {
  return {
    confident: positionIndex === 0 || positionIndex === 1,
    result: positionIndex === 0 || positionIndex === 3,
  };
}

export const ALL_TYPES = (() => {
  const letters = ['V', 'L', 'E', 'F'];
  const out = [];
  const permute = (arr, current) => {
    if (arr.length === 0) {
      out.push(current.join(''));
      return;
    }
    arr.forEach((letter, index) => {
      permute([...arr.slice(0, index), ...arr.slice(index + 1)], [...current, letter]);
    });
  };
  permute(letters, []);
  return out;
})();

import {
  DEFAULT_VALUES,
  EU_DESCRIPTIONS,
  EU_MATRIX,
  GROUP_DATA,
  JA_DESCRIPTIONS,
  JA_GROUP_COPY,
  US_DESCRIPTIONS,
  US_GROUP_TO_KEY,
  US_MATRIX,
  VALUE_OPTIONS,
  WORD_LABEL,
} from './tomodachiData.js';

function rangeForBucket(bucket) {
  return [
    [0, 4],
    [4, 8],
    [8, 12],
    [12, 16],
  ][bucket];
}

function pickPair(aOptions, bOptions, bucket) {
  const [min, max] = rangeForBucket(bucket);
  const matches = [];
  aOptions.forEach((a) => {
    bOptions.forEach((b) => {
      const sum = a + b;
      if (sum >= min && sum < max) matches.push([a, b]);
    });
  });
  return matches[Math.floor(Math.random() * matches.length)];
}

export function valuesForPersonality(row, col) {
  const [speech, movement] = pickPair(VALUE_OPTIONS.speech, VALUE_OPTIONS.movement, col);
  const [attitude, energy] = pickPair(VALUE_OPTIONS.attitude, VALUE_OPTIONS.energy, row);
  const overall = VALUE_OPTIONS.overall[Math.floor(Math.random() * VALUE_OPTIONS.overall.length)];
  return { movement, speech, energy, attitude, overall };
}

export function canonicalValuesForPersonality(row, col) {
  const byColumn = [
    { movement: 1, speech: 2 },
    { movement: 3, speech: 3 },
    { movement: 5, speech: 5 },
    { movement: 7, speech: 8 },
  ];
  const byRow = [
    { energy: 1, attitude: 1 },
    { energy: 3, attitude: 3 },
    { energy: 5, attitude: 5 },
    { energy: 7, attitude: 8 },
  ];
  return {
    ...byColumn[col],
    ...byRow[row],
    overall: 3,
  };
}

export function matrixFor(region) {
  return region === 'us' ? US_MATRIX : EU_MATRIX;
}

function descriptionsFor(region) {
  return region === 'us' ? US_DESCRIPTIONS : EU_DESCRIPTIONS;
}

export function personalityFor(values, region) {
  const speechMovement = values.speech + values.movement;
  const attitudeEnergy = values.attitude + values.energy;
  const col = speechMovement < 4 ? 0 : speechMovement < 8 ? 1 : speechMovement < 12 ? 2 : 3;
  const row = attitudeEnergy < 4 ? 0 : attitudeEnergy < 8 ? 1 : attitudeEnergy < 12 ? 2 : 3;
  const [modifier, type, color] = matrixFor(region)[row][col];
  const groupKey = region === 'us' ? US_GROUP_TO_KEY[modifier] : modifier;
  const group = GROUP_DATA[groupKey];
  return {
    modifier,
    type,
    color,
    description: descriptionsFor(region)[type] || 'A unique Mii with a personality all their own.',
    groupName: group.names[region],
    groupWord: group.word[region],
    groupTraits: group.traits[region],
    groupKey,
    groupColor: group.color,
    wordLabel: WORD_LABEL[region],
    row,
    col,
  };
}

export function readableColor(hex, ratio = 0.42) {
  const value = parseInt(hex.slice(1), 16);
  const r = Math.round(((value >> 16) & 255) * ratio);
  const g = Math.round(((value >> 8) & 255) * ratio);
  const b = Math.round((value & 255) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
}

export function displayCopyForResult(result, language) {
  if (language !== 'ja') {
    return {
      wordLabel: result.wordLabel,
      groupWord: result.groupWord,
      groupTraits: result.groupTraits,
      description: result.description,
    };
  }
  const groupCopy = JA_GROUP_COPY[result.groupKey] || JA_GROUP_COPY.Reserved;
  return {
    wordLabel: 'ひとことで',
    groupWord: groupCopy.word,
    groupTraits: groupCopy.traits,
    description: JA_DESCRIPTIONS[result.type] || result.description,
  };
}

export function parseInitialValues() {
  const params = new URLSearchParams(window.location.search);
  const values = { ...DEFAULT_VALUES };
  Object.keys(values).forEach((key) => {
    if (!params.has(key)) return;
    const parsed = Number(params.get(key));
    if (VALUE_OPTIONS[key].includes(parsed)) values[key] = parsed;
  });
  return {
    values,
    region: params.get('region') === 'eu' ? 'eu' : 'us',
    language: params.get('lang') === 'ja' ? 'ja' : 'en',
  };
}

export function buildShareUrl(values, region, language) {
  const base =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'https://personalitycalculator.app/'
      : window.location.href;
  const url = new URL(base);
  url.search = '';
  url.searchParams.set('region', region);
  url.searchParams.set('lang', language);
  Object.entries(values).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return url.toString();
}

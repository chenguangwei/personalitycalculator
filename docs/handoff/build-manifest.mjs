import { writeFileSync, mkdirSync } from 'node:fs';
import { GENERIC_TESTS } from '/Users/chenguangwei/Documents/workspaceself/personality-calculator/src/pages/quiz/genericTestData.js';

const OUT = '/private/tmp/claude-502/-Users-chenguangwei-Documents-workspaceself-personality-calculator/6dc4169e-733c-4a24-a047-46b096020bdb/scratchpad/batches';
mkdirSync(OUT, { recursive: true });

const EXCLUDE = new Set(['attitudinal-psyche-style-test', 'tomodachi-life-personality-calculator']);

// Tier C — entertainment / pop-culture (no scientific basis possible)
const ENT = /(hogwarts|wizard-house|zodiac|aura|tarot|chakra|numerology|anime|disney|pokemon|marvel|star-wars|lord-of-the-rings|greek-god|mythology-archetype|hero-archetype|villain-archetype|dnd-alignment|fantasy-class|dosha|which-character|city-personality|food-personality|animal-personality|pet-personality|plant-parent|home-decor|travel-personality|vacation-vibe|movie-genre|music-personality|board-game|gamer-personality|gamer-role|bartle|fashion-personality|color-personality|color-code|aura-color|mental-age|would-you-rather|inner-child|shadow-personality|human-design|ikigai|principles-you|sparketype|charisma-archetype|creativity-archetype|artist-personality|writer-personality|teacher-personality|caregiver-personality|romantic-personality|dating-personality|true-colors|crystal-disc|morning-routine|digital-wellbeing|social-media-personality|semantic-differential|inventory-of-phonetic|chinese-zodiac|personal-style-aesthetic|charisma-test)/;

function classify(slug, category) {
  if (slug.includes('-style-') || slug.endsWith('-style-test')) return 'B';
  if (ENT.test(slug) || category === 'Fun' || category === 'Anime' || category === 'Games') return 'C';
  return 'A';
}

const manifest = GENERIC_TESTS
  .filter((t) => !EXCLUDE.has(t.slug))
  .map((t) => ({
    slug: t.slug,
    title: t.title,
    category: t.category,
    tier: classify(t.slug, t.category),
    dimensions: t.dimensions.map((d) => ({ key: d.key, label: d.label })),
    questions: t.questions.map((q) => ({ dim: q.dimension, text: q.text, reverse: !!q.reverse })),
  }));

// counts
const tiers = { A: 0, B: 0, C: 0 };
manifest.forEach((m) => tiers[m.tier]++);

// batch by ~8, keeping same-tier grouping loose (just sequential is fine)
const BATCH = 8;
const batches = [];
for (let i = 0; i < manifest.length; i += BATCH) batches.push(manifest.slice(i, i + BATCH));
batches.forEach((b, i) => {
  const name = `batch-${String(i).padStart(2, '0')}.json`;
  writeFileSync(`${OUT}/${name}`, JSON.stringify(b, null, 2));
});

writeFileSync(`${OUT}/_index.json`, JSON.stringify({ total: manifest.length, batchCount: batches.length, batchSize: BATCH, tiers }, null, 2));
console.log(JSON.stringify({ total: manifest.length, batchCount: batches.length, tiers }, null, 2));

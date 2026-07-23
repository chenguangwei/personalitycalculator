import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { filterTestsBySearch, getSearchPreviewTests } from '../src/pages/home/searchUtils.js';
import { GENERIC_TESTS } from '../src/pages/quiz/genericTestData.js';
import { GENERATED_TEST_CATALOG } from '../src/data/generatedTestCatalog.js';
import { TEST_TRANSLATIONS } from '../src/data/testTranslations.js';

const errors = [];
const REQUIRED_LIBRARY_EXPANSION_SLUGS = [
  'social-battery-test',
  'emotional-needs-test',
  'self-sabotage-test',
  'codependency-patterns-test',
  'loner-vs-socializer-test',
  'charisma-archetype-test',
  'friendship-attachment-style-test',
  'assertive-communication-test',
  'change-readiness-test',
  'personal-style-aesthetic-test',
  'personality-plus-temperament-test',
  'color-code-personality-test',
  'zodiac-personality-style-test',
  'chinese-zodiac-personality-style-test',
  'human-design-style-test',
  'numerology-personality-style-test',
  'which-character-are-you-test',
  'disney-character-personality-test',
  'marvel-hero-personality-test',
  'star-wars-character-test',
  'lord-of-the-rings-character-test',
  'pokemon-personality-match-test',
  'music-personality-test',
  'movie-genre-personality-test',
  'travel-personality-test',
  'food-personality-test',
  'home-decor-personality-test',
  'fashion-personality-test',
  'communication-love-style-test',
  'dating-personality-test',
  'breakup-style-test',
  'jealousy-trigger-test',
  'texting-style-test',
  'social-media-personality-test',
  'digital-wellbeing-personality-test',
  'online-communication-style-test',
  'friendship-boundaries-test',
  'emotional-dependency-test',
  'abandonment-sensitivity-test',
  'vulnerability-style-test',
  'self-worth-style-test',
  'conflict-resolution-style-test',
  'forgiveness-readiness-test',
  'trust-issues-test',
  'leadership-motivation-style-test',
  'team-player-style-test',
  'sales-personality-test',
  'customer-service-style-test',
  'founder-personality-test',
  'teacher-personality-test',
  'caregiver-personality-test',
  'creativity-archetype-test',
  'writer-personality-test',
  'artist-personality-test',
  'villain-archetype-test',
  'hero-archetype-test',
  'greek-god-archetype-test',
  'mythology-archetype-test',
  'tarot-personality-style-test',
  'fantasy-class-personality-test',
  'gamer-role-test',
  'board-game-personality-test',
  'pet-personality-match-test',
  'plant-parent-personality-test',
  'city-personality-test',
  'vacation-vibe-test',
  'morning-routine-personality-test',
  'pressure-personality-test',
  'via-character-strengths-profile-test',
  'cliftonstrengths-domains-test',
  'caliper-style-personality-test',
  'thomas-kilmann-conflict-mode-test',
  'social-styles-model-test',
  'adizes-management-style-test',
  'servant-leadership-style-test',
  'emotional-labor-style-test',
  'workplace-motivation-needs-test',
  'psychological-safety-orientation-test',
  'hardiness-resilience-test',
  'life-orientation-optimism-test',
  'rumination-reflection-test',
  'loneliness-pattern-test',
  'self-determination-needs-test',
  'anger-expression-style-test',
  'body-language-style-test',
  'sensory-processing-sensitivity-test',
  'hope-scale-style-test',
  'self-handicapping-test',
  'person-organization-fit-test',
  'change-style-indicator-test',
  'communication-accommodation-style-test',
  'limerence-style-test',
  'neris-personality-type-test',
  'sakinorva-style-cognitive-functions-test',
  'classic-jungian-type-test',
  'personality-database-type-test',
  'global-5-sloan-test',
  'enneagram-subtypes-test',
  'enneagram-harmonic-groups-test',
  'enneagram-hornevian-groups-test',
  'attitudinal-psyche-style-test',
  'temperament-blends-test',
  'aura-personality-test',
  'chakra-personality-test',
  'dosha-personality-test',
  'humanmetrics-jung-typology-style-test',
  'personalitymax-style-test',
  'typefinder-style-test',
  'sociotype-test',
  'socionics-quadra-test',
  'love-attitudes-test',
  'romantic-attachment-test',
  'gallup-strengthsfinder-top-five-test',
  'principles-you-archetype-test',
  'crystal-disc-personality-test',
  'workstyle-personality-test',
  'truity-career-personality-profiler-test',
  'msceit-style-emotional-intelligence-test',
  'eq-i-2-style-emotional-intelligence-test',
  'baron-eq-style-test',
  'bfi-2-big-five-test',
  'big-five-inventory-10-test',
  'mini-markers-big-five-test',
  'cattell-16pf-style-test',
  'red-flag-green-flag-test',
  'toxic-traits-test',
  'inner-child-personality-test',
  'childhood-wounds-test',
  'mental-age-personality-test',
  'self-love-language-test',
  'conflict-attachment-style-test',
  'dating-standards-test',
  'open-extended-jungian-type-scales-test',
  'open-disc-assessment-test',
  'short-dark-triad-test',
  'firstborn-personality-scale-test',
  'protestant-work-ethic-scale-test',
  'nerdy-personality-attributes-test',
  'nature-relatedness-scale-test',
  'nonverbal-immediacy-scale-test',
  'interpersonal-problems-circumplex-test',
  'big-five-aspects-scale-test',
  'adult-hope-scale-test',
  'life-orientation-test-revised',
  'satisfaction-with-life-scale-style-test',
  'self-report-altruism-scale-test',
  'brief-self-control-scale-test',
  'need-to-belong-scale-test',
  'authenticity-scale-style-test',
  'mindful-attention-awareness-scale-test',
  'self-consciousness-scale-test',
  'social-connectedness-scale-test',
  'neo-ffi-style-test',
  'epq-r-style-personality-test',
  'bernreuter-personality-inventory-style-test',
  'rorschach-inkblot-style-test',
  'thematic-apperception-style-test',
  'sentence-completion-style-test',
  'rotter-incomplete-sentences-style-test',
  'projective-personality-style-test',
  'q-sort-personality-test',
  'woodworth-psychoneurotic-inventory-style-test',
  'multidimensional-introversion-extraversion-scales-test',
  'open-hemispheric-brain-dominance-scale-test',
  'rosenberg-self-esteem-scale-test',
  'inventory-of-phonetic-associations-test',
  'artistic-preferences-personality-test',
  'dictionary-based-isms-personality-test',
  'forte-profile-style-test',
  'swedish-universities-scales-of-personality-test',
  'jackson-personality-research-form-test',
  'nonverbal-personality-questionnaire-style-test',
  'house-tree-person-style-test',
  'draw-a-person-style-test',
  'warteg-drawing-completion-style-test',
  'temas-storytelling-style-test',
  'make-a-picture-story-style-test',
  'tell-me-a-story-style-test',
  'semantic-differential-personality-test',
  'personal-orientation-inventory-style-test',
  'fundamental-interpersonal-relations-orientation-test',
  'interpersonal-adjective-scales-test',
  'leary-interpersonal-checklist-style-test',
  'circumplex-scales-of-interpersonal-values-test',
  'self-monitoring-scale-test',
  'marlowe-crowne-social-desirability-scale-test',
  'generalized-anxiety-personality-style-test',
  'beck-hopelessness-style-test',
  'zimbardo-time-perspective-inventory-test',
  'future-time-perspective-test',
  'consideration-of-future-consequences-test',
  'maximization-scale-test',
  'temperament-evaluation-of-memphis-pisa-san-diego-style-test',
  'cyclothymic-temperament-style-test',
  'hyperthymic-temperament-style-test',
  'affective-temperament-test',
  'adult-self-report-personality-style-test',
  'scl-90-personality-distress-style-test',
  'brief-symptom-inventory-style-test',
  'depression-anxiety-stress-scales-style-test',
  'perceived-stress-scale-style-test',
  'psychological-capital-questionnaire-style-test',
  'grit-scale-short-test',
  'academic-motivation-style-test',
  'work-values-inventory-test',
  'vocational-preference-inventory-style-test',
  'career-maturity-inventory-style-test',
  'occupational-personality-questionnaire-32-style-test',
  'global-personality-inventory-style-test',
  'personality-belief-questionnaire-style-test',
  'young-schema-questionnaire-style-test',
  'career-decision-difficulties-style-test',
  'coping-orientation-to-problems-experienced-style-test',
  'brief-cope-style-test',
  'ways-of-coping-style-test',
  'positive-and-negative-affect-schedule-style-test',
  'flourishing-scale-style-test',
  'psychological-well-being-scales-style-test',
  'subjective-happiness-scale-style-test',
  'self-determination-scale-style-test',
  'basic-empathy-scale-style-test',
  'toronto-alexithymia-scale-style-test',
  'emotion-regulation-questionnaire-style-test',
  'difficulties-in-emotion-regulation-style-test',
  'ruminative-responses-style-test',
  'self-consciousness-scale-style-test',
  'private-self-consciousness-style-test',
  'public-self-consciousness-style-test',
  'fear-of-negative-evaluation-style-test',
  'interaction-anxiousness-style-test',
  'social-avoidance-distress-style-test',
  'loneliness-scale-style-test',
  'ten-item-personality-inventory-test',
  'big-five-inventory-2-style-test',
  'mini-ipip-style-test',
  'neo-pi-r-style-test',
  'neo-five-factor-inventory-style-test',
  'adjective-check-list-style-test',
  'q-sort-personality-style-test',
  'acceptance-and-action-questionnaire-style-test',
  'cognitive-emotion-regulation-questionnaire-style-test',
  'mindful-attention-awareness-scale-style-test',
  'five-facet-mindfulness-questionnaire-style-test',
  'distress-tolerance-scale-style-test',
  'self-regulation-questionnaire-style-test',
  'gratitude-questionnaire-style-test',
  'meaning-in-life-questionnaire-style-test',
  'purpose-in-life-style-test',
  'social-connectedness-scale-style-test',
  'need-to-belong-scale-style-test',
  'multidimensional-scale-of-perceived-social-support-style-test',
  'interpersonal-trust-scale-style-test',
];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function verifyCatalog() {
  const seenSlugs = new Set();
  let questionCount = 0;

  GENERIC_TESTS.forEach((test) => {
    assert(test.slug && /^[a-z0-9-]+$/.test(test.slug), `Invalid slug: ${test.slug}`);
    assert(!seenSlugs.has(test.slug), `Duplicate slug: ${test.slug}`);
    seenSlugs.add(test.slug);
    assert(test.title, `Missing title: ${test.slug}`);
    assert(test.intro, `Missing intro: ${test.slug}`);
    assert(test.category, `Missing category: ${test.slug}`);
    assert(test.time, `Missing time estimate: ${test.slug}`);
    assert(test.dimensions.length >= 2, `Too few dimensions: ${test.slug}`);
    assert(test.questions.length >= 8, `Too few questions: ${test.slug}`);

    const dimensionKeys = new Set(test.dimensions.map((dimension) => dimension.key));
    test.dimensions.forEach((dimension) => {
      assert(dimension.key, `Missing dimension key: ${test.slug}`);
      assert(dimension.label, `Missing dimension label: ${test.slug}`);
      assert(dimension.title, `Missing dimension title: ${test.slug}:${dimension.key}`);
      assert(dimension.summary, `Missing dimension summary: ${test.slug}:${dimension.key}`);
    });

    test.questions.forEach((question) => {
      questionCount += 1;
      assert(question.id, `Missing question id: ${test.slug}`);
      assert(question.text, `Missing question text: ${test.slug}:${question.id}`);
      assert(dimensionKeys.has(question.dimension), `Bad question dimension: ${test.slug}:${question.id}:${question.dimension}`);
    });
  });

  assert(GENERIC_TESTS.length >= 581, `Expected at least 581 generic tests, found ${GENERIC_TESTS.length}`);
  REQUIRED_LIBRARY_EXPANSION_SLUGS.forEach((slug) => {
    assert(seenSlugs.has(slug), `Missing required library expansion test: ${slug}`);
  });

  return { genericTests: GENERIC_TESTS.length, genericQuestions: questionCount };
}

function verifyBuiltPages() {
  if (!existsSync('dist')) return { skipped: true };

  const missingHtml = GENERIC_TESTS.filter((test) => !existsSync(`dist/${test.slug}.html`)).map((test) => test.slug);
  assert(missingHtml.length === 0, `Missing built HTML pages: ${missingHtml.join(', ')}`);

  const sitemapPath = 'dist/sitemap.xml';
  assert(existsSync(sitemapPath), 'Missing dist/sitemap.xml');
  if (existsSync(sitemapPath)) {
    const sitemap = readFileSync(sitemapPath, 'utf8');
    const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    assert(urls.length === GENERIC_TESTS.length + 5, `Expected ${GENERIC_TESTS.length + 5} sitemap URLs, found ${urls.length}`);
  }

  const assetsPath = 'dist/assets';
  if (existsSync(assetsPath)) {
    const assets = readdirSync(assetsPath);
    const genericPageChunks = assets.filter((asset) => asset.startsWith('GenericTestPage-') && asset.endsWith('.js'));
    assert(genericPageChunks.length > 0, 'Missing GenericTestPage runtime chunk');
    genericPageChunks.forEach((chunk) => {
      const size = statSync(`${assetsPath}/${chunk}`).size;
      assert(size < 120000, `GenericTestPage chunk is too large: ${chunk} is ${size} bytes`);
    });
    assert(!assets.some((asset) => asset.startsWith('genericTestData-')), 'Full genericTestData source emitted as a runtime chunk');
  }

  return { skipped: false };
}

function verifyTomodachiHelp() {
  const source = readFileSync('src/pages/tomodachi/TomodachiPage.jsx', 'utf8');
  assert(source.includes('helpOpen'), 'Tomodachi help state is missing');
  assert(/className="help-button"[\s\S]*onClick=\{\(\) => setHelpOpen\(true\)\}/.test(source), 'Tomodachi help button does not open help content');
  assert(source.includes('TomodachiHelpPanel'), 'Tomodachi help panel component is missing');
}

function verifyCatalogBundleBoundary() {
  const source = readFileSync('src/data/tests.jsx', 'utf8');
  assert(!source.includes("pages/quiz/genericTestData"), 'Home test catalog imports full quiz data instead of generated lightweight metadata');
  assert(source.includes('generatedTestCatalog'), 'Home test catalog does not use generated lightweight metadata');
  if (existsSync('src/data/generatedTestCatalog.js')) {
    const generatedSize = readFileSync('src/data/generatedTestCatalog.js', 'utf8').length;
    assert(generatedSize < 260000, `Generated home catalog is too large: ${generatedSize} bytes`);
  }
}

function verifyCoreEntrypoints() {
  const routeSource = readFileSync('src/main.jsx', 'utf8');
  assert(routeSource.includes("pageSlug === 'mbti-personality-test'"), 'Router does not support the clean MBTI path');
  assert(
    routeSource.includes("pageSlug === 'which-infp-avatar-represents-you'"),
    'Router does not support the clean MBTI avatar page path',
  );
  assert(
    routeSource.includes("pageSlug === 'tomodachi-life-personality-calculator'"),
    'Router does not support the clean Tomodachi path',
  );
  assert(routeSource.includes("pageSlug === 'mbti-card-draw'"), 'Router does not support the clean MBTI card draw path');
  assert(routeSource.includes('replace(/\\.html$/'), 'Router does not normalize .html and clean page slugs');

  const catalogSource = readFileSync('src/data/tests.jsx', 'utf8');
  const mbtiIndex = catalogSource.indexOf("title: 'MBTI Test'");
  const mbtiCardDrawIndex = catalogSource.indexOf("title: 'MBTI Card Draw'");
  const tomodachiIndex = catalogSource.indexOf("title: 'Tomodachi Life Personality Calculator'");
  const genericCatalogIndex = catalogSource.indexOf('...GENERIC_CATALOG');
  assert(mbtiIndex !== -1, 'Homepage catalog is missing the MBTI card');
  assert(mbtiCardDrawIndex !== -1, 'Homepage catalog is missing the MBTI card draw card');
  assert(tomodachiIndex !== -1, 'Homepage catalog is missing the Tomodachi card');
  assert(
    tomodachiIndex !== -1 && genericCatalogIndex !== -1 && tomodachiIndex < genericCatalogIndex,
    'Tomodachi card is not prominent in the homepage catalog',
  );
}

function verifyQuizRuntimeBoundary() {
  const source = readFileSync('src/pages/quiz/GenericTestPage.jsx', 'utf8');
  assert(!source.includes('./genericTestData'), 'Generic quiz page imports the full source question bank at runtime');
  assert(source.includes('generatedTestLoaders'), 'Generic quiz page does not use generated per-test loaders');
  assert(existsSync('src/data/generatedTestLoaders.js'), 'Generated test loader index is missing');
  assert(existsSync('src/data/generated-tests'), 'Generated per-test module directory is missing');
}

function verifyGenericResultCard() {
  const source = readFileSync('src/pages/quiz/GenericTestPage.jsx', 'utf8');
  assert(source.includes("import { toPng } from 'html-to-image'"), 'Generic quiz page cannot render downloadable result cards');
  assert(source.includes('downloadResultCard'), 'Generic quiz page is missing a result-card download action');
  assert(source.includes('quiz-result-card'), 'Generic quiz page does not render a downloadable result card');
}

function verifySuggestionQueue() {
  const source = readFileSync('src/pages/home/HomePage.jsx', 'utf8');
  assert(source.includes('savedSuggestions'), 'Homepage does not expose saved suggestions state');
  assert(source.includes('suggestion-list'), 'Homepage does not render saved suggestion list');
  assert(source.includes('removeSuggestion'), 'Homepage cannot remove saved suggestions');
  assert(source.includes('suggestionMailto'), 'Homepage cannot email a saved suggestion');
}

function verifyHomepageSearch() {
  const lightTriadResults = filterTestsBySearch(GENERATED_TEST_CATALOG, {
    query: 'light triad test',
    activeCategory: 'All',
  });
  assert(
    lightTriadResults.some((test) => test.slug === 'light-triad-test'),
    'Homepage search does not find Light Triad Test for "light triad test"',
  );

  const splitTermResults = filterTestsBySearch(GENERATED_TEST_CATALOG, {
    query: 'triad light',
    activeCategory: 'All',
  });
  assert(
    splitTermResults.some((test) => test.slug === 'light-triad-test'),
    'Homepage search does not match split query terms across title/search text',
  );

  const careerResults = filterTestsBySearch(GENERATED_TEST_CATALOG, {
    query: 'leadership',
    activeCategory: 'Career',
  });
  assert(
    careerResults.length > 0 && careerResults.every((test) => test.category === 'Career'),
    'Homepage search does not respect category filters',
  );

  const previewResults = getSearchPreviewTests(lightTriadResults, 6);
  assert(previewResults.length > 0 && previewResults.length <= 6, 'Homepage search preview is not capped');
}

function verifyTestTranslations() {
  const testsBySlug = new Map(GENERIC_TESTS.map((test) => [test.slug, test]));

  Object.entries(TEST_TRANSLATIONS).forEach(([locale, entries]) => {
    Object.entries(entries).forEach(([slug, translated]) => {
      const test = testsBySlug.get(slug);
      // Non-generic pages (MBTI, Tomodachi, avatar cards) are translated here
      // too but live outside GENERIC_TESTS; only slug-matched tests are checked.
      if (!test) return;

      if (Array.isArray(translated.questions)) {
        assert(
          translated.questions.length === test.questions.length,
          `Translation question count mismatch: ${locale}/${slug} has ${translated.questions.length}, test has ${test.questions.length}`,
        );
      }
      if (translated.dimensions) {
        const dimensionKeys = new Set(test.dimensions.map((dimension) => dimension.key));
        Object.keys(translated.dimensions).forEach((key) => {
          assert(dimensionKeys.has(key), `Translation references unknown dimension: ${locale}/${slug}:${key}`);
        });
      }
    });
  });
}

const catalog = verifyCatalog();
const builtPages = verifyBuiltPages();
verifyTestTranslations();
verifyTomodachiHelp();
verifyCatalogBundleBoundary();
verifyCoreEntrypoints();
verifyQuizRuntimeBoundary();
verifyGenericResultCard();
verifySuggestionQueue();
verifyHomepageSearch();

if (errors.length) {
  console.error(`Site verification failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      genericTests: catalog.genericTests,
      genericQuestions: catalog.genericQuestions,
      builtPagesChecked: !builtPages.skipped,
    },
    null,
    2,
  ),
);

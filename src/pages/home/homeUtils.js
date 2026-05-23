import { SUGGESTION_STORAGE_KEY } from './homeContent.jsx';

export function pickTests(tests, slugs) {
  const bySlug = new Map(tests.map((test) => [test.slug, test]));
  return slugs.map((slug) => bySlug.get(slug)).filter(Boolean);
}

export function localizedText(value, locale) {
  return value?.[locale] || value?.en || '';
}

export function loadSavedSuggestions() {
  try {
    const saved = JSON.parse(localStorage.getItem(SUGGESTION_STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((entry) => entry?.testName).slice(0, 50) : [];
  } catch {
    return [];
  }
}

export function suggestionMailto(entry) {
  const subject = encodeURIComponent(`Personality test suggestion: ${entry.testName}`);
  const body = encodeURIComponent(
    [
      `Test name: ${entry.testName}`,
      entry.dimensions ? `What it should measure: ${entry.dimensions}` : '',
      entry.name ? `Suggested by: ${entry.name}` : '',
    ]
      .filter(Boolean)
      .join('\n\n'),
  );
  return `mailto:hello@personalitycalculator.org?subject=${subject}&body=${body}`;
}

export function categoryLabel(category, copy) {
  if (category === 'All') return copy.allCategory;
  return copy.categoryNames[category] || category;
}

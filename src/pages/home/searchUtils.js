export const DEFAULT_SEARCH_PREVIEW_LIMIT = 6;

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function searchableTextFor(test) {
  return normalizeSearchText(
    [
      test.title,
      test.description,
      test.category,
      test.categoryLabel,
      test.slug,
      test.searchText,
    ].filter(Boolean).join(' '),
  );
}

export function normalizeSearchQuery(query) {
  return normalizeSearchText(query);
}

export function matchesTestSearch(test, query, globalSearchTerms = new Set()) {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery || globalSearchTerms.has(normalizedQuery)) return true;

  const haystack = searchableTextFor(test);
  if (haystack.includes(normalizedQuery)) return true;

  return normalizedQuery.split(' ').every((term) => haystack.includes(term));
}

export function filterTestsBySearch(tests, { query = '', activeCategory = 'All', globalSearchTerms = new Set() } = {}) {
  return tests.filter((test) => {
    const categoryMatch = activeCategory === 'All' || test.category === activeCategory;
    return categoryMatch && matchesTestSearch(test, query, globalSearchTerms);
  });
}

export function getSearchPreviewTests(tests, limit = DEFAULT_SEARCH_PREVIEW_LIMIT) {
  return tests.slice(0, limit);
}

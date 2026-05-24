import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpenText,
  Brain,
  ChevronDown,
  CheckCircle2,
  FileQuestion,
  Mail,
  Search,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { CATEGORIES, TESTS } from '../../data/tests.jsx';
import {
  CHALLENGE_GROUPS,
  DISCOVERY_COPY,
  FRESH_TEST_SLUGS,
  GLOBAL_SEARCH_TERMS,
  HOT_TEST_SLUGS,
  LOCALE_COPY,
  SUGGESTION_STORAGE_KEY,
} from './homeContent.jsx';
import { categoryLabel, loadSavedSuggestions, localizedText, pickTests, suggestionMailto } from './homeUtils.js';
import { FeaturedTestCard, HeroIllustration, MiniTestCard, TestCard } from './components/HomeCards.jsx';
import { localizeTest } from '../../data/testTranslations.js';
import { detectLocale, formatDuration, LOCALE_LABELS, SUPPORTED_LOCALES, syncLocale } from '../../i18n.js';

export function HomePage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [locale, setLocale] = useState(detectLocale);
  const [activeGuideTopic, setActiveGuideTopic] = useState('all');
  const [suggestion, setSuggestion] = useState({ name: '', testName: '', dimensions: '' });
  const [suggestionStatus, setSuggestionStatus] = useState('');
  const [savedSuggestions, setSavedSuggestions] = useState([]);
  const searchRef = useRef(null);
  const testSectionRef = useRef(null);
  const copy = LOCALE_COPY[locale];
  const discoveryCopy = DISCOVERY_COPY[locale] || DISCOVERY_COPY.en;
  const localizedTests = useMemo(() => TESTS.map((test) => localizeTest(test, locale)), [locale]);
  const featuredTests = localizedTests.slice(0, 6);
  const hotTests = useMemo(() => pickTests(localizedTests, HOT_TEST_SLUGS), [localizedTests]);
  const freshTests = useMemo(() => pickTests(localizedTests, FRESH_TEST_SLUGS), [localizedTests]);
  const challengeGroups = useMemo(
    () =>
      CHALLENGE_GROUPS.map((group) => ({
        ...group,
        tests: pickTests(localizedTests, group.slugs),
      })).filter((group) => group.tests.length > 0),
    [localizedTests],
  );
  const testCount = TESTS.length;
  const questionCount = TESTS.reduce((sum, test) => sum + test.questions, 0);
  const filteredTests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return localizedTests.filter((test) => {
      const categoryMatch = activeCategory === 'All' || test.category === activeCategory;
      const queryMatch =
        !normalizedQuery ||
        GLOBAL_SEARCH_TERMS.has(normalizedQuery) ||
        test.searchText.includes(normalizedQuery);
      return categoryMatch && queryMatch;
    });
  }, [activeCategory, localizedTests, query]);
  const filteredGuides = useMemo(
    () =>
      activeGuideTopic === 'all'
        ? copy.guideCards
        : copy.guideCards.filter((article) => article.topic === activeGuideTopic),
    [activeGuideTopic, copy],
  );

  useEffect(() => {
    setSavedSuggestions(loadSavedSuggestions());
  }, []);

  useEffect(() => {
    syncLocale(locale);
  }, [locale]);

  function updateSuggestion(field, value) {
    setSuggestion((current) => ({ ...current, [field]: value }));
    if (suggestionStatus) setSuggestionStatus('');
  }

  function saveSuggestion(event) {
    event.preventDefault();
    const testName = suggestion.testName.trim();
    if (!testName) {
      setSuggestionStatus(copy.suggestionRequired);
      return;
    }

    const entry = {
      name: suggestion.name.trim(),
      testName,
      dimensions: suggestion.dimensions.trim(),
      locale,
      createdAt: new Date().toISOString(),
    };

    try {
      const saved = loadSavedSuggestions();
      const next = Array.isArray(saved) ? [entry, ...saved].slice(0, 50) : [entry];
      localStorage.setItem(SUGGESTION_STORAGE_KEY, JSON.stringify(next));
      setSavedSuggestions(next);
      setSuggestion({ name: '', testName: '', dimensions: '' });
      setSuggestionStatus(copy.suggestionSaved);
    } catch {
      window.location.href = suggestionMailto(entry);
    }
  }

  function removeSuggestion(indexToRemove) {
    const next = savedSuggestions.filter((_, index) => index !== indexToRemove);
    setSavedSuggestions(next);
    try {
      localStorage.setItem(SUGGESTION_STORAGE_KEY, JSON.stringify(next));
    } catch {
      setSuggestionStatus('');
    }
  }

  function selectCategory(label) {
    setActiveCategory(label);
    requestAnimationFrame(() => {
      testSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  return (
    <main className="landing-app">
      <header className="site-header">
        <a className="landing-brand" href="/" aria-label="personality-calculator home">
          <span className="landing-brand-mark">
            <Brain size={23} />
          </span>
          <span>personality-calculator</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#tests">{copy.tests}</a>
          <a href="#categories">{copy.categories} <ChevronDown size={14} /></a>
          <a href="#articles">{copy.articles}</a>
          <a href="#about">{copy.about}</a>
          <a href="#contact">{copy.contact}</a>
        </nav>
        <div className="header-actions">
          <button className="search-icon-button" aria-label="Focus search" onClick={() => searchRef.current?.focus()}>
            <Search size={20} />
          </button>
          <div className="language-links" aria-label="Languages">
            {SUPPORTED_LOCALES.map((item, index) => (
              <Fragment key={item}>
                {index > 0 && <span>|</span>}
                <button type="button" className={locale === item ? 'active' : ''} onClick={() => setLocale(item)}>
                  {LOCALE_LABELS[item]}
                </button>
              </Fragment>
            ))}
          </div>
        </div>
      </header>

      <div className="landing-layout">
        <aside className="category-sidebar" id="categories" aria-label="Test categories">
          <h2>{copy.categories}</h2>
          <div className="category-list">
            {[{ label: 'All', icon: Sparkles }, ...CATEGORIES].map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                className={activeCategory === label ? 'active' : ''}
                aria-pressed={activeCategory === label}
                onClick={() => selectCategory(label)}
              >
                <Icon size={23} />
                <span>{categoryLabel(label, copy)}</span>
              </button>
            ))}
          </div>
          <div className="free-card">
            <Trophy size={31} />
            <strong>{copy.freeTitle}</strong>
            <p>{copy.freeBody}</p>
          </div>
        </aside>

        <section className="landing-main" id="tests">
          <form className="hero-search" role="search" onSubmit={(event) => event.preventDefault()}>
            <Search size={20} />
            <input
              ref={searchRef}
              type="search"
              placeholder={copy.searchPlaceholder}
              aria-label="Search tests"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="button" onClick={() => setQuery('')}>{query ? copy.clear : copy.search}</button>
          </form>

          <section className="landing-hero">
            <div className="hero-copy">
              <h1>
                {copy.heroTitle} <span>{copy.heroAccent}</span>
              </h1>
              <p>{copy.heroBody(testCount)}</p>
            </div>
            <HeroIllustration />
          </section>

          <div className="featured-strip" aria-label="Featured personality tests">
            {featuredTests.map((test) => (
              <FeaturedTestCard key={test.href} test={test} copy={copy} locale={locale} />
            ))}
          </div>

          <section className="discovery-section" aria-labelledby="hot-tests-title">
            <div className="section-head discovery-head">
              <div>
                <h2 id="hot-tests-title">{discoveryCopy.hotTitle}</h2>
                <p>{discoveryCopy.hotBody}</p>
              </div>
              <a href="#tests">{copy.viewAll} <span aria-hidden="true">→</span></a>
            </div>
            <div className="discovery-grid">
              {hotTests.map((test, index) => (
                <MiniTestCard key={test.href} test={test} copy={copy} locale={locale} rank={index + 1} />
              ))}
            </div>
          </section>

          <section className="discovery-section compact" aria-labelledby="fresh-tests-title">
            <div className="section-head discovery-head">
              <div>
                <h2 id="fresh-tests-title">{discoveryCopy.freshTitle}</h2>
                <p>{discoveryCopy.freshBody}</p>
              </div>
            </div>
            <div className="fresh-scroll" aria-label={discoveryCopy.freshTitle}>
              {freshTests.map((test) => (
                <MiniTestCard key={test.href} test={test} copy={copy} locale={locale} />
              ))}
            </div>
          </section>

          <section className="challenge-section" aria-labelledby="challenge-title">
            <div className="section-head discovery-head">
              <div>
                <h2 id="challenge-title">{discoveryCopy.challengesTitle}</h2>
                <p>{discoveryCopy.challengesBody}</p>
              </div>
            </div>
            <div className="challenge-grid">
              {challengeGroups.map((group) => (
                <article className="challenge-card" key={group.slugs.join('-')}>
                  <div className="challenge-card-top">
                    <span className="landing-icon small violet">
                      <Trophy size={18} />
                    </span>
                    <strong>{discoveryCopy.challengeProgress(group.tests.length)}</strong>
                  </div>
                  <h3>{localizedText(group.title, locale)}</h3>
                  <p>{localizedText(group.body, locale)}</p>
                  <div className="challenge-links">
                    {group.tests.map((test) => (
                      <a href={test.href} key={test.href}>{test.title}</a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="test-section" ref={testSectionRef}>
            <div className="section-head">
              <h2>{activeCategory === 'All' ? copy.library : copy.categoryTitle(categoryLabel(activeCategory, copy))}</h2>
              <button type="button" onClick={() => { setActiveCategory('All'); setQuery(''); }}>
                {copy.viewAll} <span aria-hidden="true">→</span>
              </button>
            </div>
            <div className="test-grid">
              {filteredTests.map((test) => (
                <TestCard key={test.href} test={test} copy={copy} locale={locale} />
              ))}
            </div>
            {filteredTests.length === 0 && (
              <div className="empty-tests">
                <FileQuestion size={28} />
                <strong>{copy.noMatches}</strong>
                <p>{copy.noMatchesBody}</p>
              </div>
            )}
          </section>

          <section className="benefit-band" aria-label="Benefits">
            {copy.benefits.map(([title, body, Icon, tone], index) => (
              <article key={title}>
                <span className={`landing-icon ${tone}`}>
                  <Icon size={25} />
                </span>
                <h3>{index === 0 ? `${testCount}+ ${title}` : title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </section>

          <section className="content-section guide-section" id="articles" aria-labelledby="articles-title">
            <div className="content-section-head">
              <span className="landing-icon small blue">
                <BookOpenText size={20} />
              </span>
              <div>
                <h2 id="articles-title">{copy.articlesTitle}</h2>
                <p>{copy.articlesBody}</p>
              </div>
            </div>
            <div className="guide-topic-tabs" aria-label={copy.articlesTitle}>
              {copy.guideTopics.map(([topic, label]) => (
                <button
                  key={topic}
                  type="button"
                  className={activeGuideTopic === topic ? 'active' : ''}
                  onClick={() => setActiveGuideTopic(topic)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="article-grid">
              {filteredGuides.map((article) => (
                <a className="article-card" href={article.href} key={article.title}>
                  <span className="article-meta">{article.readTime} · {article.related}</span>
                  <strong>{article.title}</strong>
                  <p>{article.body}</p>
                  <span>{copy.start} <span aria-hidden="true">→</span></span>
                </a>
              ))}
            </div>
          </section>

          <section className="content-section about-section" id="about" aria-labelledby="about-title">
            <div>
              <span className="landing-icon small green">
                <CheckCircle2 size={20} />
              </span>
              <h2 id="about-title">{copy.aboutTitle}</h2>
              <p>{copy.aboutBody}</p>
            </div>
            <ul>
              {copy.aboutStats(testCount, questionCount).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="content-section contact-section" id="contact" aria-labelledby="contact-title">
            <div>
              <span className="landing-icon small violet">
                <Mail size={20} />
              </span>
              <h2 id="contact-title">{copy.contactTitle}</h2>
              <p>{copy.contactBody}</p>
            </div>
            <form className="suggestion-form" onSubmit={saveSuggestion}>
              <label>
                <span>{copy.suggestionName}</span>
                <input
                  value={suggestion.name}
                  onChange={(event) => updateSuggestion('name', event.target.value)}
                  placeholder={copy.suggestionNamePlaceholder}
                />
              </label>
              <label>
                <span>{copy.suggestionTest}</span>
                <input
                  value={suggestion.testName}
                  onChange={(event) => updateSuggestion('testName', event.target.value)}
                  placeholder={copy.suggestionTestPlaceholder}
                  required
                />
              </label>
              <label>
                <span>{copy.suggestionDimensions}</span>
                <textarea
                  value={suggestion.dimensions}
                  onChange={(event) => updateSuggestion('dimensions', event.target.value)}
                  placeholder={copy.suggestionDimensionsPlaceholder}
                  rows={4}
                />
              </label>
              {suggestionStatus && <p className="suggestion-status" role="status">{suggestionStatus}</p>}
              <div className="suggestion-actions">
                <button type="submit">{copy.suggestionSubmit}</button>
                <a href="mailto:hello@personalitycalculator.org?subject=Personality%20test%20suggestion">{copy.suggestionEmail}</a>
              </div>
            </form>
            <section className="suggestion-queue" aria-label={copy.savedSuggestionsTitle}>
              <h3>{copy.savedSuggestionsTitle}</h3>
              {savedSuggestions.length === 0 ? (
                <p>{copy.savedSuggestionsEmpty}</p>
              ) : (
                <div className="suggestion-list">
                  {savedSuggestions.map((entry, index) => (
                    <article key={`${entry.testName}-${entry.createdAt || index}`}>
                      <div>
                        <strong>{entry.testName}</strong>
                        {entry.dimensions && <p>{entry.dimensions}</p>}
                        <small>{copy.suggestedBy}: {entry.name || copy.anonymousSuggestion}</small>
                      </div>
                      <div className="suggestion-item-actions">
                        <a href={suggestionMailto(entry)}>{copy.sendSuggestion}</a>
                        <button type="button" onClick={() => removeSuggestion(index)}>{copy.removeSuggestion}</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </section>
        </section>
      </div>
    </main>
  );
}

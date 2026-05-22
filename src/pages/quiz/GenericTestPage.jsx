import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowDownToLine,
  Brain,
  Check,
  Clipboard,
  Clock3,
  FileQuestion,
  RotateCcw,
  Share2,
  Sparkles,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { TEST_LOADERS } from '../../data/generatedTestLoaders.js';
import {
  COMMON_COPY,
  detectLocale,
  formatDuration,
  localizedAnswerLabels,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  syncLocale,
} from '../../i18n.js';
import { copyText } from '../../utils/clipboard.js';

const QUIZ_COPY = {
  en: {
    progressReady: 'Your result is ready.',
    progressLocked: 'Answer every question to unlock your result.',
    showResult: 'Show Result',
    strongestMatch: 'Your strongest match',
    secondaryPattern: 'Secondary pattern',
    strengths: 'Strengths',
    growthFocus: 'Growth focus',
    scoreBreakdown: 'Score breakdown',
    shareText: (result, test) => `I got ${result.primary.title} on the ${test.title}.`,
    completeLabel: (progress) => `${progress}% complete`,
    answeredLabel: (answered, total) => `${answered} of ${total} answered`,
    questionLabel: (index) => `Question ${index}`,
  },
  zh: {
    progressReady: '你的结果已准备好。',
    progressLocked: '答完所有题目即可解锁结果。',
    showResult: '查看结果',
    strongestMatch: '最匹配的结果',
    secondaryPattern: '次要模式',
    strengths: '优势',
    growthFocus: '成长重点',
    scoreBreakdown: '分数明细',
    shareText: (result, test) => `我在 ${test.title} 中得到 ${result.primary.title}。`,
    completeLabel: (progress) => `${progress}% 完成`,
    answeredLabel: (answered, total) => `${answered}/${total} 已答`,
    questionLabel: (index) => `第 ${index} 题`,
  },
  ja: {
    progressReady: '結果の準備ができました。',
    progressLocked: 'すべての質問に答えると結果を表示できます。',
    showResult: '結果を見る',
    strongestMatch: '最も強い一致',
    secondaryPattern: '二番目の傾向',
    strengths: '強み',
    growthFocus: '成長ポイント',
    scoreBreakdown: 'スコア内訳',
    shareText: (result, test) => `${test.title}で ${result.primary.title} になりました。`,
    completeLabel: (progress) => `${progress}% 完了`,
    answeredLabel: (answered, total) => `${answered}/${total} 回答済み`,
    questionLabel: (index) => `質問 ${index}`,
  },
  ko: {
    progressReady: '결과가 준비되었습니다.',
    progressLocked: '모든 문항에 답하면 결과를 확인할 수 있습니다.',
    showResult: '결과 보기',
    strongestMatch: '가장 강한 매치',
    secondaryPattern: '보조 패턴',
    strengths: '강점',
    growthFocus: '성장 포인트',
    scoreBreakdown: '점수 분석',
    shareText: (result, test) => `${test.title}에서 ${result.primary.title} 결과가 나왔습니다.`,
    completeLabel: (progress) => `${progress}% 완료`,
    answeredLabel: (answered, total) => `${answered}/${total} 응답`,
    questionLabel: (index) => `문항 ${index}`,
  },
};

const CATEGORY_THEMES = {
  Social: {
    primary: '#2563eb',
    secondary: '#14b8a6',
    accent: '#f97316',
    bgStart: '#eef6ff',
    bgMid: '#f8fafc',
    bgEnd: '#fff7ed',
  },
  Relationships: {
    primary: '#e11d48',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    bgStart: '#fff1f2',
    bgMid: '#faf5ff',
    bgEnd: '#fff7ed',
  },
  Career: {
    primary: '#0f766e',
    secondary: '#2563eb',
    accent: '#f97316',
    bgStart: '#ecfeff',
    bgMid: '#f8fafc',
    bgEnd: '#fff7ed',
  },
  Popular: {
    primary: '#6d28d9',
    secondary: '#2563eb',
    accent: '#db2777',
    bgStart: '#f5f3ff',
    bgMid: '#f8fafc',
    bgEnd: '#eff6ff',
  },
  Fun: {
    primary: '#d97706',
    secondary: '#db2777',
    accent: '#2563eb',
    bgStart: '#fffbeb',
    bgMid: '#fff7ed',
    bgEnd: '#fdf2f8',
  },
  Anime: {
    primary: '#7c3aed',
    secondary: '#ef4444',
    accent: '#f59e0b',
    bgStart: '#f5f3ff',
    bgMid: '#fff1f2',
    bgEnd: '#fffbeb',
  },
  Wellbeing: {
    primary: '#059669',
    secondary: '#0ea5e9',
    accent: '#8b5cf6',
    bgStart: '#ecfdf5',
    bgMid: '#f0f9ff',
    bgEnd: '#faf5ff',
  },
  Values: {
    primary: '#7c2d12',
    secondary: '#0f766e',
    accent: '#ca8a04',
    bgStart: '#fff7ed',
    bgMid: '#f7fee7',
    bgEnd: '#ecfdf5',
  },
  Introspective: {
    primary: '#334155',
    secondary: '#7c3aed',
    accent: '#be123c',
    bgStart: '#f8fafc',
    bgMid: '#f1f5f9',
    bgEnd: '#f5f3ff',
  },
};

const TOPIC_THEMES = [
  {
    keywords: ['love', 'romantic', 'dating', 'flirting', 'attachment', 'relationship'],
    theme: CATEGORY_THEMES.Relationships,
  },
  {
    keywords: ['career', 'work', 'leadership', 'team', 'entrepreneur', 'productivity', 'negotiation'],
    theme: CATEGORY_THEMES.Career,
  },
  {
    keywords: ['stress', 'burnout', 'anxiety', 'wellbeing', 'well-being', 'mindfulness', 'cope', 'coping'],
    theme: CATEGORY_THEMES.Wellbeing,
  },
  {
    keywords: ['anime', 'pokemon', 'hogwarts', 'marvel', 'disney', 'fantasy', 'zodiac', 'tarot'],
    theme: CATEGORY_THEMES.Anime,
  },
  {
    keywords: ['money', 'risk', 'values', 'gratitude', 'meaning', 'purpose'],
    theme: CATEGORY_THEMES.Values,
  },
  {
    keywords: ['creativity', 'artist', 'humor', 'music', 'food', 'travel', 'aura', 'color'],
    theme: CATEGORY_THEMES.Fun,
  },
  {
    keywords: ['dark', 'difficult', 'narcissism', 'machiavellianism', 'perfectionism', 'avoidant', 'paranoid', 'depression'],
    theme: CATEGORY_THEMES.Introspective,
  },
];

function storageKey(slug) {
  return `personalitycalculator.${slug}.v1`;
}

function updateMeta(selector, attribute, value) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

function loadAnswers(slug) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(slug)) || '{}');
    return saved && typeof saved.answers === 'object' ? saved.answers : {};
  } catch {
    return {};
  }
}

function getQuizTheme(test) {
  if (!test) return CATEGORY_THEMES.Social;
  const searchable = `${test.slug} ${test.title} ${test.category}`.toLowerCase();
  const topic = TOPIC_THEMES.find((item) => item.keywords.some((keyword) => searchable.includes(keyword)));
  return topic?.theme || CATEGORY_THEMES[test.category] || CATEGORY_THEMES.Popular;
}

function themeToStyle(theme, result) {
  const resultColor = result?.primary?.color || theme.primary;
  return {
    '--quiz-primary': theme.primary,
    '--quiz-secondary': theme.secondary,
    '--quiz-accent': theme.accent,
    '--quiz-bg-start': theme.bgStart,
    '--quiz-bg-mid': theme.bgMid,
    '--quiz-bg-end': theme.bgEnd,
    '--quiz-result-color': resultColor,
  };
}

function dataUrlToFile(dataUrl, filename) {
  const [header, data] = dataUrl.split(',');
  const mime = header.match(/data:(.*?);base64/)?.[1] || 'image/png';
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new File([bytes], filename, { type: mime });
}

export function calculateResult(test, answers) {
  const totals = Object.fromEntries(
    test.dimensions.map((dimension) => [
      dimension.key,
      {
        ...dimension,
        score: 0,
        answered: 0,
        possible: 0,
      },
    ]),
  );

  test.questions.forEach((question) => {
    const answer = answers[question.id];
    if (!answer || !totals[question.dimension]) return;
    const normalized = question.reverse ? 6 - answer : answer;
    totals[question.dimension].score += normalized;
    totals[question.dimension].answered += 1;
    totals[question.dimension].possible += 5;
  });

  const dimensions = Object.values(totals)
    .map((dimension) => ({
      ...dimension,
      percent: dimension.possible ? Math.round((dimension.score / dimension.possible) * 100) : 0,
    }))
    .sort((a, b) => b.percent - a.percent || b.score - a.score);

  const primary = dimensions[0];
  const secondary = dimensions.find((dimension) => dimension.key !== primary.key && primary.percent - dimension.percent <= 6);

  return {
    primary,
    secondary,
    dimensions,
  };
}

export function GenericTestPage({ slug }) {
  const [locale, setLocale] = useState(detectLocale);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [answers, setAnswers] = useState({});
  const [complete, setComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultCardRef = useRef(null);
  const commonCopy = COMMON_COPY[locale] || COMMON_COPY.en;
  const copy = QUIZ_COPY[locale] || QUIZ_COPY.en;

  useEffect(() => {
    syncLocale(locale);
  }, [locale]);

  useEffect(() => {
    let cancelled = false;
    const loadTest = TEST_LOADERS[slug];

    setLoading(true);
    setNotFound(false);
    setTest(null);
    setAnswers({});
    setComplete(false);
    setCopied(false);

    if (!loadTest) {
      setLoading(false);
      setNotFound(true);
      return undefined;
    }

    loadTest()
      .then((loadedTest) => {
        if (cancelled) return;
        setTest(loadedTest);
        setAnswers(loadAnswers(loadedTest.slug));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
        setNotFound(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (loading) {
      document.title = 'Loading Personality Test | Personality Calculator';
      updateMeta('meta[name="description"]', 'content', commonCopy.loadingBody);
      return;
    }

    if (!test || notFound) {
      document.title = `${commonCopy.notFoundTitle} | Personality Calculator`;
      updateMeta('meta[name="description"]', 'content', commonCopy.notFoundBody);
      return;
    }

    const title = `${test.title} | Free Personality Test`;
    const description = `${test.intro} Answer ${test.questions.length} questions and get instant scored results.`;
    const url = `https://personalitycalculator.org/${test.slug}.html`;

    document.title = title;
    updateMeta('meta[name="description"]', 'content', description);
    updateMeta('link[rel="canonical"]', 'href', url);
    updateMeta('meta[property="og:title"]', 'content', test.title);
    updateMeta('meta[property="og:description"]', 'content', description);
    updateMeta('meta[property="og:url"]', 'content', url);
    updateMeta('meta[name="twitter:title"]', 'content', test.title);
    updateMeta('meta[name="twitter:description"]', 'content', description);
  }, [test, loading, notFound, commonCopy.loadingBody, commonCopy.notFoundBody, commonCopy.notFoundTitle]);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = test ? answeredCount === test.questions.length : false;
  const result = useMemo(() => (test ? calculateResult(test, answers) : null), [test, answers]);
  const progress = test ? Math.round((answeredCount / test.questions.length) * 100) : 0;
  const theme = useMemo(() => getQuizTheme(test), [test]);
  const themeStyle = useMemo(() => themeToStyle(theme, complete ? result : null), [theme, complete, result]);

  if (loading) {
    return (
      <main className="quiz-app" style={themeToStyle(CATEGORY_THEMES.Social)}>
        <section className="quiz-not-found">
          <Brain size={40} />
          <h1>{commonCopy.loadingTitle}</h1>
          <p>{commonCopy.loadingBody}</p>
          <a href="/">{commonCopy.backToAllTests}</a>
        </section>
      </main>
    );
  }

  if (!test || notFound) {
    return (
      <main className="quiz-app" style={themeToStyle(CATEGORY_THEMES.Social)}>
        <section className="quiz-not-found">
          <Brain size={40} />
          <h1>{commonCopy.notFoundTitle}</h1>
          <p>{commonCopy.notFoundBody}</p>
          <a href="/">{commonCopy.backToAllTests}</a>
        </section>
      </main>
    );
  }

  function answerQuestion(questionId, value) {
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);
    localStorage.setItem(storageKey(test.slug), JSON.stringify({ answers: nextAnswers, updatedAt: new Date().toISOString() }));
  }

  function finishTest() {
    if (!allAnswered) return;
    setComplete(true);
    requestAnimationFrame(() => document.getElementById('quiz-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  function restart() {
    localStorage.removeItem(storageKey(test.slug));
    setAnswers({});
    setComplete(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function shareResult() {
    const url =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? `https://personalitycalculator.org/${test.slug}.html`
        : window.location.href;
    const text = copy.shareText(result, test);
    const filename = `${test.slug}-${result.primary.key}-result-card.png`;
    let resultCardImage = null;
    if (resultCardRef.current && result) {
      resultCardImage = await toPng(resultCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: theme.bgStart,
      });
    }
    if (navigator.share && resultCardImage && typeof File !== 'undefined') {
      const file = dataUrlToFile(resultCardImage, filename);
      if (!navigator.canShare || navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ title: test.title, text, url, files: [file] });
          return;
        } catch {
          // Fall back to regular web sharing or copying.
        }
      }
    }
    if (navigator.share) {
      try {
        await navigator.share({ title: test.title, text, url });
        return;
      } catch {
        // Fall back to copying.
      }
    }
    await copyText(`${text} ${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function copySummary() {
    await copyText(result.primary.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function downloadResultCard() {
    if (!resultCardRef.current || !result) return;
    const dataUrl = await toPng(resultCardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: theme.bgStart,
    });
    const link = document.createElement('a');
    link.download = `${test.slug}-${result.primary.key}-result-card.png`;
    link.href = dataUrl;
    link.click();
  }

  return (
    <main className="quiz-app" style={themeStyle}>
      <header className="quiz-header">
        <a href="/" className="quiz-back">
          <ArrowLeft size={18} />
          {commonCopy.allTests}
        </a>
        <div className="quiz-brand">
          <span>
            <Brain size={22} />
          </span>
          {commonCopy.brand}
        </div>
        <div className="language-links compact" aria-label="Languages">
          {SUPPORTED_LOCALES.map((item) => (
            <button key={item} type="button" className={locale === item ? 'active' : ''} onClick={() => setLocale(item)}>
              {LOCALE_LABELS[item]}
            </button>
          ))}
        </div>
      </header>

      <section className="quiz-hero">
        <div>
          <div className="quiz-kicker">
            <Sparkles size={16} />
            {test.category}
          </div>
          <h1>{test.title}</h1>
          <p>{test.intro}</p>
          {test.notice && <p className="quiz-notice">{test.notice}</p>}
        </div>
        <aside className="quiz-progress-card">
          <div>
            <Clock3 size={18} />
            {formatDuration(test.time, locale)}
          </div>
          <div>
            <FileQuestion size={18} />
            {test.questions.length} {commonCopy.questions}
          </div>
          <strong>{copy.completeLabel(progress)}</strong>
          <span className="quiz-progress-track">
            <i style={{ width: `${progress}%` }} />
          </span>
        </aside>
      </section>

      <section className="quiz-shell" aria-label={`${test.title} questions`}>
        <div className="quiz-question-list">
          {test.questions.map((question, index) => (
            <article className="quiz-question" key={question.id}>
              <div className="quiz-question-head">
                <span>{index + 1}</span>
                <h2>{question.text}</h2>
              </div>
              <div className="quiz-answer-row" role="radiogroup" aria-label={copy.questionLabel(index + 1)}>
                {localizedAnswerLabels(test.answerLabels, locale).map((label, labelIndex) => {
                  const value = labelIndex + 1;
                  const selected = answers[question.id] === value;
                  return (
                    <button
                      key={label}
                      type="button"
                      className={selected ? 'selected' : ''}
                      role="radio"
                      aria-checked={selected}
                      onClick={() => answerQuestion(question.id, value)}
                    >
                      <span>{value}</span>
                      <strong>{label}</strong>
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <aside className="quiz-side-panel">
          <div className="quiz-sticky-panel">
            <strong>{copy.answeredLabel(answeredCount, test.questions.length)}</strong>
            <p>{allAnswered ? copy.progressReady : copy.progressLocked}</p>
            <button type="button" className="quiz-primary" disabled={!allAnswered} onClick={finishTest}>
              <Check size={18} />
              {copy.showResult}
            </button>
            <button type="button" className="quiz-secondary" onClick={restart}>
              <RotateCcw size={18} />
              {commonCopy.restart}
            </button>
          </div>
        </aside>
      </section>

      {complete && (
        <section className="quiz-result" id="quiz-result" aria-labelledby="quiz-result-title">
          <div className="quiz-result-main">
            <article className="quiz-result-card" ref={resultCardRef}>
              <div className="quiz-result-card-top">
                <span className="quiz-result-label">{copy.strongestMatch}</span>
                <strong>{result.primary.percent}%</strong>
              </div>
              <h2 id="quiz-result-title">{result.primary.title}</h2>
              {result.secondary && <h3>{copy.secondaryPattern}: {result.secondary.title}</h3>}
              <p>{result.primary.summary}</p>
              <div className="quiz-result-theme-bar">
                <i style={{ width: `${result.primary.percent}%` }} />
              </div>
              <div className="quiz-result-traits">
                {result.primary.strengths.slice(0, 3).map((strength) => (
                  <span key={strength}>{strength}</span>
                ))}
              </div>
              <div className="quiz-card-footer">
                <Brain size={17} />
                <span>{test.title}</span>
                <strong>personalitycalculator.org</strong>
              </div>
            </article>
            <div className="quiz-result-actions">
              <button type="button" className="quiz-primary" onClick={shareResult}>
                <Share2 size={18} />
                {copied ? commonCopy.copied : commonCopy.share}
              </button>
              <button type="button" className="quiz-secondary" onClick={copySummary}>
                <Clipboard size={18} />
                {copied ? commonCopy.copied : commonCopy.copySummary}
              </button>
              <button type="button" className="quiz-secondary" onClick={downloadResultCard}>
                <ArrowDownToLine size={18} />
                {commonCopy.downloadCard}
              </button>
            </div>
          </div>
          <div className="quiz-insight-grid">
            <ResultList title={copy.strengths} items={result.primary.strengths} />
            <ResultList title={copy.growthFocus} items={result.primary.growth} />
          </div>
          <div className="quiz-score-card">
            <h3>{copy.scoreBreakdown}</h3>
            {result.dimensions.map((dimension) => (
              <div className="quiz-score-row" key={dimension.key}>
                <div>
                  <strong>{dimension.label}</strong>
                  <span>{dimension.percent}%</span>
                </div>
                <i>
                  <b style={{ width: `${dimension.percent}%`, background: dimension.color }} />
                </i>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function ResultList({ title, items }) {
  return (
    <article>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

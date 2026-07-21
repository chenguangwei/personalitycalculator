import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowDownToLine,
  Brain,
  Check,
  Clipboard,
  Clock3,
  FileQuestion,
  Link2,
  RotateCcw,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { TESTS } from '../../data/tests.jsx';
import { localizeTest } from '../../data/testTranslations.js';
import {
  COMMON_COPY,
  detectLocale,
  formatDuration,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  syncLocale,
} from '../../i18n.js';
import { copyText } from '../../utils/clipboard.js';
import {
  ASPECT_KEYS,
  ASPECT_LETTER,
  POSITION_KEYS,
  SCALE_MAX,
  STATEMENTS,
  STATEMENT_IDS,
  decodeType,
  isValidType,
  scoreLikert,
} from './apEngine.js';
import { getApContent, TYPE_NICKNAMES } from './apContent.js';

const SLUG = 'attitudinal-psyche-style-test';
const STORAGE_KEY = `personalitycalculator.${SLUG}.ap.v2`;
const CANONICAL = `https://personalitycalculator.org/${SLUG}.html`;
const RELATED_SLUGS = [
  'humanmetrics-jung-typology-style-test',
  'temperament-blends-test',
  'enneagram-hornevian-groups-test',
  'guilford-zimmerman-temperament-style-test',
];

const ASPECT_COLORS = {
  volition: '#6b43ef',
  logic: '#2f74ef',
  physics: '#18a88a',
  emotion: '#f08a24',
};

// Representative energy when only a type code is known (deep link / share).
const POSITION_PERCENT = [88, 68, 44, 22];
const SCALE_POINTS = Array.from({ length: SCALE_MAX }, (_, i) => i + 1);

function updateMeta(selector, attribute, value) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

function loadAnswers() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return saved && typeof saved.answers === 'object' && saved.answers ? saved.answers : {};
  } catch {
    return {};
  }
}

function readTypeParam() {
  try {
    const type = new URLSearchParams(window.location.search).get('type');
    return type && isValidType(type) ? type.toUpperCase() : null;
  } catch {
    return null;
  }
}

export function AttitudinalPsychePage() {
  const [locale, setLocale] = useState(detectLocale);
  const [answers, setAnswers] = useState({});
  const [complete, setComplete] = useState(false);
  const [linkedType, setLinkedType] = useState(null);
  const [copied, setCopied] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [cardImageReady, setCardImageReady] = useState(false);

  const cardRef = useRef(null);
  const cardImageRef = useRef(null);
  const cardImageKeyRef = useRef('');

  const content = getApContent(locale);
  const ui = content.ui;
  const commonCopy = COMMON_COPY[locale] || COMMON_COPY.en;

  useEffect(() => {
    syncLocale(locale);
  }, [locale]);

  // Initial load: deep link by ?type= or resume saved answers.
  useEffect(() => {
    const type = readTypeParam();
    if (type) {
      setLinkedType(type);
      setComplete(true);
      return;
    }
    const saved = loadAnswers();
    setAnswers(saved);
    if (STATEMENT_IDS.every((id) => typeof saved[id] === 'number')) {
      setComplete(true);
    }
  }, []);

  const result = useMemo(() => {
    if (linkedType) {
      const order = decodeType(linkedType).map((entry) => entry.aspect);
      const percents = Object.fromEntries(order.map((aspect, index) => [aspect, POSITION_PERCENT[index]]));
      return { code: linkedType, order, percents, answeredCount: STATEMENT_IDS.length };
    }
    return scoreLikert(answers);
  }, [linkedType, answers]);

  const nickname = TYPE_NICKNAMES[result.code] || '';
  const orderedAspectLabels = result.order.map((aspect) => content.aspects[aspect].label);

  const answeredCount = linkedType ? STATEMENT_IDS.length : result.answeredCount;
  const allAnswered = answeredCount === STATEMENT_IDS.length;
  const progress = Math.round((answeredCount / STATEMENT_IDS.length) * 100);

  useEffect(() => {
    if (complete) {
      document.title = `${result.code} · ${nickname} | ${ui.title}`;
      updateMeta('meta[name="description"]', 'content', content.summary(...orderedAspectLabels));
      updateMeta('link[rel="canonical"]', 'href', linkedType ? `${CANONICAL}?type=${result.code}` : CANONICAL);
    } else {
      document.title = `${ui.title} | Free Personality Test`;
      updateMeta('meta[name="description"]', 'content', ui.intro);
      updateMeta('link[rel="canonical"]', 'href', CANONICAL);
    }
  }, [complete, result.code, nickname, ui, content, linkedType, orderedAspectLabels]);

  // Reset cached share image when the result changes.
  useEffect(() => {
    cardImageRef.current = null;
    cardImageKeyRef.current = '';
    setCardImageReady(false);
  }, [result.code, locale]);

  useEffect(() => {
    if (!shareModalOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setShareModalOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [shareModalOpen]);

  function answerStatement(id, value) {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers: next, updatedAt: new Date().toISOString() }));
    if (STATEMENT_IDS.every((sid) => typeof next[sid] === 'number') && !complete) {
      revealResult();
    }
  }

  function revealResult() {
    setComplete(true);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => document.getElementById('ap-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })),
    );
  }

  function restart() {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setComplete(false);
    setLinkedType(null);
    setShareModalOpen(false);
    if (window.location.search) {
      window.history.replaceState(null, '', `/${SLUG}.html`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function getShareUrl() {
    return `${CANONICAL}?type=${result.code}`;
  }

  async function getResultCardImage() {
    if (!cardRef.current) return null;
    const cacheKey = `${result.code}:${locale}`;
    if (cardImageRef.current && cardImageKeyRef.current === cacheKey) return cardImageRef.current;
    cardImageKeyRef.current = cacheKey;
    const dataUrl = await toPng(cardRef.current, { cacheBust: false, pixelRatio: 1.5, backgroundColor: '#ffffff' });
    if (cardImageKeyRef.current === cacheKey) {
      cardImageRef.current = dataUrl;
      setCardImageReady(true);
    }
    return dataUrl;
  }

  function flashCopied(kind) {
    setCopied(kind);
    setTimeout(() => setCopied(''), 1500);
  }

  async function copyLink() {
    await copyText(getShareUrl());
    flashCopied('link');
  }

  async function copySummary() {
    await copyText(`${ui.shareText(result.code, nickname)} ${content.summary(...orderedAspectLabels)}`);
    flashCopied('summary');
  }

  function openShare() {
    setShareModalOpen(true);
    getResultCardImage().catch(() => setCardImageReady(false));
  }

  async function downloadCard() {
    const dataUrl = await getResultCardImage();
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `attitudinal-psyche-${result.code}.png`;
    link.href = dataUrl;
    link.click();
  }

  const relatedTests = useMemo(() => {
    return RELATED_SLUGS.map((slug) => TESTS.find((test) => test.slug === slug))
      .filter(Boolean)
      .map((test) => localizeTest(test, locale));
  }, [locale]);

  const positionBreakdown = result.order.map((aspect, index) => ({
    aspect,
    position: POSITION_KEYS[index],
    block: content.blocks[aspect][POSITION_KEYS[index]],
  }));

  return (
    <main className="quiz-app ap-app">
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
            {ui.kicker}
          </div>
          <h1>{ui.title}</h1>
          <p>{ui.intro}</p>
        </div>
        <aside className="quiz-progress-card">
          <div>
            <Clock3 size={18} />
            {formatDuration('5 min', locale)}
          </div>
          <div>
            <FileQuestion size={18} />
            {STATEMENT_IDS.length} {commonCopy.questions}
          </div>
          <strong>{progress}%</strong>
          <span className="quiz-progress-track">
            <i style={{ width: `${progress}%` }} />
          </span>
        </aside>
      </section>

      {!linkedType && (
        <section className="quiz-shell ap-quiz-shell" aria-label={ui.title}>
          <div className="ap-likert-list">
            <p className="ap-instruction">{ui.instruction}</p>
            {STATEMENTS.map((statement, index) => (
              <article className="ap-likert-card" key={statement.id}>
                <div className="ap-likert-head">
                  <span className="ap-qnum" style={{ '--ap-color': ASPECT_COLORS[statement.aspect] }}>
                    Q{index + 1}
                  </span>
                  <h2>{content.statements[statement.id]}</h2>
                </div>
                <div className="ap-scale" role="radiogroup" aria-label={content.statements[statement.id]}>
                  {SCALE_POINTS.map((value) => {
                    const selected = answers[statement.id] === value;
                    const label = ui.scaleLabels[value - 1];
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-label={label}
                        className={`ap-opt ap-opt-${value}${selected ? ' selected' : ''}`}
                        onClick={() => answerStatement(statement.id, value)}
                      >
                        <span className="ap-opt-dot" />
                        <span className="ap-opt-label">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          <aside className="quiz-side-panel">
            <div className="quiz-sticky-panel">
              <strong>{ui.answeredLabel(answeredCount, STATEMENT_IDS.length)}</strong>
              <p>{allAnswered ? ui.progressReady : ui.progressLocked}</p>
              <button type="button" className="quiz-primary" disabled={!allAnswered} onClick={revealResult}>
                <Check size={18} />
                {ui.showResult}
              </button>
              <button type="button" className="quiz-secondary" onClick={restart}>
                <RotateCcw size={18} />
                {commonCopy.restart}
              </button>
            </div>
          </aside>
        </section>
      )}

      {complete && (
        <section className="quiz-result ap-result" id="ap-result">
          <div className="quiz-result-main">
            <article className="ap-result-card" ref={cardRef}>
              <ResultCard result={result} nickname={nickname} content={content} ui={ui} />
            </article>
            <div className="quiz-result-actions">
              <button type="button" className="quiz-primary" onClick={openShare}>
                <Share2 size={18} />
                {commonCopy.share}
              </button>
              <button type="button" className="quiz-secondary" onClick={copyLink}>
                <Link2 size={18} />
                {copied === 'link' ? ui.linkCopied : ui.copyLink}
              </button>
              <button type="button" className="quiz-secondary" onClick={copySummary}>
                <Clipboard size={18} />
                {copied === 'summary' ? commonCopy.copied : commonCopy.copySummary}
              </button>
              <button type="button" className="quiz-secondary" onClick={downloadCard}>
                <ArrowDownToLine size={18} />
                {commonCopy.downloadCard}
              </button>
            </div>
          </div>

          <div className="ap-panels">
            <article className="ap-panel ap-energy">
              <h3>{ui.energyTitle}</h3>
              <p className="ap-panel-note">{ui.energyNote}</p>
              {result.order.map((aspect) => (
                <div className="ap-energy-row" key={aspect}>
                  <div>
                    <strong>{content.aspects[aspect].label}</strong>
                    <span>{result.percents[aspect]}%</span>
                  </div>
                  <i>
                    <b style={{ width: `${result.percents[aspect]}%`, background: ASPECT_COLORS[aspect] }} />
                  </i>
                </div>
              ))}
            </article>

            <article className="ap-panel ap-map">
              <h3>{ui.mapTitle}</h3>
              <p className="ap-panel-note">{ui.mapNote}</p>
              <PositionMap result={result} content={content} ui={ui} />
            </article>
          </div>

          <div className="ap-breakdown">
            <h3>{ui.breakdownTitle}</h3>
            {positionBreakdown.map(({ aspect, position, block }) => (
              <article key={aspect} className="ap-breakdown-row" style={{ '--ap-color': ASPECT_COLORS[aspect] }}>
                <div className="ap-breakdown-badge">
                  <b>{ASPECT_LETTER[aspect]}</b>
                  <span>{content.positions[position].ordinal}</span>
                </div>
                <div className="ap-breakdown-body">
                  <h4>
                    {content.aspects[aspect].label} · {content.positions[position].name}
                    <em>{content.positions[position].tagline}</em>
                  </h4>
                  <p>{block}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="ap-panels">
            <article className="ap-panel">
              <h3>{ui.aspectsTitle}</h3>
              <ul className="ap-def-list">
                {ASPECT_KEYS.map((aspect) => (
                  <li key={aspect} style={{ '--ap-color': ASPECT_COLORS[aspect] }}>
                    <b>{ASPECT_LETTER[aspect]}</b>
                    <span>
                      <strong>{content.aspects[aspect].label}</strong> — {content.aspects[aspect].def}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="ap-panel">
              <h3>{ui.positionsTitle}</h3>
              <ul className="ap-def-list">
                {POSITION_KEYS.map((position) => (
                  <li key={position}>
                    <b>{content.positions[position].ordinal}</b>
                    <span>
                      <strong>{content.positions[position].name}</strong> — {content.positions[position].def}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <p className="ap-caveat">{ui.caveat}</p>

          <div className="ap-faq">
            <h3>{ui.faqTitle}</h3>
            {content.faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>

          <div className="ap-result-footer">
            <button type="button" className="quiz-secondary" onClick={restart}>
              <RotateCcw size={18} />
              {ui.retake}
            </button>
          </div>

          {relatedTests.length > 0 && (
            <section className="quiz-related">
              <h3>{commonCopy.brand}</h3>
              <div>
                {relatedTests.map((test) => (
                  <a href={test.href} key={test.href}>
                    <strong>{test.title}</strong>
                    <span>
                      {formatDuration(test.time, locale)} · {test.questions} {commonCopy.questions}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </section>
      )}

      {shareModalOpen && (
        <div className="quiz-share-backdrop" role="dialog" aria-modal="true">
          <section className="quiz-share-modal">
            <button type="button" className="quiz-share-close" onClick={() => setShareModalOpen(false)} aria-label="Close">
              <X size={20} />
            </button>
            <div className="quiz-share-head">
              <h2>{ui.title}</h2>
              <p>{ui.shareText(result.code, nickname)}</p>
            </div>
            <article className="ap-result-card ap-share-preview">
              <ResultCard result={result} nickname={nickname} content={content} ui={ui} />
            </article>
            <div className="quiz-share-actions">
              <button type="button" className="quiz-primary" aria-busy={!cardImageReady} onClick={downloadCard}>
                <ArrowDownToLine size={18} />
                {commonCopy.downloadCard}
              </button>
              <button type="button" className="quiz-secondary" onClick={copyLink}>
                <Link2 size={18} />
                {copied === 'link' ? ui.linkCopied : ui.copyLink}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function ResultCard({ result, nickname, content, ui }) {
  const orderedAspectLabels = result.order.map((aspect) => content.aspects[aspect].label);
  return (
    <>
      <div className="ap-card-head">
        <span>{ui.resultKicker}</span>
        <Brain size={18} />
      </div>
      <div className="ap-code">
        {result.order.map((aspect, index) => (
          <span key={aspect} className="ap-code-letter" style={{ '--ap-color': ASPECT_COLORS[aspect] }}>
            <b>{ASPECT_LETTER[aspect]}</b>
            <i>{content.positions[POSITION_KEYS[index]].ordinal}</i>
          </span>
        ))}
      </div>
      {nickname && <h2 className="ap-nickname">{nickname}</h2>}
      <p className="ap-card-summary">{content.summary(...orderedAspectLabels)}</p>
      <div className="ap-card-foot">
        <span>{ui.cardTag}</span>
        <strong>personalitycalculator.org</strong>
      </div>
    </>
  );
}

function PositionMap({ result, content, ui }) {
  // Quadrants: TL=1st (confident+result), TR=2nd (confident+process),
  // BR=3rd (unconfident+process), BL=4th (unconfident+result).
  const cell = (positionIndex) => {
    const aspect = result.order[positionIndex];
    return (
      <div className="ap-map-cell" style={{ '--ap-color': ASPECT_COLORS[aspect] }}>
        <b>{ASPECT_LETTER[aspect]}</b>
        <span>{content.positions[POSITION_KEYS[positionIndex]].ordinal}</span>
        <em>{content.positions[POSITION_KEYS[positionIndex]].name}</em>
      </div>
    );
  };
  return (
    <div className="ap-map-grid">
      <span className="ap-map-axis ap-map-axis-top">{ui.axisConfident}</span>
      <span className="ap-map-axis ap-map-axis-bottom">{ui.axisUnconfident}</span>
      <span className="ap-map-axis ap-map-axis-left">{ui.axisResult}</span>
      <span className="ap-map-axis ap-map-axis-right">{ui.axisProcess}</span>
      <div className="ap-map-cells">
        {cell(0)}
        {cell(1)}
        {cell(3)}
        {cell(2)}
      </div>
    </div>
  );
}

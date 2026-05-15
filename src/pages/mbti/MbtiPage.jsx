import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Brain,
  Check,
  ClipboardList,
  Clock3,
  Copy,
  FileQuestion,
  Grid2X2,
  HelpCircle,
  Lightbulb,
  List,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
  X,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { calculateMbtiResult, MBTI_DIMENSIONS, MBTI_QUESTIONS } from './mbtiData.js';

const STORAGE_KEY = 'personalitycalculator.mbti-progress.v1';
const QUESTIONS_PER_PAGE = 10;
const TOTAL_PAGES = Math.ceil(MBTI_QUESTIONS.length / QUESTIONS_PER_PAGE);
const ANSWER_LABELS = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

function scrollToY(targetY, duration = 1000) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startedAt = performance.now();

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function step(now) {
    const elapsed = Math.min((now - startedAt) / duration, 1);
    window.scrollTo(0, startY + distance * easeOutCubic(elapsed));
    if (elapsed < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function loadSavedState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (!saved || typeof saved !== 'object') return null;
    const legacyPage = Number.isInteger(saved.currentIndex) ? Math.floor(saved.currentIndex / QUESTIONS_PER_PAGE) : 0;
    return {
      answers: saved.answers && typeof saved.answers === 'object' ? saved.answers : {},
      currentPage: Number.isInteger(saved.currentPage) ? saved.currentPage : legacyPage,
      complete: Boolean(saved.complete),
    };
  } catch {
    return null;
  }
}

export function MbtiPage() {
  const saved = useMemo(loadSavedState, []);
  const [answers, setAnswers] = useState(saved?.answers || {});
  const [currentPage, setCurrentPage] = useState(Math.min(saved?.currentPage || 0, TOTAL_PAGES - 1));
  const [complete, setComplete] = useState(saved?.complete || false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);
  const questionRef = useRef(null);
  const resultRef = useRef(null);
  const pageScrollStartRef = useRef(null);

  const answeredCount = Object.keys(answers).length;
  const result = useMemo(() => calculateMbtiResult(answers), [answers]);
  const pageStart = currentPage * QUESTIONS_PER_PAGE;
  const pageQuestions = MBTI_QUESTIONS.slice(pageStart, pageStart + QUESTIONS_PER_PAGE);
  const pageAnsweredCount = pageQuestions.filter((question) => answers[question.id]).length;
  const canGoNext = pageAnsweredCount === pageQuestions.length;
  const progress = complete ? 100 : Math.round((answeredCount / MBTI_QUESTIONS.length) * 100);

  useEffect(() => {
    if (!complete) return;
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [complete]);

  useEffect(() => {
    if (complete) return;
    const frame = requestAnimationFrame(() => {
      if (!questionRef.current) return;
      const top = questionRef.current.getBoundingClientRect().top + window.scrollY - 16;
      if (pageScrollStartRef.current !== null) {
        window.scrollTo(0, pageScrollStartRef.current);
        pageScrollStartRef.current = null;
      }
      scrollToY(Math.max(top, 0));
    });
    return () => cancelAnimationFrame(frame);
  }, [currentPage, complete]);

  function persist(nextAnswers = answers, nextPage = currentPage, nextComplete = complete) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        answers: nextAnswers,
        currentPage: nextPage,
        complete: nextComplete,
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  function answerQuestion(questionId, value) {
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);
    persist(nextAnswers, currentPage, complete);
  }

  function goNext() {
    if (!canGoNext) return;
    if (currentPage === TOTAL_PAGES - 1) {
      setComplete(true);
      persist(answers, currentPage, true);
      return;
    }
    const nextPage = currentPage + 1;
    pageScrollStartRef.current = window.scrollY;
    setCurrentPage(nextPage);
    persist(answers, nextPage, complete);
  }

  function goPrevious() {
    const nextPage = Math.max(0, currentPage - 1);
    pageScrollStartRef.current = window.scrollY;
    setCurrentPage(nextPage);
    setComplete(false);
    persist(answers, nextPage, false);
  }

  function saveProgress() {
    persist();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1600);
  }

  function restart() {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setCurrentPage(0);
    setComplete(false);
  }

  async function shareResult() {
    const shareUrl =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'https://personalitycalculator.org/mbti-personality-test.html'
        : `${window.location.origin}/mbti-personality-test.html`;
    const text = `I got ${result.fullType}, ${result.profile.title}, on personalitycalculator.org.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `My ${result.fullType} personality result`, text, url: shareUrl });
        return;
      } catch {
        // Fall back to copy when sharing is cancelled or unavailable.
      }
    }
    await navigator.clipboard.writeText(`${text} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function downloadCard() {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#f7f8ff',
    });
    const link = document.createElement('a');
    link.download = `${result.fullType}-mbti-personality-result.png`.toLowerCase();
    link.href = dataUrl;
    link.click();
  }

  return (
    <main className="mbti-app">
      <header className="mbti-header">
        <a className="mbti-brand" href="/" aria-label="personality-calculator home">
          <span className="mbti-logo">
            <Brain size={30} />
          </span>
          <span>
            <strong>MBTI Personality Test</strong>
            <small>Discover your personality type in a few minutes.</small>
          </span>
        </a>
        <div className="mbti-trust">
          <span>
            <ShieldCheck size={24} />
          </span>
          <div>
            <strong>100% Private &amp; Secure</strong>
            <small>Your answers are confidential.</small>
          </div>
        </div>
      </header>

      <div className="mbti-shell">
        <div className="mbti-main-col">
          <ProgressPanel progress={progress} currentPage={currentPage} answeredCount={answeredCount} complete={complete} />
          {complete ? (
            <MbtiResultView result={result} resultRef={resultRef} onShare={() => setShareOpen(true)} onRestart={restart} />
          ) : (
            <QuestionPanel
              questionRef={questionRef}
              questions={pageQuestions}
              currentPage={currentPage}
              answers={answers}
              pageAnsweredCount={pageAnsweredCount}
              canGoNext={canGoNext}
              onAnswer={answerQuestion}
              onNext={goNext}
              onPrevious={goPrevious}
              onSave={saveProgress}
              savedNotice={savedNotice}
            />
          )}
          <SeoContent />
        </div>

        <aside className="mbti-sidebar" aria-label="MBTI test details">
          <OverviewCard currentPage={currentPage} answeredCount={answeredCount} complete={complete} />
          <DimensionsCard />
          <TipsCard />
        </aside>
      </div>

      {shareOpen && (
        <MbtiShareModal
          result={result}
          copied={copied}
          cardRef={cardRef}
          onClose={() => setShareOpen(false)}
          onShare={shareResult}
          onDownload={downloadCard}
        />
      )}
    </main>
  );
}

function ProgressPanel({ progress, currentPage, answeredCount, complete }) {
  return (
    <section className="mbti-progress-card" aria-label="Test progress">
      <div>
        <strong>{complete ? 'Result Ready' : `Page ${currentPage + 1} of ${TOTAL_PAGES}`}</strong>
        <span>{answeredCount} of {MBTI_QUESTIONS.length} answered · {progress}% complete</span>
      </div>
      <div className="mbti-progress-track">
        <i style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}

function QuestionPanel({
  questionRef,
  questions,
  currentPage,
  answers,
  pageAnsweredCount,
  canGoNext,
  onAnswer,
  onNext,
  onPrevious,
  onSave,
  savedNotice,
}) {
  const isLastPage = currentPage === TOTAL_PAGES - 1;
  const missingCount = questions.length - pageAnsweredCount;

  return (
    <section className="mbti-question-card" ref={questionRef} aria-labelledby="current-mbti-page">
      <div className="mbti-question-icon">
        <UsersIcon />
      </div>
      <h1 id="current-mbti-page">Answer 10 quick statements</h1>
      <p>
        Page {currentPage + 1} of {TOTAL_PAGES} · {MBTI_QUESTIONS.length} total questions. Choose what feels most natural, then continue.
      </p>

      <div className="question-set" aria-label={`Page ${currentPage + 1} questions`}>
        {questions.map((question, questionIndex) => (
          <article className="question-item" key={question.id}>
            <div className="question-item-head">
              <span>{currentPage * QUESTIONS_PER_PAGE + questionIndex + 1}</span>
              <h2>{question.text}</h2>
            </div>
            <div className="answer-grid" role="radiogroup" aria-label={`Answer options for question ${currentPage * QUESTIONS_PER_PAGE + questionIndex + 1}`}>
              {ANSWER_LABELS.map((label, index) => {
                const value = index + 1;
                const selected = answers[question.id] === value;
                return (
                  <button
                    key={label}
                    className={selected ? 'selected' : ''}
                    onClick={() => onAnswer(question.id, value)}
                    role="radio"
                    aria-checked={selected}
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

      <div className="mbti-note">
        <Lightbulb size={27} />
        <span>
          Finish this page before moving on.
          <small>{canGoNext ? 'This page is complete.' : `${missingCount} more ${missingCount === 1 ? 'answer' : 'answers'} needed on this page.`}</small>
        </span>
      </div>

      <div className="mbti-question-actions">
        <button className="mbti-secondary-btn" onClick={onPrevious} disabled={currentPage === 0}>
          <ArrowLeft size={22} />
          Previous
        </button>
        <button className="mbti-primary-btn" onClick={onNext} disabled={!canGoNext}>
          {isLastPage ? 'See Result' : 'Next Page'}
          <ArrowRight size={22} />
        </button>
      </div>

      <button className="save-progress" onClick={onSave}>
        <Bookmark size={22} />
        {savedNotice ? 'Progress saved' : 'Save progress / Resume later'}
      </button>
    </section>
  );
}

function MbtiResultView({ result, resultRef, onShare, onRestart }) {
  const dimensions = Object.entries(result.dimensions);

  return (
    <section className="mbti-result-card" ref={resultRef} aria-labelledby="mbti-result-title">
      <div className="result-hero">
        <span className="result-kicker">Your Personality Type</span>
        <h1 id="mbti-result-title">{result.fullType}</h1>
        <h2>{result.profile.title}</h2>
        <p>{result.profile.summary}</p>
        <div className="result-actions">
          <button className="mbti-primary-btn" onClick={onShare}>
            <Share2 size={21} />
            Share / Download Card
          </button>
          <button className="mbti-secondary-btn" onClick={onRestart}>
            <RotateCcw size={20} />
            Retake Test
          </button>
        </div>
        <small className="result-share-note">Create a shareable result card or copy your result link.</small>
      </div>

      <div className="dimension-bars">
        {dimensions.map(([key, dimension]) => (
          <article key={key}>
            <div>
              <strong>{dimension.uiName}</strong>
              <span>{dimension.winner} · {dimension.strength}%</span>
            </div>
            <div className="dimension-track">
              <i style={{ width: `${dimension.strength}%`, background: dimension.color }} />
            </div>
            <small>{dimension.leftLabel} vs. {dimension.rightLabel}</small>
          </article>
        ))}
      </div>

      <div className="result-detail-grid">
        <ResultList title="Core strengths" items={result.profile.strengths} />
        <ResultList title="Growth tips" items={result.profile.growth} />
        <ResultList title="Career matches" items={result.profile.careers} />
      </div>
    </section>
  );
}

function ResultList({ title, items }) {
  return (
    <article>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <Check size={16} />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function OverviewCard({ currentPage, answeredCount, complete }) {
  return (
    <section className="mbti-side-card">
      <h2>
        <span className="side-icon blue">
          <ClipboardList size={20} />
        </span>
        Test Overview
      </h2>
      <SideMetric icon={Clock3} label="Estimated time" value="12-15 min" />
      <SideMetric icon={List} label="Total questions" value="60" />
      <SideMetric icon={FileQuestion} label="Question pages" value={`${TOTAL_PAGES} pages · 10 each`} />
      <SideMetric icon={HelpCircle} label={complete ? 'Answered' : 'Current page'} value={complete ? `${answeredCount} of 60` : `${currentPage + 1} of ${TOTAL_PAGES}`} />
    </section>
  );
}

function DimensionsCard() {
  const icons = [Zap, Brain, Sparkles, Grid2X2, UserRound];
  return (
    <section className="mbti-side-card dimensions">
      <h2>
        <span className="side-icon purple">
          <Grid2X2 size={20} />
        </span>
        The 5 Dimensions
      </h2>
      {Object.entries(MBTI_DIMENSIONS).map(([key, dimension], index) => {
        const Icon = icons[index];
        return (
          <div className="dimension-row" key={key}>
            <span style={{ '--dimension-color': dimension.color }}>
              <Icon size={21} />
            </span>
            <div>
              <strong>{dimension.uiName}</strong>
              <small>{dimension.methodName}</small>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function TipsCard() {
  return (
    <section className="mbti-side-card tips">
      <h2>
        <Lightbulb size={24} />
        Tips for Best Results
      </h2>
      {['Answer honestly and naturally.', "Don't overthink the questions.", 'There are no right or wrong answers.', 'Your first choice is usually the best one.'].map((tip) => (
        <p key={tip}>
          <Check size={16} />
          {tip}
        </p>
      ))}
    </section>
  );
}

function SideMetric({ icon: Icon, label, value }) {
  return (
    <div className="side-metric">
      <Icon size={26} />
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
    </div>
  );
}

function SeoContent() {
  return (
    <section className="mbti-seo-content">
      <h2>Free MBTI-Inspired Personality Test with 60 Questions</h2>
      <p>
        This personality test estimates your likely 16-type preference pattern using five scored dimensions: Extraversion vs.
        Introversion, Sensing vs. Intuition, Thinking vs. Feeling, Judging vs. Prospecting, and Assertive vs. Turbulent identity.
        It is designed for self-reflection, career exploration, relationship communication, and team discussion.
      </p>
      <div className="seo-grid">
        <article>
          <h3>How the scoring works</h3>
          <p>
            Each statement uses a 1-5 agreement scale. Positive and reverse-keyed items are balanced across every dimension. The
            side with the higher total becomes your letter, and the percentage shows preference strength.
          </p>
        </article>
        <article>
          <h3>Is this the official MBTI assessment?</h3>
          <p>
            No. MBTI is a registered assessment system. This page is an independent MBTI-inspired calculator that uses public
            descriptions of the four preference dichotomies and a 16Personalities-style A/T variant.
          </p>
        </article>
        <article>
          <h3>Can AI search engines understand this page?</h3>
          <p>
            The page includes direct definitions, methodology notes, FAQ-style explanations, structured result language, and schema
            markup in the HTML so search and generative answer engines can summarize it accurately.
          </p>
        </article>
      </div>
    </section>
  );
}

function MbtiShareModal({ result, copied, cardRef, onClose, onShare, onDownload }) {
  return (
    <div className="mbti-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="mbti-share-title">
      <section className="mbti-share-modal">
        <button className="mbti-modal-close" onClick={onClose} aria-label="Close share card">
          <X size={23} />
        </button>
        <div className="share-modal-head">
          <h2 id="mbti-share-title">Share Your Personality Result</h2>
          <p>Download a polished result card or share your type link.</p>
        </div>
        <MbtiShareCard result={result} refProp={cardRef} />
        <div className="share-modal-actions">
          <button className="mbti-secondary-btn" onClick={onShare}>
            {copied ? <Copy size={19} /> : <Share2 size={19} />}
            {copied ? 'Copied' : 'Share'}
          </button>
          <button className="mbti-primary-btn" onClick={onDownload}>
            <ArrowDownToLine size={20} />
            Download Card
          </button>
        </div>
      </section>
    </div>
  );
}

function MbtiShareCard({ result, refProp }) {
  return (
    <div className="mbti-share-card" ref={refProp}>
      <div>
        <span>Your Personality Type</span>
        <h3>{result.fullType}</h3>
        <strong>{result.profile.title}</strong>
        <p>{result.profile.summary}</p>
      </div>
      <div className="share-card-dimensions">
        {Object.entries(result.dimensions).map(([key, dimension]) => (
          <article key={key}>
            <span>{dimension.uiName}</span>
            <strong>{dimension.winner}</strong>
            <small>{dimension.strength}%</small>
          </article>
        ))}
      </div>
      <small>personalitycalculator.org</small>
    </div>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="24" cy="23" r="8" />
      <circle cx="42" cy="24" r="7" />
      <path d="M10 47c2-10 10-15 21-15s19 5 21 15" />
      <path d="M38 34c8 1 14 5 16 13" />
    </svg>
  );
}

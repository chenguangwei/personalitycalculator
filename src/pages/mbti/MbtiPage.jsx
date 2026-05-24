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
import { COMMON_COPY, detectLocale, LOCALE_LABELS, SUPPORTED_LOCALES, syncLocale } from '../../i18n.js';
import { copyText } from '../../utils/clipboard.js';
import { calculateMbtiResult, MBTI_DIMENSIONS, MBTI_QUESTIONS } from './mbtiData.js';

const STORAGE_KEY = 'personalitycalculator.mbti-progress.v1';
const QUESTIONS_PER_PAGE = 10;
const TOTAL_PAGES = Math.ceil(MBTI_QUESTIONS.length / QUESTIONS_PER_PAGE);

const MBTI_COPY = {
  en: {
    title: 'MBTI Personality Test',
    subtitle: 'Discover your personality type in a few minutes.',
    privateTitle: '100% Private & Secure',
    privateBody: 'Your answers are confidential.',
    resultReady: 'Result Ready',
    pageOf: (page, total) => `Page ${page} of ${total}`,
    progressLine: (answered, total, progress) => `${answered} of ${total} answered · ${progress}% complete`,
    questionTitle: 'Answer 10 quick statements',
    questionIntro: (page, total, questions) => `Page ${page} of ${total} · ${questions} total questions. Choose what feels most natural, then continue.`,
    questionSet: (page) => `Page ${page} questions`,
    answerOptions: (index) => `Answer options for question ${index}`,
    finishPage: 'Finish this page before moving on.',
    pageComplete: 'This page is complete.',
    missingAnswers: (count) => `${count} more ${count === 1 ? 'answer' : 'answers'} needed on this page.`,
    previous: 'Previous',
    nextPage: 'Next Page',
    seeResult: 'See Result',
    progressSaved: 'Progress saved',
    saveProgress: 'Save progress / Resume later',
    resultKicker: 'Your Personality Type',
    shareDownload: 'Share / Download Card',
    retake: 'Retake Test',
    shareNote: 'Create a shareable result card or copy your result link.',
    coreStrengths: 'Core strengths',
    growthTips: 'Growth tips',
    careerMatches: 'Career matches',
    overview: 'Test Overview',
    estimatedTime: 'Estimated time',
    totalQuestions: 'Total questions',
    questionPages: 'Question pages',
    questionPagesValue: (total) => `${total} pages · 10 each`,
    currentPage: 'Current page',
    answered: 'Answered',
    dimensionsTitle: 'The 5 Dimensions',
    tipsTitle: 'Tips for Best Results',
    tips: ['Answer honestly and naturally.', "Don't overthink the questions.", 'There are no right or wrong answers.', 'Your first choice is usually the best one.'],
    seoTitle: 'Free MBTI-Inspired Personality Test with 60 Questions',
    seoBody:
      'This personality test estimates your likely 16-type preference pattern using five scored dimensions. It is designed for self-reflection, career exploration, relationship communication, and team discussion.',
    scoringTitle: 'How the scoring works',
    scoringBody:
      'Each statement uses a 1-5 agreement scale. Positive and reverse-keyed items are balanced across every dimension. The side with the higher total becomes your letter.',
    officialTitle: 'Is this the official MBTI assessment?',
    officialBody:
      'No. MBTI is a registered assessment system. This page is an independent MBTI-inspired calculator for educational self-reflection.',
    aiTitle: 'Can AI search engines understand this page?',
    aiBody: 'The page includes direct definitions, methodology notes, FAQ-style explanations, structured result language, and schema markup.',
    avatarTitle: 'Explore MBTI avatar versions',
    avatarBody: 'Compare 32 visual avatar cards for all 16 types, including two INFP versions designed for result-card analysis.',
    avatarCta: 'Open avatar cards',
    avatarNav: 'Avatar Cards',
    shareModalTitle: 'Share Your Personality Result',
    shareModalBody: 'Download a polished result card or share your type link.',
    closeShare: 'Close share card',
    shareCardKicker: 'Your Personality Type',
    shareText: (result) => `I got ${result.fullType}, ${result.profile.title}, on personalitycalculator.org.`,
    shareTitle: (result) => `My ${result.fullType} personality result`,
  },
  zh: {
    title: 'MBTI 人格测试',
    subtitle: '几分钟了解你的性格类型。',
    privateTitle: '100% 私密安全',
    privateBody: '你的答案仅保存在本地。',
    resultReady: '结果已准备好',
    pageOf: (page, total) => `第 ${page}/${total} 页`,
    progressLine: (answered, total, progress) => `${answered}/${total} 已答 · ${progress}% 完成`,
    questionTitle: '回答 10 个快速陈述',
    questionIntro: (page, total, questions) => `第 ${page}/${total} 页 · 共 ${questions} 题。选择最符合自然状态的答案后继续。`,
    questionSet: (page) => `第 ${page} 页题目`,
    answerOptions: (index) => `第 ${index} 题选项`,
    finishPage: '请先完成本页再继续。',
    pageComplete: '本页已完成。',
    missingAnswers: (count) => `本页还需要 ${count} 个答案。`,
    previous: '上一页',
    nextPage: '下一页',
    seeResult: '查看结果',
    progressSaved: '进度已保存',
    saveProgress: '保存进度 / 稍后继续',
    resultKicker: '你的人格类型',
    shareDownload: '分享 / 下载卡片',
    retake: '重新测试',
    shareNote: '生成可分享的结果卡，或复制结果链接。',
    coreStrengths: '核心优势',
    growthTips: '成长建议',
    careerMatches: '职业匹配',
    overview: '测试概览',
    estimatedTime: '预计用时',
    totalQuestions: '题目总数',
    questionPages: '题目页数',
    questionPagesValue: (total) => `${total} 页 · 每页 10 题`,
    currentPage: '当前页',
    answered: '已答',
    dimensionsTitle: '5 个维度',
    tipsTitle: '获得更准结果的建议',
    tips: ['按真实状态作答。', '不要过度思考题目。', '没有正确或错误答案。', '第一反应通常最有参考价值。'],
    seoTitle: '免费的 MBTI 风格 60 题人格测试',
    seoBody: '这个测试通过五个计分维度估算你的 16 型偏好模式，适合自我反思、职业探索、关系沟通和团队讨论。',
    scoringTitle: '计分方式',
    scoringBody: '每个陈述使用 1-5 同意度量表。正向与反向题会在各维度中平衡，得分更高的一侧会成为你的字母。',
    officialTitle: '这是官方 MBTI 测评吗？',
    officialBody: '不是。MBTI 是注册测评体系。本页是独立的 MBTI 灵感计算器，用于教育和自我反思。',
    aiTitle: 'AI 搜索引擎能理解这个页面吗？',
    aiBody: '页面包含定义、方法说明、FAQ 风格解释、结构化结果语言和 schema 标记。',
    avatarTitle: '查看 MBTI 头像形象版本',
    avatarBody: '浏览 16 型人格的 32 张视觉卡片，包括两个可用于 INFP 分析卡的形象版本。',
    avatarCta: '打开形象卡片',
    avatarNav: 'MBTI 形象卡片',
    shareModalTitle: '分享你的人格结果',
    shareModalBody: '下载精美结果卡，或分享你的类型链接。',
    closeShare: '关闭分享卡片',
    shareCardKicker: '你的人格类型',
    shareText: (result) => `我在 personalitycalculator.org 得到 ${result.fullType}，${result.profile.title}。`,
    shareTitle: (result) => `我的 ${result.fullType} 人格结果`,
  },
  ja: {
    title: 'MBTI 性格診断',
    subtitle: '数分で自分のタイプを確認できます。',
    privateTitle: '100% プライベート',
    privateBody: '回答は機密として扱われます。',
    resultReady: '結果の準備完了',
    pageOf: (page, total) => `${page}/${total} ページ`,
    progressLine: (answered, total, progress) => `${answered}/${total} 回答済み · ${progress}% 完了`,
    questionTitle: '10個の短い文に回答',
    questionIntro: (page, total, questions) => `${page}/${total} ページ · 全 ${questions} 問。自然に近い答えを選んで進んでください。`,
    questionSet: (page) => `${page}ページ目の質問`,
    answerOptions: (index) => `質問 ${index} の選択肢`,
    finishPage: '次へ進む前にこのページを完了してください。',
    pageComplete: 'このページは完了しました。',
    missingAnswers: (count) => `このページであと ${count} 件の回答が必要です。`,
    previous: '前へ',
    nextPage: '次のページ',
    seeResult: '結果を見る',
    progressSaved: '進行状況を保存しました',
    saveProgress: '進行状況を保存 / 後で再開',
    resultKicker: 'あなたの性格タイプ',
    shareDownload: 'シェア / カードをダウンロード',
    retake: 'もう一度受ける',
    shareNote: '共有できる結果カードを作成するか、結果リンクをコピーできます。',
    coreStrengths: '主な強み',
    growthTips: '成長のヒント',
    careerMatches: '向いている仕事',
    overview: 'テスト概要',
    estimatedTime: '目安時間',
    totalQuestions: '質問数',
    questionPages: 'ページ数',
    questionPagesValue: (total) => `${total}ページ · 各10問`,
    currentPage: '現在のページ',
    answered: '回答済み',
    dimensionsTitle: '5つの次元',
    tipsTitle: 'よりよい結果のために',
    tips: ['正直に自然に答える。', '考えすぎない。', '正解・不正解はありません。', '最初の選択が参考になることが多いです。'],
    seoTitle: '無料の MBTI 風 60問性格診断',
    seoBody: 'このテストは5つの採点次元から16タイプの傾向を推定し、自己理解、キャリア探索、関係性の対話に役立ちます。',
    scoringTitle: '採点方法',
    scoringBody: '各文は1-5の同意度で回答します。各次元で正向き・逆向き項目をバランスさせ、合計が高い側が文字になります。',
    officialTitle: 'これは公式 MBTI ですか？',
    officialBody: 'いいえ。MBTI は登録された評価システムです。このページは教育的な自己理解のための独立した診断です。',
    aiTitle: 'AI検索エンジンはこのページを理解できますか？',
    aiBody: '定義、方法メモ、FAQ形式の説明、構造化された結果文、schema マークアップを含んでいます。',
    avatarTitle: 'MBTIアバター版を見る',
    avatarBody: '16タイプの32枚のビジュアルカードと、INFP向けの2つの分析用アバターを比較できます。',
    avatarCta: 'アバターカードを開く',
    avatarNav: 'アバターカード',
    shareModalTitle: '性格結果をシェア',
    shareModalBody: '結果カードをダウンロードするか、タイプリンクを共有できます。',
    closeShare: '共有カードを閉じる',
    shareCardKicker: 'あなたの性格タイプ',
    shareText: (result) => `personalitycalculator.orgで ${result.fullType}、${result.profile.title} になりました。`,
    shareTitle: (result) => `私の ${result.fullType} 性格結果`,
  },
  ko: {
    title: 'MBTI 성격 테스트',
    subtitle: '몇 분 안에 나의 성격 유형을 확인하세요.',
    privateTitle: '100% 비공개 및 안전',
    privateBody: '답변은 기밀로 처리됩니다.',
    resultReady: '결과 준비 완료',
    pageOf: (page, total) => `${page}/${total} 페이지`,
    progressLine: (answered, total, progress) => `${answered}/${total} 응답 · ${progress}% 완료`,
    questionTitle: '짧은 문장 10개에 답하기',
    questionIntro: (page, total, questions) => `${page}/${total} 페이지 · 총 ${questions}문항. 가장 자연스럽게 느껴지는 답을 고르세요.`,
    questionSet: (page) => `${page}페이지 문항`,
    answerOptions: (index) => `${index}번 문항 선택지`,
    finishPage: '다음으로 이동하기 전에 이 페이지를 완료하세요.',
    pageComplete: '이 페이지는 완료되었습니다.',
    missingAnswers: (count) => `이 페이지에 ${count}개 답변이 더 필요합니다.`,
    previous: '이전',
    nextPage: '다음 페이지',
    seeResult: '결과 보기',
    progressSaved: '진행 상황 저장됨',
    saveProgress: '진행 상황 저장 / 나중에 이어하기',
    resultKicker: '나의 성격 유형',
    shareDownload: '공유 / 카드 다운로드',
    retake: '다시 테스트',
    shareNote: '공유 가능한 결과 카드를 만들거나 결과 링크를 복사할 수 있습니다.',
    coreStrengths: '핵심 강점',
    growthTips: '성장 팁',
    careerMatches: '커리어 매치',
    overview: '테스트 개요',
    estimatedTime: '예상 시간',
    totalQuestions: '총 문항',
    questionPages: '문항 페이지',
    questionPagesValue: (total) => `${total}페이지 · 각 10문항`,
    currentPage: '현재 페이지',
    answered: '응답 완료',
    dimensionsTitle: '5가지 차원',
    tipsTitle: '좋은 결과를 위한 팁',
    tips: ['솔직하고 자연스럽게 답하세요.', '문항을 너무 오래 고민하지 마세요.', '정답이나 오답은 없습니다.', '첫 선택이 보통 가장 참고할 만합니다.'],
    seoTitle: '무료 MBTI 스타일 60문항 성격 테스트',
    seoBody: '이 테스트는 다섯 가지 채점 차원으로 16가지 유형 선호를 추정하며 자기 성찰, 커리어 탐색, 관계 대화에 활용할 수 있습니다.',
    scoringTitle: '채점 방식',
    scoringBody: '각 문장은 1-5 동의 척도를 사용합니다. 각 차원의 정방향 및 역방향 문항을 균형 있게 반영해 더 높은 쪽이 유형 글자가 됩니다.',
    officialTitle: '공식 MBTI 검사인가요?',
    officialBody: '아닙니다. MBTI는 등록된 평가 체계입니다. 이 페이지는 교육적 자기 성찰을 위한 독립적인 MBTI 스타일 계산기입니다.',
    aiTitle: 'AI 검색 엔진이 이 페이지를 이해할 수 있나요?',
    aiBody: '정의, 방법 설명, FAQ 형식 설명, 구조화된 결과 문구, schema 마크업을 포함합니다.',
    avatarTitle: 'MBTI 아바타 버전 보기',
    avatarBody: '16가지 유형의 32개 비주얼 카드와 INFP 분석 카드용 두 가지 아바타를 비교하세요.',
    avatarCta: '아바타 카드 열기',
    avatarNav: '아바타 카드',
    shareModalTitle: '성격 결과 공유',
    shareModalBody: '완성도 높은 결과 카드를 다운로드하거나 유형 링크를 공유하세요.',
    closeShare: '공유 카드 닫기',
    shareCardKicker: '나의 성격 유형',
    shareText: (result) => `personalitycalculator.org에서 ${result.fullType}, ${result.profile.title} 결과가 나왔습니다.`,
    shareTitle: (result) => `나의 ${result.fullType} 성격 결과`,
  },
};

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
  const [locale, setLocale] = useState(detectLocale);
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
  const commonCopy = COMMON_COPY[locale] || COMMON_COPY.en;
  const copy = MBTI_COPY[locale] || MBTI_COPY.en;

  const answeredCount = Object.keys(answers).length;
  const result = useMemo(() => calculateMbtiResult(answers), [answers]);
  const pageStart = currentPage * QUESTIONS_PER_PAGE;
  const pageQuestions = MBTI_QUESTIONS.slice(pageStart, pageStart + QUESTIONS_PER_PAGE);
  const pageAnsweredCount = pageQuestions.filter((question) => answers[question.id]).length;
  const canGoNext = pageAnsweredCount === pageQuestions.length;
  const progress = complete ? 100 : Math.round((answeredCount / MBTI_QUESTIONS.length) * 100);

  useEffect(() => {
    syncLocale(locale);
  }, [locale]);

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
    const text = copy.shareText(result);
    if (navigator.share) {
      try {
        await navigator.share({ title: copy.shareTitle(result), text, url: shareUrl });
        return;
      } catch {
        // Fall back to copy when sharing is cancelled or unavailable.
      }
    }
    await copyText(`${text} ${shareUrl}`);
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
            <strong>{copy.title}</strong>
            <small>{copy.subtitle}</small>
          </span>
        </a>
        <div className="mbti-header-tools">
          <div className="language-links compact" aria-label="Languages">
            {SUPPORTED_LOCALES.map((item) => (
              <button key={item} type="button" className={locale === item ? 'active' : ''} onClick={() => setLocale(item)}>
                {LOCALE_LABELS[item]}
              </button>
            ))}
          </div>
          <a className="mbti-avatar-entry" href="/which-infp-avatar-represents-you.html">
            <Sparkles size={18} />
            <span>{copy.avatarNav}</span>
          </a>
        </div>
        <div className="mbti-trust">
          <span>
            <ShieldCheck size={24} />
          </span>
          <div>
            <strong>{copy.privateTitle}</strong>
            <small>{copy.privateBody}</small>
          </div>
        </div>
      </header>

      <div className="mbti-shell">
        <div className="mbti-main-col">
          <ProgressPanel progress={progress} currentPage={currentPage} answeredCount={answeredCount} complete={complete} copy={copy} />
          {complete ? (
            <MbtiResultView result={result} resultRef={resultRef} copy={copy} onShare={() => setShareOpen(true)} onRestart={restart} />
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
              copy={copy}
              commonCopy={commonCopy}
            />
          )}
          <SeoContent copy={copy} />
        </div>

        <aside className="mbti-sidebar" aria-label="MBTI test details">
          <OverviewCard currentPage={currentPage} answeredCount={answeredCount} complete={complete} copy={copy} />
          <DimensionsCard copy={copy} />
          <TipsCard copy={copy} />
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
          copy={copy}
          commonCopy={commonCopy}
        />
      )}
    </main>
  );
}

function ProgressPanel({ progress, currentPage, answeredCount, complete, copy }) {
  return (
    <section className="mbti-progress-card" aria-label="Test progress">
      <div>
        <strong>{complete ? copy.resultReady : copy.pageOf(currentPage + 1, TOTAL_PAGES)}</strong>
        <span>{copy.progressLine(answeredCount, MBTI_QUESTIONS.length, progress)}</span>
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
  copy,
  commonCopy,
}) {
  const isLastPage = currentPage === TOTAL_PAGES - 1;
  const missingCount = questions.length - pageAnsweredCount;

  return (
    <section className="mbti-question-card" ref={questionRef} aria-labelledby="current-mbti-page">
      <div className="mbti-question-icon">
        <UsersIcon />
      </div>
      <h1 id="current-mbti-page">{copy.questionTitle}</h1>
      <p>{copy.questionIntro(currentPage + 1, TOTAL_PAGES, MBTI_QUESTIONS.length)}</p>

      <div className="question-set" aria-label={copy.questionSet(currentPage + 1)}>
        {questions.map((question, questionIndex) => (
          <article className="question-item" key={question.id}>
            <div className="question-item-head">
              <span>{currentPage * QUESTIONS_PER_PAGE + questionIndex + 1}</span>
              <h2>{question.text}</h2>
            </div>
            <div className="answer-grid" role="radiogroup" aria-label={copy.answerOptions(currentPage * QUESTIONS_PER_PAGE + questionIndex + 1)}>
              {commonCopy.answerLabels.map((label, index) => {
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
          {copy.finishPage}
          <small>{canGoNext ? copy.pageComplete : copy.missingAnswers(missingCount)}</small>
        </span>
      </div>

      <div className="mbti-question-actions">
        <button className="mbti-secondary-btn" onClick={onPrevious} disabled={currentPage === 0}>
          <ArrowLeft size={22} />
          {copy.previous}
        </button>
        <button className="mbti-primary-btn" onClick={onNext} disabled={!canGoNext}>
          {isLastPage ? copy.seeResult : copy.nextPage}
          <ArrowRight size={22} />
        </button>
      </div>

      <button className="save-progress" onClick={onSave}>
        <Bookmark size={22} />
        {savedNotice ? copy.progressSaved : copy.saveProgress}
      </button>
    </section>
  );
}

function MbtiResultView({ result, resultRef, copy, onShare, onRestart }) {
  const dimensions = Object.entries(result.dimensions);

  return (
    <section className="mbti-result-card" ref={resultRef} aria-labelledby="mbti-result-title">
      <div className="result-hero">
        <span className="result-kicker">{copy.resultKicker}</span>
        <h1 id="mbti-result-title">{result.fullType}</h1>
        <h2>{result.profile.title}</h2>
        <p>{result.profile.summary}</p>
        <div className="result-actions">
          <button className="mbti-primary-btn" onClick={onShare}>
            <Share2 size={21} />
            {copy.shareDownload}
          </button>
          <button className="mbti-secondary-btn" onClick={onRestart}>
            <RotateCcw size={20} />
            {copy.retake}
          </button>
        </div>
        <small className="result-share-note">{copy.shareNote}</small>
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
        <ResultList title={copy.coreStrengths} items={result.profile.strengths} />
        <ResultList title={copy.growthTips} items={result.profile.growth} />
        <ResultList title={copy.careerMatches} items={result.profile.careers} />
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

function OverviewCard({ currentPage, answeredCount, complete, copy }) {
  return (
    <section className="mbti-side-card">
      <h2>
        <span className="side-icon blue">
          <ClipboardList size={20} />
        </span>
        {copy.overview}
      </h2>
      <SideMetric icon={Clock3} label={copy.estimatedTime} value="12-15 min" />
      <SideMetric icon={List} label={copy.totalQuestions} value="60" />
      <SideMetric icon={FileQuestion} label={copy.questionPages} value={copy.questionPagesValue(TOTAL_PAGES)} />
      <SideMetric icon={HelpCircle} label={complete ? copy.answered : copy.currentPage} value={complete ? `${answeredCount}/60` : `${currentPage + 1}/${TOTAL_PAGES}`} />
    </section>
  );
}

function DimensionsCard({ copy }) {
  const icons = [Zap, Brain, Sparkles, Grid2X2, UserRound];
  return (
    <section className="mbti-side-card dimensions">
      <h2>
        <span className="side-icon purple">
          <Grid2X2 size={20} />
        </span>
        {copy.dimensionsTitle}
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

function TipsCard({ copy }) {
  return (
    <section className="mbti-side-card tips">
      <h2>
        <Lightbulb size={24} />
        {copy.tipsTitle}
      </h2>
      {copy.tips.map((tip) => (
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

function SeoContent({ copy }) {
  return (
    <section className="mbti-seo-content">
      <h2>{copy.seoTitle}</h2>
      <p>{copy.seoBody}</p>
      <div className="seo-grid">
        <article>
          <h3>{copy.scoringTitle}</h3>
          <p>{copy.scoringBody}</p>
        </article>
        <article>
          <h3>{copy.officialTitle}</h3>
          <p>{copy.officialBody}</p>
        </article>
        <article>
          <h3>{copy.aiTitle}</h3>
          <p>{copy.aiBody}</p>
        </article>
        <article>
          <h3>{copy.avatarTitle}</h3>
          <p>{copy.avatarBody}</p>
          <a className="seo-card-link" href="/which-infp-avatar-represents-you.html">{copy.avatarCta}</a>
        </article>
      </div>
    </section>
  );
}

function MbtiShareModal({ result, copied, cardRef, onClose, onShare, onDownload, copy, commonCopy }) {
  return (
    <div className="mbti-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="mbti-share-title">
      <section className="mbti-share-modal">
        <button className="mbti-modal-close" onClick={onClose} aria-label={copy.closeShare}>
          <X size={23} />
        </button>
        <div className="share-modal-head">
          <h2 id="mbti-share-title">{copy.shareModalTitle}</h2>
          <p>{copy.shareModalBody}</p>
        </div>
        <MbtiShareCard result={result} refProp={cardRef} copy={copy} />
        <div className="share-modal-actions">
          <button className="mbti-secondary-btn" onClick={onShare}>
            {copied ? <Copy size={19} /> : <Share2 size={19} />}
            {copied ? commonCopy.copied : commonCopy.share}
          </button>
          <button className="mbti-primary-btn" onClick={onDownload}>
            <ArrowDownToLine size={20} />
            {commonCopy.downloadCard}
          </button>
        </div>
      </section>
    </div>
  );
}

function MbtiShareCard({ result, refProp, copy }) {
  return (
    <div className="mbti-share-card" ref={refProp}>
      <div>
        <span>{copy.shareCardKicker}</span>
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

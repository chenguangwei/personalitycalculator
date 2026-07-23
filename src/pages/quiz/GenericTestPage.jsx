import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
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
  X,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { TESTS } from '../../data/tests.jsx';
import { TEST_LOADERS } from '../../data/generatedTestLoaders.js';
import { localizeTest } from '../../data/testTranslations.js';
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
    questionsOverview: 'Questions overview',
    questionsOverviewBody: 'Preview the prompts before you answer, then move through them at your own pace.',
    resultMeaning: 'What this result means',
    resultMeaningBody: (result) =>
      `${result.primary.title} is your strongest pattern in this test. Use it as a reflection prompt, then compare it with your real behavior across different situations.`,
    moreQuizzes: 'More quizzes to try next',
    shareModalTitle: 'Share your result card',
    shareModalBody: 'Preview your result card, download it, or copy a shareable result text.',
    closeShare: 'Close share card',
    copyShareText: 'Copy Share Text',
    shareText: (result, test) => `I got ${result.primary.title} on the ${test.title}.`,
    completeLabel: (progress) => `${progress}% complete`,
    answeredLabel: (answered, total) => `${answered} of ${total} answered`,
    questionLabel: (index) => `Question ${index}`,
    // Grouped (two-condition) profile — LIFO-style tests. English-only; other
    // locales fall back to these via the per-key merge below.
    styleProfile: 'Your style profile',
    favorableLabel: 'At your best',
    stressLabel: 'Under pressure',
    primaryTag: 'Primary',
    backupTag: 'Backup',
    lifoLead: (primary, backup, shifts) =>
      shifts
        ? `Your primary strength is ${primary.groupLabel}. Under pressure you tend to shift toward ${backup.groupLabel}, so watch how that style behaves when it is overdone.`
        : `Your primary strength is ${primary.groupLabel}, and you stay with it under pressure — the risk is overusing it rather than switching away.`,
    overdoneTitle: (label) => `When ${label} is overdone under pressure`,
    // Scale (banded single-score), spectrum (continuum), and Jungian (8-type)
    // result profiles. English-only fallback works via the per-key merge.
    scaleProfileTitle: 'Your score profile',
    scaleLead: (total, max) => `You scored ${total} out of ${max}.`,
    auxiliaryLabel: 'Auxiliary function',
    spectrumProfileTitle: 'Your change-style continuum',
    spectrumLead: (primary) => `You sit closest to the ${primary.label} end of the continuum. Most people can flex toward the other styles when the situation demands it.`,
    jungianProfileTitle: 'Your function profile',
    jungianLead: (dominant, auxiliary) => `Your dominant function is ${dominant.title}, supported by ${auxiliary.title}. In Jung’s model the function opposite your dominant is the least conscious one — worth watching under stress.`,
    // Matrix (coping mode × orientation) profile — Millon-style tests.
    matrixProfileTitle: 'Your pattern matrix',
    matrixLead: (primary, second, rowLabel, colLabel) =>
      `Your leading style is ${primary.title} — the ${rowLabel} × ${colLabel} cell of the matrix.${second ? ` Right behind it: ${second.title} at ${second.percent}%.` : ''}`,
    matrixNote: 'Rows are Millon’s coping modes — how you pursue what you need. Columns are reinforcement orientations — where you seek it.',
    // Alignment (two-axis 3×3 chart) profile.
    alignmentProfileTitle: 'Your alignment chart',
    alignmentLead: (primary, rowLabel, colLabel) =>
      `You land on ${primary.label} — the ${colLabel} × ${rowLabel} cell of the classic nine-alignment chart. The axis bars show exactly where you sit; a marker near the middle means you border the neighboring alignment.`,
    alignmentNote: 'Each axis is scored independently from your answers. The horizontal axis is how you relate to rules and structure; the vertical axis is whose interests drive your choices.',
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
    questionsOverview: '题目预览',
    questionsOverviewBody: '答题前先快速浏览问题，再按自己的节奏完成测试。',
    resultMeaning: '这个结果代表什么',
    resultMeaningBody: (result) =>
      `${result.primary.title} 是你在这个测试中最强的模式。把它当作自我反思提示，再结合不同情境中的真实行为来看。`,
    moreQuizzes: '继续探索这些测试',
    shareModalTitle: '分享你的结果卡片',
    shareModalBody: '预览结果卡片，可下载图片，也可以复制分享文案。',
    closeShare: '关闭分享卡片',
    copyShareText: '复制分享文案',
    shareText: (result, test) => `我在 ${test.title} 中得到 ${result.primary.title}。`,
    completeLabel: (progress) => `${progress}% 完成`,
    answeredLabel: (answered, total) => `${answered}/${total} 已答`,
    questionLabel: (index) => `第 ${index} 题`,
    styleProfile: '你的风格画像',
    favorableLabel: '状态最好时',
    stressLabel: '压力之下',
    primaryTag: '主导',
    backupTag: '备用',
    lifoLead: (primary, backup, shifts) =>
      shifts
        ? `你的主导优势是${primary.groupLabel}。压力之下，你往往会转向${backup.groupLabel}，因此要留意这种风格被过度使用时的表现。`
        : `你的主导优势是${primary.groupLabel}，在压力之下你也会继续依靠它——风险在于用力过度，而不是转向其他风格。`,
    overdoneTitle: (label) => `当${label}在压力下被过度使用`,
    scaleProfileTitle: '你的分数画像',
    scaleLead: (total, max) => `你的总分是 ${total}(满分 ${max})。`,
    auxiliaryLabel: '辅助功能',
    spectrumProfileTitle: '你的变革风格光谱',
    spectrumLead: (primary) => `你最靠近光谱的「${primary.label}」一端。情境需要时,大多数人也能向其他风格灵活移动。`,
    jungianProfileTitle: '你的功能画像',
    jungianLead: (dominant, auxiliary) => `你的主导功能是${dominant.title},由${auxiliary.title}辅助。在荣格的模型中,与主导功能相对的功能最不受意识掌控,压力之下值得留意。`,
    matrixProfileTitle: '你的模式矩阵',
    matrixLead: (primary, second, rowLabel, colLabel) =>
      `你的主导风格是${primary.title}——位于矩阵的「${rowLabel} × ${colLabel}」格。${second ? `紧随其后的是${second.title}(${second.percent}%)。` : ''}`,
    matrixNote: '行是米隆的应对模式——你如何追求所需；列是强化取向——你从哪里寻求它。',
    alignmentProfileTitle: '你的阵营九宫格',
    alignmentLead: (primary, rowLabel, colLabel) =>
      `你落在${primary.label}——经典九宫格阵营图中「${colLabel} × ${rowLabel}」的位置。轴上的标记显示你的确切位置；标记靠近中间，说明你与相邻阵营只有一步之遥。`,
    alignmentNote: '两条轴根据你的作答独立计分：横轴是你与规则和秩序的关系，纵轴是你的选择更多为谁的利益服务。',
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
    questionsOverview: '質問の概要',
    questionsOverviewBody: '回答前に質問を確認し、自分のペースで進められます。',
    resultMeaning: 'この結果の意味',
    resultMeaningBody: (result) =>
      `${result.primary.title} は、このテストで最も強く出たパターンです。固定的なラベルではなく、実際の行動を振り返る手がかりとして使ってください。`,
    moreQuizzes: '次に試したいテスト',
    shareModalTitle: '結果カードをシェア',
    shareModalBody: '結果カードを確認し、画像をダウンロードするか共有テキストをコピーできます。',
    closeShare: '共有カードを閉じる',
    copyShareText: '共有テキストをコピー',
    shareText: (result, test) => `${test.title}で ${result.primary.title} になりました。`,
    completeLabel: (progress) => `${progress}% 完了`,
    answeredLabel: (answered, total) => `${answered}/${total} 回答済み`,
    questionLabel: (index) => `質問 ${index}`,
    styleProfile: 'あなたのスタイルプロフィール',
    favorableLabel: '好調なとき',
    stressLabel: 'プレッシャー下',
    primaryTag: '主要',
    backupTag: '予備',
    lifoLead: (primary, backup, shifts) =>
      shifts
        ? `あなたの主要な強みは${primary.groupLabel}です。プレッシャー下では${backup.groupLabel}に傾きやすいので、そのスタイルが過剰になったときの振る舞いに注意しましょう。`
        : `あなたの主要な強みは${primary.groupLabel}で、プレッシャー下でもそれを保ちます。リスクは切り替えることではなく、使いすぎることです。`,
    overdoneTitle: (label) => `${label}がプレッシャー下で過剰になると`,
    scaleProfileTitle: 'スコアプロフィール',
    scaleLead: (total, max) => `あなたの合計スコアは ${total}(満点 ${max})です。`,
    auxiliaryLabel: '補助機能',
    spectrumProfileTitle: '変化スタイルの連続体',
    spectrumLead: (primary) => `あなたは連続体の「${primary.label}」側に最も近い位置にいます。状況に応じて、他のスタイルへ柔軟に動くこともできます。`,
    jungianProfileTitle: '機能プロフィール',
    jungianLead: (dominant, auxiliary) => `あなたの主機能は${dominant.title}で、${auxiliary.title}が補助します。ユングのモデルでは主機能と対極の機能が最も無意識的とされ、ストレス下では注意が必要です。`,
    matrixProfileTitle: 'あなたのパターン・マトリクス',
    matrixLead: (primary, second, rowLabel, colLabel) =>
      `あなたの主導スタイルは${primary.title}——マトリクスの「${rowLabel} × ${colLabel}」のセルです。${second ? `すぐ後ろに${second.title}(${second.percent}%)が続きます。` : ''}`,
    matrixNote: '行はミロンの対処モード——必要なものをどう追い求めるか。列は強化の方向——それをどこに求めるか。',
    alignmentProfileTitle: 'あなたのアライメント・チャート',
    alignmentLead: (primary, rowLabel, colLabel) =>
      `あなたは${primary.label}——クラシックな9アライメント表の「${colLabel} × ${rowLabel}」のセルに位置します。軸上のマーカーが正確な位置を示します。マーカーが中央に近いほど、隣のアライメントとの境界線上にいます。`,
    alignmentNote: '2つの軸は回答から独立して採点されます。横軸はルールや秩序との関わり方、縦軸は選択が誰の利益のためかを表します。',
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
    questionsOverview: '문항 미리보기',
    questionsOverviewBody: '답하기 전에 질문 흐름을 확인하고 내 속도에 맞춰 진행하세요.',
    resultMeaning: '이 결과의 의미',
    resultMeaningBody: (result) =>
      `${result.primary.title}은 이 테스트에서 가장 강하게 나타난 패턴입니다. 고정된 라벨이 아니라 실제 행동을 돌아보는 단서로 사용하세요.`,
    moreQuizzes: '다음에 해볼 테스트',
    shareModalTitle: '결과 카드 공유',
    shareModalBody: '결과 카드를 미리 보고 이미지를 다운로드하거나 공유 문구를 복사하세요.',
    closeShare: '공유 카드 닫기',
    copyShareText: '공유 문구 복사',
    shareText: (result, test) => `${test.title}에서 ${result.primary.title} 결과가 나왔습니다.`,
    completeLabel: (progress) => `${progress}% 완료`,
    answeredLabel: (answered, total) => `${answered}/${total} 응답`,
    questionLabel: (index) => `문항 ${index}`,
    styleProfile: '나의 스타일 프로필',
    favorableLabel: '최상의 상태일 때',
    stressLabel: '압박받을 때',
    primaryTag: '주도',
    backupTag: '예비',
    lifoLead: (primary, backup, shifts) =>
      shifts
        ? `당신의 주도 강점은 ${primary.groupLabel}입니다. 압박을 받으면 ${backup.groupLabel} 쪽으로 기우는 경향이 있으니, 그 스타일이 과하게 쓰일 때의 모습을 살펴보세요.`
        : `당신의 주도 강점은 ${primary.groupLabel}이며, 압박 속에서도 그대로 유지합니다. 위험은 다른 스타일로 바꾸는 것이 아니라 과도하게 쓰는 것입니다.`,
    overdoneTitle: (label) => `${label}이 압박 속에서 과하게 쓰일 때`,
    scaleProfileTitle: '나의 점수 프로필',
    scaleLead: (total, max) => `총점은 ${total}점(만점 ${max}점)입니다.`,
    auxiliaryLabel: '보조 기능',
    spectrumProfileTitle: '나의 변화 스타일 연속선',
    spectrumLead: (primary) => `당신은 연속선에서 「${primary.label}」 쪽에 가장 가깝습니다. 상황이 요구하면 다른 스타일로도 유연하게 움직일 수 있습니다.`,
    jungianProfileTitle: '나의 기능 프로필',
    jungianLead: (dominant, auxiliary) => `주기능은 ${dominant.title}이며 ${auxiliary.title}이 보조합니다. 융의 모델에서 주기능의 반대 기능은 가장 무의식적이어서 스트레스 상황에서 살펴볼 가치가 있습니다.`,
    matrixProfileTitle: '나의 패턴 매트릭스',
    matrixLead: (primary, second, rowLabel, colLabel) =>
      `당신의 주도 스타일은 ${primary.title} — 매트릭스의 「${rowLabel} × ${colLabel}」 칸입니다.${second ? ` 바로 뒤는 ${second.title}(${second.percent}%)입니다.` : ''}`,
    matrixNote: '행은 밀론의 대처 방식 — 필요한 것을 어떻게 추구하는가. 열은 강화 지향 — 그것을 어디에서 구하는가.',
    alignmentProfileTitle: '나의 성향 차트',
    alignmentLead: (primary, rowLabel, colLabel) =>
      `당신은 ${primary.label} — 클래식 9성향 차트의 「${colLabel} × ${rowLabel}」 칸에 위치합니다. 축 위의 마커가 정확한 위치를 보여줍니다. 마커가 가운데에 가까울수록 이웃 성향과의 경계에 있다는 뜻입니다.`,
    alignmentNote: '두 축은 응답에서 각각 독립적으로 계산됩니다. 가로축은 규칙과 질서를 대하는 방식, 세로축은 선택이 누구의 이익을 향하는지를 나타냅니다.',
  },
};

const CATEGORY_THEMES = {
  Social: {
    primary: '#3157d5',
    secondary: '#7c3aed',
    accent: '#f59e0b',
    bgStart: '#eef4ff',
    bgMid: '#f8f7ff',
    bgEnd: '#fff8ed',
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
    primary: '#1d4ed8',
    secondary: '#7c3aed',
    accent: '#f97316',
    bgStart: '#eff6ff',
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
    primary: '#15803d',
    secondary: '#4f46e5',
    accent: '#8b5cf6',
    bgStart: '#ecfdf5',
    bgMid: '#f7fee7',
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

  // Tests whose dimensions carry a `group` (e.g. LIFO's 4 styles measured under
  // favorable/stress) are aggregated into a grouped style profile instead of a
  // flat winner. `scale` tests sum every item into one banded total, and
  // `jungian` tests map three bipolar axes onto one of Jung's eight types.
  // Every other test keeps the normal single-winner path.
  if (test.dimensions[0]?.group) {
    return buildGroupedResult(test, dimensions);
  }
  if (test.mode === 'scale') {
    return buildScaleResult(test, dimensions);
  }
  if (test.mode === 'jungian') {
    return buildJungianResult(test, dimensions);
  }
  if (test.mode === 'alignment') {
    return buildAlignmentResult(test, dimensions);
  }

  const primary = dimensions[0];
  const secondary = dimensions.find((dimension) => dimension.key !== primary.key && primary.percent - dimension.percent <= 6);

  const result = {
    primary,
    secondary,
    dimensions,
  };

  // Matrix tests (e.g. Millon's coping mode × orientation grid) additionally
  // place every pattern in a labelled cell; the profile renders the full grid.
  if (test.mode === 'matrix' && test.matrix) {
    result.matrix = test.matrix;
  }

  // Spectrum tests (e.g. Change Style Indicator) additionally place the person
  // on a continuum between the negative and positive pole styles.
  if (test.mode === 'spectrum' && test.spectrum) {
    const byKey = Object.fromEntries(dimensions.map((dimension) => [dimension.key, dimension]));
    const negative = byKey[test.spectrum.negative];
    const positive = byKey[test.spectrum.positive];
    const middle = byKey[test.spectrum.middle];
    const position = (positive?.percent || 0) - (negative?.percent || 0);
    result.spectrum = { negative, middle, positive, position };
  }

  return result;
}

function buildScaleResult(test, dimensions) {
  const { dimension: totalKey, min, max } = test.scale;
  const scored = dimensions.find((dimension) => dimension.key === totalKey);
  const total = Math.min(max, Math.max(min, scored?.score || 0));
  const percent = Math.max(0, Math.round(((total - min) / (max - min)) * 100));
  const bands = test.dimensions.filter((dimension) => Array.isArray(dimension.band));
  const activeBand = bands.find((band) => total >= band.band[0] && total <= band.band[1]) || bands[0];

  return {
    primary: { ...activeBand, percent },
    secondary: undefined,
    dimensions,
    scale: {
      total,
      min,
      max,
      percent,
      bands: bands.map((band) => ({ ...band, active: band.key === activeBand.key })),
    },
  };
}

function buildJungianResult(test, dimensions) {
  const scoredByKey = Object.fromEntries(dimensions.map((dimension) => [dimension.key, dimension]));
  const axes = test.axes.map((axis) => ({
    key: axis.key,
    left: scoredByKey[axis.left],
    right: scoredByKey[axis.right],
  }));

  const attitudeAxis = axes.find((axis) => axis.key === 'attitude');
  const attitude = (attitudeAxis.left?.percent || 0) >= (attitudeAxis.right?.percent || 0)
    ? attitudeAxis.left
    : attitudeAxis.right;

  const functionPoles = axes
    .filter((axis) => axis.key !== 'attitude')
    .flatMap((axis) => [axis.left, axis.right])
    .filter(Boolean)
    .sort((a, b) => b.percent - a.percent || b.score - a.score);
  const dominant = functionPoles[0];
  const auxiliary = functionPoles.find((pole) => pole.axis !== dominant.axis);

  const typeEntry = test.dimensions.find(
    (dimension) => dimension.role === 'type' && dimension.attitude === attitude.key && dimension.fn === dominant.key,
  );

  return {
    primary: { ...typeEntry, percent: dominant.percent, color: typeEntry?.color || dominant.color },
    secondary: auxiliary ? { ...auxiliary } : undefined,
    dimensions,
    jungian: { axes, attitude, dominant, auxiliary },
  };
}

// Width of the neutral band on an alignment axis: the axis lands Neutral when
// its two pole percentages sit within this many points of each other.
const ALIGNMENT_NEUTRAL_BAND = 12;

function buildAlignmentResult(test, dimensions) {
  const scoredByKey = Object.fromEntries(dimensions.map((dimension) => [dimension.key, dimension]));
  // axes[0] picks the matrix column, axes[1] the row. band: 0 = left pole,
  // 1 = neutral middle, 2 = right pole.
  const axes = test.axes.map((axis) => {
    const left = scoredByKey[axis.left];
    const right = scoredByKey[axis.right];
    const position = (left?.percent || 0) - (right?.percent || 0);
    const band = position >= ALIGNMENT_NEUTRAL_BAND ? 0 : position <= -ALIGNMENT_NEUTRAL_BAND ? 2 : 1;
    return { key: axis.key, left, right, position, band };
  });
  const col = test.matrix.cols[axes[0].band];
  const row = test.matrix.rows[axes[1].band];
  const typeEntry = test.dimensions.find(
    (dimension) => dimension.role === 'type' && dimension.row === row && dimension.col === col,
  );
  // Match strength: winning-pole percent per decided axis, closeness to
  // balance per neutral axis, averaged across both axes.
  const strength = Math.round(
    axes.reduce((sum, axis) => {
      if (axis.band === 1) return sum + (100 - Math.abs(axis.position));
      return sum + Math.max(axis.left?.percent || 0, axis.right?.percent || 0);
    }, 0) / axes.length,
  );

  return {
    primary: { ...typeEntry, percent: strength },
    secondary: undefined,
    dimensions,
    alignment: { axes, row, col, matrix: test.matrix },
  };
}

function buildGroupedResult(test, dimensions) {
  const scoredByKey = Object.fromEntries(dimensions.map((dimension) => [dimension.key, dimension]));
  const order = [];
  const seen = new Set();
  test.dimensions.forEach((dimension) => {
    if (dimension.group && !seen.has(dimension.group)) {
      seen.add(dimension.group);
      order.push(dimension.group);
    }
  });

  const styles = order.map((group) => {
    const favSource = test.dimensions.find((d) => d.group === group && d.condition === 'favorable');
    const stressSource = test.dimensions.find((d) => d.group === group && d.condition === 'stress');
    const favPercent = scoredByKey[favSource?.key]?.percent || 0;
    const strPercent = scoredByKey[stressSource?.key]?.percent || 0;
    return {
      group,
      groupLabel: favSource?.groupLabel || favSource?.title,
      color: favSource?.color,
      title: favSource?.title,
      summary: favSource?.summary,
      strengths: favSource?.strengths || [],
      growth: favSource?.growth || [],
      stressSummary: stressSource?.summary,
      overdone: stressSource?.overdone || [],
      favPercent,
      strPercent,
    };
  });

  const primaryStyle = [...styles].sort((a, b) => b.favPercent - a.favPercent)[0];
  const backupStyle = [...styles].sort((a, b) => b.strPercent - a.strPercent)[0];

  // Shape a `primary`/`secondary` so the shared result card, share text and
  // download filename keep working without special-casing grouped tests.
  const primary = {
    key: primaryStyle.group,
    label: primaryStyle.groupLabel,
    title: primaryStyle.groupLabel,
    color: primaryStyle.color,
    percent: primaryStyle.favPercent,
    summary: primaryStyle.summary,
    strengths: primaryStyle.strengths,
    growth: primaryStyle.growth,
  };
  const secondary = backupStyle.group !== primaryStyle.group
    ? { key: backupStyle.group, title: backupStyle.groupLabel, color: backupStyle.color, percent: backupStyle.strPercent }
    : undefined;

  return {
    primary,
    secondary,
    dimensions,
    grouped: true,
    styles,
    primaryStyle,
    backupStyle,
  };
}

function getRelatedTests(currentTest, locale) {
  if (!currentTest) return [];
  const normalizedTitle = currentTest.title.toLowerCase();
  const keywordTokens = new Set(
    `${currentTest.slug} ${currentTest.category} ${normalizedTitle}`
      .split(/[^a-z0-9]+/i)
      .filter((token) => token.length > 3),
  );

  return TESTS.filter((test) => test.slug !== currentTest.slug)
    .map((test) => {
      const haystack = `${test.slug} ${test.title} ${test.category} ${test.searchText}`.toLowerCase();
      const keywordScore = [...keywordTokens].reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
      const categoryScore = test.category === currentTest.category ? 4 : 0;
      return { test, score: categoryScore + keywordScore };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.test.title.localeCompare(b.test.title))
    .slice(0, 4)
    .map(({ test }) => localizeTest(test, locale));
}

export function GenericTestPage({ slug }) {
  const [locale, setLocale] = useState(detectLocale);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [answers, setAnswers] = useState({});
  const [complete, setComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareClosing, setShareClosing] = useState(false);
  const [cardImageReady, setCardImageReady] = useState(false);
  const resultCardRef = useRef(null);
  const cardImageRef = useRef(null);
  const cardImageKeyRef = useRef('');
  const cardRenderPromiseRef = useRef(null);
  const commonCopy = COMMON_COPY[locale] || COMMON_COPY.en;
  const copy = { ...QUIZ_COPY.en, ...(QUIZ_COPY[locale] || {}) };
  const localizedTest = useMemo(() => (test ? localizeTest(test, locale) : null), [test, locale]);

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

    if (!localizedTest || notFound) {
      document.title = `${commonCopy.notFoundTitle} | Personality Calculator`;
      updateMeta('meta[name="description"]', 'content', commonCopy.notFoundBody);
      return;
    }

    const title = `${localizedTest.title} | Free Personality Test`;
    const description = `${localizedTest.intro || localizedTest.description} Answer ${localizedTest.questions.length} questions and get instant scored results.`;
    const url = `https://personalitycalculator.org/${localizedTest.slug}.html`;

    document.title = title;
    updateMeta('meta[name="description"]', 'content', description);
    updateMeta('link[rel="canonical"]', 'href', url);
    updateMeta('meta[property="og:title"]', 'content', localizedTest.title);
    updateMeta('meta[property="og:description"]', 'content', description);
    updateMeta('meta[property="og:url"]', 'content', url);
    updateMeta('meta[name="twitter:title"]', 'content', localizedTest.title);
    updateMeta('meta[name="twitter:description"]', 'content', description);
  }, [localizedTest, loading, notFound, commonCopy.loadingBody, commonCopy.notFoundBody, commonCopy.notFoundTitle]);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = test ? answeredCount === test.questions.length : false;
  const result = useMemo(() => (localizedTest ? calculateResult(localizedTest, answers) : null), [localizedTest, answers]);
  const progress = test ? Math.round((answeredCount / test.questions.length) * 100) : 0;
  const theme = useMemo(() => getQuizTheme(test), [test]);
  const themeStyle = useMemo(() => themeToStyle(theme, complete ? result : null), [theme, complete, result]);
  const answerLabels = localizedTest ? localizedAnswerLabels(localizedTest.answerLabels, locale) : [];
  const relatedTests = useMemo(() => getRelatedTests(localizedTest, locale), [localizedTest, locale]);

  useEffect(() => {
    if (!test || complete || answeredCount !== test.questions.length) return;
    setComplete(true);
  }, [answeredCount, complete, test]);

  useEffect(() => {
    cardImageRef.current = null;
    cardImageKeyRef.current = '';
    cardRenderPromiseRef.current = null;
    setCardImageReady(false);

    if (!complete || !result || !localizedTest) return undefined;

    const preload = () => {
      getResultCardImage().catch(() => {
        setCardImageReady(false);
      });
    };

    const timeoutId = window.setTimeout(preload, 120);
    return () => window.clearTimeout(timeoutId);
  }, [complete, localizedTest, result, theme.bgStart]);

  useEffect(() => {
    if (!shareModalOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeShareModal();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [shareModalOpen]);

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
    const nextAnsweredCount = Object.keys(nextAnswers).length;
    const nextComplete = nextAnsweredCount === test.questions.length;
    setAnswers(nextAnswers);
    localStorage.setItem(
      storageKey(test.slug),
      JSON.stringify({ answers: nextAnswers, complete: nextComplete, updatedAt: new Date().toISOString() }),
    );
    if (nextComplete && !complete) {
      revealResult({ scroll: true });
    }
  }

  function revealResult({ scroll = false } = {}) {
    setComplete(true);
    if (scroll) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => document.getElementById('quiz-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      });
    }
  }

  function finishTest() {
    if (!allAnswered) return;
    revealResult({ scroll: true });
  }

  function restart() {
    localStorage.removeItem(storageKey(test.slug));
    setAnswers({});
    setComplete(false);
    setShareModalOpen(false);
    setCardImageReady(false);
    cardImageRef.current = null;
    cardImageKeyRef.current = '';
    cardRenderPromiseRef.current = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function getShareUrl() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `https://personalitycalculator.org/${test.slug}.html`;
    }
    return window.location.href;
  }

  function getShareText() {
    return `${copy.shareText(result, localizedTest)} ${getShareUrl()}`;
  }

  function getResultCardFilename() {
    return `${localizedTest.slug}-${result.primary.key}-result-card.png`;
  }

  function getResultCardCacheKey() {
    return [localizedTest.slug, locale, result.primary.key, result.primary.percent, theme.bgStart].join(':');
  }

  async function getResultCardImage() {
    if (!resultCardRef.current || !result || !localizedTest) return null;

    const cacheKey = getResultCardCacheKey();
    if (cardImageRef.current && cardImageKeyRef.current === cacheKey) {
      return cardImageRef.current;
    }

    if (cardRenderPromiseRef.current && cardImageKeyRef.current === cacheKey) {
      return cardRenderPromiseRef.current;
    }

    cardImageKeyRef.current = cacheKey;
    // Ensure the serif display font is loaded so the exported PNG matches the screen.
    const fontsReady = document.fonts?.ready || Promise.resolve();
    const renderPromise = fontsReady.then(() => toPng(resultCardRef.current, {
      cacheBust: false,
      pixelRatio: 2,
      backgroundColor: theme.bgStart,
    })).then((dataUrl) => {
      if (cardImageKeyRef.current === cacheKey) {
        cardImageRef.current = dataUrl;
        setCardImageReady(true);
      }
      return dataUrl;
    });

    cardRenderPromiseRef.current = renderPromise;
    try {
      return await renderPromise;
    } finally {
      if (cardRenderPromiseRef.current === renderPromise) {
        cardRenderPromiseRef.current = null;
      }
    }
  }

  function shareResult() {
    setShareClosing(false);
    setShareModalOpen(true);
    getResultCardImage().catch(() => {
      setCardImageReady(false);
    });
  }

  function closeShareModal() {
    if (prefersReducedMotion()) {
      setShareModalOpen(false);
      return;
    }
    setShareClosing(true);
    window.setTimeout(() => {
      setShareModalOpen(false);
      setShareClosing(false);
    }, 180);
  }

  async function copyShareText() {
    await copyText(getShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function copySummary() {
    await copyText(result.primary.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function downloadResultCard() {
    const dataUrl = await getResultCardImage();
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = getResultCardFilename();
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
            {localizedTest.categoryLabel || localizedTest.category}
          </div>
          <h1>{localizedTest.title}</h1>
          <p>{localizedTest.intro || localizedTest.description}</p>
          {localizedTest.notice && <p className="quiz-notice">{localizedTest.notice}</p>}
        </div>
        <aside className="quiz-progress-card">
          <div>
            <Clock3 size={18} />
            {formatDuration(localizedTest.time, locale)}
          </div>
          <div>
            <FileQuestion size={18} />
            {localizedTest.questions.length} {commonCopy.questions}
          </div>
          <strong>{copy.completeLabel(progress)}</strong>
          <span className="quiz-progress-track">
            <i style={{ width: `${progress}%` }} />
          </span>
        </aside>
      </section>

      <section className="quiz-overview" aria-labelledby="quiz-overview-title">
        <div>
          <h2 id="quiz-overview-title">{copy.questionsOverview}</h2>
          <p>{copy.questionsOverviewBody}</p>
        </div>
        <ol>
          {localizedTest.questions.slice(0, 6).map((question, index) => (
            <li key={question.id}>
              <span>{index + 1}</span>
              <strong>{question.text}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="quiz-shell" aria-label={`${localizedTest.title} questions`}>
        <div className="quiz-question-list">
          {localizedTest.questions.map((question, index) => (
            <article className="quiz-question" key={question.id}>
              <div className="quiz-question-head">
                <span>{index + 1}</span>
                <h2>{question.text}</h2>
              </div>
              <div className="quiz-answer-row" role="radiogroup" aria-label={copy.questionLabel(index + 1)}>
                {answerLabels.map((label, labelIndex) => {
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
            <strong>{copy.answeredLabel(answeredCount, localizedTest.questions.length)}</strong>
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
              <ResultCardContent result={result} localizedTest={localizedTest} copy={copy} titleId="quiz-result-title" />
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
              <button type="button" className="quiz-secondary" aria-busy={!cardImageReady} onClick={downloadResultCard}>
                <ArrowDownToLine size={18} />
                {commonCopy.downloadCard}
              </button>
            </div>
          </div>
          <div className="quiz-insight-grid">
            <ResultList title={copy.strengths} items={result.primary.strengths} />
            <ResultList title={copy.growthFocus} items={result.primary.growth} />
            <article className="quiz-result-meaning">
              <h3>{copy.resultMeaning}</h3>
              <p>{copy.resultMeaningBody(result)}</p>
            </article>
          </div>
          {result.grouped ? (
            <LifoProfile result={result} copy={copy} />
          ) : result.alignment ? (
            <AlignmentProfile result={result} copy={copy} />
          ) : result.matrix ? (
            <MatrixProfile result={result} copy={copy} />
          ) : result.scale ? (
            <ScaleProfile result={result} copy={copy} />
          ) : result.jungian ? (
            <JungianProfile result={result} copy={copy} />
          ) : result.spectrum ? (
            <SpectrumProfile result={result} copy={copy} />
          ) : (
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
          )}
          {relatedTests.length > 0 && (
            <section className="quiz-related" aria-labelledby="quiz-related-title">
              <h3 id="quiz-related-title">{copy.moreQuizzes}</h3>
              <div>
                {relatedTests.map((relatedTest) => (
                  <a href={relatedTest.href} key={relatedTest.href}>
                    <strong>{relatedTest.title}</strong>
                    <span>{formatDuration(relatedTest.time, locale)} · {relatedTest.questions} {commonCopy.questions}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </section>
      )}
      {shareModalOpen && complete && (
        <div className={`quiz-share-backdrop${shareClosing ? ' is-closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby="quiz-share-title">
          <section className="quiz-share-modal">
            <button type="button" className="quiz-share-close" onClick={closeShareModal} aria-label={copy.closeShare}>
              <X size={20} />
            </button>
            <div className="quiz-share-head">
              <h2 id="quiz-share-title">{copy.shareModalTitle}</h2>
              <p>{copy.shareModalBody}</p>
            </div>
            <article className="quiz-result-card quiz-share-preview">
              <ResultCardContent result={result} localizedTest={localizedTest} copy={copy} titleId="quiz-share-card-title" />
            </article>
            <div className="quiz-share-actions">
              <button type="button" className="quiz-primary" aria-busy={!cardImageReady} onClick={downloadResultCard}>
                <ArrowDownToLine size={18} />
                {commonCopy.downloadCard}
              </button>
              <button type="button" className="quiz-secondary" onClick={copyShareText}>
                <Clipboard size={18} />
                {copied ? commonCopy.copied : copy.copyShareText}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function useCountUp(target, duration = 600) {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));
  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      return undefined;
    }
    let raf;
    let start;
    const step = (ts) => {
      if (start === undefined) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function ResultCardContent({ result, localizedTest, copy, titleId }) {
  const percent = useCountUp(result.primary.percent);
  return (
    <>
      <div className="quiz-result-card-top">
        <span className="quiz-result-label">{copy.strongestMatch}</span>
        <strong>{percent}%</strong>
      </div>
      <h2 id={titleId}>{result.primary.title}</h2>
      {result.secondary && (
        <h3>
          {result.grouped ? copy.stressLabel : result.jungian ? copy.auxiliaryLabel : copy.secondaryPattern}: {result.secondary.title}
        </h3>
      )}
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
        <span>{localizedTest.title}</span>
        <strong>personalitycalculator.org</strong>
      </div>
    </>
  );
}

function LifoProfile({ result, copy }) {
  const { styles, primaryStyle, backupStyle } = result;
  const shifts = backupStyle.group !== primaryStyle.group;
  return (
    <div className="quiz-score-card quiz-lifo-profile">
      <h3>{copy.styleProfile}</h3>
      <p className="quiz-lifo-lead">{copy.lifoLead(primaryStyle, backupStyle, shifts)}</p>
      <div className="quiz-lifo-rows">
        {styles.map((style) => (
          <div className="quiz-lifo-row" key={style.group}>
            <div className="quiz-lifo-row-head">
              <strong>{style.groupLabel}</strong>
              {style.group === primaryStyle.group && <span className="quiz-lifo-tag">{copy.primaryTag}</span>}
              {shifts && style.group === backupStyle.group && (
                <span className="quiz-lifo-tag is-stress">{copy.backupTag}</span>
              )}
            </div>
            <div className="quiz-lifo-bars">
              <div className="quiz-lifo-bar">
                <span>{copy.favorableLabel}</span>
                <i>
                  <b style={{ width: `${style.favPercent}%`, background: style.color }} />
                </i>
                <em>{style.favPercent}%</em>
              </div>
              <div className="quiz-lifo-bar">
                <span>{copy.stressLabel}</span>
                <i>
                  <b className="is-stress" style={{ width: `${style.strPercent}%`, background: style.color }} />
                </i>
                <em>{style.strPercent}%</em>
              </div>
            </div>
          </div>
        ))}
      </div>
      {backupStyle.overdone.length > 0 && (
        <div className="quiz-lifo-overdone">
          <h4>{copy.overdoneTitle(backupStyle.groupLabel)}</h4>
          <ul>
            {backupStyle.overdone.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function AlignmentProfile({ result, copy }) {
  const { axes, matrix } = result.alignment;
  const byCell = {};
  result.dimensions.forEach((dimension) => {
    if (dimension.role === 'type' && dimension.row && dimension.col) {
      byCell[`${dimension.row}:${dimension.col}`] = dimension;
    }
  });
  const primary = result.primary;
  return (
    <div className="quiz-score-card quiz-alignment-profile">
      <h3>{copy.alignmentProfileTitle}</h3>
      <p className="quiz-lifo-lead">
        {copy.alignmentLead(primary, matrix.labels[result.alignment.row], matrix.labels[result.alignment.col])}
      </p>
      <div className="quiz-alignment-axes">
        {axes.map((axis) => {
          // position ranges -100..100 (left pole..right pole); map to 0..100%.
          const marker = Math.min(100, Math.max(0, 50 - axis.position / 2));
          return (
            <div className="quiz-alignment-axis" key={axis.key}>
              <span className="quiz-alignment-pole">
                <strong>{axis.left.label}</strong>
                <em>{axis.left.percent}%</em>
              </span>
              <div className="quiz-alignment-track" style={{ '--axis-left': axis.left.color, '--axis-right': axis.right.color }}>
                <i style={{ left: `${marker}%` }} />
              </div>
              <span className="quiz-alignment-pole is-right">
                <strong>{axis.right.label}</strong>
                <em>{axis.right.percent}%</em>
              </span>
            </div>
          );
        })}
      </div>
      <div className="quiz-matrix-scroll">
        <div className="quiz-matrix-grid quiz-alignment-grid" style={{ '--matrix-cols': matrix.cols.length }}>
          <span className="quiz-matrix-corner" aria-hidden="true" />
          {matrix.cols.map((col) => (
            <span className="quiz-matrix-axis-label" key={col}>{matrix.labels[col]}</span>
          ))}
          {matrix.rows.map((row) => (
            <Fragment key={row}>
              <span className="quiz-matrix-axis-label is-row">{matrix.labels[row]}</span>
              {matrix.cols.map((col) => {
                const cell = byCell[`${row}:${col}`];
                if (!cell) return <span key={col} className="quiz-matrix-cell is-empty" />;
                const isPrimary = cell.key === primary.key;
                return (
                  <div
                    className={`quiz-matrix-cell${isPrimary ? ' is-primary' : ''}`}
                    key={col}
                    style={isPrimary ? { borderColor: cell.color } : undefined}
                  >
                    <strong>{cell.label}</strong>
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
      <p className="quiz-matrix-note">{copy.alignmentNote}</p>
    </div>
  );
}

function MatrixProfile({ result, copy }) {
  const { matrix } = result;
  const byCell = {};
  result.dimensions.forEach((dimension) => {
    if (dimension.row && dimension.col) byCell[`${dimension.row}:${dimension.col}`] = dimension;
  });
  const primary = result.primary;
  // result.dimensions is sorted by percent desc, so index 1 is the runner-up.
  const second = result.dimensions.find((dimension) => dimension.key !== primary.key);
  return (
    <div className="quiz-score-card quiz-matrix-profile">
      <h3>{copy.matrixProfileTitle}</h3>
      <p className="quiz-lifo-lead">{copy.matrixLead(primary, second, matrix.labels[primary.row], matrix.labels[primary.col])}</p>
      <div className="quiz-matrix-scroll">
        <div className="quiz-matrix-grid" style={{ '--matrix-cols': matrix.cols.length }}>
          <span className="quiz-matrix-corner" aria-hidden="true" />
          {matrix.cols.map((col) => (
            <span className="quiz-matrix-axis-label" key={col}>{matrix.labels[col]}</span>
          ))}
          {matrix.rows.map((row) => (
            <Fragment key={row}>
              <span className="quiz-matrix-axis-label is-row">{matrix.labels[row]}</span>
              {matrix.cols.map((col) => {
                const cell = byCell[`${row}:${col}`];
                if (!cell) return <span key={col} className="quiz-matrix-cell is-empty" />;
                const isPrimary = cell.key === primary.key;
                return (
                  <div
                    className={`quiz-matrix-cell${isPrimary ? ' is-primary' : ''}`}
                    key={col}
                    style={isPrimary ? { borderColor: cell.color } : undefined}
                  >
                    <strong>{cell.label}</strong>
                    <span>{cell.percent}%</span>
                    <i>
                      <b style={{ width: `${cell.percent}%`, background: cell.color }} />
                    </i>
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
      <p className="quiz-matrix-note">{copy.matrixNote}</p>
    </div>
  );
}

function ScaleProfile({ result, copy }) {
  const { total, max, percent, bands } = result.scale;
  const markerLeft = Math.min(96, Math.max(4, percent));
  return (
    <div className="quiz-score-card quiz-scale-profile">
      <h3>{copy.scaleProfileTitle}</h3>
      <p className="quiz-lifo-lead">{copy.scaleLead(total, max)}</p>
      <div className="quiz-scale-track">
        <i>
          <b style={{ width: `${percent}%`, background: result.primary.color }} />
        </i>
        <span className="quiz-scale-marker" style={{ left: `${markerLeft}%` }}>{total}</span>
      </div>
      <div className="quiz-scale-bands">
        {bands.map((band) => (
          <div
            className={`quiz-scale-band${band.active ? ' is-active' : ''}`}
            key={band.key}
            style={band.active ? { borderColor: band.color } : undefined}
          >
            <strong>{band.title}</strong>
            <span>{band.band[0]}–{band.band[1]}</span>
            <p>{band.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpectrumProfile({ result, copy }) {
  const { negative, middle, positive, position } = result.spectrum;
  const markerLeft = Math.min(96, Math.max(4, Math.round((position + 100) / 2)));
  const styles = [negative, middle, positive].filter(Boolean);
  return (
    <div className="quiz-score-card quiz-spectrum-profile">
      <h3>{copy.spectrumProfileTitle}</h3>
      <p className="quiz-lifo-lead">{copy.spectrumLead(result.primary)}</p>
      <div className="quiz-spectrum-track" style={{ '--spectrum-start': negative?.color, '--spectrum-mid': middle?.color, '--spectrum-end': positive?.color }}>
        <span className="quiz-spectrum-marker" style={{ left: `${markerLeft}%`, borderColor: result.primary.color }} />
      </div>
      <div className="quiz-spectrum-ends">
        {styles.map((style) => (
          <span key={style.key}>{style.label}</span>
        ))}
      </div>
      <div className="quiz-spectrum-rows">
        {styles.map((style) => (
          <div className="quiz-score-row" key={style.key}>
            <div>
              <strong>{style.label}</strong>
              <span>{style.percent}%</span>
            </div>
            <i>
              <b style={{ width: `${style.percent}%`, background: style.color }} />
            </i>
          </div>
        ))}
      </div>
    </div>
  );
}

function JungianProfile({ result, copy }) {
  const { axes, dominant, auxiliary } = result.jungian;
  return (
    <div className="quiz-score-card quiz-jungian-profile">
      <h3>{copy.jungianProfileTitle}</h3>
      <p className="quiz-lifo-lead">{copy.jungianLead(dominant, auxiliary)}</p>
      <div className="quiz-axis-rows">
        {axes.map((axis) => {
          const leftPercent = axis.left?.percent || 0;
          const rightPercent = axis.right?.percent || 0;
          const total = leftPercent + rightPercent;
          const leftShare = total ? Math.round((leftPercent / total) * 100) : 50;
          return (
            <div className="quiz-axis-row" key={axis.key}>
              <div className="quiz-axis-labels">
                <strong className={leftPercent >= rightPercent ? 'is-lead' : ''}>{axis.left.label} · {leftPercent}%</strong>
                <strong className={rightPercent > leftPercent ? 'is-lead' : ''}>{rightPercent}% · {axis.right.label}</strong>
              </div>
              <div className="quiz-axis-bar">
                <b className={leftPercent >= rightPercent ? 'is-lead' : ''} style={{ width: `${leftShare}%`, background: axis.left.color }} />
                <b className={rightPercent > leftPercent ? 'is-lead' : ''} style={{ width: `${100 - leftShare}%`, background: axis.right.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
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

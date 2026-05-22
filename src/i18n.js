export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALES = ['en', 'zh', 'ja', 'ko'];

export const LOCALE_LABELS = {
  en: 'EN',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
};

const STORAGE_KEY = 'personalitycalculator.locale.v1';

export function normalizeLocale(value) {
  if (!value || typeof value !== 'string') return '';
  const normalized = value.trim().toLowerCase().replace('_', '-');
  if (normalized.startsWith('zh')) return 'zh';
  if (normalized.startsWith('ja')) return 'ja';
  if (normalized.startsWith('ko')) return 'ko';
  if (normalized.startsWith('en')) return 'en';
  return '';
}

export function detectLocale() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  const params = new URLSearchParams(window.location.search);
  const queryLocale = normalizeLocale(params.get('lang') || params.get('locale'));
  if (queryLocale) return queryLocale;

  try {
    const savedLocale = normalizeLocale(localStorage.getItem(STORAGE_KEY));
    if (savedLocale) return savedLocale;
  } catch {
    // Ignore storage errors and continue with browser detection.
  }

  const browserLocales = navigator.languages?.length ? navigator.languages : [navigator.language];
  return browserLocales.map(normalizeLocale).find(Boolean) || DEFAULT_LOCALE;
}

export function syncLocale(locale) {
  const normalized = normalizeLocale(locale) || DEFAULT_LOCALE;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = normalized === 'zh' ? 'zh-CN' : normalized;
  }
  try {
    localStorage.setItem(STORAGE_KEY, normalized);
  } catch {
    // Locale persistence is optional.
  }
  return normalized;
}

export const COMMON_COPY = {
  en: {
    brand: 'personality-calculator',
    allTests: 'All tests',
    backToAllTests: 'Back to all tests',
    questions: 'questions',
    answered: 'answered',
    of: 'of',
    complete: 'complete',
    copied: 'Copied',
    share: 'Share',
    restart: 'Restart',
    downloadCard: 'Download Card',
    copySummary: 'Copy Summary',
    loadingTitle: 'Loading test',
    loadingBody: 'Preparing your personality test questions.',
    notFoundTitle: 'Test not found',
    notFoundBody: 'This personality test is not in the catalog yet.',
    answerLabels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  },
  zh: {
    brand: '人格测试计算器',
    allTests: '全部测试',
    backToAllTests: '返回全部测试',
    questions: '题',
    answered: '已答',
    of: '/',
    complete: '完成',
    copied: '已复制',
    share: '分享',
    restart: '重新开始',
    downloadCard: '下载卡片',
    copySummary: '复制摘要',
    loadingTitle: '正在加载测试',
    loadingBody: '正在准备人格测试题目。',
    notFoundTitle: '未找到测试',
    notFoundBody: '这个人格测试暂时还不在目录中。',
    answerLabels: ['非常不同意', '不同意', '中立', '同意', '非常同意'],
  },
  ja: {
    brand: '性格診断計算機',
    allTests: 'すべてのテスト',
    backToAllTests: 'テスト一覧へ戻る',
    questions: '問',
    answered: '回答済み',
    of: '/',
    complete: '完了',
    copied: 'コピー済み',
    share: 'シェア',
    restart: 'やり直す',
    downloadCard: 'カードをダウンロード',
    copySummary: '要約をコピー',
    loadingTitle: 'テストを読み込み中',
    loadingBody: '性格テストの質問を準備しています。',
    notFoundTitle: 'テストが見つかりません',
    notFoundBody: 'この性格テストはまだカタログにありません。',
    answerLabels: ['まったく違う', '違う', 'どちらでもない', '同意する', 'とても同意する'],
  },
  ko: {
    brand: '성격 테스트 계산기',
    allTests: '전체 테스트',
    backToAllTests: '전체 테스트로 돌아가기',
    questions: '문항',
    answered: '응답',
    of: '/',
    complete: '완료',
    copied: '복사됨',
    share: '공유',
    restart: '다시 시작',
    downloadCard: '카드 다운로드',
    copySummary: '요약 복사',
    loadingTitle: '테스트 불러오는 중',
    loadingBody: '성격 테스트 질문을 준비하고 있습니다.',
    notFoundTitle: '테스트를 찾을 수 없음',
    notFoundBody: '이 성격 테스트는 아직 카탈로그에 없습니다.',
    answerLabels: ['전혀 아니다', '아니다', '보통이다', '그렇다', '매우 그렇다'],
  },
};

export function localizedAnswerLabels(labels, locale) {
  return labels?.length === 5 ? COMMON_COPY[locale]?.answerLabels || labels : labels;
}

export function formatDuration(duration, locale) {
  if (locale === 'en' || !duration) return duration;
  return duration
    .replace(/(\d+)\s*-\s*(\d+)\s*min/i, (_, start, end) => {
      if (locale === 'zh') return `${start}-${end} 分钟`;
      if (locale === 'ja') return `${start}-${end}分`;
      return `${start}-${end}분`;
    })
    .replace(/(\d+)\s*min/i, (_, minutes) => {
      if (locale === 'zh') return `${minutes} 分钟`;
      if (locale === 'ja') return `${minutes}分`;
      return `${minutes}분`;
    });
}

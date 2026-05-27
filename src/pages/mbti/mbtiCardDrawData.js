import { MBTI_AVATAR_TYPES, localizeAvatarType } from './mbtiAvatarData.js';

export const MBTI_RESULT_STORAGE_KEY = 'personalitycalculator.mbti-result.v1';

export const MBTI_CARD_POSITIONS = ['coreSelf', 'hiddenPower', 'todaysSignal'];

const POSITION_COPY = {
  en: {
    coreSelf: {
      title: 'Core Self',
      subtitle: 'The steady center',
      body: (type) => `Your ${type} pattern is most visible when you protect what feels real and meaningful.`,
      prompt: (item) => item.prompts?.[0] || 'What part of yourself needs clearer protection today?',
      shareText: (type) => `I drew the ${type} Core Self card.`,
    },
    hiddenPower: {
      title: 'Hidden Power',
      subtitle: 'The quiet advantage',
      body: (type) => `The overlooked strength of your ${type} card is not loud. It works through timing, care, and conviction.`,
      prompt: (item) => item.prompts?.[1] || 'Which strength are you underusing because it feels too natural?',
      shareText: (type) => `I drew the ${type} Hidden Power card.`,
    },
    todaysSignal: {
      title: "Today's Signal",
      subtitle: 'The present cue',
      body: (type) => `Today, your ${type} energy is asking for one small honest move instead of a perfect plan.`,
      prompt: () => 'Write down one idea you have not said out loud yet.',
      shareText: (type) => `I drew the ${type} Today's Signal card.`,
    },
  },
  zh: {
    coreSelf: {
      title: '核心自我',
      subtitle: '稳定中心',
      body: (type) => `当你守住真实感和意义感时，${type} 的人格模式最清晰。`,
      prompt: (item) => item.prompts?.[0] || '今天哪个自我部分最需要被认真保护？',
      shareText: (type) => `我抽到 ${type} 核心自我人格牌。`,
    },
    hiddenPower: {
      title: '隐藏力量',
      subtitle: '安静优势',
      body: (type) => `${type} 被低估的力量不一定外放，它常通过时机、关照和信念发挥作用。`,
      prompt: (item) => item.prompts?.[1] || '哪个太自然的优势，反而被你低估了？',
      shareText: (type) => `我抽到 ${type} 隐藏力量人格牌。`,
    },
    todaysSignal: {
      title: '今日信号',
      subtitle: '当下提示',
      body: (type) => `今天的 ${type} 能量更需要一个诚实的小动作，而不是完美计划。`,
      prompt: () => '把一个没说出口的想法写下来。',
      shareText: (type) => `我抽到 ${type} 今日信号人格牌。`,
    },
  },
  ja: {
    coreSelf: {
      title: '核となる自己',
      subtitle: '安定した中心',
      body: (type) => `本物だと感じるものと意味を守るとき、${type} のパターンは最もはっきり表れます。`,
      prompt: (item) => item.prompts?.[0] || '今日、より丁寧に守るべき自分の一部は何ですか？',
      shareText: (type) => `${type} の核となる自己カードを引きました。`,
    },
    hiddenPower: {
      title: '隠れた力',
      subtitle: '静かな強み',
      body: (type) => `${type} の見落とされやすい強みは、大きな音ではなく、タイミング、思いやり、信念を通じて働きます。`,
      prompt: (item) => item.prompts?.[1] || '自然すぎて見落としている強みは何ですか？',
      shareText: (type) => `${type} の隠れた力カードを引きました。`,
    },
    todaysSignal: {
      title: '今日のサイン',
      subtitle: '今の合図',
      body: (type) => `今日の ${type} のエネルギーは、完璧な計画より小さく正直な一歩を求めています。`,
      prompt: () => 'まだ言葉にしていない考えを一つ書き出してください。',
      shareText: (type) => `${type} の今日のサインカードを引きました。`,
    },
  },
  ko: {
    coreSelf: {
      title: '핵심 자아',
      subtitle: '흔들리지 않는 중심',
      body: (type) => `진짜라고 느끼는 것과 의미를 지킬 때 ${type}의 패턴이 가장 선명하게 드러납니다.`,
      prompt: (item) => item.prompts?.[0] || '오늘 더 분명히 보호해야 할 내 모습은 무엇인가요?',
      shareText: (type) => `${type} 핵심 자아 카드를 뽑았습니다.`,
    },
    hiddenPower: {
      title: '숨은 힘',
      subtitle: '조용한 강점',
      body: (type) => `${type}의 과소평가된 힘은 크게 드러나지 않아도 타이밍, 배려, 확신을 통해 작동합니다.`,
      prompt: (item) => item.prompts?.[1] || '너무 자연스러워서 놓치고 있는 강점은 무엇인가요?',
      shareText: (type) => `${type} 숨은 힘 카드를 뽑았습니다.`,
    },
    todaysSignal: {
      title: '오늘의 신호',
      subtitle: '지금의 단서',
      body: (type) => `오늘의 ${type} 에너지는 완벽한 계획보다 작고 솔직한 움직임을 원합니다.`,
      prompt: () => '아직 말하지 않은 생각 하나를 적어보세요.',
      shareText: (type) => `${type} 오늘의 신호 카드를 뽑았습니다.`,
    },
  },
};

const MBTI_CARD_ART_IMAGES = {
  coreSelf: '/assets/mbti-card-draw/core-self.webp',
  hiddenPower: '/assets/mbti-card-draw/hidden-power.webp',
  todaysSignal: '/assets/mbti-card-draw/todays-signal.webp',
};

export function isValidMbtiType(type) {
  return MBTI_AVATAR_TYPES.some((item) => item.type === type);
}

export function isValidCardPosition(position) {
  return MBTI_CARD_POSITIONS.includes(position);
}

export function normalizeMbtiType(type) {
  const normalized = String(type || '').trim().toUpperCase();
  return isValidMbtiType(normalized) ? normalized : null;
}

export function loadSavedMbtiResultType() {
  try {
    const saved = JSON.parse(localStorage.getItem(MBTI_RESULT_STORAGE_KEY) || '{}');
    return normalizeMbtiType(saved?.type);
  } catch {
    return null;
  }
}

export function saveMbtiResultType(type) {
  const normalized = normalizeMbtiType(type);
  if (!normalized) return;
  try {
    localStorage.setItem(
      MBTI_RESULT_STORAGE_KEY,
      JSON.stringify({
        type: normalized,
        completedAt: new Date().toISOString(),
        source: 'mbti-personality-test',
      }),
    );
  } catch {
    // Storage is optional. The in-memory result still powers the current page.
  }
}

export function getMbtiDrawCards(type, locale = 'en') {
  const normalized = normalizeMbtiType(type) || 'INFP';
  const source = MBTI_AVATAR_TYPES.find((item) => item.type === normalized) || MBTI_AVATAR_TYPES[0];
  const localizedType = localizeAvatarType(source, locale);
  const fallbackType = localizeAvatarType(source, 'en');
  const localeCopy = POSITION_COPY[locale] || POSITION_COPY.en;
  const fallbackCopy = POSITION_COPY.en;

  return MBTI_CARD_POSITIONS.map((position) => {
    const copy = localeCopy[position] || fallbackCopy[position];
    const fallback = fallbackCopy[position];
    return {
      id: `${normalized.toLowerCase()}-${position.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
      type: normalized,
      position,
      image: MBTI_CARD_ART_IMAGES[position],
      typeTitle: localizedType.title || fallbackType.title,
      typeTone: localizedType.tone || fallbackType.tone,
      title: copy.title || fallback.title,
      subtitle: copy.subtitle || fallback.subtitle,
      body: copy.body?.(normalized, localizedType) || fallback.body(normalized, fallbackType),
      prompt: copy.prompt?.(localizedType, normalized) || fallback.prompt(fallbackType, normalized),
      shareText: copy.shareText?.(normalized) || fallback.shareText(normalized),
      sharePath: `/mbti-card-draw.html?type=${normalized}&card=${position}`,
    };
  });
}

export function getMbtiDrawCard(type, position, locale = 'en') {
  const cards = getMbtiDrawCards(type, locale);
  return cards.find((card) => card.position === position) || cards[0];
}

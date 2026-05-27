import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownToLine,
  Brain,
  Check,
  Copy,
  Eye,
  Layers3,
  RotateCcw,
  Share2,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { COMMON_COPY, detectLocale, LOCALE_LABELS, SUPPORTED_LOCALES, syncLocale } from '../../i18n.js';
import { copyText } from '../../utils/clipboard.js';
import {
  getMbtiDrawCard,
  getMbtiDrawCards,
  isValidCardPosition,
  loadSavedMbtiResultType,
  normalizeMbtiType,
} from './mbtiCardDrawData.js';
import { MBTI_AVATAR_TYPES } from './mbtiAvatarData.js';

const DRAW_COPY = {
  en: {
    brand: 'MBTI Card Draw',
    brandSub: 'Same-type tarot spread',
    backToTest: 'Take the MBTI test',
    avatarLibrary: 'Avatar library',
    resultEyebrow: 'Your result card spread',
    standaloneEyebrow: 'MBTI same-type spread',
    resultTitle: (type) => `Draw three ${type} personality cards`,
    standaloneTitle: 'Draw your MBTI personality cards',
    body:
      'Your type stays fixed. The three cards reveal different faces of the same type: core self, hidden power, and today signal.',
    noResultTitle: 'Choose a type to begin',
    noResultBody: 'If you already know your MBTI type, pick it here. For a more personal result, take the full test first.',
    savedType: (type) => `Saved result found: ${type}`,
    selectedType: (type) => `Selected type: ${type}`,
    draw: 'Draw my cards',
    reveal: 'Reveal spread',
    revealed: 'Spread revealed',
    choose: 'Choose this card',
    chosen: 'Chosen card',
    reset: 'Draw again',
    download: 'Save card',
    share: 'Copy link',
    copied: 'Link copied',
    shareTitle: (card) => `${card.type} ${card.title} personality card`,
    shareIntro: 'Today I drew',
    promptLabel: 'Reflection prompt',
    typePicker: 'Choose MBTI type',
    emptyCta: 'Take the test first',
    imageNote: 'Dedicated card art generated for this spread.',
  },
  zh: {
    brand: 'MBTI 人格抽卡',
    brandSub: '同类型三牌阵',
    backToTest: '先做 MBTI 测试',
    avatarLibrary: '形象卡库',
    resultEyebrow: '你的结果牌阵',
    standaloneEyebrow: 'MBTI 同类型牌阵',
    resultTitle: (type) => `抽取三张 ${type} 人格牌`,
    standaloneTitle: '抽取你的 MBTI 人格牌',
    body: '人格类型保持不变。三张牌展示同一类型的三个侧面：核心自我、隐藏力量和今日信号。',
    noResultTitle: '选择一个类型开始',
    noResultBody: '如果你已经知道自己的 MBTI，可以直接选择。想让结果更贴合自己，可以先完成完整测试。',
    savedType: (type) => `已找到本地结果：${type}`,
    selectedType: (type) => `当前类型：${type}`,
    draw: '抽取我的人格牌',
    reveal: '翻开牌阵',
    revealed: '牌阵已翻开',
    choose: '选择这张',
    chosen: '已选择',
    reset: '重新抽取',
    download: '保存卡片',
    share: '复制链接',
    copied: '链接已复制',
    shareTitle: (card) => `${card.type} ${card.title} 人格牌`,
    shareIntro: '我今天抽到',
    promptLabel: '自我提问',
    typePicker: '选择 MBTI 类型',
    emptyCta: '先完成测试',
    imageNote: '已使用专属卡牌视觉资产。',
  },
  ja: {
    brand: 'MBTIカードドロー',
    brandSub: '同タイプの3枚スプレッド',
    backToTest: 'MBTI診断を受ける',
    avatarLibrary: 'アバター一覧',
    resultEyebrow: 'あなたの結果カード',
    standaloneEyebrow: 'MBTI同タイプスプレッド',
    resultTitle: (type) => `${type} の性格カードを3枚引く`,
    standaloneTitle: 'MBTI性格カードを引く',
    body: 'タイプは固定です。3枚のカードは、核となる自己、隠れた力、今日のサインを表します。',
    noResultTitle: 'タイプを選んで開始',
    noResultBody: '自分のMBTIタイプが分かる場合は選んでください。より自分らしい結果には、先に診断を受けてください。',
    savedType: (type) => `保存された結果: ${type}`,
    selectedType: (type) => `選択中のタイプ: ${type}`,
    draw: 'カードを引く',
    reveal: 'カードを開く',
    revealed: '開封済み',
    choose: 'このカードを選ぶ',
    chosen: '選択中',
    reset: 'もう一度引く',
    download: 'カードを保存',
    share: 'リンクをコピー',
    copied: 'コピーしました',
    shareTitle: (card) => `${card.type} ${card.title} 性格カード`,
    shareIntro: '今日引いたカード',
    promptLabel: '内省の問い',
    typePicker: 'MBTIタイプを選ぶ',
    emptyCta: '先に診断する',
    imageNote: 'このスプレッド専用のカードアートを使用しています。',
  },
  ko: {
    brand: 'MBTI 카드 뽑기',
    brandSub: '같은 유형 3장 스프레드',
    backToTest: 'MBTI 테스트 하기',
    avatarLibrary: '아바타 라이브러리',
    resultEyebrow: '나의 결과 카드',
    standaloneEyebrow: 'MBTI 같은 유형 스프레드',
    resultTitle: (type) => `${type} 성격 카드 3장 뽑기`,
    standaloneTitle: '나의 MBTI 성격 카드 뽑기',
    body: '유형은 고정됩니다. 세 장의 카드는 같은 유형의 핵심 자아, 숨은 힘, 오늘의 신호를 보여줍니다.',
    noResultTitle: '유형을 선택해 시작하기',
    noResultBody: '이미 MBTI 유형을 알고 있다면 선택하세요. 더 개인적인 결과를 원하면 먼저 전체 테스트를 진행하세요.',
    savedType: (type) => `저장된 결과: ${type}`,
    selectedType: (type) => `선택한 유형: ${type}`,
    draw: '성격 카드 뽑기',
    reveal: '카드 펼치기',
    revealed: '펼침 완료',
    choose: '이 카드 선택',
    chosen: '선택됨',
    reset: '다시 뽑기',
    download: '카드 저장',
    share: '링크 복사',
    copied: '복사됨',
    shareTitle: (card) => `${card.type} ${card.title} 성격 카드`,
    shareIntro: '오늘 뽑은 카드',
    promptLabel: '성찰 질문',
    typePicker: 'MBTI 유형 선택',
    emptyCta: '먼저 테스트하기',
    imageNote: '이 스프레드 전용 카드 아트를 사용합니다.',
  },
};

function getCopy(locale) {
  return DRAW_COPY[locale] || DRAW_COPY.en;
}

function getParamType() {
  if (typeof window === 'undefined') return null;
  return normalizeMbtiType(new URLSearchParams(window.location.search).get('type'));
}

function getParamCard() {
  if (typeof window === 'undefined') return null;
  const card = new URLSearchParams(window.location.search).get('card');
  return isValidCardPosition(card) ? card : null;
}

function buildAbsoluteUrl(path) {
  if (typeof window === 'undefined') return `https://personalitycalculator.org${path}`;
  const origin =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'https://personalitycalculator.org'
      : window.location.origin;
  return `${origin}${path}`;
}

export function MbtiCardDrawPage() {
  const [locale, setLocale] = useState(detectLocale);
  const copy = getCopy(locale);

  useEffect(() => {
    syncLocale(locale);
  }, [locale]);

  return (
    <main className="mbti-card-draw-app">
      <header className="mbti-card-draw-header">
        <a className="mbti-card-draw-brand" href="/">
          <span>
            <WandSparkles size={26} />
          </span>
          <span>
            <strong>{copy.brand}</strong>
            <small>{copy.brandSub}</small>
          </span>
        </a>
        <nav className="mbti-card-draw-nav" aria-label="MBTI card draw actions">
          <a href="/mbti-personality-test.html">{copy.backToTest}</a>
          <a href="/which-infp-avatar-represents-you.html">{copy.avatarLibrary}</a>
        </nav>
        <div className="language-links compact" aria-label="Languages">
          {SUPPORTED_LOCALES.map((item) => (
            <button key={item} type="button" className={locale === item ? 'active' : ''} onClick={() => setLocale(item)}>
              {LOCALE_LABELS[item]}
            </button>
          ))}
        </div>
      </header>

      <MbtiCardDrawExperience locale={locale} variant="standalone" />
    </main>
  );
}

export function MbtiCardDrawExperience({ locale, initialType, variant = 'embedded' }) {
  const copy = getCopy(locale);
  const commonCopy = COMMON_COPY[locale] || COMMON_COPY.en;
  const paramType = useMemo(getParamType, []);
  const paramCard = useMemo(getParamCard, []);
  const savedType = useMemo(() => {
    if (variant !== 'standalone') return null;
    return loadSavedMbtiResultType();
  }, [variant]);
  const startingType = normalizeMbtiType(initialType) || paramType || savedType || null;
  const [selectedType, setSelectedType] = useState(startingType);
  const [drawn, setDrawn] = useState(Boolean(startingType && paramCard));
  const [selectedPosition, setSelectedPosition] = useState(paramCard);
  const [copied, setCopied] = useState(false);
  const shareCardRef = useRef(null);
  const cards = useMemo(() => (selectedType ? getMbtiDrawCards(selectedType, locale) : []), [locale, selectedType]);
  const selectedCard = selectedType && selectedPosition ? getMbtiDrawCard(selectedType, selectedPosition, locale) : null;
  const isStandalone = variant === 'standalone';

  function chooseType(type) {
    setSelectedType(type);
    setDrawn(false);
    setSelectedPosition(null);
  }

  function revealCards() {
    if (!selectedType) return;
    setDrawn(true);
    setSelectedPosition(null);
  }

  function chooseCard(position) {
    setSelectedPosition(position);
  }

  function resetDraw() {
    setDrawn(false);
    setSelectedPosition(null);
  }

  async function shareSelectedCard() {
    if (!selectedCard) return;
    const url = buildAbsoluteUrl(selectedCard.sharePath);
    if (navigator.share) {
      try {
        await navigator.share({ title: copy.shareTitle(selectedCard), text: selectedCard.shareText, url });
        return;
      } catch {
        // Fall back to copying when native share is cancelled or unavailable.
      }
    }
    await copyText(`${selectedCard.shareText} ${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function downloadSelectedCard() {
    if (!shareCardRef.current || !selectedCard) return;
    const dataUrl = await toPng(shareCardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#f8fbff',
    });
    const link = document.createElement('a');
    link.download = `${selectedCard.id}-mbti-card.png`;
    link.href = dataUrl;
    link.click();
  }

  return (
    <section className={isStandalone ? 'mbti-card-draw-shell standalone' : 'mbti-card-draw-shell embedded'} aria-label={copy.brand}>
      <div className="mbti-card-draw-copy">
        <span className="mbti-card-draw-kicker">{isStandalone ? copy.standaloneEyebrow : copy.resultEyebrow}</span>
        <h2>{selectedType ? copy.resultTitle(selectedType) : copy.standaloneTitle}</h2>
        <p>{copy.body}</p>
        <div className="mbti-card-draw-status">
          {selectedType ? (
            <span>{savedType === selectedType ? copy.savedType(selectedType) : copy.selectedType(selectedType)}</span>
          ) : (
            <span>{copy.noResultTitle}</span>
          )}
          <span>{copy.imageNote}</span>
        </div>
        {!selectedType && (
          <div className="mbti-card-draw-empty">
            <h3>{copy.noResultTitle}</h3>
            <p>{copy.noResultBody}</p>
            <a href="/mbti-personality-test.html">{copy.emptyCta}</a>
          </div>
        )}
      </div>

      <div className="mbti-card-draw-stage">
        {!initialType && (
          <div className="mbti-card-type-picker" aria-label={copy.typePicker}>
            {MBTI_AVATAR_TYPES.map((item) => (
              <button key={item.type} type="button" className={selectedType === item.type ? 'active' : ''} onClick={() => chooseType(item.type)}>
                {item.type}
              </button>
            ))}
          </div>
        )}

        <div className={drawn ? 'mbti-card-spread revealed' : 'mbti-card-spread'}>
          {selectedType && cards.map((card) => (
            <article
              key={card.id}
              className={selectedPosition === card.position ? 'mbti-draw-card selected' : 'mbti-draw-card'}
            >
              <div className="mbti-draw-card-inner">
                {!drawn ? (
                  <button type="button" className="mbti-draw-card-back" onClick={revealCards} aria-label={`${copy.reveal}: ${card.title}`}>
                    <Sparkles size={24} />
                    <span>{card.title}</span>
                    <small>{copy.reveal}</small>
                  </button>
                ) : (
                  <div className="mbti-draw-card-face">
                    <img src={card.image} alt={`${card.type} ${card.title}`} />
                    <span>{card.type} · {card.typeTitle}</span>
                    <h3>{card.title}</h3>
                    <strong>{card.subtitle}</strong>
                    <p>{card.body}</p>
                    <button type="button" onClick={() => chooseCard(card.position)}>
                      {selectedPosition === card.position ? <Check size={17} /> : <Eye size={17} />}
                      {selectedPosition === card.position ? copy.chosen : copy.choose}
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mbti-card-draw-actions">
          <button type="button" className="mbti-primary-btn" onClick={revealCards} disabled={!selectedType || drawn}>
            <Layers3 size={19} />
            {drawn ? copy.revealed : copy.draw}
          </button>
          <button type="button" className="mbti-secondary-btn" onClick={resetDraw} disabled={!selectedType}>
            <RotateCcw size={18} />
            {copy.reset}
          </button>
        </div>

        {selectedCard && (
          <div className="mbti-selected-card-panel">
            <MbtiSelectedShareCard card={selectedCard} copy={copy} refProp={shareCardRef} />
            <div className="mbti-selected-card-actions">
              <button type="button" className="mbti-secondary-btn" onClick={shareSelectedCard}>
                {copied ? <Copy size={18} /> : <Share2 size={18} />}
                {copied ? copy.copied : copy.share}
              </button>
              <button type="button" className="mbti-primary-btn" onClick={downloadSelectedCard}>
                <ArrowDownToLine size={19} />
                {commonCopy.downloadCard || copy.download}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function MbtiSelectedShareCard({ card, copy, refProp }) {
  return (
    <article className="mbti-selected-share-card" ref={refProp}>
      <div className="mbti-selected-share-art">
        <img src={card.image} alt={`${card.type} ${card.title}`} />
      </div>
      <div className="mbti-selected-share-copy">
        <span>{copy.shareIntro}</span>
        <h3>{card.type} · {card.title}</h3>
        <strong>{card.subtitle}</strong>
        <p>{card.body}</p>
        <div>
          <small>{copy.promptLabel}</small>
          <em>{card.prompt}</em>
        </div>
        <footer>
          <Brain size={17} />
          personalitycalculator.org
        </footer>
      </div>
    </article>
  );
}

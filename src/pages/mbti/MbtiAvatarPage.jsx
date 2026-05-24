import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Brain,
  Check,
  CircleUserRound,
  Compass,
  Eye,
  Image as ImageIcon,
  Layers3,
  Sparkles,
} from 'lucide-react';
import { detectLocale, LOCALE_LABELS, SUPPORTED_LOCALES, syncLocale } from '../../i18n.js';
import { MBTI_AVATAR_IMAGES, MBTI_AVATAR_TYPES } from './mbtiAvatarData.js';
import { TYPE_PROFILES } from './mbtiData.js';

const PAGE_COPY = {
  zh: {
    brand: 'MBTI 形象卡片',
    brandSub: '用视觉读懂 16 型人格',
    back: '返回 MBTI 测试',
    title: '选择你的 MBTI 人格形象：16 型头像与分析',
    intro:
      '这页把 16 型人格拆成可感知的形象：每个类型都有男女两个版本。选择任意人格后，可以看到它的视觉表现、人格分析、常见优势和测试作答倾向。',
    start: '查看当前人格',
    allTypes: '浏览 16 型',
    spotlight: (type) => `${type} 形象与人格分析`,
    spotlightBody:
      '不同人格进来时，都应该先看到自己对应的形象表现，再阅读文字分析。男女版本表达的是同一人格的两种外显方式，不改变人格类型本身。',
    feminine: '女性版本',
    masculine: '男性版本',
    choose: '查看这个版本',
    selected: '当前展示',
    selectedTitle: '当前人格详情',
    selectedBody: '这张图可作为人格详情卡的视觉入口：用户先通过形象感受类型气质，再对照文字解释和测试作答倾向。',
    typeGrid: '16 型形象库',
    typeGridBody: '点击任意人格或头像，会切换到对应人格的详细介绍；下方链接不再跳回测试页。',
    visualCues: '视觉线索',
    cardUse: '人格表现',
    reflection: '自我对照线索',
    answerPattern: '测试作答倾向',
    detailCta: (type) => `查看 ${type} 详细介绍`,
    strength: '核心优势',
    growth: '成长提醒',
    contentModel: '这些图可以放进 MBTI 卡片内容吗？',
    contentBody:
      '可以。建议把图片当作卡片的信息架构之一：先用图像建立类型氛围，再用短句解释人格动机，最后给出优势、盲点和自我提问。',
    contentItems: [
      ['形象', '负责第一眼识别：服装、姿态、道具、场景表达人格气质。'],
      ['分析', '解释这个类型为什么会这样选择、行动或表达情绪。'],
      ['行动', '把结果落到成长建议、关系沟通、职业偏好和自我提问。'],
    ],
    sourceNote: '图片由 imagegen 生成，并切分为 32 张项目内资源。',
  },
  en: {
    brand: 'MBTI Avatar Cards',
    brandSub: 'Visual personality cards for all 16 types',
    back: 'Back to MBTI Test',
    title: 'Choose your MBTI avatar: 16 type visuals and analysis',
    intro:
      'This page turns all 16 MBTI-inspired types into readable avatars. Choose any type to see its visual expression, type analysis, strengths, and likely answer tendencies.',
    start: 'View Current Type',
    allTypes: 'Browse 16 Types',
    spotlight: (type) => `${type} Avatar and Type Analysis`,
    spotlightBody:
      'Each type should land on its own analysis and visual identity. The feminine and masculine versions are two expressions of the same personality pattern, not different results.',
    feminine: 'Feminine Version',
    masculine: 'Masculine Version',
    choose: 'View this version',
    selected: 'Current view',
    selectedTitle: 'Current Type Detail',
    selectedBody: 'Use this image as the visual entry for a type card: users first feel the type, then compare it with written interpretation and answer tendencies.',
    typeGrid: '16-Type Avatar Library',
    typeGridBody: 'Click any type or avatar to switch to that type detail. The links now open the type analysis instead of returning to the test.',
    visualCues: 'Visual cues',
    cardUse: 'Type expression',
    reflection: 'Self-check cues',
    answerPattern: 'Likely answer tendencies',
    detailCta: (type) => `View ${type} detail`,
    strength: 'Core strengths',
    growth: 'Growth tips',
    contentModel: 'Can these images be used inside MBTI analysis cards?',
    contentBody:
      'Yes. Treat the image as part of the card information architecture: visual atmosphere first, personality motivation second, and strengths, blind spots, and reflection prompts last.',
    contentItems: [
      ['Image', 'Creates first-glance recognition through clothing, pose, props, and setting.'],
      ['Analysis', 'Explains why this type chooses, acts, or expresses emotion in that way.'],
      ['Action', 'Turns the result into growth tips, communication cues, career fit, and self-reflection.'],
    ],
    sourceNote: 'Images were generated with imagegen and split into 32 project assets.',
  },
};

function getCopy(locale) {
  return PAGE_COPY[locale] || PAGE_COPY.en;
}

function getAvatarKey(type, gender) {
  return `${type}-${gender}`;
}

function getInitialType() {
  if (typeof window === 'undefined') return 'INFP';
  const type = new URLSearchParams(window.location.search).get('type')?.toUpperCase();
  return MBTI_AVATAR_TYPES.some((item) => item.type === type) ? type : 'INFP';
}

const ANSWER_TENDENCIES = {
  zh: {
    I: '更可能认同安静充电、深度一对一交流、先观察再表达。',
    E: '更可能认同从社交互动获得能量、主动开启讨论、快速外放想法。',
    N: '更可能认同模式洞察、未来可能性、抽象概念和跨领域联想。',
    S: '更可能认同具体事实、实际经验、清晰步骤和可验证案例。',
    T: '更可能认同逻辑优先、客观标准、直接指出问题和原则一致性。',
    F: '更可能认同价值感、情绪影响、关系和谐和支持性反馈。',
    J: '更可能认同提前计划、明确期限、任务闭环和稳定安排。',
    P: '更可能认同保留选项、临场调整、探索变化和灵活推进。',
  },
  en: {
    I: 'Likely to agree with quiet recharge, deep one-on-one conversation, and observing before joining.',
    E: 'Likely to agree with gaining energy from people, starting group activity, and thinking out loud.',
    N: 'Likely to agree with patterns, future possibilities, abstract ideas, and broad connections.',
    S: 'Likely to agree with concrete facts, lived experience, clear steps, and testable examples.',
    T: 'Likely to agree with logic first, objective criteria, direct critique, and consistent principles.',
    F: 'Likely to agree with values, emotional impact, harmony, and supportive feedback.',
    J: 'Likely to agree with planning ahead, clear deadlines, task closure, and stable structure.',
    P: 'Likely to agree with open options, improvisation, change, and flexible progress.',
  },
};

function getAnswerTendencies(type, locale) {
  const copy = ANSWER_TENDENCIES[locale] || ANSWER_TENDENCIES.en;
  return type.split('').map((letter) => `${letter}: ${copy[letter]}`);
}

export function MbtiAvatarPage() {
  const [locale, setLocale] = useState(detectLocale);
  const [selectedType, setSelectedType] = useState(getInitialType);
  const [selectedGender, setSelectedGender] = useState('female');
  const copy = getCopy(locale);
  const selected = useMemo(
    () => MBTI_AVATAR_TYPES.find((item) => item.type === selectedType) || MBTI_AVATAR_TYPES[0],
    [selectedType],
  );
  const selectedProfile = TYPE_PROFILES[selected.type];

  function changeLocale(nextLocale) {
    setLocale(nextLocale);
    syncLocale(nextLocale);
  }

  function selectAvatar(type, gender) {
    setSelectedType(type);
    setSelectedGender(gender);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('type', type);
      window.history.replaceState(null, '', `${url.pathname}${url.search}#personality-detail`);
    }
  }

  function openTypeDetail(type, gender = selectedGender) {
    selectAvatar(type, gender);
    requestAnimationFrame(() => {
      document.getElementById('personality-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  return (
    <main className="mbti-avatar-app">
      <header className="mbti-avatar-header">
        <a className="mbti-avatar-brand" href="/">
          <span><Brain size={27} /></span>
          <strong>{copy.brand}</strong>
          <small>{copy.brandSub}</small>
        </a>
        <nav className="mbti-avatar-nav" aria-label="MBTI avatar page actions">
          <a href="/mbti-personality-test.html">{copy.back}</a>
          <div className="language-links compact" aria-label="Languages">
            {SUPPORTED_LOCALES.map((item) => (
              <button key={item} type="button" className={locale === item ? 'active' : ''} onClick={() => changeLocale(item)}>
                {LOCALE_LABELS[item]}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <section className="mbti-avatar-hero">
        <div className="mbti-avatar-hero-copy">
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
          <div className="mbti-avatar-actions">
            <a className="mbti-avatar-primary" href="#personality-detail">
              <Sparkles size={20} />
              {copy.start}
            </a>
            <a className="mbti-avatar-secondary" href="#all-mbti-avatars">
              <Layers3 size={20} />
              {copy.allTypes}
            </a>
          </div>
        </div>
        <div className="mbti-avatar-hero-art" aria-label="INFP avatar preview">
          <img src={MBTI_AVATAR_IMAGES[getAvatarKey(selected.type, 'female')]} alt={`${selected.type} feminine avatar preview`} />
          <img src={MBTI_AVATAR_IMAGES[getAvatarKey(selected.type, 'male')]} alt={`${selected.type} masculine avatar preview`} />
        </div>
      </section>

      <section className="mbti-avatar-spotlight" id="personality-detail" aria-labelledby="mbti-avatar-detail-title">
        <div className="mbti-avatar-section-head">
          <span><Compass size={22} /></span>
          <div>
            <h2 id="mbti-avatar-detail-title">{copy.spotlight(selected.type)}</h2>
            <p>{copy.spotlightBody}</p>
          </div>
        </div>
        <div className="infp-choice-grid">
          {['female', 'male'].map((gender) => (
            <AvatarChoiceCard
              key={gender}
              type={selected.type}
              gender={gender}
              label={gender === 'female' ? copy.feminine : copy.masculine}
              selected={selectedType === selected.type && selectedGender === gender}
              onSelect={selectAvatar}
              copy={copy}
            />
          ))}
          <SelectedAnalysis copy={copy} locale={locale} selected={selected} selectedGender={selectedGender} profile={selectedProfile} />
        </div>
      </section>

      <section className="mbti-avatar-library" id="all-mbti-avatars" aria-labelledby="mbti-avatar-library-title">
        <div className="mbti-avatar-section-head wide">
          <span><ImageIcon size={22} /></span>
          <div>
            <h2 id="mbti-avatar-library-title">{copy.typeGrid}</h2>
            <p>{copy.typeGridBody}</p>
          </div>
        </div>

        <div className="mbti-type-filter" aria-label="MBTI type filters">
          {MBTI_AVATAR_TYPES.map((item) => (
            <button
              key={item.type}
              type="button"
              className={selectedType === item.type ? 'active' : ''}
              onClick={() => openTypeDetail(item.type)}
            >
              {item.type}
            </button>
          ))}
        </div>

        <div className="mbti-avatar-card-grid">
          {MBTI_AVATAR_TYPES.map((item) => (
            <TypeAvatarCard
              key={item.type}
              item={item}
              selectedType={selectedType}
              selectedGender={selectedGender}
              onSelect={selectAvatar}
              onOpenDetail={openTypeDetail}
              copy={copy}
            />
          ))}
        </div>
      </section>

      <section className="mbti-avatar-model" aria-labelledby="mbti-avatar-model-title">
        <div>
          <h2 id="mbti-avatar-model-title">{copy.contentModel}</h2>
          <p>{copy.contentBody}</p>
        </div>
        <div className="mbti-avatar-model-grid">
          {copy.contentItems.map(([title, body], index) => (
            <article key={title}>
              <span>{index + 1}</span>
              <strong>{title}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <small>{copy.sourceNote}</small>
      </section>
    </main>
  );
}

function AvatarChoiceCard({ type, gender, label, selected, onSelect, copy }) {
  const imageKey = getAvatarKey(type, gender);
  return (
    <article className={selected ? 'avatar-choice-card selected' : 'avatar-choice-card'}>
      <img src={MBTI_AVATAR_IMAGES[imageKey]} alt={`${type} ${label}`} />
      <div>
        <span>{type}</span>
        <strong>{label}</strong>
      </div>
      <button type="button" onClick={() => onSelect(type, gender)}>
        {selected ? <Check size={18} /> : <CircleUserRound size={18} />}
        {selected ? copy.selected : copy.choose}
      </button>
    </article>
  );
}

function SelectedAnalysis({ copy, locale, selected, selectedGender, profile }) {
  const label = selectedGender === 'female' ? copy.feminine : copy.masculine;
  const answerTendencies = getAnswerTendencies(selected.type, locale);
  return (
    <aside className="selected-avatar-analysis">
      <div className="selected-avatar-title">
        <Eye size={22} />
        <div>
          <span>{copy.selectedTitle}</span>
          <h3>{selected.type} · {label}</h3>
        </div>
      </div>
      <img
        className="selected-avatar-image"
        src={MBTI_AVATAR_IMAGES[getAvatarKey(selected.type, selectedGender)]}
        alt={`${selected.type} ${label}`}
      />
      <p>{copy.selectedBody}</p>
      <dl>
        <div>
          <dt>{copy.visualCues}</dt>
          <dd>{selected.visualCues.join(' / ')}</dd>
        </div>
        <div>
          <dt>{copy.cardUse}</dt>
          <dd>{selected.cardUse}</dd>
        </div>
      </dl>
      <div className="selected-avatar-lists">
        <MiniList title={copy.strength} items={profile?.strengths || []} />
        <MiniList title={copy.growth} items={profile?.growth || []} />
      </div>
      <MiniList title={copy.answerPattern} items={answerTendencies} />
    </aside>
  );
}

function TypeAvatarCard({ item, selectedType, selectedGender, onSelect, onOpenDetail, copy }) {
  return (
    <article className={selectedType === item.type ? 'type-avatar-card active' : 'type-avatar-card'}>
      <div className="type-avatar-images">
        {['female', 'male'].map((gender) => (
          <button
            key={gender}
            type="button"
            className={selectedType === item.type && selectedGender === gender ? 'active' : ''}
            onClick={() => onOpenDetail(item.type, gender)}
            aria-label={`${item.type} ${gender}`}
          >
            <img src={MBTI_AVATAR_IMAGES[getAvatarKey(item.type, gender)]} alt="" />
          </button>
        ))}
      </div>
      <div className="type-avatar-copy">
        <div>
          <span>{item.type}</span>
          <small>{item.palette}</small>
        </div>
        <h3>{item.title}</h3>
        <p>{item.essence}</p>
        <MiniList title={copy.visualCues} items={item.visualCues} />
        <MiniList title={copy.reflection} items={item.prompts} />
        <a
          href={`?type=${item.type}#personality-detail`}
          onClick={(event) => {
            event.preventDefault();
            onOpenDetail(item.type, selectedGender);
          }}
        >
          {copy.detailCta(item.type)}
          <ArrowRight size={16} />
        </a>
      </div>
    </article>
  );
}

function MiniList({ title, items }) {
  return (
    <div className="avatar-mini-list">
      <strong>{title}</strong>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <Check size={14} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

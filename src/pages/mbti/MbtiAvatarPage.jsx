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
    title: '哪个版本的 INFP 头像 / 形象最能代表你？',
    intro:
      '这页把 16 型人格拆成可感知的形象：每个类型都有男女两个版本。图片不是装饰，而是人格卡片的“第一层分析”：姿态、道具、色彩和场景都可以对应性格动机。',
    start: '查看 INFP 版本',
    allTypes: '浏览 16 型',
    spotlight: 'INFP 形象选择',
    spotlightBody:
      'INFP 的关键不是“柔弱”，而是真诚、想象力和价值感。两个版本都保留了安静、创作、自然和内在信念，只是表达方式不同。',
    feminine: '女性版本',
    masculine: '男性版本',
    choose: '选择这个版本',
    selected: '已选择',
    selectedTitle: '当前卡片分析',
    selectedBody: '这张图可以放进 MBTI 分析卡里，用来帮助用户先感受到类型，再阅读文字解释。',
    typeGrid: '16 型形象库',
    typeGridBody: '每张卡都包含两种形象、人格语气、视觉线索和可写进结果卡的分析角度。',
    visualCues: '视觉线索',
    cardUse: '卡片怎么用',
    reflection: '可放入卡片的问题',
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
    title: 'Which version of the INFP avatar represents you best?',
    intro:
      'This page turns all 16 MBTI-inspired types into readable avatars. Every type has one feminine and one masculine version, and each image is designed to support the analysis card instead of acting as decoration.',
    start: 'View INFP Versions',
    allTypes: 'Browse 16 Types',
    spotlight: 'INFP Avatar Choice',
    spotlightBody:
      'INFP is not about softness alone. The core cues are authenticity, imagination, values, nature, and a private creative world expressed in two different visual modes.',
    feminine: 'Feminine Version',
    masculine: 'Masculine Version',
    choose: 'Choose this version',
    selected: 'Selected',
    selectedTitle: 'Current Card Analysis',
    selectedBody: 'Use this image inside an MBTI result card to help users feel the type before reading the written interpretation.',
    typeGrid: '16-Type Avatar Library',
    typeGridBody: 'Each card includes two avatar versions, personality tone, visual cues, and analysis angles for result cards.',
    visualCues: 'Visual cues',
    cardUse: 'Card use',
    reflection: 'Card prompts',
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

export function MbtiAvatarPage() {
  const [locale, setLocale] = useState(detectLocale);
  const [selectedType, setSelectedType] = useState('INFP');
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
            <a className="mbti-avatar-primary" href="#infp-avatars">
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
          <img src={MBTI_AVATAR_IMAGES['INFP-female']} alt="INFP feminine avatar preview" />
          <img src={MBTI_AVATAR_IMAGES['INFP-male']} alt="INFP masculine avatar preview" />
        </div>
      </section>

      <section className="mbti-avatar-spotlight" id="infp-avatars" aria-labelledby="infp-avatar-title">
        <div className="mbti-avatar-section-head">
          <span><Compass size={22} /></span>
          <div>
            <h2 id="infp-avatar-title">{copy.spotlight}</h2>
            <p>{copy.spotlightBody}</p>
          </div>
        </div>
        <div className="infp-choice-grid">
          {['female', 'male'].map((gender) => (
            <AvatarChoiceCard
              key={gender}
              type="INFP"
              gender={gender}
              label={gender === 'female' ? copy.feminine : copy.masculine}
              selected={selectedType === 'INFP' && selectedGender === gender}
              onSelect={selectAvatar}
              copy={copy}
            />
          ))}
          <SelectedAnalysis copy={copy} selected={selected} selectedGender={selectedGender} profile={selectedProfile} />
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
              onClick={() => selectAvatar(item.type, selectedGender)}
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

function SelectedAnalysis({ copy, selected, selectedGender, profile }) {
  const label = selectedGender === 'female' ? copy.feminine : copy.masculine;
  return (
    <aside className="selected-avatar-analysis">
      <div className="selected-avatar-title">
        <Eye size={22} />
        <div>
          <span>{copy.selectedTitle}</span>
          <h3>{selected.type} · {label}</h3>
        </div>
      </div>
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
    </aside>
  );
}

function TypeAvatarCard({ item, selectedType, selectedGender, onSelect, copy }) {
  const profile = TYPE_PROFILES[item.type];
  return (
    <article className={selectedType === item.type ? 'type-avatar-card active' : 'type-avatar-card'}>
      <div className="type-avatar-images">
        {['female', 'male'].map((gender) => (
          <button
            key={gender}
            type="button"
            className={selectedType === item.type && selectedGender === gender ? 'active' : ''}
            onClick={() => onSelect(item.type, gender)}
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
        <a href="/mbti-personality-test.html">
          {profile?.title || item.tone}
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

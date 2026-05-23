import { Clock3, FileQuestion, Sparkles, Star } from 'lucide-react';
import { formatDuration } from '../../../i18n.js';

export function FeaturedTestCard({ test, copy }) {
  const Icon = test.icon;
  return (
    <a className="featured-card" href={test.href}>
      <span className={`landing-icon ${test.iconClass}`}>
        <Icon size={25} />
      </span>
      <strong>{test.title}</strong>
      <p>{test.description}</p>
      <span className="start-link">{copy.start} <span aria-hidden="true">→</span></span>
    </a>
  );
}

export function MiniTestCard({ test, copy, locale, rank }) {
  const Icon = test.icon;
  return (
    <a className="mini-test-card" href={test.href}>
      <div className="mini-test-card-top">
        <span className={`landing-icon small ${test.iconClass}`}>
          <Icon size={18} />
        </span>
        {rank && <strong>#{rank}</strong>}
      </div>
      <h3>{test.title}</h3>
      <p>{test.description}</p>
      <div className="test-meta">
        <span><Clock3 size={13} /> {formatDuration(test.time, locale)}</span>
        <span><FileQuestion size={13} /> {test.questions} {copy.questions}</span>
      </div>
    </a>
  );
}

export function TestCard({ test, copy, locale }) {
  const Icon = test.icon;
  return (
    <a className="test-card" href={test.href}>
      <div className="test-card-title">
        <span className={`landing-icon small ${test.iconClass}`}>
          <Icon size={20} />
        </span>
        <h3>{test.title}</h3>
      </div>
      <p>{test.description}</p>
      <div className="test-meta">
        <span><Clock3 size={13} /> {formatDuration(test.time, locale)}</span>
        <span><FileQuestion size={13} /> {test.questions} {copy.questions}</span>
      </div>
    </a>
  );
}

export function HeroIllustration() {
  return (
    <div className="hero-illustration" aria-hidden="true">
      <div className="hero-plant left" />
      <div className="hero-plant right" />
      <div className="hero-person">
        <div className="hero-brain">
          <span />
          <span />
          <span />
        </div>
        <div className="hero-face">
          <i />
          <i />
          <b />
        </div>
        <div className="hero-body" />
      </div>
      <Sparkles className="hero-sparkle s1" size={20} />
      <Sparkles className="hero-sparkle s2" size={17} />
      <Star className="hero-sparkle s3" size={18} />
    </div>
  );
}


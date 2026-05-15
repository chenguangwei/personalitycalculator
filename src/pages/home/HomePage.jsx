import {
  Brain,
  ChevronDown,
  Clock3,
  FileQuestion,
  LockKeyhole,
  Search,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import { CATEGORIES, TESTS } from '../../data/tests.jsx';

export function HomePage() {
  const featuredTests = TESTS.slice(0, 6);

  return (
    <main className="landing-app">
      <header className="site-header">
        <a className="landing-brand" href="/" aria-label="personality-calculator home">
          <span className="landing-brand-mark">
            <Brain size={23} />
          </span>
          <span>personality-calculator</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#tests">Tests</a>
          <a href="#categories">Categories <ChevronDown size={14} /></a>
          <a href="#articles">Articles</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="header-actions">
          <button className="search-icon-button" aria-label="Open search">
            <Search size={20} />
          </button>
          <div className="language-links" aria-label="Languages">
            <a href="#en">EN</a>
            <span>|</span>
            <a href="#zh">中文</a>
            <span>|</span>
            <a href="#ja">日本語</a>
          </div>
        </div>
      </header>

      <div className="landing-layout">
        <aside className="category-sidebar" id="categories" aria-label="Test categories">
          <h2>Categories</h2>
          <div className="category-list">
            {CATEGORIES.map(({ label, icon: Icon }, index) => (
              <a key={label} className={index === 0 ? 'active' : ''} href={`#${label.toLowerCase()}`}>
                <Icon size={23} />
                <span>{label}</span>
              </a>
            ))}
          </div>
          <div className="free-card">
            <Trophy size={31} />
            <strong>100% Free</strong>
            <p>All tests are free, fun, and designed to help you understand yourself better.</p>
          </div>
        </aside>

        <section className="landing-main" id="tests">
          <form className="hero-search" role="search">
            <Search size={20} />
            <input type="search" placeholder="Search tests, categories or topics..." aria-label="Search tests" />
            <button type="submit">Search</button>
          </form>

          <section className="landing-hero">
            <div className="hero-copy">
              <h1>
                Discover Your Personality with <span>Fun Calculators &amp; Tests</span>
              </h1>
              <p>Explore 50+ free personality tests and calculators designed to help you learn more about yourself in a fun way.</p>
            </div>
            <HeroIllustration />
          </section>

          <div className="featured-strip" aria-label="Featured personality tests">
            {featuredTests.map((test) => (
              <FeaturedTestCard key={test.title} test={test} />
            ))}
          </div>

          <section className="test-section">
            <div className="section-head">
              <h2>Popular Personality Tests</h2>
              <a href="#all-tests">View all tests <span aria-hidden="true">→</span></a>
            </div>
            <div className="test-grid">
              {TESTS.map((test) => (
                <TestCard key={test.title} test={test} />
              ))}
            </div>
          </section>

          <section className="benefit-band" aria-label="Benefits">
            {[
              ['50+ Free Tests', 'Explore a wide variety of personality tests.', FileQuestion, 'blue'],
              ['Instant Results', 'Get results instantly and learn more about yourself.', Clock3, 'violet'],
              ['Private & Secure', 'Your answers are private and never shared.', LockKeyhole, 'green'],
              ['Fun & Insightful', 'Enjoy fun tests that are both entertaining and meaningful.', Trophy, 'orange'],
            ].map(([title, body, Icon, tone]) => (
              <article key={title}>
                <span className={`landing-icon ${tone}`}>
                  <Icon size={25} />
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </section>
        </section>
      </div>
    </main>
  );
}

function FeaturedTestCard({ test }) {
  const Icon = test.icon;
  return (
    <a className="featured-card" href={test.href}>
      <span className={`landing-icon ${test.iconClass}`}>
        <Icon size={25} />
      </span>
      <strong>{test.title}</strong>
      <p>{test.description}</p>
      <span className="start-link">Start Test <span aria-hidden="true">→</span></span>
    </a>
  );
}

function TestCard({ test }) {
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
        <span><Clock3 size={13} /> {test.time}</span>
        <span><FileQuestion size={13} /> {test.questions} Questions</span>
      </div>
    </a>
  );
}

function HeroIllustration() {
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

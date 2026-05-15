import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownToLine,
  Check,
  ChevronDown,
  Copy,
  Dice5,
  Languages,
  LockKeyhole,
  MousePointerClick,
  RotateCcw,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import {
  AXES,
  AXIS_LABELS_JA,
  CARD_THEMES,
  CELL_COLORS,
  DEFAULT_VALUES,
  UI_TEXT,
  VALUE_OPTIONS,
} from './tomodachiData.js';
import {
  canonicalValuesForPersonality,
  buildShareUrl,
  displayCopyForResult,
  matrixFor,
  personalityFor,
  parseInitialValues,
  readableColor,
  valuesForPersonality,
} from './tomodachiLogic.js';

export function TomodachiPage() {
  const initial = useMemo(parseInitialValues, []);
  const [region, setRegion] = useState(initial.region);
  const [language, setLanguage] = useState(initial.language);
  const [mode, setMode] = useState('manual');
  const [values, setValues] = useState(initial.values);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);
  const result = useMemo(() => personalityFor(values, region), [values, region]);
  const copy = UI_TEXT[language];
  const shareUrl = useMemo(() => buildShareUrl(values, region, language), [values, region, language]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('region', region);
    url.searchParams.set('lang', language);
    Object.entries(values).forEach(([key, value]) => url.searchParams.set(key, String(value)));
    window.history.replaceState(null, '', url);
  }, [values, region, language]);

  function updateValue(axis, value) {
    setMode('manual');
    setValues((current) => ({ ...current, [axis]: value }));
  }

  function reset() {
    setMode('manual');
    setValues(DEFAULT_VALUES);
  }

  function autoPick() {
    const people = personalityList(region);
    const selected = people[Math.floor(Math.random() * people.length)];
    setMode('auto');
    setValues(valuesForPersonality(selected.row, selected.col));
  }

  function reversePick(person) {
    setMode('manual');
    setValues(canonicalValuesForPersonality(person.row, person.col));
  }

  async function shareResult() {
    const text = copy.shareText(result);
    if (navigator.share) {
      try {
        await navigator.share({ title: copy.shareTitleText, text, url: shareUrl });
        return;
      } catch {
        // User cancellation is fine; fall through to copy.
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function downloadCard() {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#fff7da',
    });
    const link = document.createElement('a');
    link.download = `${result.modifier}-${result.type}-personality-card.png`.toLowerCase().replace(/\s+/g, '-');
    link.href = dataUrl;
    link.click();
  }

  return (
    <main className="app" lang={language === 'ja' ? 'ja' : 'en'}>
      <BackgroundPattern />
      <section className="calculator-shell" aria-label="Tomodachi Life personality calculator">
        <div className="topbar">
          <a className="brand" href="/" aria-label="personalitycalculator.org home">
            <span className="brand-mark">pc</span>
            <span>personalitycalculator.org</span>
          </a>
          <div className="top-controls">
            <div className="region-toggle" aria-label="Region">
              {[
                ['eu', 'UK / EU'],
                ['us', 'US'],
              ].map(([item, label]) => (
                <button key={item} className={region === item ? 'active' : ''} onClick={() => setRegion(item)}>
                  {label}
                </button>
              ))}
            </div>
            <div className="language-toggle" aria-label={copy.languageLabel}>
              <Languages size={16} />
              {[
                ['en', 'EN'],
                ['ja', '日本語'],
              ].map(([item, label]) => (
                <button key={item} className={language === item ? 'active' : ''} onClick={() => setLanguage(item)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-row">
          <div>
            <h1>{copy.title}</h1>
            <p className="intro">{copy.intro}</p>
          </div>
          <button className="help-button" aria-label="Calculator help">
            ?
          </button>
        </div>

        <div className="mode-row">
          <div className="segmented" role="tablist" aria-label={copy.inputMode}>
            <button className={mode === 'manual' ? 'active' : ''} onClick={() => setMode('manual')}>
              <MousePointerClick size={20} />
              {copy.manual}
            </button>
            <button className={mode === 'auto' ? 'active' : ''} onClick={autoPick}>
              <Sparkles size={20} />
              {copy.autoPick}
            </button>
          </div>
          <button className="auto-button" onClick={autoPick}>
            <Dice5 size={18} />
            {copy.autoPick}
          </button>
        </div>

        <div className="workspace">
          <section className="control-panel">
            <p className="panel-copy">{copy.panelCopy}</p>
            <TraitGrid values={values} region={region} language={language} onChange={updateValue} />
            <p className="overall-note">{copy.overallNote}</p>
            <PersonalityPicker region={region} current={result} copy={copy} onPick={reversePick} />
          </section>

          <aside className="result-column">
            <ResultPanel result={result} values={values} copy={copy} onShare={() => setShareOpen(true)} />
            <div className="actions">
              <button className="ghost-button" onClick={reset}>
                <RotateCcw size={18} />
                {copy.reset}
              </button>
              <button className="primary-button" onClick={() => setShareOpen(true)}>
                <Sparkles size={20} />
                {copy.save}
              </button>
            </div>
            <p className="privacy">
              <LockKeyhole size={15} />
              {copy.privacy}
            </p>
          </aside>
        </div>
      </section>

      <section className="seo-section" aria-label="Personality chart guide">
        <h2>{copy.seoTitle}</h2>
        <p>{copy.seoBody}</p>
        {language === 'ja' && <JapaneseGuide />}
      </section>

      {shareOpen && (
        <ShareModal
          result={result}
          shareUrl={shareUrl}
          copied={copied}
          onClose={() => setShareOpen(false)}
          onShare={shareResult}
          onDownload={downloadCard}
          cardRef={cardRef}
          copy={copy}
        />
      )}
    </main>
  );
}

function BackgroundPattern() {
  return (
    <div className="pattern" aria-hidden="true">
      {Array.from({ length: 24 }).map((_, index) => (
        <span key={index} style={{ '--i': index }} />
      ))}
    </div>
  );
}

function axisLabel(axis, side, region, language) {
  if (language !== 'ja') return axis[side];
  const localized = AXIS_LABELS_JA[axis.key]?.[side];
  if (localized && typeof localized === 'object') return localized[region];
  return localized || axis[side];
}

function TraitGrid({ values, region, language, onChange }) {
  return (
    <div className="trait-card">
      {AXES[region].map((axis) => {
        const left = axisLabel(axis, 'left', region, language);
        const right = axisLabel(axis, 'right', region, language);
        return (
        <div className="trait-row" key={axis.key}>
          <span className="axis axis-left">{left}</span>
          <div className="cell-row">
            {VALUE_OPTIONS[axis.key].map((option, index) => {
              const selected = values[axis.key] === option;
              return (
                <button
                  key={option}
                  className={`trait-cell ${selected ? 'selected' : ''}`}
                  style={{ '--cell-color': selected ? '#ffbf00' : CELL_COLORS[index] }}
                  onClick={() => onChange(axis.key, option)}
                  aria-label={`Set ${left} to ${right} value ${option}`}
                >
                  {selected && <Check size={30} strokeWidth={4} />}
                </button>
              );
            })}
          </div>
          <span className="axis axis-right">{right}</span>
        </div>
      )})}
    </div>
  );
}

function personalityList(region) {
  const people = [];
  matrixFor(region).forEach((row, rowIndex) => {
    row.forEach(([modifier, type, color], colIndex) => {
      people.push({ modifier, type, color, row: rowIndex, col: colIndex });
    });
  });
  return people;
}

function PersonalityPicker({ region, current, copy, onPick }) {
  const [open, setOpen] = useState(false);
  const people = personalityList(region);

  return (
    <div className="picker">
      <div className="picker-label">
        <span>{copy.pickByResult}</span>
        <small>{copy.pickHelp[region]}</small>
      </div>
      <button className="picker-trigger" onClick={() => setOpen((value) => !value)}>
        <span style={{ background: current.color }} />
        {current.modifier} {current.type}
        <ChevronDown size={18} className={open ? 'up' : ''} />
      </button>
      {open && (
        <div className="personality-menu">
          {people.map((person) => (
            <PersonalityOption key={`${person.modifier}-${person.type}`} person={person} current={current} onPick={onPick} />
          ))}
        </div>
      )}
    </div>
  );
}

function PersonalityOption({ person, current, onPick }) {
  const selected = current.row === person.row && current.col === person.col;

  return (
    <button
      className={selected ? 'selected' : ''}
      style={{ '--person-color': person.color, color: readableColor(person.color, 0.38) }}
      onClick={() => onPick(person)}
      aria-pressed={selected}
    >
      <span>{person.modifier} {person.type}</span>
      {selected && <Check size={17} strokeWidth={4} />}
    </button>
  );
}

function ResultPanel({ result, values, copy, onShare }) {
  const display = displayCopyForResult(result, copy === UI_TEXT.ja ? 'ja' : 'en');

  return (
    <div className="result-panel" style={{ '--result-color': result.color, '--result-ink': readableColor(result.color, 0.36) }}>
      <div className="result-icon">
        <Mascot type={result.type} small />
      </div>
      <div className="result-copy">
        <span>{copy.yourResult}</span>
        <h2>{result.modifier} {result.type}</h2>
        <div className="group-meta">
          <strong style={{ '--group-color': result.groupColor }}>{result.groupName}</strong>
          <span>{display.wordLabel}: {display.groupWord}</span>
          <span>{copy.traits}: {display.groupTraits}</span>
        </div>
        <p>{display.description}</p>
        <div className="mini-values">
          {Object.values(values).map((value, index) => (
            <i key={index} style={{ height: `${10 + value * 4}px` }} />
          ))}
        </div>
      </div>
      <button className="round-share" onClick={onShare} aria-label="Open share card">
        <Share2 size={20} />
      </button>
    </div>
  );
}

function ShareModal({ result, shareUrl, copied, onClose, onShare, onDownload, cardRef, copy }) {
  const [signatureName, setSignatureName] = useState('');
  const signature = signatureName.trim();

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="share-title">
      <div className="modal">
        <div className="modal-head">
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
          <div>
            <h2 id="share-title">{copy.shareTitle}</h2>
            <p>{copy.shareSubtitle}</p>
          </div>
          <button className="share-chip" onClick={onShare}>
            {copied ? <Copy size={18} /> : <Share2 size={18} />}
            {copied ? copy.copied : copy.share}
          </button>
        </div>
        <label className="signature-field">
          <span>{copy.signerLabel}</span>
          <input
            type="text"
            value={signatureName}
            onChange={(event) => setSignatureName(event.target.value.slice(0, 24))}
            placeholder={copy.signerPlaceholder}
            maxLength={24}
          />
          <small>{copy.signerHint}</small>
        </label>
        <ShareCard refProp={cardRef} result={result} shareUrl={shareUrl} copy={copy} signatureName={signature} />
        <button className="download-button" onClick={onDownload}>
          <ArrowDownToLine size={19} />
          {copy.download}
        </button>
      </div>
    </div>
  );
}

function ShareCard({ refProp, result, copy, signatureName = '' }) {
  const theme = CARD_THEMES[result.type] || CARD_THEMES.Perfectionist;
  const display = displayCopyForResult(result, copy === UI_TEXT.ja ? 'ja' : 'en');

  return (
    <div className="share-card" ref={refProp} style={{ '--card-bg': theme.bg, '--card-accent': theme.accent }}>
      <div className="sparkle s1">✦</div>
      <div className="sparkle s2">✦</div>
      <div className="card-text">
        <span>{copy.cardLabel}</span>
        <h3>{result.modifier}<br />{result.type}</h3>
        <p>{display.description}</p>
        <small>personalitycalculator.org</small>
        {signatureName && <b className="card-signature">{copy.cardSignaturePrefix} {signatureName}</b>}
      </div>
      <div className="card-art">
        <Mascot type={result.type} prop={theme.prop} />
      </div>
    </div>
  );
}

function JapaneseGuide() {
  return (
    <div className="ja-guide">
      <section>
        <h3>スライダーの読み方</h3>
        <ol>
          <li>ゲーム内でMiiの編集画面を開き、個性セクションの値を確認します。</li>
          <li>動き・話し方・エネルギー・態度を左から右へ数えて、この計算機のマスに合わせます。</li>
          <li>この版では Movement + Speech と Energy + Attitude の合計で16タイプを判定します。</li>
        </ol>
      </section>
      <section>
        <h3>4つの性格グループ</h3>
        <div className="guide-grid">
          <article><strong>Outgoing / Energetic</strong><span>社交的で活発。会話やイベントを起こしやすいタイプ。</span></article>
          <article><strong>Considerate / Easy-going</strong><span>思いやりがあり、周囲との調和を大切にするタイプ。</span></article>
          <article><strong>Reserved</strong><span>落ち着いていて内省的。静かな交流を好むタイプ。</span></article>
          <article><strong>Ambitious / Confident</strong><span>目標志向で粘り強い。決断力があり前へ進むタイプ。</span></article>
        </div>
      </section>
      <section>
        <h3>よくある質問</h3>
        <div className="faq-list">
          <article>
            <strong>Auto Pickとは？</strong>
            <p>16タイプのどれかをランダムに選び、そのタイプになる有効な値を自動入力します。結果カード用のOverallもランダムに入ります。</p>
          </article>
          <article>
            <strong>結果から選択とは？</strong>
            <p>欲しい性格名を先に選ぶ逆引き機能です。選んだタイプに入る代表値をグリッドへ自動設定します。</p>
          </article>
          <article>
            <strong>Overallは判定に使いますか？</strong>
            <p>使いません。Overall / Normal-Quirky はカードや見た目の記録用で、性格タイプは4つの主要値だけで決まります。</p>
          </article>
        </div>
      </section>
    </div>
  );
}

function Mascot({ type, prop, small = false }) {
  const theme = CARD_THEMES[type] || CARD_THEMES.Perfectionist;
  const main = theme.accent;
  const cap = small ? '#ffb000' : main;

  return (
    <svg className={`mascot ${small ? 'small' : ''}`} viewBox="0 0 220 190" role="img" aria-label={`${type} mascot`}>
      <ellipse cx="110" cy="166" rx="63" ry="13" fill="#000" opacity=".08" />
      <path d="M56 84c4-43 37-68 77-57 32 9 49 36 45 77-5 48-29 70-71 68-43-2-56-39-51-88Z" fill="#ffd42a" />
      <path d="M68 86c2-32 28-58 61-55 31 2 47 27 47 58-23-18-70-17-108-3Z" fill="#ffdf58" opacity=".7" />
      <path d="M69 67c19-30 68-39 94-9" fill="none" stroke={cap} strokeWidth="17" strokeLinecap="round" />
      <ellipse cx="88" cy="106" rx="9" ry="11" fill="#17213b" />
      <ellipse cx="137" cy="106" rx="9" ry="11" fill="#17213b" />
      <path d="M105 125c7 7 16 7 23 0" fill="none" stroke="#6b370c" strokeWidth="5" strokeLinecap="round" />
      <circle cx="70" cy="121" r="9" fill="#ff9a58" opacity=".75" />
      <circle cx="154" cy="121" r="9" fill="#ff9a58" opacity=".75" />
      <path d="M61 114c-20 4-27 22-16 36" stroke="#d58516" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M172 114c21 4 27 23 14 37" stroke="#d58516" strokeWidth="8" strokeLinecap="round" fill="none" />
      <PropIcon prop={prop} color={main} />
    </svg>
  );
}

function PropIcon({ prop, color }) {
  const common = { fill: '#fff7df', stroke: color, strokeWidth: 6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (prop === 'palette') {
    return (
      <g>
        <path d="M145 137c17-6 31 0 31 13 0 13-14 23-34 23h-13c-9 0-13-8-7-14l4-4c4-5 2-13 19-18Z" {...common} />
        <circle cx="145" cy="152" r="4" fill={color} />
        <circle cx="160" cy="149" r="4" fill="#ff9a58" />
        <circle cx="153" cy="162" r="4" fill="#5bcf7b" />
        <path d="M68 151l17-48" stroke="#7b3f10" strokeWidth="7" strokeLinecap="round" />
        <path d="M85 103l12-14" stroke={color} strokeWidth="8" strokeLinecap="round" />
      </g>
    );
  }
  if (prop === 'book') return <path d="M140 139h40v31h-40c-9 0-15-6-15-15s6-16 15-16Z" {...common} />;
  if (prop === 'heart') return <path d="M158 143c13-17 39 0 21 22l-21 19-21-19c-18-22 8-39 21-22Z" fill="#ff8ba4" />;
  if (prop === 'cloud') return <path d="M133 154c0-13 10-22 23-20 6-15 31-11 33 6 15 1 20 24 4 30h-55c-11-1-16-12-5-16Z" {...common} />;
  if (prop === 'balloon') return <path d="M159 132c17 0 25 14 22 29-2 14-14 23-22 29-8-6-20-15-22-29-3-15 5-29 22-29Z" fill="#ff8c7a" stroke={color} strokeWidth="5" />;
  if (prop === 'flame') return <path d="M156 181c-26-17-16-42 3-57 0 16 22 22 13 0 27 19 22 50-16 57Z" fill="#ff7a22" stroke={color} strokeWidth="5" />;
  if (prop === 'sun') return <circle cx="164" cy="154" r="23" fill="#fff13f" stroke={color} strokeWidth="6" />;
  if (prop === 'flower') return <path d="M162 153c6-19 31-5 15 9 21 0 14 27-3 17 7 18-21 21-18 1-16 12-31-11-11-17-18-10-2-31 17-10Z" fill="#ffc0d7" stroke={color} strokeWidth="5" />;
  if (prop === 'map') return <path d="M135 135l21-9 22 10 22-9v44l-22 9-22-10-21 9z" {...common} />;
  if (prop === 'flag') return <path d="M139 124v58M139 128c18-12 28 8 47-2v35c-18 10-29-9-47 2" fill="#fff7df" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />;
  if (prop === 'megaphone') return <path d="M132 151l47-25v44l-47-18Zm0 0h-17v23h17z" {...common} />;
  if (prop === 'clipboard') return <path d="M134 127h44v53h-44zM146 127c1-10 19-10 20 0" {...common} />;
  if (prop === 'leaf') return <path d="M129 169c35-46 62-34 67-67-42 4-68 24-67 67Z" fill="#98df80" stroke={color} strokeWidth="6" />;
  if (prop === 'telescope') return <path d="M126 143l53-18 7 19-53 18zm25 15-13 26m24-31 17 24" {...common} />;
  return <path d="M158 123l8 21 22 3-17 15 5 22-18-12-19 12 5-22-17-15 22-3z" fill="#fff13f" stroke={color} strokeWidth="5" />;
}

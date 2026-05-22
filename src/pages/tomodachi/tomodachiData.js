export const DEFAULT_VALUES = {
  movement: 3,
  speech: 3,
  energy: 3,
  attitude: 3,
  overall: 3,
};

export const VALUE_OPTIONS = {
  movement: [0, 1, 2, 3, 4, 5, 6, 7],
  speech: [0, 1, 2, 3, 5, 6, 7, 8],
  energy: [0, 1, 2, 3, 4, 5, 6, 7],
  attitude: [0, 1, 2, 3, 5, 6, 7, 8],
  overall: [0, 1, 2, 3, 4, 5, 6, 7],
};

export const CELL_COLORS = ['#4fc37d', '#7bd997', '#a8e8b8', '#c9efcf', '#ffd194', '#ffb86c', '#ff9c42', '#ff7629'];

export const AXES = {
  eu: [
    { key: 'movement', left: 'Slow', right: 'Quick' },
    { key: 'speech', left: 'Polite', right: 'Direct' },
    { key: 'energy', left: 'Flat', right: 'Intense' },
    { key: 'attitude', left: 'Serious', right: 'Relaxed' },
    { key: 'overall', left: 'Normal', right: 'Quirky' },
  ],
  us: [
    { key: 'movement', left: 'Slow', right: 'Quick' },
    { key: 'speech', left: 'Polite', right: 'Honest' },
    { key: 'energy', left: 'Flat', right: 'Varied' },
    { key: 'attitude', left: 'Serious', right: 'Chill' },
    { key: 'overall', left: 'Normal', right: 'Quirky' },
  ],
};

export const AXIS_LABELS_JA = {
  movement: { left: 'ゆっくり', right: 'すばやい' },
  speech: {
    left: 'ていねい',
    right: { eu: '率直', us: '正直' },
  },
  energy: {
    left: '平坦',
    right: { eu: '強め', us: '変化豊か' },
  },
  attitude: {
    left: 'まじめ',
    right: { eu: 'リラックス', us: 'チル' },
  },
  overall: { left: 'ふつう', right: '個性的' },
};

export const AXIS_LABELS_ZH = {
  movement: { left: '缓慢', right: '快速' },
  speech: {
    left: '礼貌',
    right: { eu: '直接', us: '诚实' },
  },
  energy: {
    left: '平稳',
    right: { eu: '强烈', us: '多变' },
  },
  attitude: {
    left: '认真',
    right: { eu: '放松', us: '随性' },
  },
  overall: { left: '普通', right: '古怪' },
};

export const AXIS_LABELS_KO = {
  movement: { left: '느림', right: '빠름' },
  speech: {
    left: '예의 바름',
    right: { eu: '직설적', us: '솔직함' },
  },
  energy: {
    left: '차분함',
    right: { eu: '강렬함', us: '다양함' },
  },
  attitude: {
    left: '진지함',
    right: { eu: '편안함', us: '느긋함' },
  },
  overall: { left: '보통', right: '개성적' },
};

export const UI_TEXT = {
  en: {
    languageLabel: 'Language',
    title: 'Personality Calculator',
    intro: 'Adjust the sliders, auto-pick a character, then share a cute downloadable result card.',
    inputMode: 'Input mode',
    helpTitle: 'How this calculator works',
    helpIntro: 'Choose values for each trait row. The calculator maps those values to the closest Tomodachi Life personality and updates the result instantly.',
    helpItems: [
      'Manual mode lets you set every trait value yourself.',
      'Auto Pick creates a random valid personality profile.',
      'Pick by Result fills the grid from a specific personality name.',
      'The Overall row is saved to your card but does not change the personality type.',
    ],
    helpClose: 'Close help',
    manual: 'Manual',
    autoPick: 'Auto Pick',
    panelCopy:
      'Manual edits update the result. Auto Pick creates a random valid personality. Pick by Result fills the grid from a target result.',
    overallNote: 'Overall / Normal-Quirky is saved for your card, but it does not change the personality type.',
    pickByResult: 'Pick by Result',
    pickHelp: {
      us: 'US names: Observer, Strategist, Rogue...',
      eu: 'UK / EU names: Introvert, Patient, Individualist...',
    },
    yourResult: 'Your Result',
    traits: 'Traits',
    save: 'Save Personality',
    reset: 'Reset',
    privacy: 'Your data is private and stays in your browser.',
    shareTitle: 'Share Your Result',
    shareSubtitle: 'Inspire others by sharing your personality.',
    signerLabel: 'Sign your card',
    signerPlaceholder: 'Your name (optional)',
    signerHint: 'Leave it blank to keep the original card.',
    cardSignaturePrefix: 'by',
    share: 'Share',
    copied: 'Copied',
    download: 'Download Card',
    cardLabel: 'My Personality',
    shareText: (result) => `I got ${result.modifier} ${result.type} on personalitycalculator.org`,
    shareTitleText: 'My Tomodachi Life personality',
    seoTitle: 'Tomodachi Life Personality Chart Guide',
    seoBody:
      'Use this Tomodachi Life Living the Dream personality calculator to explore all personalities, compare EU and US naming, and make a shareable personality card from your exact trait values.',
  },
  ja: {
    languageLabel: '言語',
    title: '性格計算機',
    intro: 'スライダーを調整して、自動生成や結果からの逆選択を使い、かわいい結果カードを保存・共有できます。',
    inputMode: '入力モード',
    helpTitle: 'この計算機の使い方',
    helpIntro: '各行の値を選ぶと、その組み合わせに最も近いTomodachi Lifeの性格がすぐに表示されます。',
    helpItems: [
      '手動モードでは、すべての特徴を自分で選べます。',
      '自動生成は有効な性格プロフィールをランダムに作ります。',
      '結果から選択すると、指定した性格に合わせてマスが入力されます。',
      'Overall の行はカードに保存されますが、性格タイプの判定には影響しません。',
    ],
    helpClose: 'ヘルプを閉じる',
    manual: '手動',
    autoPick: '自動生成',
    panelCopy:
      '手動でマスを選ぶと結果がすぐ更新されます。自動生成は有効な性格をランダムに作ります。結果から選択すると、選んだ性格に合わせてマスを自動入力します。',
    overallNote: 'Overall / ふつう-個性的 はカード用に保存されますが、性格タイプの判定には影響しません。',
    pickByResult: '結果から選択',
    pickHelp: {
      us: 'US名: Observer, Strategist, Rogue...',
      eu: 'UK / EU名: Introvert, Patient, Individualist...',
    },
    yourResult: 'あなたの結果',
    traits: '特徴',
    save: '性格を保存',
    reset: 'リセット',
    privacy: 'データはブラウザ内だけに保存されます。',
    shareTitle: '結果をシェア',
    shareSubtitle: 'あなたの性格カードを共有できます。',
    signerLabel: 'カードに署名する',
    signerPlaceholder: '名前（任意）',
    signerHint: '空欄なら今まで通りのカードになります。',
    cardSignaturePrefix: '署名',
    share: 'シェア',
    copied: 'コピー済み',
    download: 'カードをダウンロード',
    cardLabel: '私の性格',
    shareText: (result) => `personalitycalculator.orgで ${result.modifier} ${result.type} になりました`,
    shareTitleText: '私のTomodachi Life性格',
    seoTitle: 'トモダチコレクション 個性チャート＆計算機',
    seoBody:
      'このTomodachi Life: Living the Dream性格計算機では、16タイプの性格、US名とUK / EU名の違い、共有できる結果カードをまとめて確認できます。',
  },
  zh: {
    languageLabel: '语言',
    title: 'Tomodachi Life 性格计算器',
    intro: '调整数值、随机生成角色，或按结果反选，然后保存一张可爱的结果卡片。',
    inputMode: '输入模式',
    helpTitle: '这个计算器如何工作',
    helpIntro: '为每一行选择数值后，计算器会把组合映射到最接近的 Tomodachi Life 性格并即时更新结果。',
    helpItems: [
      '手动模式可以自行设置每个特质值。',
      '随机生成会创建一个有效的性格配置。',
      '按结果选择会根据指定性格名称自动填充网格。',
      'Overall 行会保存到卡片中，但不会影响性格类型判定。',
    ],
    helpClose: '关闭帮助',
    manual: '手动',
    autoPick: '随机生成',
    panelCopy: '手动编辑会立即更新结果。随机生成会创建有效性格。按结果选择会从目标结果回填网格。',
    overallNote: 'Overall / 普通-古怪 会保存到卡片中，但不会改变性格类型。',
    pickByResult: '按结果选择',
    pickHelp: {
      us: 'US 名称：Observer、Strategist、Rogue...',
      eu: 'UK / EU 名称：Introvert、Patient、Individualist...',
    },
    yourResult: '你的结果',
    traits: '特质',
    save: '保存性格',
    reset: '重置',
    privacy: '你的数据是私密的，只保存在浏览器中。',
    shareTitle: '分享你的结果',
    shareSubtitle: '分享你的性格卡片给其他人。',
    signerLabel: '在卡片上签名',
    signerPlaceholder: '你的名字（可选）',
    signerHint: '留空则保持原始卡片。',
    cardSignaturePrefix: '来自',
    share: '分享',
    copied: '已复制',
    download: '下载卡片',
    cardLabel: '我的性格',
    shareText: (result) => `我在 personalitycalculator.org 得到 ${result.modifier} ${result.type}`,
    shareTitleText: '我的 Tomodachi Life 性格',
    seoTitle: 'Tomodachi Life 性格图表指南',
    seoBody: '使用这个 Tomodachi Life: Living the Dream 性格计算器探索所有性格、比较 EU 和 US 命名，并根据精确特质值生成可分享的性格卡片。',
  },
  ko: {
    languageLabel: '언어',
    title: 'Tomodachi Life 성격 계산기',
    intro: '값을 조정하고, 자동으로 캐릭터를 고르거나 결과에서 역선택한 뒤 귀여운 결과 카드를 저장하세요.',
    inputMode: '입력 모드',
    helpTitle: '계산기 사용 방법',
    helpIntro: '각 특성 행의 값을 고르면 Tomodachi Life 성격 중 가장 가까운 결과로 즉시 매핑됩니다.',
    helpItems: [
      '수동 모드에서는 모든 특성 값을 직접 설정할 수 있습니다.',
      '자동 선택은 유효한 성격 프로필을 무작위로 만듭니다.',
      '결과로 선택하면 특정 성격 이름에 맞춰 그리드를 채웁니다.',
      'Overall 행은 카드에 저장되지만 성격 유형 판정에는 영향을 주지 않습니다.',
    ],
    helpClose: '도움말 닫기',
    manual: '수동',
    autoPick: '자동 선택',
    panelCopy: '수동으로 수정하면 결과가 업데이트됩니다. 자동 선택은 무작위 유효 성격을 만들고, 결과로 선택은 목표 결과에서 그리드를 채웁니다.',
    overallNote: 'Overall / 보통-개성적 값은 카드에 저장되지만 성격 유형을 바꾸지는 않습니다.',
    pickByResult: '결과로 선택',
    pickHelp: {
      us: 'US 이름: Observer, Strategist, Rogue...',
      eu: 'UK / EU 이름: Introvert, Patient, Individualist...',
    },
    yourResult: '나의 결과',
    traits: '특성',
    save: '성격 저장',
    reset: '초기화',
    privacy: '데이터는 비공개이며 브라우저에만 저장됩니다.',
    shareTitle: '결과 공유',
    shareSubtitle: '성격 카드를 공유해보세요.',
    signerLabel: '카드에 서명',
    signerPlaceholder: '이름 (선택)',
    signerHint: '비워두면 기본 카드로 유지됩니다.',
    cardSignaturePrefix: 'by',
    share: '공유',
    copied: '복사됨',
    download: '카드 다운로드',
    cardLabel: '나의 성격',
    shareText: (result) => `personalitycalculator.org에서 ${result.modifier} ${result.type} 결과가 나왔습니다`,
    shareTitleText: '나의 Tomodachi Life 성격',
    seoTitle: 'Tomodachi Life 성격 차트 가이드',
    seoBody: '이 Tomodachi Life: Living the Dream 성격 계산기로 모든 성격을 탐색하고 EU/US 이름 차이를 비교하며 정확한 특성 값으로 공유 가능한 카드를 만들 수 있습니다.',
  },
};

export const WORD_LABEL = { eu: 'In a word', us: 'At a glance' };

export const JA_GROUP_COPY = {
  'Easy-going': {
    word: '親しみやすい',
    traits: '思いやりがあり、正直で穏やか。自分のペースを大切にする。',
  },
  Energetic: {
    word: '社交的',
    traits: '前向きで情熱的。直感に従ってすばやく動く。',
  },
  Reserved: {
    word: '落ち着き',
    traits: '論理的で慎重。感情より事実を大切にする。',
  },
  Confident: {
    word: '自信家',
    traits: 'まっすぐで結果重視。目標に向けて粘り強く進む。',
  },
};

export const JA_DESCRIPTIONS = {
  Softie: '感受性が豊かで、周りの気持ちに寄り添うタイプ。共感力があり、情に厚い。',
  Sweetie: '感受性が豊かで、周りの気持ちに寄り添うタイプ。共感力があり、情に厚い。',
  Optimist: '前向きで明るく、自然と周囲を笑顔にするタイプ。',
  Cheerleader: '前向きで明るく、自然と周囲を笑顔にするタイプ。',
  Carer: '信頼できて思いやりがある。友だちを大切にし、みんなが仲良くできるよう動く。',
  Buddy: '信頼できて思いやりがある。友だちを大切にし、みんなが仲良くできるよう動く。',
  Dreamer: '理想を大切にするロマンチスト。空想の中からすてきなアイデアを見つける。',
  Daydreamer: '理想を大切にするロマンチスト。空想の中からすてきなアイデアを見つける。',
  Patient: '自由で独創的。人の目を気にしすぎず、自分ならではの発想で考える。',
  Strategist: '自由で独創的。人の目を気にしすぎず、自分ならではの発想で考える。',
  Perfectionist: '想像力があり、ものづくりが得意。細かなところにも美しさを見つける。',
  Introvert: '自立心が強く個性的。感情を表に出しすぎないが、内側では深く考えている。',
  Observer: '自立心が強く個性的。感情を表に出しすぎないが、内側では深く考えている。',
  Thinker: '内省的で思慮深い。物事をあらゆる角度からじっくり考える。',
  Charmer: '明るく魅力的で、どんな場にもなじみやすい。自然と注目を集めるタイプ。',
  Adventurer: '大胆で人を引きつける。機転がきき、いつも新しい展開を生み出す。',
  'Go-Getter': '大胆で人を引きつける。機転がきき、いつも新しい展開を生み出す。',
  Bubbly: '人付き合いが得意で、楽しい雰囲気を作る。どんな状況にも良い面を見つける。',
  Merrymaker: '人付き合いが得意で、楽しい雰囲気を作る。どんな状況にも良い面を見つける。',
  'Hot-Blooded': '自己主張があり、直感を信じて動く。周りから頼られやすい。',
  Dynamo: '自己主張があり、直感を信じて動く。周りから頼られやすい。',
  'Busy Bee': '勤勉で効率的。計画を立て、最後までやり抜く力がある。',
  Achiever: '勤勉で効率的。計画を立て、最後までやり抜く力がある。',
  Leader: '意欲的で行動力がある。勢いよく挑戦し、周りを引っ張る。',
  Visionary: '意欲的で行動力がある。勢いよく挑戦し、周りを引っ張る。',
  Individualist: '知的で自分の考えを堂々と示す。幅広い話題に自信を持って向き合う。',
  Rogue: '知的で自分の考えを堂々と示す。幅広い話題に自信を持って向き合う。',
  Headstrong: '意志が強く、自分の道を切り開く。決めたことをすばやく実行する。',
  Maverick: '意志が強く、自分の道を切り開く。決めたことをすばやく実行する。',
};

export const GROUP_DATA = {
  'Easy-going': {
    color: '#e7a523',
    names: { eu: 'Easy-going', us: 'Considerate' },
    word: { eu: 'Amicable', us: 'Amicable' },
    traits: {
      eu: 'Thoughtful, honest, innocent. Does things at their own pace.',
      us: 'Thoughtful, honest, innocent. Does things at their own pace.',
    },
  },
  Energetic: {
    color: '#cf160a',
    names: { eu: 'Energetic', us: 'Outgoing' },
    word: { eu: 'Sociable', us: 'Sociable' },
    traits: {
      eu: 'Optimistic and passionate. Follows their instincts.',
      us: 'Optimistic and passionate. Follows their instincts.',
    },
  },
  Reserved: {
    color: '#319533',
    names: { eu: 'Reserved', us: 'Reserved' },
    word: { eu: 'Aloof', us: 'Aloof' },
    traits: {
      eu: 'Logical, headstrong, cautious. Calmly lays out the facts.',
      us: 'Logical, tenacious, cautious. Speaks matter-of-factly.',
    },
  },
  Confident: {
    color: '#2152db',
    names: { eu: 'Confident', us: 'Ambitious' },
    word: { eu: 'Self-Assured', us: 'Confident' },
    traits: {
      eu: 'A by-the-book straight-talker. Puts a premium on results.',
      us: 'A by-the-book straight-talker. Puts a premium on results.',
    },
  },
};

export const US_GROUP_TO_KEY = {
  Considerate: 'Easy-going',
  Outgoing: 'Energetic',
  Reserved: 'Reserved',
  Ambitious: 'Confident',
};

export const EU_MATRIX = [
  [
    ['Reserved', 'Introvert', '#409594'],
    ['Reserved', 'Thinker', '#25ae62'],
    ['Confident', 'Individualist', '#6e7bf4'],
    ['Confident', 'Headstrong', '#a383f6'],
  ],
  [
    ['Reserved', 'Patient', '#9edc59'],
    ['Reserved', 'Perfectionist', '#00bfa0'],
    ['Confident', 'Busy Bee', '#56cfe8'],
    ['Confident', 'Leader', '#3fa4f6'],
  ],
  [
    ['Easy-going', 'Carer', '#f7c948'],
    ['Easy-going', 'Dreamer', '#ffb84d'],
    ['Energetic', 'Bubbly', '#ff8c7a'],
    ['Energetic', 'Hot-Blooded', '#fb7943'],
  ],
  [
    ['Easy-going', 'Softie', '#ffdca8'],
    ['Easy-going', 'Optimist', '#f6e741'],
    ['Energetic', 'Charmer', '#fe9dbe'],
    ['Energetic', 'Adventurer', '#fa5660'],
  ],
];

export const US_MATRIX = [
  [
    ['Reserved', 'Observer', '#409594'],
    ['Reserved', 'Thinker', '#25ae62'],
    ['Ambitious', 'Rogue', '#6e7bf4'],
    ['Ambitious', 'Maverick', '#a383f6'],
  ],
  [
    ['Reserved', 'Strategist', '#9edc59'],
    ['Reserved', 'Perfectionist', '#00bfa0'],
    ['Ambitious', 'Achiever', '#56cfe8'],
    ['Ambitious', 'Visionary', '#3fa4f6'],
  ],
  [
    ['Considerate', 'Buddy', '#f7c948'],
    ['Considerate', 'Daydreamer', '#ffb84d'],
    ['Outgoing', 'Merrymaker', '#ff8c7a'],
    ['Outgoing', 'Dynamo', '#fb7943'],
  ],
  [
    ['Considerate', 'Sweetie', '#ffdca8'],
    ['Considerate', 'Cheerleader', '#f6e741'],
    ['Outgoing', 'Charmer', '#fe9dbe'],
    ['Outgoing', 'Go-Getter', '#fa5660'],
  ],
];

export const EU_DESCRIPTIONS = {
  Softie: 'Sensitive, emotional, and in tune with the feelings of those around them. Empathetic and sentimental.',
  Optimist: 'Positive, enthusiastic, and always smiling. Smiles not only for their sake, but to help others smile too.',
  Carer: 'Trustworthy and considerate. Puts their friends first and works hard to make sure everyone gets along.',
  Dreamer: 'Idealistic and romantic. Often has their head in the clouds, but finds a lot of great ideas up there.',
  Patient: "Unique, carefree and creative. Always thinks way outside the box, without worrying what others think.",
  Perfectionist: 'Imaginative and inspired. Happiest when creating something. Finds beauty in even the smallest details.',
  Introvert: "Self-sufficient and highly individual. Doesn't let their emotions show, but has a lot going on deep down.",
  Thinker: 'Thoughtful and introspective. Great at thinking things through and analysing from every angle.',
  Charmer: 'Radiant and always on form. Their effortless style is admired by all. Easily adapts to new situations.',
  Adventurer: "Bold and captivating. Their wit and charm lights up a room. It's never a dull moment when they're around!",
  Bubbly: 'Outgoing and pleasant to be around. Makes friends easily, and finds the silver lining to any bad situation.',
  'Hot-Blooded': 'Assertive and highly regarded. Trusts their instincts, and easily commands the respect of others.',
  'Busy Bee': 'Diligent, productive, and highly efficient. An excellent planner who always follows through.',
  Leader: 'Ambitious and takes risks. Full of energy and does things on a whim. A force to be reckoned with.',
  Individualist: 'Intelligent and not afraid to show it. Knowledgeable in a wide range of subjects. Speaks with confidence.',
  Headstrong: 'A determined self-starter. Cuts their own path, letting nothing stand in their way. Quick to execute plans.',
};

export const US_DESCRIPTIONS = {
  Sweetie: 'Empathetic and sentimental. Sensitive, emotional, and in tune with the feelings of others.',
  Cheerleader: 'Positive, enthusiastic, and always smiling. Beams for their own sake and to help others smile too.',
  Buddy: 'Trustworthy and considerate. Puts their friends first and works hard to make sure everyone gets along.',
  Daydreamer: 'Idealistic and romantic. Often has their head in the clouds, but finds a lot of great ideas up there.',
  Strategist: "Unique, carefree, creative, laid-back. They're self-reliant, doing things their own way and thinking outside the box.",
  Perfectionist: 'Imaginative and inspired. Happiest when creating something. Finds beauty in everyone and everything.',
  Observer: "Self-sufficient and highly individual. Doesn't show much outward emotion, but has a lot going on deep down.",
  Thinker: 'Thoughtful and introspective. Great at thinking things through and analyzing issues from every angle.',
  Charmer: 'Radiant and always on form. Their effortless style is admired by all. Easily adapts to new situations.',
  'Go-Getter': "Bold and captivating. Their wit and charm lights up a room. It's never a dull moment when they're around!",
  Merrymaker: 'Outgoing and pleasant to be around. Makes friends easily, and can turn any bad situation into a good one.',
  Dynamo: 'Assertive and highly regarded. Trusts their own instincts, and easily commands the respect of others.',
  Achiever: 'Diligent, productive, and highly efficient. Equally as skilled at planning and executing plans.',
  Visionary: "Risk taking and ambitious. Full of energy and acts on many whims. Once they start, they don't stop!",
  Rogue: 'Intelligent and not afraid to show it. Knowledgeable in a wide range of subjects. Answers with confidence.',
  Maverick: 'A determined self-starter. Cuts their own path, letting nothing stand in their way. Quick to execute plans.',
};

export const CARD_THEMES = {
  Introvert: { prop: 'book', bg: '#e8fbff', accent: '#409594' },
  Observer: { prop: 'telescope', bg: '#e8fbff', accent: '#409594' },
  Thinker: { prop: 'book', bg: '#eafff0', accent: '#25ae62' },
  Individualist: { prop: 'star', bg: '#eef0ff', accent: '#6e7bf4' },
  Rogue: { prop: 'star', bg: '#eef0ff', accent: '#6e7bf4' },
  Headstrong: { prop: 'flag', bg: '#f4efff', accent: '#a383f6' },
  Maverick: { prop: 'flag', bg: '#f4efff', accent: '#a383f6' },
  Patient: { prop: 'leaf', bg: '#f3ffe5', accent: '#85be37' },
  Strategist: { prop: 'leaf', bg: '#f3ffe5', accent: '#85be37' },
  Perfectionist: { prop: 'palette', bg: '#fff5d7', accent: '#00bfa0' },
  'Busy Bee': { prop: 'clipboard', bg: '#e8fbff', accent: '#56cfe8' },
  Achiever: { prop: 'clipboard', bg: '#e8fbff', accent: '#56cfe8' },
  Leader: { prop: 'megaphone', bg: '#e8f3ff', accent: '#3fa4f6' },
  Visionary: { prop: 'megaphone', bg: '#e8f3ff', accent: '#3fa4f6' },
  Carer: { prop: 'heart', bg: '#fff7cf', accent: '#e7b400' },
  Buddy: { prop: 'heart', bg: '#fff7cf', accent: '#e7b400' },
  Dreamer: { prop: 'cloud', bg: '#fff0d8', accent: '#ffad3b' },
  Daydreamer: { prop: 'cloud', bg: '#fff0d8', accent: '#ffad3b' },
  Bubbly: { prop: 'balloon', bg: '#fff0ef', accent: '#ff7f68' },
  Merrymaker: { prop: 'balloon', bg: '#fff0ef', accent: '#ff7f68' },
  'Hot-Blooded': { prop: 'flame', bg: '#fff0e8', accent: '#fb7943' },
  Dynamo: { prop: 'flame', bg: '#fff0e8', accent: '#fb7943' },
  Softie: { prop: 'flower', bg: '#fff5df', accent: '#e9b56d' },
  Sweetie: { prop: 'flower', bg: '#fff5df', accent: '#e9b56d' },
  Optimist: { prop: 'sun', bg: '#fffbd7', accent: '#d8c200' },
  Cheerleader: { prop: 'sun', bg: '#fffbd7', accent: '#d8c200' },
  Charmer: { prop: 'sparkle', bg: '#fff0f7', accent: '#fe78a8' },
  Adventurer: { prop: 'map', bg: '#fff1f2', accent: '#fa5660' },
  'Go-Getter': { prop: 'map', bg: '#fff1f2', accent: '#fa5660' },
};

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpenText,
  Brain,
  ChevronDown,
  CheckCircle2,
  Clock3,
  FileQuestion,
  LockKeyhole,
  Mail,
  Search,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import { CATEGORIES, TESTS } from '../../data/tests.jsx';
import { detectLocale, formatDuration, LOCALE_LABELS, SUPPORTED_LOCALES, syncLocale } from '../../i18n.js';

const LOCALE_COPY = {
  en: {
    tests: 'Tests',
    categories: 'Categories',
    allCategory: 'All',
    categoryNames: {
      Popular: 'Popular',
      Games: 'Games',
      Relationships: 'Relationships',
      Social: 'Social',
      Career: 'Career',
      Fun: 'Fun',
      Anime: 'Anime',
    },
    articles: 'Articles',
    about: 'About',
    contact: 'Contact',
    searchPlaceholder: 'Search tests, categories or topics...',
    clear: 'Clear',
    search: 'Search',
    heroTitle: 'Discover Your Personality with',
    heroAccent: 'Fun Calculators & Tests',
    heroBody: (count) => `Explore ${count}+ free personality tests and calculators designed to help you learn more about yourself in a fun way.`,
    freeTitle: '100% Free',
    freeBody: 'All tests are free, fun, and designed to help you understand yourself better.',
    library: 'Personality Test Library',
    categoryTitle: (category) => `${category} Personality Tests`,
    viewAll: 'View all tests',
    noMatches: 'No matching tests yet',
    noMatchesBody: 'Try another keyword or clear the category filter.',
    benefits: [
      ['Free Tests', 'Explore a wide variety of personality tests.', FileQuestion, 'blue'],
      ['Instant Results', 'Get results instantly and learn more about yourself.', Clock3, 'violet'],
      ['Private & Secure', 'Your answers stay in your browser unless you share them.', LockKeyhole, 'green'],
      ['Fun & Insightful', 'Enjoy tests that are both entertaining and meaningful.', Trophy, 'orange'],
    ],
    articlesTitle: 'Personality Test Guides',
    articlesBody: 'Short guides that help visitors choose the right test and interpret results responsibly.',
    guideTopics: [
      ['all', 'All guides'],
      ['starter', 'Start here'],
      ['career', 'Career'],
      ['relationships', 'Relationships'],
      ['wellbeing', 'Wellbeing'],
      ['workplace', 'Workplace'],
    ],
    aboutTitle: 'Built as a complete personality test library',
    aboutBody: 'The site now routes every catalog card into a real quiz, calculates results instantly, saves progress locally, and generates static pages for search engines.',
    contactTitle: 'Suggest a personality test',
    contactBody: 'Missing a framework or quiz category? Send the test name and the dimensions it should cover.',
    contactCta: 'Email suggestions',
    suggestionName: 'Your name or handle',
    suggestionNamePlaceholder: 'Optional',
    suggestionTest: 'Test name',
    suggestionTestPlaceholder: 'Example: CPI, AQ, Work Personality Inventory',
    suggestionDimensions: 'What should it measure?',
    suggestionDimensionsPlaceholder: 'List dimensions, audience, source framework, or why users search for it.',
    suggestionSubmit: 'Save suggestion',
    suggestionRequired: 'Add a test name before saving.',
    suggestionSaved: 'Saved locally. The suggestion is ready to review and add to the roadmap.',
    suggestionEmail: 'Send by email instead',
    savedSuggestionsTitle: 'Saved suggestions',
    savedSuggestionsEmpty: 'Saved suggestions will appear here so you can review, remove, or email them later.',
    sendSuggestion: 'Email',
    removeSuggestion: 'Remove',
    suggestedBy: 'Suggested by',
    anonymousSuggestion: 'Anonymous',
    start: 'Start Test',
    questions: 'Questions',
    guideCards: [
      {
        title: 'Which personality test should I take first?',
        body: 'Start with Big 5 or MBTI for broad self-understanding, then use relationship, career, or values tests for a specific question.',
        topic: 'starter',
        readTime: '3 min guide',
        related: 'Big 5',
        href: '/big-5-personality-test.html',
      },
      {
        title: 'How to read quiz results responsibly',
        body: 'Treat results as reflection prompts, compare them with real behavior, and avoid using any quiz as a fixed identity label.',
        topic: 'wellbeing',
        readTime: '4 min guide',
        related: 'EQ',
        href: '/emotional-intelligence-test.html',
      },
      {
        title: 'Best tests for work and career choices',
        body: 'Use Holland Code, work values, career anchors, leadership, and culture fit tests together for stronger career insight.',
        topic: 'career',
        readTime: '5 min guide',
        related: 'Career anchors',
        href: '/career-anchor-test.html',
      },
      {
        title: 'How to compare MBTI, Big Five, and HEXACO',
        body: 'Use MBTI for type language, Big Five for trait strength, and HEXACO when honesty-humility and ethics matter.',
        topic: 'starter',
        readTime: '5 min guide',
        related: 'HEXACO',
        href: '/hexaco-personality-test.html',
      },
      {
        title: 'Relationship test stack for couples',
        body: 'Combine attachment, love language, conflict style, trust repair, and relationship satisfaction instead of relying on one score.',
        topic: 'relationships',
        readTime: '4 min guide',
        related: 'Attachment',
        href: '/attachment-style-test.html',
      },
      {
        title: 'When to avoid over-interpreting clinical-style quizzes',
        body: 'Clinical-inspired pages here are educational only; use them to name patterns, not to diagnose yourself or other people.',
        topic: 'wellbeing',
        readTime: '4 min guide',
        related: 'Schema modes',
        href: '/schema-modes-style-test.html',
      },
      {
        title: 'Build a team testing playlist',
        body: 'For teams, pair DISC, social style, psychological safety, work values, and feedback style to make conversations practical.',
        topic: 'workplace',
        readTime: '5 min guide',
        related: 'Psychological safety',
        href: '/psychological-safety-style-test.html',
      },
      {
        title: 'Quick tests vs deeper assessments',
        body: 'Use TIPI or Mini-IPIP for a fast snapshot, then move into facets, values, motives, or relationship tests for decisions.',
        topic: 'starter',
        readTime: '3 min guide',
        related: 'TIPI',
        href: '/tipi-style-personality-test.html',
      },
    ],
    aboutStats: (testCount, questionCount) => [
      `${testCount} live test pages in the catalog`,
      `${questionCount} total questions across the library`,
      'Static HTML, sitemap, and structured data generated during build',
    ],
  },
  zh: {
    tests: '测试',
    categories: '分类',
    allCategory: '全部',
    categoryNames: {
      Popular: '热门',
      Games: '游戏',
      Relationships: '关系',
      Social: '社交',
      Career: '职业',
      Fun: '趣味',
      Anime: '动漫',
    },
    articles: '指南',
    about: '关于',
    contact: '联系',
    searchPlaceholder: '搜索测试、分类或主题...',
    clear: '清除',
    search: '搜索',
    heroTitle: '用有趣的人格测试',
    heroAccent: '了解真实的自己',
    heroBody: (count) => `浏览 ${count}+ 个免费 personality test 和性格计算器，快速获得结果和可分享的自我洞察。`,
    freeTitle: '全部免费',
    freeBody: '所有测试都可以直接开始，适合自我探索、关系沟通和职业规划。',
    library: '人格测试库',
    categoryTitle: (category) => `${category} 人格测试`,
    viewAll: '查看全部',
    noMatches: '暂时没有匹配测试',
    noMatchesBody: '换个关键词，或清除当前分类筛选。',
    benefits: [
      ['免费测试', '覆盖常见的人格、关系、职场和趣味测试。', FileQuestion, 'blue'],
      ['即时结果', '答完即可看到结果和维度解释。', Clock3, 'violet'],
      ['本地保存', '答题进度保存在浏览器本地。', LockKeyhole, 'green'],
      ['有趣有用', '兼顾娱乐性和可行动的自我理解。', Trophy, 'orange'],
    ],
    articlesTitle: '人格测试指南',
    articlesBody: '帮助用户选择合适测试，并更负责任地理解测试结果。',
    guideTopics: [
      ['all', '全部指南'],
      ['starter', '入门'],
      ['career', '职业'],
      ['relationships', '关系'],
      ['wellbeing', '心理模式'],
      ['workplace', '团队'],
    ],
    aboutTitle: '面向完整人格测试库构建',
    aboutBody: '当前目录卡片已经接入真实答题页，支持即时计分、本地进度保存，并为搜索引擎生成静态页面。',
    contactTitle: '推荐缺失的测试',
    contactBody: '如果还缺少某个经典框架或热门测试，可以发送测试名称和应覆盖的维度。',
    contactCta: '发送建议',
    suggestionName: '你的名字或称呼',
    suggestionNamePlaceholder: '可选',
    suggestionTest: '测试名称',
    suggestionTestPlaceholder: '例如：CPI、AQ、Work Personality Inventory',
    suggestionDimensions: '希望测量什么？',
    suggestionDimensionsPlaceholder: '填写维度、适用人群、来源框架，或为什么用户会搜索它。',
    suggestionSubmit: '保存建议',
    suggestionRequired: '请先填写测试名称。',
    suggestionSaved: '已保存在本地，后续可以据此继续补充题库。',
    suggestionEmail: '改用邮件发送',
    savedSuggestionsTitle: '已保存的建议',
    savedSuggestionsEmpty: '保存后的建议会显示在这里，之后可以查看、删除或改用邮件发送。',
    sendSuggestion: '邮件发送',
    removeSuggestion: '删除',
    suggestedBy: '建议人',
    anonymousSuggestion: '匿名',
    start: '开始测试',
    questions: '题',
    guideCards: [
      {
        title: '第一次应该先做哪个人格测试？',
        body: '想先建立完整自我画像，可以从 Big 5 或 MBTI 开始；如果有具体问题，再进入关系、职业或价值观测试。',
        topic: 'starter',
        readTime: '3 分钟指南',
        related: 'Big 5',
        href: '/big-5-personality-test.html',
      },
      {
        title: '如何更负责任地理解测试结果',
        body: '把结果当作自我反思线索，结合真实行为验证，不要把任何测试结果当成固定身份标签。',
        topic: 'wellbeing',
        readTime: '4 分钟指南',
        related: '情绪智力',
        href: '/emotional-intelligence-test.html',
      },
      {
        title: '适合职业选择的测试组合',
        body: '把 Holland Code、工作价值观、职业锚、领导力和文化匹配测试一起看，职业洞察会更稳定。',
        topic: 'career',
        readTime: '5 分钟指南',
        related: '职业锚',
        href: '/career-anchor-test.html',
      },
      {
        title: '如何比较 MBTI、Big Five 和 HEXACO',
        body: 'MBTI 适合类型语言，Big Five 适合稳定特质，HEXACO 在诚实谦逊、伦理和信任主题上更有补充价值。',
        topic: 'starter',
        readTime: '5 分钟指南',
        related: 'HEXACO',
        href: '/hexaco-personality-test.html',
      },
      {
        title: '情侣关系测试组合',
        body: '关系主题不要只看一个结果，可以组合依恋、爱的语言、冲突风格、信任修复和关系满意度。',
        topic: 'relationships',
        readTime: '4 分钟指南',
        related: '依恋风格',
        href: '/attachment-style-test.html',
      },
      {
        title: '什么时候不要过度解读临床风格测试',
        body: '本站的临床启发类页面只用于教育和自我反思，可以帮助命名模式，但不能用来诊断自己或他人。',
        topic: 'wellbeing',
        readTime: '4 分钟指南',
        related: 'Schema modes',
        href: '/schema-modes-style-test.html',
      },
      {
        title: '给团队建立一套测试清单',
        body: '团队场景可以组合 DISC、社交风格、心理安全、工作价值观和反馈风格，让讨论落到具体协作行为。',
        topic: 'workplace',
        readTime: '5 分钟指南',
        related: '心理安全',
        href: '/psychological-safety-style-test.html',
      },
      {
        title: '快速测试和深度测试怎么选',
        body: 'TIPI 或 Mini-IPIP 适合快速画像，真正做决定时再看 facets、价值观、动机和关系测试。',
        topic: 'starter',
        readTime: '3 分钟指南',
        related: 'TIPI',
        href: '/tipi-style-personality-test.html',
      },
    ],
    aboutStats: (testCount, questionCount) => [
      `目录中已有 ${testCount} 个可直接答题的测试页面`,
      `题库共 ${questionCount} 道题`,
      '构建时自动生成静态 HTML、sitemap 和结构化数据',
    ],
  },
  ja: {
    tests: 'テスト',
    categories: 'カテゴリ',
    allCategory: 'すべて',
    categoryNames: {
      Popular: '人気',
      Games: 'ゲーム',
      Relationships: '関係性',
      Social: 'ソーシャル',
      Career: 'キャリア',
      Fun: '楽しい',
      Anime: 'アニメ',
    },
    articles: 'ガイド',
    about: '概要',
    contact: '連絡',
    searchPlaceholder: 'テスト、カテゴリ、テーマを検索...',
    clear: 'クリア',
    search: '検索',
    heroTitle: '楽しい性格テストで',
    heroAccent: '自分をもっと知る',
    heroBody: (count) => `${count}+ の無料 personality test と性格診断で、すぐに結果と自己理解を得られます。`,
    freeTitle: '完全無料',
    freeBody: 'すべてのテストは無料で、自己理解、関係性、仕事のヒントに使えます。',
    library: '性格テストライブラリ',
    categoryTitle: (category) => `${category} テスト`,
    viewAll: 'すべて見る',
    noMatches: '一致するテストがありません',
    noMatchesBody: '別のキーワードを試すか、カテゴリを解除してください。',
    benefits: [
      ['無料テスト', '性格、関係性、仕事、楽しい診断を幅広く収録。', FileQuestion, 'blue'],
      ['即時結果', '回答後すぐに結果と説明を確認できます。', Clock3, 'violet'],
      ['ローカル保存', '回答の進行状況はブラウザ内に保存されます。', LockKeyhole, 'green'],
      ['楽しく有用', 'エンタメ性と実用的な気づきを両立します。', Trophy, 'orange'],
    ],
    articlesTitle: '性格テストガイド',
    articlesBody: '目的に合ったテストの選び方と、結果の読み方を短く紹介します。',
    guideTopics: [
      ['all', 'すべて'],
      ['starter', 'はじめに'],
      ['career', 'キャリア'],
      ['relationships', '関係性'],
      ['wellbeing', '心理パターン'],
      ['workplace', 'チーム'],
    ],
    aboutTitle: '包括的な性格テスト集として構築',
    aboutBody: 'カタログの各カードは実際の診断ページに接続され、即時計算、ローカル保存、静的ページ生成に対応しています。',
    contactTitle: '不足しているテストを提案',
    contactBody: '追加したい有名な診断やカテゴリがあれば、名称と測定したい軸を送ってください。',
    contactCta: '提案を送る',
    suggestionName: '名前またはハンドル',
    suggestionNamePlaceholder: '任意',
    suggestionTest: 'テスト名',
    suggestionTestPlaceholder: '例: CPI、AQ、Work Personality Inventory',
    suggestionDimensions: '何を測りますか？',
    suggestionDimensionsPlaceholder: '軸、対象ユーザー、元になるフレームワーク、検索される理由を書いてください。',
    suggestionSubmit: '提案を保存',
    suggestionRequired: '保存する前にテスト名を入力してください。',
    suggestionSaved: 'ローカルに保存しました。今後の追加候補として確認できます。',
    suggestionEmail: 'メールで送る',
    savedSuggestionsTitle: '保存した提案',
    savedSuggestionsEmpty: '保存した提案はここに表示され、後で確認、削除、メール送信できます。',
    sendSuggestion: 'メール',
    removeSuggestion: '削除',
    suggestedBy: '提案者',
    anonymousSuggestion: '匿名',
    start: '開始',
    questions: '問',
    guideCards: [
      {
        title: '最初に受けるべき性格テストは？',
        body: 'まず Big 5 や MBTI で広く自己理解し、具体的な悩みには関係性、キャリア、価値観のテストを使います。',
        topic: 'starter',
        readTime: '3分ガイド',
        related: 'Big 5',
        href: '/big-5-personality-test.html',
      },
      {
        title: '結果を責任ある形で読む方法',
        body: '結果は自己理解のヒントとして扱い、実際の行動と照らし合わせ、固定的なラベルにしないことが大切です。',
        topic: 'wellbeing',
        readTime: '4分ガイド',
        related: 'EQ',
        href: '/emotional-intelligence-test.html',
      },
      {
        title: '仕事とキャリア選択に役立つテスト',
        body: 'Holland Code、仕事の価値観、キャリアアンカー、リーダーシップ、文化適合を組み合わせると実用的です。',
        topic: 'career',
        readTime: '5分ガイド',
        related: 'キャリアアンカー',
        href: '/career-anchor-test.html',
      },
      {
        title: 'MBTI、Big Five、HEXACO の使い分け',
        body: 'MBTI はタイプの言語化、Big Five は特性の強さ、HEXACO は誠実さや倫理面を見るときに役立ちます。',
        topic: 'starter',
        readTime: '5分ガイド',
        related: 'HEXACO',
        href: '/hexaco-personality-test.html',
      },
      {
        title: 'カップル向けの関係性テスト組み合わせ',
        body: '愛着、愛の言語、葛藤スタイル、信頼修復、関係満足度を組み合わせると一つの結果に偏りません。',
        topic: 'relationships',
        readTime: '4分ガイド',
        related: '愛着',
        href: '/attachment-style-test.html',
      },
      {
        title: '臨床風テストを読みすぎないために',
        body: 'このサイトの臨床風ページは教育と自己理解のためのものです。診断ではなくパターンの言語化に使います。',
        topic: 'wellbeing',
        readTime: '4分ガイド',
        related: 'Schema modes',
        href: '/schema-modes-style-test.html',
      },
      {
        title: 'チーム向けテストの組み合わせ',
        body: 'DISC、社会的スタイル、心理的安全性、仕事の価値観、フィードバックスタイルを組み合わせると実務に落とし込めます。',
        topic: 'workplace',
        readTime: '5分ガイド',
        related: '心理的安全性',
        href: '/psychological-safety-style-test.html',
      },
      {
        title: '短いテストと深いテストの選び方',
        body: 'TIPI や Mini-IPIP は短時間の把握に向き、意思決定にはファセット、価値観、動機、関係性テストを足します。',
        topic: 'starter',
        readTime: '3分ガイド',
        related: 'TIPI',
        href: '/tipi-style-personality-test.html',
      },
    ],
    aboutStats: (testCount, questionCount) => [
      `カタログには ${testCount} 件の実際に使えるテストページがあります`,
      `ライブラリ全体で ${questionCount} 問を収録`,
      'ビルド時に静的 HTML、sitemap、構造化データを生成',
    ],
  },
  ko: {
    tests: '테스트',
    categories: '카테고리',
    allCategory: '전체',
    categoryNames: {
      Popular: '인기',
      Games: '게임',
      Relationships: '관계',
      Social: '소셜',
      Career: '커리어',
      Fun: '재미',
      Anime: '애니메이션',
    },
    articles: '가이드',
    about: '소개',
    contact: '문의',
    searchPlaceholder: '테스트, 카테고리, 주제를 검색...',
    clear: '지우기',
    search: '검색',
    heroTitle: '재미있는 성격 테스트로',
    heroAccent: '나를 더 알아보기',
    heroBody: (count) => `${count}+개의 무료 성격 테스트와 계산기로 빠르게 결과와 자기 이해를 얻어보세요.`,
    freeTitle: '100% 무료',
    freeBody: '모든 테스트는 무료이며 자기 탐색, 관계 대화, 커리어 고민에 바로 사용할 수 있습니다.',
    library: '성격 테스트 라이브러리',
    categoryTitle: (category) => `${category} 성격 테스트`,
    viewAll: '전체 보기',
    noMatches: '일치하는 테스트가 없습니다',
    noMatchesBody: '다른 키워드를 시도하거나 카테고리 필터를 지워보세요.',
    benefits: [
      ['무료 테스트', '성격, 관계, 직장, 재미있는 테스트를 폭넓게 제공합니다.', FileQuestion, 'blue'],
      ['즉시 결과', '답변을 마치면 결과와 차원 설명을 바로 확인할 수 있습니다.', Clock3, 'violet'],
      ['로컬 저장', '답변 진행 상황은 브라우저에만 저장됩니다.', LockKeyhole, 'green'],
      ['재미와 통찰', '가볍게 즐기면서도 실용적인 자기 이해를 얻을 수 있습니다.', Trophy, 'orange'],
    ],
    articlesTitle: '성격 테스트 가이드',
    articlesBody: '목적에 맞는 테스트를 고르고 결과를 책임 있게 해석하도록 돕는 짧은 가이드입니다.',
    guideTopics: [
      ['all', '전체 가이드'],
      ['starter', '시작하기'],
      ['career', '커리어'],
      ['relationships', '관계'],
      ['wellbeing', '심리 패턴'],
      ['workplace', '팀'],
    ],
    aboutTitle: '완성형 성격 테스트 라이브러리',
    aboutBody: '카탈로그의 각 카드는 실제 퀴즈 페이지로 연결되며, 즉시 채점, 로컬 진행 저장, 검색 엔진용 정적 페이지 생성을 지원합니다.',
    contactTitle: '없는 테스트 제안하기',
    contactBody: '추가되면 좋을 고전 프레임워크나 인기 테스트가 있다면 이름과 측정 차원을 보내주세요.',
    contactCta: '제안 보내기',
    suggestionName: '이름 또는 닉네임',
    suggestionNamePlaceholder: '선택 사항',
    suggestionTest: '테스트 이름',
    suggestionTestPlaceholder: '예: CPI, AQ, Work Personality Inventory',
    suggestionDimensions: '무엇을 측정하나요?',
    suggestionDimensionsPlaceholder: '차원, 대상, 출처 프레임워크, 사용자가 찾는 이유를 적어주세요.',
    suggestionSubmit: '제안 저장',
    suggestionRequired: '저장하기 전에 테스트 이름을 입력하세요.',
    suggestionSaved: '로컬에 저장했습니다. 이후 로드맵 후보로 검토할 수 있습니다.',
    suggestionEmail: '이메일로 보내기',
    savedSuggestionsTitle: '저장된 제안',
    savedSuggestionsEmpty: '저장된 제안은 여기 표시되며 나중에 확인, 삭제, 이메일 전송을 할 수 있습니다.',
    sendSuggestion: '이메일',
    removeSuggestion: '삭제',
    suggestedBy: '제안자',
    anonymousSuggestion: '익명',
    start: '시작하기',
    questions: '문항',
    guideCards: [
      {
        title: '처음에는 어떤 성격 테스트를 해야 할까요?',
        body: '넓은 자기 이해에는 Big 5나 MBTI로 시작하고, 구체적인 고민에는 관계, 커리어, 가치관 테스트를 더해보세요.',
        topic: 'starter',
        readTime: '3분 가이드',
        related: 'Big 5',
        href: '/big-5-personality-test.html',
      },
      {
        title: '결과를 책임 있게 읽는 방법',
        body: '결과는 자기 성찰의 단서로 보고 실제 행동과 비교하세요. 어떤 결과도 고정된 정체성 라벨로 쓰지 않는 것이 좋습니다.',
        topic: 'wellbeing',
        readTime: '4분 가이드',
        related: 'EQ',
        href: '/emotional-intelligence-test.html',
      },
      {
        title: '일과 커리어 선택에 좋은 테스트',
        body: 'Holland Code, 업무 가치관, 커리어 앵커, 리더십, 문화 적합도 테스트를 함께 보면 더 안정적인 통찰을 얻을 수 있습니다.',
        topic: 'career',
        readTime: '5분 가이드',
        related: '커리어 앵커',
        href: '/career-anchor-test.html',
      },
      {
        title: 'MBTI, Big Five, HEXACO 비교하기',
        body: 'MBTI는 유형 언어화, Big Five는 특성 강도, HEXACO는 정직-겸손과 윤리 주제를 볼 때 유용합니다.',
        topic: 'starter',
        readTime: '5분 가이드',
        related: 'HEXACO',
        href: '/hexaco-personality-test.html',
      },
      {
        title: '커플을 위한 관계 테스트 조합',
        body: '관계 주제는 애착, 사랑의 언어, 갈등 스타일, 신뢰 회복, 관계 만족도를 함께 보아야 한 결과에 치우치지 않습니다.',
        topic: 'relationships',
        readTime: '4분 가이드',
        related: '애착',
        href: '/attachment-style-test.html',
      },
      {
        title: '임상풍 퀴즈를 과해석하지 않아야 할 때',
        body: '이 사이트의 임상풍 페이지는 교육과 자기 성찰용입니다. 진단이 아니라 패턴을 이름 붙이는 데 사용하세요.',
        topic: 'wellbeing',
        readTime: '4분 가이드',
        related: 'Schema modes',
        href: '/schema-modes-style-test.html',
      },
      {
        title: '팀용 테스트 플레이리스트 만들기',
        body: '팀에서는 DISC, 사회적 스타일, 심리적 안전감, 업무 가치관, 피드백 스타일을 함께 보면 대화가 실무 행동으로 이어집니다.',
        topic: 'workplace',
        readTime: '5분 가이드',
        related: '심리적 안전감',
        href: '/psychological-safety-style-test.html',
      },
      {
        title: '빠른 테스트와 깊은 테스트 고르기',
        body: 'TIPI나 Mini-IPIP는 빠른 스냅샷에 좋고, 실제 의사결정에는 세부 특성, 가치관, 동기, 관계 테스트를 더하는 편이 좋습니다.',
        topic: 'starter',
        readTime: '3분 가이드',
        related: 'TIPI',
        href: '/tipi-style-personality-test.html',
      },
    ],
    aboutStats: (testCount, questionCount) => [
      `카탈로그에 바로 사용할 수 있는 테스트 페이지 ${testCount}개`,
      `라이브러리 전체 ${questionCount}개 문항`,
      '빌드 시 정적 HTML, sitemap, 구조화 데이터를 생성',
    ],
  },
};

const SUGGESTION_STORAGE_KEY = 'personalitycalculator.suggestions.v1';
const GLOBAL_SEARCH_TERMS = new Set([
  'test',
  'quiz',
  'assessment',
  'inventory',
  'questionnaire',
  'scale',
  'profile',
  'personality',
  'personality test',
  'free',
  'free online',
]);

function loadSavedSuggestions() {
  try {
    const saved = JSON.parse(localStorage.getItem(SUGGESTION_STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((entry) => entry?.testName).slice(0, 50) : [];
  } catch {
    return [];
  }
}

function suggestionMailto(entry) {
  const subject = encodeURIComponent(`Personality test suggestion: ${entry.testName}`);
  const body = encodeURIComponent(
    [
      `Test name: ${entry.testName}`,
      entry.dimensions ? `What it should measure: ${entry.dimensions}` : '',
      entry.name ? `Suggested by: ${entry.name}` : '',
    ]
      .filter(Boolean)
      .join('\n\n'),
  );
  return `mailto:hello@personalitycalculator.org?subject=${subject}&body=${body}`;
}

function categoryLabel(category, copy) {
  if (category === 'All') return copy.allCategory;
  return copy.categoryNames[category] || category;
}

export function HomePage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [locale, setLocale] = useState(detectLocale);
  const [activeGuideTopic, setActiveGuideTopic] = useState('all');
  const [suggestion, setSuggestion] = useState({ name: '', testName: '', dimensions: '' });
  const [suggestionStatus, setSuggestionStatus] = useState('');
  const [savedSuggestions, setSavedSuggestions] = useState([]);
  const searchRef = useRef(null);
  const copy = LOCALE_COPY[locale];
  const featuredTests = TESTS.slice(0, 6);
  const testCount = TESTS.length;
  const questionCount = TESTS.reduce((sum, test) => sum + test.questions, 0);
  const filteredTests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return TESTS.filter((test) => {
      const categoryMatch = activeCategory === 'All' || test.category === activeCategory;
      const queryMatch =
        !normalizedQuery ||
        GLOBAL_SEARCH_TERMS.has(normalizedQuery) ||
        test.searchText.includes(normalizedQuery);
      return categoryMatch && queryMatch;
    });
  }, [activeCategory, query]);
  const filteredGuides = useMemo(
    () =>
      activeGuideTopic === 'all'
        ? copy.guideCards
        : copy.guideCards.filter((article) => article.topic === activeGuideTopic),
    [activeGuideTopic, copy],
  );

  useEffect(() => {
    setSavedSuggestions(loadSavedSuggestions());
  }, []);

  useEffect(() => {
    syncLocale(locale);
  }, [locale]);

  function updateSuggestion(field, value) {
    setSuggestion((current) => ({ ...current, [field]: value }));
    if (suggestionStatus) setSuggestionStatus('');
  }

  function saveSuggestion(event) {
    event.preventDefault();
    const testName = suggestion.testName.trim();
    if (!testName) {
      setSuggestionStatus(copy.suggestionRequired);
      return;
    }

    const entry = {
      name: suggestion.name.trim(),
      testName,
      dimensions: suggestion.dimensions.trim(),
      locale,
      createdAt: new Date().toISOString(),
    };

    try {
      const saved = loadSavedSuggestions();
      const next = Array.isArray(saved) ? [entry, ...saved].slice(0, 50) : [entry];
      localStorage.setItem(SUGGESTION_STORAGE_KEY, JSON.stringify(next));
      setSavedSuggestions(next);
      setSuggestion({ name: '', testName: '', dimensions: '' });
      setSuggestionStatus(copy.suggestionSaved);
    } catch {
      window.location.href = suggestionMailto(entry);
    }
  }

  function removeSuggestion(indexToRemove) {
    const next = savedSuggestions.filter((_, index) => index !== indexToRemove);
    setSavedSuggestions(next);
    try {
      localStorage.setItem(SUGGESTION_STORAGE_KEY, JSON.stringify(next));
    } catch {
      setSuggestionStatus('');
    }
  }

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
          <a href="#tests">{copy.tests}</a>
          <a href="#categories">{copy.categories} <ChevronDown size={14} /></a>
          <a href="#articles">{copy.articles}</a>
          <a href="#about">{copy.about}</a>
          <a href="#contact">{copy.contact}</a>
        </nav>
        <div className="header-actions">
          <button className="search-icon-button" aria-label="Focus search" onClick={() => searchRef.current?.focus()}>
            <Search size={20} />
          </button>
          <div className="language-links" aria-label="Languages">
            {SUPPORTED_LOCALES.map((item, index) => (
              <Fragment key={item}>
                {index > 0 && <span>|</span>}
                <button type="button" className={locale === item ? 'active' : ''} onClick={() => setLocale(item)}>
                  {LOCALE_LABELS[item]}
                </button>
              </Fragment>
            ))}
          </div>
        </div>
      </header>

      <div className="landing-layout">
        <aside className="category-sidebar" id="categories" aria-label="Test categories">
          <h2>{copy.categories}</h2>
          <div className="category-list">
            {[{ label: 'All', icon: Sparkles }, ...CATEGORIES].map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                className={activeCategory === label ? 'active' : ''}
                onClick={() => setActiveCategory(label)}
              >
                <Icon size={23} />
                <span>{categoryLabel(label, copy)}</span>
              </button>
            ))}
          </div>
          <div className="free-card">
            <Trophy size={31} />
            <strong>{copy.freeTitle}</strong>
            <p>{copy.freeBody}</p>
          </div>
        </aside>

        <section className="landing-main" id="tests">
          <form className="hero-search" role="search" onSubmit={(event) => event.preventDefault()}>
            <Search size={20} />
            <input
              ref={searchRef}
              type="search"
              placeholder={copy.searchPlaceholder}
              aria-label="Search tests"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="button" onClick={() => setQuery('')}>{query ? copy.clear : copy.search}</button>
          </form>

          <section className="landing-hero">
            <div className="hero-copy">
              <h1>
                {copy.heroTitle} <span>{copy.heroAccent}</span>
              </h1>
              <p>{copy.heroBody(testCount)}</p>
            </div>
            <HeroIllustration />
          </section>

          <div className="featured-strip" aria-label="Featured personality tests">
            {featuredTests.map((test) => (
              <FeaturedTestCard key={test.href} test={test} copy={copy} locale={locale} />
            ))}
          </div>

          <section className="test-section">
            <div className="section-head">
              <h2>{activeCategory === 'All' ? copy.library : copy.categoryTitle(categoryLabel(activeCategory, copy))}</h2>
              <button type="button" onClick={() => { setActiveCategory('All'); setQuery(''); }}>
                {copy.viewAll} <span aria-hidden="true">→</span>
              </button>
            </div>
            <div className="test-grid">
              {filteredTests.map((test) => (
                <TestCard key={test.href} test={test} copy={copy} locale={locale} />
              ))}
            </div>
            {filteredTests.length === 0 && (
              <div className="empty-tests">
                <FileQuestion size={28} />
                <strong>{copy.noMatches}</strong>
                <p>{copy.noMatchesBody}</p>
              </div>
            )}
          </section>

          <section className="benefit-band" aria-label="Benefits">
            {copy.benefits.map(([title, body, Icon, tone], index) => (
              <article key={title}>
                <span className={`landing-icon ${tone}`}>
                  <Icon size={25} />
                </span>
                <h3>{index === 0 ? `${testCount}+ ${title}` : title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </section>

          <section className="content-section guide-section" id="articles" aria-labelledby="articles-title">
            <div className="content-section-head">
              <span className="landing-icon small blue">
                <BookOpenText size={20} />
              </span>
              <div>
                <h2 id="articles-title">{copy.articlesTitle}</h2>
                <p>{copy.articlesBody}</p>
              </div>
            </div>
            <div className="guide-topic-tabs" aria-label={copy.articlesTitle}>
              {copy.guideTopics.map(([topic, label]) => (
                <button
                  key={topic}
                  type="button"
                  className={activeGuideTopic === topic ? 'active' : ''}
                  onClick={() => setActiveGuideTopic(topic)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="article-grid">
              {filteredGuides.map((article) => (
                <a className="article-card" href={article.href} key={article.title}>
                  <span className="article-meta">{article.readTime} · {article.related}</span>
                  <strong>{article.title}</strong>
                  <p>{article.body}</p>
                  <span>{copy.start} <span aria-hidden="true">→</span></span>
                </a>
              ))}
            </div>
          </section>

          <section className="content-section about-section" id="about" aria-labelledby="about-title">
            <div>
              <span className="landing-icon small green">
                <CheckCircle2 size={20} />
              </span>
              <h2 id="about-title">{copy.aboutTitle}</h2>
              <p>{copy.aboutBody}</p>
            </div>
            <ul>
              {copy.aboutStats(testCount, questionCount).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="content-section contact-section" id="contact" aria-labelledby="contact-title">
            <div>
              <span className="landing-icon small violet">
                <Mail size={20} />
              </span>
              <h2 id="contact-title">{copy.contactTitle}</h2>
              <p>{copy.contactBody}</p>
            </div>
            <form className="suggestion-form" onSubmit={saveSuggestion}>
              <label>
                <span>{copy.suggestionName}</span>
                <input
                  value={suggestion.name}
                  onChange={(event) => updateSuggestion('name', event.target.value)}
                  placeholder={copy.suggestionNamePlaceholder}
                />
              </label>
              <label>
                <span>{copy.suggestionTest}</span>
                <input
                  value={suggestion.testName}
                  onChange={(event) => updateSuggestion('testName', event.target.value)}
                  placeholder={copy.suggestionTestPlaceholder}
                  required
                />
              </label>
              <label>
                <span>{copy.suggestionDimensions}</span>
                <textarea
                  value={suggestion.dimensions}
                  onChange={(event) => updateSuggestion('dimensions', event.target.value)}
                  placeholder={copy.suggestionDimensionsPlaceholder}
                  rows={4}
                />
              </label>
              {suggestionStatus && <p className="suggestion-status" role="status">{suggestionStatus}</p>}
              <div className="suggestion-actions">
                <button type="submit">{copy.suggestionSubmit}</button>
                <a href="mailto:hello@personalitycalculator.org?subject=Personality%20test%20suggestion">{copy.suggestionEmail}</a>
              </div>
            </form>
            <section className="suggestion-queue" aria-label={copy.savedSuggestionsTitle}>
              <h3>{copy.savedSuggestionsTitle}</h3>
              {savedSuggestions.length === 0 ? (
                <p>{copy.savedSuggestionsEmpty}</p>
              ) : (
                <div className="suggestion-list">
                  {savedSuggestions.map((entry, index) => (
                    <article key={`${entry.testName}-${entry.createdAt || index}`}>
                      <div>
                        <strong>{entry.testName}</strong>
                        {entry.dimensions && <p>{entry.dimensions}</p>}
                        <small>{copy.suggestedBy}: {entry.name || copy.anonymousSuggestion}</small>
                      </div>
                      <div className="suggestion-item-actions">
                        <a href={suggestionMailto(entry)}>{copy.sendSuggestion}</a>
                        <button type="button" onClick={() => removeSuggestion(index)}>{copy.removeSuggestion}</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </section>
        </section>
      </div>
    </main>
  );
}

function FeaturedTestCard({ test, copy }) {
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

function TestCard({ test, copy, locale }) {
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

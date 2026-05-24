const FALLBACK_BY_LOCALE = {
  zh: {
    titleSuffix: '测试',
    description: (category) => `完成这个${category}测试，了解你的性格模式、优势和适合继续探索的方向。`,
    categories: {
      Popular: '热门人格',
      Games: '游戏人格',
      Relationships: '关系人格',
      Social: '社交人格',
      Career: '职业人格',
      Fun: '趣味人格',
      Anime: '动漫人格',
      Wellbeing: '心理模式',
      Values: '价值观',
    },
  },
  ja: {
    titleSuffix: 'テスト',
    description: (category) => `この${category}テストで、自分の性格パターン、強み、次に深めたいテーマを確認できます。`,
    categories: {
      Popular: '人気の性格',
      Games: 'ゲーム性格',
      Relationships: '関係性',
      Social: 'ソーシャル',
      Career: 'キャリア',
      Fun: '楽しい性格',
      Anime: 'アニメ性格',
      Wellbeing: '心理パターン',
      Values: '価値観',
    },
  },
  ko: {
    titleSuffix: '테스트',
    description: (category) => `이 ${category} 테스트로 나의 성격 패턴, 강점, 더 탐색할 주제를 확인해보세요.`,
    categories: {
      Popular: '인기 성격',
      Games: '게임 성격',
      Relationships: '관계 성격',
      Social: '소셜 성격',
      Career: '커리어 성격',
      Fun: '재미 성격',
      Anime: '애니메이션 성격',
      Wellbeing: '심리 패턴',
      Values: '가치관',
    },
  },
};

const TITLE_TERMS = {
  zh: [
    ['Personality Calculator', '性格计算器'],
    ['Personality Match', '人格匹配'],
    ['Personality Test', '人格测试'],
    ['Style Test', '风格测试'],
    ['Scale Test', '量表测试'],
    ['Inventory Test', '问卷测试'],
    ['Questionnaire Style Test', '问卷风格测试'],
    ['Questionnaire Test', '问卷测试'],
    ['Assessment Test', '评估测试'],
    ['Love Language', '爱的语言'],
    ['Friendship', '友谊'],
    ['Introvert vs Extrovert', '内向与外向'],
    ['Social Skills', '社交能力'],
    ['Emotional Intelligence', '情绪智力'],
    ['Communication', '沟通'],
    ['Empathy', '共情'],
    ['Assertiveness', '坚定表达'],
    ['Listening', '倾听'],
    ['Career', '职业'],
    ['Leadership', '领导力'],
    ['Attachment', '依恋'],
    ['Conflict', '冲突'],
    ['Learning', '学习'],
    ['Values', '价值观'],
    ['Work', '工作'],
    ['Stress Response', '压力反应'],
    ['Anime', '动漫'],
    ['Test', '测试'],
    ['Style', '风格'],
  ],
  ja: [
    ['Personality Calculator', '性格計算機'],
    ['Personality Match', '性格マッチ'],
    ['Personality Test', '性格テスト'],
    ['Style Test', 'スタイルテスト'],
    ['Scale Test', '尺度テスト'],
    ['Inventory Test', 'インベントリテスト'],
    ['Questionnaire Style Test', '質問紙スタイルテスト'],
    ['Questionnaire Test', '質問紙テスト'],
    ['Assessment Test', '評価テスト'],
    ['Love Language', '愛情表現'],
    ['Friendship', '友情'],
    ['Introvert vs Extrovert', '内向型と外向型'],
    ['Social Skills', 'ソーシャルスキル'],
    ['Emotional Intelligence', '感情知能'],
    ['Communication', 'コミュニケーション'],
    ['Empathy', '共感'],
    ['Assertiveness', 'アサーティブネス'],
    ['Listening', '傾聴'],
    ['Career', 'キャリア'],
    ['Leadership', 'リーダーシップ'],
    ['Attachment', '愛着'],
    ['Conflict', '葛藤'],
    ['Learning', '学習'],
    ['Values', '価値観'],
    ['Work', '仕事'],
    ['Stress Response', 'ストレス反応'],
    ['Anime', 'アニメ'],
    ['Test', 'テスト'],
    ['Style', 'スタイル'],
  ],
  ko: [
    ['Personality Calculator', '성격 계산기'],
    ['Personality Match', '성격 매치'],
    ['Personality Test', '성격 테스트'],
    ['Style Test', '스타일 테스트'],
    ['Scale Test', '척도 테스트'],
    ['Inventory Test', '검사 테스트'],
    ['Questionnaire Style Test', '질문지 스타일 테스트'],
    ['Questionnaire Test', '질문지 테스트'],
    ['Assessment Test', '평가 테스트'],
    ['Love Language', '사랑의 언어'],
    ['Friendship', '우정'],
    ['Introvert vs Extrovert', '내향형과 외향형'],
    ['Social Skills', '사회성'],
    ['Emotional Intelligence', '감성 지능'],
    ['Communication', '커뮤니케이션'],
    ['Empathy', '공감'],
    ['Assertiveness', '자기주장'],
    ['Listening', '경청'],
    ['Career', '커리어'],
    ['Leadership', '리더십'],
    ['Attachment', '애착'],
    ['Conflict', '갈등'],
    ['Learning', '학습'],
    ['Values', '가치관'],
    ['Work', '업무'],
    ['Stress Response', '스트레스 반응'],
    ['Anime', '애니메이션'],
    ['Test', '테스트'],
    ['Style', '스타일'],
  ],
};

export const TEST_TRANSLATIONS = {
  zh: {
    'mbti-personality-test': {
      title: 'MBTI 人格测试',
      description: '通过完整的 60 题测评，了解你的 16 型人格偏好。',
    },
    'which-infp-avatar-represents-you': {
      title: 'MBTI 形象卡片',
      description: '浏览 16 型人格的 32 张头像形象，查看每种人格的形象表现、详细分析和作答倾向。',
    },
    'tomodachi-life-personality-calculator': {
      title: 'Tomodachi Life 性格计算器',
      description: '生成你的 Tomodachi Life 独特性格，并保存可分享的个人资料卡。',
    },
    'love-language-test': {
      title: '爱的语言测试',
      description: '了解你在亲密关系中最自然表达和接收爱意的方式。',
    },
    'friendship-test': {
      title: '友谊风格测试',
      description: '了解你如何陪伴朋友、维系关系并建立信任。',
    },
    'introvert-vs-extrovert-test': {
      title: '内向与外向测试',
      description: '定位你的社交能量从内省型内向到表达型外向的自然位置。',
      questions: [
        '热闹的房间通常会让你更有能量。',
        '连续社交几个小时后，你需要安静的独处时间。',
        '你的社交能量很大程度上取决于房间里都有谁。',
        '你经常在说出来的过程中想得更清楚。',
        '相比许多简短寒暄，你更喜欢少数深入对话。',
        '你可以享受一场聚会，同时第二天仍然想要独处。',
        '你能自在地和陌生人开启对话。',
        '面对重要决定时，你通常会先独自消化。',
        '你可以在带领群体和安静观察之间切换。',
        '独处太久会让你感到坐立不安。',
        '你会保护自己的注意力，避免被嘈杂环境消耗。',
        '理想的周末会平衡社交安排和私人时间。',
      ],
      dimensions: {
        introvert: {
          label: '内向',
          title: '内省型内向者',
          summary: '你通过空间、深度和私人思考来恢复能量。',
          strengths: ['专注', '倾听', '独立思考'],
          growth: ['在耗尽之前提前安排恢复时间'],
        },
        ambivert: {
          label: '中间型',
          title: '灵活型中间者',
          summary: '你会根据情境在社交能量和独处需求之间切换。',
          strengths: ['适应力', '范围感', '社交判断'],
          growth: ['识别哪些场景最容易消耗你'],
        },
        extrovert: {
          label: '外向',
          title: '表达型外向者',
          summary: '你从人群、对话和外部刺激中获得动力。',
          strengths: ['主动性', '热情', '群体能量'],
          growth: ['在填补每一段沉默前稍作停顿'],
        },
      },
    },
    'anime-personality-match': {
      title: '动漫人格匹配',
      description: '把你的故事气质匹配到熟悉的动漫风格原型。',
    },
    'social-skills-test': {
      title: '社交能力测试',
      description: '评估你最常使用的社交优势，以及值得练习的部分。',
    },
    'emotional-intelligence-test': {
      title: '情绪智力测试',
      description: '看看你在情绪智力的哪些部分最强。',
    },
    'communication-style-test': {
      title: '沟通风格测试',
      description: '找到你在日常对话和冲突中的默认沟通方式。',
    },
    'empathy-test': {
      title: '共情能力测试',
      description: '了解你如何理解、感受并回应他人的经历。',
    },
    'assertiveness-test': {
      title: '坚定表达测试',
      description: '看看你表达需求、边界和不同意见时有多直接。',
    },
    'listening-style-test': {
      title: '倾听风格测试',
      description: '了解你倾听时更关注人、行动、内容，还是整体图景。',
    },
    'dark-triad-test': {
      title: '黑暗三联征测试',
      description: '以非临床方式反思自恋、马基雅维利主义和精神病态相关倾向。',
    },
    'career-personality-test': {
      title: '职业人格测试',
      description: '发现与你的动机更匹配的工作环境和职业主题。',
    },
    'enneagram-test': {
      title: '九型人格测试',
      description: '探索九种常见九型人格模式背后的核心动机。',
    },
    'big-5-personality-test': {
      title: '大五人格测试',
      description: '测量开放性、尽责性、外向性、宜人性和神经质五个 OCEAN 特质。',
    },
    'disc-personality-test': {
      title: 'DISC 人格测试',
      description: '识别你在支配、影响、稳定和尽责四个维度上的职场行为模式。',
    },
    'attachment-style-test': {
      title: '依恋风格测试',
      description: '反思你在关系中如何寻求亲密、安全感和独立。',
    },
    'conflict-style-test': {
      title: '冲突风格测试',
      description: '发现当需求、价值观或优先级冲突时，你倾向如何回应。',
    },
    'learning-style-test': {
      title: '学习风格测试',
      description: '找到最能帮助你吸收新信息的学习条件。',
    },
    'leadership-style-test': {
      title: '领导风格测试',
      description: '识别你如何带领他人、推动决策和维持势能。',
    },
    'values-test': {
      title: '个人价值观测试',
      description: '厘清最常驱动你选择的核心价值观。',
    },
    'work-style-test': {
      title: '工作风格测试',
      description: '了解哪些工作条件最能帮助你发挥最佳状态。',
    },
    'stress-response-test': {
      title: '压力反应测试',
      description: '看看压力升高时你最常见的反应模式。',
    },
  },
  ja: {
    'mbti-personality-test': {
      title: 'MBTI 性格診断',
      description: '60問の診断で、自分の16タイプ傾向を確認できます。',
    },
    'which-infp-avatar-represents-you': {
      title: 'MBTIアバターカード',
      description: '16タイプの32枚のアバターで、各タイプの見た目、詳しい分析、回答傾向を確認できます。',
    },
    'tomodachi-life-personality-calculator': {
      title: 'Tomodachi Life 性格計算機',
      description: 'あなたのTomodachi Life性格を見つけ、共有できるプロフィールカードを作成します。',
    },
    'love-language-test': {
      title: '愛情表現テスト',
      description: '親しい関係で愛情を伝え、受け取る自然な方法を見つけます。',
    },
    'friendship-test': {
      title: '友情スタイルテスト',
      description: '友人との関わり方、絆の保ち方、信頼の築き方を理解します。',
    },
    'introvert-vs-extrovert-test': {
      title: '内向型・外向型テスト',
      description: '内省的な内向から表現豊かな外向まで、あなたの社交エネルギーを確認します。',
    },
    'anime-personality-match': {
      title: 'アニメ性格マッチ',
      description: 'あなたの物語的な雰囲気を、親しみやすいアニメ風アーキタイプに当てはめます。',
    },
    'social-skills-test': {
      title: 'ソーシャルスキルテスト',
      description: 'よく使う対人スキルの強みと、練習するとよい領域を確認します。',
    },
    'emotional-intelligence-test': {
      title: '感情知能テスト',
      description: '感情知能のどの部分が特に強いかを確認します。',
    },
    'communication-style-test': {
      title: 'コミュニケーションスタイルテスト',
      description: '日常会話や対立場面での基本的な伝え方を見つけます。',
    },
    'empathy-test': {
      title: '共感力テスト',
      description: '他者の経験を理解し、感じ取り、応答する方法を確認します。',
    },
    'assertiveness-test': {
      title: 'アサーティブネステスト',
      description: 'ニーズ、境界線、反対意見をどれだけ率直に表現するかを確認します。',
    },
    'listening-style-test': {
      title: '傾聴スタイルテスト',
      description: '人、行動、内容、全体像のどれを中心に聞く傾向があるかを見つけます。',
    },
  },
  ko: {
    'mbti-personality-test': {
      title: 'MBTI 성격 테스트',
      description: '60문항 전체 테스트로 나의 16가지 성격 유형 선호를 확인하세요.',
    },
    'which-infp-avatar-represents-you': {
      title: 'MBTI 아바타 카드',
      description: '16가지 유형의 32개 아바타로 각 성격의 시각적 특징, 상세 분석, 응답 경향을 확인하세요.',
    },
    'tomodachi-life-personality-calculator': {
      title: 'Tomodachi Life 성격 계산기',
      description: '나만의 Tomodachi Life 성격을 찾고 공유 가능한 프로필 카드를 만들어보세요.',
    },
    'love-language-test': {
      title: '사랑의 언어 테스트',
      description: '가까운 관계에서 애정을 주고받는 가장 자연스러운 방식을 찾아보세요.',
    },
    'friendship-test': {
      title: '우정 스타일 테스트',
      description: '친구에게 어떻게 다가가고, 관계를 유지하며, 신뢰를 쌓는지 이해하세요.',
    },
    'introvert-vs-extrovert-test': {
      title: '내향형 vs 외향형 테스트',
      description: '나의 사회적 에너지가 성찰적인 내향부터 표현적인 외향까지 어디에 있는지 확인하세요.',
    },
    'anime-personality-match': {
      title: '애니메이션 성격 매치',
      description: '나의 이야기 에너지를 친숙한 애니메이션 스타일 원형과 연결해보세요.',
    },
    'social-skills-test': {
      title: '사회성 테스트',
      description: '자주 사용하는 사회적 강점과 연습하면 좋은 영역을 평가하세요.',
    },
    'emotional-intelligence-test': {
      title: '감성 지능 테스트',
      description: '감성 지능의 어떤 부분이 가장 강한지 확인하세요.',
    },
    'communication-style-test': {
      title: '커뮤니케이션 스타일 테스트',
      description: '일상 대화와 갈등 상황에서 나타나는 기본 소통 방식을 찾아보세요.',
    },
    'empathy-test': {
      title: '공감 능력 테스트',
      description: '다른 사람의 경험을 이해하고, 느끼고, 반응하는 방식을 확인하세요.',
    },
    'assertiveness-test': {
      title: '자기주장 테스트',
      description: '필요, 경계, 의견 차이를 얼마나 직접적으로 표현하는지 확인하세요.',
    },
    'listening-style-test': {
      title: '경청 스타일 테스트',
      description: '사람, 행동, 내용, 큰 그림 중 무엇을 중심으로 듣는지 알아보세요.',
    },
  },
};

function slugFromTest(test) {
  if (test.slug) return test.slug;
  return test.href?.replace(/^\//, '').replace(/\.html$/, '') || '';
}

function translateTitle(title, locale) {
  const replacements = TITLE_TERMS[locale];
  if (!replacements) return title;
  return replacements.reduce((value, [source, target]) => value.replaceAll(source, target), title);
}

export function localizeTest(test, locale) {
  if (locale === 'en') return test;

  const slug = slugFromTest(test);
  const translated = TEST_TRANSLATIONS[locale]?.[slug];
  const fallback = FALLBACK_BY_LOCALE[locale];
  const category = fallback?.categories[test.category] || test.category;
  const title = translated?.title || translateTitle(test.title, locale);
  const description = translated?.description || fallback?.description(category) || test.description;
  const localizedQuestions = Array.isArray(translated?.questions) && Array.isArray(test.questions)
    ? test.questions.map((question, index) => ({
        ...question,
        text: translated.questions[index] || question.text,
      }))
    : test.questions;
  const localizedDimensions = translated?.dimensions && Array.isArray(test.dimensions)
    ? test.dimensions.map((dimension) => ({
        ...dimension,
        ...(translated.dimensions[dimension.key] || {}),
      }))
    : test.dimensions;

  return {
    ...test,
    title,
    intro: test.intro ? description : test.intro,
    description,
    categoryLabel: category,
    questions: localizedQuestions,
    dimensions: localizedDimensions,
    searchText: `${test.searchText || ''} ${title} ${description || ''}`.toLowerCase(),
  };
}

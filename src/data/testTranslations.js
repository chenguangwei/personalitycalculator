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
    'lifo-style-test': {
      title: 'LIFO 优势风格测试',
      description: '分别测量你在顺境与压力下的四种优势风格，给出主导风格、压力下的备用风格，以及优势被过度使用的信号。',
      intro: '你的四种优势，在状态最好时和在压力之下会呈现出不同的样子。这个测试分别测量这两种状态，然后呈现你的主导风格、压力下退守的备用风格，以及某种优势在何处可能被用力过度。',
      notice: '灵感来自 LIFO® 人生取向框架（Atkins & Katcher）。这是使用其四种优势风格的原创反思测验，并非官方评测，也不用于任何选拔决策。',
      questions: [
        '工作顺利时，你会主动寻找让自己的付出帮助他人成功的方式。',
        '你对工作应有的水准有很高的理想和要求。',
        '即使状态最好时，你也很少主动去支持同事。',
        '一旦看到机会，你会主动承担并定下方向。',
        '在所有细节尚未明朗前，你也能果断做决定。',
        '项目停滞时，往往是你推动它拿到结果。',
        '做决定前，你倾向于仔细权衡证据。',
        '你会保护质量，并高效地使用资源。',
        '状态最好时，你不需要太多分析就会去改动一个运转正常的系统。',
        '你能轻松调整方式，去适应不同的人和情境。',
        '当大家意见不合时，你擅长找到务实的共识。',
        '你能读懂一个场合的气氛并作出回应。',
        '压力之下，即使已经精疲力竭，你仍会继续付出。',
        '感到压力时，你会反复解释自己的好意，以维系他人的信任。',
        '压力之下，你会把别人的需求放在自己之前，直到把自己耗尽。',
        '压力之下，你会接手掌控，并更用力地去逼出结果。',
        '感到压力时，你会对拖慢进度的人失去耐心。',
        '压力之下，为了保持掌控，你会承担超出现实的任务量。',
        '压力之下，你会不停分析，却迟迟不做决定。',
        '感到压力时，即使现有做法已经失效，你仍会抗拒改变。',
        '压力之下，你会紧紧抓住资源、控制权或信息。',
        '压力之下，你会为了避免冲突而改变自己的立场。',
        '感到压力时，即使内心不同意，你表面上也会附和。',
        '压力之下，你会顺从他人，渐渐忽略了自己的优先事项。',
      ],
      dimensions: {
        'supporting-fav': { label: '支持', groupLabel: '支持给予型', title: '支持给予型', summary: '状态最好时，你以信任、服务和高标准的理想为先——帮助他人成功，并以原则要求工作。', strengths: ['帮助并培养他人', '忠诚与信任', '以高标准的理想做事'], growth: ['节制过度付出：在被耗尽之前先说出自己的需要', '表达你自己的优先事项，而不只是他人的需要'] },
        'supporting-str': { label: '支持（压力）', groupLabel: '支持给予型', title: '压力下的支持给予型', summary: '压力之下，给予会滑向自我牺牲——你可能过度信任、不断解释自己的好意，或凡事把别人放在第一位，直到心力耗尽。', overdone: ['自我牺牲到精疲力竭', '过快地退让或轻信', '用道德说教代替做决定'] },
        'controlling-fav': { label: '掌控', groupLabel: '掌控主导型', title: '掌控主导型', summary: '状态最好时，你抓住机会、定下方向、快速推动结果——你愿意承担别人回避的责任。', strengths: ['主动承担', '在不确定中做决定', '推动结果'], growth: ['在加速之前先倾听并邀请不同意见', '把责任分派出去，而不是一肩扛下'] },
        'controlling-str': { label: '掌控（压力）', groupLabel: '掌控主导型', title: '压力下的掌控主导型', summary: '压力之下，冲劲会硬化为控制——你可能强推、越过他人，或快到听不进任何意见。', overdone: ['专断或强势', '对慢节奏的人没有耐心', '过度自信、承诺过多'] },
        'conserving-fav': { label: '稳健', groupLabel: '稳健保全型', title: '稳健保全型', summary: '状态最好时，你善于分析、建立系统、守护质量——依据证据做审慎决定，并节约资源。', strengths: ['分析与严谨', '稳定与质量', '审慎的风险控制'], growth: ['设定决策截止时间，让分析转化为行动', '用小范围试验代替固守现状'] },
        'conserving-str': { label: '稳健（压力）', groupLabel: '稳健保全型', title: '压力下的稳健保全型', summary: '压力之下，谨慎会变成僵化——你可能过度分析、抗拒有益的改变，或把资源与控制权抓得太紧。', overdone: ['分析过头、错过决策时机', '僵化、抗拒改变', '囤积资源或信息不肯分享'] },
        'adapting-fav': { label: '灵活', groupLabel: '灵活协调型', title: '灵活协调型', summary: '状态最好时，你善于读懂他人、保持灵活、找到务实的共识——让关系与选项持续流动。', strengths: ['读懂他人与情境', '灵活与圆融', '促成共识'], growth: ['把灵活的选择锚定在少数不可退让的优先事项上', '即使会打破和谐，也要说出难说的话'] },
        'adapting-str': { label: '灵活（压力）', groupLabel: '灵活协调型', title: '压力下的灵活协调型', summary: '压力之下，适应会滑向讨好——你可能不断改变立场、回避冲突，或一味迁就到失去自己的主张。', overdone: ['反复无常或过度迁就', '回避必要的冲突', '为了取悦他人而丢失自己的优先事项'] },
      },
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
    'lifo-style-test': {
      title: 'LIFO 強みスタイル診断',
      description: '好調時とプレッシャー下での4つの強みスタイルを別々に測り、主要スタイル、ストレス時の予備スタイル、強みの使いすぎのサインを示します。',
      intro: 'あなたの4つの強みは、好調なときとプレッシャーのもとでは違う形で現れます。この診断は両方の状態を別々に測定し、主要スタイル、ストレス時に頼る予備スタイル、そして強みが過剰になりやすいポイントを示します。',
      notice: 'LIFO®（ライフ・オリエンテーション、Atkins & Katcher）の枠組みに着想を得ています。その4つの強みスタイルを用いたオリジナルの内省クイズであり、公式アセスメントではなく、選考には使用できません。',
      questions: [
        '仕事が順調なとき、自分の努力が人の成功に役立つ方法を自然に探す。',
        '仕事のあるべき水準について、高い理想を自分に課している。',
        '調子が良いときでも、同僚をわざわざ支援することはあまりない。',
        'チャンスが見えたら、自分が主導して方向を定める。',
        'すべての細部が固まる前でも、決断できる。',
        '停滞したプロジェクトを結果へ押し進めるのは自分だ。',
        '決める前に、証拠を慎重に検討する方だ。',
        '品質を守り、資源を効率よく使う。',
        '調子が良いときは、大した分析をせずに、うまく回っている仕組みを変えることがある。',
        '相手や状況に合わせて、やり方を柔軟に変えられる。',
        '意見が食い違うとき、現実的な妥協点を見つけるのが得意だ。',
        'その場の空気を読み取り、それに応じて振る舞う。',
        'プレッシャー下では、消耗しきっても人に与え続ける。',
        'ストレスを感じると、信頼を保つために自分の善意を繰り返し説明する。',
        'プレッシャー下では、燃え尽きるまで他人の要求を自分より優先する。',
        'プレッシャー下では、主導権を握り、結果を出そうとより強く押す。',
        'ストレスを感じると、進行を遅らせる人にいら立つ。',
        'プレッシャー下では、主導権を保つために現実的でない量を引き受ける。',
        'プレッシャー下では、決めずに分析を続けてしまう。',
        'ストレスを感じると、今のやり方が失敗していても変化に抵抗する。',
        'プレッシャー下では、資源・主導権・情報を強く抱え込む。',
        'プレッシャー下では、対立を避けるために自分の立場を変える。',
        'ストレスを感じると、内心は反対でも表向きは同意する。',
        'プレッシャー下では、人に合わせて自分の優先事項を見失う。',
      ],
      dimensions: {
        'supporting-fav': { label: '支援', groupLabel: '支援・貢献タイプ', title: '支援・貢献タイプ', summary: '好調なときは、信頼・奉仕・高い理想を軸に動き、人の成功を助け、仕事を原則に沿った水準で保ちます。', strengths: ['人を助け育てる', '誠実さと信頼', '高い理想を持って取り組む'], growth: ['与えすぎを抑える：消耗する前に自分の必要を伝える', '他人の要求だけでなく、自分の優先事項も口にする'] },
        'supporting-str': { label: '支援（ストレス）', groupLabel: '支援・貢献タイプ', title: 'ストレス時の支援・貢献タイプ', summary: 'プレッシャー下では、与えることが自己犠牲に傾きます。信頼しすぎたり、善意を説明しすぎたり、燃え尽きるまで他人を優先したりします。', overdone: ['消耗しきるほどの自己犠牲', '譲りすぎ・信じすぎ', '決断の代わりに説教になる'] },
        'controlling-fav': { label: '主導', groupLabel: '主導・推進タイプ', title: '主導・推進タイプ', summary: '好調なときは、機会をつかみ、方向を定め、結果へ素早く進みます。人が避ける責任を引き受けます。', strengths: ['自ら動き出す', '不確実な中で決める', '結果を出す'], growth: ['加速する前に耳を傾け、異論を求める', '抱え込まず、責任を任せる'] },
        'controlling-str': { label: '主導（ストレス）', groupLabel: '主導・推進タイプ', title: 'ストレス時の主導・推進タイプ', summary: 'プレッシャー下では、推進力が支配に硬直します。押し切ったり、人を飛び越えたり、意見が入らないほど速く動いたりします。', overdone: ['高圧的・強引', '遅い相手にいら立つ', '自信過剰で抱え込みすぎる'] },
        'conserving-fav': { label: '堅実', groupLabel: '堅実・保全タイプ', title: '堅実・保全タイプ', summary: '好調なときは、分析し、仕組みを整え、品質を守ります。証拠に基づいて慎重に決め、資源を節約します。', strengths: ['分析と緻密さ', '一貫性と品質', '慎重なリスク管理'], growth: ['締め切りを設けて分析を行動に変える', '現状維持ではなく小さく試す'] },
        'conserving-str': { label: '堅実（ストレス）', groupLabel: '堅実・保全タイプ', title: 'ストレス時の堅実・保全タイプ', summary: 'プレッシャー下では、慎重さが硬直に変わります。分析しすぎたり、有益な変化に抵抗したり、資源や主導権を抱え込みすぎたりします。', overdone: ['決断の機を逃すほど分析する', '硬直し、変化を拒む', '資源や情報を抱え込む'] },
        'adapting-fav': { label: '柔軟', groupLabel: '柔軟・調整タイプ', title: '柔軟・調整タイプ', summary: '好調なときは、人を読み、柔軟に構え、現実的な共通点を見つけます。関係と選択肢を動かし続けます。', strengths: ['人と状況を読む', '柔軟さと機転', '合意を築く'], growth: ['柔軟な選択を、少数の譲れない優先事項に結びつける', '和を乱してでも、言うべきことを言う'] },
        'adapting-str': { label: '柔軟（ストレス）', groupLabel: '柔軟・調整タイプ', title: 'ストレス時の柔軟・調整タイプ', summary: 'プレッシャー下では、順応が迎合に傾きます。立場を変えたり、対立を避けたり、同調しすぎて自分の主張を失ったりします。', overdone: ['一貫せず、迎合しすぎる', '必要な対立を避ける', '人に合わせて自分の優先事項を失う'] },
      },
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
    'lifo-style-test': {
      title: 'LIFO 강점 스타일 테스트',
      description: '순조로울 때와 압박받을 때의 네 가지 강점 스타일을 각각 측정해 주도 스타일, 스트레스 시 예비 스타일, 강점을 과하게 쓰는 신호를 알려줍니다.',
      intro: '당신의 네 가지 강점은 최상의 상태일 때와 압박을 받을 때 서로 다른 모습으로 나타납니다. 이 테스트는 두 조건을 각각 측정한 뒤 주도 스타일, 스트레스 상황에서 물러나 기대는 예비 스타일, 그리고 강점이 과하게 쓰일 수 있는 지점을 보여줍니다.',
      notice: 'LIFO®(라이프 오리엔테이션, Atkins & Katcher) 프레임워크에서 영감을 받았습니다. 네 가지 강점 스타일을 활용한 독자적인 성찰 퀴즈이며, 공식 평가가 아니고 선발 결정에 사용하지 않습니다.',
      questions: [
        '일이 잘 풀릴 때, 당신은 자신의 노력이 다른 사람의 성공에 도움이 되도록 자연스럽게 방법을 찾는다.',
        '일이 어떻게 이루어져야 하는지에 대해 높은 이상을 스스로에게 요구한다.',
        '최상의 상태일 때조차, 당신은 동료를 굳이 나서서 돕는 일이 드물다.',
        '기회가 보이면, 당신이 나서서 방향을 정한다.',
        '모든 세부 사항이 정해지기 전에도 결정을 내릴 수 있다.',
        '멈춰 선 프로젝트를 결과로 밀어붙이는 사람은 바로 당신이다.',
        '결정하기 전에 근거를 신중히 따져 보는 편이다.',
        '품질을 지키고 자원을 효율적으로 사용한다.',
        '최상의 상태일 때, 당신은 큰 분석 없이도 잘 돌아가는 시스템을 바꾼다.',
        '사람과 상황에 맞춰 접근 방식을 쉽게 조정한다.',
        '의견이 엇갈릴 때, 현실적인 공통점을 잘 찾아낸다.',
        '그 자리의 분위기를 읽고 그에 맞춰 반응한다.',
        '압박을 받을 때, 이미 지쳤어도 계속해서 남에게 베푼다.',
        '스트레스를 받으면, 신뢰를 지키려고 자신의 선의를 거듭 설명한다.',
        '압박을 받을 때, 소진될 때까지 남의 필요를 자신보다 앞세운다.',
        '압박을 받을 때, 주도권을 잡고 결과를 내려고 더 세게 밀어붙인다.',
        '스트레스를 받으면, 진행을 늦추는 사람에게 조바심을 낸다.',
        '압박을 받을 때, 주도권을 유지하려고 현실적이지 않은 양을 떠맡는다.',
        '압박을 받을 때, 결정하지 못하고 계속 분석만 한다.',
        '스트레스를 받으면, 지금 방식이 실패하고 있어도 변화에 저항한다.',
        '압박을 받을 때, 자원·주도권·정보를 꽉 움켜쥔다.',
        '압박을 받을 때, 갈등을 피하려고 자신의 입장을 바꾼다.',
        '스트레스를 받으면, 속으로는 동의하지 않아도 겉으로는 맞장구친다.',
        '압박을 받을 때, 남에게 맞추다가 자신의 우선순위를 놓친다.',
      ],
      dimensions: {
        'supporting-fav': { label: '지지', groupLabel: '지지·베풂형', title: '지지·베풂형', summary: '최상의 상태일 때, 당신은 신뢰·봉사·높은 이상을 앞세워 남의 성공을 돕고 일을 원칙에 맞는 기준으로 지킵니다.', strengths: ['남을 돕고 키우기', '충실함과 신뢰', '높은 이상을 향해 일하기'], growth: ['과도한 베풂을 절제하기: 소진되기 전에 자신의 필요를 말하기', '남의 필요만이 아니라 자신의 우선순위도 말하기'] },
        'supporting-str': { label: '지지(스트레스)', groupLabel: '지지·베풂형', title: '스트레스 상황의 지지·베풂형', summary: '압박을 받으면 베풂이 자기희생으로 기웁니다. 지나치게 신뢰하거나 선의를 거듭 설명하거나, 소진될 때까지 남을 앞세울 수 있습니다.', overdone: ['소진될 만큼의 자기희생', '너무 쉽게 양보하거나 믿음', '결정 대신 훈계로 흐름'] },
        'controlling-fav': { label: '주도', groupLabel: '주도·추진형', title: '주도·추진형', summary: '최상의 상태일 때, 당신은 기회를 잡고 방향을 정하며 결과로 빠르게 밀고 나갑니다. 남이 피하는 책임을 떠맡습니다.', strengths: ['먼저 나서기', '불확실함 속에서 결정하기', '결과 만들기'], growth: ['가속하기 전에 듣고 이견을 청하기', '혼자 떠안지 말고 책임을 위임하기'] },
        'controlling-str': { label: '주도(스트레스)', groupLabel: '주도·추진형', title: '스트레스 상황의 주도·추진형', summary: '압박을 받으면 추진력이 통제로 굳습니다. 밀어붙이거나 남을 건너뛰거나, 의견이 끼어들 수 없을 만큼 빨리 움직일 수 있습니다.', overdone: ['위압적이거나 강압적', '느린 상대에게 조급함', '과신하고 과도하게 떠맡음'] },
        'conserving-fav': { label: '신중', groupLabel: '신중·보존형', title: '신중·보존형', summary: '최상의 상태일 때, 당신은 분석하고 체계를 세우며 품질을 지킵니다. 근거에 따라 신중히 결정하고 자원을 아낍니다.', strengths: ['분석과 엄밀함', '일관성과 품질', '신중한 위험 관리'], growth: ['결정 기한을 두어 분석을 행동으로 바꾸기', '현상 유지 대신 작게 시험하기'] },
        'conserving-str': { label: '신중(스트레스)', groupLabel: '신중·보존형', title: '스트레스 상황의 신중·보존형', summary: '압박을 받으면 신중함이 경직으로 바뀝니다. 지나치게 분석하거나 유익한 변화에 저항하거나, 자원과 주도권을 너무 꽉 쥘 수 있습니다.', overdone: ['결정 시점을 놓칠 만큼 분석함', '경직되어 변화를 거부함', '자원이나 정보를 움켜쥠'] },
        'adapting-fav': { label: '유연', groupLabel: '유연·조율형', title: '유연·조율형', summary: '최상의 상태일 때, 당신은 사람을 읽고 유연하게 대응하며 현실적인 공통점을 찾습니다. 관계와 선택지를 계속 움직입니다.', strengths: ['사람과 맥락 읽기', '유연함과 재치', '합의 이끌어 내기'], growth: ['유연한 선택을 양보할 수 없는 몇 가지 우선순위에 묶기', '조화를 깨더라도 해야 할 말을 하기'] },
        'adapting-str': { label: '유연(스트레스)', groupLabel: '유연·조율형', title: '스트레스 상황의 유연·조율형', summary: '압박을 받으면 적응이 비위 맞추기로 기웁니다. 입장을 바꾸거나 갈등을 피하거나, 너무 맞추다가 자신의 주장을 잃을 수 있습니다.', overdone: ['일관성 없이 지나치게 맞춤', '필요한 갈등을 피함', '남을 맞추다 자신의 우선순위를 잃음'] },
      },
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
    intro: translated?.intro || (test.intro ? description : test.intro),
    notice: translated?.notice || test.notice,
    description,
    categoryLabel: category,
    questions: localizedQuestions,
    dimensions: localizedDimensions,
    searchText: `${test.searchText || ''} ${title} ${description || ''}`.toLowerCase(),
  };
}

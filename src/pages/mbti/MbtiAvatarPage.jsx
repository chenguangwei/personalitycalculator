import React, { useEffect, useMemo, useState } from 'react';
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
import { localizeAvatarType, MBTI_AVATAR_IMAGES, MBTI_AVATAR_TYPES } from './mbtiAvatarData.js';
import { TYPE_PROFILES } from './mbtiData.js';

const PAGE_COPY = {
  zh: {
    metaTitle: 'MBTI 16 型头像与人格形象分析 | INFP、INTJ、ENFP 等',
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
    metaTitle: 'MBTI 16-Type Avatar and Personality Image Analysis | INFP, INTJ, ENFP and More',
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
  ja: {
    metaTitle: 'MBTI 16タイプのアバターと性格イメージ分析 | INFP、INTJ、ENFP ほか',
    brand: 'MBTIアバターカード',
    brandSub: '16タイプをビジュアルで理解する',
    back: 'MBTI診断へ戻る',
    title: 'MBTIアバターを選ぶ：16タイプのビジュアルと分析',
    intro:
      'このページでは16タイプを見て理解できるアバターに分解しています。各タイプには女性版と男性版があり、選ぶと見た目の表現、タイプ分析、強み、回答傾向を確認できます。',
    start: '現在のタイプを見る',
    allTypes: '16タイプを見る',
    spotlight: (type) => `${type} アバターとタイプ分析`,
    spotlightBody:
      'どのタイプから入っても、まず自分に対応するビジュアル表現を見て、そのあと文章による分析を読める構成です。女性版と男性版は同じ性格パターンの2つの外的表現であり、別の結果ではありません。',
    feminine: '女性版',
    masculine: '男性版',
    choose: 'この版を見る',
    selected: '表示中',
    selectedTitle: '現在のタイプ詳細',
    selectedBody: 'この画像はタイプ詳細カードの入口として使えます。ユーザーはまず雰囲気を感じ取り、その後に解釈文や回答傾向と照らし合わせます。',
    typeGrid: '16タイプアバターライブラリ',
    typeGridBody: '任意のタイプまたはアバターをクリックすると、そのタイプの詳細へ切り替わります。リンクは診断ページへ戻らず、タイプ分析を開きます。',
    visualCues: 'ビジュアルの手がかり',
    cardUse: 'タイプ表現',
    reflection: '自己照合のヒント',
    answerPattern: '回答傾向',
    detailCta: (type) => `${type} の詳細を見る`,
    strength: '主な強み',
    growth: '成長のヒント',
    contentModel: 'これらの画像はMBTI分析カードに使えますか？',
    contentBody:
      '使えます。画像をカード情報設計の一部として扱うのがおすすめです。最初に雰囲気を作り、次に性格の動機を説明し、最後に強み、盲点、内省質問へ落とし込みます。',
    contentItems: [
      ['画像', '服装、姿勢、小物、場面で性格の雰囲気を一目で伝えます。'],
      ['分析', 'そのタイプがなぜ選び、行動し、感情を表現するのかを説明します。'],
      ['行動', '結果を成長のヒント、関係での伝え方、キャリア傾向、自己質問へつなげます。'],
    ],
    sourceNote: '画像は imagegen で生成し、プロジェクト内の32枚のアセットに分割しています。',
  },
  ko: {
    metaTitle: 'MBTI 16가지 아바타와 성격 이미지 분석 | INFP, INTJ, ENFP 등',
    brand: 'MBTI 아바타 카드',
    brandSub: '시각적으로 이해하는 16가지 성격',
    back: 'MBTI 테스트로 돌아가기',
    title: '나의 MBTI 성격 이미지 선택: 16가지 아바타와 분석',
    intro:
      '이 페이지는 16가지 성격을 눈으로 이해할 수 있는 아바타로 나눕니다. 각 유형에는 여성 버전과 남성 버전이 있으며, 선택하면 시각적 표현, 유형 분석, 강점, 응답 경향을 볼 수 있습니다.',
    start: '현재 유형 보기',
    allTypes: '16가지 유형 보기',
    spotlight: (type) => `${type} 아바타와 유형 분석`,
    spotlightBody:
      '어떤 유형으로 들어와도 먼저 자신에게 맞는 이미지 표현을 보고, 이어서 텍스트 분석을 읽을 수 있어야 합니다. 여성/남성 버전은 같은 성격 패턴의 두 가지 외적 표현이며 결과 자체를 바꾸지 않습니다.',
    feminine: '여성 버전',
    masculine: '남성 버전',
    choose: '이 버전 보기',
    selected: '현재 표시',
    selectedTitle: '현재 유형 상세',
    selectedBody: '이 이미지는 유형 상세 카드의 시각적 입구로 사용할 수 있습니다. 사용자는 먼저 분위기를 느끼고, 이후 해석 문장과 응답 경향을 비교합니다.',
    typeGrid: '16가지 아바타 라이브러리',
    typeGridBody: '아무 유형이나 아바타를 클릭하면 해당 유형의 상세 분석으로 전환됩니다. 링크는 테스트 페이지로 돌아가지 않고 유형 분석을 엽니다.',
    visualCues: '시각 단서',
    cardUse: '유형 표현',
    reflection: '자기 대조 단서',
    answerPattern: '응답 경향',
    detailCta: (type) => `${type} 상세 보기`,
    strength: '핵심 강점',
    growth: '성장 팁',
    contentModel: '이 이미지를 MBTI 분석 카드에 넣을 수 있나요?',
    contentBody:
      '가능합니다. 이미지를 카드 정보 구조의 일부로 사용하는 것이 좋습니다. 먼저 분위기를 만들고, 다음으로 성격 동기를 설명하며, 마지막에 강점, 맹점, 자기 질문으로 연결합니다.',
    contentItems: [
      ['이미지', '의상, 자세, 소품, 장면으로 성격 분위기를 첫눈에 전달합니다.'],
      ['분석', '이 유형이 왜 선택하고 행동하며 감정을 표현하는지 설명합니다.'],
      ['행동', '결과를 성장 팁, 관계 소통, 직업 선호, 자기 질문으로 연결합니다.'],
    ],
    sourceNote: '이미지는 imagegen으로 생성했고 프로젝트 안의 32개 리소스로 분리했습니다.',
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
  ja: {
    I: '静かな回復、深い一対一の会話、参加前の観察に共感しやすい傾向があります。',
    E: '人との交流でエネルギーを得る、場を始める、考えながら話すことに共感しやすい傾向があります。',
    N: 'パターン、未来の可能性、抽象的な考え、広い関連づけに共感しやすい傾向があります。',
    S: '具体的な事実、実体験、明確な手順、検証できる例に共感しやすい傾向があります。',
    T: '論理優先、客観基準、直接的な指摘、一貫した原則に共感しやすい傾向があります。',
    F: '価値観、感情への影響、調和、支援的なフィードバックに共感しやすい傾向があります。',
    J: '事前計画、明確な期限、タスク完了、安定した構造に共感しやすい傾向があります。',
    P: '選択肢を残す、即興、変化、柔軟な進め方に共感しやすい傾向があります。',
  },
  ko: {
    I: '조용한 회복, 깊은 1:1 대화, 먼저 관찰한 뒤 표현하는 방식에 공감하기 쉽습니다.',
    E: '사람들과의 상호작용에서 에너지를 얻고, 먼저 논의를 시작하며, 생각을 말로 풀어내는 데 공감하기 쉽습니다.',
    N: '패턴, 미래 가능성, 추상 개념, 넓은 연결에 공감하기 쉽습니다.',
    S: '구체적 사실, 실제 경험, 명확한 단계, 검증 가능한 사례에 공감하기 쉽습니다.',
    T: '논리 우선, 객관 기준, 직접적인 문제 제기, 일관된 원칙에 공감하기 쉽습니다.',
    F: '가치감, 감정적 영향, 관계 조화, 지지적인 피드백에 공감하기 쉽습니다.',
    J: '사전 계획, 명확한 기한, 업무 마무리, 안정된 구조에 공감하기 쉽습니다.',
    P: '선택지를 열어두기, 즉흥 조정, 변화 탐색, 유연한 진행에 공감하기 쉽습니다.',
  },
};

function getAnswerTendencies(type, locale) {
  const copy = ANSWER_TENDENCIES[locale] || ANSWER_TENDENCIES.en;
  return type.split('').map((letter) => `${letter}: ${copy[letter]}`);
}

const PROFILE_TRANSLATIONS = {
  zh: {
    INTJ: {
      strengths: ['系统思维', '战略专注', '独立解决问题'],
      growth: ['更早分享你的推理过程', '行动前确认情绪影响'],
    },
    INTP: {
      strengths: ['原创分析', '概念深度', '冷静排障'],
      growth: ['不要无限打磨，先完成', '把想法转成可执行的下一步'],
    },
    ENTJ: {
      strengths: ['领导力', '执行清晰度', '长期规划'],
      growth: ['更早邀请反对意见', '用耐心平衡效率'],
    },
    ENTP: {
      strengths: ['创意解决问题', '说服力', '适应力'],
      growth: ['承诺进入执行', '避免只为新鲜感争辩'],
    },
    INFJ: {
      strengths: ['模式洞察', '共情', '有目的的规划'],
      growth: ['直接说出需求', '避免独自承担太多'],
    },
    INFP: {
      strengths: ['创造性共情', '价值清晰', '个体支持'],
      growth: ['用结构保护理想', '退缩前先寻求反馈'],
    },
    ENFJ: {
      strengths: ['指导他人', '沟通', '群体对齐'],
      growth: ['让别人拥有自己的选择', '保护个人边界'],
    },
    ENFP: {
      strengths: ['发想能力', '建立关系', '乐观感'],
      growth: ['优先处理更少项目', '建立持续跟进仪式'],
    },
    ISTJ: {
      strengths: ['可靠', '准确', '流程纪律'],
      growth: ['给新方法留空间', '表达自己的弹性'],
    },
    ISFJ: {
      strengths: ['忠诚支持', '细节记忆', '服务意识'],
      growth: ['请求认可和帮助', '避免安静地过度承诺'],
    },
    ESTJ: {
      strengths: ['组织力', '责任感', '决策速度'],
      growth: ['先倾听再优化', '让规则适配情境'],
    },
    ESFJ: {
      strengths: ['团队照料', '可靠', '社交觉察'],
      growth: ['把认可和自我价值分开', '欢迎不传统的选择'],
    },
    ISTP: {
      strengths: ['战术技能', '危机冷静', '机械推理'],
      growth: ['解释你的处理过程', '高风险场景更早计划'],
    },
    ISFP: {
      strengths: ['审美感', '适应力', '安静共情'],
      growth: ['说清长期目标', '冲突积累前先处理'],
    },
    ESTP: {
      strengths: ['行动偏好', '谈判', '实时解决问题'],
      growth: ['为后果放慢一点', '为他人记录决策'],
    },
    ESFP: {
      strengths: ['临场感', '鼓励他人', '灵活执行'],
      growth: ['为未来取舍做计划', '保护注意力不被分散'],
    },
  },
  ja: {
    INTJ: { strengths: ['システム思考', '戦略的集中', '独立した問題解決'], growth: ['推論をもっと早く共有する', '行動前に感情面の影響を確認する'] },
    INTP: { strengths: ['独自の分析', '概念の深さ', '冷静なトラブル対応'], growth: ['終わりなく磨く前に完了させる', 'アイデアを実用的な次の一歩に変える'] },
    ENTJ: { strengths: ['リーダーシップ', '実行の明確さ', '長期計画'], growth: ['反対意見を早めに招く', '効率と忍耐のバランスを取る'] },
    ENTP: { strengths: ['創造的な問題解決', '説得力', '適応力'], growth: ['実行にコミットする', '新しさだけの議論を避ける'] },
    INFJ: { strengths: ['パターン洞察', '共感', '目的ある計画'], growth: ['必要なことを直接伝える', '一人で抱えすぎない'] },
    INFP: { strengths: ['創造的な共感', '価値観の明確さ', '個別支援'], growth: ['構造で理想を守る', '引く前にフィードバックを求める'] },
    ENFJ: { strengths: ['メンタリング', 'コミュニケーション', '集団の方向づけ'], growth: ['他人に自分の選択を持たせる', '個人の境界線を守る'] },
    ENFP: { strengths: ['発想力', '関係構築', '楽観性'], growth: ['取り組む数を絞る', '継続の習慣を作る'] },
    ISTJ: { strengths: ['信頼性', '正確さ', 'プロセス規律'], growth: ['新しい方法の余地を残す', '柔軟さを伝える'] },
    ISFJ: { strengths: ['忠実な支援', '細部の記憶', '奉仕の姿勢'], growth: ['承認と助けを求める', '静かに抱え込みすぎない'] },
    ESTJ: { strengths: ['組織力', '責任感', '判断の速さ'], growth: ['最適化の前に聞く', 'ルールを文脈に合わせる'] },
    ESFJ: { strengths: ['チームケア', '信頼性', '社交的な気づき'], growth: ['承認と自己価値を分ける', '型にはまらない選択を歓迎する'] },
    ISTP: { strengths: ['戦術的スキル', '危機時の冷静さ', '機械的推論'], growth: ['プロセスを説明する', '重要な場面では早めに計画する'] },
    ISFP: { strengths: ['美的感覚', '適応力', '静かな共感'], growth: ['長期目標を言葉にする', '衝突が積もる前に扱う'] },
    ESTP: { strengths: ['行動力', '交渉力', 'リアルタイムの問題解決'], growth: ['結果を考えるために少し減速する', '他人のために決定を記録する'] },
    ESFP: { strengths: ['存在感', '励まし', '柔軟な実行'], growth: ['未来の取捨選択を計画する', '注意力を散らさないよう守る'] },
  },
  ko: {
    INTJ: { strengths: ['시스템 사고', '전략적 집중', '독립적 문제 해결'], growth: ['추론을 더 일찍 공유하기', '행동 전 감정적 영향을 확인하기'] },
    INTP: { strengths: ['독창적 분석', '개념적 깊이', '침착한 문제 해결'], growth: ['끝없이 다듬기 전에 완료하기', '아이디어를 실제 다음 단계로 바꾸기'] },
    ENTJ: { strengths: ['리더십', '실행 명확성', '장기 계획'], growth: ['반대 의견을 더 일찍 초대하기', '효율과 인내의 균형 맞추기'] },
    ENTP: { strengths: ['창의적 문제 해결', '설득력', '적응력'], growth: ['실행에 약속하기', '새로움만을 위한 논쟁 피하기'] },
    INFJ: { strengths: ['패턴 통찰', '공감', '목적 있는 계획'], growth: ['필요를 직접 말하기', '혼자 너무 많이 떠안지 않기'] },
    INFP: { strengths: ['창의적 공감', '가치 명확성', '개별 지원'], growth: ['구조로 이상을 보호하기', '물러나기 전에 피드백 요청하기'] },
    ENFJ: { strengths: ['멘토링', '소통', '그룹 정렬'], growth: ['다른 사람이 자기 선택을 갖게 하기', '개인 경계 지키기'] },
    ENFP: { strengths: ['아이디어 발상', '관계 형성', '낙관성'], growth: ['프로젝트 수를 줄여 우선순위 정하기', '지속 실행 의식 만들기'] },
    ISTJ: { strengths: ['신뢰성', '정확성', '프로세스 규율'], growth: ['새로운 방식의 여지 남기기', '유연성을 표현하기'] },
    ISFJ: { strengths: ['충실한 지원', '세부 기억', '서비스 마인드'], growth: ['인정과 도움 요청하기', '조용히 과도하게 약속하지 않기'] },
    ESTJ: { strengths: ['조직력', '책임감', '결정 속도'], growth: ['최적화 전에 듣기', '규칙을 맥락에 맞추기'] },
    ESFJ: { strengths: ['팀 돌봄', '신뢰성', '사회적 인식'], growth: ['인정과 자기 가치를 분리하기', '색다른 선택도 환영하기'] },
    ISTP: { strengths: ['전술적 기술', '위기 속 침착함', '기계적 추론'], growth: ['처리 과정을 설명하기', '중요한 일은 더 일찍 계획하기'] },
    ISFP: { strengths: ['미적 감각', '적응력', '조용한 공감'], growth: ['장기 목표를 말로 정리하기', '갈등이 쌓이기 전에 다루기'] },
    ESTP: { strengths: ['행동력', '협상력', '실시간 문제 해결'], growth: ['결과를 위해 잠시 속도 낮추기', '다른 사람을 위해 결정 기록하기'] },
    ESFP: { strengths: ['존재감', '격려', '유연한 실행'], growth: ['미래의 선택과 포기를 계획하기', '주의가 흩어지지 않게 보호하기'] },
  },
};

function getProfileCopy(type, locale) {
  return PROFILE_TRANSLATIONS[locale]?.[type];
}

export function MbtiAvatarPage() {
  const [locale, setLocale] = useState(detectLocale);
  const [selectedType, setSelectedType] = useState(getInitialType);
  const [selectedGender, setSelectedGender] = useState('female');
  const copy = getCopy(locale);
  const selectedBase = useMemo(
    () => MBTI_AVATAR_TYPES.find((item) => item.type === selectedType) || MBTI_AVATAR_TYPES[0],
    [selectedType],
  );
  const selected = useMemo(() => localizeAvatarType(selectedBase, locale), [selectedBase, locale]);
  const selectedProfile = TYPE_PROFILES[selected.type];
  const localizedProfile = getProfileCopy(selected.type, locale) || selectedProfile;

  useEffect(() => {
    syncLocale(locale);
    document.title = copy.metaTitle;
  }, [copy.metaTitle, locale]);

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
          <SelectedAnalysis copy={copy} locale={locale} selected={selected} selectedGender={selectedGender} profile={localizedProfile} />
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
              item={localizeAvatarType(item, locale)}
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

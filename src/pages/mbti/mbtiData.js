export const MBTI_DIMENSIONS = {
  EI: {
    uiName: 'Energy',
    methodName: 'Extraversion vs. Introversion',
    left: 'E',
    right: 'I',
    leftLabel: 'Extraversion',
    rightLabel: 'Introversion',
    color: '#2f74ef',
  },
  SN: {
    uiName: 'Mind',
    methodName: 'Sensing vs. Intuition',
    left: 'S',
    right: 'N',
    leftLabel: 'Sensing',
    rightLabel: 'Intuition',
    color: '#8257e9',
  },
  TF: {
    uiName: 'Nature',
    methodName: 'Thinking vs. Feeling',
    left: 'T',
    right: 'F',
    leftLabel: 'Thinking',
    rightLabel: 'Feeling',
    color: '#30ac8f',
  },
  JP: {
    uiName: 'Tactics',
    methodName: 'Judging vs. Prospecting',
    left: 'J',
    right: 'P',
    leftLabel: 'Judging',
    rightLabel: 'Prospecting',
    color: '#ff8a22',
  },
  AT: {
    uiName: 'Identity',
    methodName: 'Assertive vs. Turbulent',
    left: 'A',
    right: 'T',
    leftLabel: 'Assertive',
    rightLabel: 'Turbulent',
    color: '#f04f6d',
  },
};

const ei = [
  ['You enjoy spending time in large social gatherings.', 'E'],
  ['After a busy week, you usually need quiet time before seeing people again.', 'I'],
  ['You often think out loud when solving a problem.', 'E'],
  ['You prefer deep one-on-one conversations over group discussions.', 'I'],
  ['Meeting new people usually gives you energy.', 'E'],
  ['You tend to observe first before joining a conversation.', 'I'],
  ['You are comfortable being the person who starts a group activity.', 'E'],
  ['You can go a long time without much social contact and feel fine.', 'I'],
  ['You usually share news or ideas as soon as they happen.', 'E'],
  ['You often process your thoughts privately before speaking.', 'I'],
  ['Fast-moving social environments feel exciting to you.', 'E'],
  ['You prefer a calm setting with a few familiar people.', 'I'],
];

const sn = [
  ['You trust concrete facts more than theories or hunches.', 'S'],
  ['You quickly notice patterns and hidden meanings in information.', 'N'],
  ['You prefer instructions that are practical and specific.', 'S'],
  ['You enjoy discussing future possibilities more than present details.', 'N'],
  ['You remember exact details from past experiences.', 'S'],
  ['You are drawn to abstract concepts and symbolic ideas.', 'N'],
  ['You would rather improve a proven method than invent a new one.', 'S'],
  ['You often imagine several ways a situation could unfold.', 'N'],
  ['You value examples that can be tested in the real world.', 'S'],
  ['You like connecting unrelated ideas into a bigger picture.', 'N'],
  ['You prefer step-by-step learning over open-ended exploration.', 'S'],
  ['You get bored when a task has no room for creative interpretation.', 'N'],
];

const tf = [
  ['When deciding, you prioritize logic even if the choice feels uncomfortable.', 'T'],
  ['You naturally consider how a decision will affect people emotionally.', 'F'],
  ['You find it easy to critique an idea without taking it personally.', 'T'],
  ['Harmony in a group matters strongly to you.', 'F'],
  ['You prefer clear principles over case-by-case exceptions.', 'T'],
  ['You often sense what others need before they say it directly.', 'F'],
  ['In disagreement, accuracy matters more to you than tact.', 'T'],
  ['You try to phrase feedback so the other person feels supported.', 'F'],
  ['You are comfortable making tough calls from objective criteria.', 'T'],
  ['You often make choices based on personal values and empathy.', 'F'],
  ['You respect people who can detach from emotion during analysis.', 'T'],
  ['You believe a good solution should preserve trust and morale.', 'F'],
];

const jp = [
  ['You like having a clear plan before starting important work.', 'J'],
  ['You prefer keeping options open until the last practical moment.', 'P'],
  ['Deadlines are easier when you finish well ahead of time.', 'J'],
  ['You adapt plans easily when something more interesting appears.', 'P'],
  ['A tidy schedule helps you feel in control.', 'J'],
  ['You dislike being locked into a rigid routine.', 'P'],
  ['You usually decide quickly once you have enough information.', 'J'],
  ['You enjoy improvising and figuring things out as you go.', 'P'],
  ['You feel better when tasks are completed and checked off.', 'J'],
  ['You often work in bursts close to a deadline.', 'P'],
  ['You prefer clear expectations and defined responsibilities.', 'J'],
  ['Unexpected changes can make a project more energizing for you.', 'P'],
];

const at = [
  ['You stay calm and confident even when your work is criticized.', 'A'],
  ['You often replay mistakes in your mind after they happen.', 'T'],
  ['You trust your ability to handle uncertainty.', 'A'],
  ['You worry that you could have done better even after success.', 'T'],
  ['Pressure rarely shakes your confidence for long.', 'A'],
  ['You are sensitive to signs that others may be disappointed in you.', 'T'],
  ['You can move on quickly after an awkward moment.', 'A'],
  ['You often compare your progress with other people’s progress.', 'T'],
  ['You usually feel secure in the direction you choose.', 'A'],
  ['Small setbacks can affect your mood for longer than you expect.', 'T'],
  ['You are comfortable presenting yourself without much second-guessing.', 'A'],
  ['You often use self-doubt as motivation to improve.', 'T'],
];

export const MBTI_QUESTIONS = [ei, sn, tf, jp, at]
  .flatMap((items, dimensionIndex) =>
    items.map(([text, positive], index) => ({
      id: `${['EI', 'SN', 'TF', 'JP', 'AT'][dimensionIndex]}-${index + 1}`,
      text,
      dimension: ['EI', 'SN', 'TF', 'JP', 'AT'][dimensionIndex],
      positive,
    })),
  )
  .sort((a, b) => {
    const dimensionOrder = ['EI', 'SN', 'TF', 'JP', 'AT'];
    const ai = Number(a.id.split('-')[1]);
    const bi = Number(b.id.split('-')[1]);
    return ai === bi ? dimensionOrder.indexOf(a.dimension) - dimensionOrder.indexOf(b.dimension) : ai - bi;
  });

export const TYPE_PROFILES = {
  INTJ: {
    title: 'The Strategist',
    summary: 'Independent, analytical, and future-focused. You tend to build long-range systems and improve them until they work.',
    strengths: ['Systems thinking', 'Strategic focus', 'Independent problem solving'],
    growth: ['Share your reasoning earlier', 'Check emotional impact before acting'],
    careers: ['Product strategy', 'Research', 'Engineering architecture', 'Data science'],
  },
  INTP: {
    title: 'The Analyst',
    summary: 'Curious, precise, and idea-driven. You enjoy breaking concepts apart and finding the underlying logic.',
    strengths: ['Original analysis', 'Conceptual depth', 'Calm troubleshooting'],
    growth: ['Finish before endlessly refining', 'Translate ideas into practical next steps'],
    careers: ['Software engineering', 'Research', 'Systems design', 'Technical writing'],
  },
  ENTJ: {
    title: 'The Commander',
    summary: 'Decisive, organized, and ambitious. You naturally align people and resources around a clear objective.',
    strengths: ['Leadership', 'Operational clarity', 'Long-range planning'],
    growth: ['Invite dissent earlier', 'Balance efficiency with patience'],
    careers: ['Management', 'Entrepreneurship', 'Operations', 'Consulting'],
  },
  ENTP: {
    title: 'The Debater',
    summary: 'Inventive, quick, and possibility-oriented. You enjoy testing ideas and finding sharper ways forward.',
    strengths: ['Creative problem solving', 'Persuasion', 'Adaptability'],
    growth: ['Commit to execution', 'Avoid arguing only for novelty'],
    careers: ['Startups', 'Strategy', 'Product discovery', 'Marketing'],
  },
  INFJ: {
    title: 'The Advocate',
    summary: 'Insightful, values-led, and quietly determined. You often see people’s potential and the systems around them.',
    strengths: ['Pattern insight', 'Empathy', 'Purposeful planning'],
    growth: ['State needs directly', 'Avoid carrying too much alone'],
    careers: ['Counseling', 'UX research', 'Writing', 'Education'],
  },
  INFP: {
    title: 'The Mediator',
    summary: 'Imaginative, principled, and reflective. You care deeply about authenticity and meaningful work.',
    strengths: ['Creative empathy', 'Values clarity', 'Individual support'],
    growth: ['Use structure to protect ideals', 'Ask for feedback before withdrawing'],
    careers: ['Writing', 'Design', 'Nonprofit work', 'Coaching'],
  },
  ENFJ: {
    title: 'The Protagonist',
    summary: 'Warm, expressive, and motivating. You often help groups find shared direction and emotional momentum.',
    strengths: ['Mentorship', 'Communication', 'Group alignment'],
    growth: ['Let others own their choices', 'Protect personal boundaries'],
    careers: ['Leadership', 'Teaching', 'People operations', 'Community building'],
  },
  ENFP: {
    title: 'The Campaigner',
    summary: 'Energetic, imaginative, and people-centered. You bring enthusiasm to new ideas and human possibilities.',
    strengths: ['Ideation', 'Relationship building', 'Optimism'],
    growth: ['Prioritize fewer projects', 'Create follow-through rituals'],
    careers: ['Brand strategy', 'Creative direction', 'Coaching', 'Media'],
  },
  ISTJ: {
    title: 'The Logistician',
    summary: 'Reliable, practical, and detail-aware. You prefer clear standards and steady execution.',
    strengths: ['Dependability', 'Accuracy', 'Process discipline'],
    growth: ['Leave room for new approaches', 'Communicate flexibility when needed'],
    careers: ['Finance', 'Operations', 'Compliance', 'Project coordination'],
  },
  ISFJ: {
    title: 'The Defender',
    summary: 'Steady, caring, and observant. You notice practical needs and support people with consistency.',
    strengths: ['Loyal support', 'Detail memory', 'Service mindset'],
    growth: ['Ask for recognition and help', 'Avoid overcommitting quietly'],
    careers: ['Healthcare', 'Administration', 'Education', 'Customer success'],
  },
  ESTJ: {
    title: 'The Executive',
    summary: 'Direct, structured, and action-oriented. You turn goals into standards, roles, and measurable progress.',
    strengths: ['Organization', 'Accountability', 'Decision speed'],
    growth: ['Listen before optimizing', 'Adapt rules to context'],
    careers: ['Operations leadership', 'Sales management', 'Logistics', 'Public administration'],
  },
  ESFJ: {
    title: 'The Consul',
    summary: 'Social, responsible, and supportive. You create belonging through practical care and clear expectations.',
    strengths: ['Team care', 'Reliability', 'Social awareness'],
    growth: ['Separate approval from self-worth', 'Welcome unconventional choices'],
    careers: ['HR', 'Teaching', 'Events', 'Healthcare support'],
  },
  ISTP: {
    title: 'The Virtuoso',
    summary: 'Hands-on, calm, and independent. You learn by testing how things work in real conditions.',
    strengths: ['Tactical skill', 'Crisis calm', 'Mechanical reasoning'],
    growth: ['Explain your process', 'Plan before the last minute when stakes are high'],
    careers: ['Engineering', 'Security', 'Field operations', 'Product prototyping'],
  },
  ISFP: {
    title: 'The Adventurer',
    summary: 'Gentle, perceptive, and experience-led. You value personal freedom and work that feels real.',
    strengths: ['Aesthetic sense', 'Adaptability', 'Quiet empathy'],
    growth: ['Name long-term goals', 'Handle conflict before it builds'],
    careers: ['Design', 'Wellness', 'Craft work', 'Creative production'],
  },
  ESTP: {
    title: 'The Entrepreneur',
    summary: 'Bold, practical, and fast-moving. You read the room quickly and act when opportunities appear.',
    strengths: ['Action bias', 'Negotiation', 'Real-time problem solving'],
    growth: ['Slow down for consequences', 'Document decisions for others'],
    careers: ['Sales', 'Emergency response', 'Business development', 'Sports or events'],
  },
  ESFP: {
    title: 'The Entertainer',
    summary: 'Expressive, warm, and spontaneous. You bring energy to shared experiences and practical encouragement.',
    strengths: ['Presence', 'Encouragement', 'Adaptable execution'],
    growth: ['Plan for future tradeoffs', 'Protect focus from distractions'],
    careers: ['Hospitality', 'Performance', 'Customer experience', 'Training'],
  },
};

export function calculateMbtiResult(answers) {
  const scores = Object.fromEntries(
    Object.entries(MBTI_DIMENSIONS).map(([key, dimension]) => [
      key,
      { [dimension.left]: 0, [dimension.right]: 0, answered: 0 },
    ]),
  );

  MBTI_QUESTIONS.forEach((question) => {
    const answer = answers[question.id];
    if (!answer) return;
    const dimension = MBTI_DIMENSIONS[question.dimension];
    const opposite = question.positive === dimension.left ? dimension.right : dimension.left;
    scores[question.dimension][question.positive] += answer;
    scores[question.dimension][opposite] += 6 - answer;
    scores[question.dimension].answered += 1;
  });

  const dimensionResults = Object.fromEntries(
    Object.entries(MBTI_DIMENSIONS).map(([key, dimension]) => {
      const leftScore = scores[key][dimension.left];
      const rightScore = scores[key][dimension.right];
      const winner = leftScore >= rightScore ? dimension.left : dimension.right;
      const loser = winner === dimension.left ? dimension.right : dimension.left;
      const total = leftScore + rightScore || 1;
      return [
        key,
        {
          ...dimension,
          winner,
          loser,
          leftScore,
          rightScore,
          strength: Math.round((Math.max(leftScore, rightScore) / total) * 100),
          answered: scores[key].answered,
        },
      ];
    }),
  );

  const type = ['EI', 'SN', 'TF', 'JP'].map((key) => dimensionResults[key].winner).join('');
  const variant = dimensionResults.AT.winner;
  const profile = TYPE_PROFILES[type] || TYPE_PROFILES.INFJ;

  return {
    type,
    variant,
    fullType: `${type}-${variant}`,
    profile,
    dimensions: dimensionResults,
  };
}

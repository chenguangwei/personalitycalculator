import {
  Brain,
  BriefcaseBusiness,
  FileQuestion,
  Flame,
  Gamepad2,
  Heart,
  MessagesSquare,
  ShieldAlert,
  Smile,
  Sparkles,
  Star,
  Trophy,
  UsersRound,
  WandSparkles,
} from 'lucide-react';
import { GENERATED_TEST_CATALOG } from './generatedTestCatalog.js';

const ICON_BY_SLUG = {
  'love-language-test': Heart,
  'friendship-test': UsersRound,
  'introvert-vs-extrovert-test': UsersRound,
  'anime-personality-match': Star,
  'dark-triad-test': ShieldAlert,
  'career-personality-test': BriefcaseBusiness,
  'social-skills-test': MessagesSquare,
  'enneagram-test': WandSparkles,
  'big-5-personality-test': FileQuestion,
  'would-you-rather-personality-test': Trophy,
  'disc-personality-test': BriefcaseBusiness,
  'attachment-style-test': Heart,
  'emotional-intelligence-test': Brain,
  'communication-style-test': MessagesSquare,
  'conflict-style-test': UsersRound,
  'learning-style-test': FileQuestion,
  'leadership-style-test': Sparkles,
  'values-test': Flame,
  'work-style-test': BriefcaseBusiness,
  'stress-response-test': ShieldAlert,
};

const ICON_CLASS_BY_CATEGORY = {
  Popular: 'purple',
  Relationships: 'pink',
  Social: 'blue',
  Anime: 'orange',
  Games: 'aqua',
  Career: 'teal',
  Fun: 'violet',
};

const GENERIC_CATALOG = GENERATED_TEST_CATALOG.map((test) => ({
  title: test.title,
  description: test.description,
  category: test.category,
  searchText: `${test.title} ${test.description} ${test.category} ${test.searchText}`.toLowerCase(),
  icon: ICON_BY_SLUG[test.slug] || FileQuestion,
  iconClass: ICON_CLASS_BY_CATEGORY[test.category] || 'purple',
  time: test.time,
  questions: test.questions,
  href: test.href,
}));

export const TESTS = [
  {
    title: 'MBTI Test',
    description: 'Discover your 16 personality type with a complete 60-question assessment.',
    category: 'Popular',
    icon: Brain,
    iconClass: 'purple',
    time: '12-15 min',
    questions: 60,
    href: '/mbti-personality-test.html',
    searchText: 'mbti test 16 personality type introversion extraversion intuition sensing thinking feeling judging perceiving assertive turbulent strengths careers',
  },
  {
    title: 'Tomodachi Life Personality Calculator',
    description: 'Get your unique Tomodachi Life personality and shareable profile card.',
    category: 'Games',
    icon: Smile,
    iconClass: 'aqua',
    time: '10 min',
    questions: 20,
    href: '/tomodachi-life-personality-calculator.html',
    searchText: 'tomodachi life personality calculator easygoing outgoing confident independent relaxed energetic mii game personality profile',
  },
  ...GENERIC_CATALOG,
];

export const CATEGORIES = [
  { label: 'Popular', icon: Flame },
  { label: 'Games', icon: Gamepad2 },
  { label: 'Relationships', icon: Heart },
  { label: 'Social', icon: UsersRound },
  { label: 'Career', icon: BriefcaseBusiness },
  { label: 'Fun', icon: Smile },
  { label: 'Anime', icon: Sparkles },
];

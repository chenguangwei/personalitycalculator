import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { COMMON_COPY, detectLocale } from './i18n.js';

const HomePage = lazy(() => import('./pages/home/HomePage.jsx').then((module) => ({ default: module.HomePage })));
const MbtiPage = lazy(() => import('./pages/mbti/MbtiPage.jsx').then((module) => ({ default: module.MbtiPage })));
const MbtiAvatarPage = lazy(() =>
  import('./pages/mbti/MbtiAvatarPage.jsx').then((module) => ({ default: module.MbtiAvatarPage })),
);
const GenericTestPage = lazy(() =>
  import('./pages/quiz/GenericTestPage.jsx').then((module) => ({ default: module.GenericTestPage })),
);
const TomodachiPage = lazy(() =>
  import('./pages/tomodachi/TomodachiPage.jsx').then((module) => ({ default: module.TomodachiPage })),
);

function PageShell({ children }) {
  const copy = COMMON_COPY[detectLocale()] || COMMON_COPY.en;
  return <Suspense fallback={<main className="route-loading">{copy.loadingTitle}...</main>}>{children}</Suspense>;
}

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const pageSlug = pathname === '/' ? '' : pathname.replace(/^\//, '').replace(/\.html$/, '');

  if (pageSlug === 'mbti-personality-test') return <PageShell><MbtiPage /></PageShell>;
  if (pageSlug === 'which-infp-avatar-represents-you') return <PageShell><MbtiAvatarPage /></PageShell>;
  if (pageSlug === 'tomodachi-life-personality-calculator') return <PageShell><TomodachiPage /></PageShell>;
  if (pageSlug && !pageSlug.includes('/')) return <PageShell><GenericTestPage slug={pageSlug} /></PageShell>;
  return <PageShell><HomePage /></PageShell>;
}

const rootElement = document.getElementById('root');
globalThis.__personalityCalculatorRoot ||= createRoot(rootElement);
globalThis.__personalityCalculatorRoot.render(<App />);

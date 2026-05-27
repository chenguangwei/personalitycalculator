import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { cloudflare } from "@cloudflare/vite-plugin";
import { GENERIC_TESTS } from './src/pages/quiz/genericTestData.js';

const STATIC_PAGES = [
  {
    title: 'Personality Calculator',
    url: 'https://personalitycalculator.org/',
    description: 'Directory of free personality tests and calculators.',
    priority: '1.0',
  },
  {
    title: 'Free MBTI Personality Test',
    url: 'https://personalitycalculator.org/mbti-personality-test.html',
    description: 'Free MBTI-inspired 60-question personality test with type, variant, scores, strengths, growth tips, and career matches.',
    priority: '0.9',
  },
  {
    title: 'Tomodachi Life Personality Calculator',
    url: 'https://personalitycalculator.org/tomodachi-life-personality-calculator.html',
    description: 'Tomodachi Life personality calculator with US and UK/EU naming, trait values, random generation, and downloadable result cards.',
    priority: '0.9',
  },
  {
    title: 'MBTI 16-Type Avatar and Personality Image Analysis',
    url: 'https://personalitycalculator.org/which-infp-avatar-represents-you.html',
    description: 'A visual MBTI avatar card library with 32 generated avatar images, personality image analysis, and likely answer tendencies for all 16 types.',
    priority: '0.8',
  },
  {
    title: 'MBTI Card Draw',
    url: 'https://personalitycalculator.org/mbti-card-draw.html',
    description: 'Draw a same-type MBTI three-card spread for your core self, hidden power, and today’s signal.',
    priority: '0.8',
  },
];

function allPages() {
  return [
    ...STATIC_PAGES,
    ...GENERIC_TESTS.map((test) => ({
      title: test.title,
      url: `https://personalitycalculator.org/${test.slug}.html`,
      description: `${test.intro} Answer ${test.questions.length} questions and get instant scored results.`,
      priority: '0.8',
    })),
  ];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function replaceSeoHead(html, replacement) {
  const seoHeadPattern = /<title>[\s\S]*?<script type="application\/ld\+json">[\s\S]*?<\/script>/;
  if (!seoHeadPattern.test(html)) {
    throw new Error('Could not find SEO head block in built index.html');
  }
  return html.replace(seoHeadPattern, replacement);
}

function buildLastmod() {
  return (
    process.env.SITEMAP_LASTMOD ||
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date())
  );
}

function personalityTestHtmlPlugin() {
  let outDir = 'dist';

  return {
    name: 'personality-test-html-pages',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const indexPath = resolve(outDir, 'index.html');
      const indexHtml = readFileSync(indexPath, 'utf8');
      const pages = allPages();
      const homepageSchema = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': 'https://personalitycalculator.org/#website',
            name: 'Personality Calculator',
            url: 'https://personalitycalculator.org/',
            description: 'Free personality calculators and personality tests with instant, shareable results.',
            inLanguage: 'en',
          },
          {
            '@type': 'Organization',
            '@id': 'https://personalitycalculator.org/#organization',
            name: 'Personality Calculator',
            url: 'https://personalitycalculator.org/',
          },
          {
            '@type': 'CollectionPage',
            '@id': 'https://personalitycalculator.org/#collection',
            name: 'Free Personality Tests and Calculators',
            url: 'https://personalitycalculator.org/',
            isPartOf: {
              '@id': 'https://personalitycalculator.org/#website',
            },
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: pages.slice(1).map((page, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: page.title,
                url: page.url,
              })),
            },
          },
        ],
      };
      writeFileSync(
        indexPath,
        indexHtml.replace(
          /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
          `<script type="application/ld+json">${JSON.stringify(homepageSchema)}</script>`,
        ),
      );

      GENERIC_TESTS.forEach((test) => {
        const fileName = `${test.slug}.html`;
        const title = `${test.title} | Free Personality Test`;
        const description = `${test.intro} Answer ${test.questions.length} questions and get instant scored results.`;
        const url = `https://personalitycalculator.org/${fileName}`;
        const keywords = `${test.title}, free ${test.title.toLowerCase()}, ${test.category.toLowerCase()} personality test, personality calculator`;
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: test.title,
          url,
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Any',
          isAccessibleForFree: true,
          inLanguage: 'en',
          description,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        };
        const head = [
          `<title>${escapeHtml(title)}</title>`,
          `<meta name="description" content="${escapeHtml(description)}" />`,
          '<meta name="robots" content="index, follow, max-image-preview:large" />',
          `<meta name="keywords" content="${escapeHtml(keywords)}" />`,
          `<link rel="canonical" href="${escapeHtml(url)}" />`,
          `<meta property="og:title" content="${escapeHtml(test.title)}" />`,
          `<meta property="og:description" content="${escapeHtml(description)}" />`,
          '<meta property="og:site_name" content="Personality Calculator" />',
          '<meta property="og:type" content="website" />',
          `<meta property="og:url" content="${escapeHtml(url)}" />`,
          '<meta property="og:locale" content="en_US" />',
          '<meta name="twitter:card" content="summary_large_image" />',
          `<meta name="twitter:title" content="${escapeHtml(test.title)}" />`,
          `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
          '<meta name="theme-color" content="#6846ee" />',
          `<script type="application/ld+json">${JSON.stringify(schema)}</script>`,
        ].join('\n    ');

        const source = replaceSeoHead(indexHtml, head);
        mkdirSync(outDir, { recursive: true });
        writeFileSync(resolve(outDir, fileName), source);
      });

      const lastmod = buildLastmod();
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...pages.map((page) =>
          [
            '  <url>',
            `    <loc>${page.url}</loc>`,
            `    <lastmod>${lastmod}</lastmod>`,
            '    <changefreq>monthly</changefreq>',
            `    <priority>${page.priority}</priority>`,
            '  </url>',
          ].join('\n'),
        ),
        '</urlset>',
        '',
      ].join('\n');
      writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap);

      const llms = [
        '# Personality Calculator',
        '',
        'Personality Calculator provides free personality tests and calculators with instant, shareable results.',
        '',
        '## Pages',
        '',
        ...pages.map((page) => `- ${page.url} - ${page.description}`),
        '',
        '## Notes',
        '',
        '- Tests are free to use.',
        '- User answers stay in the browser unless the user chooses to share a result link or card.',
        '',
      ].join('\n');
      writeFileSync(resolve(outDir, 'llms.txt'), llms);
    },
  };
}

export default defineConfig({
  plugins: [react(), personalityTestHtmlPlugin(), cloudflare()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        mbti: resolve(__dirname, 'mbti-personality-test.html'),
        tomodachi: resolve(__dirname, 'tomodachi-life-personality-calculator.html'),
        mbtiAvatars: resolve(__dirname, 'which-infp-avatar-represents-you.html'),
        mbtiCardDraw: resolve(__dirname, 'mbti-card-draw.html'),
      },
    },
  },
});

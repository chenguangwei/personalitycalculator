import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        mbti: resolve(__dirname, 'mbti-personality-test.html'),
        tomodachi: resolve(__dirname, 'tomodachi-life-personality-calculator.html'),
      },
    },
  },
});
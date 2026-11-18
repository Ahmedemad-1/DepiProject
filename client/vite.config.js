// Vite config (from Velora): in a production build PurgeCSS removes the Bootstrap CSS that no
// file uses. Any new file that uses Bootstrap classes must live under ./src or ./index.html.
// If a Bootstrap class from a library/JS-added class disappears in the build, add it to `safelist`.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import purgeCSS from '@fullhuman/postcss-purgecss';

const purge = purgeCSS({ content: ['./index.html', './src/**/*.{js,jsx}'], safelist: ['active'] });

export default defineConfig(({ command }) => ({
  plugins: [react()],
  css: { postcss: { plugins: command === 'build' ? [purge] : [] } },
}));

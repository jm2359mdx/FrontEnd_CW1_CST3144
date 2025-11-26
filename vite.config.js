// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: '/FrontEnd_CW1_CST3144/', // <-- IMPORTANT: repo name path on GitHub Pages
  plugins: [vue()]
});

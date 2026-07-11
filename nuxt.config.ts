// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-10-30',

  app: {
    baseURL: process.env.BASE || '/',
    head: {
      title: 'Transformers',
    },
  },

  css: ['~/assets/css/main.css'],

  modules: ['@nuxtjs/tailwindcss', '@nuxt/ui'],

  vite: {
    define: {
      // patch for @iarna/toml
      'global.Date': 'window.Date',
    },
    optimizeDeps: {
      include: [
        '@codemirror/commands',
        '@codemirror/lang-html',
        '@codemirror/lang-json',
        '@codemirror/lang-yaml',
        '@codemirror/lint',
        '@codemirror/state',
        '@codemirror/theme-one-dark',
        '@codemirror/view',
        '@violentmonkey/shortcut',
        'codemirror',
        'expr-eval',
        'js-yaml',
        'otpauth',
        'qrcanvas-vue',
      ],
    },
  },
});

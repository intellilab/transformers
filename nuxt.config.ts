// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  ssr: false,
  app: {
    baseURL: process.env.BASE || '/',
    head: {
      title: 'Transformers',
    },
  },
  css: [
    '~/assets/css/default.css',
  ],
  postcss: {
    plugins: {
      'tailwindcss/nesting': {},
      tailwindcss: {},
    },
  },
  vite: {
    define: {
      // patch for @iarna/toml
      'global.Date': 'window.Date',
    },
  }
});

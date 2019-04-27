const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: 'spa',
  head: {
    title: 'Transformers',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
  },
  loading: { color: '#3B8070' },
  css: [
    'spectre.css/dist/spectre.css',
    'spectre.css/dist/spectre-icons.css',
    '~/css/default.css',
  ],
  plugins: [
    '~/plugins/error.js',
  ],
  modules: [
    '@nuxtjs/pwa',
  ],
  build: {
    postcss: {
      // Transform inline comments
      parser: require('postcss-scss'),
      plugins: [
        // Transform SCSS into CSS
        require('precss'),
      ],
    },
    extractCSS: isProd,
  },
  router: {
    base: process.env.BASE || '/',
  },
};

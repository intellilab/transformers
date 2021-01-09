const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  ssr: false,
  target: 'static',
  head: {
    title: 'Transformers',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
  },
  loading: { color: '#3B8070' },
  css: [
    '~/css/default.css',
  ],
  plugins: [
    { src: '~/plugins/error.js', ssr: false },
    { src: '~/plugins/analytics.js', ssr: false },
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
        // tailwind CSS
        require('tailwindcss')({
          purge: [
            './@(pages|components|layouts)/**/*.@(js|vue)',
          ],
        }),
      ],
    },
    extractCSS: isProd,
  },
  router: {
    base: process.env.BASE || '/',
  },
};

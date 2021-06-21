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
    '~/assets/css/default.css',
  ],
  plugins: [
    { src: '~/plugins/error.js', ssr: false },
    { src: '~/plugins/analytics.js', ssr: false },
  ],
  buildModules: ['@nuxtjs/tailwindcss'],
  modules: [
    '@nuxtjs/pwa',
  ],
  tailwindcss: {
    jit: true,
  },
  router: {
    base: process.env.BASE || '/',
  },
  build: {
    postcss: {
      plugins: {
        'postcss-nested': {},
      },
    },
  },
};

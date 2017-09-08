const IS_PRD = process.env.NODE_ENV === 'production';

module.exports = {
  head: {
    title: 'Transformers',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  loading: { color: '#3B8070' },
  css: [
    'spectre.css',
    '~/assets/default.css',
  ],
  build: {
    postcss: {
      // Transform inline comments
      parser: require('postcss-scss'),
      plugins: [
        require('autoprefixer'),
        // Transform SCSS into CSS
        require('precss'),
      ],
    },
  },
};

if (IS_PRD) {
  Object.assign(module.exports, {
    router: {
      base: '/transformers/',
    },
  });
  module.exports.build.extractCSS = true;
}

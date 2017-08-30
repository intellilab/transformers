const IS_PRD = process.env.NODE_ENV === 'production';

module.exports = {
  head: {
    title: 'Tools',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  loading: { color: '#3B8070' },
};

if (IS_PRD) {
  Object.assign(module.exports, {
    router: {
      base: '/tools/',
    },
  });
}

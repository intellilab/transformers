// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue/essential',
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            extensions: ['.js', '.vue'],
            alias: {
              '~': __dirname,
            },
          },
        },
      },
    },
  },
}

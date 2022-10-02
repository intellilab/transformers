// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    requireConfigFile: false,
  },
  env: {
    browser: true,
  },
  extends: [
    require.resolve('@gera2ld/plaid/eslint'),
    require.resolve('@gera2ld/plaid-common-vue/eslint'),
  ],
  settings: {
    'import/resolver': {
      'babel-module': {
        alias: {
          '~': __dirname,
        },
        extensions: ['.js', '.vue'],
      },
    },
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'vue/multi-word-component-names': 'off',
  },
}

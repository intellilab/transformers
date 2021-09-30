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
    'plugin:vue/essential',
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
    'import/extensions': ['error', {
      js: 'never',
      vue: 'never',
    }],
  },
}

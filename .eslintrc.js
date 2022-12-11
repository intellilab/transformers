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
    require.resolve('@gera2ld/plaid-common-vue/eslint/vue3-ts'),
  ],
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  rules: {
    'vue/multi-word-component-names': 'off',
  },
};

const { defaultOptions, isTest } = require('@gera2ld/plaid/util');

defaultOptions.alias = {
  ...defaultOptions.alias,
  '~': '.',
};

module.exports = {
  extends: require.resolve('@gera2ld/plaid/config/babelrc'),
  presets: [
    ['@babel/preset-env', {
      ...!isTest && {
        modules: false,
      },
      loose: true,
      targets: {
        node: 'current',
      },
    }],
  ],
};

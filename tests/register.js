const path = require('path');

require('@babel/register')({
  presets: [
    ['@babel/preset-env', {
      loose: true,
    }],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    ['module-resolver', {
      root: path.resolve('.'),
    }],
  ],
});

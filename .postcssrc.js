module.exports = {
  // Transform inline comments
  parser: require('postcss-scss'),
  plugins: [
    require('autoprefixer'),
    // Transform SCSS into CSS
    require('precss'),
  ],
};

const fs = require('fs');
const util = require('util');
const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack');
const gutil = require('gulp-util');
const webpackConfig = require('./scripts/webpack.conf');
const pkg = require('./package.json');
const readFile = util.promisify(fs.readFile);

function webpackCallback(err, stats) {
  if (err) {
    gutil.log('[FATAL]', err);
    return;
  }
  if (stats.hasErrors()) {
    gutil.log('[ERROR] webpack compilation failed\n', stats.toJson().errors.join('\n'));
    return;
  }
  if (stats.hasWarnings()) {
    gutil.log('[WARNING] webpack compilation has warnings\n', stats.toJson().warnings.join('\n'));
  }
  (Array.isArray(stats.stats) ? stats.stats : [stats])
  .forEach(stat => {
    const timeCost = (stat.endTime - stat.startTime) / 1000;
    const chunks = Object.keys(stat.compilation.namedChunks).join(' ');
    gutil.log(`Webpack built: [${timeCost.toFixed(3)}s] ${chunks}`);
  });
}

const DIST = 'dist';
const paths = {
  copy: [
    'src/assets/**',
  ],
};
const buildTasks = ['copy'];

gulp.task('clean', () => del('dist'));

gulp.task('copy', () =>
  gulp.src(paths.copy, { base: 'src' })
  .pipe(gulp.dest(DIST))
);

gulp.task('watch', buildTasks.concat(['js-dev']), () => {
  gulp.watch(paths.copy, ['copy']);
});

gulp.task('build', buildTasks.concat(['js-prd']));

gulp.task('js-dev', () => {
  webpack(webpackConfig).watch({}, webpackCallback);
});
gulp.task('js-prd', cb => {
  webpack(webpackConfig, (...args) => {
    webpackCallback(...args);
    cb();
  });
});

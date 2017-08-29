const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.base.conf');
const { IS_DEV, merge } = require('./utils');

const targets = module.exports = [];

targets.push(merge(base, {
  entry: {
    app: 'src/app.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Tools',
    }),
    !IS_DEV && new ExtractTextPlugin('[name]-[chunkhash:8].css'),
  ].filter(Boolean),
}));

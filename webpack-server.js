const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');
const base = require('./webpack-base');

const { env: { NODE_ENV } } = process;

const resolve = path.resolve;

const config = merge.smart(base, {
  target: 'node',
  context: resolve('./'),
  entry: './server',
  output: {
    path: resolve('dist'),
    filename: 'server.js',
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: [
          'fake-style',
          'css?modules&localIdentName=[name]_[local]',
          'sass'
        ],
      },
    ],
  },
  externals: [nodeExternals()],
  devtool: 'source-map',
  plugins: [
    new webpack.BannerPlugin('require("source-map-support").install();', {
      raw: true,
      entryOnly: false,
    }),
  ],
});

if (NODE_ENV === 'development') {
  module.exports = merge.smart(config, {
    plugins: [
      new webpack.SourceMapDevToolPlugin({
        include: ['server.js'],
      }),
      new WebpackShellPlugin({
        onBuildEnd: ['nodemon dist/server.js'],
      }),
    ],
  });
}

if (NODE_ENV === 'production') {
  module.exports = config;
}
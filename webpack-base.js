const { resolve } = require('path');
const { DefinePlugin, HotModuleReplacementPlugin, optimize: { OccurenceOrderPlugin, DedupePlugin, UglifyJsPlugin } } = require('webpack');
const { smart, smartStrategy } = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const { stringify } = JSON;

const { env: { NODE_ENV, RENDERING_ON } } = process;

const base = {
  output: {
    path: resolve('build'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  eslint: {
    quiet: true,
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new DefinePlugin({
      process: {
        env: {
          NODE_ENV: stringify(NODE_ENV),
          RENDERING_ON: stringify(RENDERING_ON),
        },
      },
    }),
  ],
};

if (NODE_ENV === 'development') {
  module.exports = smart(base, {
    output: {
      pathinfo: true,
    },
    debug: true,
  });
}

if (NODE_ENV === 'production') {
  module.exports = smart(base, {
    plugins: [
      new OccurenceOrderPlugin(),
      new UglifyJsPlugin({
        compress: { warnings: false },
        comments: false,
        sourceMap: false,
        mangle: true,
        minimize: true
      }),
    ],
  });
}

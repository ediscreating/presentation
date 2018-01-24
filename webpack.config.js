const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: []
};

if (isProduction) {
  config.plugins.push(new UglifyJsPlugin());
}

module.exports = config;

var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require("html-webpack-plugin");

var dev_mode = 'development';
// var dev_mode = 'production';

module.exports = {
  entry: {
    app: './src/main.js',
    vendor: [
      // "babel-polyfill",
    ],
  },
  output: {
    path: './dist/js/',
    filename: (dev_mode == 'development') ? 'js.min.js' : "[name].[hash].js",
    // filename: "[name].[hash].js",
    pathinfo: true
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|forge\.js)/,
      loader: 'babel-loader',
      query: {
        compact: true,
        presets: ['es2015']
      }
    }]
  },
  alias: {
    forge: 'forge.js'
  },
  resolve: {
    root: [
      // path.resolve('./src/app'),
      path.resolve('./src/'),
      path.resolve('./node_modules/emailjs-imap-client/src/'),
      path.resolve('./node_modules/emailjs-imap-handler/src/'),
      path.resolve('./node_modules/emailjs-tcp-socket/src/'),
      path.resolve('./node_modules/emailjs-smtp-client/src/'),
      path.resolve('./node_modules/emailjs-stringencoding/src/'),
    ]
  },
  devtool: "eval-cheap-module-source-map", // For save on Coffee script source
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor", (dev_mode == 'development') ? "vendor.js" : "[name].[hash].js"),
    new HtmlWebpackPlugin({
      title: "test title",
      filename: "../index.html",
      template: 'src/index.html'
    })
  ],
  node: {
    fs: "empty"
  }
};
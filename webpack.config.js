const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
	 'app': './app/javascripts/app.js',
	 'logs': './app/javascripts/logs.js',
	 'hashGenerator': './app/javascripts/hashGenerator.js',
	 'governmentApp': './app/javascripts/governmentApp.js',
	 'gpcApp': './app/javascripts/gpcApp.js',
	 'wagerApp': './app/javascripts/wagerApp.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" }
    ]),
	new CopyWebpackPlugin([
      { from: './app/logsIndex.html', to: "logsIndex.html"}
    ]),
	new CopyWebpackPlugin([
      { from: './app/hashGeneratorApp.html', to: "hashGeneratorApp.html" }
    ]),
	new CopyWebpackPlugin([
      { from: './app/government.html', to: "government.html" }
    ]),
	new CopyWebpackPlugin([
      { from: './app/gpc.html', to: "gpc.html" }
    ]),
	new CopyWebpackPlugin([
      { from: './app/wager.html', to: "wager.html" }
    ]),
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}

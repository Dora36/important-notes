let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let webpack = require('webpack');

module.exports = {
  devServer: {
    port: 3000,
    contentBase: './dist',
    open: true
  },
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      hash: true
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname,'dist','manifest.json')
    }),

  ],
  module: {
    rules: [
      {
        test:/\.js$/,
        include:path.resolve('src'),
        use: {
          loader:'babel-loader',
          options: {
            presets:[
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      }
    ]
  }
};
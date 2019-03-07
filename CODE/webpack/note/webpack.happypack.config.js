let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

let Happypack = require('happypack');

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
    new Happypack({
      id:'js',
      use: [{
        loader:'babel-loader',
        options: {
          presets:[
            '@babel/preset-env',
            '@babel/preset-react'
          ]
        }
      }]
    }),
    new Happypack({
      id:'css',
      use: ['style-loader','css-loader']
    })
  ],
  module: {
    rules: [
      {
        test:/\.js$/,
        include:path.resolve('src'),
        use: 'Happypack/loader?id=js'
      },
      {
        test:/\.css$/,
        use:'Happypack/loader?id=css'
      }
    ]
  }
};
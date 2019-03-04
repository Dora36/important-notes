let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
let UglifyJsPlugin = require("uglifyjs-webpack-plugin");
module.exports = {
  optimization:{
    minimizer:[
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  },
  mode: 'production', // production  development
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath:'/'
  },
  plugins: [
    new webpack.DefinePlugin({
      DEV:JSON.stringify('production'),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
    new webpack.IgnorePlugin(/\.\/locale/,/moment/)
  ],
  resolve:{
    modules:[path.resolve('node_modules'),path.resolve('other')],
    extensions:['.js','.css','.vue','.json'],
    mainFields:['style','main'],
    mainFiles:[],
    alias:{
      bootstrap: 'bootstrap/dist/css/bootstrap.css'
    },

  },
  module: {
    rules: [
      {
        test:/\.html$/,
        use:'html-withimg-loader'
      },
      {
        test:/\.(png|jpg|gif)$/,
        use:{
          loader: 'url-loader',
          options: {
            limit : 1
          }
        }
      },
      {
        test:/\.js$/,
        include:path.resolve('src'),
        use: {
          loader:'babel-loader',
          options: { // 使用 babel-loader 需要把 ES6 转为ES5
            presets:[
              '@babel/preset-env' // 将 ES6 转为 ES5
            ]

          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader',
        ]
      }
    ]
  }
}

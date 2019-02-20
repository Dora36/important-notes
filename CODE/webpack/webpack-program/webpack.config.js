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
  devServer:{
    // 3. 有服务端但不用代理处理，在服务端中启动 webpack，端口用服务端端口


    // 2. 模拟数据
    before(app) {
      app.get('/user',(req,res)=>{
        res.json({name:'dora 模拟数据'})
      })
    }
    // 1. 通过代理重写请求的路径
    // proxy: {
    //   '/api':{
    //     target:'http://localhost:3000',
    //     pathRewrite:{'/api':''}
    //   }
    // }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css'
    })
  ],
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

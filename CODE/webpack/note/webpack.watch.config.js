let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode:'development',
  entry: {
    home: './src/index.js',
  },
  output: {
    filename:'[name].js',
    path: path.resolve(__dirname,'dist')
  },
  watch:true,
  watchOptions: { // 监控的选项
    poll:1000,  // 每秒监听1000次
    aggregateTimeout: 500,   // 防抖，500ms 内输入的代码打包一次
    ignored:/node_modules/  // 忽略监控的文件
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        use: {
          loader:'babel-loader',
          options: {
            presets:['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:'./index.html',
      filename:'index.html'
    })
  ]
}
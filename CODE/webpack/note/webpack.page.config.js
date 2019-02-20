let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode:'development',
  // 多入口
  entry: {
    home: './src/index.js',
    other: './src/other.js'
  },
  output: {
    // [name] 相当于变量，即入口文件的名字
    filename:'[name].js',
    path: path.resolve(__dirname,'dist')
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:'./index.html',
      filename:'home.html',
      chunks:['home']  // 通过 index.html 模板生成 home.html 并只引入 home.js
    }),
    new HtmlWebpackPlugin({
      template:'./index.html',
      filename:'other.html',
      chunks:['other'] // 通过 index.html 模板生成 other.html 并只引入 other.js
    })
  ]
}
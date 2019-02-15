// webpack 是 node 写出来的，因此需要用 node 的写法
let path = require('path');  // node 内置的核心模块 其中 resolve 方法可以将相对路径解析为绝对路径。
// console.log(path.resolve('dist')); // 在当前目录下解析出一个 dist 目录的绝对路径，__dirname 也表示在当前目录下解析

let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  devServer: {  // 开发服务器的配置
    port: 3000,
    progress: true,
    contentBase: './dist',
    compress: true
  },
  mode: 'development',  // 模式 默认两种 production（会压缩） 和 development
  entry: './src/index.js', // 入口
  output: {
    filename: 'bundle.js',  // 打包后的文件名
    path: path.resolve(__dirname, 'dist'),  // 路径 必须是一个绝对路径
  },
  plugins: [  //  数组  存放所有的 webpack 插件
    new HtmlWebpackPlugin({ // 配置生成的 html 文件
      template: './src/index.html', // 以这个文件为模板
      filename: 'index.html', // 生成的 html 文件名
      // minify: {
      //   removeAttributeQuotes: true, // 去掉双引号
      //   collapseWhitespace: true, // 去掉空格
      // },
      // hash: true //js 添加 hash
    })
  ],
  module: { // 模块
    rules: [ // 规则
      // loader 的特点 希望单一
      // loader 的语法 字符串只用一个，多个loader 需要 数组形式
      // loader 的顺序 默认从右向左执行，从下往上执行
      // loader 还可以写成 对象方式 可传参
      {
        test: /\.css$/, use: [
          {
            loader: 'style-loader', // 是把css 插入到 head 标签中
            options:{
              insertAt:'top'
            }
          },
          'css-loader'  // 解析 @import 这种语法的
        ]
      },
      {
        //  可以处理 less (less 和 less-loader) 文件  sass (node-sass 和 sass-loader) stylus 等
        test: /\.less$/, use: [
          {
            loader: 'style-loader',
            options:{
              insertAt:'top'
            }
          },
          'css-loader',
          'less-loader', // 把less转为 css
        ]
      }
    ]
  }
}
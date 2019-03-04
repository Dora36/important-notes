let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  devServer: {
    port: 3000,
    contentBase: './dist',
    compress: true
  },
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [  //  数组  存放所有的 webpack 插件
    new HtmlWebpackPlugin({ // 配置生成的 html 文件
      template: './src/index.html', // 以这个文件为模板
      filename: 'index.html', // 生成的 html 文件名，不写默认也是 index.html
      minify: { //  压缩生成的 html 文件
        removeAttributeQuotes: true,  // 去掉属性的双引号
        collapseWhitespace: true,     // 去掉空格
      },
      hash: true //html 中引入的 bundle.js 添加 hash
    })
  ],
};
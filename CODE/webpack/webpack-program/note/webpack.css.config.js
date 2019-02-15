let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
let UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  optimization:{ // 优化项
    minimizer:[
      new UglifyJsPlugin({
        cache: true,  // 缓存
        parallel: true,  //  并发打包，一起压缩多个
        sourceMap: true  // 源码映射
      }),
      new OptimizeCSSAssetsPlugin()  // 生产环境下压缩 css 但会影响 js 的打包，需将 ES6 语法转为 ES5 语法
    ]
  },
  mode: 'production', // production  development
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css'  // 打包出的 css 的文件名
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,  // 将css 文件提取出来，通过 link 引入到 html 中，而不是 style 标签
          'css-loader',
          'postcss-loader'  // 运行新建的 postcss.config.js 配置文件，在配置文件中 引入插件 autoprefixer 为css 自动添加浏览器内核前缀
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader', // 将less 转为 css
        ]
      }
    ]
  }
}

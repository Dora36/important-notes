let path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module:{
    noParse:/jquery/, // 不解析 jquery 模块，提升解析速度
    rules:[
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: { // 使用 babel-loader 需要把 ES6 转为ES5
            presets:[
              '@babel/preset-env', // 将 ES6 转为 ES5
            ]
          }
        }
      }
    ]
  }
};
let path = require('path');

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
};
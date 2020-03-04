let Merge = require('webpack-merge');
let BaseWebpackConfig = require('./webpack.base.config.js');

module.exports = Merge(BaseWebpackConfig,{
  mode:'development',
  devServer:{

  },
  devtool:'source-map'
})
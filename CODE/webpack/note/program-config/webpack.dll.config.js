let path = require('path');
let webpack = require('webpack');

module.exports ={
  mode:'development',
  entry:{
    react:['react','react-dom'],
  },
  output:{
    filename:'_dll_[name].js',
    path:path.resolve(__dirname,'dist'),
    library:'_dll_[name]', // 变量名
    // libraryTarget:'var' // 变量的声明方式 默认为var，其他如 commonjs  umd  this ...
  },
  plugins:[
    new webpack.DllPlugin({
      name:'_dll_[name]',  // name 的值等于 output 的 library 名
      path: path.resolve(__dirname,'dist','manifest.json') //manifest 任务清单
    })
  ]
}
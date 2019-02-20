// 自带 express 框架
let express = require('express');
let app = express();
let webpack = require('webpack');

// 需要 express 中间件 webpack-dev-middleware，可以在服务端启动 webpack
let WebpackDevMiddleware = require('webpack-dev-middleware');

let WebpackConfig = require('./webpack.config');
let compiler = webpack(WebpackConfig);

app.use(WebpackDevMiddleware(compiler));

app.get('/api/user',(req,res)=>{
  res.json({name:'dora webpack'})
});

app.listen(3000);
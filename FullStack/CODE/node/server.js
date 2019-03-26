const http = require('http');

// 有浏览器请求时执行的回调函数
let server = http.createServer((req,res)=>{
  //  request 输入

  console.log('aaa');
  //  response 输出
  res.write('aaa');
  res.end();
});
// 监听
server.listen(8080);
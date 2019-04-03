const express = require('express');  // 主体
const body = require('body-parser'); // 接收普通 POST 数据
const multer = require('multer');    // 接收文件 POST 数据

let server = express();
server.listen(8080);

//中间件
server.use(body.urlencoded({extended:false}));

let multerObj = multer({dest: './upload/'});
server.use(multerObj.any());

server.post('/api',(req,res)=>{
  res.send('Hello Express');

  console.log(req.body); // 普通数据
  console.log(req.files); // 文件的 POST 数据
});

  server.use(express.static('./www/'));












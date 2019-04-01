const http = require('http');
const fs = require('fs');
const io = require('socket.io');

let httpServer = http.createServer((req,res)=>{
  let rs = fs.createReadStream(`www${req.url}`);
  rs.pipe(res);

  rs.on('error',err=>{
    if(err) {
      res.writeHeader(404);
      res.write('Not Found');
      res.end();
    }
  });
});

httpServer.listen(8080);

let wsServer = io.listen(httpServer);


let aSock=[];
wsServer.on('connection',function(sock){
  console.log(sock.constructor);
  aSock.push(sock);

  // 断开连接，删掉 aSock 中的 sock.
  sock.on('disconnect',()=>{
    let n = aSock.indexOf(sock);
    if(n != -1) {
      aSock.splice(n,1);
    }
  });

  sock.on('msg',str=>{
    aSock.forEach(s=>{
      if(s!=sock) {
        s.emit('msg',str);
      }
    })
  });
});







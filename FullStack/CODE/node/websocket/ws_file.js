const http = require('http');
const fs = require('fs');
const io = require('socket.io');

let httpServer = http.createServer((req,res)=>{});

httpServer.listen(8080);

let wsServer = io.listen(httpServer);

wsServer.on('connection',sock => {
  sock.on('filename',url=>{

    fs.readFile(`www${url}`,(err,data)=>{
      if(err) {
        sock.emit('file','404');
      }else {
        sock.emit('file',data.toString());
      }
    })
  })
})













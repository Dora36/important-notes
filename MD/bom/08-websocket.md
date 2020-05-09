## socket

- 双向通信
- 自动跨域
- 性能高

WebSocket 是 HTML5 带的功能，只有前台有 WebSocket，后台没有，后台有原生的 Socket。

## socket.io 库

### node 端

```shell
npm install socket.io
```

```js
// index.js
const io = require('socket.io')();
io.on('connection', socket => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // io.emit 向所有连接同时发送  socket.emit 只向当前连接发送
  io.emit('date',new Date().getTime()) // 向前端发送服务器时间

  // 文件监听
  socket.on('filename', url=>{
    fs.readFile(`static${url}`,(err,data)=>{
      if(err) {
        socket.emit('file','404');
      }else {
        socket.emit('file',data.toString());
      }
    })
  })

});
io.listen(8080);
```

### web 端

```html
<!-- socket.io 自动生成的js文件 -->
<script src="http://localhost:8080/socket.io/socket.io.js"></script>
<script>
  let socket = io('http://localhost:8080');
  // 前端接收服务端时间
  socket.on('date',data=>{
    console.log(data);
  });

  // 发送文件 接收文件
  socket.emit('filename','/1.html');
  socket.on('file',data=>{
    document.body.innerHTML = data;
  });

</script>
```

### 聊天室

```js
// node/index.js
const http = require('http');
const fs = require('fs');
const io = require('socket.io');

let httpServer = http.createServer((req,res)=>{
  let rs = fs.createReadStream(`static${req.url}`);
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
let wsServer = io(httpServer);

let aSock=[];
wsServer.on('connection', (socket) => {
  console.log(socket.constructor); // 每个连接都是一个不同的 socket 实例
  aSock.push(socket);

  // 断开连接，删掉 aSock 中的 socket。
  socket.on('disconnect',()=>{
    let n = aSock.indexOf(socket);
    if(n != -1) {
      aSock.splice(n,1);
    }
  });

  socket.on('msg',str=>{
    aSock.forEach(s=>{
      if(s != socket) {
        s.emit('msg',str);
      }
    })
  });
});
```

```html
<head>
  <style>
    #uli { width: 400px; height: 300px; border: 1px solid #000; overflow: auto; }
    #uli li.me { color: green; }
    .err-box { color: red; display: none; }
  </style>
</head>

<body>
  <h1>Hello WebSocket</h1>
  <ul id="uli"></ul>
  <textarea id="txt1" cols="60" rows="4"></textarea>
  <p class="err-box"> 无法连接到服务器 </p>
  <p><input type="button" value="发送" id="btn1"></p>

  <script src="http://localhost:8080/socket.io/socket.io.js"></script>
  <script>
    let socket = io('http://localhost:8080/');

    window.onload = function () {
      let oTxt = document.querySelector('#txt1');
      let oBtn = document.querySelector('#btn1');
      let oUi = document.querySelector('#uli');

      // socket.io 会自动重连
      socket.on('connect',function () {
        console.log('已连接');
        document.querySelector('.err-box').style.display = 'none';
      });

      socket.on('disconnect',function () {
        console.log('已断开');
        document.querySelector('.err-box').style.display = 'block';
      });

      oBtn.onclick = function () {
        socket.emit('msg',oTxt.value);
        let oLi = document.createElement('li');
        oLi.innerHTML = oTxt.value;
        oLi.className = 'me';
        oUi.appendChild(oLi);
        oTxt.value="";
      };

      socket.on('msg',str=>{
        let oLi = document.createElement('li');
        oLi.innerHTML = str;
        oUi.appendChild(oLi);
      });
    }
  </script>
</body>
```

## websocket 和 node 原生 socket

### node 模块

- `net`：用于创建基于流的 TCP 或 IPC 的服务器与客户端。
  - `net.createServer(socket=>{})`：创建一个新的 TCP 或 IPC 服务器。新的连接建立后会触发 `server` 的 `connection` 事件，并返回 `socket` 实例作为回调函数的参数。
  - `server.listen()`：启动一个服务器来监听连接。
  - `socket` 的 `data` 事件：当接收到数据的时触发该事件。
    - `socket.once('data', ()=>{})`：第一次握手的数据处理，用 `headers` 交流。
  - `socket` 的 `end` 事件：当 `socket` 的另一端发送一个 FIN 包的时候触发，从而结束 `socket` 的可读端。
- `crypto`：
  - `crypto.createHash('sha1')`：创建并返回一个 `sha1` 算法的 `Hash` 对象。
  - `hash.update(data)`：使用给定的 `data` 更新哈希的内容。
  - `hash.digest('base64')`：将 `hash` 转为 `base64` 数据。

### 流程

**1. 后端创建 net 服务**

建立 `net` 连接，监听 net 服务，接收前端发送的数据。

**2. 握手：建立连接**

- 客户端发送 `header`，包含 `connection: 'Upgrade'`、`upgrade: 'websocket'`、`'sec-websocket-version': '13'`、`'sec-websocket-key': 'jqADSZRXokC8zo6gLdlDPA=='` 等头信息。
- 服务端处理：upgrade 头必须是 `'websocket'`，version 必须是 `'13'`，然后将客户端发送的 key 加上 websocket 官方的密钥合并后使用 `sha1` 算法加密并转为 `base64` 作为 `Sec-WebSocket-Accept` 头发给客户端，以及返回状态码为 `101 Switching Protocals`。

```js
function websocketKey (key) {
  let mask = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'; // 官方密钥
  return crypto.createHash('sha1').update(key+mask).digest('base64');
}
```

**3. 数据传输**

- 客户端
  - `onopen`：连接上服务器了。
  - `onmessage`：有数据发送过来。
  - `onclose`：连接断开。

- 服务端：
  - `sock.once('data', header)`：握手的 `header` 信息。
  - `sock.on('data', data)`：有数据需要接收。`data` 是 **数据帧** 结构的 `buffer`。
  - `sock.on('end')`：断开连接。

**4. 数据帧解析**


### 后端代码实现

```js
const net = require('net');
const crypto = require('crypto');

function websocketKey (key) {
  let mask = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
  let key2 = crypto.createHash('sha1').update(key+mask).digest('base64');
  return key2
}

net.createServer(socket=>{
  console.log('连接');

  // 握手的数据，headers 交流
  socket.once('data', data=>{
    let headersArr = data.toString().split('\r\n');
    headersArr = headersArr.slice(1, headersArr.length - 2);
    let headers = {};
    headersArr.forEach( header =>{
      let [key, value] = header.split(': ');
      headers[key.toLowerCase()] = value;
    })

    if(headers['upgrade'] !== 'websocket') {
      console.log('不是 websocket 协议', headers['upgrade']);
      socket.end();
    } else if( headers['sec-websocket-version'] !== '13') {
      console.log('websocket 版本不是 13', headers['sec-websocket-version']);
      socket.end();
    } else {
      // 将 header 里的 key 和 websocket 的官方密钥 mask 合并 sha1 加密后转为 base64 发给客户端
      let key = websocketKey(headers['sec-websocket-key']);

      // 返回给前端的 headers  101 表示切换协议
      socket.write(`HTTP/1.1 101 Switching Protocals\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${key}\r\n\r\n`);

      socket.on('data', data=>{
        console.log(data);  // 数据帧结构的 buffer
        let FIN = data[0]&0x001;
        let opcode = data[0]&0x0F0;
        let mask = data[1]&0x001;
        let payload = data[1]&0x0FE;
        // ...
        console.log(FIN,opcode,mask,payload);
      });
    }
  });

  socket.on('end', data=>{
    // 断开
    console.log('end');
  })
}).listen(8080)
```

### 前端 websocket 连接

```html
<script>
  let socket = new WebSocket('ws://localhost:8080/')
  socket.emit = function (name, ...args) {
    socket.send(JSON.stringify({name, data: [...args]}));
  }
  socket.onopen = function() { // 连接
    console.log('open');
    socket.emit('msg', 12,5)
  }

  socket.onmessage = function() { // 有数据
    console.log('message');
  }

  socket.onclose = function() { // 断开
    console.log('close');
  }

</script>
```

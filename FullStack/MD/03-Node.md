## NodeJS

### 简介

#### 优点

- nodejs 的对象、语法跟 JavaScript 一模一样；利于前端人员用
- 性能还可以 （比 PHP 快 80 多倍）
- 前后台配合方便

#### 缺点

- Java 极其丰富的库支持

#### 用处

- 服务器：小型后台系统，大型项目的中间层
- 工具应用：测试，构建（grunt、gulp、webpack...），数据抓取

#### 运行

    node xxx.js

#### 三大特性

- 单线程
- 非阻塞 IO
- 事件循环机制

### 系统模块

#### 1. http 模块

- HTTP/HTTPS
- HTTP/2


    const http = require('http');

    // 有浏览器请求时执行的回调函数
    let server = http.createServer((req,res)=>{
      //  request 输入
      console.log(req.url); // 获取请求的url，如 '/www/1.html'

      //  response 输出
      res.write('abc');
      res.end();
    });
    // 监听
    server.listen(8080);

这时候访问 `http://localhost:8080` 页面就会显示 `abc`。

#### 2. 断言测试 - Assertion Testing

    const assert = require('assert');

    // assert(条件语句,'条件不等于true时抛出的错误提示');

    function sum(a,b) {
      assert(arguments.length==2,'必须传2个参数');
      assert(typeof a=='number','第一个参数必须是数字');
      assert(typeof b=='number','第二个参数必须是数字');
      return a+b;
    }
    console.log(sum(5,'4'));

#### 3. 二进制 - Buffer，文件 - File System

`Buffer` 是 `nodejs` 用于处理二进制数据结构的，读取的文件等都是以二进制的形式存在的。

`File System` 是处理与文件有关的相关操作的，读、写、删、创建等。

```javascript
const fs = require("fs");
// 读
fs.readFile("1.txt", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data); // 读出来是 Buffer 格式的
    console.log(data.toString());
  }
});
// 写
fs.writeFile("3.txt", "node good", err => {
  if (err) {
    console.log(err);
  } else {
    console.log("成功");
  }
});
```

#### 4. C++ Addons

可以用 C 语言写插件，极大的提升 Node 的性能。

#### 5. 多进程 - Child Processes、Cluster、Process

#### 6. Crypto - 签名

用于签名，如 md5、sha

    const crypto = require('crypto');

    let obj = crypto.createHash('md5'); // 'sha1'
    obj.update('123456');

    console.log(obj.digest('hex')); // 以16进制的数字形式表现出来

**防破解 -** 加强加密：双层加密 + 混淆字符串

    const crypto = require('crypto');

    function md5(str) {
      let obj = crypto.createHash('md5');
      obj.update(str);
      return obj.digest('hex');
    }

    console.log(md5(md5('123456')+'dora362019'));

#### 7. OS - 操作系统相关

    const os = require('os');
    console.log(os.cpus());

#### 8. Path - 路径相关

    const path = require('path');
    let str = '/var/local/www/aaa/1.png';

    console.log(path.dirname(str));   // 目录名  /var/local/www/aaa
    console.log(path.basename(str));  // 文件名  1.png
    console.log(path.extname(str));   // 扩展名  .png

    path.resolve('aaa/1.txt')  // 将相对路径解析为绝对路径

#### 9. Events - 事件队列

与函数最大的不同是可以解耦。

    const Event = require('events').EventEmitter;

    let ev = new Event();
    // 监听（接收事件）
    ev.on('msg',function (a,b,c) {
      console.log('收到了msg事件',a,b,c);
    });

    // 派发（发送事件）
    ev.emit('msg',12,5,88);

#### 10. Query Strings - 解析查询字符串

    const querystring = require('querystring');

    let obj = querystring.parse('a=3&b=4&c=5&d=6');

    console.log(obj); // { a: '3', b: '4', c: '5', d: '6' }

#### 11. URL - 解析 URL

    const url = require('url');

    let obj = url.parse('https://www.test.com:8080/s?a=3&b=4&c=5&d=6',true);

    console.log(obj);

    // Url {
    //   protocol: 'https:',
    //   slashes: true,
    //   auth: null,
    //   host: 'www.test.com:8080',
    //   port: '8080',
    //   hostname: 'www.test.com',
    //   hash: null,
    //   search: '?a=3&b=4&c=5&d=6',
    //   query: { a: '3', b: '4', c: '5', d: '6' }, // 第二个参数为true时，也会直接解析query
    //   pathname: '/s',
    //   path: '/s?a=3&b=4&c=5&d=6',
    //   href: 'https://www.test.com:8080/s?a=3&b=4&c=5&d=6'
    // }

#### 12. 网络

- TCP - 稳定 Net
- UDP - 快 UDP/Datagram

#### 13. 域名相关 - DNS、Domain

    const dns = require('dns');

    // dns解析
    dns.resolve('baidu.com',(err,res)=>{
      if(err) {
        console.log(err);
      }else {
        console.log(res);  // ip 地址
      }
    })

#### 14. 流操作 - Stream

连续数据都是流 - 视频流、网络流、文件流、语音流

#### 15. TLS/SSL - 加密、安全

#### 16. ZLIB - gz 压缩用

### 数据交互

#### web 服务器

**主要功能**

- 解析数据（get post)，文件数据（file）解析
- 响应静态资源(fs)
- 数据库操作

**web 服务的性能**

对 cpu 的负载不是最重要的

重要的是 对内存的使用，对 IO 的管理，对网络的使用，这些才是性能的瓶颈。

#### node 中往前端发送数据

- setHeader()
- writeHeader()
- write()

#### 获取文件

```javascript
const http = require("http");
const fs = require("fs");

let server = http.createServer((req, res) => {
  fs.readFile(`www${req.url}`, (err, data) => {
    if (err) {
      res.writeHeader(404); // 这样在network中会报出404状态码.
      res.write("Not Found"); // write():输出内容
    } else {
      res.write(data);
    }
    res.end();
  });
});

server.listen(8080);
```

#### GET、POST

1. GET：传输内容在 url 里面，大小较小，<32K。

   ```JavaScript
   const http = require('http');
   const url = require('url';)

   let server = http.createServer((req,res)=>{

     let {pathname,query} = url.parse(req.url,true);

     res.end();
   })

   server.listen(8080);
   ```

2. POST：传输内容在 body 中，空间较大，<1G。一个大的数据包会切成很多小包传输。

   ```JavaScript
   const http = require('http');
   const querystring = require('querystring');

   let server = http.createServer((req,res)=>{
     let str = '';
     //有一个段到达了
     req.on('data',data=>{
       str+=data;
     });

     //传输结束了
     req.on('end',()=>{
       let post = querystring.parse(str);
     });

     res.end();
   })

   server.listen(8080);
   ```

### 缓存

是浏览器与服务器自行控制的。

#### 缓存策略

1. cache-control
2. expries

#### node 缓存实现过程

**原理**

1. 第一次请求：S -> C："Last-Modified: 文件最后一次的修改时间"
2. 第二次请求：C -> S："If-Modified-Since: 浏览器中缓存的文件的修改时间"
3. 第二次请求：S -> C：200 || 304

**步骤**

1. 获取文件的修改时间
   ```
   	const fs = require('fs');
   	fs.stat(`文件路径`, (err,stat)=>{
   		if(err){
   			console.log('获取文件失败');
   		}else {
   			console.log(stat.mtime.toGMTString());
   		}
   	})
   ```
2. 设置响应头信息 `Last-Modified`，只有服务器发送了该 `header`，浏览器才会获取到文件时间。
   ```
   	res.setHeader('Last-Modified', stat.mtime.toGMTString());
   ```
3. 获取请求头中的 `If-Modified-Since` 信息，并与服务器的 `Last-Modified` 进行对比。

   ```
   	if(req.headers['if-modified-since']){
   		let oDate = new Date(req.headers['if-modified-since']);
   		let clientTime = Math.floor(oDate.getTime()/1000);
   		let serverTime = Math.floor(stat.mtime.getTime()/1000);

   		if(serverTime>clientTime) {
   			sendFileToClient(); // 发送文件
   		}else {
   			res.writeHeader(304);
   			res.write('Not Modified');
   			res.end();
   		}
   	}else {
   		sendFileToClient(); // 发送文件
   	}
   ```

### 多进程

- 多线程：性能高、复杂
- 多进程：性能略低、简单

nodejs 默认单进程、单线程，但可通过模块操作变成多进程。

主进程：负责派生子进程
子进程：工作进程

**特点**

1. 普通程序不能"创建"进程，只有系统进程才能创建进程；
2. 进程是分裂出来的，并且只有主进程能分裂；
3. 分裂出来的两个进程执行的都是同一套代码；
4. 父子进程之间可以共享"句柄"-端口。

**工作模式**

进程调度是需要开销的，所以为了省时省力，达到最高效率，多进程的工作模式都是前一个进程满了才会开启下一个进程，而不是平均分配。

#### node 多进程

**所用模块**

- cluster
- process

**node 操作**

```javascript
const http = require("http");
const cluster = require("cluster");
const os = require("os");
const process = require("process");

//cluster.isMaster为 true时则为主进程，只有主进程可分裂子进程
if (cluster.isMaster) {
  //一般情况下，子进程数和cpu的数量相等时比较合理
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork(); // 主进程分裂出子进程
  }
} else {
  let server = http.createServer((req, res) => {
    console.log(process.pid); // 可获取运行代码的进程的信息
    res.write("dora");
    res.end();
  });
  server.listen(8080);
}
```

### node 框架

#### express

只能用回调函数

#### koa

可用 async / await

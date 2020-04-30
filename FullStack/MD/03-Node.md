## NodeJS

### 系统模块

#### 2. 断言测试 - Assertion Testing

    
#### 3. 二进制 - Buffer，文件 - File System

#### 4. C++ Addons

可以用 C 语言写插件，极大的提升 Node 的性能。

#### 5. 多进程 - Child Processes、Cluster、Process

一个程序可以有很多个进程，一个进程可以包含多个线程。

进程和进程之间是隔离的，拥有独立的执行空间及存储空间
同一个进程内的所有线程共享一套空间和代码

多进程：创建和销毁成本高，启动慢，但是安全，因为进程间隔离。进程间通信麻烦。代码简单。
多线程：创建和销毁成本低，启动快，但是不够安全，因为共用同一套代码。线程间通信简单容易。代码复杂。

#### 6. Crypto - 签名

#### 7. OS - 操作系统相关

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

#### 11. URL - 解析 URL

#### 12. 网络

- TCP - 稳定 Net
- UDP - 快 UDP/Datagram

#### 13. 域名相关 - DNS、Domain

#### 14. 流操作 - Stream

连续数据都是流 - 视频流、网络流、文件流、语音流

#### 15. TLS/SSL - 加密、安全

#### 16. ZLIB - gz 压缩用

### 程序员 - 内功心法

1. 算法 - 离散数学
2. 设计模式
3. 架构

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

#### GET、POST

1. GET：传输内容在 url 里面，大小较小，<32K。

2. POST：传输内容在 body 中，空间较大，<1G。一个大的数据包会切成很多小包传输。

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

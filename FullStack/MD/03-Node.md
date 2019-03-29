## NodeJS

### 简介

#### 优点

- nodejs的对象、语法跟JavaScript一模一样；利于前端人员用
- 性能还可以 （比PHP快80多倍）
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
- 非阻塞IO
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

    const fs = require('fs');
    // 读
    fs.readFile('1.txt',(err,data)=>{
      if(err) {
        console.log(err);
      }else {
        console.log(data); // 读出来是 Buffer 格式的
        console.log(data.toString());
      }
    });
    // 写
    fs.writeFile('3.txt','node good',err => {
      if(err) {
        console.log(err);
      }else {
        console.log('成功');
      }
    });

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
- TCP - 稳定  Net
- UDP - 快   UDP/Datagram

#### 13. 域名相关 - DNS、Domain

    const dns = require('dns');
    
    // dns解析
    dns.resolve('baidu.com',(err,res)=>{
      if(err) {
        console.log(err);
      }else {
        console.log(res);
      }
    })

#### 14. 流操作 - Stream

连续数据都是流 - 视频流、网络流、文件流、语音流

#### 15. TLS/SSL - 加密、安全


#### 16. ZLIB - gz 压缩用

### 数据交互

#### web 服务器

1. 返回文件
2. 数据交互（GET,POST）
3. 数据库操作

#### node中往前端发送数据

- setHeader()
- writeHeader()
- write()

#### 获取文件

    const http = require('http');
    const fs = require('fs');
    
    let server = http.createServer((req,res)=>{
    	fs.readFile(`www${req.url}`,(err,data)=>{
    		if(err){
    			res.writeHeader(404); // 这样在network中会报出404状态码.
    			res.write('Not Found'); // write():输出内容
    		}else {
    			res.write(data);
    		}
    		res.end();
    	});
    });
    
    server.listen(8080);

#### GET、POST

1. GET：传输内容在 url 里面，大小较小，<32K。


    const http = require('http');
    const url = require('url';)
    
    let server = http.createServer((req,res)=>{
    
      let {pathname,query} = url.parse(req.url,true);
    
      res.end();
    })
    
    server.listen(8080);

2. POST：传输内容在body中，空间较大，<1G。一个大的数据包会切成很多小包传输。


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





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

### 模块

#### 1. http 模块

- HTTP/HTTPS
- HTTP/2

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


























### Buffer 二进制操作

1. 查找
    ```
    let b = new Buffer('abccc-=-dddd-=-erere');
    console.log(b.indexOf('-=-')); //5
    ```
2. 切分 : slice(start,end)-包含start 不包含 end
    ```
    let b = new Buffer('abccc-=-dddd-=-erere');
    console.log(b.slice(0,5)); // abccc
    ```
3. 截取
    ```
		Buffer.prototype.split = Buffer.prototype.split||function(b){
			let arr = [];
			let cur = 0;
			let n = 0;
			
			while((n=this.indexOf(b,cur))!=-1){
				arr.push(this.slice(cur,n));
				cur = n+b.length;
			}
			arr.push(this.slice(cur));
			return arr;
		}
    ```

### uuid、guid - 唯一标识符

第三方模块，需要 npm 安装

	npm install uuid -D

使用模块

	const uuid = require('uuid/v4'); // v4是其中一个版本
	uuid() // 即可产生一个随机的字符串，带 -。
	uuid().replace(/\-/g, '') // 去掉字符串中的 '-'


### node中的流

1. 读取流：`fs.createReadStream()`、`req`
2. 写入流：`fs.createWriteStream()`、`res`
3. 读写流：双向数据流，压缩、加密

#### 简单的读取文件流和写入文件流

    const fs = require('fs');
    
    let rs = fs.createReadStream('1.png'); // 读取流
    let ws = fs.createWriteStream('2.png'); // 写入流
    
    rs.pipe(ws); // 从读取流建立一个管道到写入流
    
    //流对象都有 on()绑定事件;
    rs.on('error',err=>{
      console.log('读取失败');
    })
    
    ws.on('finish',()=>{
      console.log('写入完成');
    })

#### 压缩流

    const http = require('http');
    const fs = require('fs');
    const zlib = require('zlib');
    
    let server = http.createServer((req,res)=>{
    
      //req,res都是流对象。req 读取流，res 写入流
    
      let rs = fs.createReadStream(`www${req.url}`);
    
      // 输出压缩文件必须设置此 header
      res.setHeader('content-encoding', 'gzip');
      
      let gz = zlib.createGzip();
      rs.pipe(gz).pipe(res); //gz 是双向流，一边读取，一边压缩输出。
    
      rs.on('error',err=>{
        res.writeHeader(404);
        res.write('Not Found');
        res.end();
      })
    });
    
    server.listen(8080);


















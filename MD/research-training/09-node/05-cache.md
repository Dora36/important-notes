## 缓存实现过程

是浏览器与服务器自行控制的。

### 缓存策略

- 强缓存（200 from disk cache）：服务器可通过设置 `Cache-Control` 制定缓存策略，如果指定了缓存期限，则浏览器请求文件时，在有效期内可直接从浏览器缓存中拿文件，不会向服务器发送请求。由于强缓存的文件在有效期内不会向服务器发请求，因此如果文件有修改也不会更新。

- 协商缓存（304 Not Modified）：如果没有命中强缓存，或者缓存时效过期，则会与服务器之间通过文件修改时间或 `ETag` 进行协商缓存。

服务端配置时可同时启用 `Cache-Control` 与 `Expires` 或者启用任意一个，同时启用的时候 `Cache-Control` 优先级高。

- `expries`：缓存时效，用于指定资源到期的时间，是绝对时间。
- `cache-control`：服务端指定缓存机制，是相对时间。
  - `max-age`：指定一个时间长度，在这个时间段内缓存是有效的，单位是s。`Cache-Control: max-age=10`。
  - `public`：表明响应可以被任何对象（发送请求的客户端、代理服务器等等）缓存。如果没有指定 public 还是 private，则默认为 public。
  - `private`：表明响应只能被单个用户（可能是操作系统用户、浏览器用户）缓存，是非共享的，不能被代理服务器缓存。
  - `no-cache`：强制所有缓存了该响应的用户，在使用已缓存的数据前，发送带验证器的请求到服务器。不是字面意思上的不缓存。
  - `no-store`：禁止缓存，每次请求都要向服务器重新获取数据。

`max-age` 的强缓存命中：

- 刷新（刷新按钮、f5刷新、cmd+r 刷新等等）或地址栏回车都会自动给 request header 带上 `cache-control:max-age=0`，或者 `no-cache`，所以不会命中强缓存。
- 只有通过链接跳转（`<a>` 标签）的文件请求会命中强缓存。

### 协商缓存

- 第一次服务端响应：服务器向客户端发送 `Last-Modified` 头信息，即文件最后一次的修改时间。
- 第二次客户端请求：客户端向服务器发送 `If-Modified-Since` 头信息，即浏览器中缓存的文件的修改时间，也就是第一次服务器发给客户端的 `Last-Modified` 时间。
- 第二次服务端响应：服务器根据客户端发送的 `If-Modified-Since` 头信息，判断返回 200 或者 304。

#### 实现过程

**步骤**

- 获取文件的修改时间
- 设置响应头信息 `Last-Modified`，只有服务器发送了该 `header`，浏览器才会获取到文件时间
- 获取请求头中的 `If-Modified-Since` 信息并与服务器的 `Last-Modified` 进行对比

**获取修改时间的 api**

- `fs.stat(path[, options], (err, stat)=>{})`：获取文件或文件夹信息。
- `stat.mtime`：上次修改文件数据的时间。

```js
const fs = require('fs');

fs.stat(`文件路径`, (err,stat)=>{
  if(err){
    console.log('获取文件信息失败');
  }else {
    console.log(stat.mtime.toGMTString());
  }
})
```

#### 代码

```js
const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer((req,res)=>{
	
	let { pathname } = new URL(req.url, `http://${req.headers.host}`);
	
	//1. 获取文件日期
	fs.stat(`static${pathname}`,(err, stat)=>{
		if(err) {
			res.writeHeader(404);
			res.write('Not Found');
			res.end();
		}else {

			//2. 获取请求头中的 `If-Modified-Since` 信息，判断返回 200 或是 304
			if(req.headers['if-modified-since']){
				let oDate = new Date(req.headers['if-modified-since']);
				let clientTime = Math.floor(oDate.getTime()/1000);
        let serverTime = Math.floor(stat.mtime.getTime()/1000);
				
				if(serverTime > clientTime) {
					sendFileToClient();
				} else {
					res.writeHeader(304);
					res.write('Not Modified');
					res.end();
				}
			}else {
				sendFileToClient();
			}
			
			function sendFileToClient(){
        let rs = fs.createReadStream(`static${pathname}`);
        
        // 强缓存，如果文件经常更改，不建议使用
				res.setHeader('Cache-Control', 'max-age=10');

				//3. 设置响应头信息 `Last-Modified`，转换为 GMT 时间格式
				res.setHeader('Last-Modified', stat.mtime.toGMTString());
		
				// 流式输出
				rs.pipe(res);
				
				rs.on('error',err=>{
					res.writeHeader(404);
					res.write('Not Found');
					res.end();
				})
			}
			
		}
	})
	
}).listen(8080);
```

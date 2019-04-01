const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer((req,res)=>{
	
	let {pathname} = url.parse(req.url);
	
	//1. 获取文件日期
	fs.stat(`www${pathname}`,(err,data)=>{
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
				
				if(serverTime>clientTime) {
					sendFileToClient();
				}else {
					res.writeHeader(304);
					res.write('Not Modified');
					res.end();
				}
			}else {
				sendFileToClient();
			}
			
			function sendFileToClient(){
				let rs = fs.createReadStream(`www${pathname}`);

				//3. 设置响应头信息 `Last-Modified`
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


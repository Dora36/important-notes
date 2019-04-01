// 瑕疵：
//1. 错误:会等到所有数据都传输完成了才开始处理
//   正确:收到一部分就解析一部分，极大地节约内存
//2. fs.readFile()
//   fs.writeFile()


const http = require('http');
const common = require('./libs/common');
const fs = require('fs');
const uuid = require('uuid/v4');

let server = http.createServer((req,res)=>{
	
	let arr = [];
	req.on('data',data=>{
		arr.push(data);
	});
	req.on('end',()=>{
		let data = Buffer.concat(arr);
		
		//解析二进制文件上传数据
		
		let post = {};
		let files = {};
		
		//1. 获取分隔符
		let separator = req.headers['content-type']&&req.headers['content-type'].split('; ')[1];
		if(separator) {
			let boundary = '--'+separator.split('=')[1];
			
			//2. 用分隔符切分整个数据
			let arr = data.split(boundary);
			
			//3. 丢弃arr中头尾两个数据
			arr.shift();
			arr.pop();
			
			//4. 丢弃掉arr中每个数据头尾的'\r\n'
			arr = arr.map(buffer=>buffer.slice(2,buffer.length-2));
			
			//5. arr中每个数据在第一个'\r\n\r\n'处切成两部分
			arr.forEach(buffer=>{
				let n = buffer.indexOf('\r\n\r\n');
				
				let description = buffer.slice(0,n);
				let content = buffer.slice(n+4);
				
				//6. 区分普通数据和文件数据，进行不同处理
				description = description.toString(); // 描述是普通字符串，可由二进制转换为字符串
				if(description.indexOf('\r\n')==-1){
					//普通数据
					content.toString();
					let name = description.split('; ')[1].split('=')[1];
					name = name.substring(1,name.length-1);
					post[name] = content;
				}else {
					//文件数据
					let [des1, des2] = description.split('\r\n');
					let [,name,filename] = des1.split('; ');
					let type = des2.split(': ')[1];
					
					name = name.split('=')[1];
					name = name.substring(1,name.length-1);
					
					filename = filename.split('=')[1];
					filename = filename.substring(1,filename.length-1);
					
					let path = `upload/${uuid().replace(/\-/g, '')}`;
					fs.writeFile(path, content, err=>{
						if(err){
							console.log('文件写入失败');
						}else {
							console.log('成功');
							files[name]={filename, path, type};
						}
					});
				}
			});
			
			
		}
		
		res.end();
		
	});
	

});

server.listen(8080);

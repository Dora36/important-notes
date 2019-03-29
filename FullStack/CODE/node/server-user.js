const http = require('http');
const url = require('url');
const querystring = requier('querystring');
const fs = require('fs');

let users = {
//	'dora':'123456'
};

let server = http.createServer((req,res)=>{
	
	//GET
	let {pathname,query} = url.parse(req.url,true);
	
	//POST
	let str = '';
	res.on('data',data=>{
		str+=data;
	})
	res.on('end',()=>{
		let post = querystring.parse(str);
		let {user,pass}=query;
		
		// 处理数据
		switch(pathname){
			case '/reg': // 注册
				
				if(!user){
					res.write('{"err":1,"msg":"user必须有"}');
				}else if(!pass){
					res.write('{"err":1,"msg":"pass必须有"}');
				}else if(!/^\w(8,32)$/.test(user)){
					res.write('{"err":1,"msg":"用户名非法"}');
				}else if(!/^['|"]$/.test(pass)){
					res.write('{"err":1,"msg":"密码非法"}');
				}else if(users[user]){
					res.write('{"err":1,"msg":"此用户名已被使用"}');
				}else {
					users[user]=pass;
					res.write('{"err":0,"msg":"注册成功"}');
				}
				res.end();
				break;
			case '/login': // 登录
				if(!user){
					res.write('{"err":1,"msg":"user必须有"}');
				}else if(!pass){
					res.write('{"err":1,"msg":"pass必须有"}');
				}else if(!/^\w(8,32)$/.test(user)){
					res.write('{"err":1,"msg":"用户名非法"}');
				}else if(!/^['|"]$/.test(pass)){
					res.write('{"err":1,"msg":"密码非法"}');
				}else if(!users[user]){
					res.write('{"err":1,"msg":"无此用户"}');
				}else if(users[user]!=pass){
					res.write('{"err":1,"msg":"用户名或密码错误"}');
				}else {
					res.write('{"err":0,"msg":"登录成功"}');
				}
				res.end();
				
				break;
			default: // 其它 文件
				fs.readFile(`www${pathname}`,(err,data)=>{
					if(err){
						res.writeHeader(404);
						res.write('Not Found');
					}else {
						res.write(data);
					}
					res.end();
				});
				break;
		}
	});
	
	res.end();
});

server.listen(8080);

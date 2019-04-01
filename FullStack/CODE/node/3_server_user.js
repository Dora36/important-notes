const http = require('http');
const mysql = require('mysql');
const fs = require('fs');
const url = require('url');
const zlib = require('zlib');
const crypto = require('crypto');


//密码加密
const _key = 'dora20190331'; // _key不能变，所以不能用时间戳
function md5(str) {
	let obj = crypto.createHash('md5');
	obj.update(str);
	return obj.digest('hex');
}

function md5_2(str) {
	md5(md5(str)+_key);
}


let db = mysql.createPool({host:'localhost', port: 3306, user:'root', password: '', database: '20180127'});

let server = http.createServer((req,res)=>{
	
	let {pathname,query} = url.parse(req.url,true);

	let {user, pass} = query;
	
	switch(pathname) {
		//接口
		case '/reg':

			//校验
			if(!user) {
				res.write('{"err": 1, "msg": "用户名不能为空"}');
				res.end();
			}else if(!pass) {
				res.write('{"err": 1, "msg": "密码不能为空"}');
				res.end();
			}else if(!/^\w(4,16)$/.test(user)) {
				res.write('{"err": 1, "msg": "用户名无效"}');
				res.end();
			}else if(!/['|"]/.test(pass)) {
				res.write('{"err": 1, "msg": "密码无效"}');
				res.end();
			}else {
				db.query(`SELECT * FROM user_table WHERE username='${user}'`,(err,data)=>{
					if(err) {
						res.write('{"err": 1, "msg": "数据库出错"}');
						res.end();
					}else if(data.length>0) {
						res.write('{"err": 1, "msg": "用户名已存在"}');
						res.end();
					}else {
						db.query(`INSERT INTO user_table (ID,username,password) VALUES(0,'${user}','md5_2(${pass})')`,(err,data)=>{
							if(err) {
								res.write('{"err": 1, "msg": "数据库错误"}');
								res.end();
							}else {
								res.write('{"err": 0, "msg": "ok"}');
								res.end();
							}
						})
					}
				})
			}
			
			break;
		case '/login':
			if(!user) {
				res.write('{"err": 1, "msg": "用户名不能为空"}');
				res.end();
			}else if(!pass) {
				res.write('{"err": 1, "msg": "密码不能为空"}');
				res.end();
			}else if(!/^\w(4,16)$/.test(user)) {
				res.write('{"err": 1, "msg": "用户名无效"}');
				res.end();
			}else if(!/['|"]/.test(pass)) {
				res.write('{"err": 1, "msg": "密码无效"}');
				res.end();
			}else {
				db.query(`SELET * FROM user_table WHERE username='${user}'`,(err,data)=>{
					if(err){
						res.write('{"err": 1, "msg": "数据库有错"}');
						res.end();
					}else if(data.length==0) {
						res.write('{"err": 1, "msg": "无此用户"}');
						res.end();
					}else if(data[0].password!=md5_2(pass)) {
						res.write('{"err": 1, "msg": "用户名和密码错误"}');
						res.end();
					}else {
						res.write('{"err": 0, "msg": "ok"}');
						res.end();
					}
				})
			}
			break;
		default:
			//静态文件
			
			//缓存...
			
			let rs = fs.createReadStream(`www${pathname}`);
			let gz = zlib.createGzip();
			
			//压缩
			res.setHeader('content-encoding','gzip');
			rs.pipe(gz).pipe(res);
			
			rs.on('error',err=>{
				res.writeHeader(404);
				res.write('Not Found');
				res.end();
			})
			break;
	}
	
	
	
});

server.listen(8080);

# formData 类型数据的处理

## 原始数据

### 字符串形式的 formData 数据示例

```
------WebKitFormBoundaryzSMeiIqydBGVAMwf
Content-Disposition: form-data; name="username"

dora
------WebKitFormBoundaryzSMeiIqydBGVAMwf
Content-Disposition: form-data; name="age"

18
------WebKitFormBoundaryzSMeiIqydBGVAMwf
Content-Disposition: form-data; name="f1"; filename="a.txt"
Content-Type: text/plain

aaa
bbb
ccccccc
------WebKitFormBoundaryzSMeiIqydBGVAMwf--
```

### 数据结构

formData 的数据结构是 http 协议规定的。

- 分隔符：`----WebKitFormBoundaryzSMeiIqydBGVAMwf`。
- 换行符：`\r\n`，数据描述和数据值之间有两个换行符 `\r\n\r\n`。
- 终止符：结尾分隔符后的 `--`。

## 数据结构分析

### 分析后的数据格式

```
--<分隔符>\r\n数据描述\r\n\r\n数据值\r\n
--<分隔符>\r\n数据描述\r\n\r\n数据值\r\n
--<分隔符>\r\n数据描述1\r\n数据描述2\r\n\r\n<文件内容>\r\n
--<分隔符>--\r\n
```

### 通过统一的数据格式处理数据

1. 获取 `<分隔符>`：通过 `req` 的 `content-type` 头信息获取。

2. 用 `--<分隔符>` 切分 `split` 数据

    ```
    [
      空,
      \r\n数据描述\r\n\r\n数据值\r\n,
      \r\n数据描述\r\n\r\n数据值\r\n,
      \r\n数据描述1\r\n数据描述2\r\n\r\n<文件内容>\r\n,
      --\r\n
    ]
    ```

3. 丢弃分割后头尾不需要的元素

    ```
    [
      \r\n数据描述\r\n\r\n数据值\r\n,
      \r\n数据描述\r\n\r\n数据值\r\n,
      \r\n数据描述1\r\n数据描述2\r\n\r\n<文件内容>\r\n,
    ]
    ```

4. 丢弃每一项的头尾 `\r\n`

    ```
    [
      数据描述\r\n\r\n数据值,
      数据描述\r\n\r\n数据值,
      数据描述1\r\n数据描述2\r\n\r\n<文件内容>,
    ]
    ```

5. 用第一次出现的 `\r\n\r\n` 切分

    - 普通数据：`[数据描述, 数据值]`
    - 文件数据：`[数据描述1\r\n数据描述2, <文件内容>]`

6. 判断描述的里面有没有 `\r\n` 来区分文件数据和普通数据

7. 分析"数据描述"

## 数据处理

### Buffer 操作数据的 API

- 查找：`indexOf()`，返回首次出现的下标，没有则返回 -1。可以通过字符串或 buffer 查找。第二个参数是查找的起始位置，默认为 0。
- 截取：`slice(s, e)`，截取包含 s 不包含 e 的下标区间的值，返回一个新的 Buffer。
- 切分：`split`，需要自己实现。按照分隔符将 buffer 切分成数组。

```js
// ./libs/common.js
Buffer.prototype.split = Buffer.prototype.split || function(b){
  // b 是 boundary 分隔符
	let arr = [];
	let cur = 0;
	let n = 0;

	while((n = this.indexOf(b, cur)) != -1){
		arr.push(this.slice(cur, n));
		cur = n + b.length;
	}
	arr.push(this.slice(cur));
	return arr;
}
```

### 处理数据

```js
const http = require('http');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');  // 创建唯一的标识符
require('./libs/common');    // 获取 buffer 的 split 方法

http.createServer((req, res) => {
  let { pathname } = new URL(req.url, `http://${req.headers.host}`);

  switch(pathname) {
		//接口
		case '/formData':
      let contentType = req.headers['content-type'];

      let arrBuffer = [];
      req.on('data', data => {
        arrBuffer.push(data);
      });

      req.on('end', () => {
        let bufferData = Buffer.concat(arrBuffer);

        if(contentType.startsWith('multipart/form-data')) {
          // 解析 formData 形式的数据
          let post = {};
          let files = {};
          
          //1. 获取分隔符 'multipart/form-data; boundary=----WebKitFormBoundary1VWnlhApdx1B7Lj3'
          let boundary = '--' + contentType.split('; ')[1].split('=')[1];
          
          //2. 用分隔符切分整个 buffer 数据
          let arr = bufferData.split(boundary);
            
          //3. 丢弃arr中头尾两个数据
          arr.shift();
          arr.pop();
            
          //4. 丢弃掉arr中每个数据头尾的'\r\n'
          arr = arr.map(buffer => buffer.slice(2, buffer.length-2));
            
          //5. arr中每个数据在第一个'\r\n\r\n'处切成两部分
          arr.forEach(buffer=>{
            let n = buffer.indexOf('\r\n\r\n');
            
            let description = buffer.slice(0,n);
            let content = buffer.slice(n+4);
            
            //6. 区分普通数据和文件数据，进行不同处理
            description = description.toString(); // 描述是普通字符串，可由二进制转换为字符串
            if(description.indexOf('\r\n') === -1){
              //普通数据 description: 'Content-Disposition: form-data; name="username"'
              let name = description.split('; ')[1].split('=')[1];  // '"username"'
              name = name.substring(1,name.length-1);               // 'username'
              post[name] = content.toString();
            }else {
              //文件数据
              let [des1, des2] = description.split('\r\n');
              let [,name,filename] = des1.split('; ');
              let type = des2.split(': ')[1];
              
              name = name.split('=')[1].substring(1,name.length-1);
              filename = filename.split('=')[1].substring(1,filename.length-1);
              
              let path = `upload/${uuidv4().replace(/\-/g, '')}`;
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

          res.end('hello form data');
        } else {
          // 其他数据类型的处理
          console.log(bufferData);
          res.end('hello form data');
        };
        
      });
			break;
		default:
			// 响应静态文件
			break;
  }

}).listen(8080);
```

### 优化

- 不用等到所有数据都传输完成了才开始处理，应该收到一部分就解析一部分，可极大地节约内存。

- 写入文件的时候，建议使用流式操作 `fs.createWriteStream()`。

## http

### 模块导入

```js
const http = require('http');
const https = require('https');
```

### http 的 server 服务

- `http`
  - `http.createServer([options][, requestListener])`：返回新的 `http.Server` 实例。`requestListener` 是一个自动添加到 `server` 实例的 `request` 事件的回调函数。

- `server`
  - `server.listen`：启动 HTTP 服务器监听连接。
  - `close` 事件：当服务器关闭时触发。
  - `request` 事件：每次有请求时都会触发。

- `request`：回调函数中的输入请求信息
  - `req.headers`：请求头对象。消息头的名称都是小写的。
  - `req.method`：请求方法。为大写的字符串。如 `GET`。
  - `req.url`：请求的 URL 字符串，以 `/` 开始，如果有查询字符串会包含查询字符串部分，如果路径中有 `#` 号，则会在 `#` 号之前中断。解析 URL ：``new URL(req.url, `http://${req.headers.host}`)``。
  - `req` 是可读流，因此，具有可读流的 `data` 事件和 `end` 事件。

- `response`：回调函数中的输出响应信息
  - `res.setHeader(name, value)`：为隐式响应头设置单个响应头的值。 如果此响应头已存在于待发送的响应头中，则其值将被替换。 
  - `res.writeHead(statusCode[, statusMessage][, headers])`：向请求发送响应头。
  - `res.getHeaders()`：返回当前传出的响应头的浅拷贝。 
  - `res.write(chunk)`：将响应头信息和消息主体发送给客户端。chunk 可以是字符串或 buffer。
  - `res.end([data[, encoding]][, callback])`：此方法向服务器发出信号，表明已发送所有响应头和主体，该服务器应该视为此消息已完成。必须在每个响应上调用此 `res.end()` 方法。如果指定了 `data`，则相当于调用 `res.write(data, encoding)` 之后再调用 `res.end(callback)`。如果指定了 `callback`，则当响应流完成时将调用它。

```js
const http = require('http');

// 有浏览器请求时执行的回调函数
let server = http.createServer((req,res)=>{
  // request 输入
  console.log(req.url);

  // response 输出
  res.write('Hello Node!');
  res.end();
})
// 监听
server.listen(8080);
```

### http 的 request 请求

- `http.request()`：Node.js 为每个服务器维护多个连接以发出 HTTP 请求。 此函数允许显式地发出请求。返回 `http.ClientRequest` 类的实例。可选的 `callback` 参数会作为单次监听器被添加到 `ClientRequest` 的 `response` 事件。

  - `http.request(options[, callback])`
  - `http.request(url[, options][, callback])`

- `request`：`http.ClientRequest` 的实例，发送出去的请求。
  - `response` 事件：当收到此请求的响应时触发。此事件仅触发一次。
  - `error` 事件：如果在请求期间遇到任何错误（DNS 解析错误、TCP 层的错误、或实际的 HTTP 解析错误），则会在返回的请求对象上触发 `error` 事件。
  - `close` 事件：当服务器关闭时触发。
  - `req.write(data)`：发送请求数据。如果将整个数据成功刷新到内核缓冲区，则返回 `true`。
  - `req.end()`：使用 `http.request()` 时，必须始终调用 `req.end()` 来表示请求的结束，即使没有数据被写入请求主体。
  - `req.path`：请求的路径。

- `response`：请求返回的响应信息
  - `res.statusCode`：HTTP 响应状态码。
  - `res.statusMessage`：响应状态消息。例如 `OK` 或 `Internal Server Error`。
  - `res.headers`：响应的消息头对象。消息头的名称都是小写的。
  - `res` 是可读流，因此，具有可读流的 `data` 事件和 `end` 事件。


在成功的请求中，会按以下顺序触发以下事件：

- `socket` 事件
- `response` 事件
- `res` 对象上任意次数的 `data` 事件
- `res` 对象上的 `end` 事件
- `close` 事件

```js
const querystring = require('querystring');
const postData = querystring.stringify({
  'msg': 'hello node'
});

const options = {
  hostname: 'dora.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

const req = http.request(options, (res) => {
  console.log(res.statusCode);   // 状态码
  console.log(res.headers);      // 响应头

  res.setEncoding('utf8'); // 接收数据为 utf8 字符串，如果没有设置字符编码，则会接收到 Buffer 对象。

  let rawData = '';
  res.on('data', (chunk) => {   // 获取响应数据
    console.log(`响应主体: ${chunk}`);
    rawData += chunk;
  });
  res.on('end', () => {
    console.log('响应中已无数据');
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

// 将数据写入请求主体。
req.write(postData);
req.end();
```

### request 请求的 get 简写

`http.get(options[, callback])` && `http.get(url[, options][, callback])`

由于大多数请求都是没有主体的 GET 请求，因此 Node.js 提供了这个便捷的方法。

`options` 接受与 `http.request()` 相同的 `options`，且 `method` 始终设置为 `GET`。这个方法与 `http.request()` 的唯一区别是它将方法设置为 `GET` 并自动调用 `req.end()`。

```js
http.get('http://nodejs.cn/index.json', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('请求失败\n' +`状态码: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('无效的 content-type.\n' +`期望的是 application/json 但接收到的是 ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // 消费响应数据来释放内存。
    res.resume();
    return;
  }
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`出现错误: ${e.message}`);
});
```

### http 的属性

- `http.METHODS`：以数组形式列出所有的 HTTP 方法。

- `http.STATUS_CODES`：对象形式，列出所有标准 HTTP 响应状态码的集合，以及每个状态码的简短描述。

- `http.globalAgent`：Agent 的全局实例，作为所有 HTTP 客户端请求的默认值。

## fs 文件系统

### 功能

```js
const fs = require('fs');
```

`fs` 模块提供了用于与文件系统进行交互的 API。所有的文件系统操作都具有同步和异步的形式。

异步的形式总是把完成回调作为其最后一个参数。传给完成回调的参数取决于具体方法，但第一个参数总是异常。如果操作被成功地完成，则第一个参数会为 `null` 或 `undefined`。

### 操作 api

#### 读

**`fs.readFile(path[, options], callback)`**

- `path`：文件路径或文件描述符。

- `options`：对象形式或字符串。如果是字符串，则是指定字符编码。
  - `encoding`：字符编码，默认值为 `null`。
  - `flag`：文件系统 flag 的支持。默认值为 `r`。

- `callback`
  - `err`：错误信息。
  - `data`：读取的文件内容，为字符串或 Buffer 形式。如果没有指定字符编码，则返回原始的 buffer。

```js
const http = require("http");
const fs = require("fs");

let server = http.createServer((req, res) => {
  fs.readFile(`static${req.url}`, (err, data) => { // 读取 static 中的文件返回给前端
    if (err) {
      res.writeHead(404); // 这样在network中会报出404状态码.
      res.write("Not Found");
    } else {
      res.write(data);
    }
    res.end();
  });
});

server.listen(8080);
```

`fs.readFile()` 函数会缓冲整个文件。若要最小化内存成本，则尽可能选择流式，使用 `fs.createReadStream()` 可读流。

**`fs.createReadStream(path[, options])`**

返回 `fs.ReadStream` 可读流。

- `data` 事件
- `end` 事件
- `error` 事件
- `pipe()`：将可读流的所有数据推送到绑定的可写流，数据流会被自动管理。

#### 写

`fs.writeFile(file, data[, options], callback)`

- `file`：文件路径或文件描述符，如果文件已存在，则覆盖文件。

- `data`：可以是字符串或 buffer。如果是 buffer，则 `encoding` 选项会被忽略。

- `options`：可以是对象或字符串，如果是字符串，则是指定字符编码。
  - `encoding`：默认值为 `utf8`。
  - `mode`： `<integer>` 默认值为 `0o666`。
  - `flag`：文件系统 `flag` 的支持。 默认值为 `w`。

- `callback`
  - `err`

不等待回调就对同一个文件多次使用 `fs.writeFile()` 是不安全的。对于这种情况，建议使用流式操作 `fs.createWriteStream()`。

**`fs.createWriteStream(path[, options])`**

返回 `<fs.WriteStream>` 可写流。

- `error` 事件
- `pipe` 事件：在可读流上调用 `pipe()` 方法时会发出 `pipe` 事件，并将此可写流添加到其目标集。
- `end()`：表明已没有数据要被写入可写流。
- `write()`：写入数据到流，并在数据被完全处理之后调用 callback。

## stream 流

### 流的类型

- Writable：可写流

- Readable：可读流

- 双向流：可读又可写，同时具有可写流和可读流的两种接口。
  - Duplex
  - Transform：在读写过程中可以修改或转换数据的 Duplex 流，如压缩流。

### 可写流

- 客户端的 http 请求
- 服务器的 http 响应
- fs 的写入流

**API**

- `error` 事件
- `pipe` 事件：当在可读流上调用 `pipe()` 方法时会发出 `pipe` 事件，并将此可写流添加到其目标集。
- `write()`：写入数据到流，并在数据被完全处理之后调用 callback。
- `end()`：表明已没有数据要被写入可写流。

### 可读流

- 客户端的 http 响应
- 服务器的 http 请求
- fs 的读取流

**API**

- `data` 事件：获取数据块，即有数据传输的时候，会触发 `data` 事件，数据会分段多次连续调用。如果响应主体为空，则根本不会触发 `data` 事件，例如在大多数重定向中。
- `end` 事件：响应中无数据时，会触发 `end` 事件。
- `error` 事件
- `pipe()`：将可读流的所有数据推送到绑定的可写流，数据流会被自动管理。
- `setEncoding()`：为从可读流读取的数据设置字符编码。默认情况下没有设置字符编码，流数据返回的是 Buffer 对象。

### 双向流

**Duplex**

- TCP socket

**Transform**

- `zlib` 流
- `crypto` 流

### pipe 流管道操作

`readable.pipe(destination[, options])`

- `destination`：目标可读流。
- `options`
  - `end`：当读取器结束时终止写入器。默认值: `true`。

`readable.pipe()` 方法绑定可写流到可读流，将可读流自动切换到流动模式，并将可读流的所有数据推送到绑定的可写流。 数据流会被自动管理，所以即使可读流更快，目标可写流也不会超负荷。

`readable.pipe()` 会返回目标流的引用，如果是 Duplex 流或 Transform 流则可以形成管道链：

```js
const fs = require('fs');
const zlib = require('zlib');

const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');

r.pipe(z).pipe(w);
```

默认情况下，当来源可读流触发 `end` 事件时，目标可写流也会调用 `end()` 结束写入。若要禁用这种默认行为，`end` 选项应设为 `false`，这样目标流就会保持打开。

如果可读流在处理期间发送错误，则可写流目标不会自动关闭。如果发生错误，则需要手动关闭每个流以防止内存泄漏。

```js
http.createServer((req, res) => {
  let {pathname} = new URL(req.url);

  let rs = fs.createReadStream(`static${pathname}`);
  let gz = zlib.createGzip();

  //压缩头
  res.setHeader('content-encoding','gzip');
  rs.pipe(gz).pipe(res);

  rs.on('error',err=>{
    res.writeHeader(404);
    res.write('Not Found');
    res.end();  // 发生错误，手动关闭写入流
  })
});
```

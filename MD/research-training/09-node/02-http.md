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
  - `req.url`：请求的 URL 字符串。解析 URL ：``new URL(req.url, `http://${req.headers.host}`)``。

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
  - `data` 事件：获取响应主体，即有响应数据传输的时候，会触发 `data` 事件，数据会分段多次连续调用。如果响应主体为空，则根本不会触发 `data` 事件，例如在大多数重定向中。
  - `end` 事件：响应中无数据时，会触发 `end` 事件。

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

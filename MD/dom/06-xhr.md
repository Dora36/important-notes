## XMLHttpRequest 构造函数用法

`XMLHttpRequest` 实例对象是 AJAX 的主要接口，用于浏览器与服务器之间的通信。尽管名字里面有 XML 和 Http，但实际上可以使用多种协议（比如 file 或 ftp），也可以发送任何格式的数据（包括字符串和二进制）。

`XMLHttpRequest` 本身是一个构造函数，其用法如下：

- 1. 创建 xhr 实例：使用 `new` 命令生成实例，没有任何参数。实例对象用于在后台与服务器交换数据，是 AJAX 的基础。

- 2. 处理服务器的响应数据：指定回调函数，通过 `readystatechange` 事件监听通信状态（`readyState` 属性）的变化。

- 3. 配置请求：使用 `open()` 方法指定建立 HTTP 连接的一些细节。

- 4. 发送请求：最后使用 `send()` 方法，实际发出请求到服务器。

```js
let xhr = new XMLHttpRequest();

// 监听xhr对象的 readystatechange 事件，会触发5次。每当 readyState 改变时，就会触发 onreadystatechange 事件。
xhr.onreadystatechange = function(){
  if (xhr.readyState === 4){  // 通信成功时，状态值为4
    if ( (xhr.status >= 200 && xhr.status < 300) || (xhr.status === 304) ){
      console.log(xhr.response);
    } else {
      console.error(xhr.statusText);
    }
  }
};
xhr.open('GET', '/endpoint', true); // GET 请求，跟指定的服务器网址建立连接。第三个参数true，表示请求是异步的。
xhr.send(null);  // 参数为null，表示发送请求的时候，不带有数据体。如果发送的是 POST 请求，这里就需要指定数据体。
```

## XMLHttpRequest 实例属性

### `readyState` 状态

`xhr.readyState` 返回一个整数，表示实例对象的当前状态。该属性只读。

- 0：请求未初始化。表示 XMLHttpRequest 实例已经生成，但是实例的 `open()` 方法还没有被调用。

- 1：服务器连接已建立。表示 `open()` 方法已经调用，但是实例的 `send()` 方法还没有调用，仍然可以使用实例的 `setRequestHeader()` 方法，设定 HTTP 请求的头信息。

- 2：请求已接收。表示实例的 `send()` 方法已经调用，并且服务器返回的头信息和状态码已经收到。

- 3：请求处理中。表示正在接收服务器传来的数据体（body 部分）。这时，如果实例的 `responseType` 属性等于 `text` 或者空字符串，`responseText` 属性就会包含已经收到的部分信息。

- 4：请求已完成，且响应已就绪。表示服务器返回的数据已经完全接收，或者本次接收已经失败。

通信过程中，每当实例对象发生状态变化，它的 `readyState` 属性的值就会改变。这个值每一次变化，都会触发 `readyStateChange` 事件。

```js
let xhr = new XMLHttpRequest();

if (xhr.readyState === 4) {
  // 请求结束，处理服务器返回的数据
} else {
  // 显示提示“加载中……”
}
```

### `responseType` 返回数据类型

`xhr.responseType` 属性是一个字符串，表示服务器返回数据的类型。这个属性是可写的，可以在调用 `open()` 方法之后、调用 `send()` 方法之前，设置这个属性的值，告诉服务器返回指定类型的数据。如果 `responseType` 设为空字符串，就等同于默认值 `text`。

`xhr.responseType` 属性可以等于以下值：

- `text`：字符串（默认）。适合大多数情况，而且直接处理文本也比较方便。
- `""`（空字符串）：等同于 `text`，表示服务器返回文本数据。
- `arraybuffer`：ArrayBuffer 对象，表示服务器返回二进制数组。
- `blob`：Blob 对象，表示服务器返回二进制对象。适合读取二进制数据，比如图片文件。
- `document`：Document 对象，表示服务器返回一个文档对象。适合返回 HTML / XML 文档的情况，这意味着，对于那些打开 CORS 的网站，可以直接用 Ajax 抓取网页，然后不用解析 HTML 字符串，直接对抓取回来的数据进行 DOM 操作。
- `json`：JSON 对象。浏览器会自动对返回数据调用 `JSON.parse()` 方法。

### 返回数据

- `xhr.response`：表示服务器返回的数据体（即 HTTP 回应的 body 部分）。它可能是任何数据类型，比如字符串、对象、二进制对象等等，具体的类型由 `xhr.responseType` 属性决定。该属性只读。如果本次请求没有成功或者数据不完整，该属性等于 `null`。但是，如果 `responseType` 属性等于 `text` 或空字符串，在请求没有结束之前（`readyState` 等于 3 的阶段），`response` 属性就包含服务器已经返回的部分数据。

- `xhr.responseText`：返回从服务器接收到的 **字符串**，该属性为只读。只有 HTTP 请求完成接收以后，该属性才会包含完整的数据。要求 `responseType` 的值为 `text` 或 `""` 空字符串。

- `xhr.responseXML`：返回从服务器接收到的 HTML 或 XML 文档对象，该属性为只读。如果本次请求没有成功，或者收到的数据不能被解析为 XML 或 HTML，该属性等于 `null`。该属性生效的前提是 HTTP 回应的 `Content-Type` 头信息等于 `text/xml` 或 `application/xml`。要求在发送请求前，`xhr.responseType` 属性要设为 `document`。如果 HTTP 回应的 `Content-Type` 头信息不等于 `text/xml` 和 `application/xml`，但是想从 `responseXML` 拿到数据（即把数据按照 DOM 格式解析），那么需要手动调用 `xhr.overrideMimeType('text/xml')` 方法，强制进行 XML 解析。该属性得到的数据，是直接解析后的文档 DOM 树。

- `xhr.responseURL`：属性是字符串，表示发送数据的服务器的网址。这个属性的值与 `open()` 方法指定的请求网址不一定相同。如果服务器端发生跳转，这个属性返回最后实际返回数据的网址。另外，如果原始 URL 包括锚点（fragment），该属性会把锚点剥离。

### 返回 HTTP 状态码

- `xhr.status`：只读属性，返回一个整数，表示服务器回应的 HTTP 状态码。一般来说，如果通信成功的话，这个状态码是 200；如果服务器没有返回状态码，那么这个属性默认是 200。请求发出之前，该属性为 0。基本上，只有 `2xx` 和 `304` 的状态码，表示服务器返回是正常状态。

- `xhr.statusText`：只读属性，返回一个字符串，表示服务器发送的状态提示。不同于 `status` 属性，该属性包含整个状态信息，比如 `OK` 和 `Not Found`。在请求发送之前（即调用 `open()` 方法之前），该属性的值是空字符串；如果服务器没有返回状态提示，该属性的值默认为 `OK`。

### `timeout` 超时

`xhr.timeout` 属性返回一个整数，表示多少毫秒后，如果请求仍然没有得到结果，就会自动终止。如果该属性等于 0，就表示没有时间限制。

如果发生 `timeout` 事件，就会触发 `ontimeout` 事件，并执行 `ontimeout` 的监听函数。

```js
let xhr = new XMLHttpRequest();
let url = '/server';

xhr.ontimeout = function () {
  console.error('The request for ' + url + ' timed out.');
};

xhr.onload = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      // 处理服务器返回的数据
    } else {
      console.error(xhr.statusText);
    }
  }
};

xhr.open('GET', url, true);
xhr.timeout = 10 * 1000;     // 指定 10 秒钟超时
xhr.send(null);
```

### `withCredentials`

`xhr.withCredentials` 属性是一个布尔值，表示跨域请求时，用户信息（比如 Cookie 和认证的 HTTP 头信息）是否会包含在请求之中，默认为 `false`；如果需要跨域 AJAX 请求发送 Cookie，需要 `withCredentials` 属性设为 `true`。注意，同源的请求不需要设置这个属性。

```js
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://example.com/', true);
xhr.withCredentials = true;
xhr.send(null);
```

为了让这个属性生效，服务器必须显式返回 `Access-Control-Allow-Credentials` 这个头信息。

`withCredentials` 属性打开的话，跨域请求不仅会发送 Cookie，还会设置远程主机指定的 Cookie。反之也成立，如果 `withCredentials` 属性没有打开，那么跨域的 AJAX 请求即使明确要求浏览器设置 Cookie，浏览器也会忽略。

注意，脚本总是遵守同源政策，无法从 `document.cookie` 或者 HTTP 回应的头信息之中，读取跨域的 Cookie，`withCredentials` 属性不影响这一点。

### `upload` 上传文件

XMLHttpRequest 不仅可以发送请求，还可以发送文件，这就是 AJAX 文件上传。发送文件以后，通过 `xhr.upload` 属性可以得到一个对象，通过观察这个对象，可以得知上传的进展。主要方法就是监听这个对象的各种事件：`loadstart`、`loadend`、`load`、`abort`、`error`、`progress`、`timeout`。

```js
var xhr = new XMLHttpRequest();
xhr.open('POST', '/server', true);
xhr.onload = function (e) {};

// 监听 upload 属性的 progress 事件函数，即可获得上传的进度。
xhr.upload.onprogress = function (e) {
  if (e.lengthComputable) {
    console.log(e.loaded); // 已经传输的数据量
    console.log(e.total);  // 总的数据量
    let progress = (e.loaded / e.total) * 100;  // 百分比
  }
};

xhr.send(blobOrFile);  // 上传 blob 或文件
```

## XMLHttpRequest 实例监听事件

所有 XMLHttpRequest 的监听事件，都必须在 `send()` 方法调用之前设定。

- `xhr.onreadystatechange`：每当实例对象发生状态变化，即 `readyState` 属性的值每一次变化，都会触发 `readyStateChange` 事件，就会执行这个监听函数。另外，如果使用实例的 `abort()` 方法，终止 XMLHttpRequest 请求，也会造成 `readyState` 属性变化，导致调用 `xhr.onreadystatechange` 监听函数。

- `xhr.onloadstart`：`loadstart` 事件，HTTP 请求发出的监听函数。

- `xhr.onprogress`：`progress` 事件，正在发送和加载数据的监听函数。监听函数有一个事件对象参数，该对象有三个属性：`loaded` 属性返回已经传输的数据量，`total` 属性返回总的数据量，`lengthComputable` 属性返回一个布尔值，表示加载的进度是否可以计算。

- `xhr.onabort`：`abort` 事件，请求中止，比如用户调用了 `abort()` 方法的监听函数。

- `xhr.onerror`：`error` 事件，请求失败的监听函数。没有错误对象的参数。

- `xhr.onload`：`load` 事件，请求成功完成的监听函数。

- `xhr.ontimeout`：`timeout` 事件，用户指定的时限超过了，请求还未完成的监听函数。

- `xhr.onloadend`：`loadend` 事件，请求完成，不管成功或失败的监听函数。

```js
xhr.onload = function() {
 let responseText = xhr.responseText;
 console.log(responseText);
 // process the response.
};

xhr.onabort = function () {
  console.log('The request was aborted');
};

xhr.onprogress = function (event) {
  console.log(event.loaded);
  console.log(event.total);
};

xhr.onerror = function() {
  console.log('There was an error!');
};
```

## XMLHttpRequest 实例方法

### `open()` 配置请求

`xhr.open()` 方法用于指定 HTTP 请求的参数，或者说初始化 XMLHttpRequest 实例对象。它一共可以接受五个参数：

- `method`：表示 HTTP 动词方法，比如 `GET`、`POST`、`PUT`、`DELETE`、`HEAD` 等。
- `url`：表示请求发送目标 URL 或文件的地址。该文件可以是任何类型的文件，比如 `.txt` 和 `.xml`，或者服务器脚本文件，比如 `.asp` 或 `.php` 等。
- `async`：布尔值，表示请求是否为异步，默认为 `true`。如果设为 `false`，则 `send()` 方法只有等到收到服务器返回了结果，才会进行下一步操作。该参数可选。由于同步 AJAX 请求会造成浏览器失去响应，许多浏览器已经禁止在主线程使用，只允许 Worker 里面使用。所以，这个参数轻易不应该设为 `false`。
- `user`：表示用于认证的用户名，默认为空字符串。该参数可选。
- `password`：表示用于认证的密码，默认为空字符串。该参数可选。

注意，如果对使用过 `open()` 方法的 AJAX 请求，再次使用这个方法，等同于调用 `abort()`，即终止请求。

```js
xhr.open('POST', encodeURI('someURL'));
```

### `send()` 发送请求

`xhr.send()` 方法用于实际发出 HTTP 请求。它的参数是可选的，如果不带参数，就表示 HTTP 请求只有一个 URL，没有数据体，典型例子就是 `GET` 请求， GET 请求的参数，可作为查询字符串附加在 URL 后面；如果带有参数，就表示除了头信息，还带有包含具体数据的信息体，典型例子就是 `POST` 请求。

```js
let xhr = new XMLHttpRequest();
let data = 'username=dora&age=18'

xhr.open('POST', 'http://www.example.com', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send(data);
```

**参数**

`xhr.send()` 方法的参数就是发送的数据。多种格式的数据，都可以作为它的参数。

- `xhr.send()`
- `xhr.send(null)`：GET 请求可以发送 `null`。
- `xhr.send(ArrayBufferView)`
- `xhr.send(Blob)`：如果发送二进制数据，最好是发送 ArrayBufferView 或 Blob 对象。
- `xhr.send(Document)`：如果发送 DOM 对象，在发送之前，数据会先被串行化。
- `xhr.send(String)`：可发送 `Content-Type` 请求头设置的任何类型的字符串形式数据。如表单序列化后的数据或字符串形式的 json 数据等。
- `xhr.send(FormData)`：发送表单数据，`FormData` 对象可以用于构造表单数据。不需要设置 `Content-Type` 请求头。

```js
let formData = new FormData();  // FormData 对象构造了表单数据，效果与发送表单数据是一样的。

formData.append('username', 'dora');
formData.append('age', 18);

let xhr = new XMLHttpRequest();
xhr.open('POST', '/register');
xhr.send(formData);
```

### `setRequestHeader()` 设置请求头

`xhr.setRequestHeader()` 方法用于设置浏览器发送的 HTTP 请求的头信息。该方法必须在 `open()` 之后、`send()` 之前调用。如果该方法多次调用，设定同一个字段，则每一次调用的值会被合并成一个单一的值发送。

该方法接受两个参数。第一个参数是字符串，表示头信息的字段名，第二个参数是字段值。

```js
// 设置头信息 Content-Type，表示发送 JSON 格式的数据
xhr.setRequestHeader('Content-Type', 'application/json');

// 设置Content-Length，表示数据长度
xhr.setRequestHeader('Content-Length', JSON.stringify(data).length);

// 发送 JSON 数据。
xhr.send(JSON.stringify(data));  
```

```js
// 发送表单序列化的数据
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
```

### 其它方法

- `xhr.overrideMimeType()`：用来指定 MIME 类型，覆盖服务器返回的真正的 MIME 类型，从而让浏览器进行不一样的处理。必须在 `send()` 方法之前调用。

- `xhr.getResponseHeader()`：返回 HTTP 头信息指定字段（参数）的值，如果还没有收到服务器回应或者指定字段不存在，返回 `null`。该方法的参数不区分大小写。如果有多个字段同名，它们的值会被连接为一个字符串，每个字段之间使用“逗号+空格”分隔。

- `xhr.getAllResponseHeaders()`：用于获取服务器返回的所有头信息。格式为字符串，每个头信息之间使用 CRLF 分隔 `\r\n`（回车+换行），如果没有收到服务器回应，该属性为 `null`。如果发生网络错误，该属性为空字符串。

- `xhr.abort()`：用来终止已经发出的 HTTP 请求。调用这个方法以后，`readyState` 属性变为 4，`status` 属性变为 0。

```js
// 处理返回的所有头信息的字符串
let arr = headers.trim().split(/[\r\n]+/);
let headerMap = {};

arr.forEach(function (line) {
  let parts = line.split(': ');
  let header = parts.shift();
  let value = parts.join(': ');
  headerMap[header] = value;
});

headerMap['content-length'] // "188"
```

## ajax 通信

AJAX 是 Asynchronous JavaScript and XML 的缩写，指的是通过 JavaScript 的 **异步** 通信，从服务器获取 XML 文档从中提取数据，再更新当前网页的对应部分，而不用刷新整个网页。后来，AJAX 这个词就成为 JavaScript 脚本发起 HTTP 通信的代名词，也就是说，只要用脚本发起通信，就可以叫做 AJAX 通信。

具体来说，AJAX 包括以下几个步骤。

- 创建 `XMLHttpRequest` 实例
- 发出 HTTP 请求
- 接收服务器传回的数据
- 更新网页数据

总之就是 AJAX 通过原生的 `XMLHttpRequest` 对象发出 HTTP 请求，得到服务器返回的数据后，再进行处理。

### 同源

AJAX 只能向同源网址（协议、域名、端口都相同）发出 HTTP 请求，如果发出跨域请求，就会报错。

除了架设服务器代理（浏览器请求同源服务器，再由后者请求外部服务），有三种方法规避这个限制：

- JSONP

- WebSocket

- CORS

**JSONP**

JSONP 是服务器与客户端跨源通信的常用方法。最大特点就是简单易用，没有兼容性问题，老式浏览器全部支持，服务端改造非常小。然而只能发 GET 请求。

步骤如下：

- 1. 向网页添加一个 `<script>` 元素，通过 `src` 属性发送 http 请求，向服务器请求一个脚本，这不受同源政策限制，可以跨域请求。`src` 必须有一个 `callback` 参数（`?callback=bar`），用来告诉服务器，客户端的回调函数名称（`bar`）。

- 2. 服务器收到请求后，拼接一个字符串，将 JSON 数据放在函数名里面，作为字符串返回（`bar({...})`）。

- 3. 浏览器会将服务器返回的字符串，作为 js 代码解析，因为浏览器认为，这是 `<script>` 标签请求的脚本内容。这时，客户端只要定义了 `bar()` 函数，就会立即调用，并可在该函数体内，拿到服务器返回的 JSON 数据。

```js
function jsonp(URL, callbackname, callback) {
  // 给 window 对象添加属性，属性的名字就是函数的名字，属性值就是函数，这个函数就是全局变量。可以在任何地方调用。
  window[callbackname] = callback;  
  
  let scriptObj = document.createElement("script");  
  document.body.appendChild(scriptObj); 

  // 创建 script 标签的 src 属性，会同时发出 http 请求，
  scriptObj.src = `${URL}?callback=${callbackname}`;

  // 得到了请求数据，然后删掉这个script。
  document.body.removeChild(scriptObj);
}
```

### `Navigator.sendBeacon()`

用户卸载网页的时候，有时需要向服务器发一些数据。很自然的做法是在 `window` 的 `unload` 事件或 `beforeunload` 事件的监听函数里面，使用 XMLHttpRequest 对象发送数据。但是，这样做不是很可靠，因为 XMLHttpRequest 对象是异步发送，很可能在它即将发送的时候，页面已经卸载了，从而导致发送取消或者发送失败。

因此，浏览器引入了 `navigator.sendBeacon()` 方法。这个方法还是异步发出请求，但是请求与当前页面线程脱钩，作为浏览器进程的任务，因此可以保证会把数据发出去，不拖延卸载流程。

`navigator.sendBeacon(url, data)` 方法接受两个参数，第一个参数是目标服务器的 URL，第二个参数是所要发送的数据（可选），可以是任意类型（字符串、表单对象、二进制对象等等）。这个方法的返回值是一个布尔值，成功发送数据为 `true`，否则为 `false`。

该方法发送数据的 HTTP 方法是 `POST`，可以跨域，类似于表单提交数据。但不能指定回调函数。

```js
// HTML 代码如下
// <body onload="analytics('start')" onunload="analytics('end')">

function analytics(state) {
  if (!navigator.sendBeacon) return;

  let URL = 'http://example.com/analytics';
  let data = 'state=' + state + '&location=' + window.location;
  navigator.sendBeacon(URL, data);
}
```

## ajax 通信

AJAX 是 Asynchronous JavaScript and XML 的缩写，指的是通过 JavaScript 的 **异步** 通信，从服务器获取 XML 文档从中提取数据，再更新当前网页的对应部分，而不用刷新整个网页。后来，AJAX 这个词就成为 JavaScript 脚本发起 HTTP 通信的代名词，也就是说，只要用脚本发起通信，就可以叫做 AJAX 通信。

具体来说，AJAX 包括以下几个步骤。

- 发出 HTTP 请求
- 接收服务器传回的数据
- 更新网页数据

## 分类

- `form` 表单提交，表单 POST 提交的三种 `Content-Type`：
  - `text/plain`：用的很少，纯文字。
  - `application/x-www-form-urlencoded`：默认，`url` 编码方式，`xxx=xxx&xxx=xx`。
  - `multipart/form-data`：主要用于上传文件内容。

- `xhr`：通过原生的 `XMLHttpRequest` 对象发出 HTTP 请求，得到服务器返回的数据后，再进行处理。
- `fetch`：是一个 JavaScript 接口，用于访问和操纵 HTTP 管道的一些具体部分，例如请求和响应。作用等同于 XMLHttpRequest，它提供了许多与 XMLHttpRequest 相同的功能，但被设计成更具可扩展性和高效性。
- `WebSocket`：是 HTML5 带的功能，可双向通信，自动跨域，性能高。
- `Navigator.sendBeacon()`

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

### FormData 构造函数

`FormData()` 构造函数用来构造表单数据。主要用于上传文件。

#### 参数

参数可以是一个表单元素，也可以为空。如果没有参数，就表示生成一个空的表单实例，如果参数是一个表单元素，则会处理表单元素里面的键值对。

```js
let data = new FormData();  // 空表单实例
```

```html
<form id="myForm" name="myForm">
  <div>
    <label for="username">用户名：</label>
    <input type="text" id="username" name="username">
  </div>
  <div>
    <label for="useracc">账号：</label>
    <input type="text" id="useracc" name="useracc">
  </div>
  <input type="submit" value="Submit!">
</form>

<script>
let myForm = document.getElementById('myForm');
let formData = new FormData(myForm);   // 生成表单数据

formData.get('username')          // ""
formData.set('username', '张三');
formData.get('username')          // "张三"
</script>
```

#### API

- `get(key)`：获取指定键名对应的键值，参数为键名。如果有多个同名的键值对，则返回第一个键值对的键值。
- `getAll(key)`：返回一个数组，表示指定键名对应的所有键值。如果有多个同名的键值对，数组会包含所有的键值。
- `set(key, value)`：设置指定键名的键值，参数为键名。如果键名不存在，会添加这个键值对，否则会更新指定键名的键值。如果第二个参数是文件，还可以使用第三个参数，表示文件名。
- `append(key, value)`：添加一个键值对。如果键名重复，则会生成两个相同键名的键值对。如果第二个参数是文件，还可以使用第三个参数，表示文件名。
- `delete(key)`：删除一个键值对，参数为键名。
- `has(key)`：返回一个布尔值，表示是否具有该键名的键值对。
- `keys()`：返回一个遍历器对象，用于 `for...of` 循环遍历所有的键名。
- `values()`：返回一个遍历器对象，用于 `for...of` 循环遍历所有的键值。
- `entries()`：返回一个遍历器对象，用于 `for...of` 循环遍历所有的键值对。如果直接用 `for...of` 循环遍历 FormData 实例，默认就会调用这个方法。

## 文件上传

用户上传文件，也是通过表单。

- 利用 FormData 对象，模拟发送到服务器的表单数据。
- 除了发送 FormData 实例，也可以直接 AJAX 发送文件。

```html
<input type="file" id="file" multiple>
<input type="button" id="submit" value="上传" />

<script>
  let oFile = document.querySelector('#file')
  let submit = document.querySelector('#submit')

  submit.onclick = function(){
    // 1. 利用 FormData 对象，模拟发送到服务器的表单数据
    let formData = new FormData();

    for (let i = 0; i < oFile.files.length; i++) {
      // 只上传图片文件
      if (!files[i].type.match('image.*')) {
        continue;
      }
      formData.append('photos[]', files[i], files[i].name);
    }
    xhr.send(formData);

    // 2. 除了发送 FormData 实例，也可以直接 AJAX 发送文件。
    var file = oFile.files[0];
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'xxx');
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  }
</script>
```

## 同源限制

同源政策的目的，是 **浏览器** 为了保证用户信息的安全，防止恶意的网站窃取数据。

### 同源

- 协议相同
- 域名相同
- 端口相同

### 限制范围

- 无法读取非同源网页的 Cookie、LocalStorage 和 IndexedDB。
- 无法接触非同源网页的 DOM。
- 无法向非同源地址发送 AJAX 请求（可以发送，但浏览器会拒绝接受响应）。
- 表单提交不受同源政策的限制。

### AJAX 的跨域

AJAX 只能向同源网址（协议、域名、端口都相同）发出 HTTP 请求，如果发出跨域请求，就会报错。但实际上服务端是可以接收到请求的，只是浏览器会拒绝接受服务器的响应。

除了架设服务器代理（浏览器请求同源服务器，再由后者请求外部服务），以下方法可以规避这个限制：

- JSONP
- WebSocket
- CORS

### JSONP

JSONP 是服务器与客户端跨源通信的常用方法。最大特点就是简单易用，没有兼容性问题，老式浏览器全部支持，服务端改造非常小。然而只能发 GET 请求。

步骤如下：

1. 向网页添加一个 `<script>` 元素，通过 `src` 属性发送 http 请求，向服务器请求一个脚本，这不受同源政策限制，可以跨域请求。`src` 必须有一个 `callback` 参数（`?callback=bar`），用来告诉服务器，客户端的回调函数名称（`bar`）。

2. 服务器收到请求后，拼接一个字符串，将 JSON 数据放在函数名里面，作为字符串返回（`bar({...})`）。

3. 浏览器会将服务器返回的字符串，作为 js 代码解析，因为浏览器认为，这是 `<script>` 标签请求的脚本内容。这时，客户端只要定义了 `bar()` 函数，就会立即调用，并可在该函数体内，拿到服务器返回的 JSON 数据。

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

### CORS

CORS 需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能。且整个 CORS 通信过程，都是浏览器自动完成，不需要用户参与。

CORS 请求分成两类：简单请求和非简单请求。

#### 简单请求

同时满足以下两大条件，就属于简单请求：

- 请求方法是 `HEAD`、`GET`、`POST` 三种方法之一。
- HTTP 的头信息不超出以下几种字段：
  - Accept
  - Accept-Language
  - Content-Language
  - Last-Event-ID
  - `Content-Type`：只限于三个值 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`

**基本流程**

- C->S：浏览器直接发出 CORS 请求，也就是在头信息之中，增加一个 `Origin` 字段，指明本次请求的域（协议 + 域名 + 端口）。
- S->C：服务器根据 `Origin` 值，决定是否同意这次请求。如果同意，服务器则需要返回与 CORS 相关的头信息；如果响应中没有这些头信息，则返回的是一个正常的 HTTP 响应。
- C：浏览器如果发现响应头中有与 CORS 相关的头信息，且与当前请求匹配，则会正常返回数据；如果响应中没有与 CORS 相关的头信息，或与当前请求不匹配，则会认为不允许跨域，就会抛出错误，不返回请求结果。

**与 CORS 相关的响应头信息**

服务器响应中，与 CORS 请求相关的字段，都以 `Access-Control-` 开头。

- `Access-Control-Allow-Origin`：该字段是必须的。它的值可以是请求时 `Origin` 字段的值，也可以是一个 `*`，表示接受任意域名的请求。
- `Access-Control-Allow-Credentials`：该字段可选。它的值是一个布尔值，表示是否允许发送 Cookie。
- `Access-Control-Expose-Headers`：该字段可选。表示是否允许 XMLHttpRequest 对象获取服务器设置的其他 header 字段。

#### 非简单请求

非简单请求是那种对服务器提出特殊要求的请求，比如请求方法是 `PUT` 或 `DELETE`，或者 `Content-Type` 字段的类型是 `application/json`。

**基本流程**

- C->S：浏览器首先会发送一个 `OPTIONS` 预检请求，询问服务器是否允许此次请求。在发送预检请求时，浏览器会带 `Origin` 和有关 CORS 的请求头信息。
- S->C：服务器收到 `OPTIONS` 预检请求以后，可根据 `Origin` 以及 CORS 的请求头做出回应，如果同意，服务器则会返回与 CORS 相关的响应头；如果响应中没有这些头信息，则返回的是一个正常的 HTTP 响应。
- C->S：浏览器根据服务器返回的 `OPTIONS` 响应头，判断是否允许跨域，如果符合条件，则会依照上述简单请求的流程再次发送数据请求；如果不允许跨域，则抛出错误，不会发送数据请求。

**预检时与 CORS 请求相关的请求头信息**

- `Access-Control-Request-Method`：该字段是必须的，用于列出此次请求的 HTTP 方法。
- `Access-Control-Request-Headers`：当需要发送额外的头信息时，浏览器会加上此字段。如 `Content-Type` 为 `application/json` 时就会向服务器发送`'Access-Control-Request-Headers': 'content-type'`。

**预检时与 CORS 请求相关的响应头信息**

- `Access-Control-Allow-Origin`：该字段是必须的。它的值可以是请求时 `Origin` 字段的值，也可以是一个 `*`，表示接受任意域名的请求。
- `Access-Control-Allow-Methods`：该字段是必须的。用于表明服务器支持的所有跨域请求的方法。
- `Access-Control-Allow-Headers`：如果浏览器请求包括 `Access-Control-Request-Headers` 字段，则 `Access-Control-Allow-Headers` 字段是必需的。
- `Access-Control-Allow-Credentials`：该字段可选。它的值是一个布尔值，表示是否允许发送 Cookie。
- `Access-Control-Max-Age`：该字段可选，用来指定本次预检请求的有效期，单位为秒。在有效期内，不用发出另一条预检请求。

#### express 中实现 CORS 跨域

```js
const express = require('express')
let app = express()
app.listen(8080)

app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', "true");
  if (req.method && req.method.toLowerCase() === 'options') {
    return res.send(true);
  }
  next()
})
```

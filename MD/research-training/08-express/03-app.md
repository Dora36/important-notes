## express()

创建一个 Express 应用程序。`express()` 函数是 `express` 模块​​导出的顶级函数。

```js
let express = require('express')
let app = express()
```

## 方法

### express.Router(options)

创建一个新的路由器对象。

```js
let router = express.Router([options]);
```

可以添加中间件和 HTTP 方法路由（如get，put，post，等），以 router 就像一个应用程序。

### express.static(root, [options])

`express.static()` 是 Express 内置的中间件函数，它以 `server-static` 模块为基础开发，负责托管 Express 应用内的静态资源。

`root` 参数指定要从中为静态资产提供服务的根目录。该功能通过 `req.url` 与提供的 `root` 目录结合来确定要提供的文件。当找不到文件时，它不是发送 404 响应，而是调用 `next()` 移动到下一个中​​间件，允许堆叠和回退。

options 对象的属性：

- `dotfiles`：确定如何处理点文件（以 `.` 开头的文件或目录）：
  - `allow`：没有针对 dotfiles 的特殊处理。
  - `deny`：拒绝一个点文件的请求，回应 403，然后调用 `next()`。
  - `ignore`：默认值。像 dotfile 不存在一样，使用 404，然后调用 `next()`。

- `etag`：启用或禁用 etag 生成。注意：`express.static` 总是发送弱 ETags。 

- `extensions`：设置文件扩展名回退：如果找不到文件，请搜索具有指定扩展名的文件并提供找到的第一个文件。例如： `html` ， `htm` 。 

- `fallthrough`：让客户端错误作为未处理的请求发生，否则转发客户端错误。

- `immutable`：在 Cache-Control 响应头中启用或禁用不可变指令。如果启用，还应指定 maxAge 选项以启用缓存。不可变的指令将阻止受支持的客户端在 maxAge 选项生命期间发出条件请求，以检查文件是否已更改。 

- `index`：发送指定的目录索引文件。设置为 false 以禁用目录索引。默认值 `index.html`。

- `lastModified`：将 Last-Modified 标题设置为操作系统上文件的最后修改日期。 

- `maxAge`：以毫秒为单位设置 Cache-Control 标头的 max-age 属性或以 ms 格式设置字符串。 

- `redirect`：当路径名称是目录时，重定向到添加 `/` 的目录。默认值为 `true`。

- `setHeaders`：用于设置 HTTP 头文件的功能。

```js
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

app.use(express.static('public', options))
```

### express.json([options])

`express.json()` 是 Express 内置的中间件函数，其作用是基于 `body-parser` 将请求体（`body`）解析为 JSON 形式。

仅解析 JSON 并且仅作用于 `Content-Type` 头与参数中 `type` 属性匹配的请求。`type` 默认为 `application/json`。该解析器接受 `body` 的任何 Unicode 编码并支持以 `gzip` 和 `deflate` 方式的自动压缩。

`request` 中的 `body` 解析数据即 `req.body` 在该方法执行之后才会被填充到 `req` 对象上。如果没有要解析的主体，或者 `Content-Type` 不匹配或发生错误时，则 `req.body` 为空对象 `{}`。

options 对象的属性：

- `type`：用于确定中间件将解析的媒体类型。默认值为 `application/json`。

- `limit`：控制最大请求主体大小。如果这是一个数字，那么该值指定字节数；如果它是一个字符串，则将该值传递给字节库以供解析。

- `inflate`：启用或禁用处理压缩的物体；当禁用时，压缩的数据体被拒绝。默认 `true`。

- `reviver`：作为第二个参数，reviver 选项直接传递给 `JSON.parse`。
- `strict`
- `verify`

### express.urlencoded(options)

`express.urlencoded()` 是 Express 内置的中间件功能。使用 `urlencoded` 解析传入请求体，并基于 `body-parser`。

同 `express.json()` 一样，但是仅解析 `urlencoded` 的数据体，并仅作用于 `Content-Type` 头与 `type` 选项匹配的请求。`type` 默认值为 `application/x-www-form-urlencoded`。

同样，`body` 在该方法执行之后才会被填充到 `req` 对象上。如果没有要解析的主体，或者 `Content-Type` 不匹配或发生错误时，则 `req.body` 为空对象 `{}`。该对象将包含键-值对，其中属性值可以是一个字符串或阵列（当 extended 是 false），或任何类型（当 extended 是 true）。

options 对象的属性：

- `extended`：此选项允许选择 URL 编码数据的解析方式，使用查询字符串库（如果为 `false`）或 qs 库（如果为 `true`）。该语法允许将丰富的对象和数组编码为 URL 编码格式，从而允许使用 URL 编码的类似 JSON 的体验。默认 `true`。
- `type`：用于确定中间件将解析的媒体类型。默认值为 `application/x-www-form-urlencoded`。
- `parameterLimit`：该选项控制URL编码数据中允许的最大参数数量。如果请求包含的参数多于此值，则会引发错误。
- `limit`
- `inflate`
- `verify`

## app

`app` 对象通常表示 Express 应用程序。通过调用 Express 模块​​导出的顶级函数 `express()` 来创建。

### 属性

- `app.locals`：`app.locals` 对象的属性是应用程序中的局部变量。一旦设置，`app.locals` 属性的值将在应用程序的整个生命周期中持续存在，而 `res.locals` 属性只对请求的生命周期有效。

- `app.mountpath`：包含一个或多个安装子应用程序的路径模式。

### app.METHOD(path, callback , callback ...) 请求方法

- `app.get()`
- `app.post()`
- `app.put()`
- `app.delete()`

### app.all(path, callback , callback ...)

此方法与标准的 `app.METHOD()` 方法类似，只不过它匹配所有 HTTP 请求。

以下回调针对 `/secret` 使用 GET，POST，PUT，DELETE 或任何其他 HTTP 请求方法的请求执行：

```js
app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section ...')
  next() // pass control to the next handler
});
```

`app.all()` 方法对于为特定路径前缀或任意匹配映射“全局”逻辑非常有用。

```js
app.all('*', requireAuthentication, loadUser);

app.all('/api/*', requireAuthentication);
```

### 设置应用程序属性

- `app.disable(name)`：设置 name 属性为 `false`，其中 name 是应用程序设置表中的其中一个属性。调用 `app.set('foo', false)` 作为布尔属性与调用 `app.disable('foo')` 相同。

- `app.disabled(name)`：如果 name 属性为 `false`，返回 `true`。

- `app.enable(name)`：设置 name 属性为 `true`。

- `app.enabled(name)`：name 属性为 `true`，返回 `true`。

```js
app.enable('trust proxy');
app.disabled('trust proxy');   // => false
app.enabled('trust proxy');    // => true
```

### app.listen(port, hostname, backlog, callback)

绑定并侦听指定主机和端口上的连接。此方法与 Node 的 `http.Server.listen()` 相同。

```js
let express = require('express');
let app = express();
app.listen(3000);
```

`express()` 返回的 `app` 实际上是一个函数，旨在传递 HTTP 服务器作为一个回调来处理请求。这使得您可以轻松地使用相同的代码库为您的应用程序提供 HTTP 和 HTTPS 版本，因为应用程序不会从这些应用程序继承（它只是一个回调）：

```js
let express = require('express');
let https = require('https');
let http = require('http');
let app = express();

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
```

### app.param(name, callback)

为路由参数添加回调触发器，其中 name 是参数的名称或它们的数组，并且 callback 是回调函数。回调函数的参数依次为请求对象，响应对象，下一个中间件，参数值和参数名称。

所有 param 回调函数都将在 param 出现的任何路由的任何处理程序之前被调用，并且它们将在 请求 - 响应 循环中仅被调用一次，即使参数在多个路由中匹配。

```js
app.param(['id', 'page'], function (req, res, next, value) {
  console.log('CALLED ONLY ONCE with', value);
  next();
});

app.get('/user/:id/:page', function (req, res, next) {
  console.log('although this matches');
  next();
});

app.get('/user/:id/:page', function (req, res) {
  console.log('and this matches too');
  res.end();
});

// 请求为 GET /user/42/3 时打印数据为：
// CALLED ONLY ONCE with 42
// CALLED ONLY ONCE with 3
// although this matches
// and this matches too
```

### app.set(name, value)、app.get(name)

设置 name 的属性为 value 值，可以存储所需的任何值，但某些名称可用于配置服务器的行为。

用 app.get() 检索设置的值。

```js
app.set('title', 'My Site');
app.get('title');            // "My Site"
```

### app.use([path,] callback [, callback...])

在指定的路径上安装指定的一个或多个中间件函数，当所请求路径与 `path` 匹配时，将执行中间件函数。

路由将匹配紧随其后的任何路径，并带有 `/`。 例如：`app.use('/apple'，...)` 将匹配 `/apple`，`/apple/images`，`/apple/images/news`，依此类推。

由于路径默认为 `/`，因此不带路径的 `app.use()` 将为应用程序的每个请求执行安装的中间件。

```js
// 该中间件功能将在每个请求发生时都执行。
app.use(function (req, res, next) {
  console.log('Time: %d', Date.now())
  next()
})
```

## 中间件函数

Express 是一个路由和中间件 Web 框架，其自身的功能很少，Express 应用程序本质上是一系列中间件函数调用。

### 功能

中间件函数接收请求对象 `req`，响应对象 `res`，以及堆栈中的下一个中间件 `next` 为参数。并含有如下功能：

- 可执行任何代码。

- 更改请求和响应对象。

- 结束 请求-响应 周期。

- 调用堆栈中的下一个中间件。

如果当前中间件函数没有结束 请求-响应 周期，则它必须调用 `next()` 来将控制权传递给下一个中间件函数。否则，该请求将被挂起。

### 加载

需要通过 `app.use()` 加载中间件函数。中间件的加载顺序很重要：首先加载的中间件功能也将首先执行。

```js
let express = require('express')
let app = express()

let requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

app.use(requestTime)

app.get('/', function (req, res) {
  let responseText = 'Hello World!<br>'
  responseText += '<small>Requested at: ' + req.requestTime + '</small>'
  res.send(responseText)
})

app.listen(3000)
```

### 中间件传参

如果需要可配置的中间件，可导出一个接受选项对象或其他参数的函数，然后再根据输入参数返回中间件。

```js
// my-middleware.js
module.exports = function (options) {
  return function (req, res, next) {
    // ...
    next()
  }
}
```

```js
// app.js
let mw = require('./my-middleware.js')
app.use(mw({ option1: '1', option2: '2' }))
```

### 中间件分类

- 应用级别中间件：使用 `app.use()` 或 `app.METHOD()` 加载中间件。

- 路由级别中间件：路由器级中间件的工作方式与应用程序级中间件相同，只不过它绑定到 `express.Router()` 的实例。因此使用`router.use()` 以及 `router.METHOD()` 加载。

- 错误处理中间件：接收四个参数，`err`，`req`，`res`，`next`。

- 内置中间件：`express.static()`、`express.json()`、`express.urlencoded()`。

- 第三方中间件：安装 node 模块。如 `cookie-parser`，`app.use(cookieParser())`。

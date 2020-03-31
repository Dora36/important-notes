
## 路由 app.METHOD()

路由是指确定应用程序如何响应客户端对特定端点的请求，该特定端点是 URI（或路径）和特定的 HTTP 请求方法（GET，POST等）。

路由定义采用以下结构：

```js
app.METHOD(PATH, HANDLER)
```

- `app`：express 的实例对象。
- `METHOD`：HTTP 的 request 方法，`get`、`post`、`put` 等，方法名小写。
- `PATH`：服务端的路径（不包含查询字符串），用于匹配前端请求的路径，可以是字符串或字符串模式或正则表达式。
- `HANDLER`：当路由匹配时的处理函数。

```js
app.post('/', (req, res) => {
  res.send('Got a POST request')
})
```

### PATH 路径

Express 使用 [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) 来匹配路由路径，所以支持很多高级的匹配模式，以及正则表达式。

字符串模式：字符 `？`，`+`，`*` 和 `()` 是其正则表达式对应项的子集。连字符 `-` 和点 `.` 由基于字符串的路径逐字解释。

- `'/ab?cd'`：匹配 acd 或 abcd。`?` 表示某个模式出现 0 次或 1 次。
- `'/ab+cd'`：匹配 abcd, abbcd, abbbcd 等等。`+` 表示某个模式出现 1 次或多次。
- `'/ab*cd'`：匹配 abcd, abxcd, abRANDOMcd, ab123cd 等等。`*` 表示通配符，代表 0 个或多个字符。
- `'/ab(cd)?e'`：匹配 abe 或 abcde。`()` 括号可以用来匹配分组。

### 路由参数

**定义**

路由参数在 URL 中声明，通过冒号 `:` 定义，用于捕获发出请求的路径在参数位置处指定的值。捕获的参数值将添加到 `req.params` 对象中，并用在 URL 中指定的路由参数的名称作为其键名。

```js
// 请求 url：http://localhost:3000/users/34/books/8989
app.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params)   // { "userId": "34", "bookId": "8989" }
})
```

路由参数的名称必须由字母、数字或下划线（`/[A-Za-z0-9_]/`）组成。

**与连字符和点共用**

由于连字符 `-` 和点 `.` 是按字面解释的，因此可以将它们与路由参数一起使用，以实现有用的目的。

```js
// 请求 url：http://localhost:3000/users/34-8989
app.get('/users/:userId-:bookId', function (req, res) {
  res.send(req.params)   // { "userId": "34", "bookId": "8989" }
})
```

```js
// 请求 url：http://localhost:3000/users/34.8989
app.get('/users/:userId.:bookId', (req, res) => {
  res.send(req.params)   // { "userId": "34", "bookId": "8989" }
})
```

**正则匹配参数值**

为了更好地限制由路由参数匹配的参数值，可以在路由参数的参数名后面用括号 `()` 附加一个正则表达式，来匹配请求路径中的参数值：

```js
// 请求 url：http://localhost:3000/user/42
app.get('/users/:userId(\\d+)', (req, res) => {
  res.send(req.params)   // {"userId": "42"}
})
```

上述只能匹配参数值为数字的情况，带字母或特殊字符的一律返回 404。

因为正则表达式通常是文字字符串的一部分，所以需要反斜杠转义 `\` 字符，例如 `\\d+`。

### HANDLER 回调函数

每个路由可以具有一个或多个处理程序函数，这些函数在路由匹配时执行。对于多个回调函数，重要的是提供 `next` 作为回调函数的参数，然后在函数内调用 `next()` 将控制权移交给下一个回调。

路由处理程序可以采用函数，函数数组或二者组合的形式，如：

```js
// 组合形式回调
var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

app.get('/example/d', [cb0, cb1], function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next()
}, function (req, res) {
  res.send('Hello from D!')
})
```

## app.route()

可以使用 `app.route()` 链式创建路由。当路径相同，请求方法不同时，该方法非常有用，类似于 Restfull api：

```js
app.route('/book')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  })
```

## app.all()

有一个特殊的路由方法 `app.all()`，用于 **在指定路径上** 为所有类型的 HTTP 请求方法加载中间件。

例如，无论使用 GET，POST，PUT，DELETE 还是 http 模块支持的任何其他 HTTP 请求方法，都会对路由 `/secret` 的请求执行以下处理程序：

```js
app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section ...')
  next() // pass control to the next handler
})
```

## express.Router

可以使用 `express.Router` 类创建模块化的可安装的路由处理程序。路由器实例是一个完整的中间件和路由系统。

由路由器创建的模块，可以在其中加载中间件功能，定义一些路由处理函数，然后将路由器模块安装在主应用程序的路径上：

```js
// ./routes/some.js
let express = require('express')
let router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
router.get('/', function (req, res) {
  res.send('Some home page')
})
router.get('/about', function (req, res) {
  res.send('About some')
})
module.exports = router
```

在 app.js 中加载：

```js
let someRouter = require('./routes/some')
app.use('/some', someRouter)
```

### Router

router 对象是中间件和路由的实例，仅能够执行中间件和路由功能。每个 Express 应用程序都有一个内置的应用路由器。

路由器类似于中间件，因此可以将其作为 `app.use()` 的参数或用作另一个路由实例的 `use()` 方法的参数。

顶级 `express` 对象具有一个 `Router()` 方法，可以用该方法创建一个新的路由器。

一旦创建路由器后，就可以像应用程序一样向其添加中间件和 HTTP 方法路由（例如 get，put，post 等）。 例如：

```js
var express = require('express');
var router = express.Router();

// 在匹配到任何进入该路由的请求时调用
router.use(function (req, res, next) {
  // 类似于其余中间件
  next()
})

// 添加 http 方法
router.get('/events', function (req, res, next) {
  // ..
})
module.exports = router;
```

然后，可以将路由实例用于特定的根 URL，以这种方式将路由分为文件或甚至是微型应用程序：

```js
// 只有 /calendar/* 路径的请求，会被传递给 router
app.use('/calendar', router)
```

## Request 

`req` 对象代表 HTTP 请求，并具有请求查询字符串，参数，body 体，HTTP 头等属性。

- `req.originalUrl`：请求的原始 url 的路径及查询参数部分。

- `req.baseUrl`：路由器实例在 app 中挂载的 URL 路径。如 `app.use('/some', someRouter)` 中的 `/some`。

- `req.url`：node 的 http 模块自有的属性，与 originalUrl 的区别是 不包含 baseUrl 部分。

- `req.path`：请求 url 的路径部分，即 baseUrl 之后的路径部分。

- `req.params`：是一个对象，包含路由参数（用冒号设置的 url 参数）的属性。该对象默认为 `{}`。

- `req.query`：是一个对象，其中包含路由中每个查询字符串参数的属性。如果没有查询字符串，则为空对象 `{}`。

    ```js
    // app.js
    app.use('/test', require('./routes/test'));
    ```

    ```js
    // ./routes/test.js
    // 请求的 url：'http://localhost:3000/test/post/36?a=9'
    router.post('/post/:id', function (req, res) {
      res.json({
        originalUrl: req.originalUrl,    // "/test/post/36?a=9"
        baseUrl: req.baseUrl,            // "/test"
        url: req.url,                    // "/post/36?a=9"
        path: req.path,                  // "/post/36"
        params: req.params,              // {id: "36"}
        query: req.query                 // {a: "9"}
      })
    })
    ```

- `req.body`：包含在请求正文中提交的数据的键值对，get 没有，post 有。默认情况下，是没有该属性的。会在通过 `express.json()` 或 `express.urlencoded()` 解析中间件时添加到 `req` 对象上。

- `req.cookies`：默认没有该属性，只有使用 `cookie-parser` 中间件时，此属性是一个包含请求发送的 cookie 的对象。如果请求中不包含 Cookie，则默认为 `{}`。

- `req.signedCookies`：带签名的 cookie。

    ```js
    let express = require('express')
    let app = express()

    // 添加 body 属性
    app.use(express.json())                          // 解析 application/json
    app.use(express.urlencoded({ extended: false })) // 解析 application/x-www-form-urlencoded

    // 添加 cookies 属性
    let cookieParser = require('cookie-parser')
    app.use(cookieParser())

    app.post('/profile', function (req, res, next) {
      res.json(req.body)
    })
    ```

- `req.protocol`：请求的协议，http 或 https。

- `req.secure`：是否是 https 请求，是为 true。

- `req.hostname`：请求头中 `Host` 的主机名。如果配置了代理，则此属性将从 `X-Forwarded-Host` 头字段获取值。此字段可由客户端或代理设置。

- `req.subdomains`：请求的域名中的子域数组。

- `req.ip`：发送请求的远程IP地址。

- `req.method`：发送请求的 HTTP 方法，GET，POST，PUT 等等。

- `req.fresh`：表示请求是否 fresh，与 `req.stale` 相反。与请求头的配置有关，`cache-control` 头没有 `no-cache` 时为 `true` 等等。

- `req.app`：此属性保存对使用中间件的 Express 应用程序实例的引用。如果遵循创建仅导出中间件功能并将其在主文件中的 `require()` 的模块的模式，则中间件可以通过 `req.app` 访问 Express 实例。

## Response

res 对象表示 Express 应用在收到 HTTP 请求时发送的 HTTP 响应。

下列响应对象 `res` 上的方法可以向客户端发送响应，并终止 请求 - 响应 周期。 如果路由处理中未调用这些方法，则客户端请求将被挂起。

- `res.download()`：提示要下载的文件。
- `res.end()`：结束响应进程。
- `res.json()`：发送 JSON 响应。
- `res.jsonp()`：发送带有 JSONP 支持的 JSON 响应。
- `res.redirect()`：重定向请求。
- `res.render()`：渲染一个视图模版。
- `res.send()`：发送多种类型的响应。
- `res.sendFile()`：将文件作为八位字节流发送。
- `res.sendStatus()`：参数为 http 状态码，作用为设置响应状态代码，并将其字符串表示形式发送为响应正文。

其余方法：

- `res.append(field [, value])`：将指定的值附加到 HTTP 响应头。如果没有设置，则创建相应的头信息。value 参数可以是字符串或数组。

- `res.set(field [, value])`：重置 HTTP 响应头。如果要一次设置多个字段，可传递一个对象作为参数。

- `res.cookie()`：设置 cookie。

- `res.clearCookie()`：清除指定属性名的 cookie 值。

- `res.status(code)`：设置响应的 HTTP 状态。可链式调用，是 node 中的 `response.statusCode` 别名。

- `res.type(type)`：设置 `Content-Type` 头信息。

## 简单用法

```shell
mkdir myexpress
cd myexpress
npm init -y
npm install express -S
```

```js
// server.js
const express = require('express')
const app = express()
const port = 3000
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log('http://localhost:' + port))
```

命令行运行 `node server.js` 即可启动这个应用程序的服务器，并在端口 3000 上侦听连接。该应用会在根 URL（`/`）或路由的请求中显示“Hello World！”。对于其他所有路径，将会返回 `404 Not Found` 响应。

## express-generator 应用程序生成器

通过应用生成器工具 `express-generator` 可以快速创建一个应用的骨架。

```shell
express my-express
cd my-express
npm install

npm start
# or
DEBUG=my-express:* npm start
```

通过生成器创建的应用一般都有如下目录结构：

```
├── bin
│   └── www
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
├── views
│   ├── error.pug
│   ├── index.pug
│   └── layout.pug
├── app.js
└──package.json
```

### 启动

安装 `nodemon` 实时启动，即修改 `app.js` 后会自动更新。

```shell
npm install nodemon -D
```

```json
// package.json
"scripts": {
  "start": "node ./bin/www",
  "devstart": "nodemon ./bin/www"
}
```

## 利用 Express 托管静态文件

可使用 Express 中的 `express.static` 内置中间件函数，来提供诸如图像、CSS 文件和 JavaScript 文件之类的静态文件。

```js
app.use(express.static('public'))
```

上述代码就可以将 `public` 目录下的图片、CSS 文件、JavaScript 文件对外开放访问了。Express 在静态目录查找文件，因此，存放静态文件的目录名不会出现在 URL 中。

如果要使用多个静态资源目录，可多次调用 `express.static` 中间件函数：

```js
app.use(express.static('public'))
app.use(express.static('static'))
```

访问静态资源文件时，`express.static` 中间件函数会根据目录的添加顺序查找所需的文件。

要为 `express.static` 函数提供路径前缀，可为静态目录指定访问路径，如下所示：

```js
app.use('/static', express.static('public'))
```

这时就可以通过带有 `/static` 前缀地址来访问 `public` 目录中的文件了。

然而，提供给 `express.static` 函数的路径是相对于启动节点进程的目录的。如果需要从另一个目录运行 Express App，则使用目录的绝对路径更为安全：

```js
app.use('/static', express.static(path.join(__dirname, 'public')))
```

## 使用 mongoose 连接 mongodb

```shell
npm install mongoose -S
```

```js
// ./utils/db.js
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/express", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('connected', () => {
  console.log('mongodb connected ');
});
db.on('error', (error) => {
  console.log('mongodb error ');
});
db.on('disconnected', () => {
  console.log("disconnected....");
});
```

在 app.js 中引入：

```js
require('./utils/db');
```

## axios 概述

Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。

**特性**

- 从浏览器中创建 XMLHttpRequests
- 从 node.js 创建 http 请求
- 支持 Promise API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 XSRF

## 使用

**安装**

使用 npm：

```shell
npm install axios
```

使用 cdn：

```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

**示例**

```js
// 为给定 ID 的 user 创建请求
axios.get('/user?ID=12345')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

// 上面的请求也可以这样做
axios.get('/user', {
  params: {
    ID: 12345
  }
}).then(function (response) {
  console.log(response);
}).catch(function (error) {
  console.log(error);
});

axios.post('/user', {
  name: 'dora'
}).then(function (response) {
  console.log(response);
}).catch(function (error) {
  console.log(error);
});
```

## axios(config)

`axios` 是使用默认配置 `defaults` 通过 `Axios` 构造函数创建出来的默认配置实例。该实例的默认配置为 `axios.defaults`。

可以通过向 `axios()` 方法传递相关配置来创建请求。

`axios(url[, config])` 可直接传入 `url` 参数，默认发送 `GET` 请求。

```js
// 发送 GET 请求（默认的方法）
axios('/user/12345');
```

也可传入 `config` 配置对象。

```js
// 发送 POST 请求
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    name: 'dora'
  }
});
```

### config

`config` 是创建请求时的配置选项。只有 `url` 是必需的。如果没有指定 `method`，请求将默认使用 `get` 方法。

- `url`：用于请求的服务器 URL。

- `method`：创建请求时使用的方法。默认使用 `get`。

- `baseURL`：将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL。

- `transformRequest`：数组函数，用于在向服务器发送前，修改请求数据。只能用在 `PUT`，`POST` 和 `PATCH` 这几个请求方法中，数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream。

- `transformResponse`：数组函数，在响应数据传递给 `then` 或 `catch` 前，允许修改响应数据。

- `headers`：即将被发送的自定义请求头。一个对象字面量。

- `params`：与请求一起发送的 URL 查询参数，必须是一个普通对象或 URLSearchParams 对象。

- `paramsSerializer`：是一个负责 `params` 序列化的函数。

- `data`：作为请求主体被发送的数据，只适用于 `PUT`，`POST` 和 `PATCH` 这些请求方法。在没有设置 `transformRequest` 时，必须是以下类型之一：
  - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  - 浏览器专属：FormData, File, Blob
  - Node 专属： Stream

- `timeout`：指定请求超时的毫秒数（0 表示无超时时间）。如果请求话费了超过 `timeout` 的时间，请求将被中断。

- `withCredentials`：表示跨域请求时是否需要使用凭证。默认 `false`。

- `adapter`：函数，允许自定义处理请求，以使测试更轻松。返回一个 `promise` 并应用一个有效的响应。

- `auth`：表示应该使用 HTTP 基础验证，并提供凭据。这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头。

- `responseType`：表示服务器响应的数据类型，可以是 `arraybuffer`，`blob`，`document`，`json`（默认），`text`，`stream`。

- `responseEncoding`：默认 `utf8`。

- `onUploadProgress`：为上传处理进度事件。

- `onDownloadProgress`：为下载处理进度事件。

- `maxContentLength`：定义允许的响应内容的最大尺寸。

- `validateStatus`：定义对于给定的 HTTP 响应状态码是 `resolve` 或 `reject`。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 `resolve`；否则，promise 将被 `reject`。

- `maxRedirects`：定义在 node.js 中 `follow` 的最大重定向数目。如果设置为 0，将不会 `follow` 任何重定向。默认 5。

```js
{
  transformRequest: [function (data, headers) {
    // 对 data 进行任意转换处理
    return data;
  }],

  transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    return data;
  }],

  paramsSerializer: function(params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  validateStatus: function (status) {
    return status >= 200 && status < 300;  // 默认
  },
}
```

### 响应结构

一个请求的响应包含以下信息：

- `data`：由服务器提供的响应。

- `status`：来自服务器响应的 HTTP 状态码。

- `statusText`：来自服务器响应的 HTTP 状态信息。

- `headers`：服务器响应的头。

- `config`：为请求提供的配置信息。没有自定义配置的都会默认生成。

- `request`：生成此响应的请求。在 node.js 中是最后（重定向之后） ClientRequest 实例。在浏览器中是 XMLHttpRequest 实例对象。

```js
axios.get('/user/12345')
  .then(function(res) {
    console.log(res.data);         // 默认为 json 形式的数据
    console.log(res.status);       // 200
    console.log(res.statusText);   // "OK"
    console.log(res.headers);      // headers 对象
    console.log(res.config);       // config 对象，包含 config 的设置属性
  });
```

## 请求方法的别名

在使用别名方法时，`url`、`method`、`data` 这些属性都不必在 config 配置中指定。

- `axios.request(config)`
- `axios.get(url[, config])`
- `axios.delete(url[, config])`
- `axios.head(url[, config])`
- `axios.options(url[, config])`
- `axios.post(url[, data[, config]])`
- `axios.put(url[, data[, config]])`
- `axios.patch(url[, data[, config]])`

参考链接：

[axios中文文档](http://www.axios-js.com/zh-cn/docs/index.html)

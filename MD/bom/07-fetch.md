## 基本概念

Fetch API  提供了一个 JavaScript 接口，用于访问和操纵 HTTP 管道的一些具体部分，例如请求和响应。作用等同于 XMLHttpRequest，它提供了许多与 XMLHttpRequest 相同的功能，但被设计成更具可扩展性和高效性。

Fetch 的核心在于对 HTTP 接口的抽象，包括 `Request`，`Response`，`Headers`，`Body`，以及用于初始化异步请求的全局 `fetch()` 方法，该方法提供了一种简单，合理的方式来跨网络异步获取资源。

## fetch()

发送请求或者获取资源，需要使用 `WorkerOrGlobalScope.fetch()` 方法。它在很多接口中都被实现了，更具体地说，是在 `Window` 和 `WorkerGlobalScope` 接口上。因此在几乎所有环境中都可以用这个方法获取到资源。

即 `window.fetch()` 方法用于发起获取资源的请求。

`fetch()` 方法由 `Content Security Policy` 的 `connect-src` 指令控制，而不是它请求的资源。

注意：`fetch()` 方法的参数与 `Request()` 构造器是一样的。

### 语法 `fetch(input[, init])`

**参数**

- `input`：定义要获取的资源。
  - `URL`：获取资源的 URL。
  - 一个 `Request` 实例对象。

- `init`：一个配置项对象，包括所有对请求的设置。参数都可选：

  - `method`：请求使用的方法，如 `GET`、`POST`、`HEAD`等。

  - `headers`：请求的头信息，形式为 `Headers` 实例对象或包含 `ByteString` 值的对象字面量。

  - `body`：请求的 `body` 信息，可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象。注意 `GET` 或 `HEAD` 方法的请求不能包含 `body` 信息。

  - `mode`：请求的模式，如 `cors`、 `no-cors` 或者 `same-origin`。

  - `cache`：请求的 cache 模式，`default`、`no-store`、`reload`、`no-cache`、`force-cache` 或者 `only-if-cached`。

  - `credentials`：发送包含凭据的请求（即使是跨域源），如 `omit`、`same-origin` 或者 `include`。为了在当前域名内自动发送 `cookie`，必须提供这个选项。

  - `redirect`：可用的 redirect 模式，`follow` (自动重定向)，`error` (如果产生重定向将自动终止并且抛出一个错误)，或者 `manual` (手动处理重定向)。

  - `referrer`：一个 USVString 可以是 `no-referrer`、`client` 或一个 `URL`。默认是 `client`。

  - `referrerPolicy`：指定了 HTTP 头部 `referer` 字段的值。可能为 `no-referrer`、`no-referrer-when-downgrade`、`origin`、 `origin-when-cross-origin`、`unsafe-url`。

  - `integrity`：包括请求的 subresource integrity 值

**返回值**

返回一个 `promise`，这个 promise 会在请求响应后被 `resolve`，并传回 `Response` 实例对象，也就是一个 HTTP 响应。

当遇到网络错误时，`fetch()` 返回的 promise 会被 `reject`，并传回 TypeError，虽然这也可能因为权限或其它问题导致。成功的 `fetch()` 检查不仅要包括 promise 被 `resolve`，还要包括 `Response.ok` 属性为 `true`。

当接收到一个代表错误的 HTTP 状态码时，从 `fetch()` 返回的 Promise 不会被标记为 `reject`， 即使响应的 HTTP 状态码是 404 或 500。相反，它会将 Promise 状态标记为 `resolve` （但是会将 `resolve` 的返回值的 `ok` 属性设置为 `false` ），仅当网络故障时或请求被阻止时，才会标记为 `reject`。

```js
fetch('http://example.com/movies.json', {          // fetch() 参数也可以是 Request 实例对象
  method: 'POST',
  body: JSON.stringify(data),                      // body 必须匹配 'Content-Type' 头信息
  headers: { 'Content-Type': 'application/json' }  // 可以是 Headers 实例对象，也可以是一个对象字面量
}).then( res => {             // res 为 Response 实例对象
  if(res.ok) {                   
    return res.json();
  }
  throw new Error('error');
}).then( myJson => {
  console.log(myJson);
}).catch( error => {
  console.log(error.message);
});
```

## Headers

Headers 接口允许对 HTTP **请求头** 和 **响应头** 执行各种操作。这些操作包括检索，设置，添加和删除。一个 Headers 对象具有关联的头列表，它最初为空，由零个或多个键值对组成。在该接口的所有方法中，标题名称由不区分大小写的字节序列匹配。
 
一个 Headers 对象也有一个关联的 `guard`，它具有不可变的值，`immutable`、`request`，`request-no-cors`，`response` 或 `none`。这会影响 `set()`，`delete()`，和 `append()` 方法改变 header。

可以通过 `Request.headers` 和 `Response.headers` 属性检索一个 Headers 对象，也可以通过 `Headers()` 构造函数来创建。

### 创建

可以通过 `Headers()` 构造函数来创建一个 `headers` 实例对象。之后可以使用实例对象的 `append()` 之类的方法添加键值对。

- `append()`：给现有的 header 末尾添加一个值，或者添加一个未存在的 header 并赋值。

- `set()`：替换现有的 header 的值, 或者添加一个未存在的 header 并赋值。

可以通过实例的 `append` 方法创建键值对：

```js
let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("X-Custom-Header", "aaa");
myHeaders.append("X-Custom-Header", "bbb");
```

也可以向构造函数传一个多维数组或者对象字面量：

```js
let myHeaders = new Headers({
  "Content-Type": "application/json",
  "X-Custom-Header": "ProcessThisImmediately",
});
```

### 获取

- `has()`：以布尔值的形式从 Headers 对象中返回是否存在指定的 header。

- `get()`：字符串，以逗号 + 空格的形式从 Headers 对象中返回指定 header 的 **全部值**。

- `keys()`：以迭代器的形式返回 Headers 对象中所有存在的 header 名。

- `values()`：以迭代器的形式返回 Headers 对象中所有存在的 header 的值。

- `entries()`：以迭代器的形式返回 Headers 对象中所有的键值对。

```js
console.log(myHeaders.get("X-Custom-Header"));   // aaa, bbb
```

### 删除

- `delete()`：从 Headers 对象中删除指定 header。

### Guard

Guard 是 Headers 对象的特性，基于不同的情况，它可以有以下取值：`immutable`、`request`、`request-no-cors`、`response` 或 `none`。

头信息的 `guard` 会影响 `set()`、`delete()` 和 `append()` 方法。如果试图修改 `guard` 是 `immutable` 的 Headers 对象，那么会抛出一个 TypeError。

当使用 `Headers()` 构造函数创建一个新的 Headers 对象的时候，它的 `guard` 被设置成 `none`（默认值）。当创建 `Request` 或 `Response` 对象的时候，将拥有一个按照一定规则与之关联的 guard。

## Body

Body 代表响应或请求的正文，允许你声明其内容类型是什么以及应该如何处理。Body 被 Request 和 Response 实现，并为这些对象提供了一个相关联的主体（字节流），一个是否已使用的标志（最初未设置）和一个 MIME 类型（最初为空字节序列）。

不管是请求还是响应都能够包含 body 对象。body 也可以是以下任意类型的实例。

- ArrayBuffer
- ArrayBufferView (Uint8Array等)
- Blob/File
- string
- URLSearchParams
- FormData

Body 类定义了以下属性和方法，这些方法都被 Request 和 Response 所实现，以获取 body 内容。这些方法都会返回一个被解析后的 Promise 对象和数据。

**属性：**

- `body`：一个简单的 getter 用于暴露一个 ReadableStream 类型的主体内容。

- `bodyUsed`：一个 Boolean 值指示 body 是否已经被读取。

**方法：**

这些方法都会返回一个 Promise 对象，并且会将 `bodyUsed` 状态改为 `true` 表示已使用。

- `json()`：Promise 对象的 resolve 参数类型是使用 JSON 解析 body 文本的结果。
- `text()`：Promise 对象的 resolve 参数类型是 USVString。
- `formData()`：Promise 对象的 resolve 参数类型是 FormData表单。
- `arrayBuffer()`：Promise 对象的 resolve 参数类型是 ArrayBuffer。
- `blob()`：Promise 对象的 resolve 参数类型是 Blob。

## Response

可以使用 `Response()` 构造函数来创建一个 Response 对象，也可通过其它 API 返回 Response 对象。

常见的实例属性是 `fetch()` 处理完 promise 请求之后返回的 Response 实例对象，其属于请求的 **响应数据**。

### 属性

所有属性都是只读属性。

- `status`：整数，response 的状态码，默认值为 200。
- `statusText`：字符串，该值与 HTTP 状态码消息对应，默认值为 `OK`。
- `ok`：返回布尔值，标示该 Response 成功与否，HTTP 状态码的范围在 200 - 299 之间表示成功，返回 `true`。
- `headers`：包含此 Response 所关联的 Headers 对象。
- `redirected`：表示该 Response 是否来自一个重定向，如果是的话，它的 URL 列表将会有多个条目。
- `type`：包含 Response 的类型，例如 `basic`、`cors`。
- `url`：包含 Response 的 URL。
- `body`：一个简单的 `getter`，用于暴露一个 `ReadableStream` 类型的 `body` 内容。
- `bodyUsed`：包含了一个布尔值来标示该 Response 是否读取过 `Body`。因为 Responses 对象被设置为了 stream 的方式，所以只能被读取一次，通过该属性来标示。

### 方法

Response 实现了 Body 接口，所以可以使用如下来自 Body 的方法，调用这些方法后，会读取 Response 对象并且将 `bodyUsed` 设置为已读，即 `bodyUsed` 属性变为 `true`。

- `json()`：读取 Response 对象并返回一个被解析为 JSON 格式的 Promise 对象。
- `text()`：读取 Response 对象并返回一个被解析为 USVString 格式的 Promise 对象。
- `formData()`：读取Response 对象并返回一个被解析为 FormData 格式的 Promise 对象。
- `arrayBuffer()`：读取 Response 对象并返回一个被解析为 ArrayBuffer 格式的 Promise 对象。
- `blob()`：读取 Response 对象并返回一个被解析为 Blob 格式的 Promise 对象。

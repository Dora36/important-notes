## History 对象

History 对象保存了当前窗口访问过的所有页面网址。由于安全原因，浏览器不允许脚本读取这些地址，但是允许在地址之间导航。浏览器工具栏的“前进”和“后退”按钮，其实就是对 History 对象进行操作。

如果 URL 的锚点值（即 hash）变了，也会在 History 对象创建一条浏览记录。

### 属性 `history.`

- `length`：当前窗口访问过的网址数量（包括当前网页）。

- `state`：History 堆栈最上层的状态值。通常是 `undefined`，即未设置。

### 方法 `history.`

- `back()`：移动到上一个网址，等同于点击浏览器的后退键。对于第一个访问的网址，该方法无效果。

- `forward()`：移动到下一个网址，等同于点击浏览器的前进键。对于最后一个访问的网址，该方法无效果。

- `go()`：接受一个整数作为参数，以当前网址为基准，移动到参数指定的网址，比如 `go(1)` 相当于 `forward()`，`go(-1)` 相当于 `back()`。如果参数超过实际存在的网址范围，该方法无效果；如果不指定参数，默认参数为 `0`，相当于刷新当前页面。

- `pushState()`：用于在历史中添加一条记录。不会触发页面刷新，只是导致 History 对象发生变化，地址栏会有反应。如果 `pushState `的 URL 参数设置了一个新的锚点值（即hash），并不会触发 `hashchange` 事件。

- `replaceState()`：用来修改 History 对象的当前记录，其他都与 `pushState()` 方法一模一样。

### 事件

- `popstate`：每当同一个文档的浏览历史（即history对象）出现变化时，就会触发 `popstate` 事件。仅仅调用 `pushState()` 方法或 `replaceState()` 方法 ，并不会触发该事件，只有用户点击浏览器倒退按钮和前进按钮，或者使用 JavaScript 调用 `history.back()`、`history.forward()`、`history.go()` 方法时才会触发。

## Location 对象

Location 对象是浏览器提供的原生对象，提供 URL 相关的信息和操作方法。通过 `window.location` 和 `document.location` 属性，可以拿到这个对象。

### 属性

- `href`：整个 URL。

- `protocol`：当前 URL 的协议，包括冒号 `:`。

- `host`：主机。如果端口不是协议默认的 80 和 433，则还会包括冒号 `:` 和端口。

- `hostname`：主机名，不包括端口。

- `port`：端口号。

- `pathname`：URL 的路径部分，从根路径 `/` 开始。

- `search`：查询字符串部分，从问号 `?` 开始。

- `hash`：片段字符串部分，从 `#` 开始。

- `username`：域名前面的用户名。

- `password`：域名前面的密码。

- `origin`：URL 的协议、主机名和端口。

```js
// 当前网址为 http://user:passwd@www.example.com:4097/path/a.html?x=111#part1
location.protocol      // "http:"
location.host          // "www.example.com:4097"
location.hostname      // "www.example.com"
location.port          // "4097"
location.pathname      // "/path/a.html"
location.search        // "?x=111"
location.hash          // "#part1"
location.username      // "user"
location.password      // "passwd"
location.origin        // "http://user:passwd@www.example.com:4097"
```

这些属性里面，只有origin属性是只读的，其他属性都可写。

注意，如果对 `href` 写入新的 URL 地址，浏览器会立刻跳转到这个新地址。常常用于让网页自动滚动到新的锚点。

```js
location.href = '#top';
// 等同于
location.hash = '#top';
```

## URL 的编码和解码

网页的 URL 只能包含合法的字符。合法字符分成两类：

- URL 元字符：分号 `;`，逗号 `,`，斜杠 `/`，问号 `?`，冒号 `:`，at `@`，`&`，等号 `=`，加号 `+`，美元符号 `$`，井号 `#`。
- 语义字符：`a-z`，`A-Z`，`0-9`，连词号 `-`，下划线 `_`，点 `.`，感叹号 `!`，波浪线 `~`，星号 `*`，单引号 `'`，圆括号 `()`。

除了以上字符，其他字符出现在 URL 之中都必须转义，将每个字节转为百分号 `%` 加上两个大写的十六进制字母。

### URL 的编码/解码方法

JavaScript 提供四个 URL 的编码/解码方法：

- `encodeURI()`：用于转码整个 URL。它的参数是一个字符串，代表整个 URL。它会将元字符和语义字符之外的字符，都进行转义。

- `encodeURIComponent()`：用于转码 URL 的组成部分，会转码除了语义字符之外的所有字符，即元字符也会被转码。所以，它不能用于转码整个 URL。它接受一个参数，就是 URL 的片段。

- `decodeURI()`：用于整个 URL 的解码。它是 `encodeURI()` 方法的逆运算。它接受一个参数，就是转码后的 URL。

- `decodeURIComponent()`：用于URL 片段的解码。它是 `encodeURIComponent()` 方法的逆运算。它接受一个参数，就是转码后的 URL 片段。

## URL 构造函数

`new URL(input[, base])`：通过将 `input` 相对于 `base` 进行解析，创建一个新的 URL 对象。

- `input`：要解析的绝对或相对的 URL。如果 `input` 是相对路径，则需要 `base`。 如果 `input` 是绝对路径，则忽略 `base`。
- `base`：如果 `input` 不是绝对路径，则为要解析的基本 URL。

### url 对象

URL 实例的属性与Location对象的属性基本一致，返回当前 URL 的信息。

- `url.href`：返回整个 URL
- `url.protocol`：返回协议，以冒号 `:` 结尾
- `url.hostname`：返回域名
- `url.host`：返回域名与端口，包含 `:` 号，默认的 `80` 和 `443` 端口会省略
- `url.port`：返回端口
- `url.origin`：返回协议、域名和端口
- `url.pathname`：返回路径，以斜杠 `/` 开头
- `url.search`：返回查询字符串，以问号 `?` 开头
- `url.searchParams`：返回一个 `URLSearchParams` 实例，该属性是 Location 对象没有的
- `url.hash`：返回片段识别符，以井号 `#` 开头
- `url.password`：返回域名前面的密码
- `url.username`：返回域名前面的用户名

## URLSearchParams 对象

`URLSearchParams` 对象是浏览器的原生对象，用来构造、解析和处理 URL 的查询字符串（即 URL 问号后面的部分）。

它本身也是一个构造函数，可以生成实例。参数可以为查询字符串，起首的问号 `?` 有没有都行，也可以是对应查询字符串的数组或对象。

```js
// 方法一：传入字符串
var params = new URLSearchParams('?foo=1&bar=2');
// 等同于
var params = new URLSearchParams(document.location.search);

// 方法二：传入数组
var params = new URLSearchParams([['foo', 1], ['bar', 2]]);

// 方法三：传入对象
var params = new URLSearchParams({'foo' : 1 , 'bar' : 2});
```

### 实例方法

- `toString()`：返回实例的字符串形式。
- `append()`：用来追加一个查询参数。它接受两个参数，第一个为键名，第二个为键值，没有返回值。不会识别是否键名已经存在。

    ```js
    var params = new URLSearchParams('?foo=1&bar=2');
    params.toString()   // "foo=1&bar=2'

    params.append('foo', 3);
    params.toString()       // "foo=1&bar=2&foo=3"
    ```

- `delete()`：用来删除指定的查询参数。接受键名作为参数。  `params.delete('bar');`

- `set()`：用来设置查询字符串的值。接受两个参数，第一个是键名，第二个是键值。如果是已经存在的键，键值会被改写，否则会被追加。如果有多个同名键，set 会移除重复的键，只留一个。

- `get()`：用来读取查询字符串里面的指定键。接受键名作为参数。第一，它返回的是字符串，如果原始值是数值，需要转一下类型；第二，如果指定的键名不存在，返回值是 `null`。如果有多个的同名键，`get` 返回位置最前面的那个键值。

- `getAll()`：返回一个数组，成员是指定键的所有键值。接受键名作为参数。

- `sort()`：对键进行排序，规则是按照 Unicode 码点从小到大排列。没有返回值。如果有两个同名的键，不会排序，而是保留原始的顺序。

- `keys()`：返回的是键名的遍历器。

- `values()`：返回的是键值的遍历器。

- `entries()`：返回的是键值对的遍历器。

- `forEach()`：遍历每个键值对。

```js
let params = new URLSearchParams('a=3&b=6')

params.forEach((value, key, params)=>{
  console.log(value, key); // 3 a  // 6 b
})

for (const name of params.keys()) {
  console.log(name);  // a  b
}

for (const name of params.values()) {
  console.log(name);  // 3  6
}

for (const name of params.entries()) {
  console.log(name);  // ['a', '3']  ['b', '6']
}
```

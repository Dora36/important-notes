## querystring

`querystring` 模块提供用于解析和格式化 URL 查询字符串的实用工具。

```js
const querystring = require('querystring');
```

- `querystring.decode()`：是 `querystring.parse()` 的别名。
- `querystring.encode()`：是 `querystring.stringify()` 的别名。
- `querystring.escape(str)`：对给定的 str 执行 URL 百分比编码。
- `querystring.unescape(str)`：在给定的 str 上执行 URL 百分比编码字符的解码。
- `querystring.parse(str[, sep[, eq[, options]]])`：将 URL 查询字符串 str 解析为键值对的集合。返回的对象不继承自 `Object.prototype`。
  - `str`：要解析的 URL 查询字符串。
  - `sep`：用于在查询字符串中分隔键值对的子字符串。默认值 `&`。
  - `eq`：用于在查询字符串中分隔键和值的子字符串。默认值 `=`。
  - `options`：
    - `decodeURIComponent`：当解码查询字符串中的百分比编码字符时使用的函数。默认值: `querystring.unescape()`。
    - `maxKeys`：指定要解析的键的最大数量。指定 0 可移除键的计数限制。默认值: 1000。

- `querystring.stringify(obj[, sep[, eq[, options]]])`：通过遍历对象的自身属性从给定的 obj 生成 URL 查询字符串。
  - `obj`：要序列化为 URL 查询字符串的对象。
  - `sep`：用于在查询字符串中分隔键值对的子字符串。默认值 `&`。
  - `eq`：用于在查询字符串中分隔键和值的子字符串。默认值 `=`。
  - `options`
    - `encodeURIComponent`：当将查询字符串中不安全的 URL 字符转换为百分比编码时使用的函数。默认值: `querystring.escape()`。

```js
let obj = { foo: 'bar', baz: 'qux' }

let str = querystring.stringify(obj);   // 返回 'foo=bar&baz=qux'
querystring.parse(str)                  // 返回 { foo: 'bar', baz: 'qux' }
querystring.stringify(obj, ';', ':');   // 返回 'foo:bar;baz:qux'
```

## assert

assert 模块提供了一组简单的断言测试，可用于测试不变量。

```js
const assert = require('assert');

// assert(条件语句,'条件不等于true时抛出的错误提示');

function sum(a,b) {
  assert(arguments.length === 2,'必须传2个参数');
  assert(typeof a === 'number','第一个参数必须是数字');
  assert(typeof b === 'number','第二个参数必须是数字');
  return a+b;
}
console.log(sum(5,'4'));   // 报错直接退出应用程序
```

## crypto

用于签名，如 md5、sha：

```js
const crypto = require('crypto');

let obj = crypto.createHash('md5'); // 'sha1'
obj.update('123456');

console.log(obj.digest('hex')); // 以16进制的数字形式表现出来
```

**防破解 -** 加强加密：双层加密 + 混淆字符串

```js
const crypto = require('crypto');
const _key = 'dora20190331'; // _key不能变，所以不能用时间戳

function md5(str) {
	let obj = crypto.createHash('md5');
	obj.update(str);
	return obj.digest('hex');
}

function md5_2(str) {
	return md5(md5(str)+_key);
}

console.log(md5_2('123456'));
```

## dns

```js
const dns = require('dns');
// dns解析
dns.resolve('baidu.com',(err,res)=>{
  if(err) {
    console.log(err);
  }else {
    console.log(res);  // ip 地址
  }
})
```

## path

`path` 模块主要用于处理文件及目录的路径。

```js
const path = require('path');
```

- `path.sep`：返回平台特定的路径片段分隔符。Windows 上是 `\`，POSIX 上是 `/`。

- `path.dirname(path)`：返回 `path` 的目录名，尾部的目录分隔符将被忽略。

- `path.extname(path)`：返回参数 `path` 的扩展名，从最后一次出现 `.`（句点）字符到 `path` 最后一部分的字符串结束。如果除了第一个字符以外没有 `.`，则返回空字符串。

- `path.isAbsolute(path)`：检测 `path` 是否为绝对路径。是绝对路径返回 `true`。

- `path.relative(from, to)`：根据当前工作目录返回 `from` 到 `to` 的相对路径。

- `path.join()`：将所有给定的 `path` 片段连接在一起，然后规范化生成的路径。

- `path.parse(path)`：返回一个对象，其属性表示 `path` 的重要元素。尾部的目录分隔符将被忽略。
  - `root`：文件的根路径，mac 上是 `/`，windows 上是盘符 `C:\\`。
  - `dir`：目录，不包括尾部的目录分隔符。
  - `base`：文件名 + 扩展名
  - `ext`：扩展名
  - `name`：文件名

- `path.resolve([...paths])`：将路径或路径片段的序列解析为绝对路径。
  - 给定的路径序列从右到左进行处理，每个后续的 `path` 前置，直到构造出一个绝对路径。
  - 如果在处理完所有给定的 `path` 片段之后还未生成绝对路径，则再加上当前工作目录。
  - 生成的路径已规范化，并且除非将路径解析为根目录，否则将删除尾部斜杠。
  - 如果没有传入 `path` 片段，则 `path.resolve()` 将返回当前工作目录的绝对路径。

```js
path.parse(__filename)
// {
//   root: '/',
//   dir: '/Users/dorawang/Documents/.../my-node',
//   base: 'text.js',
//   ext: '.js',
//   name: 'text'
// }

path.resolve('/a/b', './c');       // 'a/b/c'
path.resolve('/a/b', '/c', 'd');   // '/c/d'
path.resolve('a/b', '../c');       // __dirname/a/c
path.resolve(__dirname, 'static'); // __dirname/static
```

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


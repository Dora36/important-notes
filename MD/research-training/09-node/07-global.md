## Buffer 类

Buffer 类是一个全局变量，用于直接处理二进制数据。 

### 构建 Buffer

#### `Buffer.alloc(size[, fill[, encoding]])`

- `size`：数字形式，代表新 Buffer 的长度。
- `fill`：用于预填充新 Buffer 的值。默认值为 `0`。
- `encoding`：如果 `fill` 是一个字符串，则这是它的字符编码。默认值 `utf8`。

#### `Buffer.from(string[, encoding])`

创建一个包含 string 的新 Buffer。

- `string`：要编码的字符串。
- `encoding`：string 的字符编码。默认值 `utf8`。

### Buffer 与字符编码

当在 Buffer 和字符串之间转换时，可以指定字符编码。如果未指定字符编码，则使用 UTF-8 作为默认值。

Node.js 当前支持的字符编码如下：

- `utf8`：多字节编码的 Unicode 字符。

- `utf16le`：多字节编码的 Unicode 字符。 与 'utf8' 不同，字符串中的每个字符都会使用 2 个或 4 个字节进行编码。

- `base64`： Base64 编码。当从字符串创建 Buffer 时，此编码也会正确地接受“URL 和文件名安全字母”。

- `hex`：将每个字节编码成两个十六进制的字符。

```js
// base64 url 编码，会把在 URL 里面有特殊含义的 =、+ / 替换掉。
function base64url(string, encoding = 'utf8') {
  return Buffer
    .from(string, encoding)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

let base = base64url('hello+world=//aa')  // aGVsbG8rd29ybGQ9Ly9hYQ

let string = Buffer.from(base, 'base64').toString(); // hello+world=//aa
```

### 生成的 buf 对象

- `buf.length`：返回 buf 中的字节数。

- `buf.toString([encoding[, start[, end]]])`：根据 `encoding`（默认值 utf8）指定的字符编码将 buf 解码成字符串。传入 `start`（默认值 0）和 `end`（默认值 buf.length） 可以只解码 buf 的子集。


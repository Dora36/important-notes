## 自定义个性化博客

全局样式表和资源通常放在 `src/assets` 文件夹中，并导入到 `src/main.js` 中。

### 导入全局样式表

**安装SASS**

```shell
npm install -D sass-loader node-sass
```

**导入样式表**

```js
import '~/assets/style/index.scss';
```

在 Gridsome 中，可以使用别名 `〜` 或 `@` 链接到 `/src` 文件夹中的文件。

### 定义样式

[Markdown](http://www.markdown.cn/) 是一个 Web 上使用的文本到 HTML 的转换工具，可以通过简单、易读易写的文本格式生成结构化的 HTML 文档。

**1. `#` - `######` 标题转换为 `<h1>` - `<h6>` 标签**

```scss
h3 {
  color: darkgoldenrod;
}

h4 {
  color: cadetblue;
}
```

**2. 区块引用 `> ` 转换为 `<blockquote>` 标签**

```scss
blockquote {
  border-left: 4px solid darkgoldenrod;
  padding: 1px 10px;
  color: #666;
  background-color: rgba(184, 134, 11, 0.1);
}
```

**3. 有序列表转换为 `<ol>` 标签**

**4. 无序列表转换为 `<ul>` 标签**

**5. 代码区块会转换为 `<pre>` 和 `<code>` 标签**

```scss
pre {
  padding: 20px;
  background-color: rgba(95, 158, 160, 0.6);
  border: 1px solid rgba($color: #000000, $alpha: 0.1);
  border-radius: 5px;
}
```

**6. 行内代码会转换为 `<code>` 标签**

```scss
p code {
  padding: 2px 4px;
  font-size: 14px;
  color: rgb(95, 158, 160);
  background-color: rgba(95, 158, 160, 0.2);
  border-radius: 3px;
}
```

**7. `*` 或 `_` 形成的斜体会被转成用 `<em>` 标签**

**8. `**` 或 `__` 形成的粗体会被转成用 `<strong>` 标签**

**9. 超链接是 `<a>` 标签，图片是 `<img>` 标签**

```scss
a {
  color: #6b17e6;
  transition: opacity 0.2s;
  text-decoration: none;
  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
}
```

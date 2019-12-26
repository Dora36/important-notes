# Gridsome 中的 Transformer 转换器

`Transformer` 转换器是用来解析文件内容的。只要在 `package.json` 中安装了 `transformer`，Gridsome 就会自动使用这个转换器。

## [Transformer API](https://gridsome.org/docs/transformer-api/)

### 指定 Mime 类型

`transformer.mimeTypes()`

一个转换器必须具有静态 `mimeTypes()` 方法，该方法返回一个数组，数组的值是转换器能够解析的 `mime` 类型。

### 解析内容

`transformer.parse(source)`

一个转换器还必须有一个 `parse()` 方法，该方法用来解析内容。

### 自定义 GraphQL 字段

`transformer.extendNodeType()`

转换器也可以通过实现 `extendNodeType()` 方法来扩展 GraphQL 中的字段。

### 示例

```js
class Transformer {
  static mimeTypes () {
    return ['application/json']
  }

  parse (source) {
    const { title, ...fields } = JSON.parse(source)
    return { title, fields }
  }

  extendNodeType ({ graphql }) {
    return {
      // custom GraphQL fields for transformed node
    }
  }
}

module.exports = Transformer
```

## [@gridsome/transformer-remark](https://gridsome.org/plugins/@gridsome/transformer-remark) 插件源码解析

Gridsome 通过 [`remark`](https://github.com/remarkjs/remark) 转换 Markdown 的转换器。

通过解析 `@gridsome/transformer-remark` 插件的源码，即可知道在页面中可以通过 `graphql` 查询语句获取到 markdown 文件中的那些信息。

### parse() 方法

```js
const parse = require('gray-matter')

class RemarkTransformer {
  parse (source) {
    const { data, content, excerpt } = parse(source, this.options.grayMatter || {})

    // if no title was found by gray-matter,
    // try to find the first one in the content
    if (!data.title) {
      const title = content.trim().match(/^#+\s+(.*)/)
      if (title) data.title = title[1]
    }

    return { content, excerpt, ...data }
  }
}
```

由 `RemarkTransformer` 的 `parse()` 方法，可知 `@gridsome/transformer-remark` 插件是通过另外一个插件 `gray-matter` 来解析 `markdown` 内容的。

#### 关于 [gray-matter](https://github.com/jonschlinkert/gray-matter)

`gray-matter` 的作用是从字符串或文件中解析 `front-matter` 前置内容的。默认情况下解析的是 [`YAML`](https://www.runoob.com/w3cnote/yaml-intro.html) 格式的前置内容。且可设置自定义解析选项。

`front-matter` 的 `YAML` 格式如下：

```
---
title: Hello
author: dora
---
<h1>Hello world!</h1>
```

通过 `gray-matter` 解析后返回：

```js
{
  content: '<h1>Hello world!</h1>',
  data: { 
    title: 'Hello', 
    author: 'dora' 
  }
}
```

`gray-matter` 也可解析 `JSON` 格式的前置内容：

```
---
{
  title: 'Hello',
  author: 'dora'
}
---
# Hello world!
```

解析后返回：

```js
{
  content: '# Hello world!',
  data: { 
    title: 'Hello', 
    author: 'dora' 
  }
}
```

### extendNodeType() 方法

```js
extendNodeType () {
  return {
    content: {
      // 通过 remark-parse 以及，
      // gridsome.config.js 文件中传入的 transformer 选项，
      // 处理 gray-matter 解析完的 content 内容。
    },
    headings: {
      // 获取 content 内容中的所有的标题数据，
      // 包含字段为 { depth, anchor, value }
    },
    timeToRead: {
      // 阅读时间，默认一分钟 230 个字
    }
  }
}
```

### 转换示例

markdown 内容如下：

```md
---
title: Test
date: 2019-12-26
author: Dora
---

# H1 Test Title

这是 **markdown** 文件的内容区，请 `在此` 将您出众的思想分享给大家！
```

`graphQL` 查询语句如下：

```html
<!-- templates/Post.vue -->
<page-query>
  query ($id: ID!) {
    post(id: $id) {
      title
      content
      date (format: "YYYY-MM-DD")
      headings {
        depth
        anchor
        value
      }
    }
  }
</page-query>
```

转换后返回的数据：

```js
data: {
  post: {
    title: "Test",
    content: `<h1 id="h1-test-title"><a href="#h1-test-title" aria-hidden="true"><span class="icon icon-link"></span></a>H1 Test Title</h1>↵<p>这是 <strong>markdown</strong> 文件的内容区，请 <code>在此</code> 将您出众的思想分享给大家！</p>↵`,
    date: "2019-12-26",
    headings: [{
      depth: 1, 
      anchor: "#h1-test-title", 
      value: "H1 Test Title"
    }],
  }
}
```

## 一通百通

关于 `gridsome` 中转换其它文件类型的 `transformer` 转换器。

- `@gridsome/transformer-yaml`：Gridsome 的 YAML 转换器

- `@gridsome/transformer-json`：Gridsome 的 JSON 转换器

- `gridsome-transformer-vue`：Gridsome 的 VUE 转换器

- `...`
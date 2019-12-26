# Gridsome 入门篇之搭建基于 Markdown 的博客

## 项目架构

### 1. 初始化项目

```shell
gridsome create my-blog
cd my-blog
gridsome develop
```

如果第一步 `create` 在安装依赖时报错或耗时较长，可中断安装，删除 `node_modules`，通过 `cnpm` 手动安装。

```shell
cd my-blog
rm -rf node_modules
cnpm install
```

此时即可在 [`http://localhost:8080/`](http://localhost:8080/) 看到项目的首页。

### 2. 安装解析文件的插件

- [@gridsome/source-filesystem](https://gridsome.org/plugins/@gridsome/source-filesystem)：将文件转换为 `GraphQL` 数据层可获取的内容。

- [@gridsome/transformer-remark](https://gridsome.org/plugins/@gridsome/transformer-remark)：`Gridsome` 用于转换 `Markdown` 的转换器。

#### 安装

```shell
cnpm install @gridsome/source-filesystem @gridsome/transformer-remark -S
```

#### 在 gridsome.config.js 中配置插件

```js
plugins: [
  {
    use: "@gridsome/source-filesystem",
    options: {
      path: "blog/*.md",
      typeName: "Post"
    }
  }
]
```

#### 插件的作用

`@gridsome/source-filesystem` 是将文件转换为可以在组件中使用 `GraphQL` 获取的内容，而转换的时候需要转换器才能解析文件。因此需要安装 `@gridsome/transformer-remark` 依赖。只要在 `package.json` 中找到支持文件的转换器，`Gridsome` 就会自动转换文件。

`@gridsome/source-filesystem` 的配置参数：

- `path`：文件的路径。

- `typeName`：`GraphQL` 类型和模板名称。 `src/templates` 中的 `.vue` 文件必须与 `typeName` 匹配才能为其具有模板。

### 3. 创建 markdown 文件的模版

在 `templates` 文件夹下新建 `Post.vue` 文件，该文件即所有 `markdown` 文件的模版页面，所有的 `markdown` 文件会根据此文件的布局渲染出页面。

```html
<template>
  <Layout>
    <div v-html="$page.post.content"/>
  </Layout>
</template>

<page-query>
query ($id: ID!) {
  post(id: $id) {
    title
    content
  }
}
</page-query>

<script>
export default {
  metaInfo() {
    return {
      title: this.$page.post.title
    }
  }
};
</script>
```

### 4. 创建 blog 文件夹

根据 `@gridsome/source-filesystem` 插件中的 `path` 定义的路径，新建 `blog` 文件夹，本示例中安装的目录与 `src` 同级。

`blog` 文件夹中新建 `test.md` 文件。

```md
---
title: Test
author: Dora
---

## 一个测试页面

这是 **markdown** 文件的内容区，请在此将您出众的思想分享给大家！
```

此时即可在 [`localhost:8080/blog/test`](http://localhost:8080/blog/test) 中看到该页面了。

### 5. 在 index.vue 中添加跳转链接

在 `index.vue` 中可添加跳转至 `blog` 页面的入口链接。

```html
<template>
  <Layout>
    <h1>Hello, Gridsome!</h1>

    <p v-for="edge in $page.posts.edges" :key="edge.node.id">
      <a :href="edge.node.path">{{edge.node.title}}</a>
    </p>
  </Layout>
</template>
<page-query>
query {
  posts: allPost{
    edges {
      node {
        id
        title
        path
      }
    }
  }
}
</page-query>
```

此时，就可以愉快的在 `blog` 中写 `markdown` 文件了。 

然而，`gridsome` 默认 `markdown` 文件是没有样式的，因此想要页面有自己的特色，需要自定义 `markdown` 中不同语法的样式。

## 自定义个性化博客

全局样式表和资源通常放在 `src/assets` 文件夹中，并导入到 `src/main.js` 中。

### 导入全局样式表

**安装SASS**

```shell
npm install -D sass-loader node-sass
```

**导入样式表**

```js
// main.js
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

**5. 代码块会转换为 `<pre>` 和 `<code>` 标签**

```scss
pre[class*="language-"] {
  padding: 20px;
  background-color: rgba(95, 158, 160, 0.2);
  border: 1px solid rgba(95, 158, 160, 0.3);
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

**7. 一个 `*` 或 `_` 形成的斜体会被转成用 `<em>` 标签**

**8. 两个 `**` 或 `__` 形成的粗体会被转成用 `<strong>` 标签**

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

### 代码块语法高亮

**安装 `remark-prismjs` 插件**

```shell
cnpm install @gridsome/remark-prismjs -S
```

**在 `main.js` 中引入引入 css**

```js
import 'prismjs/themes/prism.css'
```

**在 `gridsome.config.js` 中配置插件**

将语法高亮运用到单个 `markdown` 文件夹。

```js
module.exports = {
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'blog/*.md',
        typeName: 'Post'
        remark: {
          plugins: [
            '@gridsome/remark-prismjs'
          ]
        }
      }
    }
  ]
}
```

将语法高亮运用到所有 `markdown` 文件。

```js
module.exports = {
  transformers: {
    remark: {
      plugins: [
        '@gridsome/remark-prismjs'
      ]
    }
  }
}
```

如果要禁用行内代码块的高亮显示，可在插件选项中配置 `transformInlineCode: false` 选项。

```js
module.exports = {
  transformers: {
    remark: {
      plugins: [
        ['@gridsome/remark-prismjs', { transformInlineCode: false }]
      ]
    }
  }
}
```

自此，即可完整的通过 gridsome 实现一个基于 Markdown 的博客。
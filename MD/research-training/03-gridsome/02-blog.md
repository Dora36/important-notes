## Gridsome 入门篇之搭建基于 Markdown 的博客

### 初始化项目

```shell
$ gridsome create my-blog
$ cd my-blog
$ gridsome develop
```

此时即可在 [`http://localhost:8080/`](http://localhost:8080/) 看到项目的首页。

### 安装解析文件的插件

- [@gridsome/source-filesystem](https://gridsome.org/plugins/@gridsome/source-filesystem)：将文件转换为 `GraphQL` 数据层可获取的内容。

- [@gridsome/transformer-remark](https://gridsome.org/plugins/@gridsome/transformer-remark)：`Gridsome` 用于转换 `Markdown` 的转换器。

#### 1. 安装

```shell
$ cnpm install @gridsome/source-filesystem @gridsome/transformer-remark
```

#### 2. 在 gridsome.config.js 中配置插件

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

### 创建 markdown 文件的模版

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

### 创建 blog 文件夹

根据 `@gridsome/source-filesystem` 插件中的 `path` 定义的路径，新建 `blog` 文件夹，本示例中安装的目录与 `src` 同级。

`blog` 文件夹中新建 `test.md` 文件。

```md
---
title: Test
---

## 一个测试页面

这是 **markdown** 文件的内容区，请在此将您出众的思想分享给大家！
```

此时即可在 [`localhost:8080/blog/test`](http://localhost:8080/blog/test) 中看到该页面了。

### 在 index.vue 中添加跳转链接

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

然而，`gridsome` 默认 `markdown` 文件是没有样式的，因此想要页面有自己的特色，需要自定义 `markdown` 中不同语法的样式，而欲知样式如何定义，各位看官，请看下回分解。

## Gridsome 简介

### What

`Gridsome` 是一个 `Vue.js` 驱动的静态站点生成器，用于创建可在任何地方部署的快速且安全的网站。

### Why

- 前端使用 `Vue.js`：一个轻量级且易于使用的前端框架。

- 通过热加载进行本地开发：在开发过程中实时查看更改。

- 基于文件的页面路由：`src/pages` 中的任何 `Name.vue` 文件都是一个静态路由。

- 动态路由：`src/pages` 中的任何 `[param].vue` 文件都是一个动态路由。

- 快速静态页面生成：安全，快速地部署到任何 CDN 或静态 Web 主机。

- GraphQL 数据层：使用集中的数据层进行数据管理。

- 自动优化代码：开箱即用的代码分割和资产优化。

- 渐进式图像支持：自动调整大小，优化和延迟加载图像。

- 自动页面预取：页面在后台加载以便快速浏览。

- 数据源插件：从流行的无头 CMS，API 或 Markdown 文件添加数据。

### How

#### 1. 安装 Gridsome CLI 工具

```shell
$ yarn global add @gridsome/cli

$ npm install --global @gridsome/cli
```

#### 2. 创建 Gridsome 项目

```shell
$ gridsome create my-gridsome-site
$ cd my-gridsome-site
$ gridsome develop
```

运行这些命令后，本地开发服务器将运行在 `http://localhost:8080`，在浏览器中打开即可看到示例页面。

## 目录结构

```
├── package.json
├── gridsome.config.js
├── gridsome.server.js
├── static/
└── src/
    ├── main.js
    ├── index.html
    ├── App.vue
    ├── layouts/
    │   └── Default.vue
    ├── pages/
    │   ├── Index.vue
    │   └── About.vue
    └── templates/
        └── xx.vue

```

### gridsome.config.js

该文件包含配置参数和已安装插件的选项。

基本配置如下

```js
module.exports = {
  siteName: 'Gridsome',  // 为项目设置一个名称，该名称通常在标题标签中使用。
  siteDescription: '',   // 首页的描述。
  plugins: []            // 通过将插件添加到 plugins 数组来启用插件。
}
```

### gridsome.server.js

该文件是可选的。这个文件主要用来请求各种数据的，该文件必须导出一个函数，该函数将接收一个 `api`，可以使其挂接到 `Gridsome` 的各个部分；第二个参数是 `gridsome.config.js` 中插件的选项。如果未找到 `gridsome.server.js` 文件，则将加载 `index.js`。

```js
function MyPlugin (api, options) {
  // ...
}

MyPlugin.defaultOptions = () => ({
  option: 'value'
})

module.exports = MyPlugin
```

这个文件也可以导出 Class 类。

```js
class MyPlugin {
  static defaultOptions () {
    return {
      option: 'value'
    }
  }

  constructor (api, options) {
    // ...
  }
}

module.exports = MyPlugin
```

### `/static` 是静态资源目录

在构建过程中，此目录中的文件将直接复制到 `dist`。 例如，`/static/test.txt` 将位于 `https://yoursite.com/test.txt`。

### `/src` 目录

#### 自定义 index.html

有时，项目需要覆盖 `Gridsome` 用于生成页面的基本 `HTML` 模板，此时在 `src` 目录中创建一个新的 `index.html` 文件即可。

#### 自定义 app.vue

`App.vue` 文件是组合所有页面和模板的主要组件。可通过在 `src` 目录中新建自己的 `App.vue` 文件来覆盖默认文件。

[blog 示例](https://alligator.io/vuejs/gridsome-blog/)
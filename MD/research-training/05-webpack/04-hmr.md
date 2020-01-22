# webpack 的开发环境

## watch 观察模式

`webpack --watch` 可以实现如果其中一个文件被更新，代码将被重新编译，所以不必手动运行 `webpack`。

```json
// package.json
"scripts": {
  "watch": "webpack --watch",
  "build": "webpack"
},
```

然而，观察模式虽然可以自动编译项目，但要在浏览器中查看效果，还是需要手动刷新浏览器的。而使用 `webpack-dev-server` 开启一个简单的 web 服务器，就能够实现自动刷新浏览器功能。

## `webpack-dev-server`

`webpack-dev-server` 提供了一个简单的 web 服务器，能够用于快速开发应用程序。它可以实现多种功能，包括实时重新加载（Live Reloading），实现自动刷新浏览器。

`webpack-dev-server` 内部使用的是 `webpack-dev-middleware` 中间件，该中间件是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给服务器(server)。 `webpack-dev-server` 在内部使用的就是 `webpack-dev-middleware` 和 `express`。

**安装**

```shell
npm install webpack-dev-server -D
```

**修改配置文件**

webpack 的配置文件可通过 `devServer` 属性向 `webpack-dev-server` 传递选项，来改变其行为。

```js
// webpack.config.js
module.exports = {
  output: {
    publicPath: '/'
  },
  devServer: {
    contentBase: './dist'
  },
};
```

以上配置告知 `webpack-dev-server`，在 `localhost:8080` 下建立服务，将 `dist` 目录下的文件，作为可访问文件。

**npm scripts**

```json
"scripts": {
  "start": "webpack-dev-server --open",  // --open 参数是自动打开浏览器
},
```

此时，运行 `npm start` 即可自动打开 `http://localhost:8080/`，当文件被更新后，浏览器会实现自动刷新。

**devServer 的属性**

- `contentBase`：告诉服务器从哪里提供内容。只有在想要提供静态文件时才需要。

- `publicPath`：此路径下的打包文件可在浏览器中访问。

- `host`：指定使用一个 host。默认是 `localhost`。

- `port`：指定要监听请求的端口号。

- `compress`：启用 gzip 压缩。

- `overlay`：出现编译器错误或警告时，在浏览器中全屏覆盖显示错误信息。默认禁用。

- `proxy`：代理 URL，如果有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求，可设置该属性。

- `hot`：启用 webpack 的模块热替换特性。

## HMR 模块热替换

模块热替换(Hot Module Replacement)是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需进行完全刷新浏览器。

**配置**

```js
// webpack.config.js
const webpack = require('webpack');

module.exports = {
  devServer: {
    hot: true
  }
};
```

**加入监听模块变化的代码**

```js
// index.js
if (module.hot) {
  module.hot.accept()
}
```

这只是一个特别简单的示例，会有很多可能出错的地方。幸运的是，有很多 loader，已经包含了 HMR 的功能：

- `style-loader`：当更新 CSS 依赖模块时，`style-loader` 会在后台使用 `module.hot.accept` 来修补(patch) `<style>` 标签。

- [`vue-loader`](https://vue-loader.vuejs.org/zh/)：用来加载和转译 Vue 组件，并支持用于 vue 组件的 HMR，可提供开箱即用的体验。

### 


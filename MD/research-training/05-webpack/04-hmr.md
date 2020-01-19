



## 使用 `webpack-dev-server` 热加载

`webpack-dev-server` 提供了一个简单的 web 服务器，并且能够实时重新加载（Live Reloading），实现自动刷新浏览器。

**安装**

```shell
npm install webpack-dev-server -D
```

**修改配置文件**

```js
// webpack.config.js
module.exports = {
  devServer: {
    contentBase: './dist'
  },
};
```

以上配置告知 `webpack-dev-server`，在 `localhost:8080` 下建立服务，将 `dist` 目录下的文件，作为可访问文件。

**npm scripts**

```json
"scripts": {
  "start": "webpack-dev-server --open",
},
```

### HMR 热加载


# babel 在 webpack 中的使用

## babel-loader

### What

`babel-loader` 是 webpack 的一个 loader，它的作用是通过 Babel 和 webpack 来转译 JavaScript 文件的。

### Why

webpack 是一个 JavaScript 应用程序的静态模块打包器。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

关于代码中的 ES6 或以上的特性，webpack 不会更改代码中除 `import` 和 `export` 语句以外的部分。因此，如果代码中有 ES6 或以上语法，就必须在 webpack 的 loader 系统中使用一个转译器，先通过转译器将 ES6 语法转为兼容的 ES5 语法，再由 webpack 编译打包，而最常用的编译器就是通过 Babel 转译的 `babel-loader`。

### How

**安装 webpack**

```shell
npm install webpack webpack-cli -D
```

**安装 babel-loader**

```shell
npm install babel-loader @babel/core -D
```

**webpack 配置**

```js
// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [...],
            presets: [...]
          }
        }
      }
    ]
  }
};
```

**package.json 配置**

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

## Stage-4 阶段的[可选链 `?.`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/%E5%8F%AF%E9%80%89%E9%93%BE) 示例

添加 src/index.js 文件：

```js
let obj = {
  a:4,
  b:6
}

console.log(obj?.a);
```

通过 `node src/index.js` 执行该文件会报错。因为当前版本的 node 不支持该语法，因此需要用 babel 转换为兼容的 ES5 代码。

**安装 babel 插件转换语法**

```shell
npm install @babel/plugin-proposal-optional-chaining -D
```

**配置插件**

```r
# .babelrc
{
  "plugins": ["@babel/plugin-proposal-optional-chaining"]
}
```

```js
// webpack.config.js
{
  test: /\.js$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
    options: {
      "plugins": ["@babel/plugin-proposal-optional-chaining"]
    }
  }
}
```

**执行 webpack**

```shell
npm run build
```

此时通过 `node dist/bundle.js` 执行该文件，会打印出 `4`。

## `babel-loader` 在 webpack 中的配置

```shell
npm install babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
npm install @babel/runtime -S
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test:/\.js$/,
        use: {
          loader:'babel-loader',
          options: {
            presets:[
              '@babel/preset-env'
            ],
            plugins: [
              '@babel/plugin-transform-runtime'
            ]
          },
          include: path.resolve(__dirname, 'src'),  // 匹配 js 文件时需要包含的文件夹
          exclude: /node_modules/                   // 匹配js 文件时需要排除掉的文件夹
        }
      }
    ]
  }
};
```
# webpack 的入口和输出

## webpack 入门

### webpack 的核心

webpack 有四个核心概念：

- 入口(entry)
- 输出(output)
- loader
- 插件(plugins)

### 安装

```shell
$ mkdir webpack-demo && cd webpack-demo
$ npm init -y
$ npm install webpack webpack-cli -D
```

## entry 入口

入口起点(entry point)是 webpack 构建其内部依赖图的开始模块。进入入口起点后，webpack 会依次处理与入口起点直接和间接依赖的每个模块，并输出到出口文件中。

默认入口为 `./src`。可通过在 webpack 配置文件中配置 `entry` 属性，来指定一个或多个入口起点。

**配置**

`webpack.config.js`

### 单入口

`entry: string|Array<string>`

```js
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js'
};
```

向 `entry` 属性传入数组将创建“多个主入口(multi-main entry)”。会将多个依赖文件一起注入，并且将它们的依赖输出到一个出口文件中。

### 多入口

对象语法会比较繁琐。然而，这是应用程序中定义入口的最可扩展的方式。

```js
// webpack.config.js
module.exports = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};
```

常用于分离应用程序(app)和第三方库(vendor)入口。


## output 输出

默认出口为 `./dist/main.js`。可通过在 webpack 配置文件中配置 `output` 属性，告诉 webpack 在哪里输出它所打包的 js 文件，以及如何命名这些文件。`output` 属性是一个对象，包括 `filename` 和 `path` 属性。`path` 是目标输出目录的绝对路径，`filename` 是输入文件的文件名。

**配置**

`webpack.config.js`

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',                 // 输出文件的文件名
    path: path.resolve(__dirname, 'dist')  // 目标输出目录的绝对路径
  }
};
```

通过在 webpack 配置文件中配置 `output` 属性，告诉 webpack 在哪里输出它所打包的 js 文件，以及如何命名这些文件，默认目录为 `./dist`，默认文件名为 `main.js`。基本上，整个应用程序结构，都会被编译到指定的输出路径的文件夹中。

`output` 属性是一个对象，包括 `filename` 和 `path` 属性。`path` 是目标输出目录的绝对路径。

```js
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),   // 目标输出目录的绝对路径
    filename: 'my-first-webpack.bundle.js'   // 输出文件的文件名
  }
};
```

当有多个入口起点时，则应该使用占位符(substitutions)来确保每个文件具有唯一的名称。

```js
// webpack.config.js
module.exports = {
  {
    entry: {
      app: './src/app.js',
      search: './src/search.js'
    },
    output: {
      filename: '[name].js',    // 会生成两个文件 ./dist/app.js, ./dist/search.js
      path: __dirname + '/dist'
    }
  }
};
```

## 运行

**npm scripts**

```js
// package.json
{
  "scripts": {
    "build": "webpack",
    "watch": "webpack --watch"
  }
}
```

`--watch` 是观察模式，如果其中一个文件被更新，代码将被重新编译，不必手动 `build`。但 `config` 文件若有更改，还是需要重新运行 `webpack`。

**运行**

```shell
npm run build
```

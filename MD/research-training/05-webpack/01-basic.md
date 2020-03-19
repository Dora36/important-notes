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

入口起点(entry point)是 webpack 构建其内部依赖图的开始模块。也就是从这个起点开始，应用程序启动执行。进入入口起点后，webpack 会依次处理与入口起点直接和间接依赖的每个模块，并输出到出口文件中。

默认入口为 `./src`。可通过在 webpack 配置文件中配置 `entry` 属性，来指定一个或多个入口起点。`entry` 的属性值可以是**字符串**，可以是**数组**，也可以是**对象**形式。

**简单规则**：每个 HTML 页面都有一个入口起点。单页应用(SPA)：一个入口起点；多页应用(MPA)：多个入口起点。

如果传入一个字符串或字符串数组，chunk 会被命名为 `main`。如果传入一个对象，则每个键(key)会是 chunk 的名称，该值描述了 chunk 的入口起点。

### 单入口

```js
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js'
};
```

类似于：

```js
module.exports = {
  entry: {
    main: './src/index.js'
  }
};
```

如果向 `entry` 属性传入一个数组，那么数组的每一项都会执行，并且将它们的依赖输出到一个出口文件中。

### 多入口

对象语法虽然比较繁琐。但这是应用程序中定义入口的最可扩展的方式。

```js
// webpack.config.js
module.exports = {
  entry: {
    home: "./home.js",
    about: "./about.js",
    contact: "./contact.js"
  }
};
```

根据经验：每个 HTML 文档只使用一个入口起点。

## output 输出

默认出口为 `./dist/main.js`。可通过在 webpack 配置文件中配置 `output` 属性，告诉 webpack 在哪里输出它所打包的文件，以及如何命名这些文件。`output` 属性是一个对象，包括 `filename` 和 `path` 等属性。

- `path`：是目标输出目录的绝对路径，`path.resolve(__dirname, 'dist')`。

- `filename`：是输出文件的文件名，也可以使用 `js/[name]/bundle.js` 这样的文件夹结构。

- `publicPath`：默认值是一个空字符串，此选项指定在浏览器中所引用的 **此输出目录对应的公开 URL**，即通过该 url 可访问到 `dist` 目录。

### 单出口输出

```js
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',                 // 输出文件的文件名
    path: path.resolve(__dirname, 'dist')  // 目标输出目录的绝对路径
  }
};
```

`path` 是 `node` 内置的核心模块 其中 `resolve` 方法可以将相对路径解析为绝对路径。

`path.resolve('dist')` 即在当前目录下解析出一个 `dist` 目录的绝对路径，`__dirname` 也表示在当前目录下解析。

### 多出口输出

当通过多个入口起点、代码拆分或各种插件创建多个 bundle 时，则应该使用占位符来确保每个文件具有唯一的名称。

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
      path: path.resolve(__dirname, 'dist')
    }
  }
};
```

- `[name]`：入口 chunk 的名称。

- `[id]`：内部 chunk 的 id，即模块标识符(module identifier)。

- `[hash]`：每次构建过程中，生成的模块标识符的 hash，可通过 `[hash:16]` 来指定长度，默认 20。

- `[chunkhash]`：基于每个 chunk 内容的 hash。

示例：

```js
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode:'development',
  // 多入口
  entry: {
    home: './src/index.js',
    other: './src/other.js'
  },
  output: {
    // [name] 相当于变量，即入口文件的名字(entry 字段中的键名)
    filename:'[name].js',
    path: path.resolve(__dirname,'dist')
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:'./index.html',
      filename:'home.html',
      chunks:['home']  // 通过 index.html 模板生成 home.html 并只引入 home.js，没有 chunks 会将生成的 js 文件全部引入 html 中。
    }),
    new HtmlWebpackPlugin({
      template:'./index.html',
      filename:'other.html',
      chunks:['other'] // 通过 index.html 模板生成 other.html 并只引入 other.js
    })
  ]
}
```

### `publicPath`

对于按需加载或加载外部资源（如图片、文件等）来说，`output.publicPath` 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误。

该选项的值是作为 runtime(运行时) 或 loader(载入时) 所创建的每个 URL 的前缀。因此，在多数情况下，此选项的值都会以 `/` 结束。

可设置为相对 URL，即相对于 HTML 页面的 url。以 `/` 开头的是相对于服务的 URL，相对于协议的 URL 以及绝对 URL 都可以设置。默认值是一个空字符串。

```js
publicPath: "https://cdn.example.com/assets/",  // CDN（总是 HTTPS 协议）
publicPath: "//cdn.example.com/assets/",        // CDN (协议相同)
publicPath: "/assets/",                         // 相对于服务(server-relative)
publicPath: "assets/",                          // 相对于 HTML 页面
publicPath: "../assets/",                       // 相对于 HTML 页面
publicPath: "",                                 // 相对于 HTML 页面（目录相同）
```

## 运行

Node 8.2+ 版本提供的 `npx` 命令，可以运行在初始安装的 webpack 包的 webpack 二进制文件（`./node_modules/.bin/webpack`）。

```shell
npx webpack
```

会运行默认的配置文件 `webpack.config.js`。

```shell
npx webpack --config webpack.other.config.js   # 运行自定义的配置文件
```

**npm scripts**

用 CLI 这种方式来运行本地的 webpack 不是特别方便，可以设置一个快捷方式。在 `package.json` 添加一个 npm 脚本(npm script)：

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

```shell
npm run build
```

## 环境变量的配置 NODE_ENV

webpack 4 中可通过 配置文件中的 `mode` 属性设置模块中使用的环境变量，在版本 4 之前需要使用 `DefinePlugin` 插件定义全局变量的方式来定义全局的环境变量。

### mode 模式

`mode` 参数默认两种 `production`（会压缩） 和 `development`，设置以后就可以启用相应模式下的 webpack 内置的优化。

不配置 mode 属性，则会默认设置为 `production`。配置了 mode 属性后，在所有的模块文件中，`process.env.NODE_ENV` 为 mode 设置的值；但是在 `webpack.config.js` 配置文件中，`process.env.NODE_ENV` 是 `undefined`。

```js
// webpack.config.js
console.log(process.env.NODE_ENV)  // undefined
module.exports = {
  mode: 'development'
};
```

```js
// src/index.js
console.log(process.env.NODE_ENV)  // development
```

也可从从 CLI 参数中传递 mode 属性的值。

```shell
webpack --mode=production
```

**两种模式对应的内置配置**

|选项|描述|
|:-:|:--|
development|会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。|
production|会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin.|

### 配置文件中的环境变量

在 `webpack.config.js` 中的环境变量可从命令行中传入。

```json
"scripts": {
  "build": "NODE_ENV=development webpack --mode=production"
}
```

`NODE_ENV=development` 在 windows 环境下会报错，需要改为 `set NODE_ENV=production`。

此时，就可以在 `webpack.config.js` 配置文件中使用 `process.env.NODE_ENV` 了。

```shell
npm run build
```

```js
// webpack.config.js
console.log(process.env.NODE_ENV)  // development
```

```js
// src/index.js
console.log(process.env.NODE_ENV)  // production
```

## 其它 config 属性

### target 构建目标

因为服务器和浏览器代码都可以用 js 编写，所以 webpack 提供了多种构建目标(target)，可以在 webpack 配置中设置。

```js
// webpack.config.js
module.exports = {
  target: 'node'
};
```

使用 `node` webpack 会编译为用于 `Node.js` 环境的代码。使用 `Node.js` 的 `require`，而不是使用任意内置模块（如 `fs` 或 `path`）来加载 chunk。

每个 `target` 值都有各种部署/环境特定的附加项，以支持满足其需求。

## 快速配置

**安装**

```shell
npm init -y
npm install webpack webpack-cli webpack-dev-server html-webpack-plugin -D
npm install babel-loader @babel/core @babel/preset-env -D
```

**配置文件**

```js
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',    // 默认
  output: {                   // 默认 ./dist/main.js
    publicPath: '/', 
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
```

**启动配置 package.json**

```json
"scripts": {
  "start": "webpack-dev-server",
},
```
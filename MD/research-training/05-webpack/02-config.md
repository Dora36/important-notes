## config 中的核心

webpack 有四个核心概念：

- 入口(entry)
- 输出(output)
- loader
- 插件(plugins)

### entry 入口

入口起点(entry point)是 webpack 构建其内部依赖图的开始模块。进入入口起点后，webpack 会依次处理入口起点直接和间接依赖的每个模块，并输出到出口文件中。

通过在 webpack 配置文件中配置 `entry` 属性，来指定一个或多个入口起点。默认值为 `./src`。

#### 单入口

`entry: string|Array<string>`

```js
// webpack.config.js
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

向 `entry` 属性传入数组将创建“多个主入口(multi-main entry)”。会将多个依赖文件一起注入，并且将它们的依赖输出到一个出口文件中。

#### 多入口

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

### output 出口

通过在 webpack 配置文件中配置 `output` 属性，告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认目录为 `./dist`，默认文件名为 `main.js`。基本上，整个应用程序结构，都会被编译到指定的输出路径的文件夹中。

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

### loader

webpack 会通过代码中的 `import` 、 `export` 等引入模块的语句将所有相互依赖的模块打包成一个或多个文件。而 webpack 自身只理解 js 文件，可项目中需要引入的模块种类却非常复杂，比如 css 文件，图片，字体，json 文件等。

此时，就需要使用 `loader` 去处理那些非 js 的文件，`loader` 可以在 `import` 加载模块时预处理文件，将所有类型的文件转换为 webpack 能够处理的有效模块。

在 webpack 的配置中 `loader` 有两个目标：

- `test` 属性，用于标识出应该被对应的 `loader` 进行转换的某个或某些文件。
- `use` 属性，表示进行转换时，应该使用哪个 `loader`。

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};
```

在 `module.rules` 的数组中，定义每一个 `loader`，里面包含两个必须属性：`test` 和 `use`。其作用是，当 webpack 在 `require()/import` 语句中匹配到符合 `test` 的路径时，在对它打包之前，先使用 `use` 里定义的 `loader` 转换一下，转换完之后再打包。

#### modules 模块

对比 `Node.js` 模块，webpack 模块能够以各种方式表达它们的依赖关系：

- ES2015 的 `import` 语句。

- CommonJS 的 `require()` 语句。

- AMD 的 `define` 和 `require` 语句。

- css/sass/less 文件中的 `@import` 语句。

- css 样式(`url(...)`)或 HTML 文件(`<img src=...>`)中的图片链接(image url)。

可通过以上方式加载各种类型的模块，而所有非 js 的模块都可以通过相应的 loader 来预处理。

### plugins 插件

loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。

使用一个插件，需要先 `require()`，然后添加到 `plugins` 数组中。多数插件可以通过选项(option)自定义，也可以在一个配置文件中因为不同目的而多次使用同一个插件，因此必须使用 `new` 操作符来创建一个实例，然后将实例添加到 `plugins` 数组中。

```js
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');  // 通过 npm 安装

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```

## 其它配置

### mode 模式

通过选择 `development` 或 `production` 之中的一个，来设置 `mode` 参数，设置以后就可以启用相应模式下的 webpack 内置的优化。

```js
// webpack.config.js
module.exports = {
  mode: 'development'
};
```

也可从从 CLI 参数中传递。

```shell
webpack --mode=production
```

**两种模式对应的内置配置**

|选项|描述|
|:-:|:--|
development|会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。|
production|会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin.|

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












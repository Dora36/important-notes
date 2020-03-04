# webpack 中 plugins 的用法

## plugins 插件

loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件是 webpack 的支柱功能，接口功能极其强大，可以用来处理各种各样的任务，目的在于解决 loader 无法实现的其他事。

使用一个插件，需要先 `require()`，然后添加到配置文件的 `plugins` 数组中。多数插件可以通过选项(option)自定义，也可以在一个配置文件中因为不同目的而多次使用同一个插件，因此必须使用 `new` 操作符来创建一个实例，然后将实例添加到 `plugins` 数组中。

## 一些常用插件

- `DefinePlugin`：允许在编译时(compile time)

- `DllPlugin`：为了极大减少构建时间，进行分离打包

- `HtmlWebpackPlugin`：创建 HTML 文件，用于服务器访问

- `MiniCssExtractPlugin`：用于提取 css 代码到单独的文件中

## 常用插件的用法

### `mini-css-extract-plugin` 提取 css 文件

在多数情况下，为了在生产环境中节省加载时间，一般会进行 CSS 分离，通过 `<link>` 标签将 css 添加到 html 中，而不是直接在 `<head>` 中插入 `<style>` 标签。

要想实现这个功能，就需要借助 `mini-css-extract-plugin` 插件。此插件应仅在 loaders 链中没有 `style-loader` 的 `production` 环境上使用，尤其是在开发中使用 HMR 时。

**安装插件**

```shell
npm install mini-css-extract-plugin -D
```

**config 配置**

```js
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      },
    ],
  },
};
```

**npm scripts**

```json
"scripts": {
  "build": "NODE_ENV=production webpack",
  "dev": "NODE_ENV=development webpack",
},
```

此时，运行 `npm run build` 就会发现 `dist` 目录下多了一个 `main.css` 文件，而 html 中也通过 `<link>` 标签引入了 `main.css` 文件。

**参数选项**

可通过向 `plugins` 的插件实例中传入 object 类型的参数来设置配置选项，参数与 `webpackOptions.output` 中的选项相似，其中 `filename` 可以指定输出的文件名。

```js

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
    })
  ],
};
```

**options 选项**

还可通过给 `module.rules` 中的 loader 传递 options 选项来设置一些功能。`publicPath` 是资源路径到 context 上下文的相对路径；`hmr` 是开启 HMR 热加载模式。

```js
// webpack.config.js
rules: [{
  test: /\.css$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: process.env.NODE_ENV === 'development',
        reloadAll: true,
      },
    },
    'css-loader',
  ],
}],
```

### `HtmlWebpackPlugin` 生成 html

当在出口设置中加入文件名哈希值时，手动在 html 中引入编译完的 js 文件，就会显得很不方便，因此可以借助 `HtmlWebpackPlugin` 插件自己生成一个HTML文件，实现在 html 中自动插入编译完的 js 文件。

#### 配置

**安装插件**

```shell
npm install html-webpack-plugin -D
```

**config 配置**

```js
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin()
    // or
    new HtmlWebpackPlugin({参数})
  ]
};
```

这时运行 `npm run build` 将在 `dist` 目录下生成一个 `index.html` 文件，其中就已经引入了编译好的 js 文件。如果有提取 css 文件，此时也会自动引入 `<link>` 标签。

#### options 选项

可以通过向 new 出来的 `html-webpack-plugin` 实例传参来配置 html 的属性。

- `title`：html 的 `<head>` 里 `<title>` 标签的内容。

- `filename`：文件名，默认为 `index.html`，也可指定子目录，`assets/admin.html`。

- `template`：以该路径的 html 文件为模版生成 html 文件输出到 `output` 的目录里。

- `hash`：为 `true` 时，向 html 中引入的 `bundle.js` 添加 hash。

- `minify`：压缩生成的 html 文件。

    ```js
      minify: {
        removeAttributeQuotes: true,  // 去掉属性的双引号
        collapseWhitespace: true,     // 去掉空格
      },
    ```

**添加模版 html**

每次 `build` 时 `HtmlWebpackPlugin` 都会重新生成 html，就会导致 html 中无法添加自定义的内容，因此，需要添加一个模版文件，让 webpack 每次都基于模版文件生成 html。

```html
<!-- index.html -->
<head>
  <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
  <my-btn>千万别点</my-btn>
  <span class="my-btn">哇哦</span>
</body>
```

之后需要在 config 文件中的 `HtmlWebpackPlugin` 插件处配置模版的路径：

```js
// webpack.config.js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack',
      template: 'index.html'
    })
  ]
};
```

### `clean-webpack-plugin` 清理 `/dist` 文件夹

webpack 每次编译的时候，会重新生成文件，然后将这些文件放置在 `/dist` 文件夹中，但不会重新生成 `/dist` 目录，而 webpack 是无法追踪到 `/dist` 中哪些文件是实际在项目中用到的。因此，如果 `/dist` 文件夹中有其它文件，或有每次编译完的历史文件，就会很杂乱。

通常，比较推荐在每次构建前清理 `/dist` 文件夹，这样只会生成用到的文件。

而清理 `/dist` 文件夹就要用到 `clean-webpack-plugin` 管理插件。

**安装**

```shell
npm install clean-webpack-plugin -D
```

**配置**

```js
// webpack.config.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin(),
  ]
};
```

此时再运行 `npm run build` 就会发现，`dist` 目录每次都会重新生成，那些多余的文件就会被清理。

### 生产环境压缩 css js 等文件

**安装**

```shell
npm install optimize-css-assets-webpack-plugin -D
npm install uglifyjs-webpack-plugin -D
```

**配置**

```js
let OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
let UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  optimization:{ // 优化项
    minimizer:[
      new UglifyJsPlugin({
        cache: true,  // 缓存
        parallel: true,  //  并发打包，一起压缩多个
        sourceMap: true  // 源码映射
      }),
      new OptimizeCSSAssetsPlugin()  // 压缩css 会影响 js 的打包，需使用 babel 将 ES6 语法转为 ES5 语法
    ]
  },
  mode: 'production',
}
```

### `copy-webpack-plugin` 复制文件

**安装**

```shell
npm install copy-webpack-plugin -D
```

**配置**

```js
// webpack.config.js 
let CopyWebpackPlugin = require('copy-webpack-plugin');
plugins:[
  new CopyWebpackPlugin([
    {from:'doc',to:'./'}  // 将 doc 目录下的文件 拷贝到 dist 目录下
  ])
]
```

### `BannerPlugin` 版权声明插件

webpack 内置的插件，将参数字符串插入到每一个打包出来的 js 文件的头部。

```js
let webpack = require('webpack');
plugins:[
  new webpack.BannerPlugin('make 2020 by dora')
]
```

### `DefinePlugin` 定义全局变量

webpack 内置的插件，定义模块中可以使用的全局变量。

变量的值如果是一个字符串，它会被当作一个代码片段来使用。因此需要通过 `JSON.stringify` 转化，或者外层再包含一个引号。`"'production'"`

```js
plugins: [
  new webpack.DefinePlugin({
    DEV: JSON.stringify('production'),
    'SERVICE_URL': JSON.stringify("http://www.dorayu.com"),
    FLAG: 'true',
  }),
],
```

```js
// some.js
console.log(typeof FLAG)  // boolean
```

### `IgnorePlugin` 忽略解析文件

webpack 内置的插件。

如 `moment.js` 时间插件，忽略插件中的全部语言包，减少打包的文件大小。

**安装**

```shell
npm install moment -S
```

**配置**

```js
plugins: [
  new webpack.IgnorePlugin(/\.\/locale/, /moment/)
],
```

使用

```js
import moment from 'moment';
import 'moment/locale/zh-cn';  // 忽略后需要手动引入语言包
moment.locale('zh-cn');        // 设置语言
```

### `dllPlugin` 动态链接库

webpack 内置的插件。

以 react，react-dom 为例：

**安装** 

- `react` 及 `react-dom`
- `babel-loader`，`@babel/core`，`@babel/preset-env` 及 `@babel/preset-react`。编译 es6 及 `react` 语法。

```shell
npm install react react-dom
npm install babel-loader @babel/preset-env @babel/preset-react -D
```

**使用**

```js
// some.js
import React from 'react';
import {render} from 'react-dom';

render(<h1>jsx</h1>, window.root);
```

```html
<!-- template.html -->
<div id="root"></div>
```

```js
// webpack.config.js 中 配置 babel-loader
rules: [
  {
    test: /\.js$/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react'
        ]
      }
    }
  }
]
```

但是，如此打包出来的文件比较大，会让实时打包速度比较慢，因此可以将 react 第三方库抽离出来，单独打包，在 html 中引入打包好的文件，就不需要每次编译的时候都重新打包 react 等第三方库。

**配置**

新建配置文件 `webpack.dll.config.js`，专门用于打包 `react` 或 `vue` 等第三方库。

```js
// webpack.dll.config.js
let path = require('path');
let webpack = require('webpack');

module.exports ={
  mode:'development',
  entry:{
    react:['react','react-dom'],
  },
  output:{
    filename:'_dll_[name].js',
    path:path.resolve(__dirname,'dist'),
    library:'_dll_[name]', // 变量名
    // libraryTarget:'var' // 变量的声明方式 默认为var，其他如 commonjs  umd  this ...
  },
  plugins:[
    new webpack.DllPlugin({
      name:'_dll_[name]',  // name 的值等于 output 的 library 名
      path: path.resolve(__dirname,'dist','manifest.json') //manifest 任务清单
    })
  ]
}
```

运行 `webpack.dll.config.js` 配置文件，以生成打包后的 js 文件和 `manifest.json` 文件

```shell
npx webpack --config webpack.dll.config.js
```

在 `html` 模板文件中引入打包后的 js 文件，`_dll_[name].js`，如 `_dll_react.js`。

```html
<script src="/_dll_react.js"></script>
```

然后需要在主配置文件中引入打包后的配置。该配置的作用是在编译的过程中遇到 `import` 引入 `react` 或 `react-dom` 时，不会解析编译，而是通过 `manifest.json` 查找到变量对应的模块位置。如果找不到，则会打包 react 或 react-dom

```js
// webpack.config.js
plugins: [
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname,'dist','manifest.json')
  })
],
```

这样，在之后 `npm run dev` 或 `build` 的时候就不会对 `react` 库进行打包，会大大的减少 `bundle.js` 的文件大小。

### `happypack` 多线程打包

分配线程时也会消耗一些时间。

**安装**

```shell
npm install happypack -D
```

**配置**

```js
let Happypack = require('happypack');
module: {
  rules: [
    {
      test:/\.js$/,
      use: 'Happypack/loader?id=js'  // 多线程打包 js
    },
    {
      test:/\.css$/,
      use:'Happypack/loader?id=css'  // 多线程打包 css
    }
  ]
},
plugins: [
  new Happypack({
    id:'js',
    use: [{   // 通过 babel-loader 多线程打包 js
      loader:'babel-loader',
      options: {
        presets:[
          '@babel/preset-env',
          '@babel/preset-react'
        ]
      }
    }]
  }),
  new Happypack({
    id:'css',     // 通过 style-loader css-loader 多线程打包 css
    use: ['style-loader','css-loader']
  })
],
```



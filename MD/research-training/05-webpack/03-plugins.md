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

### 提取 css 文件

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

### 生成 html

当在出口设置中加入文件名哈希值时，手动在 html 中引入编译完的 js 文件，就会显得很不方便，因此可以借助 `HtmlWebpackPlugin` 插件实现在 html 中自动插入编译完的 js 文件。

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
  ]
};
```

这时运行 `npm run build` 将在 `dist` 目录下生成一个 `index.html` 文件，其中就已经引入了编译好的 js 文件。如果有提取 css 文件，此时也会自动引入 `<link>` 标签。

#### options 选项

可以通过向 new 出来的 `html-webpack-plugin` 实例传参来配置 html 的属性。

- `title`：html 的 `<head>` 里 `<title>` 标签的内容。

- `filename`：文件名，默认为 `index.html`，也可指定子目录，`assets/admin.html`。

- `template`：以该路径的 html 文件为模版生成 html 文件输出到 `output` 的目录里。

- `minify`：压缩生成的 html 文件。

- `hash`：html 中引入的 `bundle.js` 添加 hash

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

### 清理 `/dist` 文件夹

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

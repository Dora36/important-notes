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

## 提取 css 文件

在多数情况下，为了在生产环境中节省加载时间，一般会进行 CSS 分离，通过 `<link>` 标签将 css 添加到 html 中，而不是直接在 `<head>` 中插入 `<style>` 标签。

要想实现这个功能，就需要借助 `mini-css-extract-plugin` 插件。插件是 webpack 的支柱功能，目的在于解决 loader 无法实现的其他事。

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
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

**运行 webpack**

```shell
npm run build
```

## 生成 html

当在出口设置中加入文件名哈希值时，手动在 html 中引入编译完的 js 文件，就会显得很不方便，因此可以借助 `HtmlWebpackPlugin` 插件实现在 html 中自动插入编译完的 js 文件。

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
    new HtmlWebpackPlugin({
      title: 'webpack'
    })
  ]
};
```

**运行 webpack**

```shell
npm run build
```

**添加模版 html**

此时就会看到 `HtmlWebpackPlugin` 创建了一个全新的文件，编译完的 js 文件会自动添加到 html 中。然而问题是，每次 `build` 都会重新生成 html，就会导致 html 中无法添加自定义的内容，因此，需要添加一个模版文件，让 webpack 每次都基于模版文件生成 html。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
  <my-btn>千万别点</my-btn>
  <span class="my-btn">哇哦</span>
</body>
</html>
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

此时，再次运行 webpack：

```shell
npm run build
```

## 清理 `/dist` 文件夹

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

**运行 webpack**

```shell
npm run build
```
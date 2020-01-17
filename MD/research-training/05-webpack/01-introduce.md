# webpack 入门介绍

## 入门

**安装**

```shell
$ mkdir webpack-demo && cd webpack-demo
$ npm init -y
$ npm install webpack webpack-cli -D
```

```js
// package.json
{
  "scripts": {
    "build": "webpack"
  }
}
```

**运行**

默认入口为 `./src`，默认出口为 `./dist/main.js`。

```shell
npm run build
```

**配置**

`webpack.config.js`

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

## 引入模块

webpack 会通过代码中的 `import` 、 `export` 等引入模块的语句将所有相互依赖的模块打包成一个或多个文件。而 webpack 自身只理解 js 文件，可项目中需要引入的模块种类却非常复杂，比如 css 文件，图片，字体，json 文件等。

此时，就需要使用 `loader` 去处理那些非 js 的文件，`loader` 可以在 `import` 加载模块时预处理文件，将所有类型的文件转换为 webpack 能够处理的有效模块。

以 css 文件为例，先安装处理 css 的 loader。

```shell
npm install style-loader css-loader -D
```

其次在 config 文件中配置 loader。

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
};
```

此时，所有以 `import` 引入的 `.css` 结尾的文件，都将被提供给 `style-loader` 和 `css-loader` 预处理。当该模块运行时，含有 CSS 字符串的 `<style>` 标签，将被插入到 html 文件的 `<head>` 中。

接下来就在 js 中引入 css 模块。

```js
// src/index.js
import './btn.css';

let btn = document.querySelector('my-btn');
btn.classList.add('my-btn');
```

```css
/* src/btn.css */
.my-btn {
  padding: 8px 10px;
  background-color: cadetblue;
  border-radius: 5px;
  color: #fff;
}
```

之后在 html 中引入即将编译的 js 文件。

```html
<!-- dist/index.html -->
<body>
  <dora-btn></dora-btn>
  <script src="./bundle.js"></script>
</body>
```

最后，运行 webpack：

```shell
npm run build
```

## 生成 html

要想在 html 中自动插入编译完的 js 文件，就需要安装插件。插件是 webpack 的支柱功能，目的在于解决 loader 无法实现的其他事。

首先安装插件 `HtmlWebpackPlugin`：

```shell
npm install html-webpack-plugin -D
```

其次在 config 文件中配置插件。

```js
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'test html'
    })
  ]
};
```

最后，运行 webpack：

```shell
npm run build
```

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
  <my-btn></my-btn>
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
      title: 'test html',
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

通常，在每次构建前清理 `/dist` 文件夹，是比较推荐的做法，因为只会生成用到的文件。

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





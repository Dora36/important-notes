# webpack 中 loader 的用法

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
  <my-btn>千万别点</my-btn>
  <script src="./bundle.js"></script>
</body>
```

最后，运行 webpack：

```shell
npm run build
```

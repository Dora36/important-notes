# webpack 中 loader 的用法

## loader 的用途

webpack 会通过代码中的 `import` 、 `export` 等引入模块的语句将所有相互依赖的模块打包成一个或多个文件。而 webpack 自身只理解 js 文件，可项目中需要引入的模块种类却非常复杂，比如 css 文件，图片，字体，json 文件等。

此时，就需要使用 `loader` 去处理那些非 js 的文件，`loader` 可以在 `import` 加载模块时预处理文件，将所有类型的文件源代码转换为 webpack 能够处理的有效模块。

在 webpack 的配置中 `loader` 有两个目标：

- 利用 `test` 属性，标识出应该被对应的 `loader` 进行转换的某个或某些文件。
- 通过 `use` 属性，表示应该使用哪个 `loader`进行转换。

在 `module.rules` 的数组中，定义每一个 `loader`，里面包含两个必须属性：`test` 和 `use`。其作用是，当 webpack 在 `require()/import` 语句中匹配到符合 `test` 的路径时，在对它打包之前，先使用 `use` 里定义的 `loader` 转换一下，转换完之后再打包。

## modules 模块

对比 `Node.js` 模块，webpack 模块能够以各种方式表达它们的依赖关系：

- ES2015 的 `import` 语句，import 只能写在页面顶端。

- CommonJS 的 `require()` 语句，require 可以写在代码中，按需引用。

- AMD 的 `define` 和 `require` 语句。

- css/sass/less 文件中的 `@import` 语句。

- css 样式(`url(...)`)或 HTML 文件(`<img src=...>`)中的图片链接(image url)。

在 webpack 中可通过以上方式加载各种类型的模块，而所有非 js 的模块都可以通过相应的 `loader` 来预处理。

## loader 特性

- loader 支持链式传递。能够对资源使用流水线(pipeline)。一组链式的 loader 将按照 **相反** 的顺序执行。loader 链中的第一个 loader 返回值给下一个 loader。在最后一个 loader处理完后，返回 webpack 所预期的 JavaScript。

- 相同的文件也可写多条规则，按照从下往上的顺序执行。

- loader 可以是同步的，也可以是异步的。

- loader 运行在 `Node.js` 中，并且能够执行任何可能的操作。

- loader 接收查询参数。用于对 loader 传递配置。

- loader 也能够使用 options 对象进行配置。

- 除了使用 `package.json` 常见的 `main` 属性，还可以将普通的 npm 模块导出为 loader，做法是在 `package.json` 里定义一个 loader 字段。

- 插件(plugin)可以为 loader 带来更多特性。

- loader 能够产生额外的任意文件。

## loader 的用法

```js
module.exports = {
  module: {
    rules: [
      // 只用一个可以用字符串，多个loader 需要数组形式
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  }
};
```

use 中的字符串是 loader 属性的简写方式，可通过对象形式传入选项参数。

```js
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }
```

其他属性：

- `noParse`：作用是不解析设置的模块中的依赖关系，可优化解析速度。比如 jquery 中没有依赖其他的模块，则在编译的过程中，遇到 `import $ from jquery`时，就不需要解析 jquery 文件。
- `exclude`：不包含设置的文件夹下的文件。
- `include`：只包含设置的文件夹下的文件。

```js
module: {
  noParse: /jquery/,
  rules: [
    {
      test:/\.js$/,
      exclude: /node_modules/,
      include: [path.resolve('src')],
      use: {
        loader:'babel-loader',
      }
    }
  ]
}
```

## 示例

### 处理 css 的引入

css 的引入可以在入口 js 文件中 `import` 或 `require` css 的入口文件。css 的入口文件可以 `import` 各种单独的 css 文件。

先安装处理 css 的 loader：`style-loader` 和 `css-loader`。

```shell
npm install style-loader css-loader -D
```

- `css-loader`：解析 CSS 文件，使用 `import/require()` 加载，并且返回 CSS 代码，可解析 css 中的 `@import` 和 `url()`。

- `style-loader`：将模块的导出作为样式添加到 DOM 中，会在 `<head>` 标签的末尾添加 `<style>` 标签。

其次在 config 文件中配置 loader。

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
            {
              loader: 'style-loader',
              options:{ insertAt:'top' }
            },
            'css-loader'
          }]
      }
    ]
  }
};
```

此时，所有以 `import` 引入的 `.css` 结尾的文件，都将被提供给 `style-loader` 和 `css-loader` 预处理。当该模块运行时，含有 CSS 字符串的 `<style>` 标签，默认会被插入到 html 文件的 `<head>` 标签尾部，由于上述配置为 `style-loader` 添加了 `{ insertAt:'top' }` 参数，则 `<style>` 标签会被插入到页面中其他的 `<style>` 标签的上面。

接下来就在 js 中引入 css 模块。

```js
// src/index.js
import './btn.css';

let btn = document.querySelector('my-btn');
if(btn) {
  btn.classList.add('my-btn');
}
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

**css 常用的其它 loader**

- `less-loader`：加载和转译 LESS 文件。

- `sass-loader`：加载和转译 SASS/SCSS 文件。

- `postcss-loader`：使用 [PostCSS](https://postcss.org/) 加载和转译 CSS/SSS 文件，将浏览器兼容前缀添加到 CSS规则中。

**`postcss-loader` 自动添加浏览器内核前缀**

```shell
npm install autoprefixer postcss-loader -D
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
    ]
  }
};
```

新建 `postcss.config.js` 配置文件。文件中使用 `autoprefixer` 插件。

```js
// postcss.config.js
module.exports = {
  plugins:[
    require('autoprefixer')
  ]
}
```

### 加载静态资源（图片和字体）

在 CSS 中的背景和图标这些图片以及字体，需要使用 `file-loader` 或 `url-loader` 将这些内容混合到 CSS 中。

- `file-loader`：用于将文件发送到输出文件夹，并返回（相对）URL。

- `url-loader`：像 `file-loader` 一样工作，但如果文件小于限制，可以返回 `DataURL`。

#### `file-loader`

**安装**

```shell
npm install file-loader -D
```

**配置**

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};
```

**引入**

```js
// src/index.js
import img from './index.jpeg';

console.log(img);    // 2121ccd3438f6f5b28b4009eea4ec1bc.jpeg
```

默认情况下，生成的文件的文件名就是文件内容的 `MD5` 哈希值并会保留所引用资源的原始扩展名。当 `import img from './index.jpeg';`，该图像将被处理并添加到 `output` 目录，并且 `img` 变量将包含该图像在处理后的最终 `url`。

当使用 `css-loader` 时，如上所示，CSS 中的 `url('./index.jpeg')` 会使用类似的过程去处理。loader 会识别这是一个本地文件，并将 `'./index.jpeg'` 路径，替换为输出目录中图像的最终路径。

`html-loader` 以相同的方式处理 `<img src="./index.jpeg" />`。

**选项配置**

可设置输出目录和输出文件名的配置。

```js
// webpack.config.js
use: [
  {
    loader: 'file-loader',
    options: {
      name: 'images/[name].[hash].[ext]'
    }
  }
]
```

- `[ext]`：资源扩展名

- `[name]`：资源的基本名称

- `[hash]`：内容的哈希值

以上配置，图片就会输出在 `dist` 目录下的 `images` 文件夹内，图片名为 `images/index.2121ccd3438f6f5b28b4009eea4ec1bc.jpeg`

#### `url-loader`

将文件作为 base64 编码的 URL 加载。功能类似于 `file-loader`，但是在文件大小（单位 byte）低于指定的限制时，可以返回一个 `DataURL`。

base64 的好处是可以减少 http 请求。但文件会比原文件大 1/3。

**安装**

```shell
npm install url-loader -D
```

**配置**

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name].[hash].[ext]',
              limit: 8192  // 文件大小限制
            }
          }
        ]
      }
    ]
  }
}
```

如果文件小于 `limit` 限制，则会被转为 base64 编码的 URL 加载；如果文件大于 `limit` 限制，则默认使用 `file-loader` 处理，并将所有 `options` 参数传递给 `file-loader`；或通过 `fallback` 选项指定其它处理 loader。

**引入**

```js
// src/index.js
import img from './index.jpeg';

console.log(img);    // data:image/jpeg;base64........
```

### babel-loader 转译 es6 语法

**安装**

```shell
npm install babel-loader @babel/core @babel/preset-env -D
```

**配置**

```js
// webpack.config.js
module.exports = {
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

可通过 `options` 属性传递参数选项给 `babel`，也可直接在根目录下新建 `.babelrc` 或 `babel.config.js` 文件来配置 `babel` 的选项。

### [`vue-loader`](https://vue-loader.vuejs.org/zh/)

可以编译和转换 Vue 组件。

**安装**

```shell
npm install vue vue-loader vue-template-compiler vue-style-loader -D
```

**配置**

```js
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
```

这个插件是必须的！ 它的职责是将你定义过的其它规则复制并应用到 `.vue` 文件里相应语言的块。例如，如果你有一条匹配 `/\.js$/` 的规则，那么它会应用到 `.vue` 文件里的 `<script>` 块，css 同理。

其中 `vue-style-loader` 用途和 `style-loader` 一样。

**vue 入口文件**

```html
<!-- app.vue -->
<template>
  <div>
    <h1 class="title">{{msg}}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Hello Vue!"
    };
  }
};
</script>

<style>
.title {
  color: burlywood
}
</style>
```

在入口文件中引入 vue 文件：

```js
// index.js
import Vue from 'vue';
import App from './app.vue';

new Vue({
  render (h) {
    return h(App)
  }
}).$mount('#app');
```

在 html 中定义 `vue` 要挂载的 `div` 元素。

```html
<div id="app"></div>
```

此时，运行 `npm run build` 即可。`vue-loader` 搭配 `webpack-dev-server` 的 HMR 使用，会更有利于开发体验。

### `eslint-loader` 实现 eslint 校验

**安装**

```shell
npm install eslint eslint-loader -D
```

**配置**

```js
module: {
  rules: [
    {
      test:/\.js$/,
      use: {
        loader:'eslint-loader',
        options: {
          enforce: 'pre'  // 前置 loader，即在最前面执行，因为有相同文件的规则时，loader 是从下到上执行，有了 pre，就可以最先执行。
         }
      }
    },
    {
      test:/\.js$/,
      use: 'babel-loader'
    }
  ]
}
```

新建 `.eslintrc.json` 文件，里面是 eslint 的校验规则。







[webpack 的 loaders](https://www.webpackjs.com/loaders/)
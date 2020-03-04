## 引入第三方模块（如 jquery）的方式

- `expose-loader` 暴露 `$` 变量到 `window` 上
- `webpack.providePlugin` 给每个模块提供一个变量 `$` 
- 通过 `html` 文件的 `script` 引入并让 `webpack` 不打包代码的方式。

loader 可分为：

- pre：前置 loader
- normal：普通 loader
- post：后置 loader
- 内联 loader：直接在代码中使用

安装 jquery

```shell
npm install jquery -S
```

第一种 `expose-loader`

expose-loader 暴露全局变量的 loader，属于内联的 loader。

使用一：

```js
// some.js
import $ from 'jquery';
console.log(window.$) // undefined

import $ from 'expose-loader?$!jquery'; // 把 jquery 作为 $ 变量暴露给全局
console.log(window.$) // jquery
```

使用二：

```js
module: {
  rules: [
    {
      test: require.resolve('jquery'),
      use: 'expose-loader?$'
    }
  ]
}
```

```js
// some.js
import $ from 'jquery';
console.log(window.$)  // jquery
```

第二种 `webpack.providePlugin`

在模块中使用 jquery 的时候不用 import，直接通过插件在每个模块中注入 $ 对象。

```js
let webpack = require('webpack');
module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery'  // 在每个模块中都注入 $
    })
  ]
}
```

```js
// some.js
console.log($) // jquery
console.log(window.$) // undefined
```

第三种 html 模版中引入 jquery 的 cdn

```html
<script src="cdn jquery"></script>
```

```js
// some.js
console.log($)  // jquery
console.log(window.$)  // jquery
```

如果在模块中 import 了 jquery，此时因为已经引入了 jquery 的 cdn，所以就不再需要 webpack 来打包 import 的 jquery 了。

```js
// webpack.config.js
module.exports = {
  externals: {
    jquery: '$'
  }
}
```

此时，打包出来的文件就会小很多。

## 打包文件分类

打包的时候样式在 css 目录下，图片在 img 目录下，如果相互引用的时候用相对路径就会出错，很麻烦。

此时就需要添加公共路径，将引用路径变为绝对路径。

```js
// webpack.config.js
module.exports = {
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: 'http://www.some.com/'
  }
}
```

output 中的 publicPath 会给所有的引用路径加上域名。

css 的输出路径中的 publicPath 只会给 css 的引用加上域名。

img 的输出路径中的 publicPath 只给 img 的引用加上域名。

```js
module: {
  rules: [{
    test:/\.(png|jpg|gif)$/,
    use:{
      loader: 'url-loader',
      options: {
        limit : 200*1024,
        outputPath: 'img/',
        publicPath: 'http://www.img.com/'
      }
    }
  }]
}
```

## source-map 源码映射

- `source-map` 源码映射，会单独生成一个 `sourcemap` 文件，会标识报错信息的列和行。

- `eval-source-map` 不会产生单独的文件，但会显示报错信息的行和列。

- `cheap-module-source-map` 不会产生列，但是是一个单独的映射文件，可以保存起来用于调试。

- `cheap-module-eval-source-map` 不会生成文件，集成在打包后的文件中，不会产生列。

```js
module.exports = {
  devtool:'source-map',
  // devtool:'eval-source-map',
}
```

## webpack 解决跨域问题

### 第一种 通过 proxy 代理重写请求的路径

前后端不同域名，不同端口

```js
devServer:{
  proxy: {
    '/api':{
      target:'http://domain.com',  // 目标路径
      pathRewrite:{'/api':''}  // 路径替换，请求的url中没有api，项目中ajax 请求可加 api
    }
  }
},
```

### 第二种 前段模拟数据

```js
devServer:{
  before(app) {
    app.get('/user',(req,res)=>{
      res.json({name:'dora 模拟数据'})
    })
  }
},
```

### 第三种 有服务端但不用代理处理，在服务端中启动 webpack，端口用服务端端口

前后端启动一样的端口

创建 `server.js` 文件

```js
// 自带 express 框架
let express = require('express');
let app = express();
let webpack = require('webpack');

// 需要 express 中间件 webpack-dev-middleware，可以在服务端启动 webpack
let WebpackDevMiddleware = require('webpack-dev-middleware');

let WebpackConfig = require('./webpack.config');
let compiler = webpack(WebpackConfig);

app.use(WebpackDevMiddleware(compiler));

app.get('/api/user',(req,res)=>{
  res.json({name:'dora webpack'})
});

app.listen(3000);
```

运行

```shell
node server.js
```

可直接启动 webpack 和服务端。

## resolve 属性的配置

`resolve` 用于解析第三方模块，配置模块的路径，`commonJs` 默认查找模块会从当前目录下的 `node_modul` 开始查找，如果找不到会向上继续找。`resolve` 的 `modules` 可以指定查找的文件夹，缩小查找范围。

`extensions` 设置扩展名，解析 `import` 引入的文件时，会给文件名加上设置的后缀依次解析，直到找到匹配的文件。

`alias` 设置别名，`import` 语法不写后缀默认引的是 js 文件，如 `vue` 其实引的是 `vue.runtime`。`bootstrap` 其实引入的是 `css` 文件，但如果只写 `import bootstrap` 的话就会找不到，就需要写全路径，所以可以用 `alias` 进行配置。

`mainFields` 设置查找具体的文件的顺序。也可解决 `bootstrap` 路径的问题。

`mainFiles` 指定入口文件的名字，默认为 index.js。

```js
module.exports = {
  resolve:{
    modules:[path.resolve('node_modules'), path.resolve('other')],
    extensions:['.js','.css','.vue','.json'],
    mainFields:['style','main'],
      // mainFiles:[],
    alias:{
      bootstrap: 'bootstrap/dist/css/bootstrap.css',
      vue$: 'vue/dist/vue.runtime.esm.js'
    }
  },
}
```

## 环境变量的配置

配置文件分开，然后通过 webpack-merge 合并不同的配置文件。

- `webpack.base.config.js`
- `webpack.dev.config.js`
- `webpack.prod.config.js`

安装

```shell
npm install webpack-merge -D
```

使用，在 `webpack.dev.config.js` 和 `webpack.prod.config.js` 中引入，然后通过不同的配置文件进行打包就可得到不同的打包后的文件。

```js
// webpack.dev.config.js
let {smart} = require('webpack-merge');
let BaseWebpackConfig = require('./webpack.base.config.js');

module.exports = smart(BaseWebpackConfig,{
  mode:'development',
})
```

```js
// webpack.prod.config.js
let {smart} = require('webpack-merge');
let BaseWebpackConfig = require('./webpack.base.config.js');

module.exports = smart(BaseWebpackConfig,{
  mode:'production',
  optimization: {
    minimizer: []
  },
})
```

## webpack 优化项

- module 的 noParse 属性

- loader 的 exclude include 属性

- 插件的 IgnorePlugin

## webpack 的自带优化

- `tree-shaking`，把没用到的代码自动删除。`import` 在生产环境下，会自动去除掉没用的代码，只有 `import` 语法可以自动 `tree-shaking`。es6 模块（`require`）会把结果放到 `default` 上。且 `require` 语法不支持 `tree-shaking`。

- `Scope Hoisting` 作用域提升，在 webpack 中会自动省略一些可以简化的代码，比如一些变量等。

## 多页面打包时抽离公共代码

以前的版本用的是 `commonChunkPlugins`，版本4变成了 `optimization` 优化项下的 `splitChunks` —— 分割代码块。

单入口不需要抽离，只有多页面应用才需要抽离公共模块。

配置

```js
module.exports = {
  optimization:{
    splitChunks:{ // 分割代码块
      cacheGroups:{ // 缓存组
        common:{ // 公共的模块
          chunks:'initial',
          minSize:0,
          minChunks:2,
        },
        vendor: {  // 抽离第三方模块
          priority:1, // 权重，优先抽离
          test:/node_modules/, // 引用了node_modules中的模块
          chunks:'initial',
          minSize:0,
          minChunks:2,
        }
      }
    }
  },
  entry: { // 多页面的多入口
    index:'./src/index.js',
    other:'./src/other.js'
  },
  output: { // 多页面的多出口
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

## 懒加载 依靠 import() 语法

`vue` ，`react` 的路由懒加载，都是靠的 `import()` 语法。`import()` 语法是 `webpack` 可用的 `es6` 草案中的语法，实际是用 `jsonp` 实现动态加载文件。比如点击按钮时加载某个文件（`source.js`），在打包时就会多出一个 `1.js` 的文件，其中有 `source.js` 的代码，只有在点击按钮时，才会加载打包的 `1.js` 文件，实现懒加载。

```js
// source.js
export default 'dora'
```

`index.js`，`import()` 语法生成的是一个 `promise`。

```js
// index.js
let button = document.createElement('button');
button.innerHTML='Hello';
button.addEventListener('click',function () {
  import('./source.js').then(data=>{
    console.log(data.default);
  })
});
document.body.appendChild(button);
```

`import()` 动态加载的语法需要通过 `@babel/plugin-syntax-dynamic-import` 插件解析。

安装

```shell
npm install @babel/plugin-syntax-dynamic-import -D
```

配置

```js
module: {
  rules: [{
    test:/\.js$/,
    include:path.resolve('src'),
    use: {
      loader:'babel-loader',
      options: {
        presets:[
          '@babel/preset-env'
        ],
        plugins:[
          '@babel/plugin-syntax-dynamic-import'
        ]
      }
    }
  }]
}
```

## tapable 事件流

主要用来管理插件。

`tapable` 库中有三种注册方法，`tap` 同步注册，`tapAsync(cb)` 异步注册带回掉函数，`tapPromise` 注册 `promise`。

同等的调用方法也有三种，`call`  `callAsync` `promise`

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require("tapable");
```


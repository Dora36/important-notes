## webpack安装

先初始化，生成 `package.json`。

    npm init

- 安装本地的 webpack，不推荐全局安装 webpack。
- webpack webpack-cli -D


    npm install --save-dev webpack 或 npm install webpack -D
    npm install --save-dev webpack-cli 或 npm install webpack-cli -D

`-D`, `--save-dev` 是安装包信息将加入到devDependencies（开发阶段的依赖），所以一般是开发阶段使用，上线不需要。

## 运行

    npx webpack  // 会运行默认的配置文件 `webpack.config.js`
    
    npx webpack --config webpack.other.config.js // 运行自定义的配置文件

npx webpack  == node_modules/.bin/webpack.cmd

## 手动配置 webpack

webpack 可以进行 0 配置，直接运行。也可自定义配置文件。

### 基础配置

webpack 是 node 写出来的，因此需要用 node 的写法

#### 出入口配置

    let path = require('path');
    
    module.exports = {
      entry: './src/index.js',  // 入口，可为相对路径
      output: {                 // 打包后的文件配置
        filename: 'bundle.js',  // 打包后的文件名
        path: path.resolve(__dirname, 'dist'),  // 路径 必须是一个绝对路径
      },
    };

`path` 是 `node` 内置的核心模块 其中 `resolve` 方法可以将相对路径解析为绝对路径。

     path.resolve('dist'));

在当前目录下解析出一个 dist 目录的绝对路径，__dirname 也表示在当前目录下解析

#### 模式配置

模式 默认两种 `production`（会压缩） 和 `development`

    module.exports = {
       mode: 'development', // 开发模式
    };

#### 开发服务器的配置

安装

    npm install --save-dev webpack-dev-server 或 npm install webpack-dev-server -D
    npx webpack-dev-server

配置

不配置默认 8080 端口

    module.exports = {
      devServer: {       // 通过 express 实现静态服务
        port: 3000,      // 默认在 `localhost:8080` 下建立服务
        contentBase: './dist',  // 将 dist 目录作为访问目录。
        compress: true,  // 启用gzip 压缩
        open:true        // 自动打开浏览器
      },
    };

不生成文件，在内存中打包

#### 插件 HtmlWebpackPlugin

`HtmlWebpackPlugin` 简化了 HTML 文件的创建，让插件自己生成一个HTML文件，以便为 webpack 包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的 webpack bundle 尤其有用。

安装

    npm install --save-dev html-webpack-plugin

配置

    let HtmlWebpackPlugin = require('html-webpack-plugin');
    
    module.exports = {
      plugins: [   //  数组  存放所有的 webpack 插件
        new HtmlWebpackPlugin({
          template: './src/index.html', // 以这个文件为模板
          filename: 'index.html',  // 生成的 html 文件名，不写默认也是 index.html
          minify: {  //  压缩生成的 html 文件
            removeAttributeQuotes: true,  // 去掉属性的双引号
            collapseWhitespace: true,     // 去掉空格
          },
          hash: true //html 中引入的 bundle.js 添加 hash
        })
      ],
    }

#### loader CSS 模块

webpack 默认只支持 js 模块，其它模块需要通过对应的 `loader` 将模块的源代码进行转换。

**loader 的用法**

- loader 的特点希望单一，因此可以很多个 loader 一起使用。
- loader 的语法：只用一个可以用字符串，多个loader 需要数组形式
- loader 的顺序 默认从右向左执行，从下往上执行
- 相同的文件可写多条规则，从下往上执行
- loader 还可以写成对象方式 可传参

css引入

在入口 js 文件中 `import` 或 `require` css 的入口文件。css 的入口文件可以 `import` 各种单独的 css 文件。


建议将 `style-loader` 与 `css-loader` 结合使用

`css-loader` 是解析 `@import`的，会 `import/require()` 后再解析它们。

`style-loader` 是将 `<style>` 元素附加到样式目标的末尾，即页面的 `<head>` 标签。

安装

    npm install --save-dev css-loader
    npm install style-loader -D

配置

    module.exports = {
      module: {
        rules: [{
          test: /\.css$/,
          use: [
            { // 可通过对象传入 option 配置
              loader: 'style-loader',
              options:{ insertAt:'top' } // style 标签插入到页面中其他的 style 标签上面
            },
            'css-loader'
          }]
        }]
      }
    }

可以处理 `less` (`less` 和 `less-loader`) 文件  `sass` (`node-sass` 和 `sass-loader`) 以及 `stylus` 等

    module.exports = {
      module: {
        rules: [{
          test: /\.(css|scss|sass)$/, 
          use: [{
            {
              loader: 'style-loader',
              options:{
                insertAt:'top'
              }
            },
            'css-loader',
            'sass-loader',  // 把 sass 转为 css
          }]
        }]
      }
    }

#### 提取 css 样式表的插件 `mini-css-extract-plugin`

安装

    npm install --save-dev mini-css-extract-plugin

配置

    let MiniCssExtractPlugin = require('mini-css-extract-plugin');
    
    module.exports = {
      plugins: [
        new MiniCssExtractPlugin({
          filename: 'main.css'  // 生成的 css 文件名
        })
      ],
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,   // 将css 文件提取出来，通过 link 引入到 html 中，而不是 style 标签
              'css-loader'
            ]
          },
          {
            test: /\.less$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'less-loader',
            ]
          }
        ]
      }
    }

这样会在生成的 html 文件中通过 `link` 方式引入 css 文件。

#### css 自动添加浏览器内核前缀

安装

    npm install postcss-loader -D
    npm install autoprefixer -D

配置

    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,   // 将css 文件提取出来，通过 link 引入到 html 中，而不是 style 标签
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'less-loader',
          ]
        }
      ]
    }

新建 `postcss.config.js` 配置文件。文件中使用 `autoprefixer` 插件。

    module.exports = {
      plugins:[
        require('autoprefixer')
      ]
    }

#### 生产环境压缩 css js 等文件

安装

    npm install optimize-css-assets-webpack-plugin -D
    npm install uglifyjs-webpack-plugin -D

配置

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
          new OptimizeCSSAssetsPlugin()  // 压缩css 会影响 js 的打包，需将 ES6 语法转为 ES5 语法
        ]
      },
      mode: 'production',
    }

#### 通过 babel 将 ES6 转为 ES5

安装

    npm install babel-loader @babel/core @babel/preset-env

打包 js 需要使用 `babel-loader` ，同时需要把 ES6 转为ES5。`@babel/preset-env` 的作用就是将 ES6 转为 ES5的。可解析 `import` 语法。

配置

    module: {
      rules: [
        {
          test:/\.js$/,
          use: {
            loader:'babel-loader',
            options: {
              presets:[
                '@babel/preset-env'  // 将 ES6 转为 ES5
              ]
            }
          }
        }
      ]
    }

@babel/plugin-transform-runtime 插件用来复用 babel 注入的一些帮助代码，该帮助代码用来实现 js 的一些内置新 api。

安装

```shell
npm install @babel/plugin-transform-runtime -D
npm install @babel/runtime -S
```

在 babel-loader 中的 options 中配置

```js
module: {
  rules: [
    {
      test:/\.js$/,
      use: {
        loader:'babel-loader',
        options: {
          presets:[
            '@babel/preset-env'  // 将 ES6 转为 ES5
          ],
          plugins: [
            '@babel/plugin-transform-runtime'
          ]
        },
        include: path.resolve(__dirname, 'src'),  // 匹配 js 文件时需要包含的文件夹
        exclude: /node_modules/  // 匹配js 文件时需要排除掉的文件夹
      }
    }
  ]
}
```

@babel/polyfill  用来处理 数组、对象等新扩展的方法。

用法

在模块内直接引用

```js
// some.js
require('@babel/polyfill');
'aaa'.includes('a');
```

#### eslint 校验

安装

```shell
npm install eslint eslint-loader -D
```

配置

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

.eslintrc.json

#### 引入第三方模块（如 jquery）的方式

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

#### 打包图片

##### 图片引入方式

- 在 js 中创建图片来引入

  需要 `file-loader` 处理图片，默认会在内部生成一张图片到 `build` 目录下，并把生成的图片的名字返回回来(md5)。在js 中需要使用 `import` 或 `require` 引入图片。
  
- 在 css 中用 `background: url('')` 来引入

  css 中可以直接使用路径引入图片，因为 `css-loader` 会默认将路径转换为 `require` 模式

- 在 html 中用 `<img>` 标签来引入

   需要使用 `html-withimg-loader` 编译 html 中的 `<img>` 标签引入图片的问题

js 使用

安装

```shell
npm install file-loader -D
```

webpack.config.js 中配置

```js
module: {
  rules: [{
    test:/\.(png|jpg|gif)$/,
    use:'file-loader'
  }]
}
```

js 文件中使用

```js
// some.js
import logo from 'path/to/logo.png';
let image = new Image();
image.src = './img/logo.jpg'; // 不能用路径直接引入，会认为是一个普通字符串，不会对图片进行打包。
image.src = logo;  // 通过 import 引入可行
document.body.appendChild(image);
```

html 使用

安装

```shell
npm install html-withimg-loader -D
```

`webpack.config.js` 配置

```js
module: {
  rules: [{
    test:/\.html$/,
    use:'html-withimg-loader'
  }]
}
```

##### 图片变成 base64 

base64 的好处是可以减少 http 请求。但文件会比原文件大 1/3。

需要使用 `url-loader`，可以设置限制，当图片小于多少k的时候，转换为 `base64`，如果大于设置的限制，则用 `file-loader` 产生图片。

安装

```shell
npm install url-loader -D
```

`webpack.config.js` 配置

```js
module: {
  rules: [{
    test:/\.(png|jpg|gif)$/,
    use:{
      loader: 'url-loader',
      options: {
        limit : 200*1024, // 200k
        outputPath:'img/' //输出在某个文件夹下
      }
    }
  }]
}
```

#### 打包文件分类

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

### 打包多页应用配置

见 webpack.page.config.js

### source-map 源码映射

- `source-map` 源码映射，会单独生成一个 `sourcemap` 文件，会标识报错信息的列和行。

- `eval-source-map` 不会产生单独的文件，但会显示报错信息的行和列。

- `cheap-module-source-map` 不会产生列，但是是一个单独的映射文件，可以保存起来用于调试。

- `cheap-module-eval-source-map` 不会生成文件，集成在打包后的文件中，不会产生列。


    module.exports = {
      devtool:'source-map',
      // devtool:'eval-source-map',
    }

### watch 实时打包文件

    module.exports = {
      watch:true,  // 监听文件，代码一有变化就进行实时打包
      watchOptions: {  // 监控的选项
        poll:1000,   // 每秒监听1000次
        aggregateTimeout: 500,   // 防抖，停止输入代码后 500ms 打包一次
        ignored:/node_modules/  // 忽略监控的文件
      },
    }

### webpack 中的一些小插件

#### cleanWebpackPlugin 

需要安装第三方模块，在每次打包 dist 文件夹时，会删除之前的，生成新的 dist 目录。

安装

    npm install clean-webpack-plugin -D

webpack.config.js 配置

    let CleanWebpackPlugin = require('clean-webpack-plugin');
    plugins:[
      new CleanWebpackPlugin('./dist')
    ]

#### copyWebpackPlugin

需要安装第三方模块，将指定文件夹打包进 dist 文件夹

安装

    npm install copy-webpack-plugin -D

webpack.config.js 配置

    let CopyWebpackPlugin = require('copy-webpack-plugin');
    plugins:[
      new CopyWebpackPlugin([
        {from:'doc',to:'./dist'} // 将 doc 文件夹内容 拷贝到 dist 文件夹中
      ])
    ]

#### BannerPlugin 

内置的插件，将参数字符串插入到每一个打包出来的 js 文件中。

    let webpack = require('webpack');
    plugins:[
      new webpack.BannerPlugin('make 2019 by dora')
    ]

### webpack 解决跨域问题

#### 通过proxy 代理重写请求的路径

    devServer:{
      proxy: {
        '/api':{
          target:'http://domain.com',  // 目标路径
          pathRewrite:{'/api':''}  // 路径替换，请求的url中没有api，项目中ajax 请求可加 api
        }
      }
    },

#### 前段模拟数据

    devServer:{
      before(app) {
        app.get('/user',(req,res)=>{
          res.json({name:'dora 模拟数据'})
        })
      }
    },

#### 有服务端但不用代理处理，在服务端中启动 webpack，端口用服务端端口

创建 `server.js` 文件

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

运行

    node server.js

可直接启动 webpack 和服务端。

### resolve 属性的配置

`resolve` 用于解析第三方模块，配置模块的路径，`commonJs` 默认查找模块会从当前目录下的 `node_modul` 开始查找，如果找不到会向上继续找。`resolve` 的 `modules` 可以指定查找的文件夹，缩小查找范围。

`extensions` 设置扩展名，解析 `import` 引入的文件时，会给文件名加上设置的后缀依次解析，直到找到匹配的文件。

`alias` 设置别名，`import` 语法不写后缀默认引的是 js 文件，如 `vue` 其实引的是 `vue.runtime`。`bootstrap` 其实引入的是 `css` 文件，但如果只写 `import bootstrap` 的话就会找不到，就需要写全路径，所以可以用 `alias` 进行配置。

`mainFields` 设置查找具体的文件的顺序。也可解决 `bootstrap` 路径的问题。

`mainFiles` 指定入口文件的名字，默认为 index.js。

    module.exports = {
      resolve:{
        modules:[path.resolve('node_modules'),path.resolve('other')],
        extensions:['.js','.css','.vue','.json'],
        mainFields:['style','main'],
         // mainFiles:[],
        alias:{
          bootstrap: 'bootstrap/dist/css/bootstrap.css',
          vue$: 'vue/dist/vue.runtime.esm.js'
        }
      },
    }

### 用 webpack 自带插件定义全局变量

如果这个值是一个字符串，它会被当作一个代码片段来使用。因此需要通过 `JSON.stringify` 转化，或者外层再包含一个引号。`"production"`

    plugins: [
      new webpack.DefinePlugin({
        DEV:JSON.stringify('production'),
        'SERVICE_URL': JSON.stringify("http://www.dorayu.com")
      }),
    ],

### 环境变量的配置

配置文件分开，然后通过 webpack-merge 合并不同的配置文件。
- `webpack.base.config.js`
- `webpack.dev.config.js`
- `webpack.prod.config.js`

安装

     npm install webpack-merge -D

使用，在 `webpack.dev.config.js` 和 `webpack.prod.config.js` 中引入，然后通过不同的配置文件进行打包就可得到不同的打包后的文件。

    let Merge = require('webpack-merge');
    let BaseWebpackConfig = require('./webpack.base.config.js');
    
    module.exports = Merge(BaseWebpackConfig,{
      mode:'development',
    })
    
    module.exports = Merge(BaseWebpackConfig,{
      mode:'production',
    })

### webpack 优化项

#### noParse

`noParse` 的作用是不解析设置的模块中的依赖关系，可优化解析速度。

    module:{
        noParse:/jquery/,
    }

#### 模块配置的 exclude include

`exclude` 不包含设置的文件夹下的文件。

`include` 只包含设置的文件夹下的文件。

    module: {
      rules: [
        {
          test:/\.js$/,
          exclude: /node_modules/,
          include:[path.resolve('src')],
          use: {
            loader:'babel-loader',
          }
        }
      ]
    }

#### 插件的 IgnorePlugin

如 `moment.js` 时间插件，忽略插件中的全部语言包，减少打包的文件大小。

安装

    npm install moment

配置

    plugins: [
      new webpack.IgnorePlugin(/\.\/locale/,/moment/)
    ],

使用

    import moment from 'moment';
    import 'moment/locale/zh-cn'; // 忽略后需要手动引入语言包
    
    moment.locale('zh-cn');

### 动态链接库 dllPlugin 示例：react，react-dom

安装 

- `react` 及 `react-dom`
- `babel-loader`，`@babel/core`，`@babel/preset-env` 及 `@babel/preset-react`。编译 es6 及 `react` 语法。


    npm install react react-dom
    npm install babel-loader @babel/preset-env @babel/preset-react -D

配置

新建配置文件 `webpack.dll.config.js`，专门用于打包 `react` 或 `vue` 等第三方库。

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

然后在主配置文件中引入打包后的配置。并且配置 `babel-loader`。

    plugins: [
      new webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname,'dist','manifest.json')
      })
    ],

运行 `webpack.dll.config.js` 配置文件，以生成打包后的 js 文件和 `manifest.json` 文件

    npx webpack --config webpack.dll.config.js

在 `html` 模板文件中引入打包后的 js 文件，`_dll_[name].js`，如 `_dll_react.js`。

    <script src="./_dll_react.js"></script>

这样，在之后 `npm run dev` 或 `build` 的时候就不会对 `react` 库进行打包，会大大的减少 `bundle.js` 的文件大小。


### 使用 happypack 进行多线程打包

分配线程时也会消耗一些时间。

安装

    npm install happypack

配置

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

### webpack 的自带优化

- `tree-shaking`，把没用到的代码自动删除。`import` 在生产环境下，会自动去除掉没用的代码，只有 `import` 语法可以自动 `tree-shaking`。es6 模块（`require`）会把结果放到 `default` 上。且 `require` 语法不支持 `tree-shaking`。

- `Scope Hoisting` 作用于提升，在 webpack 中会自动省略一些可以简化的代码，比如一些变量等。


### 多页面打包时抽离公共代码

以前的版本用的是 `commonChunkPlugins`，版本4变成了 `optimization` 优化项下的 `splitChunks` ——分割代码块。

配置

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
              test:/node_modules/,
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

### 懒加载 依靠 import 语法

`vue` ，`react` 的路由懒加载，都是靠的 `import()` 语法。`import()` 语法是 `webpack` 可用的 `es6` 草案中的语法，实际是用 `jsonp` 实现动态加载文件。比如点击按钮时加载某个文件（`source.js`），在打包时就会多出一个 `1.js` 的文件，其中有 `source.js` 的代码，只有在点击按钮时，才会加载打包的 `1.js` 文件，实现懒加载。

`source.js`

    export default 'dora'

`index.js`，`import()` 语法生成的是一个 `promise`。

    let button = document.createElement('button');
    button.innerHTML='Hello';
    button.addEventListener('click',function () {
      import('./source.js').then(data=>{
        console.log(data.default);
      })
    });
    document.body.appendChild(button);

配置

需要通过 `@babel/plugin-syntax-dynamic-import` 插件解析动态加载的 `import()` 语法。

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

### 热更新，只更新有变化的组件，不刷新整个页面

配置

    module.exports = {
      devServer: {
        hot:true,  // 启用热更新
        port: 3000,
        contentBase: './dist',
        open: true
      },
      plugins: [
        new webpack.NamedModulesPlugin(), // 打印更新的模块路径
        new webpack.HotModuleReplacementPlugin()  //热更新插件
      ],
    }

使用，在 js 文件中
    
    if(module.hot){
      module.hot.accept('./source',()=>{
        let str = require('./source');
        console.log(str.default);
      })
    }


### tapable 事件流

`tapable` 库中有三种注册方法，`tap` 同步注册，`tapAsync(cb)` 异步注册带回掉函数，`tapPromise` 注册 `promise`。

同等的调用方法也有三种，`call`  `callAsync` `promise`

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

### loader 

配置 `loader` 的位置信息

    resolveLoader:{
      modules:['node_modules', path.resolve(__dirname,'loaders')],  // 指定查找的文件夹
      alias:{ // 通过别名
        loader1: path.resolve(__dirname,'loaders','loader1.js')
      }
    },
    module:{
      rules:[
        {
          test:/\.js$/,
          use:'loader1'
        }
      ]
    }

配置多个 `loader`，注意执行顺序问题

从右往左执行

    module:{
      rules:[
        {
          test:/\.js$/,
          use:['loader3','loader2','loader1']
        }
      ]
    }

从下往上执行

    module:{
      rules:[
        {
          test:/\.js$/,
          use:{ loader: 'loader3' }
        },
        {
          test:/\.js$/,
          use:{ loader: 'loader2' }
        },
        {
          test:/\.js$/,
          use:{ loader: 'loader1' }
        },
      ]
    }

自定义顺序，`pre` 在前面的，`post` 在后面的，`normal` 默认的


    module:{
      rules:[
        {
          test:/\.js$/,
          use:{ loader: 'loader1' },
          enforce:'pre'
        },
        {
          test:/\.js$/,
          use:{ loader: 'loader2' }
        },
        {
          test:/\.js$/,
          use:{ loader: 'loader3' },
          enforce:'post'
        },
      ]
    }

顺序：pre + normal + inline(行内，嵌入代码里的loader) + post





























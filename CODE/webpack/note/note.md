## webpack安装
- 安装本地的 webpack，不推荐全局安装 webpack。
- webpack webpack-cli -D


    npm install --save-dev webpack 或 npm install webpack -D
    npm install --save-dev webpack-cli 或 npm install webpack-cli -D

`-D`, `--save-dev` 是安装包信息将加入到devDependencies（开发阶段的依赖），所以一般是开发阶段使用，上线不需要。

## 运行

    npx webpack  // 会运行默认的配置文件 `webpack.config.js`
    
    npx webpack --config webpack.other.config.js // 运行自定义的配置文件

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
              options:{ insertAt:'top' }
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

配置

    module: {
      rules: [
        {
          test:/\.js$/,
          use: {
            loader:'babel-loader',
            options: { // 使用 babel-loader 需要把 ES6 转为ES5
              presets:[
                '@babel/preset-env'  // 将 ES6 转为 ES5
              ]
            }
          }
        }
      ]
    }

#### 引入第三方模块（如 jquery）的方式

- `expose-loader` 暴露 `$` 变量到 `window` 上
- `webpack.providePlugin` 给每个模块提供一个变量 `$` 
- 通过 `html` 文件的 `script` 引入并让 `webpack` 不打包代码的方式。

#### 打包图片

##### 图片引入方式

- 在 js 中创建图片来引入

  需要 `file-loader` 处理图片，默认会在内部生成一张图片到 `build` 目录下，并把生成的图片的名字返回回来。在js 中需要使用 `import` 或 `require` 引入图片。
  
- 在 css 中用 `background('url')` 来引入

  css 中可以直接使用路径引入图片，因为 `css-loader` 或默认将路径转换为 `require` 模式

- 在 html 中用 img 标签来引入

   需要使用 html-withimg-loader 编译 html 中的 img 标签引入图片的问题

js 使用


安装

    npm install file-loader -D

webpack.config.js 中配置

    module: {
      rules: [{
          test:/\.(png|jpg|gif)$/,
          use:'file-loader'
        }]
    }

js 文件中使用

    import logo from 'path/to/logo.png';
    let image = new Image();
    image.src ='./img/logo.jpg'; // 不能用路径直接引入，会认为是一个普通字符串，不会对图片进行打包。
    image.src = logo;
    document.body.appendChild(image);

html 使用

安装

    npm install html-withimg-loader -D

`webpack.config.js` 配置

    module: {
      rules: [{
        test:/\.html$/,
        user:'html-withimg-loader'
      }]
    }

##### 图片变成 base64 

base64 的好处是可以减少 http 请求。而文件会比原文件大 1/3。

需要使用 `url-loader`，可以设置限制，当图片小于多少k的时候，用 `base64` 来转换，如果大于设置的限制，则用 `file-loader` 产出图片。

安装

    npm install url-loader -D

`webpack.config.js` 配置

    module: {
      rules: [{
          test:/\.(png|jpg|gif)$/,
          use:{
            loader: 'url-loader',
            options: {
              limit : 8192,
              outputPath:'img/' //输出在某个文件夹下
            }
          }
        }]
    }

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











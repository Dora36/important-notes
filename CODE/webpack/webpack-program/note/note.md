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






















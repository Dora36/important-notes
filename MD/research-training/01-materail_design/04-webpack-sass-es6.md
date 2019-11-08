# 使用 MDC 之 webpack 编译 sass 和 ES6

## 1. sass

### 安装依赖

初始化项目，生成 `package.json` 文件。

```
npm init
```

在 `scripts` 选项中添加 `start` 和 `build`属性。

```
{
  "scripts": {
    "start": "webpack-dev-server",
    "build": "webpack",
  }
}
```

安装以下依赖

```
npm install -D webpack webpack-cli webpack-dev-server css-loader sass-loader node-sass extract-loader file-loader
```

- `webpack`: 编译并打包 Sass 和 JavaScript
- `webpack-dev-server`: 开发服务
- `sass-loader`: 加载 sass 文件并编译成 css
- `node-sass`: Node.js 编译 Sass 的中间件，需要依赖 `sass-loader`
- `css-loader`: 处理 css 文件中 `@import` 和 `url()` 的路径
- `extract-loader`: 提取文件中的 CSS 为一个 `.css` 后缀的文件
- `file-loader`: 将 `.css` 文件发布成一个可引用的 URL 链接

### 模版 html 文件

新建 html 文件，并在其中引入在以下配置中会生成的 css 文件。

```html
<!-- index.html -->
<head>
  <link rel="stylesheet" href="bundle.css">
</head>
```

### 设置配置文件 `webpack.config.js`

```javascript
module.exports = [{
  entry: './app.scss',
  output: {
    filename: 'style-bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'bundle.css',
            },
          },
          { loader: 'extract-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ]
      }
    ]
  },
}];
```

### 新建 sass 文件

```css
body {
  color: blue;
}
```

### 运行

```
npm start
```

## 2. ES6

### 安装依赖

```
npm install -D @babel/core babel-loader @babel/preset-env
```

- `@babel/core`
- `babel-loader`: 编译 js 文件
- `@babel/preset-env`: 编译 es6 时的预设

### 模版 html 中添加 js 路径

```html
<script src="bundle.js" async></script>
```

### 设置配置文件

更改入口和出口设置

```javascript
entry: ['./app.scss', './app.js']

output: {
  filename: 'bundle.js',
}
```

在 `rules` 数组中添加 `babel-loader`

```javascript
{
  test: /\.js$/,
  loader: 'babel-loader',
  query: {
    presets: ['@babel/preset-env'],
  },
}
```

### 编译 

```
npm run build
```


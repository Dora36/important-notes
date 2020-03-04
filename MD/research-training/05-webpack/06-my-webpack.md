# 手写 webpack

## loader 

### use 中的 loader 路径

- node_modules

- 可以直接写绝对路径

- 通过 resolveLoader 设置别名

- 通过 resolveLoader 的 modules 指定查找的文件件

配置 `loader` 的位置信息：

```js
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
```

### loader 的实现方式

```js
// loader1.js
function loader(source) {
  // loader 的参数就是 源代码
  return source;
}
module.exports = loader;
```

### loader 的执行顺序

配置多个 `loader`，注意执行顺序问题

从右往左执行

```js
module:{
  rules:[
    {
      test:/\.js$/,
      use:['loader3','loader2','loader1']
    }
  ]
}
```

从下往上执行

```js
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
```

自定义顺序，`pre` 在前面的，`post` 在后面的，`normal` 默认的

```js
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
```

顺序：pre + normal + inline(行内，嵌入代码里的loader) + post

### loader 的实现示例

#### babel-loader 的实现

```js
// my-babel-loader.js
let babel = require('@babel/core');
let loaderUtils = require('loader-utils');

function loader(source) {
  console.log(this);  // loader 的上下文
  let options = loaderUtils.getOptions(this);
  let cb = this.async();  // 异步的回调
  babel.transform(source,{
    ...options,
    sourceMap: true,
    filename: this.resourcePath.split('/').pop() // 文件名
  },function(err, result) {
    cb(err, result.code, result.map);
  })
}

module.exports = loader;
```

loader 中的 this：

```js
function loader(source) {
  this.cacheable(false);  // 默认有缓存，传入 false 就不缓存了

  let cb = this.async();  // 异步方法的回调

  this.addDependency(options.filename); // 如果 loader 中有使用文件，则将此文件加入依赖中，即可通过 watch 实时监听文件的改变，实现重新打包的功能
}
```

#### file-loader 的实现

file-loader 的作用就是根据图片生成一个 md5 发射到 dist 目录下，并且返回当前的图片路径。

```js
// my-file-loader.js
let loaderUtils = require('loader-utils');
function loader(source) {

  // 根据 source 内容生成 md5 的路径
  let filename = loaderUtils.interpolateName(this, '[hash].[ext]', {content: source});

  this.emitFile(filename, source); // 发射文件

  // 返回图片的当前路径
  return `module.exports='${filename}'`;
}
loader.raw = true; // 将 source 内容转换为二进制

module.exports = loader;
```

#### url-loader 的实现

```js
// my-url-loader
let loaderUtils = require('loader-utils');
let mime = require('mime');

function loader(source) {
  let {limit} = loaderUtils.getOptions(this);
  if(limit && limit > source.lenhth) {
    return `module.exports="data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
  } else {
    return require('/file-loader').call(this, source);
  }
}
loader.raw = true;
module.exports = loader;
```

#### less-loader 的实现

```js
// my-less-loader
let less = require('less');
function loader(source) {
  let css;
  less.render(source, function (err, r) {
    // r.css 是 less 渲染出来的 css 结果
    css = r.css;
  });
  return css;
}
module.exports = loader
```

#### css-loader 的实现

解决引入图片或其他文件的路径，将字符串引入转换为 require 引入的写法，并用行内 loader 再转换引入的文件

```js
// my-css-loader
function loader(source) {
  let reg = /url\((.+?)\)/g;
  let pos = 0;
  let current;
  let arr = ['let list = []'];
  while (current = reg.exec(source)) {
    let [matchUrl, g] = current;
    let lastIdx = reg.lastIndex - matchUrl.length;
    arr.push(`list.push(${JSON.stringify(source.slice(pos, lastIdx))})`);
    pos = reg.lastIndex;
    // g 是图片路径，替换成 require 的写法 url(require('g'))
    arr.push(`list.push('url('+require(${g})+')')`);
    arr.push(`list.push(${JSON.stringify(source.slice(pos))})`);
    arr.push(`module.exports = list.join('')`)
  }
  return source;
}
module.exports = loader
```


#### style-loader 的实现

最后一个处理的 loader，必须导出 js 代码。

```js
// my-style-loader
function loader(source) {
  let str = `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
  `;
  return str;
}

loader.pitch = function(remainingRequest) {
  
  return str;
}
module.exports = loader
```


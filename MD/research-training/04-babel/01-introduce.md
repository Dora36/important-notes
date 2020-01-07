## Babel 简介

Babel 是一个 JavaScript 编译器。

**用途**

Babel 是一个工具链，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

JavaScript 作为一种语言，在不断发展，新的标准，新的提案和新的特性层出不穷。在这些新特性得到广泛普及之前，Babel 能够让你提前使用它们。

## Babel 初识篇

> Talk is cheap. Show me the code.

### [安装 babel](https://babeljs.io/en/setup/)

安装 babel 需要安装 `@babel/core` 和 `@babel/cli`。

Babel 的 CLI 是一种在命令行下使用 Babel 编译文件的简单方法。`@babel/core` 是其核心模块。

**全局安装**

```shell
npm install --global @babel/core @babel/cli
```

编译文件

```shell
babel my-file.js
```

这种编译命令，会将结果输出到终端。所以可以使用 `--out-file` 或着 `-o` 将结果写入到指定的文件中。

```shell
babel example.js --out-file compiled.js
# or
babel example.js -o compiled.js
```

编译整个 `src` 目录下的文件并将输出合并为一个文件。

```shell
babel src --out-file script-compiled.js
```

而如果要把一个目录整个编译成一个新的目录，可以使用 `--out-dir` 或者 `-d`。这不会覆盖目标目录下的任何其他文件或目录。

```shell
babel src --out-dir lib
# or
babel src -d lib
```

要在每次文件修改后自动编译该文件，可使用 `--watch` 或 `-w` 参数。

```shell
babel src -d lib --watch
```

如果要输出源码映射表（source map）文件，可以使用 `--source-maps` 或 `-s` 参数。

```shell
babel src -d lib -s
```

**局部安装**

尽管可以全局安装 Babel CLI，但还是按项目局部安装在本地会更好。因为不同项目可能会依赖不同版本的 Babel 并有选择的更新某些插件，这样会让项目对环境没有隐式依赖。

```shell
npm install --save-dev @babel/core @babel/cli
```

在 `package.json` 的 `scripts` 字段中添加 `build`。

```json
{
  "scripts": {
    "build": "babel src -d lib"
  },
}
```

然后在终端运行：

```shell
npm run build
```

### [配置文件](https://www.babeljs.cn/docs/configuration)

运行结果发现 Babel 并没有转译代码，而仅仅是把代码从 `src` 复制到了 `lib`。

这是因为 Babel 是通过安装各种 **插件（plugins）** 或 **预设（presets，也就是一组插件）** 来指示 Babel 去转换哪些语法的。

babel 的配置文件有两种方式 `.babelrc` 和 `babel.config.js`，官方推荐使用 `babel.config.js`。

**`babel.config.js`**

使用 `js` 语法，可以用编程的方式创建配置文件。

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [ ... ],
    plugins: [ ... ]
  };
}
```

**`.babelrc`**

使用 `json` 语法，是一个简单的并且只用于单个软件包的配置文件。

```js
{
  "presets": [ ... ],
  "plugins": [ ... ]
}
```

### 预设示例 `@babel/preset-env` 

首先安装 `@babel/preset-env`

```shell
npm install --save-dev @babel/preset-env
```

其次配置预设

```js
// .babelrc
{
  "presets": ["@babel/preset-env"]
}
```

```js
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["@babel/preset-env"]
  };
}
```

最后运行 babel：

```shell
npm run build
```


- [babel 手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/user-handbook.md)

- [babel 使用指南](https://www.babeljs.cn/docs/usage)



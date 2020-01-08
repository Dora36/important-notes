
# 插件 plugins 和 预设 presets

## 路径

可直接输入 `plugins` 或 `presets` 的名称，babel 将检查是否已经将其安装到 `node_modules` 目录下了。

```json
{
  "plugins": ["babel-plugin-myPlugin"],
  "presets": ["babel-preset-myPreset"]
}
```

也可以指定指向 `plugins` 或 `presets` 的绝对或相对路径。

```json
{
  "plugins": ["./node_modules/asdf/plugin"],
  "presets": ["./myProject/myPreset"]
}
```

**短名称**

如果插件名称的前缀为 `babel-plugin-`，可以使用它的短名称。以及如果预设的前缀为 `babel-preset-`，也可以使用它的短名称。

```js
{
  "plugins": [ "myPlugin"   /* 等同于 "babel-plugin-myPlugin" */ ],
  "presets": [ "myPreset"   /* 等同于 "babel-preset-myPreset" */ ]
}
```

同样适用于带有冠名（scope）的：

```js
{
  "plugins": [ "@org/name"   /* 等同于 "@org/babel-plugin-name" */ ],
  "presets": [ "@org/name"   /* 等同于 "@org/babel-preset-name" */ ]
}
```

## 执行顺序

- 插件在预设之前执行。

- 插件顺序**从前往后**依次执行。

- 预设顺序是颠倒的，**从后往前**执行。

```json
{
  "presets": [ "a", "b", "c" ]
}
```

将按 `c`、`b`、`a` 的顺序执行，主要是为了确保向后兼容。

## 参数

插件和预设都可以接受参数，参数由插件名或预设名和参数对象组成一个数组，可以在配置文件中设置。

```json
{
  "plugins": [
    "pluginA", 
    ["pluginA"], 
    ["pluginA", {}]
  ],
  "presets": [
    ["@babel/env", {}],
  ]
}
```

## `@babel/preset-env`

`@babel/preset-env` 是一个官方预设，通过他可以使用最新的 JavaScript，而无需单独配置目标环境所需的语法转换插件或可选的浏览器 `polyfill`。

`@babel/preset-env` 基于许多很棒的开源项目，例如 [`browserslist`][1]，[`compat-table`][2] 和 [`electronic-to-chromium`][3]。

利用这些开源数据可以获得哪些 JavaScript 语法或功能受到了浏览器等目标环境的支持，以及这些语法和功能到 Babel 转换插件和 polyfills 的映射。

并且 `@babel/preset-env` 接受配置文件中指定的任何 `target` 目标环境，并检查出目标环境需要用到的插件列表，将其传递给 Babel。

### Browserslist

对于基于浏览器的项目，建议使用 `.browserslistrc` 文件指定目标浏览器版本。

默认情况下，如果没有设置 `target` 或 `ignoreBrowserslistConfig` 选项，`@babel/preset-env` 将使用 [`browserslist`][1] 规定的配置。

`Browserslist` 将使用下列几种设置方式之一来确定浏览器和 `Node.js` 的版本：

- `package.json` 中的 `browserslist` 属性。官方推荐。

- 当前目录或根目录下的 `.browserslistrc` 或 `browserslist` 配置文件。

- `BROWSERSLIST` 环境变量。

- 如果以上都没有，则 Browserslist 将使用默认值：`> 0.5%, last 2 versions, Firefox ESR, not dead`
  
  
```js
// package.json

{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
}
```

```r
# .browserslistrc 

last 1 version
> 5%
not dead
```

### 参数选项 options

**1. targets**

设置项目所支持的环境（浏览器）版本。

```json
{
  "presets": [
    ["@babel/env", {
      "targets": "> 0.25%, not dead"
    }],
  ]
}
```

属性值可以是 `browserslist` 格式的查询字符串或者是要支持的最低版本环境组成的对象。

```json
{
  "presets": [
    ["@babel/env", {
      "targets": {
        "chrome": "58",
        "ie": "11"
      }
    }],
  ]
}
```

**2. spec**

布尔值，默认为 `false`。为该预设中的所有插件启用更符合规范的转换，但会使转换速度变慢。

**3. loose**

布尔值，默认为 `false`。为该预设中的所有插件启用“宽松”转换。

**4. useBuiltIns**

属性值可以是 `"usage"` 或 `"entry"` 或 `false`, 默认为 `false`。此选项设置 `@babel/preset-env` 处理 `polyfill` 的方式。

`"entry"` 需要全局引入 `import "@babel/polyfill";`，可能会包含项目中并没有用到的 `polyfill`，因此最终的包体积可能会过大。

`"usage"` 则是在每个文件中需要用到 `polyfill` 的地方，导入某一特定功能的 `polyfill`。推荐使用。

```js
presets: [
  [ 
    "@babel/env", 
    { "useBuiltIns": "usage" }
  ]
]
```



[1]: https://github.com/browserslist/browserslist

[2]: https://github.com/kangax/compat-table

[3]: https://github.com/Kilian/electron-to-chromium




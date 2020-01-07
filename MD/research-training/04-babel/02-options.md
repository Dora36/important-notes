
## 插件 plugins 和 预设 preset

### 路径

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

### 执行顺序

- 插件在预设之前执行。

- 插件顺序**从前往后**依次执行。

- 预设顺序是颠倒的，**从后往前**执行。

```json
{
  "presets": [ "a", "b", "c" ]
}
```

将按 `c`、`b`、`a` 的顺序执行，主要是为了确保向后兼容。

### 参数

插件和预设都可以接受参数，参数由插件名或预设名和参数对象组成一个数组，可以在配置文件中设置。

```json
{
  "plugins": [
    "pluginA", 
    ["pluginA"], 
    ["pluginA", {}]
  ],
  "presets": [
    ["env", {}],
  ]
}
```

### `@babel/preset-env`

`@babel/preset-env` 是一个官方预设，通过他可以使用最新的JavaScript，而无需单独配置目标环境所需的语法转换插件或可选的浏览器 polyfill。

`@babel/preset-env` 基于许多很棒的开源项目，例如 [browserslist][1]，[compat-table][2] 和 [electronic-to-chromium][3]。

利用这些开源数据可以获得哪些 JavaScript 语法或功能受到了浏览器等目标环境的支持，以及这些语法和功能到 Babel 转换插件和 polyfills 的映射。

并且 `@babel/preset-env` 接受配置文件中指定的任何 `target` 目标环境，并检查出目标环境需要用到的插件列表，将其传递给 Babel。

**Browserslist**





[1]: https://github.com/browserslist/browserslist

[2]: https://github.com/kangax/compat-table

[3]: https://github.com/Kilian/electron-to-chromium




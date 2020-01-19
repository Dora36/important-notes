### mode 模式

通过选择 `development` 或 `production` 之中的一个，来设置 `mode` 参数，设置以后就可以启用相应模式下的 webpack 内置的优化。

```js
// webpack.config.js
module.exports = {
  mode: 'development'
};
```

也可从从 CLI 参数中传递。

```shell
webpack --mode=production
```

**两种模式对应的内置配置**

|选项|描述|
|:-:|:--|
development|会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。|
production|会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin.|

### target 构建目标

因为服务器和浏览器代码都可以用 js 编写，所以 webpack 提供了多种构建目标(target)，可以在 webpack 配置中设置。

```js
// webpack.config.js
module.exports = {
  target: 'node'
};
```

使用 `node` webpack 会编译为用于 `Node.js` 环境的代码。使用 `Node.js` 的 `require`，而不是使用任意内置模块（如 `fs` 或 `path`）来加载 chunk。

每个 `target` 值都有各种部署/环境特定的附加项，以支持满足其需求。

### devtool 


### devServer





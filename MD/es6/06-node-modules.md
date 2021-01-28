## nodejs 的模块系统

在 Node.js 模块系统中，每个文件都被视为一个独立的模块。通过在特殊的 `exports` 对象上指定额外的属性，可以将函数和对象添加到模块的根部。模块内的本地变量是私有的。

```js
// circle.js
const { PI } = Math;
exports.area = (r) => PI * r ** 2;
exports.circumference = (r) => 2 * PI * r;
```

```js
// index.js
const circle = require('./circle');
console.log(`半径为 4 的圆的面积是 ${circle.area(4)}`);
```

## 模块封装器

在执行模块代码之前，Node.js 会使用一个如下的函数封装器将其封装：

```js
(function(exports, require, module, __filename, __dirname) {
  // 模块的代码实际上在这里
});
```

通过这样做，Node.js 实现了以下几点：

- 它保持了顶层的变量（用 `var`、 `const` 或 `let` 定义）作用在模块范围内，而不是全局对象。

- 它有助于提供一些看似全局的但实际上是模块特定的变量，例如：

    - 实现者可以用于从模块中导出值的 `module` 和 `exports` 对象。
    - 包含模块绝对文件名和目录路径的快捷变量 `__filename` 和 `__dirname`。

## 模块作用域

### exports

`exports` 是个对象，是在模块的文件级作用域内可用的。这是一个对于 `module.exports` 的更简短的引用形式。即 `exports` 对象和 `module.exports` 对象的引用地址一样，但如果分别重新赋值，就会切断绑定，不再相互引用。

因此 `module.exports.f = ...` 可以更简洁地写成 `exports.f = ...`。 但是，如果为 `exports` 赋予了新值，则它将不再绑定到 `module.exports`，也不会导出，仅在模块中可用。

```js
let name = 'dora';
exports.name =  name;          // 可从模块的引用中导出
console.log(module.exports);   // { name: 'dora' }
```

```js
let name = 'dora';
exports = name;                // 不导出，仅在模块中可用
console.log(module.exports);   // {}
```

`module.exports` 的赋值同理：

```js
let name = 'dora';
module.exports.name = name;
console.log(exports);          // { name: 'dora' }
```

```js
let name = 'dora';
module.exports = name;
console.log(exports);          // {}
```

### module

`module` 是对当前模块的引用，是每个模块本地的引用信息。

- `module.children`：被该模块引用的模块对象。

- `module.filename`：模块的完全解析后的文件名。

- `module.id`：模块的标识符。 通常是完全解析后的文件名。

- `module.loaded`：模块是否已经加载完成，或正在加载中。

- `module.parent`：最先引用该模块的模块。

- `module.paths`：模块的搜索路径。

- `module.require(id)`：`module.require()` 方法提供了一种加载模块的方法，就像从原始模块调用 `require()` 一样。为了做到这个，需要获得一个 `module` 对象的引用。因为 `require()` 会返回 `module.exports`，且 `module` 通常只在一个特定的模块代码中有效，所以为了使用它，必须显式地导出。

- `module.exports`：是个对象，由 Module 系统创建，用于指定一个模块所导出的内容，即可以通过 `require()` 访问的内容。还可以通过全局模块的 `exports` 访问 `module.exports`。对 `module.exports` 的赋值必须立即完成。 不能在任何回调中完成。

### require(id)

用于引入模块、 JSON、或本地文件。 可以从 `node_modules` 引入模块。可以使用相对路径引入本地模块或 JSON 文件，路径会根据 `__dirname` 定义的目录名或当前工作目录进行处理。

**require.main**

Module 对象，表示当 Node.js 进程启动时加载的入口文件的 `module` 对象。这意味着可以通过 `require.main === module` 来判断一个文件是否被直接运行。

对于 `index.js` 文件，通过 `node index.js` 运行则为 `true`；而 `circle.js` 文件通过 `require('./circle')` 运行则为 `false`，因为所有模块文件的 `require.main` 指向的都是入口文件 `index.js` 的 `module` 对象，而 `circle.js` 文件内部的 `module` 对象是自己模块的基本信息。

因为 `module` 提供了一个 `filename` 属性（通常等同于 `__filename`），所以可以通过检查 `require.main.filename` 来获取当前应用程序的入口点。

**require.resolve(request[, options])**

返回解析后的文件的绝对路径，使用内部的 `require()` 机制查询模块的位置，此操作只返回解析后的文件名，不会加载该模块。

- `request`：需要解析的模块路径。
- `options`：`{paths: xxx}`

    - `paths`：是个路径数组，表示从数组中列出的路径来解析模块位置。如果存在，则使用这些路径而不是默认的解析路径。这些路径中的每一个都用作模块解析算法的起点，这意味着从该位置开始检查 `node_modules` 层次结构。

**require.resolve.paths(request)**

返回一个数组，其中包含解析 `request` 过程中被查询的路径，如果 `request` 字符串指向核心模块则返回 `null`。

## 加载模块的路径

### 带路径符的模块路径

当路径以 `'/'`、 `'./'` 或 `'../'` 开头来表示文件时，`require()` 会先当作文件模块加载，没有找到文件，就会当作目录模块加载。

#### 文件模块

确切的文件名如果没有后缀，则会解析为 js 文件。

如果按确切的文件名没有找到模块，则 Node.js 会尝试带上 `.js`、 `.json` 或 `.node` 拓展名再加载。

`.js` 文件会被解析为 js 文件， `.json` 文件会被解析为 js 的 Object 对象。 `.node` 文件会被解析为通过 `process.dlopen()` 加载的编译后的插件模块。

以 `'/'` 为前缀的模块是文件的绝对路径。 例如，`require('/home/marco/foo.js')` 会加载 `/home/marco/foo.js` 文件。

以 `'./'` 为前缀的模块是相对于调用 `require()` 的文件的。 也就是说， `circle.js` 必须和 `foo.js` 在同一目录下以便于 `require('./circle')` 找到它。

#### 目录作为模块

可以把程序和库放到一个单独的目录，然后提供一个单一的入口来指向它。 把目录递给 `require()` 作为一个参数，有三种方式：

- 在根目录下创建一个 `package.json` 文件，并指定一个 `main` 模块。

    ```json
    { 
      "name" : "some-library",
      "main" : "./lib/some-library.js"
    }
    ```
    
    如果这是在 `./some-library` 目录中，则 `require('./some-library')` 会试图加载 `./some-library/lib/some-library.js`。

- 如果目录里没有 `package.json` 文件，或者 `main` 入口不存在或无法解析，则 Node.js 将会试图加载目录下的 `index.js`、`index.json` 或 `index.node` 文件。

- 如果这些尝试失败，则会报错，并抛出一个 `code` 属性为 `'MODULE_NOT_FOUND'` 的 Error。

### 不带路径符的模块路径

当没有以 `'/'`、 `'./'` 或 `'../'` 开头来表示文件时，这个模块必须是一个 **核心模块** 或加载自 `node_modules` 目录，如果有同名文件优先加载核心模块。

#### 核心模块

Node.js 有些模块会被编译成二进制，定义在 Node.js 源代码的 `lib/` 目录下。

`require()` 总是会优先加载核心模块。 例如，`require('http')` 始终返回内置的 HTTP 模块，即使有同名文件。

#### 从 node_modules 目录加载

如果传递给 `require()` 的模块标识符不是一个核心模块，也没有以 `'/'`、 `'./'` 或 `'../'` 开头，则 Node.js 会从当前模块的父目录开始，尝试从它的 `/node_modules` 目录里加载模块。

如果还是没有找到，则移动到再上一层父目录，直到文件系统的根目录。

如果给定的路径不存在，则 `require()` 会抛出一个 `code` 属性为 `'MODULE_NOT_FOUND'` 的 Error。

## CommonJS 模块的加载原理

CommonJS 的一个模块，就是一个脚本文件。`require` 命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个 `module` 对象。

```js
{
  id: '...',
  exports: { ... },
  loaded: true,
  ...
}
```

上面代码就是 Node 内部加载模块后生成的 `module` 对象。该对象的 `id` 属性是模块名，`exports` 属性是模块输出的各个接口，`loaded` 属性是一个布尔值，表示该模块的脚本是否执行完毕。

以后需要用到这个模块的时候，就会到 `exports` 属性上面取值。即使再次执行 `require` 命令，也不会再次执行该模块，而是到缓存之中取值。也就是说，CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。

```js
// a.js
console.log('this is a')
exports.a = 'a'
```

```js
// b.js
const a = require('./a.js');
exports.b = 'b'
```

```js
// main.js
const a1 = require('./a.js');
const a2 = require('./a.js');
const b = require('./b.js');
console.log('a1', a1);
console.log('a2', a2);

// $ node main.js 运行结果如下：
// this is a      只在第一次 require 时执行，即使是多个文件 require。
// a1 { a: 'a' }
// a2 { a: 'a' }  返回缓存的 exports 对象
```

### CommonJS 模块的循环加载

CommonJS 模块的重要特性是加载时执行，即脚本代码在 `require` 的时候，就会全部执行。一旦出现某个模块被“循环加载”，就只输出已经执行的部分，还未执行的部分不会输出。

另外，由于 CommonJS 模块遇到循环加载时，返回的是当前已经执行的部分的值，而不是代码全部执行后的值，两者可能会有差异。

```js
// a.js
console.log('a 开始');
exports.done = false;
const b = require('./b.js');
console.log('在 a 中，b =', b);
exports.done = true;
console.log('a 结束');
```

```js
// b.js
console.log('b 开始');
exports.done = false;
const a = require('./a.js');
console.log('在 b 中，a =', a);
exports.done = true;
console.log('b 结束');
```

```js
// main.js
console.log('main 开始');
const a = require('./a.js');
const b = require('./b.js');
console.log('在 main 中，a =', a);
console.log('在 main 中，b =',b);
```

当 `main.js` 加载这两个模块时，它们都已经完成加载。因此，该程序的输出会是：

```shell
$ node main.js
main 开始
a 开始
b 开始
在 b 中，a = { done: false }
b 结束
在 a 中，b = { done: true }
a 结束
在 main 中，a = { done: true }
在 main 中，b = { done: true }
```

`b.js` 中循环加载 `a.js` 时，为了防止无限循环，`b.js` 中得到的 `a` 的 `exports` 并未完全生成，此时得到的只是 `a.js` 中 `require('./b.js')` 之前的 `exports` 赋值，如果在此之前 `a` 的 `exports` 没有赋值，则返回空对象 `{}`，即所有变量为 `undefined`。因此在 `b.js` 中不能正确得到 `a.js` 的输出对象。

而在 `main.js` 中，不存在循环引用，因此 `a` 和 `b` 会依次同步加载完成，并都会获得完整的 `exports` 输出对象。因此在复杂的业务场景中，如果遇到循环引用的问题时，需要仔细的规划，以使循环模块依赖在应用程序内正常工作.

## import 命令

使用 `export` 命令定义了模块的对外接口以后，其他 JS 文件就可以通过 `import` 命令加载这个模块。

### 语法

`import` 命令接受一对 `{}` 大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名，必须与被导入模块对外接口的名称相同。

```js
import { name, hi } from './greet.js';
```

同时输入 `default` 默认接口和其他接口：

```js
import _, { each, forEach } from 'lodash';
```

**as 重命名**

如果想为输入的变量重新取一个名字，`import` 命令要使用 `as` 关键字，将输入的变量重命名。

```js
import { name, hi as greet } from './greet.js';
```

**通过 `*` 号整体加载模块**

除了指定加载某个输出值，还可以使用整体加载，即用星号 `*` 指定一个 **对象**，所有输出值都加载在这个对象上面。

```js
// circle.js
export function area(radius) {
  return Math.PI * radius * radius;
}

export function circumference(radius) {
  return 2 * Math.PI * radius;
}
```

```js
import * as circle from './circle';

console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));
```

### 输入接口

`import` 命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口。但是，如果是一个对象，改写属性是可以成功的，并且其他模块也可以读到改写后的值。

不过，这种写法很难查错，建议凡是输入的变量，都当作完全只读，不要轻易改变它的属性。

```js
import { a } from './xxx.js'

a = {};             // Syntax Error : 'a' is read-only;
a.foo = 'hello';    // 合法操作
```

### 加载执行

**后缀名**

`import` 后面的 `from` 指定模块文件的位置，可以是相对路径，也可以是绝对路径，`.js` 后缀可以省略。如果只是模块名，不带有路径，那么 **必须** 有配置文件，告诉 JavaScript 引擎该模块的位置。

**静态编译**

`import` 命令具有提升效果，会提升到整个模块的头部，首先执行。

```js
foo();

import { foo } from 'my_module';
```

这种行为的本质是，`import` 命令是在代码运行之前的编译阶段执行的。所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。在静态分析阶段，这些语法都是没法得到值的。

**执行**

`import` 语句会执行所加载模块中的代码，因此可以不指定输入接口，只引入模块执行其中语句。如果多次重复 `import` 同一个模块，只会执行一次，而不会执行多次。

```js
import 'lodash';   // 执行lodash模块，但是不输入任何值。
```

## export 命令

模块功能主要由两个命令构成：`export` 和 `import`。`export` 命令用于规定模块的对外接口，`import` 命令用于输入模块提供的功能。

一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果希望外部能够读取模块内部的某个变量，就必须使用 `export` 关键字输出该变量。

### 语法

**单个输出**

可以输出变量、函数或类：

```js
// greet.js
export let name = 'Dora';
export function hi(name) {
  return 'hello ' + name;
};
```

**组合输出**

在 `export` 命令后面，使用 `{}` 大括号指定所要输出的一组变量。它与前一种写法（直接放置在 `let` 语句前）是等价的，但是应该优先考虑使用这种写法。因为这样就可以在脚本尾部，一眼看清楚输出了哪些变量。

```js
// greet.js
let name = 'Dora';
function hi(name) {
  return 'hello ' + name;
};
export { name, hi };
```

**as 重命名**

通常情况下，`export` 输出的变量就是本来的名字，但是可以使用 `as` 关键字重命名。

```js
// greet.js
let name = 'Dora';
function hi(name) {
  return 'hello ' + name;
};
export { name, hi as greet };
```

### 对外接口

需要特别注意的是，`export` 命令规定的是对外的接口，其接口必须与模块内部的 **变量** 建立一一对应关系。

```js
// 报错
export 1;

// 报错
var m = 1;
export m;
```

上面两种写法都会报错，因为没有提供对外的接口。第一种写法直接输出 1，第二种写法通过变量 m，还是直接输出 1。1 只是一个值，不是接口。

正确的写法是下面这样。`export` 规定了对外的接口 `m`。其他脚本可以通过这个接口，取到值 1。其实质是，在接口名与模块内部变量之间，建立了一一对应的关系。

```js
// 写法一
export var m = 1;

// 写法二
var m = 1;
export { m };

// 写法三
var n = 1;
export { n as m };
```

另外，`export` 语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。这一点与 CommonJS 规范完全不同。CommonJS 模块输出的是值的缓存，不存在动态更新。

```js
// foo.js
export var foo = 'a';
setTimeout(() => foo = 'b', 500);
```

```js
import { foo } from './foo.js';
console.log(foo);     // a
setTimeout(() => {
  console.log(foo);   // b
}, 1000);
```

### export default 默认输出

`export default` 命令用于指定模块的默认输出。一个模块只能有一个默认输出，因此 `export default` 命令只能使用一次。

```js
export default function () {
  console.log('foo');
}
```

其他模块加载该模块时，`import` 命令可以为该匿名函数指定任意名字。

```js
import customName from './test.js';
customName();
```

上面代码的 `import` 命令，可以用任意名称指向 `test.js` 输出的方法，这时就不需要知道原模块输出的函数名。需要注意的是，这时 `import` 命令后面，不使用大括号。

**default 变量**

本质上，`export default` 就是输出一个叫做 `default` 的变量或方法，然后可以为它取任意名字。所以，下面的写法是有效的：

```js
// modules.js
function add(x, y) {
  return x * y;
}
export { add as default };    // 等同于  export default add;

// app.js
import { default as foo } from 'modules.js';  // 等同于  import foo from 'modules';
```

正是因为 `export default` 命令其实只是输出一个叫做 `default` 的变量，所以它后面不能跟变量声明语句。

```js
// 正确
export var a = 1;

// 正确
var a = 1;
export default a;

// 错误
export default var a = 1;
```

其中 `export default a` 的含义是将变量 `a` 的值赋给变量 `default`。同样地，因为 `export default` 命令的本质是将后面的值，赋给 `default` 变量，所以可以直接将一个值写在 `export default` 之后。

```js
export 42;          // 报错  因为没有指定对外的接口
export default 42;  // 正确  因为指定对外接口为 default
```

### 输出位置

`export` 命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，`import` 命令也是如此。这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。

## export 与 import 的复合写法

### 语法

如果在一个模块之中，先输入后输出同一个模块，`import` 语句可以与 `export` 语句写在一起。

```js
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
```

需要注意的是，写成一行以后，`foo` 和 `bar` 实际上并没有被导入当前模块，只是相当于对外转发了这两个接口，导致当前模块不能直接使用 `foo` 和 `bar`。

```js
export { foo as myFoo } from 'my_module';  // 重命名输出
export * from 'my_module';                 // 整体输出，会忽略模块的 default 方法。
export { default } from 'foo';             // 默认接口输出
export { default as foo } from 'foo';      // 默认接口重命名输出
```

### 用途示例

常量的集中管理。如果要使用的常量非常多，可以建一个专门的 `constants` 目录，将各种常量写在不同的文件里面，保存在该目录下。

```js
// constants/db.js
export const db = {
  url: 'http://my.couchdbserver.local:5984',
  admin_username: 'admin',
  admin_password: 'admin password'
};

// constants/user.js
export const users = ['root', 'admin', 'staff', 'ceo', 'chief', 'moderator'];
```

然后，将这些文件输出的常量，合并在 `index.js` 里面。

```js
// constants/index.js
export {db} from './db';
export {users} from './users';
```

使用的时候，直接加载 `index.js` 就可以了。

```js
// script.js
import {db, users} from './constants/index';
```

## import()

`import` 命令会被 JavaScript 引擎静态分析，即在编译时执行，先于模块内的其他语句执行，这样的设计，固然有利于编译器提高效率，但也导致无法在运行时加载模块。在语法上，条件加载就不可能实现。

为了解决这个问题，ES2020 提案 引入 `import(specifier)` 函数，支持动态加载模块。`import()` 函数的参数 `specifier`，指定所要加载的模块的位置，`specifier` 也可以动态生成。`import` 命令能够接受什么参数，`import()` 函数就能接受什么参数，两者区别主要是后者为动态加载。

`import()` 函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。它是运行时执行，也就是说，什么时候运行到这一句，就会加载指定的模块。另外，`import()` 函数与所加载的模块没有静态连接关系，这点也是与 `import` 语句不相同。`import()` 类似于 Node 的 `require` 方法，区别主要是前者是异步加载，后者是同步加载。

### 返回值

`import()` 返回一个 Promise 对象。`import()` 加载模块成功以后，这个模块会作为一个对象，当作 `then` 方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口。

```js
import('./myModule.js')
.then(({export1, export2}) => {
  // export1 和 export2 都是 myModule.js 的输出接口
});
```

如果模块有 `default` 输出接口，可以用参数直接获得。

```js
import('./myModule.js')
.then(myModule => {
  console.log(myModule.default);
});
// or
import('./myModule.js')
.then(({default: theDefault}) => {
  console.log(theDefault);  // 具名输入默认接口
});
```

**组合输入**

```js
import('./bbb.js').then(({ export1, default: export}) => {
  // export1 接口 和 default 的具名接口
})
```

## 循环引用

ES6 处理“循环加载”与 CommonJS 有本质的不同。CommonJS 是获取的缓存，因此在彼此循环的两个文件里，有一个文件永远获取不到完整的输出值。而 ES6 模块是动态引用，输出变量不会被缓存，而是成为一个指向被加载模块的引用，因此可以通过 js 特有的语法编译（变量提升）保证真正取值的时候能够取到值。

```js
// a.mjs
import {bar} from './b.mjs';
console.log('a.mjs');
console.log(bar);
export let foo = 'foo';

// b.mjs
import {foo} from './a.mjs';
console.log('b.mjs');
console.log(foo);
export let bar = 'bar';
```

通过 node 运行，结果如下：

```shell
$ node --experimental-modules a.mjs
b.mjs
ReferenceError: Cannot access 'foo' before initialization
```

上述代码，由于循环引用，并且 `let` 声明不会提升，导致在 `b.mjs` 中循环引用 `a.mjs` 时，由于 `a.mjs` 已经执行，因此 `a.mjs` 不会再次执行，会默认已经指向了变量引用，从而在执行到 `console.log(foo);` 时，并没有获取到 `foo` 的值。

解决这个问题的方法，就是让 `b.mjs` 运行的时候，`foo` 已经有定义了。这可以通过将 `foo` 写成函数来解决，函数具有提升作用，因此在最开始 `a.mjs` 引用 `b.mjs` 执行前，即 `import {bar} from './b.mjs'`  执行时，函数 `foo` 就已经有定义了，所以 `b.mjs` 加载的时候不会报错。这也意味着，如果把函数 `foo` 改写成函数表达式，也会报错。

```js
// a.mjs
import {bar} from './b.mjs';
console.log('a.mjs');
console.log(bar());
function foo() { return 'foo' }
export {foo};

// b.mjs
import {foo} from './a.mjs';
console.log('b.mjs');
console.log(foo());
function bar() { return 'bar' }
export {bar};
```

这时再执行 `a.mjs` 就可以得到预期结果：

```shell
$ node --experimental-modules a.mjs
b.mjs
foo
a.mjs
bar
```

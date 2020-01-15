# 解构赋值

## 数组解构

只要等号两边的模式相同，左边的变量就会被赋予对应的值。

```javascript
let [a, b, c] = [1, 2, 3];
```

如果解构不成功，变量的值就等于 `undefined`。

```javascript
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo  // 1
bar  // 2
baz  // 3

let [ , , third] = ["foo", "bar", "baz"];
third     // "baz"

let [head, ...tail] = [1, 2, 3, 4];
head      // 1
tail      // [2, 3, 4]

let [x, y, ...z] = ['a'];
x    // "a"
y    // undefined
z    // []
```

不完全解构情况下，解构依然可以成功。即等号左边的模式，只匹配一部分的等号右边的数组。

```javascript
let [a, [b], d] = [1, [2, 3], 4];
a  // 1
b  // 2
d  // 4
```

**解构赋值允许指定默认值**


ES6 内部使用严格相等运算符（`===`），判断一个位置是否有值。所以，只有当一个数组成员严格等于`undefined`，默认值才会生效。

```javascript
let [x, y = 'b'] = ['a'];             // x='a', y='b'
let [x, y = 'b'] = ['a', undefined];  // x='a', y='b'
let [x = 1] = [null];                 // x=null
```

如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值。

```javascript
function f() {
  console.log('aaa');
}

let [x = f()] = [1];
```

上面代码中，因为 `x` 能取到值，所以函数 `f` 根本不会执行。


默认值可以引用解构赋值的其他变量，但该变量必须已经声明。

```javascript
let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError: y is not defined
```

## 对象解构

对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。如果解构失败，变量的值等于 `undefined`。

```javascript
let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"

let { baz } = { foo: 'aaa', bar: 'bbb' };
baz // undefined
```

如果变量名与属性名不一致，必须写成下面这样。

```javascript
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"

let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'
```

也就是说，对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者。

```javascript
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"
foo // error: foo is not defined
```

与数组一样，解构也可以用于嵌套结构的对象。

```javascript
let obj = {};
let arr = [];

({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });

obj // {prop:123}
arr // [true]
```

注意，对象的解构赋值可以取到继承的属性。

```javascript
const obj1 = {};
const obj2 = { foo: 'bar' };
Object.setPrototypeOf(obj1, obj2);

const { foo } = obj1;
foo // "bar"
```

**对象的解构也可以指定默认值**

默认值生效的条件是，对象的属性值严格等于(`===`) `undefined`。

```javascript
var {x, y = 5} = {x: 1};
x // 1
y // 5

var {x = 3} = {x: null};
x // null
```

如果要将一个已经声明的变量用于解构赋值，必须将整个解构赋值语句，放在一个圆括号里面，才可以正确执行。

```javascript
let x;
{x} = {x: 1};   // SyntaxError: syntax error

// 正确的写法
let x;
({x} = {x: 1});
```

因为 JavaScript 引擎会将 `{x}` 理解成一个代码块，从而发生语法错误。只有不将大括号写在行首，避免 JavaScript 将其解释为代码块，才能解决这个问题。

## 解构赋值用途

### 1. 交换变量的值

```javascript
let x = 1;
let y = 2;

[x, y] = [y, x];
```

### 2. 取出函数返回的多个值

```javascript
// 返回一个数组
function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象
function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();
```

### 3. 函数传参

```javascript
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```

### 4. 提取 JSON 数据

解构赋值对提取 JSON 对象中的数据，尤其有用。

```javascript
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]
```

### 5. 输入模块的指定方法

对象的解构赋值，可以很方便地将现有对象的方法，赋值到某个变量。
加载模块时，往往需要指定输入哪些方法。解构赋值使得输入语句非常清晰。

```javascript
let { log, sin, cos } = Math;

const { SourceMapConsumer, SourceNode } = require("source-map");
```

参考链接：
 [*变量的解构赋值*](http://es6.ruanyifeng.com/#docs/destructuring)
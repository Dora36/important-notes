## 默认 Iterator 接口

Iterator 接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即 `for...of` 循环。当使用 `for...of` 循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。

一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是“可遍历的”（iterable）。

ES6 的有些数据结构原生具备 Iterator 接口（比如数组），即不用任何处理，就可以被 `for...of` 循环遍历。

原生具备 Iterator 接口的数据结构如下：

- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

### 调用 Iterator 接口的场合

有一些场合会默认调用 Iterator 接口，除了 `for...of` 循环，还有几个别的场合：

**1. 解构赋值**：对数组和 Set 结构进行解构赋值时，会默认调用 Symbol.iterator 方法。

```js
let set = new Set().add('a').add('b').add('c');

let [x,y] = set;             // x='a'; y='b'

let [first, ...rest] = set;  // first='a'; rest=['b','c'];
```

**2. 扩展运算符**：和 `for...of` 循环类似，内部调用的是数据结构的 `Symbol.iterator` 方法。

```js
// 例一
var str = 'hello';
[...str]   //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']      // ['a', 'b', 'c', 'd']
```

实际上，这提供了一种简便机制，可以将任何部署了 Iterator 接口的数据结构，转为数组。也就是说，只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符，将其转为数组。

```js
let arr = [...iterable];
```

## for...in

`for...in` 循环可以遍历数组或对象的键名。

`for...in` 循环数组有以下几个缺点：

- 数组的键名是数字，但是 `for...in` 循环是以字符串作为键名 `“0”`、`“1”`、`“2”` 等等。

- `for...in` 循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。

- 某些情况下，`for...in` 循环会以任意顺序遍历键名。

总之，`for...in` 循环主要是为遍历对象而设计的，不适用于遍历数组。但其遍历对象时，依然会包括 **原型链** 上添加的键。

```js
let obj = { a: 3 }

Object.prototype.b = 6;

for (let key in obj) {
  console.log(key)     // a  b
}
```

## for...of

`for...in` 循环，只能获得键名，不能直接获取键值。ES6 提供 `for...of` 循环，允许遍历获得键值。对于普通的对象，`for...of` 结构不能直接使用，会报错，必须部署了 Iterator 接口后才能使用。

`for...of` 循环可以使用的范围包括数组、Set 和 Map 结构、某些类似数组的对象（比如 arguments 对象、DOM NodeList 对象）、Generator 对象，以及字符串。

```js
let arr = ['a', 'b', 'c', 'd'];

for (let a in arr) {
  console.log(a);    // 0 1 2 3
}

for (let a of arr) {
  console.log(a);    // a b c d
}


for (let pair of arr.entries()) {
  console.log(pair);
}
```

`for...of` 循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。这一点跟 `for...in` 循环也不一样。

```js
let arr = [3, 5, 7];
arr.foo = 'hello';

for (let i in arr) {
  console.log(i);    // "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i);    //  "3", "5", "7"
}
```

`for...of` 循环可以与数组实例的 `entries()`，`keys()` 和 `values()` 方法共同遍历数组的键值。这三个方法调用后都会生成相应的遍历器对象，且只返回数字索引的相关值。其区别是 `keys()` 是对键名的遍历、`values()` 是对键值的遍历，`entries()` 是对键值对的遍历。

```js
let arr = ['a', 'b', 'c']

for (let k of arr.keys()) {
  console.log(k)        // 0  1  2
}

for (let v of arr.values()) {
  console.log(v)        // a  b   c
}

for (let field of arr.entries()) {
  console.log(field)    // [0, "a"]   [1, "b"]   [2, "c"]
}
```

`for...of` 循环可以代替数组实例的 `forEach` 方法。因为 `forEach` 循环不能中断，而 `for...of` 循环可以与 `break`、`continue` 和 `return` 配合使用。

```js
for (let n of fibonacci) {
  if (n > 1000)
    break;
  console.log(n);
}
```

### 对象的循环

对于普通的对象，因没有部署 Iterator 接口，`for...of` 结构不能直接使用，会报错。但可以通过使用 `Object.keys()`、`Object.values()`、`Object.entries()` 方法分别生成对象的键名、键值、键值对数组，然后遍历这个数组。

```js
for (let key of Object.keys(someObject)) {
  console.log(key + ': ' + someObject[key]);
}
```

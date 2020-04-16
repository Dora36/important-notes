## for...in

`for...in` 循环可以遍历数组或对象的键名。

`for...in` 循环数组有以下几个缺点：

- 数组的键名是数字，但是 `for...in` 循环是以字符串作为键名 `“0”`、`“1”`、`“2”` 等等。

- `for...in` 循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。

- 某些情况下，`for...in` 循环会以任意顺序遍历键名。

总之，`for...in` 循环主要是为遍历对象而设计的，不适用于遍历数组。但其遍历对象时，依然会包括 **原型链** 上添加的健。

```js
let obj = { a: 3 }

Object.prototype.b = 6;

for (let key in obj) {
  console.log(key)     // a  b
}
```

## for...of

`for...in` 循环，只能获得键名，不能直接获取键值。ES6 提供 `for...of` 循环，允许遍历获得键值。对于普通的对象，`for...of` 结构不能直接使用，会报错，必须部署了 Iterator 接口后才能使用。

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

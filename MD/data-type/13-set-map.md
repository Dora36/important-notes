## Set

ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是**唯一**的，没有重复的值。

### Set 构造函数

`Set` 本身是一个构造函数，用来生成 Set 数据结构。`Set` 函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。

```js
// 例一
const s = new Set();
s.add(3)
s    // Set {3}

// 例二
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
[...items]   // [1, 2, 3, 4, 5]
items.size   // 5

// 例三
const set = new Set(document.querySelectorAll('div'));
set.size    // 56
```

上面代码也展示了一种**数组去重**的方法：

```js
[...new Set(array)]
```

或者也可用 `Array.from` 方法将 Set 结构转为数组：

```js
function dedupe(array) {
  return Array.from(new Set(array));
}

dedupe([1, 1, 2, 3])  // [1, 2, 3]
```

也可去除字符串里面的重复字符：

```js
[...new Set('ababbc')].join('')   // "abc"
```

向 `Set` 加入值的时候，不会发生类型转换，所以 `5` 和 `"5"` 是两个不同的值。Set 内部判断两个值是否不同，类似于精确相等运算符（===），主要的区别是向 Set 加入值时认为 `NaN` 等于自身，而精确相等运算符认为 `NaN` 不等于自身。另外，两个对象总是不相等的。

### Set 实例的属性

- `Set.prototype.constructor`：构造函数，默认就是 Set 函数。
- `Set.prototype.size`：返回 Set 实例的成员总数。

### Set 实例的方法

Set 实例的方法分为两大类：操作方法和遍历方法。

**操作方法**：用于操作数据

- `add(value)`：添加某个值，返回 Set 结构本身。
- `delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
- `has(value)`：返回一个布尔值，表示该值是否为Set的成员。
- `clear()`：清除所有成员，没有返回值。

**遍历方法**：用于遍历成员

- `keys()`：返回键名的遍历器
- `values()`：返回键值的遍历器
- `entries()`：返回键值对的遍历器
- `forEach()`：使用回调函数遍历每个成员

需要特别指出的是，Set 的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用 Set 保存一个回调函数列表，调用时就能保证按照添加顺序调用。

`keys` 方法、`values` 方法、`entries` 方法返回的都是遍历器对象（Iterator 对象）。由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以 `keys` 方法和 `values` 方法的行为完全一致。`entries` 方法返回的遍历器，同时包括键名和键值，所以每次输出一个数组，它的两个成员完全相等。

```js
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的 `values` 方法，因此可以直接用 `for...of` 循环遍历 Set。

```js
let set = new Set(['red', 'green', 'blue']);

for (let x of set) {
  console.log(x);
}
// red
// green
// blue
```

Set 结构的实例与数组一样，也拥有 `forEach` 方法，用于对每个成员执行某种操作，没有返回值。`forEach` 方法的参数就是一个处理函数。该函数的参数与数组的 `forEach` 一致，依次为键值、键名、集合本身。这里需要注意，Set 结构的键名就是键值（两者是同一个值），因此第一个参数与第二个参数的值永远都是一样的。

```js
let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9
```

### 在 Set 中使用 Array 的方法

如果想在遍历操作中，同步改变原来的 Set 结构，目前没有直接的方法，但有两种变通方法。一种是利用原 Set 结构映射出一个新的结构，然后赋值给原来的 Set 结构；另一种是利用 `Array.from` 方法。

```js
// 方法一
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2));    // 2, 4, 6

// 方法二
let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2)); // 2, 4, 6
```

也可通过扩展运算符（`...`）使用数组的其他方法：

```js
let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));  // Set {2, 4}
```

因此使用 Set 可以很容易地实现并集、交集和差集：

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);     // Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));  // set {2, 3}

// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x)));  // Set {1}
```

## Map

JavaScript 的对象（Object），本质上是键值对的集合，但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。为了解决这个问题，ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应。

### Map 构造函数

作为构造函数，Map 可以接受一个数组作为参数。该数组的成员是一个个表示键值对的二维数组。

```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size          // 2
map.has('name')   // true
map.get('name')   // "张三"
map.has('title')  // true
map.get('title')  // "Author"
```

事实上，不仅仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作 Map 构造函数的参数。这就是说，Set 和 Map 都可以用来生成新的 Map。同样，生成 Map 的 Set 必须是由二维数组生成的。

如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键，比如 `0` 和 `-0` 就是一个键，布尔值 `true` 和字符串 `"true"` 则是两个不同的键。另外，`undefined` 和 `null` 也是两个不同的键。虽然 `NaN` 不严格相等于自身，但 Map 将其视为同一个键。

而对于对象类型的健，实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。

```js
const map = new Map();

const k1 = ['a'];
const k2 = ['a'];

map
.set(k1, 111)
.set(k2, 222);

map.get(k1) // 111
map.get(k2) // 222
```

### Map 实例的属性和方法

**属性**：

- `size`：返回 Map 结构的成员总数。

**操作方法**：

- `set(key, value)`：设置键名 `key` 对应的键值为 `value`，然后返回当前的 Map 对象，因此可以采用链式写法。如果 `key` 已经有值，则键值会被更新，否则就新生成该键。

- `get(key)`：读取 `key` 对应的键值，如果找不到 `key`，返回 `undefined`。

- `has(key)`：返回一个布尔值，表示某个键是否在当前 Map 对象之中。

- `delete(key)`：删除某个键，返回 `true`。如果删除失败，返回 `false`。

- `clear()`：清除所有成员，没有返回值。

**遍历方法**：

- `keys()`：返回键名的遍历器。
- `values()`：返回键值的遍历器。
- `entries()`：返回所有成员的遍历器。
- `forEach()`：遍历 Map 的所有成员。

需要特别注意的是，Map 的遍历顺序就是插入顺序。Map 结构的默认遍历器接口，就是 `entries` 方法，因此可以直接使用 `for...of` 遍历 Map。

```js
const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let key of map.keys()) {
  console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
  console.log(value);
}
// "no"
// "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"
```

此外，Map 还有一个 `forEach` 方法，与数组的 `forEach` 方法类似，也可以实现遍历。

```js
map.forEach(function(value, key, map) {
  console.log("Key: %s, Value: %s", key, value);
});
```

### Map 与其他数据结构的互相转换

**1. Map 转为数组**：比较快速的方法是使用扩展运算符（`...`）

```js
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]     // [1, 2, 3]

[...map.values()]   // ['one', 'two', 'three']

[...map.entries()]  // [[1,'one'], [2, 'two'], [3, 'three']]

[...map]            // [[1,'one'], [2, 'two'], [3, 'three']]
```

**2. 数组 转为 Map**：将数组传入 Map 构造函数，就可以转为 Map

```js
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
// Map {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }
```

**3. Map 转为对象**：如果所有 Map 的键都是字符串，它可以无损地转为对象；如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名

```js
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map()
  .set('yes', true)
  .set('no', false);
strMapToObj(myMap)       // { yes: true, no: false }
```

**4. 对象转为 Map**：对象转为 Map 可以通过 `Object.entries()`

```js
let obj = {"a":1, "b":2};
let map = new Map(Object.entries(obj));
```

此外，也可以自己实现一个转换函数：

```js
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

objToStrMap({yes: true, no: false})
// Map {"yes" => true, "no" => false}
```

**5. Map 转为 JSON**：Map 转为 JSON 要区分两种情况。一种情况是，Map 的键名都是字符串，这时可以选择转为对象 JSON。另一种情况是，Map 的键名有非字符串，这时可以选择转为数组 JSON。

```js
// 对象 JSON
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap)    // '{"yes":true,"no":false}'

// 数组 JSON
function mapToArrayJson(map) {
  return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap)   // '[[true,7],[{"foo":3},["abc"]]]'
```

**6. JSON 转为 Map**：分为对象 JSON 转为 Map 和数组 JSON 转为 Map

```js
// 对象 JSON
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}

jsonToStrMap('{"yes": true, "no": false}')   // Map {'yes' => true, 'no' => false}

// 数组 JSON
function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
}

jsonToMap('[[true,7],[{"foo":3},["abc"]]]')  // Map {true => 7, Object {foo: 3} => ['abc']}
```

### 在 Map 中使用 Array 的方法

结合数组的 `map` 方法、`filter` 方法，可以实现 Map 的遍历和过滤。

```js
const map0 = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');

const map1 = new Map(
  [...map0].filter(([k, v]) => k < 3)
);
// Map {1 => 'a', 2 => 'b'}

const map2 = new Map(
  [...map0].map(([k, v]) => [k * 2, '_' + v])
    );
// Map {2 => '_a', 4 => '_b', 6 => '_c'}
```

对 Map 的 value 进行排序：

```js
let map = new Map()
  .set('k1', 2)
  .set('k2', 4)
  .set('k3', 1)
  .set('k4', 3);

let sortMap = new Map(
  [...map].sort(([k1, v1], [k2, v2]) => v2 - v1)
)
```

# Array

## 属性 length

`length` 属性可获得数组的长度，即数组中值的个数。数组的长度是比数组最大索引值多一的数。

```js
let arr = [1, 2, 3, 4]
arr.length       //  4;
```

如果给 `length` 属性赋值，指定的数组长度小于原数组长度，会缩短数组。

```js
let arr = [1, 2, 3, 4]
arr.length = 3;
arr             // [1, 2, 3]
```

`length` 设为 0，可以清空数组。

```js
let arr = [1, 2, 3, 4]
arr.length = 0;
arr               // []
```

## 静态方法

### 1. Array.isArray()

`Array.isArray()` 方法返回一个布尔值，表示参数是否为数组。它可以弥补 `typeof` 运算符的不足。

```js
let arr = [1, 2, 3];

typeof arr           // "object"
Array.isArray(arr)   // true
```

### 2. Array.from()

`Array.from()` 方法用于将两类对象转为真正的数组：类数组对象和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。返回值是新数组。

```js
let arrayLike = { '0': 'a', '1': 'b', '2': 'c', length: 3 };

// ES5的写法
var arr1 = [].slice.call(arrayLike);   // ['a', 'b', 'c']

// ES6的写法
let arr2 = Array.from(arrayLike);      // ['a', 'b', 'c']
```

只要是部署了 `Iterator` 接口的数据结构，`Array.from` 都能将其转为数组。

```js
Array.from('hello')    // ['h', 'e', 'l', 'l', 'o']

let namesSet = new Set(['a', 'b'])
Array.from(namesSet)   // ['a', 'b']
```

任何有 `length` 属性的对象，即类数组对象，都可以通过 `Array.from()` 方法转为数组。

```js
Array.from({ length: 3 });    // [ undefined, undefined, undefined ]
```

`Array.from()` 还可以接受第二个参数，作用类似于数组的 `map` 方法，用来对每个元素进行处理，将处理后的值放入返回的数组。

```js
Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);

Array.from([1, 2, 3], (x) => x * x)   // [1, 4, 9]
```

`Array.from()` 的第三个参数，用来绑定 `this`。

**应用**

取出一组 DOM 节点的文本内容。

```js
let spans = document.querySelectorAll('span.name');

// map()
let names1 = Array.prototype.map.call(spans, s => s.textContent);

// Array.from()
let names2 = Array.from(spans, s => s.textContent)
```

将数组中布尔值为 `false` 的成员转为 `0`。

```js
Array.from([1, , 2, , 3], (n) => n || 0)   // [1, 0, 2, 0, 3]
```

返回各种数据的类型。

```js
function typesOf () {
    return Array.from(arguments, value => typeof value)
}
typesOf(null, [], NaN)   // ['object', 'object', 'number']
```

将字符串转为数组，然后返回字符串的长度。因为它能正确处理各种 `Unicode` 字符，可以避免 JS 将大于 `\uFFFF` 的 `Unicode` 字符，算作两个字符的 bug。

```js
function countSymbols(string) {
    return Array.from(string).length;
}
```

### 3. Array.of()

`Array.of()` 方法用于将一组值，转换为数组。

```js
Array.of(3, 11, 8)     // [3,11,8]
Array.of(3)            // [3]
Array.of(3).length     // 1
```

`Array.of()` 总是返回参数值组成的数组。如果没有参数，就返回一个空数组。

```js
Array.of()            // []
Array.of(undefined)   // [undefined]
Array.of(1)           // [1]
```

`Array.of()` 方法可以用下面的代码模拟实现。

```js
function ArrayOf(){
    return [].slice.call(arguments);
}
```

## 实例方法

### 1. valueOf()，toString()

`valueOf()` 方法是一个所有对象都拥有的方法，表示对该对象求值，不同对象的`valueOf()` 方法不尽一致。数组的 `valueOf` 方法是 `Array`  构造函数的原型上的方法，覆盖了 `Object` 的 `valueOf()` 方法，返回数组本身。

```js
let arr = [1, 2, 3];
arr.valueOf()    // [1, 2, 3]
```

`toString()` 方法也是对象的通用方法。数组的 `toString` 方法是 `Array`  构造函数的原型上的方法，覆盖了 `Object` 的 `toString()` 方法，返回数组的字符串形式。相当于调用 `join()` 方法，将数组转换为字符串，用逗号连接。

```js
let arr = [1, 2, 3];
arr.toString()     // "1,2,3"

let arr = [1, 2, 3, [4, 5, 6]];
arr.toString()     // "1,2,3,4,5,6"
```

### 2. push()，pop()

`push()` 方法用于在数组的末端添加一个或多个元素，并返回添加新元素后的数组长度。

**该方法会直接改变原数组。**

```js
let arr = [];

arr.push(1)           // 1
arr.push('a')         // 2
arr.push(true, {})    // 4
arr                   // [1, 'a', true, {}]
```

`pop()` 方法用于删除数组的最后一个元素，一次只能删一项。并返回被删除的该元素。

**该方法会直接改变原数组。**

```js
let arr = ['a', 'b', 'c'];

arr.pop()    // 'c'
arr          // ['a', 'b']
```

对空数组使用 `pop()` 方法，不会报错，而是返回 `undefined`。

```js
[].pop()     // undefined
```

`push()` 和 `pop()` 结合使用，就构成了“后进先出”的栈结构（stack）。

```js
let arr = [];
arr.push(1, 2);
arr.push(3);
arr.pop();   // 3 是最后进入数组的，但是最早离开数组。
arr          // [1, 2]
```

### 3. shift()，unshift()

`shift()` 方法用于删除数组的第一个元素，一次只能删一项。并返回被删除的该元素。

**该方法会直接改变原数组。**

```js
let arr = ['a', 'b', 'c'];

arr.shift()   // 'a'
arr           // ['b', 'c']
```

`push()` 和 `shift()` 结合使用，就构成了“先进先出”的队列结构（queue）。

```js
let arr = [];
arr.push(1, 2);
arr.push(3);
arr.shift();   // 1 是最先进入数组的，也最早离开数组。
arr            // [2, 3]
```

`unshift()` 方法用于在数组的第一个位置添加一个或多个元素，并返回添加新元素后的数组长度。

**该方法会直接改变原数组。**

```js
let arr = ['a', 'b', 'c'];

arr.unshift('x');      // 4
arr.unshift('y', 'z')  // 6
arr                    // ["y", "z", "x", "a", "b", "c"]
```

### 4. join()

`join()` 方法以指定参数作为分隔符，将所有数组成员连接为一个字符串返回。如果不提供参数，默认用逗号分隔。

**该方法不改变原数组。**

```js
let arr = [1, 2, 3, 4];

arr.join(' ')     // '1 2 3 4'
arr.join(' | ')   // "1 | 2 | 3 | 4"
arr.join('~')     // '1~2~3~4'
arr.join()        // "1,2,3,4"
```

如果数组成员是 `undefined` 或 `null` 或 `空位` ，会被转成空字符串。

```js
[undefined, null].join('#')   // '#'
['a',, 'b'].join('-')         // 'a--b'
```

通过 `call` 方法，这个方法也可以用于字符串或类数组对象。

```js
Array.prototype.join.call('hello', '-')    // "h-e-l-l-o"

let obj = { 0: 'a', 1: 'b', length: 2 };
Array.prototype.join.call(obj, '-')        // 'a-b'
```

### 5. concat()

`concat()` 方法用于多个数组的合并。它将新数组的成员，添加到原数组成员的后面，然后返回一个新数组。参数设置非常灵活，可以是数组变量，也可以是字符串或数组字面量。

**该方法不改变原数组。**

```js 
['hello'].concat(['world'], ['!'])  // ["hello", "world", "!"]
[].concat({a: 1}, {b: 2})           // [{ a: 1 }, { b: 2 }]
[1, 2, 3].concat(4, 5, 6)           // [1, 2, 3, 4, 5, 6]

let arr = [2,3];
[1].concat(arr)                     // [1, 2, 3]
```

`concat()` 方法是“浅拷贝”，拷贝的是对象的引用。

```js
let obj = { a: 1 };
let newArray = [].concat(obj);
newArray[0].a                    // 1
obj.a = 2                        // 2
newArray[0].a                    // 2
```

### 6. reverse()

`reverse()` 方法用于颠倒排列数组元素，返回改变后的数组。

**该方法会直接改变原数组。**

```js
let arr = ['a', 'b', 'c'];

arr.reverse()     // ["c", "b", "a"]
arr               // ["c", "b", "a"]
```

### 7. slice()

`slice(start, end)` 方法用于提取目标数组中选中的部分作为一个新的数组返回。

**该方法不改变原数组。**

**参数**

a. `slice(start, end)`，从下标 `start` 开始截取到下标 `end` 的元素，包含 `start` 不包含 `end`。

```js
let arr = ['a', 'b', 'c'];
arr.slice(1, 2)     // ["b"]
arr.slice(2, 6)     // ["c"]
```

b. `slice(start)`，只有 `start` 一个参数表示从包含 `start` 的下标开始截取后面所有的元素。

```js
let arr = ['a', 'b', 'c'];
arr.slice(1)    // ["b", "c"]
```

c. `slice()`，没有参数，则相当于从下标 `0` 开始截取后面所有的元素，实际上等于返回一个原数组的拷贝。

```js
let arr = ['a', 'b', 'c'];
arr.slice(0)    // ["a", "b", "c"]
arr.slice()     // ["a", "b", "c"]
```

d. `slice(-start, -end)`，参数可以用负数。表示倒数计算的位置。`-1` 表示倒数计算的第一个位置，依次向前类推。

```js
let arr = ['a', 'b', 'c'];
arr.slice(-2)         // ["b", "c"]
arr.slice(-2, -1)     // ["b"]
```

e. 如果第一个参数大于等于数组长度，或者第二个参数小于第一个参数，则返回空数组。

```js
let arr = ['a', 'b', 'c'];
arr.slice(4)           // []
arr.slice(2, 1)        // []
```

`slice()` 方法的一个重要应用，是通过 `call` 方法，将类数组对象转为真正的数组。

```js
Array.prototype.slice.call({ 0: 'a', 1: 'b', length: 2 })  // ['a', 'b']

Array.prototype.slice.call(document.querySelectorAll("div"));
Array.prototype.slice.call(arguments);
```

### 8. splice()

`splice()` 方法是一个多功能方法，根据参数的不同可以插入、删除、替换元素，返回值是被删除的元素组成的数组。

**该方法会直接改变原数组。**

```js
arr.splice(start, count, addElement1, addElement2, ...);
```
**参数**

a. `arr.splice(start)` 1个参数是拆分，等同于将原数组在指定位置拆分成两个数组。删除下标之后的全部值。包含 `start` 。

```js
let arr = ['a', 'b', 'c', 'd', 'e', 'f'];
arr.splice(3)     // ['d', 'e', 'f']
arr               // ['a', 'b', 'c']
```

b. `arr.splice(start, count)` 2个参数是删除，第二个参数是删除的个数，相当于从 `start` 开始，删除第二个参数指定的元素个数。

```js
let arr = ['a', 'b', 'c', 'd', 'e', 'f'];
arr.splice(4, 2)    // ["e", "f"] 下标 4 开始删除 2 项
arr                 // ["a", "b", "c", "d"]
```

c. `arr.splice(start, count, ...)` 更多参数是替换，表示从 `start` 开始，删除 `count` 项，然后将后面的参数作为新元素插入原数组中，返回值是被删除的元素。

```js
let arr = ['a', 'b', 'c', 'd', 'e', 'f'];
arr.splice(4, 2, 1, 2)   // ["e", "f"]
arr                     // ["a", "b", "c", "d", 1, 2]
```

d.  `arr.splice(start, 0, ...)` 第二个参数为0时，表示插入，从 `start` 开始，删除 0 项，并在 `start` 之前添加新元素。返回空数组。

```js
let arr = ['a', 'b', 'c', 'd'];
arr.splice(2, 0, 1, 2)  // []
arr                     // ["a", "b", 1, 2, "c", "d"]
```

e. `arr.splice(-start, ...)` 起始位置 `start` 如果是负数，就表示从倒数位置开始进行相关操作。

```js
let arr = ['a', 'b', 'c', 'd'];
arr.splice(-2, 2)     // ["c", "d"]
```

### 9. sort()

`sort()` 方法对数组成员进行排序，默认按照字符顺序排序，会将数字隐式转换为字符串排序。直接返回改变后的原数组。

**该方法会直接改变原数组。**

```js
let arr = ['d', 'c', 'b', 'a'];
arr.sort()    // ["a", "b", "c", "d"]
arr           // ["a", "b", "c", "d"]
```

会将数字隐式转换为字符串排序。

```js
let arr=[2,3,45,12,78,67,155]
arr.sort()    // [12, 155, 2, 3, 45, 67, 78]
```

自定义排序，可以传入一个函数作为参数。

```js
let arr=[2,3,45,12,78,67,155]
arr.sort(function(a,b){ return a-b })   //  [2, 3, 12, 45, 67, 78, 155]
```

`sort` 的参数函数本身接受两个参数 `a` 和 `b`，表示进行比较的两个数组成员。如果该函数的返回值 `>0`，那么 `b` 排在 `a` 的前面；`=0`，位置不变；`<0`， `a` 排到 `b` 的前面。

```js
[{ name: "张三", age: 30 },
    { name: "李四", age: 24 },
    { name: "王五", age: 22 }
].sort(function (o1, o2) {
    console.log(o1.age, o2.age);
    return o1.age - o2.age;
})

// 30 24
// 30 22
// 24 22

// [
//   { name: "李四", age: 22 },
//   { name: "王五", age: 24 },
//   { name: "张三", age: 30 }
// ]
```

由上述例子可以看出 `sort()` 自定义排序参数传入的原理，第一次 30 和 24 相比，24 在前，30 在后，排序结果为 `(24,30,22)`；第二次 30 和 22 相比，22 在前，30 在后，排序结果为 `(24,22,30)`；第三次用来确定调换了位置的 30 和 22 中的排序在前的 22 和前一个 24 相比哪个更小，最终排序结果为 `(22,24,30)`。

由此可以看出排序的原理，如果位置不变，则依次向后做比较；一旦位置发生变化，则排列在前的元素会与上一个元素做比较，依次向前直到位置不变为止，再接着从发生变化的位置开始依次向后做比较。

**应用** ：可以让一个数组随机乱序。

```js
var arr = [1,2,3,4,5,6,7,8,9,10];
arr.sort(function(){
    return Math.random() - 0.5;
})
```

### 10. map()

`map()` 方法将数组的所有成员依次传入参数函数，然后把每一次的执行结果组成一个新数组返回。

**该方法不改变原数组。**

```js
let numbers = [1, 2, 3];
numbers.map(function (n) {
    return n + 1;
});        // [2, 3, 4]
numbers    // [1, 2, 3]
```

`map()` 方法接受一个函数作为参数。该函数调用时，map方法向它传入三个参数：第一个为当前进入函数的数组元素，第二个为当前元素的下标，第三个为原始数组。只有第一个是必须的。

```js
[1, 2, 3].map(function(elem, index, arr) {
    return elem * index;
});            // [0, 2, 6]
```

如果数组有空位，`map()` 方法的回调函数在这个位置不会执行，会跳过数组的空位。但不会跳过 `undefined` 和 `null`。

```js
let f = function (n) { return 'a' };

[1, undefined, 2].map(f)   // ["a", "a", "a"]
[1, null, 2].map(f)        // ["a", "a", "a"]
[1, , 2].map(f)            // ["a", , "a"]
```

`map()` 方法还可以接受第二个参数，用来绑定回调函数内部的 `this` 变量

```js
let arr = ['a', 'b', 'c'];

[1, 2].map(function (e) {
    return this[e];
}, arr)        // ['b', 'c']
```

### 11. forEach()

`forEach()` 方法与 `map()` 方法很相似，也是对数组的所有成员依次执行参数函数。但是，`forEach()` 方法不返回值，只用来操作数据。这就是说，如果数组遍历的目的是为了得到返回值，那么使用 `map()` 方法，否则使用 `forEach()` 方法。

`forEach()` 的用法与 `map()` 方法一致，参数是一个函数，该函数同样接受三个参数：当前元素、当前下标、整个数组。同样也会跳过数组的空位。但不会跳过 `undefined` 和 `null`。

```js
var log = function (n) { console.log(n + 1); };

[1, undefined, 2].forEach(log)   // 2   // NaN  // 3
[1, null, 2].forEach(log)        // 2   // 1    // 3
[1, , 2].forEach(log)           // 2    // 3
```

`forEach()` 方法也可以接受第二个参数，绑定参数函数的 `this` 变量。

```js
let out = [];

[1, 2, 3].forEach(function(elem) {
    this.push(elem * elem);
}, out);

out     // [1, 4, 9]
```

注意，`forEach()` 方法无法中断执行，总是会将所有成员遍历完。如果希望符合某种条件时，就中断遍历，要使用 `for` 循环。

```js
let arr = [1, 2, 3];

for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 2) break;
    console.log(arr[i]);
}
// 1
```

### 12. filter() 

`filter()` 方法用于过滤数组成员，满足条件的成员组成一个新数组返回。它的参数是一个函数，所有数组成员依次执行该函数，返回结果为 `true` 的成员组成一个新数组返回。

**该方法不改变原数组。**

```js
[1, 2, 3, 4, 5].filter(function (elem) {
    return (elem > 3);
})         // [4, 5]

let arr = [0, 1, 'a', false];
arr.filter(Boolean)     // [1, "a"]
```

`filter()` 方法的参数函数可以接受三个参数：当前元素、当前下标、整个数组。

```js
[1, 2, 3, 4, 5].filter(function (elem, index, arr) {
    return index % 2 === 0;
});       // [1, 3, 5]
```

`filter()` 方法还可以接受第二个参数，用来绑定参数函数内部的 `this` 变量。

```js
let obj = { MAX: 3 };
let myFilter = function (item) {
    if (item > this.MAX) return true;
};

let arr = [2, 8, 3, 4, 1, 3, 2, 9];
arr.filter(myFilter, obj)    // [8, 4, 9]
```

### 13. some()，every()

这两个方法类似“断言”（assert），返回一个布尔值，表示判断数组成员是否符合某种条件。

它们接受一个函数作为参数，所有数组成员依次执行该函数。该函数接受三个参数：当前元素、当前下标和整个数组。然后返回一个布尔值。

`some()` 方法是只要一个成员的返回值是 `true`，则整个 `some()` 方法的返回值就是 `true`，否则返回 `false`。

```js
let arr = [1, 2, 3, 4, 5];
arr.some(function (elem, index, arr) {
    return elem >= 3;
});          // true
```

`every()` 方法是所有成员的返回值都是 `true`，整个`every()` 方法才返回 `true`，否则返回 `false`。

```js
let arr = [1, 2, 3, 4, 5];
arr.every(function (elem, index, arr) {
    return elem >= 3;
});          // false
```

注意，对于空数组，`some()` 方法返回 `false`，`every()` 方法返回 `true`，回调函数都不会执行。

```js
function isEven(x) { return x % 2 === 0 }

[].some(isEven)       // false
[].every(isEven)      // true
```

`some()` 和 `every()` 方法还可以接受第二个参数，用来绑定参数函数内部的 `this` 变量。

### 14. reduce()，reduceRight()

`reduce()` 方法和 `reduceRight()` 方法依次处理数组的每个成员，最终累计为一个值。它们的差别是，`reduce` 是从左到右处理（从第一个元素到最后一个元素），`reduceRight` 则是从右到左（从最后一个元素到第一个元素），其他完全一样。

```js
[1, 2, 3, 4, 5].reduce(function (a, b) {
    console.log(a, b);
    return a + b;
})        //  15
// 1 2
// 3 3
// 6 4
// 10 5
```

`reduce()` 方法和 `reduceRight()` 方法的第一个参数都是一个函数。该函数接受以下四个参数。前两个是必须的，后两个是可选的。

- 累积变量，依次为上一轮的返回值，初始值默认为数组的第一个元素，可通过参数传入指定的初始变量。
- 当前变量，默认为数组的第二个元素，当累积变量有指定初始值时，当前变量为第一个元素。
- 当前变量的下标，默认为 1，当累积变量有指定初始值时，下标为 0。
- 原数组

`reduce()` 方法和 `reduceRight()` 方法的第二个参数是对累积变量指定初值。

```js
[1, 2, 3, 4, 5].reduce(function (a, b) {
    return a + b;
}, 10);       // 25
```

指定累积变量相当于设定了默认值，对于处理空数组尤其有用。

```js
function add(prev, cur) { return prev + cur; }
[].reduce(add)        // 报错
[].reduce(add, 1)     // 1  永远返回初始值，不会执行函数
```

`reduceRight()` 是从右到左依次执行函数。

```js
function subtract(prev, cur) { return prev - cur; }

[3, 2, 1].reduce(subtract)         // 0
[3, 2, 1].reduceRight(subtract)    // -4
```

**应用** 由于这两个方法会遍历数组，所以实际上还可以用来做一些遍历相关的操作。

找出字符长度最长的数组成员。

```js
function findLongest(entries) {
    return entries.reduce(function (longest, entry) {
    return entry.length > longest.length ? entry : longest;
    }, '');
}

findLongest(['aaa', 'bb', 'c'])     // "aaa"
```

将二维数组转化为一维

```js
[[0, 1], [2, 3], [4, 5]].reduce(function(a, b) {
    return a.concat(b);
},[])          // [0, 1, 2, 3, 4, 5]
```

数组去重

```js
let arr = [1,2,1,2,3,5,4,5,3,4,4,4,4];
let result = arr.sort().reduce((init, current)=>{
    if(init.length===0 || init[init.length-1]!==current){
        init.push(current);
    }
    return init;
}, [])         //[1,2,3,4,5]
```

按属性对object分类

```js
let people = [
    { name: 'Alice', age: 21 },
    { name: 'Max', age: 20 },
    { name: 'Jane', age: 20 }
];

function groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
    let key = obj[property];
    if (!acc[key]) {
        acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
    }, {});
}

groupBy(people, 'age');
// { 
//   20: [
//     { name: 'Max', age: 20 }, 
//     { name: 'Jane', age: 20 }
//   ], 
//   21: [{ name: 'Alice', age: 21 }] 
// }
```

参考链接：[Array.prototype.reduce()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

### 15. indexOf()，lastIndexOf()

`indexOf()` 方法返回参数在数组中第一次出现的位置，如果没有出现则返回-1。

```js
let arr = ['a', 'b', 'c'];
arr.indexOf('b')    // 1
arr.indexOf('y')    // -1
```

`indexOf()` 方法还可以接受第二个参数，表示搜索的开始位置。

```js
['a', 'b', 'c'].indexOf('a', 1)    // -1
```

`lastIndexOf()` 方法返回参数在数组中最后一次出现的位置，如果没有出现则返回-1。

```js
let arr = [2, 5, 9, 2];
arr.lastIndexOf(2)     // 3
arr.lastIndexOf(7)     // -1
```

注意，这两个方法不能用来搜索 `NaN` 的位置，即它们无法确定数组成员是否包含 `NaN`。这是因为这两个方法内部，使用严格相等运算符（===）进行比较，而 `NaN` 是唯一一个不等于自身的值。

```js
[NaN].indexOf(NaN)        // -1
[NaN].lastIndexOf(NaN)    // -1
```

### 16. copyWithin()

`copyWithin()` 方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。包含 `start` 不包含 `end`。

**该方法会直接改变原数组。**

```js
Array.prototype.copyWithin(target, start, end)
```

接受三个参数：

- `target`（必需）：从该位置开始替换数据。如果为负值，表示倒数。
- `start`（可选）：从该位置开始读取数据，默认为 `0`。如果为负值，表示倒数。
- `end`（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。

```js
[1, 2, 3, 4, 5].copyWithin(0, 3)   // [4, 5, 3, 4, 5]
```

上面代码表示将从下标 3 到数组结束的元素（4 和 5），复制到从下标 0 开始的位置，结果覆盖了原来的 1 和 2。

```js
[1, 2, 3, 4, 5].copyWithin(0, 3, 4)      // [4, 2, 3, 4, 5]
[1, 2, 3, 4, 5].copyWithin(0, -2, -1)    // [4, 2, 3, 4, 5]
[].copyWithin.call({length: 5, 3: 1}, 0, 3)  // {0: 1, 3: 1, length: 5}
```

### 17. find()，findIndex()

`find()` 方法用于找出第一个符合条件的数组元素。它的参数是一个回调函数，所有数组元素依次执行该回调函数，直到找出第一个返回值为 `true` 的元素，然后返回该元素。如果没有符合条件的元素，则返回 `undefined`。

```js
[1, 4, -5, 10].find((n) => n < 0)    // -5
```

`find()` 方法的回调函数可以接受三个参数，依次为当前元素、当前下标和原数组。

```js
[1, 5, 10, 15].find(function(value, index, arr) {
    return value > 9;
})        // 10
```

`findIndex()` 方法的用法与 `find()` 方法非常类似，返回第一个符合条件的数组元素的位置，如果所有元素都不符合条件，则返回 -1。

```js
[1, 5, 10, 15].findIndex(function(value, index, arr) {
    return value > 9;
})       // 2
```

这两个方法都可以接受第二个参数，用来绑定回调函数的 `this` 对象。

```js
function f(v){ return v > this.age; }
let person = {name: 'John', age: 20};
[10, 12, 26, 15].find(f, person);      // 26
```

另外，这两个方法都可以可以借助 `Object.is()` 方法识别数组的  `NaN`，弥补了 `indexOf()` 方法的不足。

```js
[NaN].indexOf(NaN)                        // -1

[NaN].findIndex(y => Object.is(NaN, y))   // 0
```

### 18. fill()

`fill()` 方法使用给定值，填充一个数组。

```js
['a', 'b', 'c'].fill(7)    // [7, 7, 7]

new Array(3).fill(7)       // [7, 7, 7]
```

`fill()` 方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。

```js
['a', 'b', 'c'].fill(7, 1, 2)    // ['a', 7, 'c']
```

注意，如果填充的类型为对象，那么被赋值的是同一个内存地址的对象，而不是深拷贝对象。

```js
let arr = new Array(3).fill({name: "Mike"});
arr[0].name = "Ben";
arr    // [{name: "Ben"}, {name: "Ben"}, {name: "Ben"}]

let arr = new Array(3).fill([]);
arr[0].push(5);
arr    // [[5], [5], [5]]
```

### 19. includes()

`includes()` 方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的`includes()` 方法类似。

```js
[1, 2, 3].includes(2)        // true
[1, 2, 3].includes(4)        // false
[1, 2, NaN].includes(NaN)    // true
```

该方法的第二个参数表示搜索的起始位置，默认为0。如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度（比如第二个参数为-4，但数组长度为3），则会重置为从0开始。

```js
[1, 2, 3].includes(3, 3);    // false
[1, 2, 3].includes(3, -1);   // true
```

没有该方法之前，我们通常使用数组的 `indexOf()` 方法，检查是否包含某个值。

```js
if (arr.indexOf(el) !== -1) {
    // ...
}
```

`indexOf()` 方法内部使用严格相等运算符（===）进行判断，这会导致对 `NaN` 的误判。`includes()` 使用的是不一样的判断算法，就没有这个问题。

```js
[NaN].indexOf(NaN)     // -1
[NaN].includes(NaN)    // true
```

### 20. flat()，flatMap()

`flat()` 用于将多维数组变成一维数组。返回一个新数组。

**该方法不改变原数组。**

```js
[1, 2, [3, 4]].flat()   // [1, 2, 3, 4]
```

`flat()` 默认只会“拉平”一层，如果想要“拉平”多层的嵌套数组，可以将 `flat()` 方法的参数写成一个整数，表示想要拉平的层数，默认为 1。

```js
[1, 2, [3, [4, 5]]].flat()     // [1, 2, 3, [4, 5]]
[1, 2, [3, [4, 5]]].flat(2)    // [1, 2, 3, 4, 5]
```

如果不管有多少层嵌套，都要转成一维数组，可以用 `Infinity` 关键字作为参数。

```js
[1, [2, [3]]].flat(Infinity)   // [1, 2, 3]
```

如果原数组有空位，`flat()` 方法会跳过空位。

```js
[1, 2, , 4, 5].flat()          // [1, 2, 4, 5]
```

`flatMap()` 方法对原数组的每个元素执行一个函数（相当于执行 `Array.prototype.map()`），然后对返回值组成的数组执行 `flat()` 方法。返回新数组。

**该方法不改变原数组。**

```js
[2, 3, 4].flatMap((x) => [x, x * 2])   // [2, 4, 3, 6, 4, 8]
//  相当于 [[2, 4], [3, 6], [4, 8]].flat()
```

`flatMap()` 只能展开一层数组。

```js
[1, 2, 3, 4].flatMap(x => [[x * 2]])   // [[2], [4], [6], [8]]
//  相当于 [[[2]], [[4]], [[6]], [[8]]].flat()
```

`flatMap()` 方法的参数是一个遍历函数，该函数可以接受三个参数，分别是当前数组元素、当前数组元素的下标（从零开始）、原数组。

`flatMap()` 方法还可以有第二个参数，用来绑定遍历函数里面的 `this`。

```js
arr.flatMap(function callback(currentValue[, index[, array]]) {
    // ...
}[, thisArg])
```

## 链式使用

上面这些数组方法之中，有不少返回的还是数组，所以可以链式使用。

```js
var users = [
    {name: 'tom', email: 'tom@example.com'},
    {name: 'peter', email: 'peter@example.com'}
];

users
.map(function (user) {
    return user.email;
})
.filter(function (email) {
    return /^t/.test(email);
})
.forEach(function (email) {
    console.log(email);
});
// "tom@example.com"
```

参考链接：

 - [*Array对象*](https://wangdoc.com/javascript/stdlib/array.html)

 - [*数组的扩展*](http://es6.ruanyifeng.com/#docs/array)
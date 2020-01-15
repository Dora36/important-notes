# 细数判断数据类型的各种方法

## 数据类型的分类

要想判断数据类型，首先要知道数据类型的分类。数据类型分为基本数据类型和引用数据类型。

### 基本数据类型

基本数据类型有 **五** 种，ES6中新加了第 **六** 种基本数据类型—— `Symbol` 类型。

- 数值（`number`)： 整数和小数。
- 字符串（`string`）： 文本
- 布尔值（`boolean`）：`true` 和 `false` 。
- `undefined`： 表示‘未定义’或不存在。一般情况下变量在声明后未赋值前都是undefined。
- `null`： 空值。
- `symbol`： ES6 引入的新原始数据类型，表示独一无二的值。

### 引用数据类型

引用类型数据也会统称为对象，即广义的对象，通常除了基本数据类型的其它数据都属于引用类型数据。

- 对象（`object`）： 狭义的对象，`{key1:value1, key2:value2,...}`
- 数组（`array`）： `[value1,value2,...]`
- 函数（`function`）
- 日期（`date`)
- 正则表达式（`RegExp`）
- ......

## 数据类型综合判断的各种方法

### typeof 运算符

`typeof` 返回字符串，`number`、`string`、`boolean`、`symbol`、`undefined`、`function`，所有其它的引用类型数据都返回 `object`，`null` 也返回 `object`。

```js
typeof 666            // "number"
typeof 'dora'         // "string"
typeof true           // "boolean"
typeof Symbol()       // "symbol"
typeof undefined      // "undefined"
typeof null           // "object"
typeof function(){}   // "function"
typeof []             // "object"
typeof /dora/         // "object"
```

#### 优点

可利用判断 `undefined` 来检查一个没有声明的变量，而不报错。实际编程中，这个特点通常用在判断语句中。

```js
// 错误的写法
if (v) { // ... }
// ReferenceError: v is not defined

// 正确的写法
if (typeof v !== "undefined") {
  // 这种写法在 v 没有声明的时候不会报错。
}
```

**注意**

ES6中引入了 `let` 之后，这个方法也不是万能的了。当变量在代码块内用 `let` 声明的时候，会形成“暂时性死区”（temporal dead zone，简称 TDZ），此时这个方法就没用了，`typeof` 还是会报错。

```js
typeof x; // ReferenceError
let x;
```

#### 缺点

不能准确的判断引用类型数据的具体类型，除了函数外，其余的都是返回 `object`。

```js
typeof {}     // "object"
typeof []     // "object"
```

此时，在需要判断数组或者对象时，就不适用了。

### Object.prototype.toString.call(value)

`Object.prototype.toString()` 方法返回对象的类型字符串，因此可以用来判断一个值的类型。

```js
let obj = {};
obj.toString()   // "[object Object]"
```

上面代码调用空对象的 `toString` 方法，结果返回一个字符串 `object Object`，其中第二个 `Object` 表示该值的 **构造函数**。

由于实例对象可能会自定义 `toString` 方法，覆盖掉 `Object.prototype.toString`方法，所以为了得到类型字符串，最好直接使用 `Object.prototype.toString` 方法。通过函数的 `call` 方法，可以在任意值上调用这个方法，帮助我们判断这个值的类型。

```js
Object.prototype.toString.call(value)
```

上面代码表示对 `value` 这个值调用 `Object.prototype.toString()` 方法。

#### 返回值

不同数据类型的 `Object.prototype.toString()` 方法返回值如下：

- 数值：返回 `[object Number]`。
- 字符串：返回 `[object String]`。
- 布尔值：返回 `[object Boolean]`。
- undefined：返回 `[object Undefined]`。
- null：返回 `[object Null]`。
- Symbol类型：返回 `[object Symbol]`。
- 数组：返回 `[object Array]`。
- arguments 对象：返回 `[object Arguments]`。
- 函数：返回 `[object Function]`。
- Error 对象：返回 `[object Error]`。
- Date 对象：返回 `[object Date]`。
- RegExp 对象：返回 `[object RegExp]`。
- 其他对象：返回 `[object Object]`。

```js
Object.prototype.toString.call(2)          // "[object Number]"
Object.prototype.toString.call('')         // "[object String]"
Object.prototype.toString.call(true)       // "[object Boolean]"
Object.prototype.toString.call(undefined)  // "[object Undefined]"
Object.prototype.toString.call(null)       // "[object Null]"
Object.prototype.toString.call(Symbol())   // "[object Symbol]"
Object.prototype.toString.call(Math)       // "[object Math]"
Object.prototype.toString.call({})         // "[object Object]"
Object.prototype.toString.call([])         // "[object Array]"
```

#### 封装实用函数

利用这个特性，可以封装一个比 `typeof` 运算符更准确的类型判断函数。

```js
let type = function (o){
  let s = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

type({});           // "object"
type([]);           // "array"
type(5);            // "number"
type(null);         // "null"
type();             // "undefined"
type(/dora/);       // "regexp"
type(new Date());   // "date"
```

在上面这个 `type` 函数的基础上，还可以加上专门判断某种数据类型的方法。

```js
let dataArr = ['Null', 'Undefined', 'Object', 'Array', 'String', 'Number', 'Boolean', 'Function', 'RegExp'];

dataArr.forEach(function (t) {
  type['is' + t] = function (o) {
    return type(o) === t.toLowerCase();
  };
});

type.isObject({});    // true
type.isNumber(NaN);   // true
type.isRegExp(/abc/); // true
```

### instanceof 运算符

`instanceof` 运算符返回一个布尔值，表示对象是否为某个构造函数的实例。

```js
function People(){}
let person = new People();
person instanceof People      // true
```

#### 判断原理

遍访对象的原型链上的每个原型对象，如果遍访到这个原型对象，是某个构造函数的 `prototype`，那么就认为对象是这个构造函数的实例，返回 `true`。因此同一个实例对象，可能会对多个构造函数都返回 `true`，因为继承的子类实例也是父类的实例。

```js
let d = new Date();
d instanceof Date      // true
d instanceof Object    // true
```

**特殊情况**

有一种特殊情况，就是左边对象的原型链上，只有 `null` 对象。这时，`instanceof` 判断会失真。

```js
let obj = Object.create(null);
typeof obj               // "object"
obj instanceof Object    // false
```

上面代码中，`Object.create(null)` 返回一个新对象 `obj`，它的原型是 `null`。右边的构造函数 `Object` 的 `prototype` 属性，不在左边的原型链上，因此 `instanceof` 就认为 `obj` 不是 `Object` 的实例。

只要一个对象的原型不是 `null`，`instanceof` 运算符的判断就不会失真。

#### 类型判断

`instanceof` 运算符只能用于对象，不适用原始类型的值，且对于 `undefined` 和 `null`，`instanceof` 运算符总是返回 `false`。

```js
'hello' instanceof String      // false
undefined instanceof Object    // false
null instanceof Object         // false
```

`instanceof` 运算符只可用于对象，无论是 JavaScript 内置对象或是自定义构造函数生成的对象，都可进行判断。

```js
[] instanceof Array                   // true
({}) instanceof Object                // true
(function(){}) instanceof Function    // true
/a/ instanceof RegExp                 // true
new Date() instanceof Date            // true
person instanceof People              // true
```

### constructor 属性

`prototype` 对象有一个 `constructor` 属性，默认指向 `prototype` 对象所在的构造函数。由于 `constructor` 属性定义在 `prototype` 对象上面，意味着可以被所有实例对象继承。因此，正常情况下，所有对象实例都有一个 `constructor` 属性，属性值指向构造此对象实例的构造函数。

```js
[].constructor === Array         // true
[].constructor === Object        // false
window.constructor === Window    //true
```

#### name属性

如果不能确定对象实例的 `constructor` 属性是什么函数，可通过函数的 `name` 属性，从实例得到构造函数的名称。

```js
function Foo() {}
let f = new Foo();
f.constructor.name     // "Foo"
```

#### 类型判断

**基本数据类型**

`null` 和 `undefined` 是无效的对象，因此是不会有 `constructor` 存在的，这两种类型的数据需要通过 `typeof` 来判断。

`number`、`string`、`boolean` 三种数据类型有对应的 `Number`、`String`、`Boolean` 三个原生对象(包装对象)。因此，也可用 `constructor` 进行判断。`symbol` 类型也可判断。

```js
(333).constructor.name       // "Number"
''.constructor.name          // "String"
false.constructor.name       // "Boolean"
Symbol().constructor.name    // "Symbol"
```
**引用数据类型**

 JavaScript 内置对象或是自定义构造函数生成的对象，都可进行判断。

```js
new Date().constructor === Date    //true
[].constructor === Array           //true

function F(){};
let f = new F();
f.constructor === F               // true
f.constructor === Object          // false
```

#### 不稳定因素

`constructor` 属性表示原型对象与构造函数之间的关联关系，有时开发者会因业务关系重写 `prototype`，原有的 `constructor` 会丢失，若没有同时修改 `constructor` 属性，引用的时候就会出错，`constructor` 会默认为 `Object`。

```js
function Person(name) {
  this.name = name;
}

Person.prototype.constructor === Person   // true

Person.prototype = {
  method: function () {}
};

Person.prototype.constructor === Person  // false
Person.prototype.constructor === Object  // true
```

因此，修改原型对象时，一般要同时修改 `constructor` 属性的指向，或者只在原型对象上添加方法，不要重写 `prototype`。

### 总结

**typeof**

`typeof` 可用来判断基本数据类型和函数，不可以对引用数据类型进行具体的判断。

**Object.prototype.toString.call(value)**

`Object.prototype.toString.call(value)` 可用于判断多种数据类型：基本数据类型和 JavaScript 内置对象，然而对于一些自定义构造函数生成的对象就不能进行判断了。

**instanceof**

`instanceof` 运算符不适用判断原始类型的值，只能用于判断对象，无论是 JavaScript 内置对象或是自定义构造函数生成的对象，都可进行判断。然而由于继承的存在，`instanceof` 判断也不完全准确，只能用来判断两个对象是否属于原型链的关系，而不一定能获取对象的具体类型。

**constructor**

`constructor` 属性可准确的判断对象实例是由哪个构造函数生成的，但自定义构造函数生成的对象，往往会因为重写 `prototype` 造成 `constructor` 属性指向不准确，因此使用的时候也要注意一下。

## 一些其它的具体类型判断

### 判断变量是否为对象(引用类型)

`Object(x)` 的参数为对象时，总是返回该对象，不做转换；当参数为原始类型时，会转换为对应的包装对象的实例，参数为空或者 `undefined` 或者 `null` 时，返回一个空对象。

```js
function isObject(value) {
  return value === Object(value);
}

isObject([]);      // true
isObject(true);    // false
```

### 判断是不是 NaN

所有数据类型中，只有 `NaN` 不等于它本身

```js
function isNaN(value) {
  return value !== value;
}
isNaN(NaN);      // true
```

**isNaN()**

如果 `isNaN()` 函数的参数不是 `Number` 类型， `isNaN` 函数会先将这个参数转换为数值，然后才会对转换后的结果是否是 `NaN` 进行判断。

等同于 `isNaN(Number(x))`

```js
isNaN(NaN);         // true
isNaN(undefined);   // true
isNaN(null);        // false
isNaN("");          // false
```

**Number.isNaN**

`Number.isNaN()` 方法确定传递的值是否为 `NaN` 和其类型是 `Number`。它是原始的全局 `isNaN()` 的更强大的版本。

和全局函数 `isNaN()` 相比，该方法不会强制将参数转换成数字，只有在参数是真正的数字类型，且值为 `NaN` 的时候才会返回 `true`。

```js
isNaN(NaN);         // true
isNaN(undefined);   // false
isNaN(null);        // false
isNaN("");          // false
```

### 判断数组的方法 Array.isArray()

除了上文提到的三种方法（`toString()`、`instanceof`、`constructor`）可判断外，还有一个 `Array` 构造函数自带的方法 `isArray()`
可判断。

```js
Array.isArray(x)
```

如果 `x` 是数组，则为 `true`; 否则为 `false`。

```js
Array.isArray([]);                // true
Array.isArray(new Array());       // true
Array.isArray(Array.prototype);   // true  鲜为人知的事实：其实 Array.prototype 也是一个数组。
```

使用之前需检测一下兼容性，对于不兼容的浏览器可使用下面的代码创建该方法。

```js
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
```
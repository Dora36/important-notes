# Number 属性和方法大全

## Number()

Number 对象是数值对应的包装对象，可以作为构造函数使用，也可以作为工具函数使用。

作为构造函数时，它用于生成值为数值的对象。

```js
let n = new Number(1);
typeof n                 // "object"
```

作为工具函数时，它可以将任何类型的值转为数值。

```js
Number(true)  // 1
```

具体的转换规则，详见 [数据类型的强制转换和隐式转换](https://segmentfault.com/a/1190000021106485)

## 属性

- `Number.POSITIVE_INFINITY`：正的无限，属性值是 `Infinity`。

- `Number.NEGATIVE_INFINITY`：负的无限，属性值是 `-Infinity`。

- `Number.NaN`：表示非数值，属性值是 `NaN`。

- `Number.MIN_VALUE`：表示最小的正数，即最接近 0 的正数，在 64 位浮点数体系中为 `5e-324`；相应的，最接近0的负数为 `-Number.MIN_VALUE`。

- `Number.MAX_VALUE`：表示最大的正数，即 `1.7976931348623157e+308`。

- `Number.MAX_SAFE_INTEGER`：表示能够精确表示的最大整数，即 `9007199254740991`。

- `Number.MIN_SAFE_INTEGER`：表示能够精确表示的最小整数，即 `-9007199254740991`。

- `Number.EPSILON`：表示极小的常量， 1 与大于 1 的最小浮点数之间的差，即 2 的 -52 次方 `2.220446049250313e-16`。

```js
0.1 + 0.2 - 0.3     // 5.551115123125783e-17
5.551115123125783e-17 < Number.EPSILON * Math.pow(2, 2)   // true
```

`Number.EPSILON` 可以用来设置“能够接受的误差范围”。比如，误差范围设为 2 的-50 次方（即 `Number.EPSILON * Math.pow(2, 2)` ），即如果两个浮点数的差小于这个值，我们就认为这两个浮点数相等。

```js
function withinErrorMargin (left, right) {
  return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2);
}

0.1 + 0.2 === 0.3 // false
withinErrorMargin(0.1 + 0.2, 0.3) // true

1.1 + 1.3 === 2.4 // false
withinErrorMargin(1.1 + 1.3, 2.4) // true
```

因此，`Number.EPSILON` 的实质是一个可以接受的最小误差范围。上面的代码为浮点数运算，部署了一个误差检查函数。

## 实例方法

### 1. `Number.prototype.toString()`

`Number` 对象部署了自己的 `toString` 方法，用来将一个数值转为字符串形式。

`toString` 方法可以接受一个参数，表示输出的进制。如果省略这个参数，默认将数值先转为十进制，再输出字符串；否则，就根据参数指定的进制，将一个数字转化成某个进制的字符串。

```js
(10).toString()      // "10"
(10).toString(8)     // "12"
(10).toString(16)    // "a"
```

上面代码中，10 如果不加括号，这个点会被 JavaScript 引擎解析成小数点，从而报错。只要能够让 JavaScript 引擎不混淆小数点和对象的点运算符，各种写法都能用。除了为 10 加上括号，还可以在 10 后面加两个点，JavaScript 会把第一个点理解成小数点（即10.0），把第二个点理解成调用对象属性，从而得到正确结果。因此直接对一个小数使用 `toString` 方法是可以的。

```js
10..toString(2)     // "1010"
10 .toString(2)     // "1010"
10.0.toString(2)    // "1010"
10.5.toString(2)    // "1010.1"
```

`toString` 方法只能将十进制的数，转为其他进制的字符串。如果要将其他进制的数，转回十进制，需要使用 `parseInt` 方法。

### 2. `Number.prototype.toFixed()`

`toFixed()` 方法先将一个数转为指定位数的小数，然后返回这个小数对应的字符串。参数为小数位数，存在有效范围，每个浏览器范围可能会不一样，chrome 是 `0 - 100`，Safari 是 `0 - 20`，超出这个范围将抛出 `RangeError: toFixed() argument must be between 0 and 20` 错误。

```js
(10).toFixed(2)      // "10.00"
10.005.toFixed(2)    // "10.01"
```

由于浮点数的原因，小数 5 的四舍五入是不确定的，使用的时候必须小心。

```js
(10.055).toFixed(2)    // 10.05
(10.005).toFixed(2)    // 10.01
```

### 3. `Number.prototype.toExponential()`

`toExponential` 方法用于将一个数转为科学计数法形式。参数是小数点后有效数字的位数，存在有效范围，每个浏览器范围可能会不一样，超出这个范围，会抛出一个 `RangeError` 错误。

```js
(1234).toExponential()     // "1.234e+3"
(1234).toExponential(1)    // "1.2e+3"
(1234).toExponential(2)    // "1.23e+3"
```

### 4. `Number.prototype.toPrecision()`

`toPrecision()` 方法用于将一个数转为指定位数的有效数字。参数为有效数字的位数，存在有效范围，每个浏览器范围可能会不一样，超出这个范围会抛出 `RangeError` 错误。

```js
(12.34).toPrecision(3)   // "12.3"
(12.34).toPrecision(5)   // "12.340"
```

该方法用于四舍五入时依然不太可靠，跟浮点数不是精确储存有关。

```js
(12.15).toPrecision(3)   // "12.2"
(12.45).toPrecision(3)   // "12.4"
```

### 5. `Number.prototype.toLocaleString()`

`toLocaleString()` 方法接受一个地区码作为参数，返回一个字符串，表示当前数字在该地区的当地书写形式。

```js
(456).toLocaleString('zh-Hans-CN-u-nu-hanidec')  // "四五六"
```

该方法还可以接受第二个参数配置对象，用来定制指定用途的返回字符串。该对象的 `style` 属性指定输出样式，默认值是 `decimal`，表示输出十进制形式。如果值为 `percent`，表示输出百分数。

```js
(123).toLocaleString('zh-Hans-CN', { style: 'percent' })               // "12,300%"
(123).toLocaleString('zh-Hans-CN-u-nu-hanidec', { style: 'percent' })  // "一二,三〇〇%"
```

如果 `style` 属性的值为 `currency`，则可以搭配 `currency` 属性，输出指定格式的货币字符串形式。

```js
(123).toLocaleString('zh-Hans-CN', { style: 'currency', currency: 'CNY' })  // "￥123.00"
(123).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })       // "123,00 €"
(123).toLocaleString('en-US', { style: 'currency', currency: 'USD' })       // "$123.00"
```

如果省略了参数，则由浏览器自行决定如何处理，通常会使用操作系统的地区设定。注意，该方法如果使用浏览器不认识的地区码，会抛出一个错误。

## 静态方法

### 1. `Number.isFinite()` 和 `Number.isNaN()`

`Number.isFinite()` 用来检查一个数值是否为有限的（finite），即不是 `Infinity`，返回布尔值。如果参数类型不是数值，一律返回 `false`。

```js
Number.isFinite(0.8);        // true
Number.isFinite(NaN);        // false
Number.isFinite(-Infinity);  // false
Number.isFinite('foo');      // false
Number.isFinite(true);       // false
```

`Number.isNaN()` 用来检查一个值是否为 `NaN`。如果参数类型不是 `NaN`，一律返回 `false`。

```js
Number.isNaN(NaN)              // true
Number.isNaN(15)               // false
Number.isNaN('15')             // false
Number.isNaN(true)             // false
Number.isNaN(9 / NaN)          // true
Number.isNaN('true' / 0)       // true
Number.isNaN('true' / 'true')  // true
```

它们与传统的全局方法 `isFinite()` 和 `isNaN()` 的区别在于，传统方法先调用 `Number()` 将非数值的值转为数值，再进行判断，而这两个新方法只对数值有效，`Number.isFinite()` 对于非数值一律返回 `false`，`Number.isNaN()` 只有对于 `NaN` 才返回 `true`，非 `NaN` 一律返回 `false`。

### 2. `Number.parseInt()` 和 `Number.parseFloat()`

ES6 将全局方法 `parseInt()` 和 `parseFloat()` ，移植到 `Number` 对象上面，行为完全保持不变，目的是逐步减少全局性方法，对全局变量进行模块化。

`Number.parseInt(string[, radix])` 是将一个 `radix` 进制的字符串 `string` 转换为十进制的整数。

`Number.parseFloat()` 只应用于解析十进制数字字符串，并返回一个浮点数。

```js
parseInt("15px", 10);   // 15
parseInt("546", 2);     // NaN  除了“0、1”外，其它数字都不是有效二进制数字
parseFloat("10.2abc")   // 10.2
```

### 3. `Number.isInteger()`

`Number.isInteger()` 用来判断一个数值是否为整数。如果参数不是数值，返回 `false`。

```js
Number.isInteger(25)      // true
Number.isInteger(25.0)    // true
Number.isInteger(25.1)    // false
```

JavaScript 内部，整数和浮点数采用的是同样的储存方法，所以 25 和 25.0 被视为同一个值。

由于 JavaScript 采用 IEEE 754 标准，数值存储为 64 位双精度格式，数值精度最多可以达到 53 个二进制位（1 个隐藏位与 52 个有效位）。如果数值的精度超过这个限度，第 54 位及后面的位就会被丢弃，这种情况下，`Number.isInteger()` 可能会误判。

```js
Number.isInteger(3.0000000000000002) // true
```

如果一个数值的绝对值小于 `Number.MIN_VALUE`（`5E-324`），即小于 JavaScript 能够分辨的最小值，会被自动转为 0。这时，`Number.isInteger()` 也会误判。

```js
Number.isInteger(5E-324)  // false
Number.isInteger(5E-325)  // true
```

总之，如果对数据精度的要求较高，不建议使用 `Number.isInteger()` 判断一个数值是否为整数。

### 4. `Number.isSafeInteger()`

JavaScript 能够准确表示的整数范围在 `-2^53` 到 `2^53` 之间（不含两个端点），超过这个范围，就无法精确表示这个值。ES6 引入了 `Number.MAX_SAFE_INTEGER` 和 `Number.MIN_SAFE_INTEGER` 这两个常量，用来表示这个范围的上下限。

```js
Math.pow(2, 53)      // 9007199254740992
9007199254740993     // 9007199254740992
Math.pow(2, 53) === Math.pow(2, 53) + 1            // true
Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1    // true
```

`Number.isSafeInteger()` 则是用来判断一个 **整数** 是否在这个范围之内。

```js
Number.isSafeInteger('a')          // false
Number.isSafeInteger(null)         // false
Number.isSafeInteger(NaN)          // false
Number.isSafeInteger(Infinity)     // false
Number.isSafeInteger(-Infinity)    // false

Number.isSafeInteger(3)      // true
Number.isSafeInteger(-3)     // true
Number.isSafeInteger(1.2)    // false

Number.isSafeInteger(9007199254740991)  // true
Number.isSafeInteger(9007199254740992)  // false

Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1) // false
Number.isSafeInteger(Number.MIN_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1) // false
```

同 `Number.isInteger()` 一样，数据精度较高，`Number.isSafeInteger()` 也会误判。

```js
Number.isSafeInteger(3.0000000000000002)  // true
```

参考链接：
 [*Number 对象*](https://wangdoc.com/javascript/stdlib/number.html)
 [*数值的扩展*](http://es6.ruanyifeng.com/#docs/number)

# 数据类型的转换

[数据类型的分类：**基本数据类型**和**引用数据类型**](https://segmentfault.com/a/1190000016888845)

## 强制转换

强制转换主要指使用一些特定函数，手动将各种类型的值，转换为其对应的类型。

### Number()

使用 `Number()` 函数，可以将任意类型的值转化成数值。根据参数的数据类型不同会有不同的结果。

#### 参数是基本数据类型时

**1. 数值**：转换后还是原来的值

```js
Number(36)      // 36
```

**2. 字符串**

- 含有非数值的字符串，返回 `NaN`。比 `parseInt` 函数严格很多，只要有一个字符无法转为数值，整个字符串就会被转为 `NaN`。
- 只含有数值，则转换为相应的数值。
- 空字符串转为 `0`。
- 会自动过滤字符串开头和结尾的空格。

```js
Number('\n  36  \t')  // 36
Number('36abc')       // NaN
Number('')            // 0
```

**3. 布尔值**

- `true` 转为 `1`
- `false` 转为 `0`

```js
Number(true)       // 1
Number(false)      // 0
```

**4. undefined 和 null**

- `undefined` 转为 `NaN`
- `null` 转为 `0`

```js
Number(undefined)    // NaN
Number(null)         // 0
```

#### 参数是引用类型时

`Number()` 方法的参数是对象时，如果该对象是包含单个数值的数组，则返回该数值；否则返回 `NaN`。

```js
Number({a: 1}) // NaN
Number([1, 2, 3]) // NaN
Number([5]) // 5
```

**转换规则**

- 第一步：调用对象自身的 `valueOf()` 方法。如果返回原始类型的值，则直接对该值使用 `Number()` 函数，不再进行后续步骤。

- 第二步：如果 `valueOf()` 方法返回的还是对象，则改为调用对象自身的 `toString()` 方法。如果返回原始类型的值，则直接对该值使用 `Number()` 函数，不再进行后续步骤。

- 第三步：如果 `toString()` 方法返回的还是对象，就报错。

默认情况下，对象的 `valueOf()` 方法返回对象本身，所以一般总是会调用 `toString()` 方法，而 `toString()` 方法返回对象的类型字符串，比如 `[object Object]`。因此对字符串使用 `Number()` 函数，就返回 `NaN`。

```js
let obj1 = {
  valueOf: function () { return 3; }
}

let obj2 = {
  toString: function () { return 6; }
}

let obj3 = {
  valueOf: function () { return 3; },
  toString: function () { return 6; }
}

Number(obj1)     // 3
Number(obj2)     // 6
Number(obj3)     // 3
```

### String()

`String()` 函数可以将任意类型的值转化成字符串。根据参数的数据类型不同会有不同的结果。

#### 参数是基本数据类型时

统一转换为对应的字符串形式。

```js
String(123)         // "123"
String('abc')       // "abc"
String(true)        // "true"
String(undefined)   // "undefined"
String(null)        // "null"
```

#### 参数是引用类型时

- 参数是对象时，返回一个类型字符串。
- 参数是数组时，则将数组转为 `,` 逗号连接的字符串。
- 参数是其它引用类型时（正则，`Date`,`function`等），返回对应的字符串形式。

```js
String({})              // "[object Object]"
String([1, 2, 3])       // "1,2,3"
String(/dora/)          // "/dora/"
String(new Date())      // "Fri Nov 22 2019 14:14:29 GMT+0800 (中国标准时间)"
String(function a(){})  // "function a(){}"
```

**转换规则**

转换规则，与 `Number()` 方法基本相同，只是互换了 `valueOf()` 方法和 `toString()` 方法的执行顺序。

- 第一步：先调用对象自身的 `toString()` 方法。如果返回原始类型的值，则对该值使用 `String()` 函数，不再进行以下步骤。

- 第二步：如果 `toString()` 方法返回的是对象，再调用原对象的 `valueOf()` 方法。如果 `valueOf()` 方法返回原始类型的值，则对该值使用 `String()` 函数，不再进行以下步骤。

- 第三步：如果 `valueOf()` 方法返回的是对象，就报错。

```js
String(obj1)     // "[object Object]"
String(obj2)     // "6"
String(obj3)     // "6"
```

所以，因为 正则，`Date`,`function` 等引用类型数据有自己的 `toString()` 方法，因此返回的都是对应的字符串类型。


### Boolean()

`Boolean()` 函数可以将任意类型的值转为布尔值。

它的转换规则相对简单：除了以下**六**个值的转换结果为 `false` 外，其他的值全部为 `true`，包括 `[]` 空数组或 `{}` 空对象。

- `false`
- `undefined`
- `null`
- `0`（包含 `-0` 和 `+0`）
- `NaN`
- `''`（空字符串）

```js
Boolean(0)                   // false
Boolean(NaN)                 // false
Boolean({})                  // true
Boolean([])                  // true
Boolean(new Boolean(false))  // true
```

### parseInt(string[, radix]) 、Number.parseInt(string[, radix])

这两个方法具有一样的功能。ES6 添加 `Number.parseInt()` 的目的是对全局变量进行模块化。

将一个 `radix` 进制的字符串 `string` 转换为十进制的整数。

- **string**：如果参数不是字符串类型，则使用 `String()`将其转换为字符串。

- **radix**：介于 `2` - `36` 之间的数，代表第一个参数 `string` 的进制数。其默认值会根据情况变化，如果以 `0x` 或者 `0X` 开头，则默认是 `16`；以 `0` 开头，默认是 `8` 或者 `10` （视环境而定）；其余默认是 `10`。因此，永远都要明确的给出 `radix` 参数的值。

- **返回值**：返回值是 `string` 的十进制整数值。如果 `string` 的第一个字符无法被转化成数值类型，则返回 `NaN`。

```js
parseInt("123", 10);     // 123
parseInt("11", 2);       // 3  二进制数字字符串 ‘11’ 转换为十进制的 3
```

**解析规则**

- `parseInt()` 是逐个解析 `stirng` 参数中的字符串字符，直到遇到的字符不是正号 `+`、负号 `-`、或者科学记数法中的指数 `e` 或 `E` 时，且不是 `radix` 指定的进制中的数字时，就会忽略该字符和后续所有字符，并返回解析到该位置的整数值。

- 字符串开头和结尾的空白符将会被忽略；字符串开头的 `0` 也会被忽略。

- 如果 `string` 的第一个字符不能被转换成数字，则 `parseInt()` 返回 `NaN`。

```js
parseInt("15px", 10);   // 15
parseInt("546", 2);     // NaN  除了“0、1”外，其它数字都不是有效二进制数字
```

### parseFloat(string)、Number.parseFloat(string)

这两个方法具有一样的功能。ES6 添加 `Number.parseFloat()` 的目的是对全局变量进行模块化。

`parseFloat()` 只应用于解析十进制数字字符串，并返回一个浮点数。

**解析规则**

- 如果参数不是字符串类型，则使用 `String()`将其转换为字符串。开头和结尾的空白符会被忽略。小数点前多余的 `0` 也会被忽略。

- 如果 `parseFloat` 在解析过程中遇到了正号 `+`、负号 `-`、数字 `0-9`、小数点 `.`、或者科学记数法中的指数 `e` 或 `E` 以外的字符，则它会忽略该字符以及之后的所有字符，返回当前已经解析到的浮点数。
- 第二个小数点的出现也会使解析停止。
- 如果参数字符串的第一个字符不能被解析成为数字，则返回 `NaN`。
- `parseFloat` 也可以解析并返回 `Infinity`。

```js
parseFloat("10.2abc")   // 10.2
```

### Object()

`Object()` 函数用来将任意值转为对象。

- 当参数为原始类型时，会转换为对应的包装对象的实例，
- 参数为空或者 `undefined` 或者 `null` 时，返回一个空对象。
- 参数为引用数据类型时，总是返回其本身，不做转换。

```js
Object(null)                 // {}

let numObj = Object(1);
numObj instanceof Object    // true
numObj instanceof Number    // true

let arr = [];
Object(arr)=== arr;         // true  返回原数组
```

## 隐式转换

隐式转换都是以强制转换为基础的。

### == 比较

在进行 `==` 比较的时候，根据两边数据类型不同，会进行不同的数据转换。

参考 [JavaScript 的相等比较](https://segmentfault.com/a/1190000016877867#item-1-2)

### 不同类型的数据互相运算


### 对非布尔值类型的数据求布尔值



https://wangdoc.com/javascript/features/conversion.html

[isNaN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN)


[Number.isNaN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN)









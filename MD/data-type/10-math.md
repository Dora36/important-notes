# Math 对象的属性和方法大全

## Math 对象

`Math` 是 JavaScript 的原生对象，提供各种数学功能。该对象不是构造函数，不能生成实例，所有的属性和方法都必须在 `Math` 对象上调用。

## 属性

`Math` 对象的静态属性，是一些数学常数。

- `Math.E`：常数 `e`。

- `Math.LN2`：2 的自然对数。

- `Math.LN10`：10 的自然对数。

- `Math.LOG2E`：以 2 为底的 `e` 的对数。

- `Math.LOG10E`：以 10 为底的 `e` 的对数。

- `Math.PI`：常数 `π`。

- `Math.SQRT1_2`：0.5 的平方根。

- `Math.SQRT2`：2 的平方根。

```js
Math.E         // 2.718281828459045
Math.LN2       // 0.6931471805599453
Math.LN10      // 2.302585092994046
Math.LOG2E     // 1.4426950408889634
Math.LOG10E    // 0.4342944819032518
Math.PI        // 3.141592653589793
Math.SQRT1_2   // 0.7071067811865476
Math.SQRT2     // 1.4142135623730951
```

## 方法

`Math` 的所有方法，在传入的参数为非数值时，都会先使用 `Number()` 方法将其转为数值，再进行相应的运算。若转换后的值为 `NaN`，则除 `Math.random()` 外，全部方法都返回 `NaN`。

### 数学运算相关方法

- `Math.abs()`：返回参数的绝对值。

- `Math.pow()`：返回以第一个参数为底数、第二个参数为幂的指数值。`Math.pow(2, 3)` 等同于 `2 ** 3`。

- `Math.sqrt()`：用于计算参数的平方根。如果参数是一个负值，则返回 `NaN`。

- `Math.log()`：返回以 `e` 为底的自然对数值。

- `Math.exp()`：返回常数 `e` 的参数次方。

- `Math.cbrt()`：用于计算参数的立方根。

- `Math.hypot()`：返回所有参数的平方和的平方根。只要有一个参数无法转为数值，就会返回 `NaN`。

### 取整相关方法

- `Math.floor()`：返回小于参数值的最大整数，向下取整。

- `Math.ceil()`：返回大于参数值的最小整数，向上取整。

- `Math.round()`：用于四舍五入。对负数 `-x.5` 的处理，不太正确。`Math.round(-1.5) // -1`。

- `Math.trunc()`：用于去除一个数的小数部分，返回整数部分。

### 三角函数相关方法

- `Math.sin()`：返回参数的正弦（参数为弧度值）
- `Math.cos()`：返回参数的余弦（参数为弧度值）
- `Math.tan()`：返回参数的正切（参数为弧度值）
- `Math.asin()`：返回参数的反正弦（返回值为弧度值）
- `Math.acos()`：返回参数的反余弦（返回值为弧度值）
- `Math.atan()`：返回参数的反正切（返回值为弧度值）

### `Math.random()`

`Math.random()` 返回 `[0, 1)` 之间的一个伪随机数，可能等于 0，但是一定小于 1。

```js
// 生成任意范围的随机数
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// 生成任意范围的随机 整数
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

返回随机字符的方法：

```js
function randomStr(length) {
  let ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  ALPHABET += 'abcdefghijklmnopqrstuvwxyz';
  ALPHABET += '0123456789-_';
  let str = '';
  for (let i = 0; i < length; i++) {
    let rand = Math.floor(Math.random() * ALPHABET.length);
    str += ALPHABET.substring(rand, rand + 1);
  }
  return str;
}

randomStr(6)   // "Y2-k4S"
```

### `Math.max()`，`Math.min()`

`Math.max()` 方法返回参数之中最大的那个值，`Math.min()` 返回最小的那个值。如果参数为空，`Math.min()` 返回 `Infinity`，`Math.max()` 返回 `-Infinity`。

```js
Math.max(2, -1, 5) // 5
Math.min(2, -1, 5) // -1
Math.min()         // Infinity
Math.max()         // -Infinity
```

### `Math.sign()`

`Math.sign()` 方法用来判断一个数到底是正数、负数、还是零。

- 参数为正数，返回 `+1`；
- 参数为负数，返回 `-1`；
- 参数为 0，返回 `0`；
- 参数为 -0，返回 `-0`;
- 其他值，返回 `NaN`。

```js
Math.sign(-5)    // -1
Math.sign(5)     // +1
Math.sign(0)     // 0
Math.sign(-0)    // -0
Math.sign(NaN)   // NaN
```


参考链接：
 [*Math 对象*](https://wangdoc.com/javascript/stdlib/math.html)
 [*Math 对象的扩展*](http://es6.ruanyifeng.com/#docs/number#Math-%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95)

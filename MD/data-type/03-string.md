# String 的属性和方法

## 属性 length

字符串实例的 `length` 属性返回字符串的长度。

```js
let a = "aaaa";
a.length    // 4
```

跟数组不同的是，给 `length` 属性赋值，不会改变原字符串的值。

## 方法

### 静态方法

#### 1. String.fromCharCode()

`String.fromCharCode()` 方法的参数是一个或多个数值，代表 `Unicode` 码点，返回值是这些码点组成的字符串。

```js
String.fromCharCode();                            // ""
String.fromCharCode(97);                          // "a"
String.fromCharCode(104, 101, 108, 108, 111);     // "hello"
```

注意，该方法不支持 `Unicode` 码点大于`0xFFFF`的字符，即传入的参数不能大于`0xFFFF`（即十进制的 65535）。

#### 2. String.fromCodePoint()

`String.fromCodePoint()` 方法也是将`Unicode` 码点转为字符串，但可以识别大于`0xFFFF`的字符，弥补了`String.fromCharCode()` 方法的不足。

```js
String.fromCodePoint(0x20BB7)   // "𠮷"
```

该方法的作用，与 `codePointAt()` 方法相反。需要注意的是 `fromCodePoint()` 方法定义在 `String` 对象上，而 `codePointAt()` 方法定义在字符串的实例对象上。

### 实例方法

#### 1. String.prototype.charAt()

`charAt()` 方法返回指定位置的字符，参数是从 0 开始编号的位置。

```js
let s = 'abc'
s.charAt(1)               // "b"
s.charAt(s.length - 1)    // "c"
```

这个方法完全可以用数组下标替代。

```js
'abc'.charAt(1)    // "b"
'abc'[1]           // "b"
```

如果参数为负数，或大于等于字符串的长度，`charAt` 返回空字符串。

```js
'abc'.charAt(-1)   // ""
'abc'.charAt(3)    // ""
```

#### 2. indexOf() && lastIndexOf()

**String.prototype.indexOf()**

`indexOf()` 方法用于确定一个字符串在另一个字符串中第一次出现的位置，返回结果是匹配开始的位置。如果返回-1，就表示不匹配。

```js
'hello world'.indexOf('o')       // 4
'JavaScript'.indexOf('script')   // -1
```

`indexOf(str,index)` 方法还可以接受第二个参数，表示从该下标位置开始向后匹配。

```js
'hello world'.indexOf('o', 6)    // 7
```

**String.prototype.lastIndexOf()**

`lastIndexOf()` 方法的用法跟 `indexOf()` 方法一致，主要的区别是 `lastIndexOf` 从尾部开始匹配，`indexOf` 则是从头部开始匹配。

```js
'hello world'.lastIndexOf('o')   // 7
```

`lastIndexOf(str,index)` 的第二个参数表示从该位置起向前匹配。

```js
'hello world'.lastIndexOf('o', 6)  // 4
```

#### 3. String.prototype.match()

**可以使用正则表达式**

`match()` 方法用于在父字符串中寻找匹配的子字符串，作为类数组返回。如果没有找到匹配，则返回 `null`。

可以使用正则表达式，一般情况下只要找到一个匹配的项，就停止寻找。且返回的数组含有 `index` 属性和 `input` 属性，分别表示匹配的子字符串开始的位置和原始字符串。

```js
"accbbbcbba".match('bb')   //["bb", index: 3, input: "accbbbcbba"]
"accbbbcbba".match(/bb/)   //["bb", index: 3, input: "accbbbcbba"]
'abc'.match('d')           // null
```

而如果正则表达式带有 `g` 修饰符，则会一次性返回所有匹配成功的结果。且返回的数组不含有 `index` 属性和 `input` 属性。

```js
'xaxb'.match(/a|b/)   // ["a", index: 1, input: "xaxb"]
'xaxb'.match(/a|b/g)  // ["a", "b"]
```

#### 4. String.prototype.search()

`search()` 方法作用是寻找字符或子字符串在父字符串中的位置，返回下标，只能找到第一个符合条件的。没有匹配的返回-1。

**该方法支持正则表达式**

```js
'xaxb'.search('x')    // 0
'xaxb'.search(/x/)    // 0
'xaxb'.search(/x/g)   // 0
```

即使正则表达式带有 `g` 修饰符，也只会返回第一个符合条件的。

#### 5. includes() && startsWith() && endsWith()

ES6 提供了三种新方法，用来确定一个字符串是否包含在另一个字符串中。

- `String.prototype.includes()`：返回布尔值，表示是否找到了参数字符串。
- `String.prototype.startsWith()`：返回布尔值，表示参数字符串是否在原字符串的头部。
- `String.prototype.endsWith()`：返回布尔值，表示参数字符串是否在原字符串的尾部。

```js
let s = 'Hello world!';

s.startsWith('Hello')   // true
s.endsWith('!')         // true
s.includes('o')         // true
```

这三个方法都支持第二个参数，表示开始搜索的位置。

```js
s.startsWith('world', 6)    // true
s.endsWith('Hello', 5)      // true
s.includes('Hello', 6)      // false
```

使用第二个参数 `index` 时，`endsWith` 的行为与其他两个方法有所不同。它针对前 `index` 个字符，而其他两个方法针对从第`index`个位置直到字符串结束。

#### 6. String.prototype.replace()

`replace()` 方法用于替换字符串，作为一个新的字符串返回，不改变原字符串。接收两个参数，第二个参数替换第一个参数匹配到的字符。

**该方法不改变原字符串，且支持正则表达式**

正常情况只替换第一个匹配成功的值，只有在正则有 `g` 修饰符时，会替换所有匹配成功的值。

```js
'aaa'.replace('a', 'b')     // "baa"
'aaa'.replace(/a/, 'b')     // "baa"
'aaa'.replace(/a/g, 'b')    // "bbb"
```

**参数**

第一个参数可以是字符串或正则表达式，第二个参数可以是字符串或函数。

a. 当第二个参数为字符串时，可以使用 `$` 符，来指代所替换的内容。

- `$&`：匹配的子字符串。
- `` $` ``：匹配结果前面的文本。
- `$'`：匹配结果后面的文本。
- `$n`：匹配成功的第 n 组内容，n 是从 1 开始的自然数。
- `$$`：指代美元符号 $。

```js
'hello world'.replace(/(\w+)\s(\w+)/, '$2 $1')   // "world hello"
'abc'.replace('b', "[$`-$&-$']")                 // "a[a-b-c]c"
```

b. 当第二个参数为函数时，必须有返回值，返回字符串。如果没执行，会在匹配时执行。每匹配到一次正则，就执行一次函数，将每一个匹配到的内容替换为函数的返回值。

```js
'3 and 5'.replace(/[0-9]+/g, function (match) {
    return 2 * match;
})
// "6 and 10"
```

该函数可以接受多个参数。第一个参数是匹配到的内容，第二个参数开始依次是匹配到的组内容`（$1,$2...）`。倒数第二个参数是匹配到的内容在整个字符串中的下标，最后一个参数是原字符串。

```js
var prices = { 'p1': '$1.99', 'p2': '$9.99', 'p3': '$5.00' };

var template = '<span id="p1"></span>'
    + '<span id="p2"></span>'
    + '<span id="p3"></span>';

template.replace( /(<span id=")(.*?)(">)(<\/span>)/g,
    function(match, $1, $2, $3, $4){
    return $1 + $2 + $3 + prices[$2] + $4;
    }
);
// "<span id="p1">$1.99</span><span id="p2">$9.99</span><span id="p3">$5.00</span>"
```

#### 7. String.prototype.concat()

`concat()` 方法用于连接两个字符串，返回一个新字符串，不改变原字符串。

**该方法不改变原字符串**

```js
var s1 = 'abc';
var s2 = 'def';

s1.concat(s2)    // "abcdef"
s1               // "abc"
```

该方法可以接受多个参数。

```js
'a'.concat('b', 'c')  // "abc"
```

如果参数不是字符串，`concat()` 方法会将其先转为字符串，然后再连接。

```js
var one = 1;
var two = 2;
var three = '3';

''.concat(one, two, three)    // "123"
one + two + three             // "33"
```

#### 8. String.prototype.slice()

`slice(start, end)` 方法用于从原字符串取出子字符串并返回，不改变原字符串。它的第一个参数是子字符串的开始位置，第二个参数是子字符串的结束位置（不含该位置）。

与数组的 `slice()` 方法一样。

**该方法不改变原字符串**

**参数**

a. `slice(start, end)`，从下标 `start` 开始截取到下标 `end` 的元素，包含 `start` 不包含 `end`。

```js
'JavaScript'.slice(0, 4)   // "Java"
```

b. `slice(start)`，只有 `start` 一个参数表示从包含 `start` 的下标开始一直到原字符串结束。

```js
'JavaScript'.slice(4)      // "Script"
```

c. `slice(-start, -end)`，参数可以用负数。表示倒数计算的位置。-1 表示倒数计算的第一个位置，依次向前类推。

```js
'JavaScript'.slice(-6)          // "Script"
'JavaScript'.slice(0, -6)       // "Java"
'JavaScript'.slice(-2, -1)      // "p"
```

d. 如果第一个参数大于等于字符串长度，或者第二个参数小于第一个参数，则返回一个空字符串。

```js
'JavaScript'.slice(2, 1)     // ""
```

#### 9. String.prototype.substring()

`substring(start, end)` 方法用于从原字符串取出子字符串并返回，不改变原字符串。规则与 `slice()` 类似，不能用负数截取。

**该方法不改变原字符串**

**参数**

a. `substring(start, end)`，从下标 `start` 开始截取到下标 `end` 的元素，包含 `start` 不包含 `end`。

```js
'JavaScript'.substring(0, 4)   // "Java"
```

b. `substring(start)`，只有 `start` 一个参数表示从包含 `start` 的下标开始一直到原字符串结束。如果`start` 大于等于字符串长度，返回空字符串。

```js
'JavaScript'.substring(4)      // "Script"
'JavaScript'.substring(10)     // ""
```

c. 第二个参数小于第一个参数，`substring()` 方法会自动更换两个参数的位置。

```js
'JavaScript'.substring(10, 4)     // "Script"
```

d. 如果参数是负数，`substring()` 方法会自动将负数转为0。

```js
'JavaScript'.substring(-3)       // "JavaScript"
'JavaScript'.substring(4, -3)    // "Java"
```

由于这些规则违反直觉，因此不建议使用 `substring()` 方法，应该优先使用 `slice`。

#### 10. String.prototype.substr()

`substr(start,length)` 方法用于从原字符串取出指定长度的子字符串并返回，不改变原字符串。第一个参数可以是负数。-1 代表最后一个位置的值。

**该方法不改变原字符串**

**参数**

a. `substr(start, length)`，从下标 `start` 开始截取长度为 `length` 的值。

```js
'JavaScript'.substr(4, 6)   // "Script"
```

b. `substr(start)`，只有 `start` 一个参数表示从包含 `start` 的下标开始一直到原字符串结束。如果`start` 大于等于字符串长度，返回空字符串。

```js
'JavaScript'.substr(4)      // "Script"
'JavaScript'.substr(10)     // ""
```

c. 如果第一个参数是负数，表示倒数计算的字符位置。如果第二个参数是负数，将被自动转为0，因此会返回空字符串。

```js
'JavaScript'.substr(-6)       // "Script"
'JavaScript'.substr(4, -1)    // ""
```

#### 11. trim() && trimStart() && trimEnd()

**该方法不改变原字符串**

- `String.prototype.trim()` 用于去除字符串两端的空格。
- `String.prototype.trimStart()` 消除字符串头部的空格，保留尾部的空格。
- `String.prototype.trimEnd()` 消除字符串尾部的空格，保留头部的空格。

```js
let s = '  hello world  ';
s.trim()                       // "hello world"
s.trimStart()                  // "hello world  "
s.trimEnd()                    // "  hello world"
```

该方法去除的不仅是空格，还包括制表符`（\t、\v）`、换行符`（\n）`和回车符`（\r）`。

```js
let s = '\r\nabc \t'
s.trim()                 // 'abc'
s.trimStart()            // "abc \t"
s.trimEnd()              // "\r\nabc"
```

兼容处理

```js
if (!String.prototype.trim) {
    String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}
```

#### 12. toLowerCase() && toUpperCase()

**该方法不改变原字符串**

`toLowerCase()` 方法用于将一个字符串全部转为小写，`toUpperCase()` 则是全部转为大写。它们都返回一个新字符串，不改变原字符串。

```js
'Hello World'.toLowerCase()      // "hello world"
'Hello World'.toUpperCase()      // "HELLO WORLD"
```

#### 13. String.prototype.split()

`split()` 方法以字符串中的某一字符为分隔符，拆分字符串，将分割出来的子字符串组成一个数组返回。数组中的每一项是字符串类型。

**该方法不改变原字符串，且支持正则表达式**

**参数**

a. `split('')` 分隔符为空字符串，则返回数组的成员是原字符串的每一个字符。

```js
'a|b|c'.split('') // ["a", "|", "b", "|", "c"]
```

b. `split()` 省略参数，则返回数组的唯一成员就是原字符串。

```js
'a|b|c'.split() // ["a|b|c"]
```

c. `split('分隔符')`

```js
'a|b|c'.split('|')    // ["a", "b", "c"]
'a||c'.split('|')     // ['a', '', 'c']
'|b|c'.split('|')     // ["", "b", "c"]
'a|b|'.split('|')     // ["a", "b", ""]
```

d. `split('分隔符',limit)` 方法还可以接受第二个参数，限定返回数组的最大成员数。

```js
'a|b|c'.split('|', 1)    // ["a"]
'a|b|c'.split('|', 2)    // ["a", "b"]
```

e. `split(/分隔符/,[limit])`，

```js
'aaa*a*'.split(/a*/)       // [ '', '*', '*' ]
"a   b   c".split(/\s+/)   // ["a", "b", "c"]
```

如果正则表达式带有括号，则括号匹配的部分也会作为数组成员返回。

```js
'aaa*a*'.split(/(a*)/)   // [ '', 'aaa', '*', 'a', '*' ]
```

#### 14. charCodeAt() && codePointAt()

**String.prototype.charCodeAt()**

`charCodeAt(index)` 方法返回字符串指定位置的 `Unicode` 码点（十进制表示），即 0 到 65535 之间的整数，相当于 `String.fromCharCode()` 的逆操作。

```js
'abc'.charCodeAt(1)  // 98   b的 Unicode 码点是 98。
```

如果没有任何参数，或不是一个数值，`charCodeAt` 返回首字符的 `Unicode` 码点。

```js
'abc'.charCodeAt()   // 97
```

如果参数为负数，或大于等于字符串的长度，`charCodeAt` 返回 `NaN`。

```js
'abc'.charCodeAt(-1)    // NaN
'abc'.charCodeAt(4)     // NaN
```

不能正确返回 `Unicode` 码点大于 `0xFFFF` 的字符。

**String.prototype.codePointAt()**

`codePointAt()` 方法，能够正确处理 4 个字节储存的字符，返回一个字符的码点。返回的是码点的十进制值。如果想要十六进制的值，可以使用toString()方法转换一下。

```js
let s = '𠮷a';
s.codePointAt(0).toString(16) // "20bb7"
s.codePointAt(2).toString(16) // "61"
```

因为汉字“𠮷”需要4个字节储存，对于这种4个字节的字符，JavaScript 不能正确处理，字符串长度会误判为2，因此可使用 `for...of` 循环处理。

```js
let s = '𠮷a';
for (let ch of s) {
    console.log(ch.codePointAt(0).toString(16));
}
// 20bb7
// 61
```

`codePointAt()` 方法是测试一个字符由两个字节还是由四个字节组成的最简单方法。

```js
function is32Bit(c) {
    return c.codePointAt(0) > 0xFFFF;
}

is32Bit("𠮷")    // true
is32Bit("a")     // false
```

#### 15. String.prototype.repeat()

`repeat()` 方法返回一个新字符串，表示将原字符串重复n次。

```js
'x'.repeat(3)       // "xxx"
'hello'.repeat(2)   // "hellohello"
'na'.repeat(0)      // ""
```

参数如果是小数，会被向下取整。

```js
'na'.repeat(2.9)    // "nana"
```

如果参数是负数或者 `Infinity`，会报错。参数NaN等同于 0。如果参数是字符串，则会先转换成数字。

#### 16. padStart() && padEnd()

ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。`padStart()` 用于头部补全，`padEnd()` 用于尾部补全。

`padStart()` 和 `padEnd()` 一共接受两个参数，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串。

```js
'x'.padStart(4, 'ab')    // 'abax'
'x'.padEnd(4, 'ab')      // 'xaba'
```

如果原字符串的长度，等于或大于最大长度，则字符串补全不生效，返回原字符串。

```js
'xxx'.padStart(2, 'ab')   // 'xxx'
'xxx'.padEnd(2, 'ab')     // 'xxx'
```

如果省略第二个参数，默认使用空格补全长度。

```js
'x'.padStart(4)      // '   x'
'x'.padEnd(4)        // 'x   '
```

**用途**

`padStart()` 的常见用途是为数值补全指定位数。下面代码生成 10 位的数值字符串。

```js
'1'.padStart(10, '0')         // "0000000001"
'12'.padStart(10, '0')        // "0000000012"
'123456'.padStart(10, '0')    // "0000123456"
```

另一个用途是提示字符串格式

```js
'12'.padStart(10, 'YYYY-MM-DD')      // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD')   // "YYYY-09-12"
```

参考链接：
 [*String 对象*](https://wangdoc.com/javascript/stdlib/string.html)
 [*字符串的新增方法*](http://es6.ruanyifeng.com/#docs/string-methods)

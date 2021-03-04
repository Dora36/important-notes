# 对象的合并及拷贝

## Object.assign()

`Object.assign()` 方法用于对象的合并，将所有自身的（非继承的）可枚举属性的值从一个或多个源对象拷贝到目标对象。返回目标对象。目标对象自身也会改变。

```js
Object.assign(target, ...sources)
```

- `target`: 目标对象。
- `sources`: 源对象。

### Object.assign() 合并拷贝属性的限制

只拷贝源对象的自身属性（不拷贝继承属性），也不拷贝不可枚举的属性（`enumerable: false`）。

```js
Object.assign({b: 'c'},
  Object.defineProperty({}, 'invisible', {
    enumerable: false,
    value: 'hello'
  })
)
// { b: 'c' }
```

### 参数类型

#### 1. 只有一个参数

如果只有一个参数，`Object.assign()` 会直接返回该参数。

```js
let obj = {a: 1};
Object.assign(obj) === obj // true
```

如果该参数不是对象，则会先转成对象，然后返回。

```js
typeof Object.assign(2) // "object"
```

由于 `undefined` 和 `null` 无法转成对象，所以如果它们作为参数，就会报错。

```js
Object.assign(undefined) // 报错
Object.assign(null) // 报错
```

#### 2. 对象 + 非对象

非对象参数都会转成对象，如果无法转成对象，就会跳过，不会报错。

如果非对象参数为 `undefined` 和 `null` ，就会跳过，不会报错，返回的依旧是目标对象参数。

```js
let obj = {a: 1};
Object.assign(obj, undefined) === obj // true
Object.assign(obj, null) === obj // true
```

如果非对象参数为其他类型的值（即数值、字符串和布尔值），也不会报错。但是，除了字符串会以数组形式拷贝入目标对象，其他值都不会产生效果。这是因为只有字符串的包装对象，会产生可枚举属性。

```js
let v1 = 'abc';
let v2 = true;
let v3 = 10;

let obj = Object.assign({}, v1, v2, v3);
console.log(obj); // { "0": "a", "1": "b", "2": "c" }
```

#### 3. 目标对象 + 源对象...

##### （1） 属性值为 `null` 或 `undefined` 的属性会正常合并

`Object.assign()` 不会跳过那些属性值为 `null` 或 `undefined` 的源对象。

```js
var o1 = { a: null, b: 1};
var o2 = { c: undefined };
  
var obj = Object.assign({}, o1, o2);
obj   // {a: null, b: 1, c: undefined}
```

##### （2） 同名属性的替换

如果目标对象与源对象中的属性具有相同的键，则目标对象属性将被源中的属性覆盖。后来的源的属性将类似地覆盖早先的属性。

```js
var o1 = { a: 1, b: 1, c: 1 };
var o2 = { b: 2, c: 2 };
var o3 = { c: 3 };

var obj = Object.assign({}, o1, o2, o3);
obj    // { a: 1, b: 2, c: 3 }
```

##### （3） 浅拷贝

`Object.assign()` 方法实行的是浅拷贝，而不是深拷贝。拷贝的是属性值。假如源对象的属性值是一个指向对象的引用，它也只拷贝那个引用值。

```js
var obj1 = { a: 0 , b: { c: 0 } };
var obj2 = Object.assign({}, obj1);
obj2   // { a: 0, b: { c: 0 } };

obj2.b.c = 3;
obj1   // { a: 0, b: { c: 3 } };
obj2   // { a: 0, b: { c: 3 } };
```

##### （4） 数组的处理

`Object.assign()` 可以用来处理数组，但是会把数组视为键值为数组下标的对象来合并，然而最终的返回形式也是数组。

```js
Object.assign([1, 2, 3], [4, 5])  // [4, 5, 3]

Object.assign({0:1,1:2,2:3},{0:4,1:5})  // {0: 4, 1: 5, 2: 3}
```

##### （5） 存取器属性的处理

`Object.assign()` 如果遇到存取器定义的属性，会只拷贝值。

```js
var obj = {
  foo: 1,
  get bar() { return 2; }
};

var copy = Object.assign({}, obj); 
copy  // { foo: 1, bar: 2 }
```

因此必须使用 `Object.getOwnPropertyDescriptors()` 方法配合 `Object.defineProperties()` 方法，就可以实现正确拷贝。但仅限于可拷贝 `getter` 和 `setter` ，对于属性的引用类型还是属于浅拷贝。
    
```js
var obj = {
  foo: { a : 0 },
  get bar() { return 2; }
};
var target = Object.defineProperties({},
  Object.getOwnPropertyDescriptors(obj)
);
Object.getOwnPropertyDescriptor(target, 'bar')
// { get : ƒ bar(),
//   set : undefined,
//   enumerable : true, 
//   configurable : true }
    
obj.foo.a = 6
target.foo.a   // 6
```

### 常见用途

#### 1. 为对象添加属性

```js
class Point {
  constructor(x, y) {
    Object.assign(this, {x, y});
  }
}
```

上面方法通过 `Object.assign()` 方法，将 `x` 属性和 `y` 属性添加到 `Point` 类的对象实例。

#### 2. 为对象添加方法

```js
Object.assign(SomeClass.prototype, {
  someMethod(arg1, arg2) { ··· },
  anotherMethod() { ··· }
});

// 等同于下面的写法
SomeClass.prototype.someMethod = function (arg1, arg2) { ··· };
SomeClass.prototype.anotherMethod = function () { ··· };
```

#### 3. 浅克隆对象

```js
let obj = {a:5};
function clone(origin) {
  return Object.assign({}, origin);
}
let aaa = clone(obj);  // {a:5}
```

不过，采用这种方法克隆，只能克隆原始对象自身的值，不能克隆它继承的值。如果想要保持继承链，可以采用下面的代码。

```js
function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}
```

#### 4. 合并多个对象

```js
let merge = (target, ...sources) => Object.assign(target, ...sources);
```

如果希望合并后返回一个新对象，可以改写上面函数，对一个空对象合并。

```js
let merge = (...sources) => Object.assign({}, ...sources);
```

#### 5. 为属性指定默认值

```js
const DEFAULTS = {
  a: 0,
  b: 'ccc'
};

function copy(options) {
  options = Object.assign({}, DEFAULTS, options);
  // ...
}
```

注意，由于存在浅拷贝的问题，DEFAULTS对象和options对象的所有属性的值，最好都是简单类型，不要指向另一个对象。否则，DEFAULTS对象的该属性很可能不起作用。

参考链接：[Object.assign()](http://es6.ruanyifeng.com/#docs/object-methods#Object-assign)


## 深拷贝

### 1. JSON.parse(JSON.stringify(obj))

```js
var obj1 = { a: 0 , b: { c: 0}};
var obj2 = JSON.parse(JSON.stringify(obj1));
obj1.b.c = 4;
obj2    // { a: 0, b: { c: 0}}
```

但由于 `JSON` 的局限性，该方法也不是万能的。比如，如果对象的属性是 `undefined`、函数、`symbol` 或 `XML` 对象，该属性会被 `JSON.stringify()` 过滤掉，导致拷贝时会缺少属性。

```js
let obj = {
  name:'dora',
  sayHello:function(){ console.log('Hello World'); }
}

let cloneObj = JSON.parse(JSON.stringify(obj));
console.log(cloneObj); // {name: "dora"}
```

### 2. 利用递归对每一层都重新创建对象并赋值从而实现深拷贝

```js
function deepClone(value){
  let result = Array.isArray(value) ? [] : {};

  if (value === null || typeof value !== 'object') {
    return value;
  }

  let keysArr = Object.keys(value)
  if(keysArr.length === 0) {
    return value
  }

  keysArr.forEach(key => {
    if(typeof value[key] === 'object') {
      result[key] = deepClone(value[key])
    } else {
      result[key] = value[key]
    }
  })
  return result
}

let obj = {
  a:{b:1,c:2},
  sayHello:function(){ console.log('Hello World'); }
}
let cloneObj = deepClone(obj);

obj.a.b = 4

obj       // {a:{b: 4, c: 2},sayHello:ƒ ()}
cloneObj  // {a:{b: 1, c: 2},sayHello:ƒ ()}
```

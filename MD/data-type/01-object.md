# Object的各种方法

## 分类

### Object() 函数

`Object` 本身是一个函数，用来将任意值转为对象。

如果参数为空（或者为 `undefined` 和 `null`），`Object()` 返回一个空对象。

```js
var obj = Object();
// 等同于
var obj = Object(undefined);
var obj = Object(null);

obj instanceof Object // true
```

如果参数是原始类型的值，`Object` 方法将其转为对应的包装对象的实例。

```js
var obj = Object(1);
obj instanceof Object // true
obj instanceof Number // true

var obj = Object('foo');
obj instanceof Object // true
obj instanceof String // true

var obj = Object(true);
obj instanceof Object // true
obj instanceof Boolean // true
```

如果 `Object` 方法的参数是一个对象，它总是返回该对象，即不用转换。

```js
var arr = [];
var obj = Object(arr);  // 返回原数组
obj === arr             // true

var value = {};
var obj = Object(value) // 返回原对象
obj === value           // true

var fn = function () {};
var obj = Object(fn);  // 返回原函数
obj === fn             // true
```

因此，可以写一个判断变量是否为对象的函数。这个方法常用于保证某个值一定是对象。

```js
function isObject(value) {
    return value === Object(value);
}

isObject([]) // true
isObject(true) // false
```

### 构造函数 new Object()

`Object` 构造函数的首要用途，是直接通过它来生成新对象。

```js
var obj = new Object();

// 等同于
var obj = {}
```

`new Object()` 构造函数与 `Object()` 的用法很相似，几乎一模一样。使用时，可以接受一个参数，如果该参数是一个对象，则直接返回这个对象；如果是一个原始类型的值，则返回该值对应的包装对象。

```js
var o1 = {a: 1};
var o2 = new Object(o1);
o1 === o2 // true

var obj = new Object(123);
obj instanceof Number // true
```

两者区别是语义不同。`Object(value)` 表示将 `value` 转成一个对象，`new Object(value)` 则表示新生成一个对象，它的值是 `value`。

### Object 对象的原生方法

`Object` 对象的原生方法分成两类：`Object` 本身的方法与`Object` 的实例方法。

#### （1） 本身的方法

本身的方法就是直接定义在 `Object` 对象的方法。

##### 1. 遍历对象属性
- `Object.keys()`：遍历对象自身的（非继承的）可枚举属性，返回属性名。
- `Object.getOwnPropertyNames()`：遍历对象自身的（非继承的）全部（可枚举+不可枚举）属性。
- `Object.values()`：遍历对象自身的（非继承的）可枚举属性，返回属性值。
- `Object.entries()`：遍历对象自身的（非继承的）可枚举属性，返回键值对。

##### 2. 对象的属性描述对象相关方法
- `Object.getOwnPropertyDescriptor()`：获取某个属性的描述对象。
- `Object.getOwnPropertyDescriptors()`：获取对象的所有属性的描述对象。
- `Object.defineProperty()`：定义某个属性的描述对象。
- `Object.defineProperties()`：定义多个属性的描述对象。

##### 3. 控制对象状态的方法
- `Object.preventExtensions()`：防止对象扩展，无法添加新属性。
- `Object.isExtensible()`：判断对象是否可扩展。
- `Object.seal()`：禁止对象配置，无法添加新属性，无法删除属性。
- `Object.isSealed()`：判断一个对象是否可配置。
- `Object.freeze()`：冻结一个对象，无法添加新属性，无法删除属性，无法改变属性值。
- `Object.isFrozen()`：判断一个对象是否被冻结。

##### 4. 原型链相关方法
- `Object.create()`：以参数为原型返回一个新的实例对象。
- `Object.getPrototypeOf()`：获取对象的原型对象。
- `Object.setPrototypeOf()`：设置对象的原型对象。

##### 5. 其它
- `Object.assign()`
- `Object.is()`

#### （2） 实例方法

实例方法就是定义在 `Object` 原型对象 `Object.prototype` 上的方法。它可以被 `Object` 实例直接使用。

`Object` 实例对象的方法，主要有以下六个：

- `Object.prototype.valueOf()`：返回当前对象对应的值。
- `Object.prototype.toString()`：返回当前对象对应的字符串形式。
- `Object.prototype.toLocaleString()`：返回当前对象对应的本地字符串形式。
- `Object.prototype.hasOwnProperty()`：判断某个属性是否为当前对象自身的属性，还是继承自原型对象的属性。
- `Object.prototype.isPrototypeOf()`：判断当前对象是否为另一个对象的原型。
- `Object.prototype.propertyIsEnumerable()`：判断对象自身的（非继承的）属性是否可枚举。

## 方法介绍

### 获取属性相关

#### 1. Object.keys() , Object.getOwnPropertyNames()

`Object.keys` 方法和 `Object.getOwnPropertyNames` 方法都用来遍历对象的属性。

**`Object.keys`** 方法的参数是一个对象，返回一个数组。该数组的成员都是该对象自身的（非继承的）所有属性名，且只返回可枚举的属性。

```js
var obj = Object.defineProperties({}, {
    p1: { value: 1, enumerable: true },
    p2: { value: 2, enumerable: false }
});

Object.keys(obj)  // ["p1"]
```

**`Object.getOwnPropertyNames`** 方法与 `Object.keys` 类似，也是接受一个对象作为参数，返回一个数组，该数组的成员是参数对象自身的（非继承的）全部属性的属性名，不管该属性是否可枚举。

```js
var a = ['Hello', 'World'];

Object.keys(a)                   // ["0", "1"]
Object.getOwnPropertyNames(a)    // ["0", "1", "length"]
```

上面代码中，数组的 length 属性是不可枚举的属性，所以只出现在 `Object.getOwnPropertyNames` 方法的返回结果中。

由于 JavaScript 没有提供计算对象属性个数的方法，所以可以用这两个方法代替。

```js
var obj = { p1: 123, p2: 456 };

Object.keys(obj).length                  // 2
Object.getOwnPropertyNames(obj).length   // 2
```

一般情况下，几乎总是使用 `Object.keys` 方法，遍历对象的属性。

#### 2. Object.values()

`Object.values()` 方法返回一个数组，成员是参数对象自身的（非继承的）所有可枚举属性的属性值。

```js
var obj = { p1: 123, p2: 456 };
Object.values(obj)   // [123, 456]
```

#### 3. Object.entries()

`Object.entries()` 方法返回一个数组，成员是参数对象自身的（非继承的）所有可枚举属性的键值对数组。

```js
var obj = { p1: 123, p2: 456 };
Object.entries(obj)  // [["p1", "123"], ["p2", 456]]
```

#### 4. Object.prototype.hasOwnProperty()

实例对象的 `hasOwnProperty()` 方法接受一个字符串作为参数，返回一个布尔值，表示该实例对象自身是否具有该属性。有返回 `true`，没有或是继承的属性都返回 `false`。

```js
var obj = { p: 123 };

obj.hasOwnProperty('p')            // true
obj.hasOwnProperty('toString')     // false
```

### 原型链相关

#### 1. Object.getPrototypeOf()

`Object.getPrototypeOf()` 方法返回参数对象的原型。这是获取原型对象的标准方法。

```js
var F = function () {};
var f = new F();
Object.getPrototypeOf(f) === F.prototype // true
```

`Object.prototype` 的原型是 `null`。

```js
Object.getPrototypeOf(Object.prototype) === null // true
```

#### 2. Object.setPrototypeOf()

`Object.setPrototypeOf()` 方法为参数对象设置原型，返回该参数对象。它接受两个参数，第一个是现有对象，第二个是原型对象。

```js
var a = {};
var b = {x: 1};
Object.setPrototypeOf(a, b);

Object.getPrototypeOf(a) === b // true
a.x // 1
```

`new` 命令可以使用 `Object.setPrototypeOf()` 方法模拟。

```js
var F = function () { this.foo = 'bar'; };

var f = new F();
// 等同于
var f = Object.setPrototypeOf({}, F.prototype);
F.call(f);
```

#### 3. Object.prototype.\_\_proto__
实例对象的 `__proto__` 属性，返回该对象的原型。该属性可读写。

```js
var obj = {};
var p = {};

obj.__proto__ = p;
Object.getPrototypeOf(obj) === p   // true
```

根据语言标准，`__proto__` 属性只有浏览器才需要部署，其他环境可以没有这个属性。它前后的两根下划线，表明它本质是一个内部属性，不应该对使用者暴露。因此，应该尽量少用这个属性，而是用 `Object.getPrototypeof()` 和 `Object.setPrototypeOf()`，进行原型对象的读写操作。

#### 4. Object.prototype.isPrototypeOf()

实例对象的 `isPrototypeOf()` 方法，用来判断该对象是否为参数对象的原型。

```js
var o1 = {};
var o2 = Object.create(o1);
var o3 = Object.create(o2);

o2.isPrototypeOf(o3)   // true
o1.isPrototypeOf(o3)   // true
```

只要实例对象处在参数对象的原型链上，`isPrototypeOf()` 方法都返回true。

```js
Object.prototype.isPrototypeOf({})                   // true
Object.prototype.isPrototypeOf([])                   // true
Object.prototype.isPrototypeOf(/xyz/)                // true
Object.prototype.isPrototypeOf(Object.create(null))  // false
```

由于 `Object.prototype` 处于原型链的最顶端，所以对各种实例都返回 `true`，只有直接继承自 `null` 的对象除外。

#### 5. Object.create()

`Object.create()` 方法接受一个对象作为参数，目的是以参数对象为原型，返回一个实例对象。该实例完全继承原型对象的属性。

很多时候，需要从一个实例对象 A 生成另一个实例对象 B，如果 A 是由构造函数创建的，那么可以很轻松的得到 A 的构造函数重新生成实例 B，然而很多时候，A 只是一个普通的对象，并不是由构造函数生成的，这时候就需要使用`Object.create()` 方法由 A 生成 B。

```js
var A = {
    print: function () {
    console.log('hello');
    }
};

var B = Object.create(A);

Object.getPrototypeOf(B) === A    // true
B.print()                         // hello
B.print === A.print               // true
```

`Object.create()` 方法兼容性处理，即生成实例的本质：

```js
if (typeof Object.create !== 'function') {
    Object.create = function (obj) {
    function F() {}       // 新建一个空的构造函数 F
    F.prototype = obj;    // 让 F.prototype 属性指向参数对象 obj
    return new F();       // 最后返回一个 F 的实例
    };
}
```

下面三种方式生成的新对象是等价的：

```js
var obj1 = Object.create({});
var obj2 = Object.create(Object.prototype);
var obj3 = new Object();
```

如果想要生成一个不继承任何属性（比如没有 `toString` 和 `valueOf` 方法）的对象，可以将 `Object.create` 的参数设为 `null`。因为生成的实例对象原型是 `null`，所以它就不具备定义在 `Object.prototype` 原型上面的方法。

```js
var obj = Object.create(null);
```

`Object.create()` 方法还可以接受第二个参数。该参数是一个属性描述对象，它所描述的对象属性，会添加到实例对象，作为该对象自身的属性。

```js
var obj = Object.create({}, {
    p1: {
    value: 123,
    enumerable: true,
    configurable: true,
    writable: true,
    },
    p2: {
    value: 'abc',
    enumerable: true,
    configurable: true,
    writable: true,
    }
});

// 等同于
var obj = Object.create({});
obj.p1 = 123;
obj.p2 = 'abc';
```

`Object.create()` 方法生成的对象，继承了它的原型对象的构造函数。

```js
function A() {}
var a = new A();
var b = Object.create(a);

b.constructor === A   // true
b instanceof A        // true
```

### 属性描述对象相关

#### 1. Object.getOwnPropertyDescriptor() , Object.getOwnPropertyDescriptors()

**`Object.getOwnPropertyDescriptor()`** 可以获取某个属性的属性描述对象。它的第一个参数是对象，第二个参数是对象的某个属性名。返回的是该属性的属性描述对象。

```js
var obj = { p1: 'a',  p2: 'b'};

Object.getOwnPropertyDescriptor(obj, 'p1')
// { value: "a",
//   writable: true,
//   enumerable: true,
//   configurable: true
// }
```

只能用于对象自身的（非继承的）属性。继承的或不存在的属性返回 `undefined`。

```js
Object.getOwnPropertyDescriptor(obj, 'toString')   // undefined
```

**`Object.getOwnPropertyDescriptors()`** 可以获取参数对象的所有属性的属性描述对象。ES2017 引入标准。

```js
Object.getOwnPropertyDescriptors(obj)
// { p1: {value: "a", writable: true, enumerable: true, configurable: true}
//   p2: {value: "b", writable: true, enumerable: true, configurable: true}
// }
```

#### 2. Object.defineProperty() ，Object.defineProperties()

**`Object.defineProperty()`** 方法允许通过属性描述对象，定义或修改一个属性，然后返回修改后的描述对象。

```js
Object.defineProperty(object, propertyName, attributesObject)
```

`Object.defineProperty()` 方法接受三个参数，依次如下。

- `object`：属性所在的对象
- `propertyName`：字符串，表示属性名
- `attributesObject`：属性描述对象

```js
var obj = Object.defineProperty({}, 'p', {
    value: 123,
    writable: false,
    enumerable: true,
    configurable: false
});
obj.p         // 123
obj.p = 246;
obj.p         // 123
```

注意，上例中第一个参数是{ }（一个新建的空对象），p属性直接定义在这个空对象上面，然后返回这个对象，这是 `Object.defineProperty()` 的常见用法。

如果属性已经存在，`Object.defineProperty()` 方法相当于更新该属性的属性描述对象。

**`Object.defineProperties()`** 方法可以定义或修改多个属性。接受两个参数。

```js
var obj = Object.defineProperties({}, {
    p1: { value: 123, enumerable: true },
    p2: { value: 'abc', enumerable: true },
    p3: { get: function () { return this.p1 + this.p2 },
    enumerable:true,
    configurable:true
    }
});

obj.p1 // 123
obj.p2 // "abc"
obj.p3 // "123abc"
```

注意，一旦定义了取值函数 `get` 或存值函数 `set`，就不能同时定义 `writable` 属性或 `value` 属性，否则会报错。

**元属性默认值**

`Object.defineProperty()` 和 `Object.defineProperties()` 参数里面的属性描述对象，`writable`、`configurable`、`enumerable` 这三个属性的默认值都为 `false`。

```js
var obj = {};
Object.defineProperty(obj, 'foo', {});
Object.getOwnPropertyDescriptor(obj, 'foo')
// {
//   value: undefined,
//   writable: false,
//   enumerable: false,
//   configurable: false
// }
```

#### 3. Object.prototype.propertyIsEnumerable()

实例对象的 `propertyIsEnumerable()` 方法返回一个布尔值，用来判断某个属性是否可枚举。

```js
var obj = {};
obj.p = 123;

obj.propertyIsEnumerable('p')           // true
obj.propertyIsEnumerable('toString')    // false
```

注意，这个方法只能用于判断对象自身的属性，对于继承的属性一律返回 `false`。

### 控制对象状态相关

有时需要冻结对象的读写状态，防止对象被改变。JavaScript 提供了三种冻结方法，最弱的一种是 `Object.preventExtensions()`，其次是 `Object.seal()`，最强的是 `Object.freeze()`。

#### 1. Object.preventExtensions()

`Object.preventExtensions()` 方法可以使得一个对象无法再添加新的属性。

```js
var obj = new Object();
Object.preventExtensions(obj);

Object.defineProperty(obj, 'p', { value: 'hello' });
// TypeError: Cannot define property p, object is not extensible.

obj.p = 1;
obj.p      // undefined
```

#### 2. Object.isExtensible()

`Object.isExtensible()` 方法用于检查是否可以为一个对象添加属性。可以添加返回 `true`，不可以添加返回 `false`。

```js
var obj = new Object();

Object.isExtensible(obj) // true
Object.preventExtensions(obj);
Object.isExtensible(obj) // false
```

#### 3. Object.seal()

`Object.seal()` 方法使得一个对象既无法添加新属性，也无法删除旧属性。

```js
var obj = { p: 'hello' };
Object.seal(obj);

delete obj.p;
obj.p // "hello"

obj.x = 'world';
obj.x // undefined
```

`Object.seal` 实质是把属性描述对象的 `configurable` 属性设为 `false`，因此属性描述对象就不能再改变了。

```js
var obj = { p: 'a' };

// seal方法之前
Object.getOwnPropertyDescriptor(obj, 'p')  // {... configurable: true }

Object.seal(obj);

// seal方法之后
Object.getOwnPropertyDescriptor(obj, 'p')  // {... configurable: false }

Object.defineProperty(obj, 'p', {
    enumerable: false
})
// TypeError: Cannot redefine property: p
```

`Object.seal` 只是禁止新增或删除属性，并不影响修改某个属性的值。

```js
var obj = { p: 'a' };
Object.seal(obj);
obj.p = 'b';
obj.p // 'b'
```

`Object.seal` 方法对 p 属性的 `value` 无效，是因为此时 p 属性的可写性由`writable` 决定。

#### 4. Object.isSealed()

`Object.isSealed()` 方法用于检查一个对象是否使用了 `Object.seal` 方法。未使用返回`false`，使用了返回 `true`。

```js
var obj = { p: 'a' };

Object.seal(obj);
Object.isSealed(obj) // true
```

此时，`Object.isExtensible()` 方法也返回 `false`。

```js
Object.isExtensible(obj) // false
```

#### 5. Object.freeze()

`Object.freeze()` 方法可以使得一个对象无法添加新属性、无法删除旧属性、也无法改变属性的值，使得这个对象实际上变成了常量。

```js
var obj = { p: 'hello' };

Object.freeze(obj);

obj.p = 'world';
obj.p             // "hello"

obj.t = 'hello';
obj.t             // undefined

delete obj.p     // false
obj.p            // "hello"
```

#### 6. Object.isFrozen()

`Object.isFrozen()` 方法用于检查一个对象是否使用了Object.freeze方法。未使用返回`false`，使用了返回 `true`。此时 `Object.isExtensible()` 也返回 `false`。

```js
var obj = { p: 'hello' };

Object.freeze(obj);
Object.isFrozen(obj)        // true
Object.isExtensible(obj)    // false
```

**局限性**

以上三个方法锁定对象有局限性，并不是完全冻结。

1. 可以通过改变原型对象，来为对象增加新属性。

    ```js
    var obj = new Object();
    Object.preventExtensions(obj);
    
    var proto = Object.getPrototypeOf(obj);
    proto.t = 'hello';
    obj.t   // hello
    ```

    解决方案是，把 `obj` 的原型也冻结住。
    
    ```js
    Object.preventExtensions(proto);
    
    proto.t = 'hello';
    obj.t // undefined
    ```

2. 如果属性值是对象，以上三个方法只能冻结属性指向的对象地址，而不能冻结对象本身。

    ```js
    var obj = {
        foo: 1,
        bar: ['a', 'b']
    };
    Object.freeze(obj);
    
    obj.bar.push('c');
    obj.bar // ["a", "b", "c"]
    ```

    `obj.bar` 属性指向一个数组，`obj` 对象被冻结以后，这个指向无法改变，即无法指向其他值，但是所指向的数组是可以改变的。

**完全冻结**

```js
var constantize = (obj) => {
    Object.freeze(obj);
    Object.keys(obj).forEach((key, i) => {
    if ( typeof obj[key] === 'object' ) {
        constantize(obj[key]);
    }
    });
};

var obj = {
    foo: 1,
    bar: ['a', 'b']
};
constantize(obj);

obj.bar.push('c'); 
// TypeError: Cannot add property 2, object is not extensible
```

### 对象的合并及拷贝

#### 1. Object.assign()

`Object.assign()` 方法用于对象的合并，将所有自身的（非继承的）可枚举属性的值从一个或多个源对象复制到目标对象。返回目标对象。目标对象自身也会改变。

```js
Object.assign(target, ...sources)
```

- `target`: 目标对象。
- `sources`: 源对象。

如果目标对象中的属性具有相同的键，则属性将被源中的属性覆盖。后来的源的属性将类似地覆盖早先的属性。

```js
var o1 = { a: 1, b: 1, c: 1 };
var o2 = { b: 2, c: 2 };
var o3 = { c: 3 };

var obj = Object.assign({}, o1, o2, o3);
obj    // { a: 1, b: 2, c: 3 }
```

`Object.assign()` 不会跳过那些值为 `null` 或 `undefined` 的源对象。

```js
var o1 = { a: null, b: 1};
var o2 = { c: undefined };
    
var obj = Object.assign({}, o1, o2);
obj   // {a: null, b: 1, c: undefined}
```

`Object.assign()` 拷贝的是属性值。假如源对象的属性值是一个指向对象的引用，它也只拷贝那个引用值。

```js
var obj1 = { a: 0 , b: { c: 0 } };
var obj2 = Object.assign({}, obj1);
obj2   // { a: 0, b: { c: 0 } };

obj2.b.c = 3;
obj1   // { a: 0, b: { c: 3 } };
obj2   // { a: 0, b: { c: 3 } };
```

因此针对深拷贝，需要使用其他方法。

```js
var obj1 = { a: 0 , b: { c: 0}};
var obj2 = JSON.parse(JSON.stringify(obj1));
obj1.b.c = 4;
obj2    // { a: 0, b: { c: 0}}
```

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
    set : undefined,
    enumerable : true, 
    configurable : true }
    
obj.foo.a = 6
target.foo.a   // 6
```

如果属性不可写，会引发报错，如果在引发错误之前添加了任何属性，则可以更改target对象。

### 其它

#### 1. Object.is()

Object.is() 用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。返回布尔值，相等返回 true，不相等返回 false。

不同之处只有两个：一是+0不等于-0，二是NaN等于自身。

```js
+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

详情见 [JavaScript 的相等比较](https://segmentfault.com/a/1190000016877867)。

ES5 可以通过下面的代码，部署 `Object.is`。

```js
Object.defineProperty(Object, 'is', {
    value: function(x, y) {
    if (x === y) {
        // 针对+0 不等于 -0的情况
        return x !== 0 || 1 / x === 1 / y;
    }
    // 针对NaN的情况
    return x !== x && y !== y;
    },
    configurable: true,
    enumerable: false,
    writable: true
});
```

#### 2. Object.prototype.valueOf()

`valueOf` 方法的作用是返回一个对象的“值”，默认情况下返回对象本身。

```js
var obj = new Object();
obj.valueOf() === obj      // true
```

主要用途是，JavaScript 自动类型转换时会默认调用这个方法。因此，如果给实例对象自定义 `valueOf()` 方法，覆盖 `Object.prototype.valueOf()`，就可以得到想要的结果。

```js
var obj = new Object();
obj.valueOf = function () {
    return 2;
};

1 + obj // 3
```

#### 3. Object.prototype.toString()

`toString` 方法的作用是返回一个对象的字符串形式，默认情况下返回类型字符串。

```js
var obj = {};
obj.toString()   // "[object Object]"
```

JavaScript 自动类型转换时也会调用这个方法。因此可以通过自定义实例对象的 `toString` 方法，覆盖掉 `Object.prototype.toString()`，得到想要的字符串形式。

```js
var obj = new Object();

obj.toString = function () {
    return 'hello';
};

obj + ' ' + 'world'     // "hello world"
```

数组、字符串、函数、Date 对象都分别部署了自定义的 `toString` 方法，覆盖了 `Object.prototype.toString()` 方法。

```js
[1, 2, 3].toString() // "1,2,3"

'123'.toString() // "123"

(function () {
    return 123;
}).toString()
// "function () {
//   return 123;
// }"

(new Date()).toString()
// "Tue May 10 2016 09:11:31 GMT+0800 (CST)"
```

`Object.prototype.toString.call(value)` 可用于判断数据类型，详情见 [判断数据类型的各种方法](https://segmentfault.com/a/1190000016888845#articleHeader5)。

#### 4. Object.prototype.toLocaleString()

`Object.prototype.toLocaleString` 方法与 `toString` 的返回结果相同，也是返回一个值的字符串形式。

```js
var obj = {};
obj.toString(obj)         // "[object Object]"
obj.toLocaleString(obj)   // "[object Object]"
```

这个方法的主要作用是留出一个接口，让各种不同的对象实现自己版本的 `toLocaleString`，用来返回针对某些地域的特定的值。

目前，主要有三个对象自定义了 `toLocaleString` 方法。

- `Array.prototype.toLocaleString()`
- `Number.prototype.toLocaleString()`
- `Date.prototype.toLocaleString()`

日期的实例对象的 `toString` 和 `toLocaleString` 返回值就不一样，而且 `toLocaleString` 的返回值跟用户设定的所在地域相关。

```js
var date = new Date();
date.toString()       // "Thu Nov 29 2018 16:50:00 GMT+0800 (中国标准时间)"
date.toLocaleString() // "2018/11/29 下午4:50:00"
```

参考链接：[JavaScript 教程 Object 对象](https://wangdoc.com/javascript/stdlib/object.html)






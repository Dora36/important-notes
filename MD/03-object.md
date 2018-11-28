# Object的各种方法

## 分类
### Object() 函数




### Object 对象的原生方法

`Object` 对象的原生方法分成两类：`Object` 本身的方法与`Object` 的实例方法。

#### （1） 本身的方法

本身的方法就是直接定义在 `Object` 对象的方法。
##### 1. 遍历对象属性
- `Object.keys()`：遍历对象自身的（非继承的）可遍历属性。
- `Object.getOwnPropertyNames()`：遍历对象自身的（非继承的）全部（可遍历+不可遍历）属性

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
- `Object.prototype.propertyIsEnumerable()`：判断对象自身的（非继承的）属性是否可遍历。

## 方法介绍

### 获取属性相关

#### 1. Object.keys() , Object.getOwnPropertyNames()

`Object.keys` 方法和 `Object.getOwnPropertyNames` 方法都用来遍历对象的属性。

**`Object.keys`** 方法的参数是一个对象，返回一个数组。该数组的成员都是该对象自身的（非继承的）所有属性名，且只返回可遍历的属性。

    var obj = Object.defineProperties({}, {
      p1: { value: 1, enumerable: true },
      p2: { value: 2, enumerable: false }
    });
    
    Object.keys(obj)  // ["p1"]
    
**`Object.getOwnPropertyNames`** 方法与 `Object.keys` 类似，也是接受一个对象作为参数，返回一个数组，该数组的成员是参数对象自身的（非继承的）全部属性的属性名，不管该属性是否可遍历。

    var a = ['Hello', 'World'];
    
    Object.keys(a)                   // ["0", "1"]
    Object.getOwnPropertyNames(a)    // ["0", "1", "length"]

上面代码中，数组的 length 属性是不可枚举的属性，所以只出现在 `Object.getOwnPropertyNames` 方法的返回结果中。

由于 JavaScript 没有提供计算对象属性个数的方法，所以可以用这两个方法代替。

    var obj = { p1: 123, p2: 456 };
    
    Object.keys(obj).length                  // 2
    Object.getOwnPropertyNames(obj).length   // 2

一般情况下，几乎总是使用 `Object.keys` 方法，遍历对象的属性。


#### 2. Object.prototype.hasOwnProperty()

实例对象的 `hasOwnProperty()` 方法接受一个字符串作为参数，返回一个布尔值，表示该实例对象自身是否具有该属性。有返回 `true`，没有或是继承的属性都返回 `false`。

    var obj = { p: 123 };
    
    obj.hasOwnProperty('p')            // true
    obj.hasOwnProperty('toString')     // false
    
`hasOwnProperty()` 方法是 JavaScript 之中唯一一个处理对象属性时，不会遍历原型链的方法。
    
### 属性描述对象相关

#### 3. Object.getOwnPropertyDescriptor() , Object.getOwnPropertyDescriptors()

**`Object.getOwnPropertyDescriptor()`** 可以获取某个属性的属性描述对象。它的第一个参数是对象，第二个参数是对象的某个属性名。返回的是该属性的属性描述对象。
    
    var obj = { p1: 'a',  p2: 'b'};
    
    Object.getOwnPropertyDescriptor(obj, 'p1')
    // { value: "a",
    //   writable: true,
    //   enumerable: true,
    //   configurable: true
    // }
        
只能用于对象自身的（非继承的）属性。
   
    Object.getOwnPropertyDescriptor(obj, 'toString')   // undefined

**`Object.getOwnPropertyDescriptors()`** 可以获取参数对象的所有属性的属性描述对象。ES2017 引入标准。

    Object.getOwnPropertyDescriptors(obj)
    // { p1: {value: "a", writable: true, enumerable: true, configurable: true}
    //   p2: {value: "b", writable: true, enumerable: true, configurable: true}
    // }

#### 4. Object.defineProperty() ，Object.defineProperties()

**`Object.defineProperty()`** 方法允许通过属性描述对象，定义或修改一个属性，然后返回修改后的描述对象。

    Object.defineProperty(object, propertyName, attributesObject)

`Object.defineProperty()` 方法接受三个参数，依次如下。

- `object`：属性所在的对象
- `propertyName`：字符串，表示属性名
- `attributesObject`：属性描述对象


    var obj = Object.defineProperty({}, 'p', {
      value: 123,
      writable: false,
      enumerable: true,
      configurable: false
    });
    obj.p         // 123
    obj.p = 246;
    obj.p         // 123

注意，上例中第一个参数是{ }（一个新建的空对象），p属性直接定义在这个空对象上面，然后返回这个对象，这是 `Object.defineProperty()` 的常见用法。

如果属性已经存在，`Object.defineProperty()` 方法相当于更新该属性的属性描述对象。

**`Object.defineProperties()`** 方法可以定义或修改多个属性。接受两个参数。

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

注意，一旦定义了取值函数get（或存值函数set），就不能将writable属性设为true，或者同时定义value属性，否则会报错。

**元属性默认值**

`Object.defineProperty()` 和 `Object.defineProperties()` 参数里面的属性描述对象，`writable`、`configurable`、`enumerable` 这三个属性的默认值都为 `false`。

    var obj = {};
    Object.defineProperty(obj, 'foo', {});
    Object.getOwnPropertyDescriptor(obj, 'foo')
    // {
    //   value: undefined,
    //   writable: false,
    //   enumerable: false,
    //   configurable: false
    // }

#### 5. Object.prototype.propertyIsEnumerable()

实例对象的 `propertyIsEnumerable()` 方法返回一个布尔值，用来判断某个属性是否可遍历。

    var obj = {};
    obj.p = 123;
    
    obj.propertyIsEnumerable('p')           // true
    obj.propertyIsEnumerable('toString')    // false

注意，这个方法只能用于判断对象自身的属性，对于继承的属性一律返回 `false`。


### 原型链相关

#### 6. Object.getPrototypeOf()

`Object.getPrototypeOf()` 方法返回参数对象的原型。这是获取原型对象的标准方法。

    var F = function () {};
    var f = new F();
    Object.getPrototypeOf(f) === F.prototype // true

`Object.prototype` 的原型是 `null`。

    Object.getPrototypeOf(Object.prototype) === null // true

#### 7. Object.setPrototypeOf()

`Object.setPrototypeOf()` 方法为参数对象设置原型，返回该参数对象。它接受两个参数，第一个是现有对象，第二个是原型对象。

    var a = {};
    var b = {x: 1};
    Object.setPrototypeOf(a, b);
    
    Object.getPrototypeOf(a) === b // true
    a.x // 1

`new` 命令可以使用 `Object.setPrototypeOf()` 方法模拟。

    var F = function () { this.foo = 'bar'; };
    
    var f = new F();
    // 等同于
    var f = Object.setPrototypeOf({}, F.prototype);
    F.call(f);
    
#### 8. Object.prototype.\_\_proto__
实例对象的 `__proto__` 属性，返回该对象的原型。该属性可读写。

    var obj = {};
    var p = {};
    
    obj.__proto__ = p;
    Object.getPrototypeOf(obj) === p   // true
    
根据语言标准，`__proto__` 属性只有浏览器才需要部署，其他环境可以没有这个属性。它前后的两根下划线，表明它本质是一个内部属性，不应该对使用者暴露。因此，应该尽量少用这个属性，而是用 `Object.getPrototypeof()` 和 `Object.setPrototypeOf()`，进行原型对象的读写操作。

#### 9. Object.prototype.isPrototypeOf()

实例对象的 `isPrototypeOf()` 方法，用来判断该对象是否为参数对象的原型。

    var o1 = {};
    var o2 = Object.create(o1);
    var o3 = Object.create(o2);
    
    o2.isPrototypeOf(o3)   // true
    o1.isPrototypeOf(o3)   // true

只要实例对象处在参数对象的原型链上，`isPrototypeOf()` 方法都返回true。

    Object.prototype.isPrototypeOf({})                   // true
    Object.prototype.isPrototypeOf([])                   // true
    Object.prototype.isPrototypeOf(/xyz/)                // true
    Object.prototype.isPrototypeOf(Object.create(null))  // false

由于 `Object.prototype` 处于原型链的最顶端，所以对各种实例都返回 `true`，只有直接继承自 `null` 的对象除外。

#### 10. Object.create()





### 控制对象状态相关

有时需要冻结对象的读写状态，防止对象被改变。JavaScript 提供了三种冻结方法，最弱的一种是 `Object.preventExtensions()`，其次是 `Object.seal()`，最强的是 `Object.freeze()`。

#### 11. Object.preventExtensions()

`Object.preventExtensions()` 方法可以使得一个对象无法再添加新的属性。

    var obj = new Object();
    Object.preventExtensions(obj);
    
    Object.defineProperty(obj, 'p', { value: 'hello' });
    // TypeError: Cannot define property p, object is not extensible.
    
    obj.p = 1;
    obj.p      // undefined

#### 12. Object.isExtensible()

`Object.isExtensible()` 方法用于检查是否可以为一个对象添加属性。可以添加返回 `true`，不可以添加返回 `false`。

    var obj = new Object();
    
    Object.isExtensible(obj) // true
    Object.preventExtensions(obj);
    Object.isExtensible(obj) // false

#### 13. Object.seal()

`Object.seal()` 方法使得一个对象既无法添加新属性，也无法删除旧属性。

    var obj = { p: 'hello' };
    Object.seal(obj);
    
    delete obj.p;
    obj.p // "hello"
    
    obj.x = 'world';
    obj.x // undefined

`Object.seal` 实质是把属性描述对象的 `configurable` 属性设为 `false`，因此属性描述对象就不能再改变了。

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

`Object.seal` 只是禁止新增或删除属性，并不影响修改某个属性的值。

    var obj = { p: 'a' };
    Object.seal(obj);
    obj.p = 'b';
    obj.p // 'b'

`Object.seal` 方法对 p 属性的 `value` 无效，是因为此时 p 属性的可写性由`writable` 决定。

#### 14. Object.isSealed()

`Object.isSealed()` 方法用于检查一个对象是否使用了 `Object.seal` 方法。未使用返回`false`，使用了返回 `true`。

    var obj = { p: 'a' };
    
    Object.seal(obj);
    Object.isSealed(obj) // true

此时，`Object.isExtensible()` 方法也返回 `false`。

    Object.isExtensible(obj) // false

#### 15. Object.freeze()

`Object.freeze()` 方法可以使得一个对象无法添加新属性、无法删除旧属性、也无法改变属性的值，使得这个对象实际上变成了常量。

    var obj = { p: 'hello' };
    
    Object.freeze(obj);
    
    obj.p = 'world';
    obj.p             // "hello"
    
    obj.t = 'hello';
    obj.t             // undefined
    
    delete obj.p     // false
    obj.p            // "hello"

#### 16. Object.isFrozen()

`Object.isFrozen()` 方法用于检查一个对象是否使用了Object.freeze方法。未使用返回`false`，使用了返回 `true`。此时 `Object.isExtensible()` 也返回 `false`。

    var obj = { p: 'hello' };
    
    Object.freeze(obj);
    Object.isFrozen(obj)        // true
    Object.isExtensible(obj)    // false

**局限性**

以上三个方法锁定对象有局限性，并不是完全冻结。

1. 可以通过改变原型对象，来为对象增加新属性。

       var obj = new Object();
       Object.preventExtensions(obj);
        
       var proto = Object.getPrototypeOf(obj);
       proto.t = 'hello';
       obj.t   // hello

    解决方案是，把 `obj` 的原型也冻结住。

       Object.preventExtensions(proto);
        
       proto.t = 'hello';
       obj.t // undefined

2. 如果属性值是对象，以上三个方法只能冻结属性指向的对象地址，而不能冻结对象本身。

       var obj = {
         foo: 1,
         bar: ['a', 'b']
       };
       Object.freeze(obj);
        
       obj.bar.push('c');
       obj.bar // ["a", "b", "c"]

    `obj.bar` 属性指向一个数组，`obj` 对象被冻结以后，这个指向无法改变，即无法指向其他值，但是所指向的数组是可以改变的。





## 对象的拷贝












# 属性描述对象

JavaScript 提供了一个内部数据结构，用来描述对象的属性，控制它的行为，比如该属性是否可写、可枚举等等。这个内部数据结构称为“属性描述对象”（`attributes object`）。每个属性都有自己对应的属性描述对象，保存该属性的一些元信息。

## 元属性
属性描述对象的各个属性称为“元属性”，因为它们可以看作是控制属性的属性。

### value

`value` 属性是目标属性的值。

    var obj = { p : 123 };
    
    Object.getOwnPropertyDescriptor(obj, 'p').value   // 123
    
    Object.defineProperty(obj, 'p', { value: 246 });
    obj.p     // 246

改写 `value` 属性时，只要 `writable` 和 `configurable` 有一个为 `true`，就允许改动。只有 `writable` 和 `configurable` 两个都为 `false` 时，`value` 属性才不可改写。

    var obj = Object.defineProperty({}, 'p', {
      value: 1,
      writable: false,
      configurable: false
    });
    
    Object.defineProperty(obj, 'p', {value: 2})
    // TypeError: Cannot redefine property: p
    
    obj.p = 4
    obj.p       // 1

`value` 属性不可改写时，直接属性赋值，不报错，但不会成功。在严格模式下会报错，即使对属性重新赋予一个同样的值。

### writable

`writable` 属性是一个布尔值，决定了目标属性的值 `value` 是否可以被改变。

    var obj = {};
    
    Object.defineProperty(obj, 'a', {
      value: 37,
      writable: false
    });
    
    obj.a         // 37
    obj.a = 25;
    obj.a         // 37

如果原型对象的某个属性的 `writable` 为 `false`，那么子对象将无法自定义这个属性。

    var proto = Object.defineProperty({}, 'foo', {
      value: 'a',
      writable: false
    });
    
    var obj = Object.create(proto);
    
    obj.foo = 'b';
    obj.foo    // 'a'

但是，有一个规避方法，就是通过覆盖属性描述对象，绕过这个限制。原因是这种情况下，原型链会被完全忽视。

    Object.defineProperty(obj, 'foo', {
      value: 'b'
    });
    
    obj.foo   // "b"

### enumerable

`enumerable` （可枚举性）属性是一个布尔值，表示目标属性是否可枚举。

如果一个属性的 `enumerable` 为 `false` 时，下面四个操作将不会取到该属性。
- `for..in` 循环
- `Object.keys()` 方法
- `JSON.stringify()` 方法
- `Object.assign()`：只拷贝对象自身的可枚举的属性。


    var obj = {};
    
    Object.defineProperty(obj, 'x', {
      value: 123,
      enumerable: false
    });
    
    obj.x                   // 123
    for (var key in obj) {console.log(key);}  // undefined
    Object.keys(obj)        // []
    JSON.stringify(obj)     // "{}"

`JSON.stringify` 方法会排除 `enumerable` 为 `false` 的属性，如果对象的 JSON 格式输出要排除某些属性，就可以利用这一点把这些属性的 `enumerable` 设为 `false`。

### configurable

`configurable` (可配置性）返回一个布尔值，决定了是否可以修改属性描述对象。也就是说，`configurable` 为 `false` 时，`value`、`writable`、`enumerable` 和 `configurable` 都不能被修改了。

    var obj = Object.defineProperty({}, 'p', {
      value: 1,
      writable: false,
      enumerable: false,
      configurable: false
    });
    
    Object.defineProperty(obj, 'p', {value: 2})
    // TypeError: Cannot redefine property: p
    
    Object.defineProperty(obj, 'p', {writable: true})
    // TypeError: Cannot redefine property: p
    
    Object.defineProperty(obj, 'p', {enumerable: true})
    // TypeError: Cannot redefine property: p
    
    Object.defineProperty(obj, 'p', {configurable: true})
    // TypeError: Cannot redefine property: p

注意，`writable` 只有在 `false` 改为 `true` 时会报错，`true` 改为 `false` 是允许的。

    var obj = Object.defineProperty({}, 'p', {
      writable: true,
      configurable: false
    });
    
    Object.defineProperty(obj, 'p', {writable: false})  // 修改成功

可配置性决定了目标属性是否可以被删除（`delete`）。`configurable` 为 `true` 时，属性可以被删除，为 `false` 时，属性不可被删除。

    var obj = Object.defineProperties({}, {
      p1: { value: 1, configurable: true },
      p2: { value: 2, configurable: false }
    });
    
    delete obj.p1    // true
    delete obj.p2    // false
    
    obj.p1    // undefined
    obj.p2    // 2


### 存取器

除了直接定义以外，属性还可以用存取器（accessor）定义。其中，存值函数称为 `setter`，使用属性描述对象的 `set` 属性；取值函数称为 `getter`，使用属性描述对象的 `get` 属性。

一旦对目标属性定义了存取器，那么存取的时候，都将执行对应的函数。利用这个功能，可以实现许多高级特性，比如某个属性禁止赋值。

    var obj = Object.defineProperty({}, 'p', {
      get: function () { return 'getter'; },
      set: function (value) { console.log('setter: ' + value); }
    });
    
    obj.p          // "getter"
    obj.p = 123    // "setter: 123"

一旦定义了取值函数 `get` 或存值函数 `set`，就不能同时定义 `writable` 属性或 `value` 属性，否则会报错。如果通过 `Object.defineProperty()` 重定义 `writable` 属性或 `value` 属性，那么取值函数 `get` 和存值函数 `set` 将会被 `value` 和 `writable` 覆盖。

    var obj = Object.defineProperty({}, 'p', {
      get: function () { return 'getter'; },
      set: function (value) { console.log('setter: ' + value); },
      configurable: true
    });
        
    Object.getOwnPropertyDescriptor(obj,'p')
    // { get: ƒ (),
    //   set: ƒ (value),
    //   enumerable: false,
    //   configurable: true
    // }
    
    // 重定义
    Object.defineProperty(obj, 'p', { writable:true });
    Object.getOwnPropertyDescriptor(obj,'p')
    // {value: undefined, writable: true, enumerable: false, configurable: true}

JavaScript 还提供了存取器的另一种写法。与定义属性描述对象是等价的，而且使用更广泛。

    var obj = {
      get p() {
        return 'getter';
      },
      set p(value) {
        console.log('setter: ' + value);
      }
    };

注意，取值函数 `get` 不能接受参数，存值函数 `set` 只能接受一个参数（即属性的值）。

存取器往往用于，属性的值依赖对象内部数据的场合。

    var obj ={
      $n : 5,
      get next() { return this.$n },
      set next(n) {
        if (n >= this.$n) this.$n = n;
        else throw new Error('新的值必须大于当前值');
      }
    };
    
    obj.next         // 5
    
    obj.next = 10;
    obj.next         // 10
    
    obj.next = 5;    // Uncaught Error: 新的值必须大于当前值

## 与属性描述对象相关的方法

### 1. Object.getOwnPropertyDescriptor()

`Object.getOwnPropertyDescriptor()` 可以获取某个属性的属性描述对象。它的第一个参数是对象，第二个参数是对象的某个属性名。返回的是该属性的属性描述对象。
    
    var obj = { p1: 'a',  p2: 'b'};
    
    Object.getOwnPropertyDescriptor(obj, 'p1')
    // { value: "a",
    //   writable: true,
    //   enumerable: true,
    //   configurable: true
    // }
        
只能用于对象自身的（非继承的）属性。继承的或不存在的属性返回 `undefined`。
   
    Object.getOwnPropertyDescriptor(obj, 'toString')   // undefined

### 2. Object.getOwnPropertyDescriptors()

`Object.getOwnPropertyDescriptors()` 可以获取参数对象的所有属性的属性描述对象。ES2017 引入标准。

    Object.getOwnPropertyDescriptors(obj)
    // { p1: {value: "a", writable: true, enumerable: true, configurable: true}
    //   p2: {value: "b", writable: true, enumerable: true, configurable: true}
    // }

### 3. Object.defineProperty()

`Object.defineProperty()` 方法允许通过属性描述对象，定义或修改一个属性，然后返回修改后的描述对象。

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

### 4. Object.defineProperties()

`Object.defineProperties()` 方法可以定义或修改多个属性。接受两个参数。

    var obj = Object.defineProperties({}, {
      p1: { value: 123, enumerable: true },
      p2: { value: 'abc', enumerable: true },
      p3: { get: function () { return this.p1 + this.p2 },
        enumerable:true,
        configurable:true
      }
    });
    
    obj.p1  // 123
    obj.p2  // "abc"
    obj.p3  // "123abc"

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
    
### 5. Object.prototype.propertyIsEnumerable()

实例对象的 `propertyIsEnumerable()` 方法返回一个布尔值，用来判断某个属性是否可枚举。

    var obj = {};
    obj.p = 123;
    
    obj.propertyIsEnumerable('p')           // true
    obj.propertyIsEnumerable('toString')    // false

注意，这个方法只能用于判断对象自身的属性，对于继承的属性一律返回 `false`。


参考链接：[JavaScript 教程 属性描述对象](https://wangdoc.com/javascript/stdlib/attributes.html)


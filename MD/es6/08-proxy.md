## Proxy 概述

Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，即“代理器”。

```js
let obj = new Proxy({}, {
  get: function (target, propKey, receiver) {
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function (target, propKey, value, receiver) {
    console.log(`setting ${propKey}!`);
    return Reflect.set(target, propKey, value, receiver);
  }
});
```

上面代码对一个空对象架设了一层拦截，重定义了属性的 `get` 和 `set` 方法。运行结果如下：

```js
obj.count = 1
//  setting count!
++obj.count
//  getting count!
//  setting count!
```

ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

```js
let proxy = new Proxy(target, handler);
```

`new Proxy()` 表示生成一个 Proxy 实例，`target` 参数表示所要拦截的目标对象，`handler` 参数也是一个对象，用来定制拦截行为。

注意，要使得 Proxy 起作用，必须针对 Proxy 实例进行操作，而不是针对目标对象进行操作。如果 `handler` 没有设置任何拦截，那就等同于直接通向原对象，也就是访问 Proxy 实例就等同于访问 `target`。

Proxy 实例也可以作为其他对象的原型对象。

```js
let proxy = new Proxy({}, {
  get: function(target, propKey) {
    return 35;
  }
});

let obj = Object.create(proxy);
obj.time // 35
```

## Proxy 支持的拦截方法

### 1. `get(target, propKey, receiver)`

`get()` 方法用于拦截某个属性的读取操作，如 `proxy.foo` 或 `proxy['foo']`。

其可接受三个参数，依次为目标对象、属性名和 proxy 实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选。

```js
function createArray(...elements) {
  let handler = {
    get(target, propKey, receiver) {
      let index = Number(propKey);
      if (index < 0) {
        propKey = String(target.length + index);
      }
      return Reflect.get(target, propKey, receiver);
    }
  };

  let target = [];
  target.push(...elements);
  return new Proxy(target, handler);
}

let arr = createArray('a', 'b', 'c');
arr[-1]  // c
```

`get` 方法也可以继承，当 proxy 实例被继承时，第三个参数 `receiver` 指向执行读操作的初始对象。

```js
const proxy = new Proxy({}, {
  get(target, key, receiver) {
    return receiver;
  }
})
proxy.getReceiver === proxy   // true

const d = Object.create(proxy);
d.a === d  // true
```

上面代码中，`getReceiver` 属性的读取是由 `proxy` 对象执行的，所以 `receiver` 指向 `proxy` 对象。而 `a` 属性的读取最初是由 `d` 对象执行的，所以 `receiver` 指向 `d` 对象。

如果一个属性不可配置（configurable）且不可写（writable），则 Proxy 不能修改该属性，否则通过 Proxy 对象访问该属性会报错。

```js
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: false,
    configurable: false
  },
});

const handler = {
  get(target, propKey) {
    return 'abc';
  }
};

const proxy = new Proxy(target, handler);

proxy.foo  // Uncaught TypeError
```

#### get 应用示例

实现函数链式调用：

```js
const operator = {
  double: n => n * 2,
  pow: n => n * n,
  reverseInt: n => n.toString().split("").reverse().join("")
}

const pipe = function (value) {
  let funcStack = [];
  let oproxy = new Proxy({} , {
    get : function (pipeObject, fnName) {
      if (fnName === 'get') {
        return funcStack.reduce(function (val, fn) {
          return fn(val);
        }, Math.floor(value));
      }
      funcStack.push(operator[fnName]);
      return oproxy;
    }
  });

  return oproxy;
}

pipe(6.76).double.pow.reverseInt.get // '441'
```

实现生成 DOM 节点的通用函数：

```js
const dom = new Proxy({}, {
  get(target, property) {
    return function(attrs = {}, ...children) {
      const el = document.createElement(property);
      for (let prop of Object.keys(attrs)) {
        el.setAttribute(prop, attrs[prop]);
      }
      for (let child of children) {
        if (typeof child === 'string') {
          child = document.createTextNode(child);
        }
        el.appendChild(child);
      }
      return el;
    }
  }
});

const el = dom.div({},
  'Hello, my name is ',
  dom.a({href: '/'}, 'Dora'),
  '. I like:',
  dom.ul({},
    dom.li({}, 'The web'),
    dom.li({}, 'Food'),
    dom.li({}, '…actually that\'s it')
  )
);

document.body.appendChild(el);
```

### 2. `set(target, propKey, value, receiver)` 

`set` 方法用来拦截某个属性的赋值操作，比如 `proxy.foo = v` 或 `proxy['foo'] = v`。

可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，其中最后一个参数可选。

`set` 代理应当返回 `true`。严格模式下，`set` 代理如果没有返回 `true`，就会报错。

```js
let validator = {
  set(target, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // 对于满足条件的 age 属性以及其他属性，直接保存
    target[prop] = value;
    return true;
  }
};

let person = new Proxy({}, validator);

person.age = 100;
person.age // 100

person.age = 'young' // 报错
person.age = 300 // 报错
```

注意，如果目标对象自身的某个属性不可写，那么 `set` 方法将不起作用。

```js
const obj = {};
Object.defineProperty(obj, 'foo', {
  value: 'bar',
  writable: false
});

const handler = {
  set(obj, prop, value, receiver) {
    obj[prop] = 'baz';
    return true;
  }
};

const proxy = new Proxy(obj, handler);
proxy.foo = 'baz';
proxy.foo // "bar"
```

#### set 应用示例

防止内部属性（通常以 `_` 开头）被外部读写：

```js
const handler = {
  get (target, key) {
    invariant(key, 'get');
    return target[key];
  },
  set (target, key, value) {
    invariant(key, 'set');
    target[key] = value;
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
const target = {};
const proxy = new Proxy(target, handler);
proxy._prop       // Error: Invalid attempt to get private "_prop" property
proxy._prop = 'c' // Error: Invalid attempt to set private "_prop" property
```

### 3. apply(target, object, args)

拦截 Proxy 实例作为函数调用以及调用 call 和 apply 的操作，比如 `proxy()`、`proxy.call()`、`proxy.apply()`。

接受三个参数，分别是目标对象、目标对象的上下文对象（this）和目标对象的参数数组。










### has(target, propKey)

拦截propKey in proxy的操作，返回一个布尔值。

### deleteProperty(target, propKey)

拦截delete proxy[propKey]的操作，返回一个布尔值。

### ownKeys(target)

拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。


### getOwnPropertyDescriptor(target, propKey)

拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。

### defineProperty(target, propKey, propDesc)

拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。


### preventExtensions(target)

拦截Object.preventExtensions(proxy)，返回一个布尔值。


### getPrototypeOf(target)

拦截Object.getPrototypeOf(proxy)，返回一个对象。


### isExtensible(target)

拦截Object.isExtensible(proxy)，返回一个布尔值。


### setPrototypeOf(target, proto)

拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。


### construct(target, args)

拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。









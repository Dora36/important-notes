## 构造函数

构造函数，就是专门用来生成实例对象的函数。一个构造函数，可以生成多个实例对象，这些实例对象都有相同的结构。

```javascript
function Person(name){
    this.name = name;
}
```

为了与普通函数区别，构造函数名字的第一个字母通常大写。

构造函数的特点有两个：

- 函数体内部使用了 `this` 关键字，代表了所要生成的对象实例。
- 生成对象的时候，必须使用 `new` 命令。

## new 命令

### 基本用法

`new` 命令的作用，就是执行构造函数，返回一个实例对象。

```javascript
let a = new Person('dora');
a.name      // dora
```

`new` 命令本身就可以执行构造函数，所以后面的构造函数可以带括号，也可以不带括号，但为了表明是函数调用，推荐使用括号表示更明确的语义。

### new 命令的原理

使用 `new` 命令时，它后面的函数依次执行下面的步骤：

1. 创建一个空对象，作为将要返回的对象实例。`let o = new Object();`
2. 将这个空对象的原型，指向构造函数的prototype属性。 `Object.setPrototypeOf(o,Foo.prototype);`
3. 将构造函数的 this 绑定到新创建的空对象上。`Foo.call(o);`
4. 始执行构造函数内部的代码。

如果构造函数内部有 `return` 语句，而且后面跟着一个对象，则 `new` 命令会返回 `return` 语句指定的对象；否则，就会不管 `return` 语句，返回 `this` 对象，且不会执行 `return` 后面的语句。

```javascript
function Person(name) {
  this.name = name;
  if (name == undefined) {
    return {};
  }else if(typeof name != 'string'){
    return '姓名有误';
  }
  console.log(111);
}

new Person();        //  {}
new Person(123);     //  {name: 123}

new Person('dora');  
// {name:'dora'}
// 111
```

### new.target

如果当前函数是 `new` 命令调用的，在函数内部的 `new.target` 属性指向当前函数，否则为 `undefined`。

```javascript
function F() {
  console.log(new.target === F);
}

F()       // false
new F()   // true
```

使用这个属性，可以判断函数调用时，是否使用了 `new` 命令。

```javascript
function F() {
  if (!new.target) {
    throw new Error('请使用 new 命令调用！');
  }
}

F()       // false
new F()   // true
```

#### 强制使用 new 命令

如果不使用 `new` 命令执行构造函数就会引发一些意想不到的结果，所以为了保证构造函数必须与 `new` 命令一起使用，除了 `new.target` 之外也可以有以下两个解决办法。

#### 1. 构造函数内部使用严格模式

在构造函数内部第一行加上 `use strict`。这样的话，一旦忘了使用 `new` 命令，直接调用构造函数就会报错。

```javascript
function Person(name, age){
  'use strict';
  this.name = name;
  this.age = age;
}

Person()
//  TypeError: Cannot set property 'name' of undefined
```

报错原因是因为不加 `new` 调用构造函数时，`this` 指向全局对象，而严格模式下，`this` 不能指向全局对象，默认等于 `undefined`，给 `undefined` 添加属性肯定会报错。

#### 2. 在构造函数内部通过 instanceof 判断是否使用 new 命令

```javascript
function Person(name, age) {
  if (!(this instanceof Person)) {
    return new Person(name, age);
  }

  this.name = name;
  this.age = age;
}

Person('dora', 18).name          // dora
(new Person('dora', 18)).age     // 18
```

在构造函数内部判断 `this` 是否是构造函数的实例，如果不是，则直接返回一个实例对象。

## prototype 原型

任何函数都有一个 `prototype` 属性，这个属性称为函数的“原型”，属性值是一个对象。**只有函数有原型属性**。

```javascript
function f(){}
typeof f.prototype    // "object"
```

对于普通函数来说，原型没有什么用。但对于构造函数来说，通过 `new` 生成实例的时候，该属性会自动成为实例对象的原型对象。

### prototype 属性的作用

**用来定义所有实例对象共用的属性和方法。**

如果将对象的方法写入构造函数中，则 `new` 多少个实例，方法将会被复制多少次，虽然复制出来的函数是一样的，但分别指向不同的引用地址，不利于函数的复用。

```javascript
function Person(){
  this.name = function(){
      console.log('dora');
  }
}
let p1 = new Person();
let p2 = new Person();

p1.name === p2.name     // false
```

因此，将所有的属性都定义在构造函数里，所有的方法都定义在构造函数的原型中。这样，实例的方法都指向同一个引用地址，内存消耗小很多。

### constructor 属性

函数原型 `prototype` 对象的属性，指向这个原型所在的构造函数，可以被所有实例对象继承，指向构造自己的构造函数。

```javascript
Person.prototype.constructor.name   //  "Person"
p1.constructor.name                 //  "Person"
```
函数的 `name` 属性返回函数名。

### 给 prototype 添加属性

#### 1. 点语法追加属性

```javascript
Person.prototype.sayHi = function(){
    console.log('Hi,I am Dora');
}
```

#### 2. 覆盖原型对象

```javascript
Person.prototype = {
  sayHi: function(){
      console.log('Hi,I am Dora');
  }
}
```

这样用对象字面量直接覆盖，会让 `constructor` 与构造函数失联，可以手动补上这个属性。

```javascript
Person.prototype = {
  constructor: Person,
  sayHi: function(){
      console.log('Hi,I am Dora');
  }
}
```

#### 3. 通过 object.assign 添加

```javascript
Object.assign(Person.prototype, {
  sayHi: function(){}
})
```

定义构造函数原型中的方法时尽量不要相互嵌套，各方法最好相互独立。

## \__proto__ 原型对象

任何一个对象都有 `__proto__` 属性，这个属性称为对象的“原型对象”，一个对象的原型对象就是它的构造函数的 `prototype`。

```javascript
function Person(){}
let p1 = new Person();

p1.__proto__ === Person.prototype  // true
```

### Object.getPrototypeOf(obj)

`__proto__` 并不是语言本身的属性，这是各大浏览器厂商添加的私有属性，虽然目前很多浏览器都可以识别这个属性，但依旧不建议在生产环境下使用，避免对环境产生依赖。

生产环境下，我们可以使用 `Object.getPrototypeOf(obj)` 方法来获取参数对象的原型。

```javascript
Object.getPrototypeOf(p1) === Person.prototype   // true
```

## 原型链机制

当访问对象的属性时，如果这个对象没有这个属性，系统就会查找这个对象的 `__proto__` 原型对象，原型对象也是个对象，也有自己的  `__proto__` 原型对象，然后就会按照这个原型链依次往上查找，直到原型链的终点 `Object.prototype`。

`Object()` 是系统内置的构造函数，用来创建对象的， `Object.prototype` 是所有对象的原型链顶端，而`Object.prototype` 的原型对象是 `null`。

```javascript
Object.getPrototypeOf(Object.prototype) // null
```

如果对象自身和它的原型都定义了一个同名属性，那么优先读取对象自身的属性。

## 继承

继承的核心是 子类构造函数的原型是父类构造函数的一个实例对象。

**首先继承父类的属性**

```javascript
// 1. 父类构造函数
function Super(data){
  this.data = data;
};
Super.prototype.funName = function(){};

// 2. 子类构造函数
function Sub(){
  // 用来继承父类的参数和属性
  Super.apply(this, arguments);
}
```

**其次继承父类的方法**

1. 整体继承

    ```javascript
    Sub.prototype = Object.create(Super.prototype);

    // or

    Sub.prototype = new Super();
    ```

2. 单个方法的继承

    ```javascript
    Sub.prototype.funName = function(){
      Super.prototype.funName.call(this);
      // some other code
    }
    ```

**最后需要改变 constructor 指向**

此时子类实例的 `constructor` 指向父类构造函数 `Super`，需手动改变。

```javascript
Sub.prototype.constructor = Sub;
```

### 多重继承

ES5 没有多重继承功能，即不允许一个对象同时继承多个对象，但可通过变通方法实现这个功能。

```javascript
function S(){
  M1.call(this);
  M2.call(this);
};
S.prototype = Object.create(M1.prototype); // 继承 M1
Object.assign(S.prototype,M2.prototype);   // 继承链上加入 M2
S.prototype.constructor = S;               // 指定构造函数。
```

## 实例验证

### instanceof 运算符

`instanceof` 运算符返回一个布尔值，表示对象是否为某个构造函数的实例。继承的子类实例也是父类的实例，因此继承的也为 `true`。

```javascript
let d = new Date();
d instanceof Date    // true
d instanceof Object  // true
```

### Object.prototype.isPrototypeOf()

实例对象可继承 `isProtorypeOf()`方法，用来判断该对象是否为参数对象的原型对象。

只要实例对象处在参数对象的原型链上，`isPrototypeOf()` 方法都返回 `true`。

```javascript
let o1 = {};
let o2 = Object.create(o1);
let o3 = Object.create(o2);

o2.isPrototypeOf(o3)   // true
o1.isPrototypeOf(o3)   // true
o2.isPrototypeOf(o2)   // false
```

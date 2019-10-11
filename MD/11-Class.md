## Class 类基本用法

`Class` 类完全可以看作构造函数的另一种写法，类的数据类型其实就是函数，类本身也就是其实例的构造函数。使用的时候也是使用 `new` 命令。

```javascript
class Person {
  constructor(name,age) {
    this.name = name;
    this.age = age;
  }

  getName(){
    console.log(`My name is ${this.name}!`)
  }

  static sayHi() {
    console.log('Hi');
  }
}

let p = new Person();

typeof Person          // "function"
p instanceof Person    // true
```

### constructor 方法

`constructor` 方法就是类的构造方法，`this` 关键字代表实例对象。其对应的也就是 ES5 的构造函数 `Person`。

`constructor` 方法是类的默认方法，通过 `new` 命令生成对象实例时，会自动调用该方法。一个类必须有 `constructor` 方法，如果没有显式定义，会默认添加一个空的 `constructor` 方法。

```javascript
class Person {}

Person.prototype    //  {construtor:f}
```

`constructor` 方法默认返回实例对象，也完全可以 `return` 另外一个对象。

```javascript
class Foo {
  constructor(){
    return Object.create(null);
  } 
}

new Foo() instanceof Foo      // false
```

类必须使用 `new` 调用，也就是 `constructor` 方法只能通过 `new` 命令执行，否则会报错。

```javascript
class Foo {
  constructor(){} 
}

Foo()   // TypeError: Class constructor Foo cannot be invoked without 'new'
```

### Class 的自定义方法

`Class` 类依旧存在 `prototype` 属性，且类的所有方法都定义在 `prototype` 属性上面。

```javascript
class Person {
  constructor() {}
  aaa(){}
  bbb(){}
}

Object.getOwnPropertyNames(Person.prototype)   // ["constructor", "aaa", "bbb"]
```

`prototype` 对象的 `constructor` 属性，也是直接指向类本身。

```javascript
Person.prototype.constructor === Person  // true
p.constructor === Person                 // true
```

类的新方法可通过 `Object.assign` 向 `prototype` 一次性添加多个。

```javascript
class Person {
  constructor() {}
}

Object.assign(Person.prototype, {
  aaa(){},
  bbb(){}
})
```

注意，定义类的时候，前面不需要加上 `function` 关键字，也不需要逗号分隔。

与 ES5 构造函数的不同的是，`Class` 内部所有定义的方法，都是不可枚举的。

```javascript
class Person {
  constructor() {}
  aaa(){}
}

Object.keys(Person.prototype)                  // []
Object.getOwnPropertyNames(Person.prototype)   // ["constructor", "aaa"]
```

而 ES5 的构造函数的 `prototype` 原型定义的方法是可枚举的。

```javascript
let Person = function(){};
Person.prototype.aaa = function(){};

Object.keys(Person.prototype)                  // ["aaa"]
Object.getOwnPropertyNames(Person.prototype)   // ["constructor", "aaa"]
```

**Class 类的属性名，可以采用表达式。**

```javascript
let methodName = 'getName';

class Person {
  constructor() {}
  [methodName](){}
}

Object.getOwnPropertyNames(Person.prototype)   // ["constructor", "getName"]
```

### 取值函数 getter 和存值函数 setter

与 ES5 一样，在 `Class` 内部可以使用 `get` 和 `set` 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

```javascript
class Person {
  constructor() {
    this.name = 'dora';
  }
  get author() {
    return this.name;
  }
  set author(value) {
    this.name = this.name + value;
    console.log(this.name);
  }
}

let p = new Person();
p.author          //  dora
p.author = 666;   // dora666
```

且其中 `author` 属性定义在 `Person.prototype` 上，但 `get` 和 `set` 函数是设置在 `author` 属性描述对象 `Descriptor` 上的。

```javascript
Object.getOwnPropertyNames(Person.prototype)   // ["constructor", "author"]

Object.getOwnPropertyDescriptor(Person.prototype,'author')
// { get: ƒ author()(),
//   set: ƒ author()(value),
//   ...
// }
```

### Class 的 static 静态方法

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。但如果在一个方法前，加上 `static` 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

```javascript
class Person {
  static sayHi() {
    console.log('Hi');
  }
}

Person.sayHi()      // "Hi"

let p = new Person();
p.sayHi()           // TypeError: p.sayHi is not a function
```

如果静态方法包含 `this` 关键字，这个 `this` 指的是类，而不是实例。静态方法可以与非静态方法重名。

```javascript
class Person {
  static sayHi() {
    this.hi();
  }

  static hi(){
    console.log('hello')
  }

  hi(){
    console.log('world')
  }
}

Person.sayHi()      // "hello"
```

### 实例属性的另一种写法

实例属性除了定义在 `constructor()` 方法里面的 `this` 上面，也可以定义在类的最顶层。此时定义的时候，属性前面不需要加上 `this`。而在类内部其它地方调用的时候，需要加上 `this`。

```javascript
class Person {
  name = 'dora';
  getName() {
    return this.name;
  }
}

let p = new Person();
p.name           // "dora"
Object.keys(p)   // ["name"]
```

这种写法的好处是，所有实例对象自身的属性都定义在类的头部，看上去比较整齐，写法简洁，一眼就能看出这个类有哪些实例属性。


## Class 的继承

`Class` 子类可以通过 `extends` 关键字实现继承。

```javascript
class Person {
  constructor() {}
  sayHi() {
    return 'Hi';
  }
}

class Teacher extends Person {
  constructor() {
    super();
  }
}

let t = new Teacher();
t.sayHi();   // "Hi"
```

### 子类的 constructor

子类必须在 `constructor` 方法中调用 `super()` 方法，否则新建实例时会报错。

如果子类没有定义 `constructor` 方法，这个方法会被默认添加，且子类默认添加的 `constructor` 方法都会默认执行 `super()` 方法。

```javascript
class Teacher extends Person {
}

let t = new Teacher();
t.sayHi();   // "Hi"
```

等同于

```javascript
class Teacher extends Person {
  constructor(...args) {
    super(...args);
  }
}
```

### super 关键字

`super` 这个关键字，既可以当作函数使用，也可以当作对象使用。用法完全不同。

#### super() 方法

`super` 作为函数调用时，代表父类的构造函数。子类的构造函数必须执行一次 `super()` 方法。

因为 ES6 的继承机制与 ES5 构造函数不同，ES6 的子类实例对象 `this` 必须先通过父类的构造函数创建，得到与父类同样的实例属性和方法后再添加子类自己的实例属性和方法。因此如果不调用 `super()` 方法，子类就得不到 `this` 对象。

`super` 虽然代表了父类的构造函数，但返回的是子类的实例，即通过`super` 执行父类构造函数时，`this` 指的都是子类的实例。也就是  `super()` 相当于 `Person.call(this)`。

```javascript
class A {
  constructor() {
    console.log(this.constructor.name)
  }
}

class B extends A {
  constructor() {
    super();
  }
}

new A()       // A
new B()       // B
```

作为函数时，`super()` 只能在子类的构造函数之中，用在其他地方就会报错。

#### super 对象

**在普通方法中指向父类的 `prototype` 原型**

`super` 作为对象时，在普通方法中，指向父类的 `prototype` 原型，因此不在原型 `prototype` 上的属性和方法不可以通过 `super` 调用。

```javascript
class A {
  constructor() {
    this.a = 3;
  }
  p() {return 2;}
}
A.prototype.m = 6;

class B extends A {
  constructor() {
    super();
    console.log(super.a);    // undefined
    console.log(super.p());  // 2
    console.log(super.m);    // 6
  }
}

new B();
```

在子类普通方法中通过 `super` 调用父类方法时，方法内部的 `this` 指向当前的子类实例。

```javascript
class A {
  constructor() {
    this.x = 'a';
  }
  aX() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 'b';
  }
  bX() {
    super.aX();
  }
}

(new B()).bX()    // 'b'
```

**在静态方法中，指向父类**

```javascript
class A {
 static m(msg) {
   console.log('static', msg);
 }
 m(msg) {
   console.log('instance', msg);
 }
}

class B extends A {
  static m(msg) {
    super.m(msg);
  }
  m(msg) {
    super.m(msg);
  }
}

B.m(1);          // "static" 1
(new B()).m(2)   // "instance" 2
```

在子类静态方法中通过 `super` 调用父类方法时，方法内部的 `this` 指向当前的子类，而不是子类的实例。

#### 任意对象的 super

由于对象总是继承其它对象的，所以可以在任意一个对象中，使用 `super` 关键字，指向的是该对象的构造函数的 `prototype` 原型。

```javascript
let obj = {
  m() {
    return super.constructor.name;
  }
};
obj.m();    // Object
```

注意，使用 `super` 的时候，必须显式的指定是作为函数还是作为对象使用，否则会报错。

```javascript
class B extends A {
  m() {
    console.log(super);
  }
}
// SyntaxError: 'super' keyword unexpected here
```

### 静态方法的继承

父类的静态方法，可以被子类继承。

```javascript
class Person {
  static sayHi() {
    return 'hello';
  }
}

class Teacher extends Person {
}

Teacher.sayHi()      // "hello"
```

在子类的 `static` 内部，可以从 `super` 对象上调用父类的静态方法。

```javascript
class Teacher extends Person {
  static sayHi() {
    super.sayHi();
  }
}

Teacher.sayHi()      // "hello"
```

### new.target 属性

`Class` 内部调用 `new.target`，返回当前 `Class`。且子类继承父类时，`new.target` 会返回子类。因此利用这个特点，可以写出不能独立使用必须继承后才能使用的类。

```javascript
class Shape {
  constructor() {
    if(new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    console.log('ok');
  }
}

let s = new Shape();      // 报错
let cir = new Circle(6);  // 'ok'
```

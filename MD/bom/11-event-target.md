## EventTarget 接口

事件的本质是程序各个组成部分之间的一种通信方式，也是异步编程的一种实现。DOM 支持大量的事件。

DOM 的事件操作（监听和触发），都定义在 EventTarget 接口。所有节点对象都部署了这个接口，其他一些需要事件通信的浏览器内置对象（比如，XMLHttpRequest、AudioNode、AudioContext）也部署了这个接口。

该接口主要提供三个实例方法：

- `addEventListener`：绑定事件的监听函数
- `removeEventListener`：移除事件的监听函数
- `dispatchEvent`：触发事件

### addEventListener

用于在当前节点或对象上，定义一个特定事件的监听函数。一旦这个事件发生，就会执行监听函数。该方法没有返回值。

```js
target.addEventListener(type, listener[, useCapture]);
```

该方法接受三个参数：

- `type`：事件名称，大小写敏感。
- `listener`：监听函数。事件发生时，会调用该监听函数。
- `useCapture`：布尔值，表示监听函数是否在捕获阶段（capture）触发，默认为 `false`（监听函数**只在冒泡阶段**被触发）。该参数可选。

`addEventListener` 方法可以为针对当前对象的同一个事件，添加多个不同的监听函数。这些函数按照添加顺序触发，即先添加先触发。如果为同一个事件多次添加同一个监听函数，该函数只会执行一次，多余的添加将自动被去除（不必使用 `removeEventListener` 方法手动去除）。

如果希望向监听函数传递参数，可以用匿名函数包装一下监听函数。

```js
function print(x) {
  console.log(x);
}

let el = document.getElementById('div1');
el.addEventListener('click', function () { print('Hello'); }, false);
```

监听函数内部的 `this`，指向当前事件所在的那个对象。

### removeEventListener()

`removeEventListener` 方法用来移除 `addEventListener` 方法添加的事件监听函数。该方法没有返回值。

`removeEventListener` 方法的参数，与 `addEventListener` 方法完全一致。注意，`removeEventListener` 方法移除的监听函数，必须是 `addEventListener` 方法添加的那个监听函数，而且必须在同一个元素节点，否则无效。匿名函数不是同一个监听函数。

### dispatchEvent()

`dispatchEvent` 方法在当前节点上触发指定事件，从而触发监听函数的执行。该方法返回一个布尔值，只要有一个监听函数调用了 `Event.preventDefault()`，则返回值为 `false`，否则为 `true`。

`dispatchEvent` 方法的参数是一个 `Event` 对象的实例。

```js
para.addEventListener('click', hello, false);
let event = new Event('click');
para.dispatchEvent(event);
```

## 浏览器事件模型

浏览器的事件模型，就是通过监听函数（listener）对事件做出反应。事件发生后，浏览器监听到了这个事件，就会执行对应的监听函数。这是事件驱动编程模式（event-driven）的主要编程方式。

### 事件绑定的三种方法

**1. HTML 的 on- 属性**：使用这个方法指定的监听代码，只会在冒泡阶段触发

HTML 语言允许在元素的属性中，直接定义某些事件的监听代码。注意，这些属性的值是将会执行的代码，而不是一个函数。因此如果要执行函数，要加上圆括号。

```html
<body onload="doSomething()">
<div onclick="console.log('触发事件')">
```

**2. 元素节点的事件属性**：也是只会在冒泡阶段触发

```js
window.onload = doSomething;

div.onclick = function (event) {
  console.log('触发事件');
};
```

**3. addEventListener()**：可指定触发阶段

#### 三种方法的优缺点

第一种 HTML 的 on- 属性，违反了 HTML 与 JavaScript 代码相分离的原则，将两者写在一起，不利于代码分工，不推荐使用。

第二种元素节点的事件属性的缺点在于，同一个事件只能定义一个监听函数，也就是说，如果定义两次 `onclick` 属性，后一次定义会覆盖前一次。因此，也不推荐使用。

第三种 `addEventListener` 是推荐的指定监听函数的方法。它有如下优点：

- 同一个事件可以添加多个监听函数。
- 能够指定在哪个阶段（捕获阶段还是冒泡阶段）触发监听函数。
- 除了 DOM 节点，其他对象（比如 `window`、`XMLHttpRequest` 等）也有这个接口，它等于是整个 JavaScript 统一的监听函数接口。

### 事件的传播阶段

一个事件发生后，会在子元素和父元素之间传播（propagation）。这种传播分成三个阶段。

- 捕获阶段：capture phase，事件从 document 一直向下传播到目标元素，依次检查经过的节点是否绑定了事件监听函数，如果有则执行。
- 目标阶段：target phase，事件到达目标元素, 触发目标元素的监听函数。目标元素就是点击位置嵌套最深的那个节点。
- 冒泡阶段：bubbling phase，事件从目标元素冒泡到 document，依次检查经过的节点是否绑定了事件监听函数，如果有则执行。

这种三阶段的传播模型，使得同一个事件会在多个节点上触发。

```js
// Html
// <div> <p>点击</p> </div>
var phases = {
  1: 'capture',
  2: 'target',
  3: 'bubble'
};

var div = document.querySelector('div');
var p = document.querySelector('p');

div.addEventListener('click', callback, true);
p.addEventListener('click', callback, true);
div.addEventListener('click', callback, false);
p.addEventListener('click', callback, false);

function callback(event) {
  var tag = event.currentTarget.tagName;
  var phase = phases[event.eventPhase];
  console.log("Tag: '" + tag + "'. EventPhase: '" + phase + "'");
}

// 点击以后的结果
// Tag: 'DIV'. EventPhase: 'capture'
// Tag: 'P'. EventPhase: 'target'
// Tag: 'P'. EventPhase: 'target'
// Tag: 'DIV'. EventPhase: 'bubble'
```

浏览器总是假定 `click` 事件的目标节点，就是点击位置嵌套最深的那个节点，也就是没有子元素的节点。所以，最终节点的捕获阶段和冒泡阶段，都会显示为 `target` 阶段，也就是 `<p>` 节点的捕获阶段和冒泡阶段的监听函数，都会显示为 `target` 阶段。。

事件传播的最上层对象是 `window`，接着依次是 `document`，`html`（`document.documentElement`）和 `body`（`document.body`）。

### 事件的代理

由于事件会在冒泡阶段向上传播到父节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件。这种方法叫做事件的代理（delegation）。

```js
let ul = document.querySelector('ul');

ul.addEventListener('click', function (event) {
  if (event.target.tagName.toLowerCase() === 'li') {
    // some code
  }
});
```

上面代码中，`click` 事件的监听函数定义在 `<ul>` 节点，但是实际上，它处理的是子节点 `<li>` 的 `click` 事件。这样做的好处是，只要定义一个监听函数，就能处理多个子节点的事件，而不用在每个 `<li>` 节点上定义监听函数。而且之后再通过 js 动态添加新的子节点，监听函数依然有效。

## Event 对象

事件发生以后，会产生一个事件对象，作为参数传给监听函数。浏览器原生提供一个 `Event` 对象，所有的事件都是这个对象的实例，或者说继承了 `Event.prototype` 对象。

Event 对象本身就是一个构造函数，可以用来生成新的实例。

```js
let event = new Event(type, options);
```

Event 构造函数接受两个参数。第一个参数 `type` 是字符串，表示事件的名称；第二个参数 `options` 是一个对象，表示事件对象的配置。该对象主要有下面两个属性。

- `bubbles`：布尔值，可选，默认为 `false`，表示事件对象是否冒泡。如果不设置，生成的事件就只能在“捕获阶段”触发监听函数。
- `cancelable`：布尔值，可选，默认为 `false`，表示事件是否可以被取消，即能否用 `Event.preventDefault()` 取消这个事件。一旦事件被取消，就好像从来没有发生过，不会触发浏览器对该事件的默认行为。

```js
// HTML 代码为
// <div><p>Hello</p></div>
let div = document.querySelector('div');
let p = document.querySelector('p');

function callback(event) {
  let tag = event.currentTarget.tagName;
  console.log('Tag: ' + tag); // 没有任何输出
}

div.addEventListener('click', callback, false);

let click = new Event('click');
p.dispatchEvent(click);
```

`div` 的事件监听的是冒泡阶段，`p` 触发的事件不能冒泡，只能在捕获阶段才能触发监听函数，因此事件没触发。

而如果这个事件在 div 元素上触发：

```js
div.dispatchEvent(click);
```

那么，不管 `div` 元素是在冒泡阶段监听，还是在捕获阶段监听，都会触发监听函数。因为这时 `div` 元素是事件的目标，不存在是否冒泡的问题，`div` 元素总是会接收到事件，因此监听函数生效。

### Event 对象的属性

#### Event.currentTarget 和 Event.target

事件发生以后，会经过捕获和冒泡两个阶段，依次通过多个 DOM 节点。因此，任意事件都有两个与事件相关的节点，一个是事件的原始触发节点（`target`），另一个是事件当前正在通过的节点（`currentTarget`）。前者通常是后者的后代节点。

`Event.currentTarget` 属性返回事件当前所在的节点，即事件当前正在通过的节点，也就是当前正在执行的监听函数所在的那个节点。随着事件的传播，这个属性的值会变。由于监听函数只有事件经过时才会触发，所以 `currentTarget` 总是等同于监听函数内部的 `this`。

`Event.target` 属性返回原始触发事件的那个节点，即事件最初发生的节点。这个属性不会随着事件的传播而改变。

#### Event.eventPhase

`Event.eventPhase` 属性返回一个整数常量，表示事件目前所处的阶段。该属性只读。返回值有四种可能：

- 0，事件目前没有发生。
- 1，事件目前处于捕获阶段，即处于从祖先节点向目标节点的传播过程中。
- 2，事件到达目标节点，即 `Event.target` 属性指向的那个节点。
- 3，事件处于冒泡阶段，即处于从目标节点向祖先节点的反向传播过程中。

### Event 对象的方法

#### Event.preventDefault()

`preventDefault` 方法取消浏览器对当前事件的默认行为。比如点击链接后，浏览器默认会跳转到另一个页面，使用这个方法以后，就不会跳转了；再比如，按一下空格键，页面向下滚动一段距离，使用这个方法以后也不会滚动了。该方法生效的前提是，事件对象的 `cancelable` 属性为 `true`，如果为 `false`，调用该方法没有任何效果。

大多数浏览器的原生事件是可以取消的。但是 Event 构造函数生成的事件，除非显式声明，重置 `cancelable` 属性的值，否则默认是不可以取消的。因此对于 Event 构造函数自定义的事件，使用这个方法之前，最好用 `Event.cancelable` 属性判断一下是否可以取消。

```js
function preventEvent(event) {
  if (event.cancelable) {
    event.preventDefault();
  } else {
    console.warn('This event couldn\'t be canceled.');
    console.dir(event);
  }
}
```

注意，该方法只是取消事件对当前元素的默认影响，不会阻止事件的传播。如果要阻止传播，可以使用 `stopPropagation()` 或 `stopImmediatePropagation()` 方法。

#### Event.stopPropagation()

`stopPropagation` 方法用于阻止事件在 DOM 中继续传播，防止再触发定义在别的节点上的监听函数，但是不包括在当前节点上其他的事件监听函数。

```js
// 事件传播到 p 元素后，就不再向 p 的子元素传播了
p.addEventListener('click', function (event) {
  event.stopPropagation();
}, true);

// 事件冒泡到 p 元素后，就不再向 p 的父节点冒泡了
p.addEventListener('click', function (event) {
  event.stopPropagation();
}, false);
```

#### Event.stopImmediatePropagation()

如果同一个节点对于同一个事件指定了多个监听函数，这些函数会根据添加的顺序依次调用。只要其中有一个监听函数调用了 `Event.stopImmediatePropagation` 方法，其他的监听函数就不会再执行了。

该方法不但可阻止同一个事件的其他监听函数被调用，而且也会阻止事件的继续传播。

```js
p.addEventListener('click', function (event) {
  event.stopImmediatePropagation();
  console.log(1);
});

p.addEventListener('click', function(event) {
  // 不会被触发
  console.log(2);
});

div.addEventListener('click', function (event) {
  // 不会被触发
  console.log(3);
});
```

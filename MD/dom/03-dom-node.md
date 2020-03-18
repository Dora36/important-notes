## Document 节点

`document` 节点对象代表整个文档，每张网页都有自己的 `document` 对象。

`window.document` 属性就指向这个对象。只要浏览器开始载入 HTML 文档，该对象就存在了，可以直接使用。

### 获取 document 对象

- 正常的网页，直接使用 `document` 或 `window.document`。

- `iframe` 框架里面的网页，使用 `iframe` 节点的 contentDocument 属性。

- Ajax 操作返回的文档，使用 `XMLHttpRequest` 对象的 `responseXML` 属性。

- 内部节点的 `ownerDocument` 属性，获取当前节点所在的顶层文档对象，即 `document` 对象。

`document` 对象继承了 `EventTarget` 接口和 `Node` 接口，并且混入（mixin）了 `ParentNode` 接口。这意味着，这些接口的方法都可以在 `document` 对象上调用。除此之外，`document` 对象还有很多自己的属性和方法。

## 属性 `document.`

### 快捷方式属性

以下属性是指向文档内部的某个节点的快捷方式。

- `defaultView`：返回 `document` 对象所属的 `window` 对象。如果当前文档不属于 `window` 对象，该属性返回 `null`。

- `doctype`：指向 `<DOCTYPE>` 节点，即文档类型（DTD）节点。HTML 的文档类型节点，一般写成 `<!DOCTYPE html>`。如果网页没有声明 DTD，该属性返回 `null`。 `document.firstChild === document.doctype`

- `documentElement`：返回当前文档的根元素节点（root）。它通常是 `document` 节点的第二个子节点，紧跟在 `document.doctype` 节点后面。HTML 网页的该属性，一般是 `<html>` 节点。

- `body` && `head`：`document.body` 属性指向 `<body>` 节点，`document.head` 属性指向 `<head>` 节点。这两个属性总是存在的，如果网页源码里面省略了 `<head>` 或 `<body>`，浏览器会自动创建。另外，这两个属性是可写的，如果改写它们的值，相当于移除所有子节点。

- `scrollingElement`：返回文档的滚动元素。

- `activeElement`：返回获得当前焦点的元素。通常，这个属性返回的是 `<input>`、`<textarea>`、`<select>` 等表单元素，如果当前没有焦点元素，返回 `<body>` 元素或 `null`。

- `fullscreenElement`：返回当前以全屏状态展示的元素。如果不是全屏状态，该属性返回 `null`。

### 节点集合属性

返回一个 `HTMLCollection` 实例，表示文档内部特定元素的集合。这些集合都是动态的，原节点有任何变化，立刻会反映在集合中。

- `links`：返回当前文档所有设定了 `href` 属性的 `<a>` 及 `<area>` 节点。

- `forms`：返回所有 `<form>` 表单节点。可以通过点语法调用 `id` 属性和 `name` 属性来引用表单。

- `images`：返回页面所有 `<img>` 图片节点。

- `scripts`：返回所有 `<script>` 节点。

- `styleSheets`：返回文档内嵌或引入的样式表集合

除了 `document.styleSheets`，以上的集合属性返回的都是 `HTMLCollection` 实例。`HTMLCollection` 实例是类数组的对象，所以这些属性都有 `length` 属性，都可以使用方括号运算符引用成员。如果成员有 `id` 或 `name` 属性，还可以用这两个属性的值，在 `HTMLCollection` 实例上引用到这个成员。

```js
// HTML 代码如下
// <form name="foo" id="bar"></form>

document.forms[0] === document.forms.foo   // true
document.forms.bar === document.forms.foo  // true
document.foo === document.forms.foo        // true
```

### 文档静态信息属性

以下属性返回文档信息。

- `documentURI` && `URL`：`document.documentURI` 属性和 `document.URL` 属性都返回一个字符串，表示当前文档的网址。不同之处是它们继承自不同的接口，`documentURI` 继承自 `Document` 接口，可用于所有文档；`URL` 继承自 `HTMLDocument` 接口，只能用于 HTML 文档。如果文档的锚点（`#anchor`）变化，这两个属性都会跟着变化。

- `domain`：返回当前文档的域名，不包含协议和端口。如果无法获取域名，该属性返回 `null`。

- `location`：`document.location` 属性即 `window.location`，是浏览器提供的原生 `Location` 对象，提供 `URL` 相关的信息和操作方法。

- `lastModified`：返回一个字符串，表示当前文档最后修改的时间。不同浏览器的返回值，日期格式是不一样的。

- `title`：返回当前文档的标题。默认情况下，返回 `<title>` 节点的值。但是该属性是可写的，一旦被修改，就返回修改后的值。

- `characterSet`：返回当前文档的编码，比如UTF-8、ISO-8859-1等等。

- `referrer`：返回一个字符串，表示当前文档的访问者来自哪里。如果无法获取来源，或者用户直接键入网址而不是从其他网页点击进入，返回一个空字符串。

- `dir`：返回一个字符串，表示文字方向。

- `compatMode`：返回浏览器处理文档的模式，可能的值为 `BackCompat`（向后兼容模式）和 `CSS1Compat`（严格模式）。一般来说，如果网页代码的第一行设置了明确的 DOCTYPE（比如 `<!doctype html>`），`document.compatMode` 的值都为 `CSS1Compat`。

### 文档状态属性

- `hidden`：返回一个布尔值，表示当前页面是否可见。如果窗口最小化、浏览器切换了 Tab，都会导致导致页面不可见，使得 `document.hidden` 返回 `true`。

- `visibilityState`：返回文档的可见状态。值有四种可能：`visible`、`hidden`、`prerender`、`unloaded`。

- `readyState`：返回当前文档的状态。共有三种可能的值：`loading`、`interactive`（加载外部资源阶段）、`complete`。

- `cookie`：用来操作浏览器 Cookie。

## 方法 `document.`

### 获取元素

- `querySelector()`：接受一个 CSS 选择器作为参数，返回匹配该选择器的元素节点。如果有多个节点满足匹配条件，则返回第一个匹配的节点。如果没有发现匹配的节点，则返回 `null`。

- `querySelectorAll()`：方法与 `querySelector` 用法类似，区别是返回一个 `NodeList` 对象，包含所有匹配给定选择器的节点。这两个方法除了定义在 `document` 对象上，还定义在元素节点上，即在元素节点上也可以调用。

- `getElementById()`：返回匹配指定 `id` 属性的元素节点。如果没有发现匹配的节点，则返回 `null`。`document.getElementById('xxx')` 比 `document.querySelector('#xxx')` 效率高很多。这个方法只能在 `document` 对象上使用，**不能** 在其他元素节点上使用。

- `getElementsByTagName()`：搜索 HTML 标签名，返回符合条件的元素。它的返回值是一个类似数组对象（ `HTMLCollection` 实例），可以实时反映 HTML 文档的变化。如果没有任何匹配的元素，就返回一个空集。元素节点上也可以调用。

- `getElementsByClassName()`：返回一个类似数组的对象（ `HTMLCollection` 实例），包括了所有 `class` 名字符合指定条件的元素，元素的变化实时反映在返回结果中。元素节点上也可以调用。

- `getElementsByName()`：用于选择拥有 `name` 属性的 HTML 元素（比如 `<form>`、<`radio>`、`<img>`、`<frame>`、`<embed>` 和 `<object>` 等），返回一个类似数组的的对象（ `NodeList` 实例），因为 `name` 属性相同的元素可能不止一个。

### 操作元素

- `createElement()`：用来生成元素节点，并返回该节点。参数为元素的标签名，即元素节点的 `tagName` 属性，对于 HTML 元素大小写不敏感。参数可以是自定义的标签名。

- `createTextNode()`：用来生成文本节点（ `Text` 实例），并返回该节点。它的参数是文本节点的内容。这个方法可以确保返回的节点，被浏览器当作文本渲染，而不是当作 HTML 代码渲染。

- `createAttribute()`：生成一个新的属性节点（ `Attr` 实例），并返回。参数是属性的名称。

- `createComment()`：生成一个新的注释节点，并返回该节点。参数是一个字符串，会成为注释节点的内容。

- `createDocumentFragment()`：生成一个空的文档片段对象（ `DocumentFragment` 实例）。是一个存在于内存的 DOM 片段，不属于当前文档，常常用来生成一段较复杂的 DOM 结构，然后再插入当前文档。这样做的好处在于，因为 `DocumentFragment` 不属于当前文档，对它的任何改动，都不会引发网页的重新渲染，比直接修改当前文档的 DOM 有更好的性能表现。

### 操作事件

- `createEvent()`：生成一个事件对象（ `Event` 实例），该对象可以被 `element.dispatchEvent` 方法使用，触发指定事件。

- `addEventListener()`：监听事件

- `removeEventListener()`：移除事件监听。

- `dispatchEvent()`：触发事件

都继承自 `EventTarget` 接口。

## Element 节点

`Element` 节点对象对应网页的 HTML 元素。每一个 HTML 元素，在 DOM 树上都会转化成一个 `Element` 节点对象。

元素节点的 `nodeType` 属性都是1。

`Element` 对象继承了 `Node` 接口，因此 `Node` 的属性和方法在 `Element` 对象都存在。此外，不同的 HTML 元素对应的元素节点是不一样的，浏览器使用不同的构造函数，生成不同的元素节点，比如 `<a>` 元素的节点对象由 `HTMLAnchorElement` 构造函数生成，`<button>` 元素的节点对象由 `HTMLButtonElement` 构造函数生成。

因此，元素节点不是一种对象，而是一组对象，这些对象除了继承 `Element` 的属性和方法，还有各自构造函数的属性和方法。

### 实例属性 `Element.prototype.xxx`

**元素特性相关**

HTML 元素的标准属性（即在标准中定义的属性），会自动成为元素节点对象的属性。如 `href`、`src` 等。

- `id`：返回指定元素的 `id` 属性，该属性可读写。

- `tagName`：返回指定元素的大写标签名，与 `nodeName` 属性的值相等。

- `dir`：用于读写当前元素的文字方向，可能是从左到右 `ltr`，也可能是从右到左 `rtl`。

- `accessKey`：用于读写分配给当前元素的快捷键。`<input accesskey="k" type="text">`，按下 `Alt + k` 或 `ctl + option + k` 就能将焦点转移到它上面。

- `draggable`：返回一个布尔值，表示当前元素是否可拖动。该属性可读写。

- `lang`：返回当前元素的语言设置。该属性可读写。

- `title`：用来读写当前元素的 `title` 属性。该属性通常用来指定，鼠标悬浮时弹出的文字提示框。

**元素属性相关**

- `attributes`：返回一个类数组的对象，成员是当前元素节点的所有属性节点对象。对象中的单个属性可以通过序号引用，也可以通过属性名引用。每个单个属性对象都有 `name` 和 `value` 属性。分别对应属性名和属性值。

- `className`：用来读写当前元素节点的 class 属性。它的值是一个字符串，每个 class 之间用空格分割。

- `classList`：返回一个类似数组的对象，当前元素节点的每个 class 就是这个对象的一个成员。`classList` 对象有下列方法：

  - `add()`：增加 class。
  - `remove()`：移除一个 class。
  - `contains()`：检查当前元素是否包含某个 class，返回 `true` 或者 `false`。
  - `toggle()`：将某个 class 移入或移出当前元素，如果不存在就加入，如果存在就移除。也可以接受一个布尔值，作为第二个参数。如果为 `true`，则添加该属性；如果为 `false`，则去除该属性。
  - `item()`：返回指定索引位置的 class。
  - `toString()`：返回字符串形式的 class。

- `dataset`：元素可以自定义 `data-` 属性，用来添加数据。`dataset` 属性返回一个对象，可以从这个对象读写 `data-` 属性。在 `dataset` 的对象中，带连词线 `-` 的属性名会转为小驼峰。

**元素内容相关**

- `innerHTML`：返回一个字符串，等同于该元素包含的所有 HTML 代码。该属性可读写，常用来设置某个节点的内容。它能改写所有元素节点的内容，包括 `<HTML>` 和 `<body>` 元素。读取属性值的时候，如果文本节点包含 `&`、小于号 `<` 和大于号 `>`，`innerHTML` 属性会将它们转为实体形式 `&amp;`、`&lt;`、`&gt;`。如果想得到原文，建议使用 `element.textContent` 属性。写入的时候，如果插入的文本包含 HTML 标签，会被解析成为节点对象插入 DOM。

- `outerHTML`：返回一个字符串，表示当前元素节点的所有 HTML 代码，包括该元素本身和所有子元素属性是可读写的，对它进行赋值，等于替换掉当前元素。被替换的元素还存在于内存中。

**关联元素相关**

- `children`：返回一个类似数组的对象（ `HTMLCollection` 实例），包括当前元素节点的所有子元素。如果当前元素没有子元素，则返回的对象包含零个成员。

- `childElementCount`：返回当前元素节点包含的子元素节点的个数，与 `Element.children.length` 的值相同。

- `firstElementChild`：返回当前元素的第一个元素子节点。如果没有元素子节点，返回 `null`。

- `lastElementChild`：返回最后一个元素子节点。如果没有元素子节点，返回 `null`。

- `nextElementSibling`：返回当前元素节点的后一个同级元素节点，如果没有则返回 `null`。

- `previousElementSibling`：返回当前元素节点的前一个同级元素节点，如果没有则返回 `null`。

### 实例方法 `Element.prototype.xxx`

**属性相关方法**

- `getAttribute()`：返回当前元素节点的指定属性。如果指定属性不存在，则返回 `null`。
- `getAttributeNames()`：返回一个数组，成员是当前元素的所有属性的名字。如果当前元素没有任何属性，则返回一个空数组。
- `setAttribute('属性名','属性值')`：用于为当前元素节点新增属性。如果同名属性已存在，则相当于编辑已存在的属性。该方法没有返回值。
- `hasAttribute()`：返回一个布尔值，表示当前元素节点是否包含指定属性。
- `hasAttributes()`：返回一个布尔值，表示当前元素是否有属性，如果没有任何属性，就返回false，否则返回true。
- `removeAttribute()`：移除指定属性。该方法没有返回值。

**获取相关元素**

- `querySelector()`：接受 CSS 选择器作为参数，返回父元素的第一个匹配的子元素。如果没有找到匹配的子元素，就返回 `null`。

- `querySelectorAll()`：接受 CSS 选择器作为参数，返回一个 `NodeList` 实例，包含所有匹配的子元素。

- `getElementsByClassName()`：返回一个 `HTMLCollection` 实例，成员是当前元素节点的所有具有指定 class 的子元素节点。该方法的参数大小写敏感。

- `getElementsByTagName()`：返回一个 `HTMLCollection` 实例，成员是当前节点的所有匹配指定标签名的子元素节点。该方法的参数是大小写不敏感的。

**事件相关**

- `focus()`：用于将当前页面的焦点，转移到指定元素上。该方法可以接受一个对象作为参数。参数对象的 `preventScroll` 属性是一个布尔值，指定是否将当前元素停留在原始位置，而不是滚动到可见区域。设为 `false`，则是获得焦点，并滚动到可见区域。

- `blur()`：用于将焦点从当前元素移除。

- `click()`：用于在当前元素上模拟一次鼠标点击，相当于触发了 `click` 事件。

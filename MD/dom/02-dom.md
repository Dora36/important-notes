## DOM 概述

DOM 是 JavaScript 操作网页的接口，全称为“文档对象模型”（Document Object Model）。它的作用是将网页转为一个 JavaScript 对象，从而可以用脚本进行各种操作（比如增删内容）。

浏览器会根据 DOM 模型，将结构化文档（比如 HTML 和 XML）解析成一系列的节点，再由这些节点组成一个树状结构（DOM Tree）。所有的节点和最终的树状结构，都有规范的对外接口。

DOM 只是一个接口规范，可以用各种语言实现。所以严格地说，DOM 不是 JavaScript 语法的一部分，但是 DOM 操作是 JavaScript 最常见的任务，离开了 DOM，JavaScript 就无法控制网页。另一方面，JavaScript 也是最常用于 DOM 操作的语言。

### 节点

DOM 的最小组成单位叫做节点（node）。文档的树形结构（DOM 树），就是由各种不同类型的节点组成。

节点的类型有七种：

- `Document`：整个文档树的顶层节点
- `DocumentType`：`doctype` 标签（比如 `<!DOCTYPE html>`）
- `Element`：网页的各种HTML标签（比如 `<body>`、`<a>` 等）
- `Attr`：网页元素的属性（比如 `class="right"` ）
- `Text`：标签之间或标签包含的文本
- `Comment`：注释
- `DocumentFragment`：文档的片段

浏览器提供一个原生的节点对象 `Node`，上面这七种节点都继承了 `Node`，因此具有一些共同的属性和方法。

### 节点树

一个文档的所有节点，按照所在的层级，可以抽象成一种树状结构。这种树状结构就是 DOM 树。

浏览器原生提供 `document` 节点，代表整个文档。

```js
document  // 整个文档树
// <!DOCTYPE html>
// <html lang="en">
//   <head>...</head>
//   <body>...</body>
// </html>
```

文档的第一层有两个节点，第一个是文档类型节点（`<!doctype html>`），第二个是 HTML 网页的顶层容器标签 `<html>`。后者构成了树结构的根节点（root node），其他 HTML 标签节点都是它的下级节点。

除了根节点，其他节点都有三种层级关系：

- 父节点关系（parentNode）：直接的上级节点
- 子节点关系（childNodes）：直接的下级节点
- 同级节点关系（sibling）：拥有同一个父节点的节点

## Node 接口

所有 DOM 节点对象都继承了 Node 接口，拥有一些共同的属性和方法。这是 DOM 操作的基础。

### 属性

属性都是实例属性，`Node.prototype.xxx`：

- `nodeType`：返回一个整数值，表示节点的类型。

- `nodeName`：返回节点的名称。

- `nodeValue`：返回一个字符串，表示当前节点本身的文本值，该属性可读写。

- `textContent`：可读写。返回当前节点和它的所有后代节点的 **文本** 内容。会忽略节点内部所有的 HTML 标签，只返回所有文本的内容。设置该属性的值时，也会对文本中的 HTML 标签只当作文本，而不会当作标签处理。很适合用于用户提供的内容。读取整个文档的内容，可以使用 `document.documentElement.textContent`。

- `baseURI`：返回一个字符串，表示当前网页的绝对路径。一般由当前网址的 URL（即 `window.location` 属性）决定。如果使用了 HTML 的 `<base>` 标签，则返回 `<base>` 标签设置的值。

- `ownerDocument`：返回当前节点所在的顶层文档对象，即 `document` 对象。

- `nextSibling`：返回紧跟在当前节点后面的第一个同级节点。如果当前节点后面没有同级节点，则返回 `null`。注意，该属性还包括文本节点和注释节点（`<!-- comment -->`）。因此如果当前节点后面有空格，该属性会返回一个文本节点，内容为空格。

- `previousSibling`：返回当前节点前面的、距离最近的一个同级节点。如果当前节点前面没有同级节点，则返回 `null`。

- `parentNode`：返回当前节点的父节点。对于一个节点来说，它的父节点只可能是三种类型：元素节点（element）、文档节点（document）和文档片段节点（documentfragment）。

- `parentElement`：返回当前节点的父元素节点。如果当前节点没有父节点，或者父节点类型不是元素节点，则返回 `null`。

- `firstChild`：返回当前节点的第一个子节点，如果当前节点没有子节点，则返回 `null`。除了元素节点，还可能是文本节点或注释节点。
- `lastChild`：返回当前节点的最后一个子节点，如果当前节点没有子节点，则返回 `null`。

- `childNodes`：属性返回一个类似数组的对象（NodeList集合），成员包括当前节点的所有子节点。除了元素节点，childNodes 属性的返回值还包括文本节点和注释节点。

- `isConnected`：返回一个布尔值，表示当前节点是否在文档之中。

### 方法

方法都是实例方法，`Node.prototype.xxx`：

- `appendChild()`：接受一个节点对象作为参数，将其作为最后一个子节点，插入当前节点。该方法的返回值就是插入文档的子节点。如果参数节点是 DOM 已经存在的节点，appendChild() 方法会将其从原来的位置，移动到新位置。

- `hasChildNodes()`：返回一个布尔值，表示当前节点是否有子节点。
- `cloneNode()`：用于克隆一个节点。
- `insertBefore()`：用于将某个节点插入父节点内部的指定位置。
- `removeChild()`：接受一个子节点作为参数，用于从当前节点移除该子节点。返回值是移除的子节点。
- `replaceChild()`：用于将一个新的节点，替换当前节点的某一个子节点。
- `normalize()`：用于清理当前节点内部的所有文本节点（text）。它会去除空的文本节点，并且将毗邻的文本节点合并成一个

## NodeList 接口和 HTMLCollection 接口

节点都是单个对象，有时需要一种数据结构，能够容纳多个节点。DOM 提供两种节点集合，用于容纳多个节点：`NodeList` 和 `HTMLCollection`。

这两种集合都属于接口规范。许多 DOM 属性和方法，返回的结果是 `NodeList` 实例或 `HTMLCollection` 实例。主要区别是，`NodeList` 可以包含各种类型的节点，`HTMLCollection` 只能包含 HTML 元素节点。

### NodeList 接口

NodeList 实例是一个 **类数组** 的对象，它的成员是节点对象。

通过以下方法可以得到 NodeList 实例：

- `Node.childNodes`
- `document.querySelectorAll()` 等节点搜索方法

NodeList 实例的属性和方法，`NodeList.prototype.xxx`：

- `length`：返回 NodeList 实例包含的节点数量。

- `forEach()`：遍历 NodeList 的所有成员。

- `item()`：接受一个整数值作为参数，表示成员的位置，返回该位置上的成员。一般情况下，都是使用类似数组下标的方括号运算符，而不使用 item 方法。

### HTMLCollection 接口

HTMLCollection 是一个节点对象的集合，只能包含元素节点（element），不能包含其他类型的节点。是一个 **类数组** 的对象，但是与 NodeList 接口不同，HTMLCollection 没有 `forEach` 方法，只能使用 `for` 循环遍历。

返回 HTMLCollection 实例的，主要是一些 Document 对象的集合属性，比如 `document.links`、`document.forms`、`document.images` 等。

如果元素节点有 `id` 或 `name` 属性，那么 HTMLCollection 实例上面，可以使用 `id` 属性或 `name` 属性引用该节点元素。如果没有对应的节点，则返回 `null`。

```js
// HTML 代码如下
// <img id="pic" src="http://xxx.com/foo.jpg">

let picture = document.getElementById('pic');
document.images.pic === picture    // true
```

HTMLCollection 实例的属性和方法，`NodeList.prototype.xxx`：

- `length`：返回 HTMLCollection 实例包含的成员数量。

- `item()`：接受一个整数值作为参数，表示成员的位置，返回该位置上的成员。一般情况下，总是使用类似数组下标的方括号运算符。

- `namedItem()`：参数是一个字符串，表示 `id` 属性或 `name` 属性的值，返回对应的元素节点。如果没有对应的节点，则返回 `null`。

## ParentNode 接口和 ChildNode 接口

### ParentNode 接口

如果当前节点是父节点，就会混入了（mixin）ParentNode 接口。由于只有元素节点（element）、文档节点（document）和文档片段节点（documentFragment）拥有子节点，因此只有这三类节点会拥有ParentNode接口。

ParentNode 实例的属性和方法，`ParentNode.prototype.xxx`：

- `children`：属性返回一个 HTMLCollection 实例，成员是当前节点的所有元素子节点，只包括元素子节点。该属性只读。

- `firstElementChild`：属性返回当前节点的第一个元素子节点。如果没有任何元素子节点，则返回 `null`。

- `lastElementChild`：属性返回当前节点的最后一个元素子节点，如果不存在任何元素子节点，则返回 `null`。

- `childElementCount`：属性返回一个整数，表示当前节点的所有元素子节点的数目。如果不包含任何元素子节点，则返回 `0`。

- `append()`：为当前节点追加一个或多个子节点，位置是最后一个元素子节点的后面。该方法不仅可以添加元素子节点，还可以添加文本子节点。该方法没有返回值。

- `prepend()`：为当前节点追加一个或多个子节点，位置是第一个元素子节点的前面。该方法没有返回值。

### ChildNode 接口

如果一个节点有父节点，那么该节点就拥有了 ChildNode 接口。

ChildNode 实例的属性和方法，`ChildNode.prototype.xxx`：

- `remove()`：用于从父节点中移除当前节点。

- `before()`：用于在当前节点的前面，插入一个或多个同级节点。两者拥有相同的父节点。该方法不仅可以插入元素节点，还可以插入文本节点。

- `after()`：用于在当前节点的后面，插入一个或多个同级节点，两者拥有相同的父节点。用法与 before 方法完全相同。

- `replaceWith()`：使用参数节点，替换当前节点。参数可以是元素节点，也可以是文本节点。

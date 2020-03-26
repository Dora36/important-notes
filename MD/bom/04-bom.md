## JavaScript 代码

浏览器内置了 JavaScript 引擎，并且提供各种接口，让 JavaScript 脚本可以控制浏览器的各种功能。

### 嵌入网页的方法

**script 元素嵌入代码**

`<script>` 元素内部可以直接写 JavaScript 代码。

其中 `type` 属性用来指定脚本类型，默认值为 `text/javascript`。如果 `type` 属性的值，浏览器不认识，那么它不会执行其中的代码。。利用这一点，可以在 `<script>` 标签之中嵌入任意的文本内容，只要加上一个浏览器不认识的 `type` 属性即可。

但是，这个 `<script>` 节点依然存在于 DOM 之中，可以使用 `<script>` 节点的 `text` 属性读出它的内容。

```html
<script id="mydata" type="x-custom-data">
  console.log('Hello World');
</script>

<script>
  console.log(document.getElementById('mydata').text);  // console.log('Hello World');
</script>
```

**script 元素加载外部脚本**

通过 `src` 属性指定外部脚步的链接地址。加载外部脚本和直接添加代码块，这两种方法不能混用。

为了防止攻击者篡改外部脚本，`script` 标签允许设置一个 `integrity` 属性，写入该外部脚本的 `Hash` 签名，用来验证脚本的一致性。

```html
<script src="/assets/application.js"
  integrity="sha256-TvVUHzSfftWg1rcfL6TIJ0XKEGrgLyEq6lEpcmrG9qs=">
</script>
```

上面代码中，`script` 标签有一个 `integrity` 属性，指定了外部脚本 `/assets/application.js` 的 `SHA256` 签名。一旦有人改了这个脚本，导致 `SHA256` 签名不匹配，浏览器就会拒绝加载。

**普通元素的事件属性**

网页元素的事件属性，比如 `onclick` 和 `onmouseover`，可以写入 JavaScript 代码。当指定事件发生时，就会调用这些代码。如果有多个语句，使用分号分隔即可。

```html
<button id="myBtn" onclick="console.log(this.id)">点击</button>
```

**URL 协议**

URL 支持 `javascript:` 协议，即在 URL 的位置写入代码，使用这个 URL 的时候就会执行 JavaScript 代码。

```html
<a href="javascript:console.log('Hello')">点击</a>
```

如果 JavaScript 代码返回一个字符串，浏览器就会新建一个文档，展示这个字符串的内容，原有文档的内容都会消失。

```html
<a href="javascript: new Date().toLocaleTimeString();">点击</a>
```

上面代码中，点击链接以后，页面内容会变为当前时间。加上 `target="black"` 属性后会打开新的页面，里面内容为当前时间。

为了防止链接跳转，可以添加 `javascript:void 0`

### `<script>` 元素

**加载过程**

- 浏览器一边下载 HTML 网页，一边开始解析。下载和解析同时进行，不会等到下载完，才开始解析。
- 解析过程中，浏览器发现 `<script>` 元素，就暂停解析，把网页渲染的控制权转交给 JavaScript 引擎。
- 如果 `<script>` 元素引用了外部脚本，就下载该脚本再执行，否则就直接执行代码。
- JavaScript 引擎执行完毕，控制权交还渲染引擎，恢复往下解析 HTML 网页。

如果外部脚本加载时间很长或一直无法完成下载，就会造成网页长时间失去响应，造成阻塞。为了避免这种情况，较好的做法是将 `<script>` 标签都放在页面底部，而不是头部。如果某些脚本代码非常重要，一定要放在页面头部的话，最好直接将代码写入页面，而不是连接外部脚本文件，这样能缩短加载时间。

如果有多个 `<script>` 标签，浏览器会同时并行下载，但是，执行时会保证按标签顺序执行，即使后者先下载完成，也是会按顺序执行。

此外，对于来自同一个域名的资源，比如脚本文件、样式表文件、图片文件等，浏览器一般有限制，同时最多下载 6～20 个资源，即最多同时打开的 TCP 连接有限制，这是为了防止对服务器造成太大压力。如果是来自不同域名的资源，就没有这个限制。所以，通常把静态文件放在不同的域名之下，以加快下载速度。

**defer 属性 和 async 属性**

`defer` 属性的作用是延迟脚本的执行，等到 DOM 加载生成后，再执行脚本。下载脚本文件的时候，不会阻塞页面渲染。且可以保证执行顺序就是标签的顺序。

`async` 属性的作用是使用另一个进程下载脚本，下载时不会阻塞渲染。但无法保证脚本的执行顺序。哪个脚本先下载结束，就先执行那个脚本。

**加载使用的协议**

如果不指定协议，浏览器默认采用 HTTP 协议下载。如果要采用 HTTPS 协议下载，必需写明。

```html
<script src="example.js"> // 默认采用 HTTP 协议 </script>             
<script src="https://example.js"></script>
<script src="//example.js"> // 根据页面本身的协议来决定加载协议 </script>
```

**动态加载**

`<script>` 元素还可以动态生成，生成后再插入页面，从而实现脚本的动态加载。

```js
['a.js', 'b.js'].forEach(function(src) {
  var script = document.createElement('script');
  script.src = src;
  document.head.appendChild(script);
});
```

这种方法的好处是，动态生成的 `<script>` 标签不会阻塞页面渲染，也就不会造成浏览器假死。但是问题在于，这种方法执行是异步的，无法保证脚本的执行顺序，哪个脚本文件先下载完成，就先执行哪个。

但是可以通过设置 `async` 属性为 `false`，来保证按照顺序执行：

```js
['a.js', 'b.js'].forEach(function(src) {
  var script = document.createElement('script');
  script.src = src;
  script.async = false;
  document.head.appendChild(script);
});
```

不过需要注意的是，在这段代码后面加载的“脚本文件”，会因此都等待 `b.js` 执行完成后再执行，而正常代码不会有限制。

也可为动态加载的脚本指定回调函数：

```js
function loadScript(src, done) {
  var js = document.createElement('script');
  js.src = src;
  js.onload = function() {
    done();
  };
  js.onerror = function() {
    done(new Error('Failed to load script ' + src));
  };
  document.head.appendChild(js);
}
```

### 页面的重流和重绘 

页面生成以后，脚本操作和样式表操作，都会触发“重流”和“重绘”。

作为开发者，应该尽量设法降低重绘的次数和成本。可以使用以下的优化技巧：

- 读取 DOM 或者写入 DOM，尽量写在一起，不要混杂。不要读取一个 DOM 节点，然后立刻写入，接着再读取一个 DOM 节点。
- 缓存 DOM 信息。
- 不要一项一项地改变样式，而是使用 CSS class 一次性改变样式。
- 使用 `documentFragment` 操作 DOM
- 动画使用 `absolute` 定位或 `fixed` 定位，这样可以减少对其他元素的影响。
- 只在必要时才显示隐藏元素。
- 使用 `window.requestAnimationFrame()`，因为它可以把代码推迟到下一次重流时执行，而不是立即要求页面重流。
- 使用虚拟 DOM（virtual DOM）库。

## window 对象

浏览器里面，`window` 对象指当前的浏览器窗口。它也是当前页面的顶层对象，即最高一层的对象，所有其他对象都是它的下属。

凡是定义在 window 对象上的属性和方法都可以不写 `window.` 前缀，直接调用。

### 全局对象属性

全局对象属性指向一些浏览器原生的全局对象。

- `document`：指向 `document` 对象。注意，这个属性有同源限制。只有来自同源的脚本才能读取这个属性。

- `location`：指向 `Location` 对象，用于获取当前窗口的 URL 信息。它等同于 `document.location` 属性。

- `navigator`：指向 `Navigator` 对象，用于获取环境信息。

- `history`：指向 `History` 对象，表示当前窗口的浏览历史。

- `localStorage`：指向本地储存的 `localStorage` 数据。

- `sessionStorage`：指向本地储存的 `sessionStorage` 数据。

- `console`：指向 `console` 对象，用于操作控制台

- `screen`：指向 `Screen` 对象，表示屏幕信息。

### 方法

- `alert()`：弹出的对话框，只有一个“确定”按钮，往往用来通知用户某些信息。可以用 `\n` 指定换行。

- `prompt()`：弹出的对话框，提示文字的下方，还有一个输入框，要求用户输入信息，并有“确定”和“取消”两个按钮。第二个参数是输入框默认值。返回信息：

  - 用户输入信息，并点击“确定”，则用户输入的信息就是返回值。
  - 用户没有输入信息，直接点击“确定”，则输入框的默认值就是返回值。
  - 用户点击了“取消”（或者按了 ESC 按钮），则返回值是 `null`。

- `confirm()`：弹出的对话框，除了提示信息之外，只有“确定”和“取消”两个按钮，往往用来征询用户是否同意。点击“确定”，返回 `true`；点击“取消”，则返回 `false`。

- `print()`：跳出打印对话框，与用户点击菜单里面的“打印”命令效果相同。

### 事件

- `onload`：事件发生在文档在浏览器窗口加载完毕时。

- `onhashchange`：`hashchange` 事件的监听函数。url 中 `hash` 值改变会触发。

## `<canvas>` 元素

`<canvas>` 是一个可以使用 JavaScript 来绘制图形的 HTML 元素。可以用于动画、游戏画面、数据可视化、图片编辑以及实时视频处理等方面。

### `<canvas>` 标签的属性

`<canvas>` 标签只有两个特有属性，`width` 和 `height`。Canvas 的默认大小为 300px × 150px（宽×高）。但可以使用高度和宽度属性来自定义 Canvas 的尺寸。

```html
<canvas id="canvas" width="600" height="600"></canvas>
```

该元素也可以使用 CSS 来定义大小，但在绘制时图像时会伸缩以适应它的 CSS 尺寸，因此如果CSS 的尺寸与初始画布的比例不一致，则会出现扭曲。

初始的 canvas 样式，其颜色是完全透明的，与背景色一样。

### `<canvas>` 标签的兼容

对于不支持 `<canvas>` 标签的浏览器，可在标签中提供替换内容，替换内容可以是文本也可以是任何其他浏览器支持的元素标签，如图片等。此时不支持 `<canvas>` 的浏览器将会忽略 `<canvas>` 标签并渲染其内部的替换内容。而支持 `<canvas>` 的浏览器将会忽略在标签中包含的内容，正常渲染 canvas。

```html
<canvas id="stockGraph" width="150" height="150">
  您的浏览器不支持 canvas 画布功能，请更新浏览器！
</canvas>

<canvas id="clock" width="150" height="150">
  <img src="images/clock.png" width="150" height="150" alt=""/>
</canvas>
```

### `<canvas>` 元素生成图片

- `toDataURL()`：返回 `<canvas>` 标签生成的图片的 base64 编码的字符串。

## 渲染上下文 context

`<canvas>` 元素相当于画布，本身并没有绘制能力。需要使用 js 脚本来完成实际的绘图任务。而 js 脚本中用于在画布上绘图的方法和属性则由 `getContext()` 方法返回的对象来提供。

其中，Canvas API 主要聚焦于 2D 图形。而同样使用 `<canvas>` 元素的 WebGL API 则可用于绘制硬件加速的 2D 和 3D 图形。

### `getContext()`

`getContext()` 只有一个参数，表示上下文的格式，然后通过参数来返回渲染上下文和它的绘画功能。

- `getContext('2d')`：返回 CanvasRenderingContext2D 实例，包含 canvas 的 2D 上下文及其绘图 API。
- `getContext('webgl')`：返回 WebGLRenderingContext 实例，即 WebGL 上下文及其绘图 API。

```js
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
```

## [设置笔触样式](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors)

### 改变笔触颜色

颜色默认黑色，一旦改变，新的颜色值就会成为新绘制的图形的默认值。

- `fillStyle`：设置图形的填充颜色。可以是表示 CSS 颜色值的字符串，渐变对象或者图案对象。可通过 `rgba()` 设置透明颜色。
- `strokeStyle`：设置图形轮廓的颜色。
- `globalAlpha`：透明度：这个属性会影响 canvas 里所有图形的透明度，值是 0-1，默认是 1。

### 设置线性

- `lineWidth`：设置线条宽度。属性值必须为正数。默认值是1.0。线宽是指给定路径的中心到两边的粗细，也就是在路径的两边各绘制线宽的一半。因此要注意画布的坐标和屏幕的像素之间的对应关系。
- `lineCap`：设置线条末端样式。属性值：`butt`（默认值），`round` 和 `square`。
- `lineJoin`：设定线条与线条间接合处的样式。属性值：`round`, `bevel` 和 `miter`（默认值）。
- `miterLimit`：限制当两条线相交时交接处最大长度，所谓交接处长度（斜接长度）是指线条交接处内角顶点到外角顶点的长度。
- `setLineDash(segments)`：设置当前虚线样式。
- `lineDashOffset`：设置虚线样式的起始偏移量。
- `getLineDash()`：返回一个包含当前虚线样式，长度为非负偶数的数组。

### 阴影

- `shadowOffsetX` 和 `shadowOffsetY` 用来设定阴影在 `X` 和 `Y` 轴的延伸距离，
- `shadowBlur`：用于设定阴影的模糊程度，
- `shadowColor`：是标准的 CSS 颜色值，用于设定阴影颜色效果，默认是全透明的黑色。

## 绘制图形

Canvas API 只支持两种形式的图形绘制：矩形和路径（由一系列点连成的线段）。所有其他类型的图形都是通过一条或者多条路径组合而成的。

### 绘制矩形

- `fillRect(x, y, width, height)`：绘制一个填充的矩形，`x` 与 `y` 指定了在 canvas 画布上所绘制的矩形的左上角（相对于原点）的坐标。`width` 和 `height` 设置矩形的尺寸。
- `strokeRect(x, y, width, height)`：绘制一个描边的矩形。
- `clearRect(x, y, width, height)`：清除指定矩形区域，变为透明或 canvas 的背景色。

### 绘制路径

图形的基本元素是路径。路径是通过不同颜色和宽度的线段或曲线相连形成的不同形状的点的集合。一个路径，甚至一个子路径，都是闭合的。使用路径绘制图形需要具体的步骤。

**1. 创建路径起始点。**

- 新建路径 `beginPath()`：本质上，路径是由很多子路径构成，这些子路径都是在一个列表中，所有的子路径（线、弧形、等等）构成图形。而每次这个方法调用之后，列表清空重置，然后我们就可以重新绘制新的图形。一切新的路径操作之前都要新建路径。

- 起始点 `moveTo(x, y)`：新建路径后，需要制定起始点。表示将笔触移动到指定的坐标 `x` 以及 `y` 上，也可以用来绘制一些不连续的路径。

**2. 通过绘制路径的各种方法（线、弧形等）画出路径。**

- 直线 `lineTo(x, y)`：绘制一条从当前位置到指定 `x` 及 `y` 位置的直线。

- 圆弧 `arc(x, y, radius, startAngle, endAngle, anticlockwise)`：
  - `x`, `y`：为圆心坐标。
  - `radius`：为圆弧或圆的半径。
  - 圆弧：从 `startAngle` (弧度)开始到 `endAngle` (弧度)结束，都是以 `x` 轴为基准。角度与弧度的 js 换算为 `radian = (Math.PI/180) * angle`。
  - `anticlockwise`：按照该参数给定的方向来生成，布尔值：`true` 是逆时针，默认为 `false` 顺时针（顺时针为正）。

- 矩形 `rect(x, y, width, height)`：通过路径绘制一个左上角坐标为 `x`,`y`，宽高为 `width` 及 `height` 的矩形。当该方法执行的时候，`moveTo()` 方法自动设置坐标参数（0,0）。也就是说，当前笔触自动重置回默认坐标。

- 二次贝塞尔曲线 `quadraticCurveTo(cp1x, cp1y, x, y)`：`cp1x`,`cp1y` 为一个控制点，`x`,`y` 为结束点。

- 三次贝塞尔曲线 `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)`：`cp1x`,`cp1y` 为控制点一，`cp2x`,`cp2y` 为控制点二，`x`,`y` 为结束点。

**3. 用 `closePath()` 封闭路径**

该步骤是可选的。这个方法会通过绘制一条从当前点到开始点的直线来闭合图形。如果图形是已经闭合了的，即当前点为开始点，该函数什么也不做。

使用 `fill()` 填充路径的时候，会自动闭合没有调用该方法的路径。

**4. 渲染图形**

一旦路径生成，就能通过描边或填充路径区域来渲染图形。

- `stroke()`：线条描边。
- `fill()`：填充路径内容区域，可自动闭合没有闭合的路径。
- `clip()`：裁剪，路径以外的内容不显示。

## 绘制文本

### 文本的样式

- `font`：与 CSS font 属性有相同的语法。默认的字体是 `10px sans-serif`。
- `textAlign`：文本对齐选项。可选的值包括：`start`（默认值），`end`，`left`，`right` 或 `center`。
- `textBaseline`：基线对齐选项。可选的值包括：`top`，`hanging`，`middle`，`alphabetic`（默认值），`ideographic`，`bottom`。
- `direction`：文本方向。可能的值包括：`ltr`，`rtl`，`inherit`（默认值）。

### 文本渲染

- `fillText(text, x, y [, maxWidth])`：在指定的 `x`、`y` 位置填充指定的文本，绘制的最大宽度是可选的.
- `strokeText(text, x, y [, maxWidth])`：在指定的 `x`、`y` 位置绘制文本边框，绘制的最大宽度是可选的.

## 图片操作

### 获取图片

- html 中的 `img` 元素。或在 js 中 `new Image()`。也可在路径的地方使用 base64。
- 其它 `canvas` 元素，可通过 `document.getElementById` 等方法获取。
- 使用 `<video>` 中的视频帧（即便视频是不可见的）。通过 dom 方法获取 `video` 元素，即可得到当前帧的图像。

### 绘制图片

图片绘制必须在图片加载完成后进行。

- 正常 `drawImage(image, x, y)`：image 是获得的图片对象，`x`，`y` 是图片在 canvas 中的起始坐标。
- 缩放 `drawImage(image, x, y, width, height)`：`width` 和 `height` 两个参数用来控制图片应该缩放的大小。
- 切片 `drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)`：`image` 是图片，接着 4 个参数是原图像的剪切位置坐标和宽高大小，最后 4 个参数是切片在 canvas 中显示的位置坐标和宽高大小。

```js
let oImg = new Image();
oImg.src = './img/img.jpg'

oImg.onload= function(){
  ctx.drawImage(oImg, 10, 10)
}
```

## canvas 的变形

- `translate(x, y)`：移动 canvas 的原点到指定位置。原点默认为左上角。接受两个参数。`x` 是左右偏移量，`y` 是上下偏移量。
- `rotate(angle)`：用于以原点为中心旋转 canvas。只接受一个参数：旋转的角度(angle)，它是顺时针方向的，以弧度为单位的值。旋转的中心点始终是 canvas 的原点，如果要改变它，需要用到 `translate` 方法。
- `scale(x, y)`：用来增减图形在 canvas 中的像素数目，对形状，位图进行缩小或者放大。接受两个参数。`x`,`y` 分别是横轴和纵轴的缩放因子，它们都必须是正值。值比 1.0 小表示缩小，比 1.0 大则表示放大。
- `transform(m11, m12, m21, m22, dx, dy)`：允许对变形矩阵直接修改。将当前的变形矩阵乘上一个基于自身参数的矩阵。

## 状态的保存和恢复

`save()` 和 `restore()` 方法是用来保存和恢复 canvas 状态的，都没有参数。

可以连续调用任意多次 `save` 方法。每一次调用 `restore` 方法，上一个保存的状态就从栈中弹出，所有设定都恢复。

一个绘画状态包括：

- 画布的变形：当前应用的变形（即移动，旋转和缩放）
- 笔触的样式
- 当前的裁切路径（clipping path）

## canvas 绘制

### 步骤

1. 得到元素，获得渲染上下文和它的绘画功能。
2. 设置笔触样式。
    - `ctx.lineWidth = 2;`
    - `ctx.fillStyle = "orange";`
3. 绘制内容：绘制图形，矩形或路径；绘制文本；图片操作等。
4. 绘制路径的步骤：
    - `beginPath()`：一切新的路径操作之前都要新建路径。
    - `moveTo()`
    - 绘制路径的各种方法。
    - `closePath()`，可选的
    - 路径生成：`stroke()`，`fill()`

### 动画

**`window.requestAnimationFrame()`**

可利用 `window.requestAnimationFrame()` 方法。该方法跟 `setTimeout` 类似，都是推迟某个函数的执行。不同之处在于， `setTimeout` 必须指定推迟的时间，`window.requestAnimationFrame()` 则是推迟到浏览器下一次重流时执行，执行完才会进行下一次重绘。重绘通常是 16ms 执行一次，不过浏览器会自动调节这个速率，比如网页切换到后台 Tab 页时，`requestAnimationFrame()` 会暂停执行。

该方法接受一个回调函数 `callback` 作为参数。`callback` 执行时，会收到系统传入的一个高精度时间戳（ `performance.now()` 的返回值）作为参数，单位是毫秒，表示距离网页加载的时间。

```js
window.onload=function (){
  let canvas = document.getElementById('canvas');
  let ctx = oC.getContext('2d');

  let left=100;
  requestAnimationFrame(next);

  function next(){
   ctx.clearRect(0,0,canvas.width,canvas.height);
    left += 5;
    ctx.strokeRect(left, 100, 200, 150);
    if(left <= 300){
      requestAnimationFrame(next);
    };
  }
};
```

## Canvas 与 SVG 的区别

- canvas：位图，缩放会失真；不保留绘出来的图形，因此不能修改、没有事件；性能非常高。适合游戏、大型图表等。
- svg：矢量图，缩放不失真；会保留绘出来的图形，因此能修改、有事件；但性能一般(类似普通标签)。适合交互频繁的普通图表。

[参考链接](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)

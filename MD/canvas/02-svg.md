## 介绍

SVG（Scalable Vector Graphics）是可缩放矢量图形，是一种用于描述基于二维的矢量图形的，基于 XML 的标记语言。本质上，SVG 相对于图像，就好比 HTML 相对于文本。

SVG 是由各种标签组成的，然后通过标签的各种属性定义形状和样式，也可通过 js 处理标签的各种事件，通过事件修改样式或定义行为。

## svg 图形标签

### 图形标签

- line：线 
- rect：矩形
- circle：圆
- ellipse：椭圆

```html
<svg width="800" height="600">
  <!-- 线：x1，y1：起始坐标；x2，y2：终止坐标；stroke：颜色；stroke-width：线宽 -->
  <line x1="10" y1="10" x2="200" y2="30" style="stroke:#000;stroke-width:20"></line>

  <!-- 矩形：x，y：左上角坐标；rx，ry：圆角大小；stroke：边框颜色；fill：填充色，none 为空心 -->
  <rect x="100" y="100" rx="5" ry="5" width="200" height="200" style="stroke:red;stroke-width:20;fill:rgba(0,0,0,0);" onclick="this.style.stroke='black'"></rect>

  <!-- 圆：cx，cy：圆心坐标；r：半径 -->
  <circle cx="300" cy="300" r="50"></circle>

  <!-- 椭圆：cx，cy：圆心坐标；rx：x 轴半径；ry：y 轴半径 -->
  <ellipse cx="100" cy="300" rx="50" ry="30"></ellipse>
</svg>
```

### 图形标签属性

SVG 元素可以通过属性来修改，这些属性指定有关如何处理或呈现元素的详细信息。

svg 的属性都没有单位，因为矢量图都没有单位。

- 只能做属性：决定图形形状
- 可以放样式：视觉效果，最好放样式里，因为属性的样式优先级太低了。

```html
<svg>
  <line x1="10" y1="10" x2="200" y2="30" stroke="#000" stroke-width="20"></line>
  <line x1="10" y1="10" x2="200" y2="30" style="stroke:#000;stroke-width:20"></line>
</svg>
```

### js 操作标签

- 事件：html 标签可用的事件都可用。
- 样式：`this.style.xxx`
- 属性：通过 `setAttribute()` 设置属性，通过 `getAttribute()` 获取 svg 标签属性。

## `<path>` 标签

### d 属性

- Moveto
  - M x y：绝对坐标。
  - m dx dy：相对于当前点的距离，分别是向右和向下的距离。

- Lineto
  - L x y：绝对坐标。
  - l dx dy：向右和向下的相对距离。
  - H x / h x：水平线。
  - V y / v y：垂直线。

- A（Arcto）：rx,ry xAxisRotate LargeArcFlag,SweepFlag x,y
  - rx ry：x 和 y 方向的半径
  - xAxisRotate：x 轴旋转的角度。
  - LargeArcFlag：画大弧为 1，画小弧为 0。
  - SweepFlag：弧的方向，顺时针为 1，逆时针为 0。
  - x y：目的地的坐标。

- Curveto：C c1x,c1y c2x,c2y x,y
  - c1x、c1y，c2x、c2y：是分别是初始点和结束点的绝对坐标。
  - x,y：控制点的绝对坐标。

- ClosePath
  - Z / z：从当前点到第一个点简单画一条直线。

[参考链接](https://developer.mozilla.org/zh-CN/docs/Web/SVG)

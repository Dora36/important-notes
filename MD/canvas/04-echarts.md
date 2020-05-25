## [raphael](https://dmitrybaranovskiy.github.io/raphael/)

- Raphael 是一个用 JavaScript 实现的强大的矢量图形库。
- 兼容 IE6
- 基于 svg

### 基本语法

```html
<div id="container"></div> 
<script src="http://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"> </script> 
<script> 
  // 圆
  var paper = Raphael("container", 500, 300); 
  var dot = paper.circle(250, 150, 30).attr({ 
    fill: "#FFF", 
    stroke: "#000", 
    "stroke-width": 1 
  }); 
</script> 
```

### 钟表示例

```html
<script src="http://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"> </script> 
<script> 
  // 钟表
  let paper = Raphael(0, 0, 100, 100);
  let cx = 50, cy = 50
  function createPath(r,ang,color) {
    let path = paper.path().attr({
      stroke: color,
      "stroke-width": 6
    })

    function calc(ang, isFirst = false) {
      let arr = [];
      arr.push(`M ${cx} ${cy - r}`)
      let x = cx + Math.sin(ang * Math.PI / 180) * r
      let y = cy - Math.cos(ang * Math.PI / 180) * r
      arr.push(`A ${r} ${r} 0 ${ang > 180 ? 1 : 0} 1 ${x} ${y}`)
      if(isFirst || ang===0) {
        path.attr('path', arr.join(" "))
      }else {
        path.animate({path: arr.join(" ")},500,'liner')
      }
    }
    calc(ang,true)
    path.calc = calc
    return path
  }

  let paths = [];
  function tick(){
    let now = new Date()
    let h = now.getHours()>12?now.getHours()-12:now.getHours()

    if(paths.length === 0) {
      paths = [
        createPath(10,360*h/12,'teal'),
        createPath(20,360*now.getMinutes()/60,'cadetblue'),
        createPath(30,360*now.getSeconds()/60,'darkseagreen')
      ]
    }else {
      paths[0].calc(360*h/12)
      paths[1].calc(360*now.getMinutes()/60)
      paths[2].calc(360*now.getSeconds()/60)
    }
  }
  tick()
  setInterval(tick, 1000);
</script>
```

## [ECharts](https://echarts.apache.org/zh/index.html)

ECharts 是一个使用 JavaScript 实现的开源可视化库，可以流畅的运行在 PC 和移动设备上，兼容当前绝大部分浏览器（IE8/9/10/11，Chrome，Firefox，Safari等），底层依赖轻量级的矢量图形库 ZRender，提供直观，交互丰富，可高度个性化定制的数据可视化图表。

### 基本语法

**`echarts.init(dom, theme, {renderer: 'canvas / svg'})`**

- ECharts 默认使用 canvas 绘制图表，但在初始化图表实例时，设置 `renderer` 参数为 `svg` 即可指定 svg 渲染器，`echarts.init(dom, null, {renderer: 'svg'})`。

- 其中第二个参数是主题，可使用 canvas 默认的 `light` 或 `dark` 主题，也可使用 [自定义主题](https://www.echartsjs.com/theme-builder/)。使用方式为下载主题的 js 文件，引入到项目中，传入 主题名 作为第二个参数。

**基本语法**

一个网页中可以创建多个 echarts 实例。每个 echarts 实例中可以创建多个图表和坐标系等等（用 `option` 来描述）。

```html
<script src="https://cdn.bootcdn.net/ajax/libs/echarts/4.7.0/echarts.js"> </script>
<div id="main" style="width: 600px;height:400px;"></div>
<script>
  // 1. 初始化 echarts 实例
  let echartsDom = document.getElementById('main')
  // echarts.init(dom, '主题', { renderer: 'canvas / svg'})
  let myChart = echarts.init(echartsDom)  // 默认 canvas 渲染

  // 2. 指定图表配置项和数据，其中的每一个属性都是一类组件。
  let option = {
    title: {},   // 标题
    tooltip: {}, // 悬浮提示框
    dataset: [], // 可被多个图表复用的数据集
    xAxis: [],   // x 坐标轴
    yAxix: [],   // y 坐标轴
    grid: [],    // 直角坐标系底板
    series: []   // 数据系列
    ...
  }

  // 3. 让 echarts 实例显示配置项的图表
  myChart.setOption(option)
</script>
```

### 图表事件处理

ECharts 支持常规的鼠标事件类型，包括 `click`、`dblclick`、`mousedown`、`mousemove`、`mouseup`、`mouseover`、`mouseout`、`globalout`、`contextmenu` 事件。

```js
myChart.on('click', function (params) {
  console.log(params.name);
  // 跳转到相应的百度搜索页面
  window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(params.name));
});
```

## [D3](https://d3js.org/)

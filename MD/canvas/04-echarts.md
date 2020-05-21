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

ECharts 默认使用 Canvas 绘制图表，但在初始化图表实例时，设置 renderer 参数为 svg 即可指定 svg 渲染器，`echarts.init(dom, null, {renderer: 'svg'})`。

### 基本语法

```html
<script src="https://cdn.bootcdn.net/ajax/libs/echarts/4.7.0/echarts.js"> </script>
<div id="main" style="width: 600px;height:400px;"></div>
<script>
  // 1. 初始化 echarts 实例
  let myChart = echarts.init(document.getElementById('main'))

  // 2. 指定图表配置项和数据，其中的每一个属性都是一类组件。
  let option = {
    title: {},   // 标题
    tooltip: {}, // 悬浮提示框
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

### 示例

```html

```

## D3

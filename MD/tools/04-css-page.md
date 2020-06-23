## @page 规则控制打印设置选项

使用 `@page` 规则可以对打印进行更多的设置。比如指定页面的尺寸，页边距，页眉页脚等，以求达到更好的效果。

- `@page {}`：应用于每一页
- `@page :first {}`：只应用于第一页
- `@page :left {}`：左边栏样式
- `@page :right {}`：右边栏样式

## 只用于打印的样式

`@media` 方式写在页面里的 `style` 里，`print` 只用于打印。

```css
/* 样式将只应用于打印 */
@media print {
  /* 白纸黑字 */
  body {
    color: #000;
    background: #fff;
   }
}
```

也可使用外链指定此样式专用于打印。

```html
<link rel="stylesheet" type="text/css" href="css/print.css" media="print" />
```

### 示例

```css
/* 正常的 h1 样式 */
h1 {
  color: #fff;
  background: url(banner.jpg);
}

/* 用于打印的样式：去除背景图片, 节约笔墨 */
@media print {
  h1 {
    color: #000;
    background: none;
  }
  nav, aside {
    display: none;
  }
   
  body, article {
    width: 100%;
    margin: 0;
    padding: 0;
  }
  @page {
    margin: 2cm;
  }
}
```

## @page 的设置

### 纸张设置

```css
@page{
 size: A4;            /* 定义为a4纸，或者 5.5in 8.5in; 直接用固定长度表示 */
 margin: 0 0 0 50px;  /* 页面的边距 */
}

@page {
  size: A4 landscape; /* 纸张方向 portrait： 纵向打印,  landscape: 横向。*/
}

```

### 页眉页脚设置

```css
@page:right{ 
  /* 底部左边显示 */
  @bottom-left { 
    margin: 10pt 0 30pt 0;
    border-top: .25pt solid #666;
    content: "Our Cats";
    font-size: 9pt;
    color: #333;
  }
  /* 底部右边显示页码 */
  @bottom-right { 
    margin: 10pt 0 30pt 0;
    border-top: .25pt solid #666;
    content: counter(page);
    font-size: 9pt;
  }
  /* 顶部右边显示标题 */
  @top-right {
    content: string(doctitle);
    margin: 30pt 0 10pt 0;
    font-size: 9pt;
    color: #333;
  }
}
```

### 打印标签设置

```css
.ccc{ 
	page-break-before: avoid;     /* 前面不加空页 */
	page-break-after: avoid;      /* 后面不加空页 */
}
```

### 示例

```css
@media print {
  @page {
    margin: 2cm;
    size: A4;
  }
  /* 自动换页 */
  .page-break {
    page-break-after: always;
  }
  @page {
    /* 底部左边显示页码 */
    @bottom-left {
      content: counter(page);
    }
    /* 顶部中间显示 logo */
    @top-center {
      content:url('logo.svg');
    }
  }
}
```

- [打印](https://www.softwhy.com/article-5613-1.html)

- [CSS 属性大全](https://www.nhooo.com/css-reference/css-reference.html)


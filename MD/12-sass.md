## Sass 简介

Sass 是成熟、稳定、强大的 CSS 扩展语言。完全兼容各个版本的 CSS 语法。

sass 有两种语法，一种是以 `.sass` 为扩展名的语法，写法为缩排语法，即不使用花括号，而是通过缩进的方式来表达选择符的嵌套层级；而且也不使用分号，而是用换行符来分隔属性。

另一种就是常用的以 `.scss` 为扩展名的语法，写法同 css 一样，使用花括号和分号来表达层级和分隔属性。

两种语法可以相互转换，也可同时使用。

## Sass 命令行编译

### 编译
```sass
//单文件转换命令
sass input.scss output.css

//单文件监听命令
sass --watch input.scss:output.css

//如果你有很多的sass文件的目录，你也可以告诉sass监听整个目录：
sass --watch app/sass:public/stylesheets
```

### 配置选项

通过 `--style` 配置编译排版的选项。

**1. nested，也是默认的**

```
/*命令行内容*/
sass style.scss:style.css --style nested
```

```scss
/* 编译过后样式 */
.box {
  width: 300px;
  height: 400px; }
  .box-title {
    height: 30px;
    line-height: 30px; }
```

**2. expanded**

```
/*命令行内容*/
sass style.scss:style.css --style expanded
```

```scss
/* 编译过后样式 */
.box {
  width: 300px;
  height: 400px;
}
.box-title {
  height: 30px;
  line-height: 30px;
}
```

**3. compact**

```
/*命令行内容*/
sass style.scss:style.css --style compact
```

```scss
/* 编译过后样式 */
.box { width: 300px; height: 400px; }
.box-title { height: 30px; line-height: 30px; }
```

**4. compressed**

```
/*命令行内容*/
sass style.scss:style.css --style compressed
```

```scss
/* 编译过后样式 */
.box{width:300px;height:400px}.box-title{height:30px;line-height:30px}
```


## Sass 之基础语法

### 变量

sass 最重要的一个特性就是变量。可以把项目中需要反复使用的 css 属性值定义成变量，然后通过变量名来引用它们，而无需重复书写这一属性值。比如项目中用到的色值，这样在项目需要改版的时候可以统一改变颜色风格。

#### 声明与引用

- sass 使用 `$` 符号来标识变量。
- 在声明变量时，变量值也可以引用其他变量。
- 也可定义在 css 规则块内，那么此时该变量只能在此规则块内使用，也就是局部变量。

```scss
$primary-color: #800080;
$border: 1px solid $primary-color;

nav {
  $width: 600px;
  width: $width;
  color: $primary-color;
}
.cancel {
  background-color: #fff;
  border: $border;
  color: $primary-color;
}
```

在引用时，凡是 css 属性值可存在的地方，变量就可以使用。编译 css 时，变量会被它们的值所替代。

#### 变量名

sass 的变量名可以与 css 中的属性名和选择器名称相同，包括中划线 `-` 和下划线 `_`。这两种用法相互兼容。用中划线声明的变量可以使用下划线的方式引用，反之亦然。

```scss
$link-color: blue;
a {
  color: $link_color;
}

//编译后

a {
  color: blue;
}
```
  
### 嵌套

#### CSS 规则嵌套

```scss
.content article h1 { color: #333 }
.content article p { margin-bottom: 1.4em }
.content aside { background-color: #EEE }
```

这种情况下，sass 可以使用嵌套语法，然后在编译成 css 时自动把这些嵌套规则处理好，避免重复书写。

```scss
.content {
  article {
    h1 { color: #333 }
    p { margin-bottom: 1.4em }
  }
  aside { background-color: #EEE }
}
```

编译完成后的 css 写法与上面原始 css 完全一样。

##### 父选择器标识符 &

一般情况下，sass 在解开一个嵌套规则时会把父选择器（`.content`）通过一个空格连接到子选择器的前边（`article`和`aside`）形成 css 的后代选择器。

然而在遇到 `:hover` 这种伪类时，如果还用空格连接，就会得不到想达到的效果，此时，就需要使用父选择器标识符 `&` 来代替，在编译时，`&` 被父选择器直接替换。

```scss
article a {
  color: blue;
  &:hover { color: red }
}

//编译后

article a { color: blue }
article a:hover { color: red }
```

##### 群组选择器的嵌套

```scss
.container h1, .container h2, .container h3 {
  color: $primary-color;
}

//sass 嵌套写法

.container {
  h1, h2, h3 {color: $primary-color;}
}
```

#### 属性嵌套

在 sass 中，除了 CSS 选择器，属性也可以进行嵌套。比如设置元素的 `margin` 或 `padding` 的 `top bottom left right` 等值。

```scss
.div {
  margin: {
    top:10px;
    bottom:20px;
  };
  padding: {
    top:5px;
    bottom:5px;
    left:10px;
    right:20px;
  };
}
```

嵌套属性的规则是这样的：把属性名从中划线 `-` 的地方断开，在根属性后边添加一个冒号 `:`，紧跟一个 `{ }` 块，把子属性部分写在这个`{ }`块中。就像 css 选择器嵌套一样，sass 会把子属性一一解开，把根属性和子属性部分通过中划线 `-` 连接起来，最后生成的效果与的 css 样式一样。

```scss
nav {
  border: 1px solid #ccc {
  left: 0px;
  right: 0px;
  }
}
```

### 混合器

像 js 的函数一样，当项目中有一大段同样的样式代码需要重复写的时候，就要考虑将重复的部分提取出来封装，然后在使用的时候调用。

#### 定义与调用

sass 通过 `@mixin` 标识符定义混合器，在 `@mixin` 之后定义混合器的名字。

下边的这段 sass 代码，定义了一个非常简单的混合器，目的是添加跨浏览器的圆角边框。

```scss
@mixin rounded-corners {
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
```

在样式表中通过 `@include` 来使用这个混合器。`@include` 标识符会把混合器中的所有样式提取出来放在 `@include` 被调用的地方。

```scss
.button {
  line-height: 20px;
  text-align: center;
  background-color: $primary-color;
  color: #fff;
  padding: 6px 10px;
  @include rounded-corners;
}
```

#### 混合器传参

混合器并不一定总得生成相同的样式。可以通过在 `@include` 调用混合器时给混合器传参，来定制混合器生成的精确样式。参数也是以 `$` 符标识。

```scss
@mixin ellipsis-line($line){
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $line;
}
```

```scss
.description {
  width: 600px;
  height: 100px;
  p {
    @include ellipsis-line(3);
  }
}
```

**多个参数**

当你 `@include` 混合器时，参数过多有时候可能会很难区分每个参数是什么意思，参数之间是一个什么样的顺序。为了解决这个问题，sass 允许通过语法 `$name: value` 的形式指定每个参数的值。这种形式的传参，参数顺序就不重要了，只需要保证没有漏掉参数即可：

```scss
@mixin link-colors($normal, $hover, $visited) {
  color: $normal;
  &:hover { color: $hover; }
  &:visited { color: $visited; }
}
```

```scss
a {
  @include link-colors(
      $normal: blue,
      $visited: green,
      $hover: red
  );
}
```

**默认参数**

为了在 `@include` 混合器时不必传入所有的参数，我们可以给参数指定一个默认值。参数默认值使用 `$name: default-value` 的声明形式，默认值可以是任何有效的 css 属性值，甚至是其他参数的引用。

```scss
@mixin link-colors(
    $normal,
    $hover: $normal,
    $visited: $normal
  )
{
  color: $normal;
  &:hover { color: $hover; }
  &:visited { color: $visited; }
}
```

#### 混合器和 class 选择器的合理使用

混合器的方便实用导致一不小心可能就会被过度使用。大量的重用可能会导致生成的样式表过大，导致加载缓慢。所以要明确混合器的使用场景，避免滥用。

混合器在某些方面跟 css 的 class 选择器很像。都是给一大段样式命名，然后可重复使用。所以在选择使用哪个的时候可能会产生疑惑。

其最重要的区别就是 class 选择器是在 html 文件中应用的，而混合器是在样式表中应用的。这就意味着 class 名具有语义化含义，而不仅仅是一种展示性的描述，它用来描述 html 元素的含义而不是 html 元素的外观。

而另一方面，混合器是展示性的描述，用来描述一条 css 规则应用之后会产生怎样的效果。比如上例中的 `.button` class 名和 `rounded-corners` 混合器的区别。

### 注释

在模块化开发中，多人合作，所以一些公用的文件或代码（变量文件、@mixin文件等）就要写明确的注释，方便合作。而这些注释仅开发人员可见即可，不需要浏览网页源码的人都可见。

因此 sass 另外提供了一种不同于 css 标准注释格式 `/* ... */` 的注释语法，即静默注释，其内容不会出现在生成的 css 文件中。

静默注释以 `//` 开头，注释内容直到行末。

```scss
// 这种注释内容不会出现在生成的css文件中
/* 这种注释内容会出现在生成的css文件中 */
@mixin link-color {}
```
### 导入

模块化开发导入文件是必不可少的。sass 有一个 `@import` 规则，在编译生成css 文件时就会把相关文件导入进来。这意味着所有相关的样式被归纳到了同一个css 文件中，而无需发起额外的下载请求。因此，所有在被导入文件中定义的变量和混合器均可在导入文件中使用。

```scss
/*  variable.scss */
$primary-color: #800080;

/*  index.scss */
@import "variable";
p{
  color: $primary-color;
}
```

以下是不同文件导入的一些用法：

#### 1. 省略 .scss 或 .sass 后缀

使用 sass 的 `@import` 规则并不需要指明被导入文件的全名，可以省略后缀。这样，在不修改样式表的前提下，完全可以随意修改被导入的 sass 样式文件语法，在 sass 和 scss 语法之间随意切换。

#### 2. sass 局部文件，文件名以下划线开头。
    
那些专门为 `@import` 命令而编写的 sass 文件，并不需要编译生成对应的独立 css 文件，这样的 sass 文件称为局部文件。局部文件的文件名以下划线开头。这样，sass 就不会在编译时单独编译这个文件输出 css，而只把这个文件用作导入。以及当你 `@import` 一个局部文件时，还可以省略文件名开头的下划线。

```scss
/*  _mixin.scss */
@mixin xxx(){};

/*  index.scss */
@import "mixin";
p{
  @include();
}
```

#### 3. 默认变量值，!default。

跟 js 一样，在 sass 中反复声明一个变量，只有最后一处声明有效且它会覆盖前边的值。这种情况下如果你写了一个可被他人通过 `@import` 导入的 sass 库文件，并且希望导入者可以定制修改 sass 库文件中的某些值，这时就需要 `!default` 声明变量的默认值。

作用就是：如果这个变量被另外声明赋值了，那就用它声明的值，否则就用这个默认值。

```scss
/*  _variable.scss */
$link-color: pink !default;

/* index.scss */
$link-color: yellow;
@import "variable";
a {
  color:$link-color;
}
```

#### 4. 嵌套导入

sass 允许 `@import` 命令写在 css 规则内。这种导入方式下，生成对应的 css 文件时，局部文件会被直接插入到 css 规则内导入它的地方。

```scss
/* _blue-theme.scss */
aside {
  background: blue;
  color: #fff;
}

/* index.scss */
.blue-theme {@import "blue-theme";}

/* 相当于 */
.blue-theme {
  aside {
    background: blue;
    color: #fff;
  }
}

/* 编译后 */
.blue-theme aside {
  background: blue;
  color: white;
}
```

被导入的局部文件中定义的所有变量和混合器，也会在这个规则范围内生效。这些变量和混合器不会全局有效，这样我们就可以通过嵌套导入只对站点中某一特定区域运用某种颜色主题或其他通过变量配置的样式。

#### 5. 原生 css 导入：以 `.css` 为后缀或者 `url()` 导入

```scss
@import "my.css";

@import url("my.css");
```

css 本身就有特别不常用的 `@import` 规则，它允许在一个 css 文件中导入其他 css 文件。然而，运行原理是只有浏览器解析到 `@import` 时，浏览器才会去下载 `@import` 的 css 文件，这导致页面会多一个请求，文件比较大的话可能加载就会变慢。

不同于 css 的是，sass 的 `@import` 规则，在导入 sass 文件并编译成 css 时就把相关文件导入了进来。这意味着所有相关的样式被归纳到了同一个 css 文件中，而无需发起额外的下载请求。

而以 `.css` 为后缀或者 `url()` 这两种方法导入原生 css 的时候，会在编译完后生成原生 css 的 `@import` 语法，从而导致多了一些网络请求。

```scss
/* my.css */
body {
  background-color: bisque;
}

/* index.scss */
@import "my.css";

/* 编译后 index.css */
@import url(../my.css);
```

<img src="img/1201.jpg" width="750px" alt="网络请求示例图">

因此，由于 sass 的语法完全兼容 css，所以完全可以把原始的 css 文件改名为 `.scss` 后缀，然后直接导入就可以减少多余的网络请求了。

```scss
/* my.scss */
body {
  background-color: bisque;
}

/* index.scss */
@import "my";

/* 编译后 index.css */
body {
  background-color: bisque;
}
```


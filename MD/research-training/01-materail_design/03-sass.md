# Material Design 之 sass 使用



## SASS 之基础语法

- [sass 中文文档](https://www.sass.hk/guide/)


### 变量

sass 最重要的一个特性就是变量。可以把项目中需要反复使用的 css 属性值定义成变量，然后通过变量名来引用它们，而无需重复书写这一属性值。比如项目中用到的色值，这样在项目需要改版的时候可以统一改变颜色风格。

#### 声明与引用

- sass 使用 `$` 符号来标识变量。
- 在声明变量时，变量值也可以引用其他变量。
- 也可定义在 css 规则块内，那么此时该变量只能在此规则块内使用，也就是局部变量。

```css
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

sass 的变量名可以与 css 中的属性名和选择器名称相同，包括中划线和下划线。这两种用法相互兼容。用中划线声明的变量可以使用下划线的方式引用，反之亦然。

```css
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

```css
.content article h1 { color: #333 }
.content article p { margin-bottom: 1.4em }
.content aside { background-color: #EEE }
```

这种情况下，sass 可以使用嵌套语法，然后在编译成 css 时自动把这些嵌套规则处理好，避免重复书写。

```css
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

```css
article a {
  color: blue;
  &:hover { color: red }
}

//编译后

article a { color: blue }
article a:hover { color: red }
```

##### 群组选择器的嵌套

```css
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

```css
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

```css
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

```css
@mixin ellipsis{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

在样式表中通过 `@include` 来使用这个混合器。`@include` 标识符会把混合器中的所有样式提取出来放在 `@include` 被调用的地方。

```css
.description {
  width: 600px;
  height: 100px;
  p {
    @include ellipsis;
  }
}
```

#### 混合器传参

混合器并不一定总得生成相同的样式。可以通过在 `@include` 调用混合器时给混合器传参，来定制混合器生成的精确样式。参数也是以 `$` 符标识。

```css
@mixin ellipsis-line($line){
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $line;
}
```

```css
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

```css
@mixin link-colors($normal, $hover, $visited) {
  color: $normal;
  &:hover { color: $hover; }
  &:visited { color: $visited; }
}
```

```css
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

```css
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

#### 合理使用混合器

混合器的方便实用导致一不小心可能就会被过度使用。大量的重用可能会导致生成的样式表过大，导致加载缓慢。所以要明确混合器的使用场景，避免滥用。

- 判断一组属性是否应该组合成一个混合器，一条经验法则就是你能否为这个混合器想出一个好的名字。


### 注释

在模块化开发中，多人合作，所以一些公用的文件或代码（变量文件、@mixin文件等）就要写明确的注释，方便合作。而这些注释仅开发人员可见即可，不需要浏览网页源码的人都可见。

因此 sass 另外提供了一种不同于 css 标准注释格式 `/* ... */` 的注释语法，即静默注释，其内容不会出现在生成的 css 文件中。

静默注释以 `//` 开头，注释内容直到行末。

```css
// 这种注释内容不会出现在生成的css文件中
/* 这种注释内容会出现在生成的css文件中 */
@mixin link-color {}
```
### 导入

模块化开发导入是必不可少的。




## Material Design 简介

**一个WEB前端开发者眼中的 Material Design。**

### 是什么

- UI 设计语言：跟苹果的设计语言一样，Material Design 是谷歌推出的全新的 UI 设计语言。作为谷歌的官方设计语言，几乎谷歌旗下全线产品在 UI 设计上都大量运用了 Material Design 2。

- 全网可用：Material Design 不仅仅是安卓产品的设计规范和风格，甚至它鼓励设计师和开发者把这种风格用在苹果设备和 windows 设备上。比如网页设计，甚至电脑客户端的 UI 都能运用上 Material Design。

- 本质：Google 发布的 Material Design 语言更像是一套界面设计标准。

### 为什么

安卓是一个基于 Linux 的开源代操作系统，自从谷歌收购了安卓，有了谷歌母公司的资源，安卓的发展就更加有保障，可以说目前除了苹果的 iOS 操作系统之外，其余的几乎全部都是安卓系统。

比如 OPPO、VIVO、魅族、小米、华为、三星，还有一加、锤子、联想等手机品牌。这些手机全部都是使用了 Android 底层构架。就连我们周围的一些智能设备、银行的手写签名系统、ATM机等都大量采用了安卓操作系统。

所以，使用安卓系统的公司杂乱，且没有像苹果一样严格的硬件生产规范，安卓就是一个野蛮生长的市场，造成了安卓屏幕尺寸千奇百怪，屏幕分辨率杂乱无章，并且随着触摸屏的技术发展，安卓的三大主键时有时无。

这些都给安卓的 UI 设计带来了非常复杂的适配性，更不用说同一个项目，苹果端，安卓端甚至桌面端的多端适配。为了用户体验，这些可能都需要不同的设计图来调整一些细节；而对于小公司或个人开发者来说，可能就不得不放弃一部分的用户体验。

所以说，一个适配多端的 UI 设计准则的出现是必然的，这时就出现了 Material Design。

### 干什么

Material Design 出现的目标就是：

- 创建一种优秀的设计原则和科学技术融合的可能性

- 给不同平台带来一致性的体验

- 可以在规范的基础上突出设计者自己的品牌性

所以，Material Design 实质上就是一套谷歌认为比较优秀的设计规范。并且呼吁大家都能按照此规范来设计自己的多端产品。

那么来说说关于设计规范。

所有的设计都是为了辅助产品需求的实现，同时保证用户的优良体验。如果设计仅是为了符合规范，也就失去了设计本质的意义。

因此我们的设计完全可以去借鉴当下使用广泛的应用，比如腾讯系、阿里系的产品，他们广泛的使用所培养的用户操作习惯是根深蒂固，很难被替代的。借鉴他们的某些操作设计可简单的达到我们的目的，也未尝不可。

从这个角度来说，Material Design 只是给广大设计师和开发者们提供了一个选择，而选择的基准还是万年不变的产品需求和用户体验。

### 怎么样

目前主流采取的设计方法有三种：

1. 直接延续 iOS 平台上的设计。直接用给 iPhone 准备的设计稿更改切图的大小即可最快速地得到安卓切图，这种方法简单粗暴，却是目前国内最主要的设计方式。比如微信、支付宝等。

2. 为安卓提供专属的设计稿。这种方式其实也是根据 iPhone 设计稿针对安卓的特点进行微调（比如尺寸、字体等），然后切出相应的图即可。比如网易云音乐。

3. 按照安卓最新的 Material Design 规范来进行单独的安卓版界面设计。比如知乎、印象笔记。

Material Design 还是深受安卓工程师推崇的，并且在国外已经有了非常广泛的应用。然而，在国内由于用户使用习惯、产品功能大而全、对安卓产品不够重视等原因导致 Material Design 在国内的普及还需要相当长的一段时间，毕竟庞大的用户习惯的改变不是一朝一夕的事。甚至阿里的国外版app aliexpress 用了 Material Design 风格。

[国内 Material Design 的使用阻碍](https://www.zhihu.com/question/37376355)。


## Material Design 在 web 端的使用

[Material Design官方](https://www.material.io/develop/)提供了三种平台（IOS、Android、WEB）以及 Flutter 的使用文档。在此主要说明 web 端的使用。

### 使用 CDN 初识 Material Design

首先引入 css 和 js 文件：

```html
<head>
  <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">
  <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
</head>
```

并且推荐使用  Material Icons 。

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
```

这样就完成了资源的引入，接下来可直接在 html 中使用组件。

#### Button 组件

使用详情可参考 [官方开发文档](https://material.io/develop/web/components/buttons/)

1. 基础使用

```html
<button class="mdc-button">Button</button>
```

2. 用户也可直接给 `a` 标签添加 `mdc-button` class 名，可达成一样的效果。

```html
<a class="mdc-button" href="">跳转</a>
```

3. 可通过添加 `mdc-button--unelevated` class名实现实心的按钮。

```html
<button class="mdc-button mdc-button--unelevated">取消</button>
```

4. 给 button 标签添加海拔高度，可通过添加class名 `mdc-button--raised`。

```html
<button class="mdc-button mdc-button--raised">确认</button>
```

5. 添加 `mdc-button--outlined` class 名，可给按钮加边框。

```html
<button class="mdc-button mdc-button--outlined">购买</button>
```

6. 也可给按钮加图标

```html
<button class="mdc-button mdc-button--outlined">
  <i class="material-icons mdc-button__icon" aria-hidden="true">favorite</i>
  <span class="mdc-button__label">Button</span>
</button>
```

7. 按钮的禁用状态，直接给 button 添加 disabled 属性即可。

```html
<button class="mdc-button" disabled>
  <span class="mdc-button__label">Button</span>
</button>
```






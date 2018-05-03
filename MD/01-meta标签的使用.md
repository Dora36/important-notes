## meta 标签的概念

> 元数据（metadata）提供有关页面的元信息。元数据不会显示在页面上，但是对于机器是可读的。
> 典型的情况是，meta 元素被用于规定页面的描述、关键词、文档的作者、最后修改时间以及其他元数据。 标签始终位于 head 元素中。
> 元数据总是以 键/值 对的形式被成对传递的。

## meta 的作用
1. meta 里的数据是供机器解读的，告诉机器该如何解析这个页面。
2. 可以添加服务器发送到浏览器的 http 头部内容。


## meta 的属性
`<meta>` 标签的属性定义了与文档相关联的 键/值 对。

### charset 属性
HTML5中新添加的，用于定义字符集。尽量写在第一行，不然可能会产生乱码。
	<meta charset="UTF-8">  

### content 属性
当 meta 有 http-equiv 或 name 属性时，一定要有 content 属性对其进行说明。

### http-equiv 属性
http-equiv 属性是添加http头部内容的。该属性为 键/值 对提供了键名。并指示服务器在发送实际的文档之前先在要传送给浏览器的 MIME 文档头部包含该 键/值 对。
1. content-type：设定网页类型，设置字符集，适用于旧的HTML版本，推荐使用charset属性。
   	<meta http-equiv="content-Type" content="text/html;charset=utf-8">
2. X-UA-Compatible：浏览器采取何种版本渲染当前页面，一般都设置为最新模式。
   	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
3. refresh：重定向页面，content 中的数字表示秒数，如果没有url，表示刷新页面；有url，表示5秒后重定向至新的网址。
   	<meta http-equiv="refresh" content="5;url=https://www.baidu.com">
4. cache-control
   - 指定请求和响应遵循的缓存机制
     	<meta http-equiv="cache-control" content="no-cache">
     content 参数：
     - no-cache：浏览器和缓存服务器都不应该缓存页面信息。
     - no-store：请求和响应的信息都不应该被存储在对方的磁盘系统中。
     - public：缓存所有相应，但并非必须。因为 max-age 也可以做到相同效果。
     - private：只为单个用户缓存。
     - maxage：表示当前请求开始，该响应在多久内能被缓存和重用，而不去服务器重新请求。数字代表秒数。例如：max-age=60 表示响应可以再缓存和重用 60 秒。

   - 禁止百度自动转码：禁止当前页面在移动端浏览时，被百度自动转码，不过不保证100%禁止。
     	<meta http-equiv="cache-control" content="no-siteapp">
     	<meta http-equiv="cache-control" content="no-transform">
5. pragma：cache模式，禁止缓存，无法脱机浏览。
   	<meta http-equiv="pragma" content="no-cache">
6. expires：网页到期时间，过期后必须到服务器上重新传输。必须使用 GMT 时间格式，或直接设为0。
   	<meta http-equiv="expires" content="0">


### name 属性
name 属性是供浏览器进行解析。没有指定具体的值，通常情况下，可以自由使用对自己和源文档的读者来说富有意义的名称。前提是浏览器能够解析写进去的name属性才可以，不然就是没有意义的。
1. renderer：这个meta标签的意思就是告诉浏览器，用webkit内核进行解析，当然前提是浏览器有webkit内核才可以。这个 renderer 是在360浏览器里说明的。[360浏览器meta文档说明](http://se.360.cn/v6/help/meta.html)
   	<meta name="renderer" content="webkit|ie-comp|ie-stand">
2. generator：网站的制作软件。
3. copyright：网站的版权信息。
4. revisit-after：网站重访天数。




## SEO 优化部分的 meta

### robots
定义网页搜索引擎爬虫的索引方式，告诉爬虫哪些页面需要索引，哪些不需要索引。
	<meta name="robots" content="index,follow">

content 参数：
- all：默认值，等价于index + follow。
- index：索引此网页。
- follow：继续通过此网页的链接索引搜索其它的网页。
- noindex：不索引此网页。
- nofollow：不继续通过此网页的链接索引搜索其它的网页。
- none：等价于noindex + nofollow。

### 其它
	<!-- keywords 页面关键字(因为被滥用，SEO 已经取消了关键字搜索了) -->
	<meta name="keywords" content="word1,word2,word3"
	<!-- description 页面内容描述 -->
	<meta name="description" content="ye mian miao shu">
	<!-- author 定义网页作者 -->
	<meta name="author" content="Dora">



## 移动端常用的 meta

### viewport
viewport 主要是影响移动端页面布局的
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0">
content 参数：
- width：viewport 宽度，数值 device-width
- height：viewport 高度，数值 device-height
- initial-scale：初始缩放比例
- maximum-scale：最大缩放比例
- minimum-scale：最小缩放比例
- user-scalable：是否允许用户缩放，数值 yes / no


### 其它
	<!-- 忽略页面中的数字识别为电话，忽略email识别 -->
	<meta name="format-detection" content="telphone=no, email=no">
	<!-- windows phone 点击无高光 -->
	<meta name="msapplication-tap-highlight" content="no">




## 各浏览器平台的 meta

### IE
	<!-- 优先使用最新的 ie 版本，避免使用兼容模式 -->
	<meta http-equiv="x-ua-compatible" content="ie=edge">


### Google Chrome
	<!-- 优先使用最新的 Chrome 版本 -->
	<meta http-equiv="x-ua-compatible" content="chrome=1">
	<!-- 禁止自动翻译 -->
	<meta name="google" value="notranslate">


### 360 浏览器
	<!-- 选择360浏览器的解析内核，启用 webkit 极速模式 -->
	<meta name="rederer" content="webkit">

### UC 手机浏览器
	<!-- 将屏幕锁定在特定的方向 -->
	<meta name="screen-orientation" content="landscape|portrait">
	<!-- 强制全屏 -->
	<meta name="full-screen" content="yes">
	<!-- 强制图片显示，即使是“text mode" -->
	<meta name="imagemode" content="force">
	<!-- 应用模式显示，默认全屏，禁止长按菜单，禁止手势，标准排版，强制图片显示。 -->
	<meta name="browsermode" content="application">
	<!-- 禁止夜间模式显示 -->
	<meta name="nightmode" content="disable">
	<!-- 使用适屏模式显示 -->
	<meta name="layoutmode" content="fitscreen">
	<!-- 当页面有太多文字时禁止缩放 -->
	<meta name="wap-font-scale" content="no">


### QQ 手机浏览器
	<!-- 将屏幕锁定在特定方向 -->
	<meta name="x5-orientation" content="landscape|portrait">
	<!-- 强制全屏 -->
	<meta name="x5-fullscreen" content="true">
	<!-- 页面以应用模式显示 -->
	<meta name="x5-page-mode" content="app">


### Apple 的 IOS
	<!-- Add to Home Screen添加到主屏 -->
	<!-- 是否启用 WebApp 全屏模式，删除苹果默认的工具栏和菜单栏 -->
	<meta name="apple-mobile-web-app-capable" content="yes">
	<!-- 设置状态栏的背景颜色,只有在 “apple-mobile-web-app-capable” content=”yes” 时生效 -->
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<!-- 添加到主屏后的标题 -->
	<meta name="apple-mobile-web-app-title" content="App Title">




















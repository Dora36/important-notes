## vue-router 的基础配置

基础配置需要将组件 (components) 映射到路由 (routes)，然后告诉 Vue Router 在哪里渲染它们。

**渲染位置**

- `<router-link>`：使用 `router-link` 组件来导航，默认会被渲染成一个 `<a>` 标签，通过传入 `to` 属性指定链接。

- `<router-view>`：路由出口，路由匹配到的组件将渲染在这里。

```html
<router-link to="/">Home</router-link>
<router-link to="/about">About</router-link>

<router-view></router-view>
```

**路由映射步骤**

- 1. 导入组件。可以是通过 `Vue.extend()` 创建的组件构造器，或者，只是一个组件配置对象。

- 2. 定义路由。定义 `routes` 数组，其中每个路由应该映射一个组件，即 `path` 和 `component` 是必须有的，其它选项可选。

- 3. 创建 `router` 实例。向 VueRouter 构造函数中的 `routes` 选项传入上面定义的路由配置数组。

- 4. 将路由实例挂载到根实例上。向 Vue 构造函数的参数中的 `router` 选项注入创建的 `router` 实例，从而让整个应用都有路由功能。

```js
// @/router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: () => import('@/views/About.vue') }
]

const router = new VueRouter({
  routes
})

export default router
```

```js
// main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

**组件中访问路由**

通过在根实例中注入路由实例，即可在任何组件内通过 `this.$router` 访问路由实例，也可以通过 `this.$route` 访问当前路由：

```js
mounted() {
  console.log(this.$route);   // 当前路由配置信息
  console.log(this.$router);  // 路由器
}
```

## 路由模式

`vue-router` 默认 `hash` 模式。可以通过 `mode` 属性使用路由的 `history` 模式。`history` 模式需要后台配置支持。

```js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

### 两种路由模式的实现原理

`hash` 模式和 `history` 模式都属于浏览器自身的特性，Vue-Router 只是通过调用浏览器提供的接口利用了这两个特性来实现前端路由。前端路由的核心，就在于 —— 改变视图的同时不会向后端发出请求。

- `hash`：hash 值就是 url 中从 `#` 号开始到结束的部分。hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，即仅 hash 符号之前的内容会被包含在请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。hash 值变化浏览器不会重新发起请求，但是会触发 `window.onhashchange` 事件。

- `history`：利用了 HTML5 中新增的 `pushState()` 和 `replaceState()` 方法和 `popstate` 事件。提供了对历史记录进行修改的功能，并且当它们执行修改时，虽然改变了当前的 URL，但浏览器不会立即向后端发送请求。然而刷新的时候，就会向后端发送请求了。

### hash 和 history 模式的区别

- url 显示：`hash` 有 `#` 号；`history` 则正常路径符 `/` 显示

- 页面刷新：`hash` 向后端发请求时，不带 `#` 号之后的部分，因此可以加载到对应页面；`history` 则通过全路径向后端发送请求，如果后端不配置匹配路由，就会 404。

- 兼容性：`hash` 支持低版本浏览器；而 `history` 用的是 HTML5 推出的新 API，对浏览器有兼容性要求，特别需要注意微信等一些内嵌的浏览器。

- 第三方 sdk 功能：例如微信回调或 gitlab 回调配置，带 `#` 号的 url 可能会有问题。

## 路由数组 routes 的配置

`routes` 配置数组中的每个路由对象称为 **路由记录**。路由记录会暴露为 `$route` 对象，在组件中可访问。

- `path`：路由路径，总是解析为绝对路径。
- `query`：一个 key/value 对象，表示 URL 查询参数，如果没有查询参数，则是个空对象。
- `hash`：当前路由的 hash 值 (带 #) ，如果没有 hash 值，则为空字符串。
- `fullPath`：完成解析后的 URL，包含查询参数和 hash 的完整路径。

- `component`：单个组件。
- `components`：同个路由，多个视图组件。

- `name`：路由命名。
- `children`：嵌套路由。
- `params`：参数，一个 key/value 对象，包含了动态片段和全匹配片段，如果没有路由参数，就是一个空对象。
- `redirect`：重定向。
- `alias`：别名。
- `props`：路由组件传参，解除与 $route 的耦合
- `meta`：路由元信息。
- `matched`：一个数组，包含当前路由的所有嵌套路径片段的路由记录。

### path

**动态路由匹配**

如果需要把某种模式匹配到的所有路由，全都映射到同个组件，即可使用“动态路径参数”来达到这个效果。

动态路径参数用冒号 `:` 标记：

```js
const router = new VueRouter({
  routes: [
    // :id  就是动态路径参数
    { path: '/user/:id', component: User }
  ]
})
```

上例中像 `/user/foo` 和 `/user/bar` 的路由都将映射到 `User` 组件。当匹配到一个路由时，`:` 后面的参数值会被设置到 `this.$route.params` 中，就可以在每个组件内使用了。

```html
<!-- User.vue -->
<template>
  <div>
    <p>{{$route.params.id}}</p>
  </div>
</template>
```

**动态路由切换**

当使用路由参数时，例如从 `/user/foo` 导航到 `/user/bar`，原来的组件实例会被 **复用**。这也就意味着组件的生命周期钩子不会再被调用。

这种情况下，如果复用组件时，需要对路由参数的变化作出响应的话，可以在组件中 `watch` 监测 `$route` 对象的变化而做一些处理，或者使用 `beforeRouteUpdate` 导航守卫：

```js
// User.vue
export default { 
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
    }
  }
}
// or
export default {
  beforeRouteUpdate (to, from, next) {
    // 对路由变化作出响应...
    next()
  }
}
```

**`*` 捕获所有路由**

常规参数只会匹配被 `/` 分隔的 URL 片段中的字符。如果想匹配任意路径，可以使用通配符 `*`：

```js
{ path: '*' }         // 会匹配所有路径 
{ path: '/user-*' }   // 会匹配以 `/user-` 开头的任意路径
```

含有通配符的路由应该放在最后。路由 `{ path: '*' }` 通常用于客户端 404 错误。

当使用通配符时，`$route.params` 内会自动添加 `pathMatch` 参数。它包含了 URL 通过通配符被匹配的部分：

```js
// 给出一个路由 { path: '/user-*' }
this.$router.push('/user-admin')
this.$route.params.pathMatch       // 'admin'
// 给出一个路由 { path: '*' }
this.$router.push('/non-existing')
this.$route.params.pathMatch       // '/non-existing'
```

**匹配优先级**

有时候，同一个路径可以匹配多个路由，此时，匹配的优先级就按照路由的定义顺序：谁先定义的，谁的优先级就最高。

**高级正则匹配**

`vue-router` 使用 `path-to-regexp` 作为路径匹配引擎，所以支持很多高级的匹配模式，例如：可选的动态路径参数、匹配零个或多个、一个或多个，甚至是自定义正则匹配。

```js
{ path: '/user/:id?' }          // ? 号表示参数 id 可有可无
{ path: '/user/:id(\\d+)' }     // 可在参数后面的 () 圆括号中使用 正则表达式 来匹配参数的规则
{ path: '/user/(foo/)?bar' }    // () 圆括号和 ? 号表示括号内的路径可有可无
```

### children 嵌套路由

拥有嵌套路由的父路由的组件需要使用 `<router-view>` 路由视图来渲染嵌套的路由组件。

```html
<!-- User.vue -->
<template>
  <div>
    <p>{{$route.params.id}}</p>
    <router-view></router-view>
  </div>
</template>
```

嵌套路由的 `children` 配置：

```js
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        { path: '', component: UserHome },           // 匹配 /user/:id
        { path: 'profile', component: UserProfile }, // 匹配 /user/:id/profile 
        { path: 'posts', component: UserPosts }      // 匹配 /user/:id/posts 
      ]
    }
  ]
})
```

以 `/` 开头的嵌套路径会被当作根路径，因此，正常的嵌套路径，不需要写 `/`。 

### name 命名路由

有时候，通过一个名称来标识一个路由显得更方便一些，特别是在链接一个路由，或者是执行一些跳转时需要传参的时候。

通过 `params` 传参时，使用 `path` 跳转会获取不到 `params` 的值，此时就需要使用 `name` 跳转。

```js
const router = new VueRouter({
  routes: [
    { path: '/user/:userId', name: 'user', component: User }
  ]
})
```

要链接到一个命名路由，可以给 `router-link` 的 `to` 属性传一个对象：

```html
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

或调用 `router.push()`：

```js
router.push({ name: 'user', params: { userId: 123 }})
```

### components 命名视图

如果需要同级展示多个视图，而不是嵌套展示时，就需要使用命名视图。可以通过给 `router-view` 设置 `name` 属性，使得界面中拥有多个单独命名的视图出口，而不是只有一个出口。没有设置 `name` 属性的 `router-view`，其默认为 `default`。

```html
<router-view></router-view>
<router-view name="a"></router-view>
<router-view name="b"></router-view>
```

一个视图使用一个组件渲染，对于同个路由，多个视图就需要多个组件。此时就需要 `components` 配置 (带上 `s`)：

```js
const router = new VueRouter({
  routes: [
    { path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

### redirect 重定向

重定向的意思是，当用户访问 `/a` 时，URL 将会被替换成 `/b`，然后匹配路由为 `/b` 的组件。

重定向的配置可以是 路径 字符串，或者是 name 命名路由的对象，也可以是一个方法，动态返回重定向目标：

```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' },
    { path: '/a', redirect: { name: 'foo' }},
    { path: '/a', redirect: to => {
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
    }}
  ]
})
```

注意导航守卫并没有应用在跳转路由上，而仅仅应用在其目标上。在这个例子中，为 `/a` 路由添加一个 `beforeEach` 或 `beforeLeave` 守卫并不会有任何效果。

### alias 别名

`/a` 的别名是 `/b`，意味着，当用户访问 `/b` 时，URL 会保持为 `/b`，但是路由匹配则为 `/a`，就像用户访问 `/a` 一样。

```js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

### matched 数组和 meta 元信息字段

定义路由的时候可以配置 `meta` 字段：

```js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo,
      children: [
        { path: 'bar', component: Bar, meta: { requiresAuth: true } }
      ]
    }
  ]
})
```

路由记录可以是嵌套的，因此，当一个路由匹配成功后，他可能匹配多个路由记录。一个路由匹配到的所有路由记录会暴露为 `$route` 对象 (还有在导航守卫中的路由对象) 的 `$route.matched` 数组。因此，可以通过遍历 `$route.matched` 来获取路由记录中的 `meta` 字段：

```js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 该路由需要登陆，如果没有登陆，则跳转到登陆页面
    if (!auth.loggedIn()) {  
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
```


## $route

因为路由记录可以嵌套，因此，一个路由可能匹配多个路由记录 —— 父路由记录以及子路由记录。一个路由匹配到的所有路由记录会暴露为 `$route` 对象 (还有在导航守卫中的路由对象) 的 `$route.matched` 数组。

## $router

在 Vue 实例内部，可以通过 `$router` 访问路由实例。

### router.push()

这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。

当点击 `<router-link>` 时，这个方法会在内部调用，所以说，点击 `<router-link :to="...">` 等同于调用 `router.push(...)`。

该方法的参数可以是一个字符串路径，或者一个对象。

```js
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由，如果提供了 path，params 会被忽略，因此需要使用 name
router.push({ name: 'user', params: { userId: '123' }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```

**params 传参**

使用 `params` 传参，如果提供了 `path`，`params` 将会被忽略。此时，可以使用路由的 `name` 或手写完整的带有参数的 `path`：

```js
const userId = '123'
router.push({ name: 'user', params: { userId }})  // -> /user/123
router.push({ path: `/user/${userId}` })          // -> /user/123
```

### router.replace()

跟 `router.push` 很像，唯一的不同就是，它不会向 history 添加新记录，而是替换掉当前的 history 记录。等同于 `<router-link :to="..." replace>`

**onComplete 和 onAbort 回调**

在 `router.push` 或 `router.replace` 中提供 `onComplete` 和 `onAbort` 回调作为可选的第二个和第三个参数。这些回调将会在导航成功完成 (在所有的异步钩子被解析之后) 或终止 (导航到相同的路由、或在当前导航完成之前导航到另一个不同的路由) 的时候进行相应的调用。

### router.go(n)

这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 `window.history.go(n)`。

Vue Router 的导航方法 (`push`、 `replace`、 `go`) 在各类路由模式 (`history`、 `hash` 和 `abstract`) 下表现一致。











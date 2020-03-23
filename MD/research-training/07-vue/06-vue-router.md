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

## 导航守卫

vue-router 提供的导航守卫主要用来通过跳转或取消的方式守卫导航。有多种机会植入路由导航过程中：全局的，单个路由独享的，或者组件级的。

记住参数 params 或查询 query 的改变并不会触发进入/离开的导航守卫。你可以通过观察 `$route` 对象来应对这些变化，或使用 `beforeRouteUpdate` 的组件内守卫。

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于等待中。

### 守卫方法的参数

- `to`：即将要进入的目标路由对象，类似于 `$route`。

- `from`：当前导航正要离开的路由。

- `next`：一个函数，必须通过调用该方法来 `resolve` 这个钩子。执行效果依赖 `next` 方法的调用参数。

  - `next()`：进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。

  - `next(false)`：中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。

  - `next('/')` 或者 `next({ path: '/' })`：跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 `next` 传递任意位置对象，且允许设置诸如 `replace: true`、`name: 'home'` 之类的选项以及任何用在 `router-link` 的 `to` `prop` 或 `router.push` 中的选项。

  - `next(error)`：如果传入 `next` 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 `router.onError()` 注册过的回调。

### 守卫接口

- 全局前置守卫 `router.beforeEach`

- 全局解析守卫 `router.beforeResolve`

- 全局后置钩子 `router.afterEach`：和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身。

- 路由独享的守卫 `beforeEnter`

    ```js
    const router = new VueRouter({
      routes: [
        {
          path: '/foo',
          component: Foo,
          beforeEnter: (to, from, next) => {
            // ...
          }
        }
      ]
    })
    ```

- 组件内的守卫 

  - `beforeRouteEnter`：在渲染该组件的对应路由被 confirm 前调用，**不能** 获取组件实例 `this`，因为当守卫执行前，组件实例还没被创建。但是可以通过传一个回调给 `next` 来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。
  - `beforeRouteUpdate`：在当前路由改变，但是该组件被复用时调用。举例来说，对于一个带有动态参数的路径 `/foo/:id`，在 `/foo/1` 和 `/foo/2` 之间跳转的时候，由于会渲染同样的 `Foo` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。可以访问组件实例 `this`。
  - `beforeRouteLeave`：导航离开该组件的对应路由时调用，可以访问组件实例 `this`。

```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}
```

### 完整的导航解析流程

- 1. 导航被触发。
- 2. 在失活的组件里调用离开守卫 `beforeRouteLeave`。
- 3. 调用全局的 `beforeEach` 守卫。
- 4. 在重用的组件里调用 `beforeRouteUpdate` 守卫。
- 5. 在路由配置里调用 `beforeEnter`。
- 6. 解析异步路由组件。
- 7. 在被激活的组件里调用 `beforeRouteEnter`。
- 8. 调用全局的 `beforeResolve` 守卫。
- 9. 导航被确认。
- 10. 调用全局的 `afterEach` 钩子。
- 11. 触发 DOM 更新。
- 12. 用创建好的实例调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数。

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

### router.addRoutes()

动态添加更多的路由规则。参数必须是一个符合 `routes` 选项要求的数组。

```js
router.addRoutes(routes)
```

## 其它配置

### 滚动行为

当切换到新路由时，可以设置页面滚动条滚到顶部，或者是保持原先的滚动位置。

这个功能只在支持 `history.pushState` 的浏览器中可用。

当创建一个 `Router` 实例，可以提供一个 `scrollBehavior` 方法：

```js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置 
    if (savedPosition) {
      return savedPosition     // 在按下 后退/前进 按钮时，就会像浏览器的原生表现一样
    } else {
      return { x: 0, y: 0 }    // 让页面滚动到顶部。
    }
  }
})
```

`scrollBehavior` 方法接收 `to` 和 `from` 路由对象。第三个参数 `savedPosition` 当且仅当 `popstate` 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。

return 的值可为：

- `{ x: number, y: number }`

- 如果返回一个 falsy 的值，或者是一个空对象，那么维持当前滚动状态。

- `{ selector: string, offset? : { x: number, y: number }}`

### 路由懒加载

当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。

**自动代码分割**

```js
const Foo = () => import('./Foo.vue')  // 返回 Promise，能够被 Webpack 自动代码分割的异步组件。
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```

**把组件按组分块**

Webpack 会将任何一个异步模块与相同的块名称组合到相同的异步块中。

```js
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

也可直接在 component 中写：

```js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: () => import(/* webpackChunkName: "foo" */ '../views/Foo.vue') }
  ]
})
```

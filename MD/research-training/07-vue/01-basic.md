## Vue 实例

### 响应式

只有当实例被创建时就已经存在于 `data` 中的属性才是 **响应式** 的。

```js
new Vue({
  el: '#app',
  data: {
    a: 1
  }
})
```

## 模版语法

### 动态绑定属性

```html
<a v-bind:[attributeName]="url" v-on:[eventName]="doSomething"> ... </a>
```

```js
data(){
  attributeName: 'href',
  eventName: 'focus',
}
```

动态参数预期会求出一个字符串，异常情况下值为 `null`。这个特殊的 `null` 值可以被显性地用于移除绑定。任何其它非字符串类型的值都将会触发一个警告。

在 HTML 文件里使用 vue 时，需要避免使用大写字符来命名键名，因为浏览器会把 attribute 名全部强制转为小写。

### 指令

#### v-bind

v-bind 指令用于响应式地更新 HTML 的属性，即属性值可以使用变量或表达式。

```html
<!-- 完整语法 -->
<a v-bind:href="url">...</a>

<!-- 缩写 -->
<a :href="url">...</a>

<!-- 动态参数的缩写 (2.6.0+) -->
<a :[key]="url"> ... </a>
```

#### v-on

```html
<!-- 完整语法 -->
<a v-on:click="doSomething">...</a>

<!-- 缩写 -->
<a @click="doSomething">...</a>

<!-- 动态参数的缩写 (2.6.0+) -->
<a @[event]="doSomething"> ... </a>
```

## 计算属性的缓存

计算属性是基于它们的响应式依赖进行缓存的。只在相关响应式依赖发生改变时它们才会重新求值。

```js
computed: {
  reversedMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
```

上述示例意味着只要 `message` 还没有发生改变，多次访问 `reversedMessage` 计算属性会立即返回之前的计算结果，而不必再次执行函数。

所以对于不是响应式依赖的计算属性，就不会得到想要的结果，如：

```js
computed: {
  now: function () {
    return Date.now()
  }
}
```

因为 `Date.now()` 不是响应式依赖。

## 组件上的 class

当在一个自定义组件上使用 class 属性时，这些 class 将被添加到该组件的根元素上面。这个元素上已经存在的 class 不会被覆盖。对于带数据绑定 class 也同样适用。

```js
Vue.component('my-component', {
  template: '<p class="hi">Hi</p>'
})
```

```html
<my-component class="hello"></my-component>
```

最终，HTML 将被渲染为：

```html
<p class="hi hello">Hi</p>
```

## v-if 

### 使用 key 管理可复用的元素

在 v-if 切换元素块的时候，对于一些相同的元素，vue 会复用已有的元素，而不会使用新的元素：

```html
<p v-if="loginType === 'username'">
  <label>用户名：</label>
  <input placeholder="输入用户名">
</p>
<p v-else>
  <label>邮箱：</label>
  <input placeholder="输入邮箱地址">
</p>
```

在上面的代码中切换 `loginType` 将不会清除用户已经输入的内容。因为两个模板使用了相同的元素，在切换的时候 `<input>` 不会被替换掉，仅仅会替换它的 `placeholder`。

此时，只需要添加一个具有唯一值的 `key` 属性来表明“这两个元素是完全独立的，不要复用它们”。

```html
<p v-if="loginType === 'username'" key="username-input">
  <label>用户名：</label>
  <input placeholder="输入用户名">
</p>
<p v-else>
  <label>邮箱：</label>
  <input placeholder="输入邮箱地址" key="email-input">
</p>
```

上述代码，将会得到想要的结果，在切换的时候，输入框的值就会清空。而 `<label>` 元素仍然会被高效地复用，因为它们没有添加 `key` 属性。

### 与 v-show 的区别

`v-if` 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。`v-if` 也是惰性的，如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

而 `v-show` 就简单得多，不管初始条件是什么，元素总是会被渲染并保留在 DOM 中。`v-show` 只是简单地切换元素的 CSS 属性 `display`。

```html
<p v-show="loginType === 'username'">
  <label>用户名：</label>
  <input placeholder="输入用户名">
</p>
<p v-show="loginType === 'email'">
  <label>邮箱：</label>
  <input placeholder="输入邮箱地址">
</p>
```

因此，对于上述同一个示例，会有三种不同的展现：

- 不含 `key` 属性的 `v-if` 在切换的时候，用户名和邮箱会共用同一个 `input` 元素，因此造成切换的时候，用户输入的内容会被保留，用户名和邮箱会相互影响。

- 含有 `key` 属性的 `v-if` 在切换的时候，`input` 都会被清空，再次切换回之前的类型，之前输入的内容也会被清空。

- `v-show` 在切换的时候，只是切换 css 的 `display`，因此，用户名和邮箱的 `input` 会分别渲染，不会相互影响，而其各自的输入内容都会被保留，再次切换回来的时候，之前输入的值还存在。

一般来说，`v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 `v-show` 较好；如果在运行时条件很少改变，则使用 `v-if` 较好。

## v-for

### 不能检测到数组变动的语法

- 用下标直接设置某一项的值：`this.dataLists[index] = newValue`

- 修改数组的长度：`this.dataLists.length = newLength`

**解决办法：**

修改某一项的值可以使用 `set` 方法：

```js
Vue.set(this.dataLists, index, newValue);
// or
this.$set(this.dataLists, index, newValue);
```

也可使用 `splice` 修改某一项的值，或改变数组的长度。

```js
this.dataLists.splice(index, 1, newValue);
this.dataLists.splice(newLength);
```

### 不能检测对象属性的添加或删除

对于已经创建的实例，Vue 不允许动态添加根级别的响应式属性。但是，可以使用 `Vue.set(object, propertyName, value)` 方法向嵌套对象添加响应式属性。

```js
data: {
  userProfile: {
    name: 'Dora'
  }
}
```

添加新的响应式属性：

```js
Vue.set(this.userProfile, 'age', 18);
// or
this.$set(this.userProfile, 'age', 18);
```

当需要添加多个属性时，可以使用 `Object.assign` 重新赋值。

```js
this.userProfile = Object.assign({}, this.userProfile, {
  age: 18,
  favoriteColor: 'Green'
})
```

### v-for 可使用方法返回的数组

可用于嵌套的 `v-for` 循环中。

```html
<div v-for="item in dataList" :key="item.type">
  <p v-for="(n,idx) in even(item.numbers)" :key="idx">
    {{n}}
  </p>
</div>
```

```js
data: {
  dataList: [
    { type: "a", numbers: [1, 2, 4, 5] },
    { type: "b", numbers: [3, 4, 2, 1] }
  ]
},
methods: {
  even: function (numbers) {
    return numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

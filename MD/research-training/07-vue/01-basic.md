## 响应式

只有当实例被创建时就已经存在于 `data` 中的属性才是 **响应式** 的。

```js
new Vue({
  el: '#app',
  data: {
    a: 1
  }
})
```

## 动态绑定属性

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

## v-bind

`v-bind` 指令用于响应式地更新 HTML 的属性，即属性值可以使用变量或表达式。

```html
<!-- 完整语法 -->
<a v-bind:href="url">...</a>

<!-- 缩写 -->
<a :href="url">...</a>

<!-- 动态参数的缩写 (2.6.0+) -->
<a :[key]="url"> ... </a>
```

## v-on

```html
<!-- 完整语法 -->
<a v-on:click="doSomething">...</a>

<!-- 缩写 -->
<a @click="doSomething">...</a>

<!-- 动态参数的缩写 (2.6.0+) -->
<a @[event]="doSomething"> ... </a>
```

### 事件中的 event

**直接绑定**

```html
<!-- 直接绑定一个方法名 -->
<input type="text" :value="textValue" @input="textInput">
```

```js
methods: {
  textInput(event){
    // `event` 是原生 DOM 事件
    this.textValue = $event.target.value
  }
}
```

**内联方法调用传参**

```html
<!-- 在内联 js 语句中调用方法并传参 -->
<div @click="greet('hi', $event)"></div>
```

```js
methods: {
  greet: function (msg, event) {
    if (event) {
      console.log(event.target.tagName + ' say ' + msg);
    }
  }
}
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

## v-model 表单输入绑定

可以用 `v-model` 指令在表单 `<input>`、`<textarea>` 及 `<select>` 元素上创建双向数据绑定。它会根据控件类型自动选取正确的方法来更新元素。

但 `v-model` 本质上不过是语法糖。它负责监听用户的输入事件以更新数据，并对一些极端场景进行一些特殊处理。

`v-model` 会忽略所有表单元素的 `value`、`checked`、`selected` 属性的初始值而总是将 Vue 实例的数据作为数据来源。因此应该在组件的 data 选项中声明初始值，即 `v-model` 的属性值。

### `v-model` 原理

`v-model` 在内部为不同的输入元素使用不同的属性并抛出不同的事件：

- `text` 和 `textarea` 元素通过 `input` 事件改变 `value` 属性并返回 `value` 属性的值；
- `checkbox` 和 `radio` 通过 `change` 事件改变选项的 `checked` 属性，并返回选中的 `value` 属性的值；
- `select` 元素通过 `change` 事件改变 `option` 的 `selected` 属性，并返回 `option` 标签的 `value` 值或标签内容。

### radio 单选按钮

```html
<div>
  <input type="radio" id="one" value="One" v-model="picked">
  <label for="one">One</label>
  <br>
  <input type="radio" id="two" value="Two" v-model="picked">
  <label for="two">Two</label>
  <br>
  <span>Picked: {{ picked }}</span>
</div>
```

```js
data(){
  return {
    picked: '',
  }
}
```

`v-model` 返回选中的选项的 `value` 值。同一组的单选选项必须有一样的 `v-model` 变量，且如果要设默认选中的值，只需在 `data` 中将 `v-model` 的初始值设为要选中的选项的 `value` 值即可。

### checkbox 复选框

**只有一个复选框时**

只有一个复选框时，`v-model` 绑定的初始值如果为基本类型的值，则切换状态时，`v-model` 返回布尔值类型。即复选框选中时，`v-model` 的值为 `true`；取消选中时，`v-model` 的值为 `false`。且如果初始值的类型为 truthy 时，复选框时选中状态。

如果 `v-model` 绑定的初始值为数组类型时，`v-model` 返回复选框的 `value` 属性的值。即选中时，会向数组中 `push` 复选框 `value` 的值，取消选中时，删掉数组中 `value` 的值。

**多个复选框时**

多个复选框时，`v-model` 绑定值为一个数组，且初始值必须为数组类型。

```html
<div>
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
</div>
```

```js
data(){
  return {
    checkedNames: [],
  }
}
```

选中时，会向数组中 `push` 选中项的 `value` 值。且如果选项的 `value` 值存在于初始值数组中，则这个选项就是默认选中状态。

### select 下拉框

**单选时**

```html
<div>
  <select v-model="selected">
    <option disabled value="">请选择</option>
    <option value="aaa">A</option>
    <option>B</option>
    <option>C</option>
  </select>
</div>
```

```js
data(){
  return {
    selected: '',
  }
}
```

返回选中的 `option` 选项的 `value` 值；或没有 `value` 属性时，返回 `option` 标签的内容。`v-model` 的初始值可匹配任何选项的 `value` 或 `option` 标签内容作为默认选中的选项。

上例中，初始值为空字符串，匹配到第一个 `value` 为空的 `option` 选项。而如果初始值未能匹配任何选项，`<select>` 元素将被渲染为“未选中”状态。此时用户无法选择第一个选项，且不会触发 `change` 事件。因此建议，可以像上例一样提供一个值为空的禁用选项；或者初始值要始终匹配到一个默认值。

**多选时**

```html
<div>
  <select v-model="selected" multiple style="width:50px">
    <option value="aaa">A</option>
    <option>B</option>
    <option>C</option>
  </select>
</div>
```

```js
data(){
  return {
    selected: [],
  }
}
```

`v-model` 的初始值必须是数组类型。且无论选中的顺序如何，数组都是按照 `option` 标签的顺序排列的选中项。

### v-model 修饰符

#### `.lazy`

在默认情况下，`v-model` 在每次 `input` 事件触发后将输入框的值与数据进行同步，可以添加 `lazy` 修饰符，从而转变为使用 `change` 事件进行同步。

```html
<!-- 在“change”时而非“input”时更新 -->
<input v-model.lazy="msg" >
```

#### `.number`

自动将用户的输入值转为数值类型，如果这个值无法被 `parseFloat()` 解析，则会返回原始的值。

```html
<input v-model.number="age" type="number">
```

这通常很有用，因为即使在 `type="number"` 时，HTML 输入元素的值也总会返回字符串。

#### `.trim`

可以自动过滤用户输入的首尾空白字符。

```html
<input v-model.trim="msg">
```

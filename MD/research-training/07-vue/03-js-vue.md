## mixin 混入

使用混入就可以在多个组件中使用相同的功能，也就是把多个组件的相同功能提取成公用的对象。

混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

### 选项合并

当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”：

- 数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。

- 同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。

- 值为对象的选项，例如 `methods`、`components` 和 `directives`，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。

```js
// @/mixins/basic.js
export default {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}
```

```js
// Home.vue
import BasicMixins from '@/mixins/basic';

export default {
  mixins: [BasicMixins],
  created(){
    console.log('form home');
  },
}

// hello from mixin!
// form home
```

### 局部注册

使用组件的 `mixins` 选项进行局部注册，`mixins` 选项接收一个混入对象的数组。按照传入顺序依次调用，并在调用组件自身的钩子之前被调用。

```js
import mixin1 from '@/mixins/mixin1';
import mixin2 from '@/mixins/mixin2';

export default {
  mixins: [mixin1, mixin2],
}
```

### 全局注册

使用 `Vue.mixin()` 可以进行全局注册。一旦使用全局混入，将会影响每一个之后创建的 Vue 实例。**最好不要使用全局混入。**

全局注册可以用来为自定义选项注入处理逻辑。但由于它会影响每个单独创建的 Vue 实例 (包括第三方组件)。因此大多数情况下，推荐同样的功能可以使用插件来发布，以避免重复应用混入。

```js
// @/mixins/globals.js
import Vue from 'vue'

Vue.mixin({
  created: function () {
    let myOption = this.$options.myOption
    if (myOption) {  // 为自定义的选项 'myOption' 注入一个处理器。
      console.log(myOption)
    }
  }
})
```

在入口文件中引入全局 mixins。

```js
import '@/mixins/globals';
```

在组件中使用给自定义选项 myOption 赋值：

```js
// Home.vue
export default {
  myOption: 'hello Home!',
}
// hello Home!
```

全局注册的混入会在局部注册的混入之前执行。

## 自定义指令 directive

### 注册指令

**Vue.directive() 全局注册**

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})
```

**directives 选项局部注册**

```js
directives: {
  focus: {
    inserted: function (el) {
      el.focus()
    }
  }
}
```

**组件中使用**

然后在组件模板中任何元素上可以使用新的 `v-focus` 属性：

```html
<input v-focus>
```

### 指令的钩子函数

自定义指令时，可以使用如下几个钩子函数 (均为可选)：

- `bind`：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。

- `inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。

- `update`：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。

- `componentUpdated`：指令所在组件的 VNode 及其子 VNode 全部更新后调用。

- `unbind`：只调用一次，指令与元素解绑时调用。

### 钩子函数的参数

- `el`：指令所绑定的元素，可以用来直接操作 DOM。

- `binding`：一个对象，包含以下属性：
  - `name`：指令名，不包括 v- 前缀。
  - `value`：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。
  - `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。
  - `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。
  - `arg`：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`。
  - `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。

- `vnode`：Vue 编译生成的虚拟节点。
- `oldVnode`：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。

除了 `el` 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 `dataset` 来进行。

### 动态指令参数

指令的参数可以是动态的。例如，在 `v-mydirective:[argument]="value"` 中，`argument` 参数可以根据组件实例数据进行更新！

```js
// 元素定位的指令
Vue.directive('pin', {
  bind: function (el, binding, vnode) {
    el.style.position = 'fixed'
    let s = (binding.arg == 'left' ? 'left' : 'top')
    el.style[s] = binding.value + 'px'
  }
})
```

```html
<!-- 组件中使用，动态指定参数 -->
<template>
  <p v-pin:[direction]="200">定位元素</p>
</template>

<script>
export default {
  data: function () {
    return {
      direction: 'left'
    }
  }
}
</script>
```

如果数据变化时需要响应式更新指令，则需要 `update` 钩子函数。

### 钩子函数简写

在很多时候，可能想在 `bind` 和 `update` 时触发相同行为，而不关心其它的钩子。就可以使用简写形式：

```js
Vue.directive('pin', function (el, binding) {
  el.style.position = 'fixed'
  let s = (binding.arg == 'left' ? 'left' : 'top')
  el.style[s] = binding.value + 'px'
})
```

局部注册也一样可以简写：

```js
export default {
  directives: {
    pin(el, binding) {
      el.style.position = "fixed";
      let s = binding.arg == "left" ? "left" : "top";
      el.style[s] = binding.value + "px";
    }
  },
}
```

## 渲染函数 render

### render() 函数

`render` 函数是使用 js 的编程能力生成 html 的。`render` 和 `template` 不能同时存在。

该渲染函数接收一个 `createElement` 方法作为第一个参数用来创建 VNode。如果组件是一个函数组件，渲染函数还会接收一个额外的 `context` 参数，为没有实例的函数组件提供上下文信息。

```js
Vue.component('hi-render', {
  render: function (createElement) {
    // <p>hi</p>
    return createElement('p', 'hi')
  }
}
```

### createElement

**h 别名**

将 `h` 作为 `createElement` 的别名是 Vue 生态系统中的一个通用惯例。

**参数**

- 第一个参数（必填项）：一个 **HTML 标签名** 或 **组件选项对象**，或者 resolve 了上述任何一种的一个 async **函数**。参数类型可以是 String | Object | Function。

- 第二个参数（可选）：`{Object}`。一个与模板中属性对应的 **数据对象**。可省略。

- 第三个参数（可选）：子级虚拟节点，可由 `createElement()` 构建而成，也可以使用字符串来生成“文本虚拟节点”。类型可以是 String | Array。

```html
<!-- AnchoredHeading.vue -->
<script> 
export default {
  render: function (h) {
    return h(
      'h' + this.level,   // 标题 标签
      [                   // 子节点数组
        h(
          'a',            // a 标签
          {               // 属性数据对象
            attrs: {
              name: this.name,
              href: '#' + this.name
            }
          }, 
          this.$slots.default // 子节点内容
        )
      ] 
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }
}
</script>
```

```html
<anchored-heading :level="3" name="hello">hi</anchored-heading>
```

也可用 render 函数使用组件：

```js
export default {
  render: function(h) {
    return h(
      "anchored-heading", {
        props: {
          level: 3,
          name: 'hello'
        }
      }, 
      'hi'
    );
  },
};
```

渲染的结果都为：

```html
<h3><a name="hello" href="#hello">hi</a></h3>
```

**参数为 .vue 单文件组件**

createElement 还可以接收一个 `.vue` 格式的单文件组件，直接渲染。因为 Vue 的模板实际上被编译成了渲染函数。

```js
import About from '@/views/About.vue'
export default {
  render: function (h) {
    return h(About)
  }
};
```

在入口文件中渲染入口模版 `App.vue` 就是用的这种方式：

```js
// @/main.js
import Vue from 'vue'
import App from './App.vue'

new Vue({
  render: h => h(App)
}).$mount('#app')
```

## 插件

插件通常用来为 Vue 添加全局功能。

### 作用

- 添加全局方法或者属性。

- 添加全局资源：指令/过滤器/过渡等。

- 通过全局混入来添加一些组件选项。

- 添加 Vue 实例方法，通过把它们添加到 `Vue.prototype` 上实现。

### `Vue.use()`

通过全局方法 `Vue.use()` 使用插件。该方法的作用是安装插件。如果插件是一个对象，必须提供 `install` 方法。如果插件是一个函数，它会被作为 `install` 方法。`install` 方法调用时，会将 `Vue` 作为参数传入。

`Vue.use` 会自动阻止多次注册相同插件，即使多次调用也只会注册一次该插件。

该方法需要在调用 `new Vue()` 之前被调用。

```js
// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin)

new Vue({
  // ...组件选项
})
```

也可以传入一个可选的选项对象：

```js
Vue.use(MyPlugin, { someOption: true })
```

### 开发插件

Vue.js 的插件应该暴露一个 `install` 方法。这个方法的第一个参数是 `Vue` 构造器，第二个参数是一个可选的选项对象：

```js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局自定义指令
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
  })

  // 3. 混入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

## 过滤器

Vue.js 允许自定义过滤器，可被用于一些常见的文本格式化。过滤器可以用在两个地方：双花括号插值和 v-bind 表达式。过滤器应该被添加在 JavaScript 表达式的尾部，由 `|` 管道符指示：

```html
<!-- 在双花括号中 -->
{{ message | capitalize }}

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>
```

### 定义过滤器

**Vue.filter() 全局定义**

```js
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  // ...
})
```

**通过 filters 选项局部定义**

在组件中通过 `filters` 选项中定义本地的过滤器：

```js
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

当全局过滤器和局部过滤器重名时，会采用局部过滤器。

### 过滤器函数的参数

过滤器函数总接收表达式的值 (之前的操作链的结果) 作为第一个参数。且过滤器可以串联：

```
{{ message | filterA | filterB }}
```

`filterA` 过滤器的参数是 `message` 的值，`filterB` 过滤器的参数是 `filterA` 的结果。

过滤器是 JavaScript 函数，因此可以接收参数：

```
{{ message | filterA('arg1', arg2) }}
```

`filterA` 接收三个参数。`message` 的值是第一个参数，字符串 `'arg1'` 和表达式 `arg2` 依次向后。

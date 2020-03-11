## 组件实例

组件是可复用的 Vue 实例，所以它们与 `new Vue` 接收相同的选项，例如 `data`、`computed`、`watch`、`methods` 以及生命周期钩子等。仅有的例外是 `el` 是根实例特有的选项。

每用一次组件，就会有一个它的新实例被创建。

### data 必须是一个函数

一个组件的 `data` 选项必须是一个函数，因此每个实例可以维护一份被返回对象的独立的拷贝。

### 命名风格

定义组件名的方式有两种：

- kebab-case：在引用这个组件时也必须使用短横线分隔命名。
- PascalCase：在引用这个自定义元素时两种命名法都可以使用，即短横线和大驼峰都可以。

## 组件注册

为了能在模板中使用，组件必须先注册以便 Vue 能够识别。这里有两种组件的注册类型：全局注册和局部注册。

### 全局注册

```js
Vue.component('my-component-name', {
  // ... options ...
  props: ['btnText'],
  template: '<button>{{btnText}}</button>'
})
```

全局注册的组件可以用在其被注册之后的任何 (通过 new Vue) 新创建的 Vue 根实例，也包括其组件树中的所有子组件的模板中。

### 局部注册

在 `components` 选项中注册想要使用的组件。

```js
var ComponentA = { /* ... */ }

new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA,
  }
})
```

对于 `components` 对象中的每个属性来说，其属性名就是自定义元素的名字，其属性值就是这个组件的选项对象。

注意 **局部注册的组件在其子组件中不可用**。因此在子组件中要使用组件，还得在自组件中重新注册。

```js
var ComponentA = { /* ... */ }

var ComponentB = {
  components: {
    'component-a': ComponentA
  },
}
```

### 模块系统中使用（webpack / Vue CLI）

**局部注册：**

```js
// ComponentB.vue
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  },
}
```

**全局注册：**

相对通用的 **基础组件** 会在各个组件中被频繁的用到，此时就需要使用 `require.context` 全局注册这些非常通用的基础组件。

```js
// ./components/globals.js
import Vue from 'vue'

const requireComponent = require.context(
  // 其组件目录的相对路径  ./components/basic
  './basic',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式。此示例的命名规则为以 Base 开头的大驼峰命名。
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  let componentName = fileName.split('/').pop().replace(/\.\w+$/, '');

  // 如果是短横线命名的组件，则需要转换为大驼峰。base-xxx.vue
  let componentName = fileName.split('/').pop().replace(/\.\w+$/, '')
    .split('-')
    .map((kebab) => kebab.charAt(0).toUpperCase() + kebab.slice(1))
    .join('');
  
  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})
```

在入口 js 文件中引入，注意全局注册的行为必须在根 Vue 实例 (通过 new Vue) 创建之前发生。

```js
// src/main.js
import '@/components/globals';
```

## prop

### 子组件不可以改变 prop 的值

所有的 prop 都使得其父子 prop 之间形成了一个单向下行绑定。即 **不应该** 在一个子组件内部改变 prop。如果改变了，Vue 会在浏览器的控制台中发出警告。

然而，在 js 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变这个对象或数组本身将会影响到父组件的状态。

### prop 验证

```js
export default { 
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
}
```

注意 prop 会在一个组件实例创建之前进行验证，所以实例的属性 (如 `data`、`computed` 等) 在 `default` 或 `validator` 函数中是不可用的。

### 非 Prop 的 属性

非 prop 的属性是指传向一个组件，但是该组件并没有相应 prop 定义的属性。

组件可以接受任意的属性，此时这些未定义的属性会被添加到这个组件的根元素上。`class` 和 `style` 属性会将传入的值和组件本身的值合并起来，而其它属性从外部提供给组件的值会替换掉组件内部设置好的值。

可以通过组件中的选项 `inheritAttrs: false` 设置禁止根元素继承未定义的属性，然后通过 `$attrs` 属性手动决定这些属性会被赋予哪个元素。此外该选项是不会影响 `style` 和 `class` 的属性合并的。

`$attrs` 属性是个对象，包含了传递给组件的属性名和属性值。

```html
<!-- Home.vue -->
<template>
  <div>
    <BaseSnackBar myTitle="title" myId="id"></BaseSnackBar>
  </div>
</template>
```

```html
<!-- BaseSnackBar.vue -->
<template>
  <div>
    <p v-bind="$attrs">提示信息</p>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  mounted() {
    console.log(this.$attrs);  // {myTitle: "title", myId: "id"}
  }
};
</script>
```

其中不带参数的 `v-bind` 指令，是将属性值对象中的每一个属性展开来作为单独的属性作用于元素。如上例中的 `<p>` 元素等价于：

```html
<p mytitle="haha" myid="id">提示信息</p>
```

## 自定义事件

### 命名

事件名不会被用作一个 js 变量名或属性名，所以就没有理由使用 camelCase 或 PascalCase 了。因此，推荐始终使用 kebab-case 命名事件名。






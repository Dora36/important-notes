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

### 全局提示信息示例

```html
<!-- ./views/component/snackbar/SnackBar.vue -->
<template>
  <!-- 使用 vuetify UI 组件 -->
  <v-snackbar :color="color" :top=true :right=true v-model="snackbar" :timeout="timeout">
    <v-icon color="white" class="mr-3" size="20">{{alertTip}}</v-icon>
    <div>{{titleTip}}</div>
    <v-icon color="white" size="16" @click="close">clear</v-icon>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      color:"info",
      titleTip:"",
      alertTip:"",
      timeout: 3000
    };
  },
  methods: {
    close() {
      this.snackbar = false;
    },
    show(titleTip, color = "info", alertTip = "add_alert") {
      this.snackbar = true;
      this.color = color;
      this.titleTip = titleTip;
      this.alertTip = alertTip;
    },
  }
};
</script>
```

```js
// ./views/component/snackbar/index.js
import SnackBarComponent from '@/views/components/snackbar.vue';
const SnackBar = {};
SnackBar.install = (Vue)=>{
  const vue = Vue;   // 遵循 eslint 不直接修改参数的规范

  const SnackBarClass = vue.extend(SnackBarComponent);  // 将组件变成一个类
  const instance = new SnackBarClass();
  instance.$mount(document.createElement('div'));  // 将实例挂载到创建的 div 上
  document.body.appendChild(instance.$el);  

  const showMethods = {
    showOk(titleTip = '搜索成功'){
      instance.show(titleTip, "info");
    },
    showError(titleTip = '获取数据失败，请刷新重试'){
      instance.show(titleTip, "error");
    }
  }
  vue.prototype.$snackbar = showMethods;
}

export default SnackBar
```

入口文件中使用插件：

```js
// main.js
import SnackBar from '@/views/components/snackbar/index';
Vue.use(SnackBar);
```

在其他组件中使用：

```js
this.$snackbar.showOk();
```

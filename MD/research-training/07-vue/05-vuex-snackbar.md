## snackbar 的示例

### vuex

```js
// ./store/modules/snackbar.js
export default {
  namespaced: true,
  state: {
    snackBarMsg: '提示信息',
    snackShow: false,
  },
  mutations: {
    changeMsg(state,payload) {
      state.snackBarMsg = payload.msg;
    },
    changeShow(state,show) {
      state.snackShow = show;
    }
  },
  actions: {
    changeMsg({commit}, payload) {
      commit('changeShow', true);
      commit('changeMsg', {msg: payload.msg});
      setTimeout(() => {
        commit('changeShow', false);
      }, 3000);
    }
  },
}
```

```js
// ./store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import snackbar from './modules/snackbar';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    snackbar
  }
})
```

### snackbar 组件

```html
<!-- BaseSnackBar.vue -->
<template>
  <div class="snackbar">
    <p v-show="snackShow">{{snackBarMsg}}</p>
  </div>
</template>
<script>
import Vue from "vue";
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: mapState("snackbar", {
    snackBarMsg(state) {
      return state.snackBarMsg;
    },
    snackShow(state) {
      return state.snackShow;
    }
  }),
  mounted() {
    Vue.prototype.$snackbar = this.changeMsg;
  },
  methods: {
    changeMsg(msg) {
      this.$store.dispatch("snackbar/changeMsg", { msg });
    }
  }
};
</script>

<style>
.snackbar {
  position: fixed;
  top: 0;
  right: 0;
  width: 500px;
  height: 200;
  background-color: bisque;
  color: blueviolet;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

### 根组件引入

```html
<template>
  <div id="app">
    <BaseSnackBar></BaseSnackBar>
  </div>
</template>
```

### 其它组件中使用

```js
this.$snackbar(msg)
```
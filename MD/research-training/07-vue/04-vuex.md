## 概念

Vuex 是一个专为 Vue.js 开发的状态管理模式。通过定义和隔离状态管理中的各种概念并通过强制规则维持视图和状态间的独立性，我们的代码将会变得更结构化且易维护。

Vuex 和单纯的全局对象有以下两点不同：

- Vuex 的状态存储是响应式的。当 Vue 组件从 `store` 中读取状态的时候，若 `store` 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

- 不能直接改变 `store` 中的状态。改变 `store` 中的状态的唯一途径就是显式地提交 (commit) `mutation`。

Vuex 使用单一状态树，即每个应用将仅仅包含一个 `store` 实例，用一个对象就包含了全部的应用层级状态。

```js
// @/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // strict: true 在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。
  strict: process.env.NODE_ENV !== 'production',  // 不要在发布环境下启用严格模式！
  state: {       // 状态，store 的数据
  },
  getters: {     // 类似于 store 的计算属性，根据 state 的值返回处理后的数据
  },
  mutations: {   // 通过提交 mutation，变更 state 的状态，同步函数。
  },
  actions: {     // commit mutation，可异步处理数据
  },
  modules: {
  }
})
```

在入口文件中引入：

```js
// @/main.js
import Vue from 'vue'
import App from './App.vue'
import store from './store'

new Vue({
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
  render: h => h(App)
}).$mount('#app')
```

## state 状态

### 常规调用

- 先通过根组件的 `store` 选项将 vuex 的状态“注入”到每一个子组件中，需调用 `Vue.use(Vuex)`。此时，子组件就可通过 `this.$store` 访问到 store 中的状态。

- 在子组件中，由于 Vuex 的状态存储是响应式的，因此可以通过 **计算属性** 从 `this.$store.state` 中读取某个状态。每当状态变化的时候, 都会重新求取计算属性，并且触发更新相关联的 DOM。

```js
export default {
  computed: {
    snackBarMsg() {
      return this.$store.state.snackBarMsg
    }
  },
};
```

### 使用 mapState 辅助函数

当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，可以使用 `mapState` 辅助函数帮助我们生成计算属性：

```js
import { mapState } from 'vuex'

export default {
  computed: mapState([
    // 映射 this.snackBarMsg 为 store.state.snackBarMsg
    'snackBarMsg'
  ])
}
```

当映射的计算属性的名称与 `state` 的名称相同时，可以给 `mapState` 传一个字符串数组。当然也可以传入对象语法的参数：

```js
import { mapState } from 'vuex'

export default {
  computed: mapState({
    // 箭头函数可使代码更简练
    snackBarMsg: state => state.snackBarMsg,

    // 传字符串参数 'snackBarMsg' 等同于 `state => state.snackBarMsg`
    msg: 'snackBarMsg',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    getSnackBarMsg (state) {
      return state.snackBarMsg + this.msg
    }
  })
}
```

所有的辅助函数都需要在根节点注入 `store`。

### mapState 与常规计算属性混用

mapState 函数返回的是一个对象。因此可以使用对象展开运算符将 mapState 返回的对象和常规计算属性合并：

```js
export default {
  computed: {
    localComputed () { /* ... */ },
    // 使用对象展开运算符将此对象混入到外部对象中
    ...mapState({
      // ...
    })
  }
}
```

## getters

有时候我们需要处理 store 中的 `state` 状态数据，且处理后的数据有多个组件需要用到，除了在每个需要使用的组件中处理外，我们可以在 store 中定义 `getters` 属性实现，类似于 store 的计算属性。

就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变时才会被重新计算。

### 定义

Getter 接受 `state` 作为其第一个参数，接受其他 `getters` 作为第二个参数：

```js
export default new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    },
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length
    },
    getTodoById: (state) => {
      return (id) => {  // 通过返回方法可实现传参
        return state.todos.find(todo => todo.id === id)
      }
    }
  }
})
```

### 获取

Getter 会暴露为 `store.getters` 对象，可以以属性的形式访问这些值：

```js
export default {
  computed: {
    doneTodosCount () {
      return this.$store.getters.doneTodosCount
    }
  }
}
```

也可以通过方法访问，并实现给 getter 传参：

```js
this.$store.getters.getTodoById(2)
```

注意，getter 在通过属性访问时是作为 Vue 的响应式系统的一部分缓存其中的。而通过方法访问时，每次都会去进行调用，而不会缓存结果。

### mapGetters 辅助函数

`mapGetters` 辅助函数用法同 `mapState` 一样，可以将 store 中的 getter 映射到组件的计算属性中：

可以使用数组形式传入：

```js
import { mapGetters } from 'vuex'

export default {
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

也可以使用更灵活的对象形式传入：

```js
mapGetters({
  // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```

## mutation 变更状态

更改 state 数据的唯一方法是提交 `mutation`。每个 mutation 都有一个字符串的事件类型 (type) 和一个回调函数 (handler)。其回调函数必须是同步函数。

### 定义

这个回调函数就是用来进行状态更改的，并且接受 `state` 作为第一个参数，commit 提交的时候传入的参数作为剩余的参数：

```js
export default new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {  // 'increment' 是 type 事件类型
      // 变更状态
      state.count++
    },
    plus (state, payload) {
      state.count += payload.amount
    }
  }
})
```

### 调用

使用的时候，不能直接调用 mutations 的回调函数，而是需要以相应的 type 名通过 `store.commit` 方法调用。

```js
this.$store.commit('increment')
```

**传参**

可以向 `store.commit` 传入额外的参数，即 mutation 的载荷（payload）。在大多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的 `mutation` 会更易读：

```js
store.commit('plus', {
  amount: 10
})
```

**commit 的对象形式参数**

```js
store.commit({
  type: 'plus',
  amount: 10
})
```

其中 `type` 属性就是 `mutation` 的 type 名，其余的就是向 mutation 传的对象形式的参数。

### 响应式的规则

Vuex 的 `store` 中的状态是响应式的，那么当变更状态时，监视状态的 Vue 组件也会自动更新。这意味着 `mutation` 也需要遵守一些响应式的注意事项：

- 最好提前在 `store` 中初始化好所有所需属性。

- 当需要在对象上添加新属性时，使用 `Vue.set()` 或以新对象替换老对象。

可以利用对象展开运算符添加新属性：

```js
state.obj = { ...state.obj, newProp: 123 }
```

### 使用常量替代 Mutation 的 type 事件名

使用常量，并将这些常量放在单独的文件中的作用是：在多人协作的大型项目中，使得合作者对整个 app 包含的 mutation 一目了然，具有更好的可阅读性和可维护性：

```js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

```js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    [SOME_MUTATION] (state) {
      // ...
    }
  }
})
```

### mapMutations 辅助函数

使用 `mapMutations` 辅助函数可以将组件中的 `methods` 映射为 `store.commit` 调用：

```js
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 的调用映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 的调用映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 的调用映射为 `this.$store.commit('increment')`
    })
  }
}
```

## action

Action 类似于 mutation，不同在于：

- Action 提交的是 mutation，而不是直接变更状态。
- Action 可以包含任意异步操作。

### 定义

Action 函数接受一个与 store 实例具有相同方法和属性的 `context` 对象，因此可以调用 `context.commit` 提交一个 mutation，或者通过 `context.state` 或 `context.getters` 来获取 state 和 getters。

```js
export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state, n) {
      if(n) {
        state.count += n
      } else {
        state.count++
      }
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    },
    plus ({ commit }, payload) {     // 可使用参数解构 来简化代码
      commit('increment', payload.amount)
    }
  }
})
```

### 触发

Action 通过 `store.dispatch` 方法触发：

```js
// 以载荷形式触发
store.dispatch('plus', {
  amount: 10
})

// 以对象形式触发
store.dispatch({
  type: 'plus',
  amount: 10
})
```

### 异步处理

因为 Action 通常是异步的，所以 `store.dispatch` 可以处理 action 返回的 Promise，并且 `store.dispatch` 仍旧返回 Promise：

```js
actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA')            // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

### mapActions 辅助函数

使用 `mapActions` 辅助函数将组件的 methods 映射为 `store.dispatch` 调用：

```js
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```

## modules 模块化状态

Vuex 可将 store 分割成模块（module）。每个模块拥有自己的 `state`、`mutation`、`action`、`getter`、甚至是嵌套子模块：

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

export default new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

this.$store.state.a   // -> moduleA 的状态
this.$store.state.b   // -> moduleB 的状态
```

### 命名空间

默认情况下，模块内部的 action、mutation 和 getter 是注册在 **全局** 命名空间的，这样使得多个模块能够对同一 mutation 或 action 作出响应。

如果希望模块具有更高的封装度和复用性，可以通过添加 `namespaced: true` 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。

```js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,
      mutations: {
        login () { ... } // -> commit('account/login')
      },
      modules: {   // 嵌套模块
        myPage: {  // 继承父模块的命名空间
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },
        posts: {    // 进一步嵌套命名空间
          namespaced: true,
          actions: {
            popular () { ... } // -> dispatch('account/posts/popular')
          }
        }
      }
    }
  }
})
```

### 模块内的局部和全局状态

**mutation**：

接收的第一个参数是模块的局部状态对象。

**getter**

接收的第一个参数是模块的局部状态对象 `state`，第二个参数是局部 `getters`，根节点的 `rootState` 和 `rootGetters` 会作为第三和第四参数传入。

```js
modules: {
  foo: {
    namespaced: true,
    getters: {
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter       // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter   // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },
  }
}
```

**action**

局部参数为 `context.state` 及 `context.getters`，根节点状态则为 `context.rootState`，根节点 getter 为 `context.rootGetters`。

在 action 中的 `dispatch` 和 `commit` 都是局部化的，而如果要操作全局的数据，将 `{ root: true }` 作为第三参数传给 `dispatch` 或 `commit` 即可。

```js
modules: {
  foo: {
    namespaced: true,
    actions: {
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter        // -> 'foo/someGetter'
        rootGetters.someGetter    // -> 'someGetter'

        dispatch('someOtherAction')                         // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true })   // -> 'someOtherAction'

        commit('someMutation')                          // -> 'foo/someMutation'
        commit('someMutation', null, { root: true })    // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

### 在局部模块注册全局 action

若需要在局部模块注册全局 action，可添加 `root: true`，并将这个 action 的定义放在函数 `handler` 中。

```js
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... }   // -> 'someAction'
        }
      }
    }
  }
}
```

### 使用辅助函数绑定局部模块

当使用 mapState, mapGetters, mapActions 和 mapMutations 这些函数来绑定带命名空间的模块时，按照嵌套模块的路径写起来比较繁琐：

```js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
  })
},
methods: {
  ...mapActions([
    'some/nested/module/foo',   // -> this['some/nested/module/foo']()
  ])
}
```

对于这种情况，可以将模块的空间名称字符串作为第一个参数传递给上述函数，这样所有绑定都会自动将该模块作为上下文：

```js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
  })
},
methods: {
  ...mapActions('some/nested/module', [
    'foo',   // -> this.foo()
  ])
}
```

而且，也可以通过使用 `createNamespacedHelpers` 创建基于某个命名空间辅助函数。它返回一个对象，对象里有新的绑定在给定命名空间值上的组件绑定辅助函数：

```js
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    ...mapState({     // 在 `some/nested/module` 中查找
      a: state => state.a,
    })
  },
  methods: {
    ...mapActions([   // 在 `some/nested/module` 中查找
      'foo',
    ])
  }
}
```

## 项目结构

```
├── index.html
├── main.js
├── api
│   └── ... # 抽取出API请求
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # 组装模块并导出 store 的地方
    ├── actions.js        # 根级别的 action
    ├── mutations.js      # 根级别的 mutation
    └── modules
        ├── cart.js       # 购物车模块
        └── products.js   # 产品模块
```




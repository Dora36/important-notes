## promise 基本用法

`Promise` 对象是一个构造函数，用来生成 `Promise` 实例。`Promise` 构造函数接受一个函数作为参数，该函数的两个参数分别是 `resolve` 和 `reject`。

`resolve` 函数的作用是，在异步操作成功时调用（`Promise` 对象的状态从 `pending` 变为 `fulfilled`），并将异步操作的结果，作为参数传递出去。

`reject` 函数的作用是，在异步操作失败时调用（`Promise`对象的状态从 `pending` 变为 `rejected`），并将异步操作报出的错误，作为参数传递出去。

```js
const funPromise = function(options) {
  return new Promise(function(resolve, reject) {
    if (/* 异步操作成功 */){
      resolve(result);
    } else {
      reject(error);
    }
  });
}
```

`resolve` 函数的参数除了正常的值以外，还可能是另一个 `Promise` 实例，此时，初始 `promise` 的最终状态根据传入的新的 `Promise` 实例决定。

`reject` 方法的作用，相当于抛出错误。等同于 `throw new Error('error')`。

### Promise.prototype.then()

`Promise` 实例具有 `then` 方法，它的作用是为 `Promise` 实例添加状态改变时的回调函数，即 `Promise` 实例生成以后，用 `then` 方法分别指定 `fulfilled` 状态和 `rejected` 状态的回调函数。

```js
funPromise().then(function(result) {
  // fulfilled
}, function(error) {
  // rejected
})
```

`then` 方法可以接受两个回调函数作为参数。第一个回调函数是 `Promise` 对象的状态变为 `fulfilled` 时调用，第二个回调函数是 `Promise` 对象的状态变为 `rejected` 时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受 `Promise` 对象传出的值作为参数。

`then` 方法返回的是一个新的 `Promise` 实例（注意，不是原来那个 `Promise` 实例）。因此可以采用链式写法，即 `then` 方法后面再调用另一个 `then` 方法来处理上一个 `then` 方法中 `return` 的结果。

```js
funPromise().then(function(result) {
  return result.data;
}).then(function(data) {
  // fulfilled
});
```

上面的代码使用 `then` 方法，依次指定了两个回调函数。第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数。并且，第一个 `then` 返回的结果也可以是另一个异步操作的 `Promise` 对象，这时后一个 `then` 函数，就会等待该 `Promise` 对象的状态发生变化，才会被调用。

```js
funPromise().then(
  (result) => { return funPromise(result); }
).then(
  (data) => { /* fulfilled */ },
  (error) => { /* rejected */ }
);
```

上面代码中，第一个 `then` 方法指定的回调函数，返回的是另一个 `Promise` 对象。这时，第二个 `then` 方法指定的回调函数，就会等待这个新的 `Promise` 对象状态发生变化。如果变为 `fulfilled`，就调用第一个回调函数，如果状态变为 `rejected`，就调用第二个回调函数。

### Promise.prototype.catch()

`Promise` 实例具有 `catch` 方法，它的作用是为 `Promise` 实例添加状态改变为 `rejected` 状态的回调函数，也就是 `then` 方法的第二个函数的替代写法。

```js
funPromise().then(function(result) {
  // fulfilled
}).catch(function(error) {
  // 处理 funPromise 和之前 then 回调函数运行时发生的错误
});
```

`Promise` 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，无论前面有多少个 `then` 函数，其中的错误总是会被下一个 `catch` 语句捕获。

```js
funPromise().then(function(result) {
  return funPromise(result);
}).then(function(data) {
  // fulfilled
}).catch(function(error) {
  // 处理前面三个 Promise 产生的错误
});
```

一般来说，不要在 `then` 方法里面定义 `rejected` 状态的回调函数（即 `then` 的第二个参数），总是使用 `catch` 方法，因为这种写法可以捕获前面 `then` 方法执行中的错误。

`catch` 方法返回的还是一个 `Promise` 对象，并且 `catch` 中如果没有抛出任何其它错误，那么该 `Promise` 对象则是 `resolved` 状态。而且后面还可以接着调用 `then` 方法，但是前面的 `catch` 不能捕获后面的 `then` 中的错误，所以尽量 `catch` 都写在最后。

### Promise.all()

`Promise.all()` 方法用于将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。其接受一个数组作为参数，数组中的值都是 `Promise` 实例，如果不是，就会先调用 `Promise.resolve()` 方法，将参数转为 `Promise` 实例，再进一步处理。

```js
const p = Promise.all([funPromise(1), funPromise(2), funPromise(3)]);
```

`p` 的状态由数组中的值决定，分成两种情况。

- 数组中 `Primise` 实例的状态都变成 `fulfilled`，`p` 的状态才会变成 `fulfilled`，此时数组中实例的返回值组成一个数组，传递给 `p` 的回调函数。

- 只要数组的实例之中有一个被 `rejected`，`p` 的状态就变成 `rejected`，此时第一个被 `reject` 的实例的返回值，也就是报错信息，会传递给 `p` 的回调函数。

```js
p.then(function (results) {
  // 全部 fulfilled，results 是个数组，里面是每个实例的返回结果
}).catch(function(error){
  // 其中有一个变为 rejected
});
```

注意，如果作为参数的 `Promise` 实例，自己定义了 `catch` 方法，那么它一旦被 `rejected`，并不会触发 `Promise.all()` 的 `catch` 方法。

### 应用

用 `Promise` 对象实现 `Ajax`。

```js
const getAjax = function(url) {
  const promise = new Promise(function(resolve, reject){
    const handler = function() {
      if (this.readyState === 4 && this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = handler;
    xhr.responseType = "json";
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send();
  });
  return promise;
};

getAjax("/test.json").then(function(json) {
  console.log('Contents: ' + json);
}, function(error) {
  console.error('出错了', error);
});
```

## async / await 基本用法

当 `async` 函数执行的时候，一旦遇到 `await` 就会先等到 `await` 后的异步操作完成，再接着执行函数体内之后的语句。

`async` 函数返回一个 `Promise` 对象，可以使用 `then` 方法添加回调函数。`async` 函数内部 `return` 语句返回的值，会成为 `then` 方法回调函数的参数。

```js
async function f() {
  return 'hello dora';
}

f().then(v => console.log(v))   // "hello dora"
```

`async` 函数内部抛出错误，会导致返回的 `Promise` 对象变为 `rejected` 状态。抛出的错误对象会被 `catch` 方法回调函数接收到。

```js
async function f() {
  throw new Error('出错了');
}

f().catch( e => console.log(e))  // Error: 出错了
```

### await 命令

正常情况下，`await` 命令后面是一个 `Promise` 对象，返回该对象的结果。如果不是 `Promise` 对象，就直接返回对应的值。

```js
async function f() {
  return await 123;             // 等同于 return 123;
}

f().then(v => console.log(v))  // 123
```

`await` 命令后面的 `Promise` 对象如果变为 `rejected` 状态，则错误会被 `catch` 方法的回调函数接收到。

任何一个 `await` 语句后面的 `Promise` 对象变为 `rejected` 状态，那么整个 `async` 函数就会中断执行。

有时，我们希望即使前一个异步操作失败，也不要中断后面的异步操作，有两个解决办法：

第一种方法是可以将 `await` 放在 `try...catch` 结构里面，这样不管这个异步操作是否成功，后面的代码都会执行。

```js
async function f() {
  try {
    await Promise.reject('出错了');
  } catch(e) { }
  return await Promise.resolve('hello dora');
}

f().then(v => console.log(v))   // hello dora
```

另一种方法是 `await` 后面的 `Promise` 对象再跟一个 `catch` 方法，处理前面可能出现的错误。

```js
async function f() {
  await Promise.reject('出错了').catch(e => console.log(e));
  return await Promise.resolve('hello dora');
}

f().then(v => console.log(v))
// 出错了
// hello dora
```

### 使用注意点

**1. 错误处理**

前面已经说过，`await` 命令后面的 `Promise` 对象，运行结果可能是 `rejected`，所以防止出错的方法，就是最好把 `await` 命令放在 `try...catch` 代码块中。如果有多个 `await` 命令，可以统一放在 `try...catch` 结构中，如果只有一个 `await`，可以使用上例中的 `catch` 捕获 `await` 后面的 `promise` 抛出的错误。

```js
const superagent = require('superagent');
const NUM_RETRIES = 3;

async function test() {
  let i;
  for (i = 0; i < NUM_RETRIES; i++) {
    try {
      await superagent.get('/api/xxx');
      break;
    } catch(err) {}
  }
}

test();
```

上面代码中，使用 `try...catch` 结构，实现多次重复尝试。如果 `await` 操作成功，就会使用 `break` 语句退出循环；如果失败，会被 `catch` 语句捕捉，然后进入下一轮循环。

**2. 多个 await 异步操作并发执行**

多个 `await` 命令后面的异步操作，如果不存在继发关系（即互不依赖），最好让它们同时触发，以缩短程序的执行时间。

```js
// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```

**3. forEach 等数组遍历方法的参数为 async 函数时是并发执行的**

只有 `async` 函数内部是继发执行，外部不受影响，因此 `forEach()`、`map()` 等数组遍历方法的参数改成 `async` 时是并发执行的。

```js
function dbFuc() { //这里不需要 async
  let docs = [{}, {}, {}];

  // 会得到错误结果
  docs.forEach(async (doc)=> {
    await funPromise(doc);
  });
}
```

上面代码会得到错误结果，原因是这时三个 `funPromise(doc)` 操作是并发执行的，也就是同时执行，而不是继发执行。因此正确的写法是采用 `for` 循环。

```js
async function dbFuc() {
  let docs = [{}, {}, {}];

  for (let doc of docs) {
    await funPromise(doc);
  }
}
```

如果需要并发执行，可使用 `Promise.all()` 方法。

```js
async function dbFuc() {
  let docs = [{}, {}, {}];
  let promises = docs.map((doc) => funPromise(doc));

  let results = await Promise.all(promises);
  return results;
}
```

有一组异步操作，需要按照顺序完成。

```js
async function logInOrder(urls) {
  // 并发读取远程URL
  const textPromises = urls.map(async url => {
    const response = await fetch(url);
    return response.text();
  });

  // 按次序输出
  for (const textPromise of textPromises) {
    console.log(await textPromise);
  }
}
```

上面代码中，虽然 `map` 方法的参数是 `async` 函数，但它是并发执行的，因为只有 `async` 函数内部是继发执行，外部不受影响。后面的 `for..of` 循环内部使用了 `await`，因此实现了按顺序输出。

参考链接：
 [*Promise 对象*](http://es6.ruanyifeng.com/#docs/promise)
 [*async 函数*](http://es6.ruanyifeng.com/#docs/async)

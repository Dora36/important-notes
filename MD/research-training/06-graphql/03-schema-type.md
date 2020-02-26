## 基本标量类型

大多数情况下，一个 GraphQL 服务需要做的只是使用 GraphQL 的 schema 语法指定 API 需要的类型，然后作为参数传给 `buildSchema` 函数。

其中字段所支持的标量类型有 `String`、`Int`、`Float`、`Boolean` 和 `ID` 五种，在传给 `buildSchema` 的 schema 中可直接使用这些类型定义字段。

```js
// server.js
const schema = buildSchema(`
  type Query {
    str: String
    random: Float
    numArr: [Int]
  }
`);

const root = {};
```

默认情况下，每个类型都是可以为空的，意味着所有的标量类型都可以返回 `null`。

```
query {
  str
  random
  numArr
}
```

上述查询返回：

```json
{
  "data": {
    "str": null,
    "random": null,
    "numArr": null
  }
}
```

**不可为空**：使用感叹号可以标记一个类型不可为空，如 `String!` 表示非空字符串。

```js
// server.js
const schema = buildSchema(`
  type Query {
    str: String!
  }
`);

const root = {};
```

此时查询会报错：

```json
{
  "errors": [
    { "message": "Cannot return null for non-nullable field Query.str.", }
  ],
}
```

因此非空字段必须有返回值：

```js
const schema = buildSchema(`
  type Query {
    str: String!
  }
`);

const root = {
  str: () => {
    return 'hello world';
  },
};
```

## 对象类型

一个 GraphQL 服务是通过定义 **类型** 和 **类型上的字段** 来创建的，然后给每个类型上的每个字段提供解析函数。其中 `Query` 类型是查询入口，其他类型即 **对象类型**，可用来定义字段类型。

在 GraphQL 的 schema 语法中，通过 **type** 关键字来定义 **对象类型**。语法和定义 `Query` 类型一样，每个对象可以有返回指定类型的字段，以及带有参数的方法。


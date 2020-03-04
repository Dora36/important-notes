## 基本标量类型

大多数情况下，一个 GraphQL 服务需要做的只是使用 GraphQL 的 schema 语法指定 API 需要的类型，然后作为参数传给 `buildSchema` 函数。

其中字段所支持的标量类型有 `String`、`Int`、`Float`、`Boolean` 和 `ID` 五种，在传给 `buildSchema` 的 schema 中可直接使用这些类型定义字段，标量类型字段不会有任何次级字段。

- `Int`：有符号 32 位整数。
- `Float`：有符号双精度浮点值。
- `String`：UTF‐8 字符序列。
- `Boolean`：`true` 或者 `false`。
- `ID`：ID 标量类型表示一个唯一标识符，通常用以重新获取对象或者作为缓存中的键。ID 类型使用和 String 一样的方式序列化；然而将其定义为 ID 意味着并不需要人类可读型。

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

大部分的 GraphQL 服务实现中，都有自定义标量类型的方式。

### 类型修饰符

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

因此 **非空字段必须有返回值**：

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

## 枚举类型

也称作枚举（enum），枚举类型是一种特殊的标量，它限制在一个特殊的可选值集合内。这让你能够：

- 验证这个类型的任何参数是可选值的的某一个。
- 与类型系统沟通，一个字段总是一个有限值集合的其中一个值。

schema 语言表示的 enum 定义：

```
enum Gender {
  Male
  Female
}
```

这表示无论我们在 schema 的哪处使用了 Gender，都可以肯定它返回的是 Male 或 Female。

## 对象类型

一个 GraphQL 服务是通过定义 **类型** 和 **类型上的字段** 来创建的，然后给每个类型上的每个字段提供解析函数。其中 `Query` 类型是查询入口，其他类型即 **对象类型**，可用来定义字段类型。

在 GraphQL 的 schema 语法中，通过 **type** 关键字来定义 **对象类型**。语法和定义 `Query` 类型一样，每个对象可以有返回指定类型的字段，以及带有参数的方法。

```js
const schema = buildSchema(`
  type User {
    name(name: String!): String!
    age: Int
    birthYear: Int
  }

  type Query {
    author(age: Int!): User!
  }
`);

const root = {
  author: ({age}) => {
    return {
      name: ({name})=> {
        return name
      },
      age: age,
      birthYear: ()=>{
        return 2020 - age;
      }
    };
  },
};
```

其中，User 类型的解析器，可以用 class 类来替代，这样的话这些解析器就是这个类的实例方法了。

```js
class User {
  constructor(age){
    this.age = age;
  }
  name({name}){
    return name;
  }
  birthYear(){
    return new Date().getFullYear() - this.age
  }
}

const root = {
  author: ({age}) => {
    return new User(age);
  },
};
```

## 变更和输入类型

在 GraphQL 中，向数据库中插入数据或修改已有数据，则应该将这个入口端点做为 Mutation 而不是 Query。

```js
const schema = buildSchema(`
  type Mutation {
    setMessage(message: String): String
  }

  type Query {
    getMessage: String
  }
`);

let fakeDatabase = {};
const root = {
  setMessage: ({message}) => {
    fakeDatabase.message = message;
    return message;
  },
  getMessage: () => {
    return fakeDatabase.message;
  }
};
```

### input 输入对象类型

在 mutation 更改数据的时候可以定义包含所有字段的对象，即输入对象类型，可以作为参数传递。定义输入对象类型的时候，只需要将 `type` 关键字改为 `input` 关键字即可。

不能在 schema 中混淆输入和输出对象类型，即 `type` 和 `input` 分别定义的对象类型。输入对象类型是用来定义 mutation 中的字段传入的参数的。当然输入对象类型的字段也不能拥有参数。

```js
const schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

// 如果 Message 拥有复杂字段，我们把它们放在这个对象里面。
class Message {
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

let fakeDatabase = {};

const root = {
  getMessage: ({id}) => {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    return new Message(id, fakeDatabase[id]);
  },
  createMessage: ({input}) => {
    // 创建随机的id
    let id = require('crypto').randomBytes(10).toString('hex');

    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  updateMessage: ({id, input}) => {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
};
```

此时，在前端调用变更时，需要使用关键字 `mutation` 才可以，并将数据作为 JSON 对象传入。

```
mutation {
  createMessage(input: {
    author: "andy",
    content: "hope is a good thing",
  }) {
    id
  }
}
```

该变更语法，会生成一条新的数据，并返回该条数据的 `id`。如同查询一样，任何变更字段如果返回一个对象类型，在前端就可以请求其嵌套字段。

也可以使用变量传入输入类型数据：

```
# variables: {input: { author, content}}
mutation($input: MessageInput) {
  createMessage(input:$input) {
    id
  }
}
```


### 变更多个字段

同查询一样，一个变更也能包含多个字段。其最重要区别是：

查询字段时，是 **并行执行**，而变更字段时，是 **线性执行**，一个接着一个。

即一个请求中如果发送了两个变更，第一个保证在第二个之前执行，以确保不会出现竞态。










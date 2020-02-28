## 查询

### 查询语法

一个完整的查询语法包括 **操作类型** 和 **操作名称** 以及查询代码块，查询代码块基本上就是选择对象上的字段。而简写句法可以省略 `query` 关键字和查询名称。然而在生产中写全语法可以使代码减少歧义。

简写：

```
{
  hello
}
```

完整语法：

```
query SayHello {
  hello
}
```

其中 **操作类型** 表示打算做什么类型的操作。有三种：

- `query`：查询。
- `mutation`：变更。
- `subscription`：

**操作名称** 是使操作有意义和明确的名称。有了操作类型，才可以添加操作名称。

### 变量传参

在 GraphQL API 中，通常向入口端点传入参数，在 schema 中定义参数，并自动进行类型检查。每一个参数必须有 **名字** 和 **数据类型**。

所有声明的变量的数据类型都必须是标量、枚举型或者输入对象类型。其中枚举类型，代表一个有限选项集合，参数值只能从这些枚举类型中选一个。

变量类型后面带 `!` 的是必须要传的，不带 `!` 的是可选的。

#### 定义参数

```js
const schema = buildSchema(`
  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

const root = {
  rollDice: ({numDice, numSides}) => {
    let output = [];
    for (let i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  }
};
```

#### 传递参数

直接查询：按名称传入每个参数，需明确指明参数名字。

```
{
  rollDice(numDice: 3, numSides: 6)
}
```

通过 **变量** 查询：需要给变量名前加 `$` 符来表示。

- 使用 `$variableName` 替代查询中的静态值。
- 在操作类型后面声明 `$variableName` 为查询接受的变量。变量前缀必须为 `$`，后跟其类型。
- 将 `variableName: value` 通过 JSON 形式作为变量字典传入。

```
# "variables": { "dice": 3, "sides": 6 } 
query RollDice($dice: Int!, $sides: Int) {
  rollDice(numDice: $dice, numSides: $sides)
}
```

前端请求数据：

```js
var dice = 3;
var sides = 6;
var query = `
  query RollDice($dice: Int!, $sides: Int) {
    rollDice(numDice: $dice, numSides: $sides)
  }
`;

fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    query,
    variables: { dice, sides },
  })
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data));
```

#### 参数默认值

**查询时传递默认值**

可以通过在查询中的类型定义后面附带默认值的方式，将默认值赋给变量。

```
# "variables": { "dice": 3} 
query RollDice($dice: Int!, $sides: Int = 6) {
  rollDice(numDice: $dice, numSides: $sides)
}
```

如果有默认值的变量作为变量字典的部分传递了，则传递的值将覆盖其默认值。

**在定义对象类型时指定默认值**

```
type Starship {
  id: ID!
  length(unit: LengthUnit = METER): Float
}
```

#### 多字段传参

在 GraphQL 中，每一个字段和嵌套对象的字段都能有自己的一组参数，甚至也可以给标量（scalar）字段传递参数，用于实现服务端的一次转换，而不用每个客户端分别转换。

查询：

```
{
  human(id: "1000") {
    name
    height(unit: FOOT)
  }
}
```

结果：

```json
{
  "data": {
    "human": {
      "name": "Luke Skywalker",
      "height": 5.6430448
    }
  }
}
```

### 指令

指令可以附着在字段或者片段包含的字段上，动态地改变查询的结构。

GraphQL 的核心规范包含两个指令：

- `@include(if: Boolean)` 仅在参数为 `true` 时，包含此字段。

- `@skip(if: Boolean)` 如果参数为 `true`，跳过此字段。

```
# { "withFriends": false }
query Hero($withFriends: Boolean!) {
  hero {
    name
    friends @include(if: $withFriends) {
      name
    }
  }
}
```

### 别名

当需要传不同参数获取同一个字段的数据时，如果不使用别名，就会在返回结果中无法确定与参数相对应的结果。因此，别名会让不同参数，相同字段的查询变得很容易。

查询：

```
{
  aaaHero: hero(episode: aaa) {
    name
  }
  bbbHero: hero(episode: bbb) {
    name
  }
}
```

结果：

```json
{
  "data": {
    "aaaHero": {
      "name": "Luke Skywalker"
    },
    "bbbHero": {
      "name": "R2-D2"
    }
  }
}
```

### 片段

片段是一段可复用单元，组织一组字段，然后在需要它们的地方引入。片段的概念经常用于将复杂的应用数据需求分割成小块。

```
{
  aaaHero: hero(episode: aaa) {
    ...publicFields
  }
  bbbHero: hero(episode: bbb) {
    ...publicFields
  }
}

fragment publicFields on Character {
  name
}
```

结果：

```json
{
  "data": {
    "aaaHero": {
      "name": "Luke Skywalker"
    },
    "bbbHero": {
      "name": "R2-D2"
    }
  }
}
```

#### 在片段内使用变量

片段可以访问查询或变更中声明的变量。

```
query Hero($first: Int = 3) {
  aaaHero: hero(episode: aaa) {
    ...publicFields
  }
  bbbHero: hero(episode: bbb) {
    ...publicFields
  }
}

fragment publicFields on Character {
  name
  friends(first: $first) {
    name
  }
}
```

## mutation 变更

schema 中大部分的类型都是普通对象类型，但是一个 schema 内有两个特殊类型：

```
schema {
  query: Query
  mutation: Mutation
}
```

每一个 GraphQL 服务都有一个 `query` 类型，可能有一个 `mutation` 类型。这两个类型和常规对象类型无差，但是它们之所以特殊，是因为它们定义了每一个 GraphQL 查询的入口。

```
query {
  hero {
    name
  }
}
```

上例查询表示这个 GraphQL 服务需要一个 `Query` 类型，且其上有 `hero` 字段：

```
type Query {
  hero {
    name
  }
}
```

变更也是同理，在 `Mutation` 类型上定义一些字段，然后这些字段将作为 `mutation` 根字段使用，接着就能在查询中调用。

除了作为 schema 的入口，`Query` 和 `Mutation` 类型与其它 GraphQL 对象类型别无二致，它们的字段也是一样的工作方式。



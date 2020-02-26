## graphql 的核心

```js
import { graphql } from 'graphql';        // ES6
const { graphql } = require('graphql');   // CommonJS
```

### graphql()

```js
graphql( 
  schema: GraphQLSchema, 
  requestString: string, 
  rootValue?:?any, 
  contextValue?:?any, 
  variableValues?:?{[key: string]: any}, 
  operationName?:?string 
): Promise<GraphQLResult>
```

graphql 函数可提取，解析，验证和执行 GraphQL 请求。它需要一个 schema 和一个 requestString。 可选参数包括rootValue（将作为根值传递给执行程序），contextValue（将被传递给所有解析函数），variableValues（将被传递给执行程序以为 requestString 中的任何变量提供值）和 operationName，如果 requestString 包含多个顶级操作，则调用者可以指定将运行 requestString 中的哪个操作。

### GraphQLSchema

```js
import { GraphQLSchema } from 'graphql';     // ES6
var { GraphQLSchema } = require('graphql');  // CommonJS
```

```js
class GraphQLSchema{
  constructor(config: GraphQLSchemaConfig)
} 
type GraphQLSchemaConfig ={ 
  query: GraphQLObjectType; 
  mutation?:?GraphQLObjectType;
}

var MyAppSchema = new GraphQLSchema({
  query: MyAppQueryRootType 
  mutation: MyAppMutationRootType 
});
```

Schema 是通过提供每种操作、查询和变体(可选)的根类型来创建的。然后将模式定义提供给验证器和执行器。

### type

#### class GraphQLScalarType
A scalar type within GraphQL.
#### class GraphQLObjectType
An object type within GraphQL that contains fields.
#### class GraphQLInterfaceType
An interface type within GraphQL that defines fields implementations will contain.
#### class GraphQLUnionType
A union type within GraphQL that defines a list of implementations.
#### class GraphQLEnumType
An enum type within GraphQL that defines a list of valid values.
#### class GraphQLInputObjectType
An input object type within GraphQL that represents structured inputs.
#### class GraphQLList
A type wrapper around other types that represents a list of those types.
#### class GraphQLNonNull
A type wrapper around other types that represents a non-null version of those types.

### Scalars

#### var GraphQLInt
A scalar type representing integers.
#### var GraphQLFloat
A scalar type representing floats.
#### var GraphQLString
A scalar type representing strings.
#### var GraphQLBoolean
A scalar type representing booleans.
#### var GraphQLID
A scalar type representing IDs.












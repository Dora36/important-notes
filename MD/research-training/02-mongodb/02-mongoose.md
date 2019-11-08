## 初始化项目并安装 mongoose

```
npm init
npm install mongoose
```

`index.js` 文件

```javascript
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mongoose-test');

//调用 mongoose.connect() 时，Mongoose 会自动创建默认连接。 可以使用 mongoose.connection 访问默认连接。

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
  console.log('数据库连接成功')
});
```

运行

```
node index.js
```

## 基本概念

### Schema

#### 定义 schema

Mongoose 的一切始于 `Schema`。每个 `schema` 都会映射到一个 MongoDB `collection` 集合，并定义这个 `collection` 里的文档的构成。

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  authorId: Schema.Types.ObjectId,
  name:  String,
  age: Number
});
```

#### SchemaType 选项

可以直接声明 schema type 为某一种 type，或者赋值一个含有 type 属性的对象。

```javascript
let schema1 = new Schema({
  name: String // `test` is a path of type String
});

let schema2 = new Schema({
  name: { type: String } // `test` is a path of type string
});
```

### model

#### 创建 model

`Models` 是从 `Schema` 编译来的构造函数。其实例就代表着可以从数据库保存和读取的 `documents`。 从数据库创建和读取 `document` 的所有操作都是通过 `model` 进行的。

把 `schema` 编译为一个 `Model`， 使用 `mongoose.model(modelName, schemaName[, collectionName])` 函数

```javascript
const Author = mongoose.model('Author', authorSchema);
```

第一个参数是跟 `model` 对应的 `collection` 集合的名字的 **单数** 形式。 Mongoose 会自动找到名称是 `model` 名字 **复数** 形式的 `collection`。

第三个参数是可选参数，如果有第三个参数，则集合名为第三个参数传入的名字。

```
> show collections
authors
```

#### 实例化 model 构造 documents

`Documents` 是 `model` 的实例。 可通过 `model` 创建 `documents` 并保存到数据库。

有 `save()` 和 `create()` 两种方法。

**save()**

```javascript
let dora = new Author({ name: 'dora' });

dora.save(function (err) {
  if (err) return handleError(err);
  // saved!
})
```

**create()**

```javascript
Author.create({ name: 'dora' }, function (err, data) {
  if (err) return handleError(err);
  // data 返回数据库中存储的该条数据
})
```

#### 查询 documents

查询文档可以用 `model` 的 `find`, `findById`, `findOne`, 和 `where` 这些静态方法。












# mongoose 中的 create

## [save()](https://mongoosejs.com/docs/api/model.html#model_Model-save)

`Model.prototype.save([options][, callback])`

`Document.prototype.save([options][, callback])`

- 要 save 的文档不包含 `_id` 字段，则插入新文档，类似于 `insert()`。
- 要 save 的文档包含 `_id` 字段，则更新文档，相当于 `update(filter,update,{upsert: true})`
- 要 save 的文档包含 `_id` 字段（必须是 `ObjectId` 形式），但 `_id` 的值在集合中不存在，则插入新文档，`_id` 字段使用文档中的值，不生成新的。

```js
let doc = new AuthorModel({ name: 'dora' });  // model 的实例是 document
let data = await doc.save();

data instanceof AuthorModel                   // true
data instanceof mongoose.Document             // true
```

### callback

- 返回插入数据库的文档，`{}` 形式。
- 不传入 `callback`，则返回 `promise`。

## [create()](https://mongoosejs.com/docs/api/model.html#model_Model.create)

`Model.create(docs[, options][, callback])`

将一个或多个文档保存到数据库的快捷方式。`create(docs)` 为 `docs` 中的每个文档执行 `MyModel(doc).save()`。

### docs

- 可以是 `[]` 数组形式，也可以是 `{}` 对象形式。
- 没有定义在 `schema` 中的字段，在创建的时候不会被添加进数据库。
- `schema` 中有默认值的字段会自动添加进数据库。
- `type` 为 `Array` 的字段默认值是 `[]` 空数组。
- `schema` 中 `required` 为 `true` 的字段没有的时候，会报错。

```js
let data = await Model.create(doc, doc)
let data = await Model.create([ doc, doc ])
```

### callback

- 不传入 `callback`，则返回 `promise`。
- 以 `{}` 形式创建一条，返回 `{}` 形式带 `_id` 的数据。
- 以 `[]` 形式创建一条，返回 `[]` 形式带 `_id` 的数据。
- 无论哪种形式创建多条，返回 `[]` 数组形式的数据。

## [insertMany()](https://mongoosejs.com/docs/api/model.html#model_Model.insertMany)

`Model.insertMany(docs[, options][, callback])`

该方法比 `create()` 方法更快，因为它只向服务器发送一个操作，而不是每个文档发送一个操作。

Mongoose 在向 MongoDB 发送 `insertMany` 之前会验证每个文档。因此，如果一个文档出现验证错误，则不会保存任何文档，除非将 `ordered` 选项设置为 `false`。

### doc

- `{}` 形式，只插入一条文档。
- `[]` 形式，可插入多条文档。

### options

- `ordered`：默认为 `true` （有序插入），即在遇到第一个错误时就失败并返回 `error`；如果为 `false` （无序插入），则插入所有可以正常插入的文档，然后返回错误信息。
- `rawResult`：默认 `false`，返回插入数据库的文档，如果为 `true`，返回 mongoose 原生 result。

### callback

- 不传入 `callback`，则返回 `promise`。
- 无论是 `[]` 或 `{}` 形式创建数据，都返回 `[]` 数组形式的结果。

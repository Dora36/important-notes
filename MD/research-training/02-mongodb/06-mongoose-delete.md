# mongoose 中的 delete

## [findOneAndDelete()](https://mongoosejs.com/docs/api/model.html#model_Model.findOneAndDelete)

`Model.findOneAndDelete(filter[, options][, callback])`

### options

- `sort`：如果查询条件找到多个文档，则设置排序顺序以选择要删除哪个文档。
- `select/projection`：指定返回的字段。
- `rawResult`：如果为 `true`，则返回来自 MongoDB 的原生结果。

### callback

- 没有符合 `filter` 的数据时，返回 `null`。
- `filter` 为空或 `{}` 时，删除第一条数据。
- 删除成功返回 `{}` 形式的原数据。

## [findByIdAndDelete()](https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndDelete)

`Model.findByIdAndDelete(id[, options][, callback])`

### id

`Model.findByIdAndDelete(id)` 相当于 `Model.findOneAndDelete({ _id: id })`。

### callback

- 没有符合 `id` 的数据时，返回 `null`。
- `id` 为空或 `undefined` 时，返回  `null`。
- 删除成功返回 `{}` 形式的原数据。

## [deleteMany()](https://mongoosejs.com/docs/api/model.html#model_Model.deleteMany)

`Model.deleteMany(filter[, options][, callback])`

### filter

删除所有符合 `filter` 条件的文档。

### callback

`callback(err, rawResponse)`

- `err`：错误信息
- `rawResponse`：Mongo 返回的原生的 `response`

```js
let result = await Model.deleteMany({name: 'dora'})
// { n: 1, ok: 1, deletedCount: 1 }
```

- `n`：**要**删除的文档数量。 
- `deletedCount`：删除的文档数量。

## [deleteOne()](https://mongoosejs.com/docs/api/model.html#model_Model.deleteOne)

`Model.deleteOne(filter[, options][, callback])`

### filter

删除符合 `filter` 条件的第一条文档。

### callback

`callback(err, rawResponse)`

- `err`：错误信息
- `rawResponse`：Mongo 返回的原生的 `response`

```js
let result = await Model.deleteOne({name: 'dora'})
// { n: 1, ok: 1, deletedCount: 1 }
```

- `n`：**要**删除的文档数量。 
- `deletedCount`：删除的文档数量。



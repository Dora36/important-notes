# mongoose 中的 delete

## [findOneAndDelete()](https://mongoosejs.com/docs/api/model.html#model_Model.findOneAndDelete)

`Model.findOneAndDelete(filter[, options][, callback])`

### 参数一：filter

[查询语句和 find() 一样](https://segmentfault.com/a/1190000021010300)

### 参数二：options

- `sort`：如果查询条件找到多个文档，则设置排序顺序以选择要删除哪个文档。
- `select/projection`：指定返回的字段。
- `rawResult`：如果为 `true`，则返回来自 MongoDB 的原生结果。

### 参数三：callback

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

## [findOneAndRemove()](https://mongoosejs.com/docs/api/model.html#model_Model.findOneAndRemove)

`Model.findOneAndRemove(filter[, options][, callback])`

用法与 `findOneAndDelete()` 一样，一个小小的区别是 `findOneAndRemove()` 会调用 MongoDB 原生的 `findAndModify()` 命令，而不是 `findOneAndDelete()` 命令。

建议使用 `findOneAndDelete()` 方法。

## [findByIdAndRemove()](https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndRemove)

`Model.findByIdAndRemove(id[, options][, callback])`

### id

`Model.findByIdAndRemove(id)` 相当于 `Model.findOneAndRemove({ _id: id })`。

## [remove()](https://mongoosejs.com/docs/api/model.html#model_Model.remove)

`Model.remove(filter[, options][, callback])`

从集合中删除所有匹配 `filter` 条件的文档。要删除第一个匹配条件的文档，可将 `single` 选项设置为 `true`。

`callback` 返回 `rawResponse` 原生的结果。`{ n: 1, ok: 1, deletedCount: 1 }`





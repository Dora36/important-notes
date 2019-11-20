# mongoose 中的 update

## [findOneAndUpdate()](https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate)

`Model.findOneAndUpdate(filter, update[, options][, callback])`

### 参数一：filter

- [查询语句和 `find()` 一样](https://segmentfault.com/a/1190000021010300)

- `filter` 为 `{}`，更新第一条数据

### 参数二：update

`{operator: { field: value, ... }, ... }`

- 必须使用 `update` 操作符

- 如果没有操作符或操作符不是 `update` 操作符，统一被视为 `$set` 操作（mongoose 特有）

#### [update 操作符](https://docs.mongodb.com/manual/reference/operator/update/#id1)

**字段相关操作符**

符号 | 描述
:- | :-
$set | 设置字段值
$currentDate | 设置字段值为当前时间，可以是 `Date` 或时间戳格式。
$min | 只有当指定值小于当前字段值时更新
$max | 只有当指定值大于当前字段值时更新
$inc | 将字段值增加 `+` 指定数量，指定数量可以是负数，代表减少。
$mul | 将字段值乘以 `x` 指定数量
$setOnInsert | 搭配 `upsert: true` 选项一起使用。找到匹配文档，作用类似 `$set`；没找到，就添加一条新数据
$unset | 删除指定字段，数组中的值删后改为 `null`。

如果字段不存在，这些操作符都会添加字段，并且字段值设置为指定值，`$mul` 设置为与指定值同类型的 `0`。

**数组字段相关操作符**

符号 | 描述
:- | :-
$ | 充当占位符，用来表示匹配查询条件的数组字段中的第一个元素 `{operator:{ "arrayField.$" : value }}`
$[ ] | 充当占位符，用来表示匹配查询条件的数组字段中的所有元素 `{operator:{ "arrayField.$[]" : value }}`
$[identifier] | 充当占位符，表示与查询条件匹配的文档的 `arrayFilters` 条件匹配的所有元素。
$addToSet | 向数组字段中添加之前不存在的元素 `{ $addToSet: {arrayField: value, ... }}`，`value` 是数组时可与 `$each` 组合使用。
$push | 向数组字段的末尾添加元素 `{ $push: { arrayField: value, ... } }`，`value` 是数组时可与 `$each` 等修饰符组合使用。
$pop | 移除数组字段中的第一个或最后一个元素 `{ $pop: {arrayField: -1(first) / 1(last), ... } }`
$pull | 移除数组字段中与查询条件匹配的所有元素 `{ $pull: {arrayField: value / condition, ... } }`
$pullAll | 从数组中删除所有匹配的值 `{ $pullAll: { arrayField: [value1, value2 ... ], ... } }`

**修饰符**

`{ $push: { arrayField: { modifier: value, ... }, ... } }`

符号 | 描述
:- | :-
$each | 修饰 `$push` 和 `$addToSet` 操作符，以便为数组字段添加多个元素。
$position | 修饰 `$push` 操作符以指定要添加的元素在数组中的位置。
$slice | 修饰 `$push` 操作符以限制更新后的数组的大小。
$sort | 修饰 `$push` 操作符来重新排序数组字段中的元素。

修饰符执行的顺序（与定义的顺序无关）：

- 在指定的位置添加元素以更新数组字段
- 按照指定的规则排序
- 限制数组大小
- 存储数组

### 参数三：options

- `lean`：`true` 返回普通的 js 对象，而不是 `Mongoose Documents`。
- `new`：布尔值，`true` 返回更新后的数据，`false` （默认）返回更新前的数据。
- `fields/select`：指定返回的字段。
- `sort`：如果查询条件找到多个文档，则设置排序顺序以选择要更新哪个文档。
- `maxTimeMS`：为查询设置时间限制。
- `upsert`：布尔值，如果对象不存在，则创建它。默认值为 `false`。
- `omitUndefined`：布尔值，如果为 `true`，则在更新之前删除值为 `undefined` 的属性。
- `runValidators`：如果为 `true`，则在此命令上运行更新验证器。更新验证器根据 `schema` 验证更新数据。

### 参数四：callback

- 没找到数据返回 `null`
- 更新成功返回更新前的该条数据（ `{}` 形式)
- `options` 的 `{new:true}`，更新成功返回更新后的该条数据（ `{}` 形式)
- 没有查询条件，即 `filter` 为空，则更新第一条数据

## [findByIdAndUpdate()](https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndUpdate)

`Model.findByIdAndUpdate(id, update[, options][, callback])`

### id

`Model.findByIdAndUpdate(id, update)` 相当于 `Model.findOneAndUpdate({ _id: id }, update)`。

### result 查询结果

- 返回数据的格式是 `{}` 对象形式。
- `id` 为 `undefined` 或 `null`，`result` 返回 `null`。
- 没符合查询条件的数据，`result` 返回 `null`。

## [update()](https://mongoosejs.com/docs/api/model.html#model_Model.update)

`Model.update(filter, update[, options][, callback])`

### options

- `multi`：默认 `false`，只更新第一条数据；为 `true` 时，符合查询条件的多条文档都会更新。
- `overwrite`：默认为 `false`，即 `update` 参数如果没有操作符或操作符不是 `update` 操作符，将会默认添加 `$set`；如果为 `true`，则不添加 `$set`，视为覆盖原有文档。

### callback

`callback(err, rawResponse)`

- `err`：错误信息
- `rawResponse`：Mongo 返回的原生的 `response`

```js
let result = await Model.update({name: 'dora'}, {$set: {age: 18}})
// { n: 1, nModified: 1, ok: 1 }
```

- `n`：**要**更新的文档数量。 
- `nModified`：更新的文档数量，如果 `update` 的数据和之前没有变化，则 `nModified` 为 `0`。

## [updateMany()](https://mongoosejs.com/docs/api/model.html#model_Model.updateMany)

`Model.updateMany(filter, update[, options][, callback])`

更新符合查询条件的所有文档，相当于 `Model.update(filter, update, { multi: true }[, callback])`


## [updateOne()](https://mongoosejs.com/docs/api/model.html#model_Model.updateOne)

`Model.updateOne(filter, update[, options][, callback])`

与 `update()` 相同，只是它不支持 `multi` 和 `overwrite` 选项参数，`update` 参数必须使用 `update` 操作符。

只更新第一条符合条件的文档的属性，如果要覆盖文档的全部内容，请使用 `replaceOne()`。

## [replaceOne()](https://mongoosejs.com/docs/api/model.html#model_Model.replaceOne)

`Model.replaceOne(filter, update[, options][, callback])`

配置与 `update()` 相同，只是会用 `update` 参数中的数据覆盖符合条件的第一条文档，而不是更新属性，不支持任何 `update` 操作符。

```js
let result = await Model.replaceOne({name: 'dora'}, {name:'dora.wang', age: 18})
// { n: 1, nModified: 1, ok: 1 }
```

## [findOneAndUpdate](http://www.mongoosejs.net/docs/api.html#query_Query-findOneAndUpdate)


```javascript
query.findOneAndUpdate(conditions, update, options, callback) // executes
query.findOneAndUpdate(conditions, update, options)           // returns Query
query.findOneAndUpdate(conditions, update, callback)          // executes
query.findOneAndUpdate(conditions, update)                    // returns Query
query.findOneAndUpdate(update, callback)                      // returns Query
query.findOneAndUpdate(update)                                // returns Query
query.findOneAndUpdate(callback)                              // executes
query.findOneAndUpdate()                                      // returns Query
```

**return**

- 没 find 到数据返回 `null`
- 如果是 `_id` 查找，`_id` 不是 `ObjectID` 形式，会报错
- 更新成功返回更新前的该条数据（ `{}` 形式)
- `options` 的 `{new:true}`，更新成功返回更新后的该条数据（ `{}` 形式)
- `query.findOneAndUpdate(update)` 没有查询条件的会将第一条数据更新为 `update` 中的数据


## [findByIdAndUpdate](http://www.mongoosejs.net/docs/api.html#findbyidandupdate_findByIdAndUpdate)

相当于 `findOneAndUpdate({ _id: id }, ...)`

```javascript
M.findByIdAndUpdate(id, update, options, callback)  // executes
M.findByIdAndUpdate(id, update, options)            // returns Query
M.findByIdAndUpdate(id, update, callback)           // executes
M.findByIdAndUpdate(id, update)                     // returns Query
M.findByIdAndUpdate()                               // returns Query
```

## [create](http://www.mongoosejs.net/docs/api.html#create_create)

- 没有定义在 `schema` 中的字段，在创建的时候不会被添加进数据库
- `schema` 中有默认值的字段会自动添加进数据库
- `type` 为 `Array` 的字段默认值是 `[]` 空数组
- `schema` 中 `required` 为 `true` 的字段没有的时候，会报错

```javascript
M.create(documents, callback)                 // executes
M.create(documents, documents, callback)      // executes
M.create([documents, documents], callback)    // executes
M.create(documents)                           // return promise
```

**return**

- 以 `{}` 形式创建一条，返回带 `_id` 的数据（ `{}` 形式)
- 以 `[]` 形式创建一条，返回带 `_id` 的数据（ `[]` 形式)
- 无论哪种形式创建多条，返回 `[]` 数组形式的数据

## [save]()












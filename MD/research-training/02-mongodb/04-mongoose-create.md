# mongoose 中的 create

## [save()]()



















## [create()](https://mongoosejs.com/docs/api/model.html#model_Model.create)

`Model.create(docs[, options][, callback])`

### 参数一：docs








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

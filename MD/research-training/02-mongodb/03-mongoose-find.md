# mongoose 中的 find

## [find()](https://mongoosejs.com/docs/api/model.html#model_Model.find)

`Model.find(filter,projection,options,callback)`

### 参数解析

#### filter

查询条件使用 JSON 文档的格式，JSON 文档的语法跟 [`MongoDB shell`](https://docs.mongodb.com/manual/reference/method/db.collection.find/) 中一致。

`{ field1: value1, field2: { operator: value2 } ... }`

*1. 查找全部*

```js
Model.find()
```

*2. 精确查找*

```js
Model.find({author:'dora'})
```

*3. 使用[操作符](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors)*

**对比相关操作符**

符号 | 描述
:- | :-
$eq | 与指定的值**相等**
$ne | 与指定的值**不相等**
$gt | **大于**指定的值
$gte | **大于等于**指定的值
$lt | **小于**指定的值
$lte | **小于等于**指定的值
$in | 与查询数组中指定的值中的任何一个匹配
$nin | 与查询数组中指定的值中的任何一个都**不**匹配

```js
Model.find({ age: { $in: [16, 18]} })
```

返回 `age` 字段等于 `16` 或者 `18` 的所有 document。

*4. 嵌套对象字段的查找*

数据如下

```json
{
  name: { first: "dora", last: "wang" }
}
```

精确匹配，顺序、字段都必须一致。

```js
Model.find({ name: { last: "wang", first: "dora" } })
// [] 找不到数据
```

使用点语法，可匹配嵌套的字段，其中字段名必须用引号引起来。

```js
Model.find({ 'name.last': 'wang' })
```

*5. 数组字段的查找*

符号 | 描述
:- | :-
$all | 匹配**包含**查询数组中指定的**所有**条件的数组字段
$elemMatch | 匹配数组字段中的某个值满足 `$elemMatch` 中指定的**所有**条件
$size | 匹配数组字段的 length 与指定的大小一样的 document

数据如下

```json
{ year: [ 2018, 2019 ] }
{ year: [ 2017, 2019, 2020 ] }
{ year: [ 2016, 2020 ] }
```

**查找数组中的至少一个值**

可使用精确查找写法 `{field: value}`

```js
Model.find({ year: 2019 });
// { "_id" : ..., "year" : [ 2018, 2019 ] }
// { "_id" : ..., "year" : [ 2017, 2019, 2020 ] }
```

**查找数组中的多个值**

使用 `$all` 查找同时存在 `2019` 和 `2020` 的 `document`

```js
Model.find({ year: { $all: [ 2019, 2020 ] } });
// { "_id" : ..., "year" : [ 2017, 2019, 2020 ] }
```

**操作符组合查询**

可使用操作符进行筛选，`{<field>:{operator: value}}`，比如 `$in`

```js
Model.find({ year: { $in: [ 2018, 2020 ] } });
// { "_id" : ..., "year" : [ 2018, 2019 ] }
// { "_id" : ..., "year" : [ 2017, 2019, 2020 ] }
```

使用操作符组合查询 `{<field>:{operator1: value1, operator2: value2}}`

```js
Model.find({ year: { $gt: 2019, $lt: 2018 } });
// { "_id" : ..., "year" : [ 2017, 2019, 2020 ] }
// { "_id" : ..., "year" : [ 2016, 2020 ] }
```

数组字段包含满足查询条件的元素，可以是不同元素分别满足条件也可以是同一个元素满足所有条件，如上例，是一个值满足大于2019的条件，另一个值满足小于2018的条件。

**$elemMatch 单个字段值满足所有查询条件**

`$elemMatch` 查找数组字段中的值同时满足所有条件的 document。

`{field: { $elemMatch: { <query1>, <query2>, ... }}}`

```js
Model.find({ year: { $elemMatch: { $gt: 2016, $lt: 2018 } } })
// { "_id" : ..., "year" : [ 2017, 2019, 2020 ] }
```

**数组下标查询**

```js
Model.find({ 'year.1': { $gt: 2019 } })
// { "_id" : ..., "year" : [ 2016, 2020 ] }
```

数组 `year` 的第二个值大于`2019`。

*6. 数组对象的查找*

数据如下

```json
{author: [{name: "dora", age: 18 },{name: "wang", age: 16 }]}
```

**精确查询**

精确匹配，顺序、字段都必须一致。

```js
Model.find({ author: { name: "dora", age: 18 } })
```

**点语法查询**

```js
Model.find({ 'author.age': { $gte: 18 } })
```

**$elemMatch 同时满足所有查询条件**

```js
Model.find({ "author": {$elemMatch: {name: 'dora', age:{ $lt: 18 }}})
// []
```

#### projection

指定要包含或排除哪些 `document` 字段(也称为查询“投影”)，必须同时指定包含或同时指定排除，不能混合指定，`_id` 除外。

在 mongoose 中有两种指定方式，字符串指定和对象形式指定。

字符串指定时在排除的字段前加 `-` 号，只写字段名的是包含。

```js
Model.find({},'age');
Model.find({},'-name');
```

对象形式指定时，1 是包含，0 是排除。

```js
Model.find({}, { age: 1 });
Model.find({}, { name: 0 });
```

**使用 select() 方法定义**

```js
Model.find().select('name age');
Model.find().select({ name: 0 });
```

#### options

#### callback

- [mongodb 在 mongo shell 中的 find](https://docs.mongodb.com/manual/reference/method/db.collection.find/)
- [mongodb 在 node.js 中的 find](https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#find)
- [mongoose 的 find](https://mongoosejs.com/docs/api/model.html#model_Model.find)
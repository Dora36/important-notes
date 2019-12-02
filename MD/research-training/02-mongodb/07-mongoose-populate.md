# mongoose 中的 populate

Mongoose 的 `populate()` 可以连表查询，即在另外的集合中引用其文档。

`Populate()` 可以自动替换 `document` 中的指定字段，替换内容从其他 `collection` 中获取。

## refs

创建 `Model` 的时候，可给该 `Model` 中关联存储其它集合 `_id` 的字段设置 `ref` 选项。`ref` 选项告诉 Mongoose 在使用 `populate()` 填充的时候使用哪个 `Model`。

```js
const authorSchema = new Schema({
  name: String,
  age: Number,
  story: { type: Schema.Types.ObjectId, ref: 'Story' }
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

let Author = mongoose.model('Author', authorSchema);
```

上例中 `Author` model 的 `friends` 字段设为 `ObjectId` 数组。 `ref` 选项告诉 Mongoose 在填充的时候使用 `User` model。所有储存在 `friends` 中的 `_id` 都必须是 `User` model 中 `document` 的 `_id`。

`ObjectId`、`Number`、`String` 以及 `Buffer` 都可以作为 `refs` 使用。 但是最好还是使用 `ObjectId`。

在创建文档时，保存 `refs` 字段与保存普通属性一样，把 `_id` 的值赋给它就好了。

```js
let author = new Author({
  name: 'dora',
  age: 18,
  story: story._id  // 直接赋值 story 的 _id
});

await author.save();
```

## populate(path, select)

### 填充 document

```js
let author = await Author.findOne({ name: 'dora' }).populate('story');

author.story   // {...} 从 Story 表中查到的文档
```

被填充的 `story` 字段已经不是原来的 `_id`，而是被指定的 `document` 代替。这个 `document` 由另一条 query 从数据库返回。

`refs` 数组返回存储对应 `_id` 的 `document` 数组。

**没有关联的 document**

如果没有关联的文档，则返回值为 `null`，即 `author.story` 为 `null`；如果字段是数组，则返回 `[]` 空数组即 `author.friends` 为 `[]`。

```js
let author = await Author.findOne({ name: 'dora' }).populate('friends');

author.friends   // []
```

### 返回字段选择

如果只需要填充 `document` 中一部分字段，可给 `populate()` 传入第二个参数，参数形式即 **返回字段字符串**，同 [`Query.prototype.select()`](https://mongoosejs.com/docs/api.html#query_Query-select)。

```js
let author = await Author.findOne({ name: 'dora' }).populate('story', 'title -_id');

author.story           // {title: ...}  只返回 title 字段
author.story.content   // null  其余字段为 null
```

### populate 多个字段

```js
let author = await Author.findOne({ name: 'dora' }).populate('story').populate('friends');
```

如果对同一字段 `populate()` 两次，只有最后一次生效。

## populate({ objParam })

`objParam`:

- `path`：需要 `populate` 的字段。

- `populate`：多级填充。

- `select`：从 `populate` 的文档中选择返回的字段。

- `model`：用于 `populate` 的关联 `model`。如果没有指定，`populate` 将根据 `schema` 中定义的 `ref` 字段中的名称查找 `model`。可指定跨数据库的 `model`。

- `match`：`populate` 查询的条件。

- `options`：`populate` 查询的选项。

  - `sort`：排序。

  - `limit`：限制数量。

### 多级填充

```js
// 查询 friends 的 friends
Author.findOne({ name: 'dora' }).
populate({
  path: 'friends',
  populate: { path: 'friends' }
});
```

### 跨数据库填充

跨数据库不能直接通过 `schema` 中的 `ref` 选项填充，但是可以通过 `objParam` 中的 `model` 选项显式指定一个跨数据库的 `model`。

```js
let eventSchema = new Schema({
  name: String,
  conversation: ObjectId  // 注意，这里没有指定 ref！
});
let conversationSchema = new Schema({
  numMessages: Number
});

let db1 = mongoose.createConnection('localhost:27000/db1');
let db2 = mongoose.createConnection('localhost:27001/db2');

// 不同数据库的 Model
let Event = db1.model('Event', eventSchema);
let Conversation = db2.model('Conversation', conversationSchema);

// 显示指定 model
let doc = await Event.find().populate({
   path: 'conversation', 
   model: Conversation 
})
```

## 通过 refPath 动态引用填充的 Model

Mongoose 还可以针对同一个存储 `_id` 的字段从多个不同的集合中查询填充。

```js
//用于存储评论的 schema。用户可以评论博客文章或作品。
const commentSchema = new Schema({
  body: { type: String, required: true },
  on: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel'
  },
  onModel: {
    type: String,
    required: true,
    enum: ['BlogPost', 'Product']
  }
});

const Product = mongoose.model('Product', new Schema({ name: String }));
const BlogPost = mongoose.model('BlogPost', new Schema({ title: String }));
const Comment = mongoose.model('Comment', commentSchema);
```

`refPath` 选项比 `ref` 更复杂。 如果 `ref` 只是一个字符串，Mongoose 将查询相同的 `model` 以查找填充的子文档。 而使用 `refPath`，可以配置用于每个不同文档的 `model`。

```js
const book = await Product.create({ name: '笑场' });
const blog = await BlogPost.create({ title: '笑场中的经典语录，句句犀利，直戳人心' });

// 分别指定了不同评论来源的两个评论数据
const commentOnBook = await Comment.create({
  body: 'Bravo',
  on: book._id,
  onModel: 'Product'
});

const commentOnBlog = await Comment.create({
  body: '未曾开言我先笑场。笑场完了听我诉一诉衷肠。',
  on: blog._id,
  onModel: 'BlogPost'
});
```

```js
const comments = await Comment.find().populate('on');
comments[0].on.name;    // "笑场"
comments[1].on.title;   // "笑场中的经典语录..."
```

当然在 `commentSchema` 中也可以定义单独的 `blogPost` 和 `product` 字段，分别存储 `_id` 和对应的 `ref` 选项。 但是，这样是不利于业务扩展的，比如在后续的业务中增加了歌曲或电影的用户评论，则需要在 `schema` 中添加更多相关字段。而且每个字段都需要一个 `populate()` 查询。而使用 `refPath` 意味着，无论 `commentSchema` 可以指向多少个 `Model`，联合查询的时候只需要一个 `populate()` 即可。

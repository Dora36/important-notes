## Mac 安装

[mongoDB 中文网](https://www.mongodb.org.cn/)

[下载地址](https://www.mongodb.com/download-center/community)

### 1. curl 命令下载压缩包安装

```
# 进入 /usr/local
cd /usr/local

# 下载
sudo curl -O https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-4.2.1.tgz

# 解压
sudo tar -zxvf mongodb-osx-ssl-x86_64-4.0.9.tgz

# 重命名为 mongodb 目录
sudo mv mongodb-osx-x86_64-4.0.9/ mongodb

# 删除压缩包
sudo rm -rf mongodb-osx-ssl-x86_64-4.0.9.tgz
```

### 2. 安装目录 /bin 添加到 PATH 路径中

打开或新建路径配置文件

```
cd ~                     //进入 home 目录
touch .bash_profile      // 创建文件
open -e .bash_profile    // 打开文件
```

文件打开后，在文件中输入：

```
export PATH=$PATH:/usr/local/mongodb/bin
```

之后 可在命令行中查看 PATH

```
echo $PATH
```

### 3. 创建数据库存储目录 

新建 db 文件夹

```
sudo mkdir -p /usr/local/mongodb/db
```

修改文件夹权限

```
sudo chown -R dorawang /usr/local/mongodb/db
```

新的存储目录作为参数启动 mongodb

```
sudo mongod --dbpath=/usr/local/mongodb/db
```

### 4. 修改配置文件

文件地址 `/usr/local/etc/mongod.conf`

在文件中写入 

```
dbpath=/usr/local/mongodb/db
port=27017
```

### 5. 通过 config 文件启动数据库

启动数据库服务

```
mongod -f /usr/local/etc/mongod.conf
```

```
mongo
```

### 6. 数据库导出数据

```
mongodump -h <hostname><:port> -d <dbname> -o <path>
```

- `-h`：MongDB 所在服务器地址，例如：127.0.0.1:27017

- `-d`：需要备份的数据库实例，例如：test

- `-o`：备份的数据存放位置目录，`～/Downloads/mongodb`，该目录需要提前创建好。

- `-c`：`--collection`，需要备份的集合名。

```
mongodump -d <dbname> -c <collection> -o <path>
```

```
mongodump
```

`mongodump` 会备份全部内容。会连接到 ip 为 127.0.0.1 端口号为 27017 的 MongoDB 服务上，并备份所有数据到 `bin/dump/` 目录中。

### 7. 数据库导入数据

```
mongorestore -h <hostname><:port> -d <dbname> <path>
```

其中参数含义：

- hostname：127.0.0.1

- port：27017

- dbname：数据库名

- path：数据库文件的绝对路径 `～/Downloads/**`

```
mongorestore -h 127.0.0.1:27017 -d eportal ~/Downloads/neweportal
```

## 基本概念简介

|SQL术语/概念	|MongoDB术语/概念|解释/说明|
|:-:|:-:|:-:|
|database|	database|	数据库|
|table|	collection|	数据库表/集合|
|row|	document	|数据记录行/文档|
|column|	field	|数据字段/域|
|index	|index|	索引|
|table joins |	 |	表连接,MongoDB不支持|
|primary key	|primary key|	主键,MongoDB自动将_id字段设置为主键|

### 数据库

**命名规范**

- 不能是空字符串（`""`)。
- 不得含有 '` `'（空格)、`.`、`$`、`/`、`\`和`\0` (空字符)。
- 应全部小写。
- 最多64字节。

#### 数据库相关操作

**1. 创建数据库**

使用 `use DATABASE_NAME` 命令创建数据库，如果数据库不存在，则创建数据库，否则切换到指定数据库。

MongoDB 中默认的数据库为 `test`，如果你没有创建新的数据库，集合将存放在 `test` 数据库中。

```
> use dora
switched to db dora
```

**2. 用 `db` 命令查看当前数据库**

```
> db
dora
```

**3. 用 `show dbs` 命令查看所有数据库**

```
> show dbs
admin    0.000GB
config   0.000GB
local    0.000GB
```

可以看到，我们刚创建的数据库 `dora` 并不在数据库的列表中， 要显示它，我们需要向 `dora` 数据库插入一些数据。

```
> db.dora.insert({"name":"dora"})
WriteResult({ "nInserted" : 1 })
> show dbs
admin    0.000GB
config   0.000GB
dora     0.000GB
local    0.000GB
```

**4. 删除数据库**

通过 `db.dropDatabase()` 命令删除当前数据库。

```
> db.dropDatabase()
{ "dropped" : "dora", "ok" : 1 }
```

通过 `show dbs` 查看到删除成功了。

```
> show dbs
admin    0.000GB
config   0.000GB
local    0.000GB
```

### 集合

集合就是 MongoDB 文档组，集合存在于数据库中，集合没有固定的结构，这意味着你在对集合可以插入不同格式和类型的数据，但通常情况下我们插入集合的数据都会有一定的关联性。

在 MongoDB 中，集合只有在内容插入后才会创建！就是说，创建集合(数据表)后要再插入一个文档(记录)，集合才会真正创建。

**命名规范**

- 集合名不能是空字符串 `""`。
- 集合名不能含有 `\0` 字符（空字符)，这个字符表示集合名的结尾。
- 集合名不能以 "`system.`" 开头，这是为系统集合保留的前缀。
- 用户创建的集合名字不能含有保留字符。有些驱动程序的确支持在集合名里面包含，这是因为某些系统生成的集合中包含该字符。除非你要访问这种系统创建的集合，否则千万不要在名字里出现 `$`。　

#### 集合相关操作

**1. 用 createCollection() 方法创建集合**

MongoDB 中使用 `db.createCollection(name, options)` 方法来创建集合。

- name: 要创建的集合名称
- options: 可选参数, 指定有关内存大小及索引的选项

```
> use dora
switched to db dora
> db.createCollection('mongodb')
{ "ok" : 1 }
```

**2. 查看已有集合**

使用 `show collections` 或 `show tables` 命令查看已有集合。

```
> show collections
mongodb
> show tables
mongodb
```

**3. 自动创建集合**

一般情况下，在插入文档时，MongoDB 会自动创建集合。

```
> db.author.insert({"name" : "dora"})
WriteResult({ "nInserted" : 1 })
> show collections
author
mongodb
```

**4. 用 db.COLLECTION_NAME.drop() 方法删除集合**

如果成功删除选定集合，则 `drop()` 方法返回 `true`，否则返回 `false`。

```
> db.mongodb.drop()
true
```

### 文档(Document)

文档是一组键值(key-value)对(即 BSON)。MongoDB 的文档不需要设置相同的字段，并且相同的字段不需要相同的数据类型，这与关系型数据库有很大的区别，也是 MongoDB 非常突出的特点。

**命名规范**

- 键不能含有 `\0` (空字符)。这个字符用来表示键的结尾。
- `.` 和 `$` 有特别的意义，只有在特定环境下才能使用。
- 以下划线 `_` 开头的键是保留的(不是严格要求的)。

#### 文档相关操作

**1. 用 insert() 或 save() 方法向集合中插入文档**

使用 `db.COLLECTION_NAME.insert(document)` 语法

```
> db.author.insert({"name":"dora","age":18})
WriteResult({ "nInserted" : 1 })
```

其中 `author` 是集合名，如果该集合不在该数据库中， MongoDB 会自动创建该集合并插入文档。

定义变量插入数据

定义变量 `item`，将 `item` 插入集合中。

```
> item=({name:'wang',age:18})
{ "name" : "wang", "age" : 18 }
> db.author.insert(item)
WriteResult({ "nInserted" : 1 })
> db.author.find()
{ "_id" : ObjectId("5db79a78bc11b847f5d0b1d2"), "name" : "dora", "age" : 18 }
{ "_id" : ObjectId("5db79bd7bc11b847f5d0b1d3"), "name" : "wang", "age" : 18 }
```

- `db.COLLECTION_NAME.insertOne()`：向指定集合中插入一条文档数据
- `db.COLLECTION_NAME.insertMany()`：向指定集合中插入多条文档数据

插入文档也可以使用 `db.author.save(document)` 命令。如果不指定 `_id` 字段 `save()` 方法类似于 `insert()` 方法。如果指定 `_id` 字段，则会更新该 `_id` 的数据。

**2. 更新文档**

**`update()`**

`update()` 方法用于更新已存在的文档。语法格式如下：

```
db.COLLECTION_NAME.update(    
	<query>, 
	<update>, 
	{       
		upsert: <boolean>,   
		multi: <boolean>,  
		writeConcern: <document>
	}
)
```

参数说明：

- `query`: `update` 的查询条件，类似 `sql update` 查询内 `where` 后面的。
- `update`: `update` 的对象和一些更新的操作符（如 `$`,`$inc` ...）等，也可以理解为 `sql - update` 查询内 `set` 后面的
- `upsert`: 可选，这个参数的意思是，如果不存在 `update` 的记录，是否插入数据,`true` 为插入，默认是 `false`，不插入。
- `multi`: 可选，mongodb 默认是 `false`,只更新找到的第一条记录，如果这个参数为`true`,就把按条件查出来多条记录全部更新。
- `writeConcern`:可选，抛出异常的级别。

```
>db.dora.update({name:'e'},{$set:{name:'www'}})
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
```

以上语句只会修改第一条发现的文档，如果要修改多条相同的文档，则需要设置 `multi` 参数为 `true`。

```
>db.dora.update({name:'e'},{$set:{name:'www'}},{multi:true})
```

**save()**

`save()` 方法通过传入的文档来替换已有文档。语法格式如下：

```
db.COLLECTION_NAME.save(
   <document>,
   {
     writeConcern: <document>
   }
)
```

参数说明：

- `document`: 文档数据。其中 `_id` 为要替换的文档 `_id`，其余为直接替换的文档内容。
- `writeConcern`:可选，抛出异常的级别。

比如替换 `_id` 为 5db7a40174d9e4069b0487be 的文档数据：

```
>db.dora.save({
    "_id" : ObjectId("5db7a40174d9e4069b0487be"),
    "name" : "dorawang",
    "age":18
})
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
```

**3. 删除文档**

- `db.COLLECTION_NAME.deleteMany()`
- `db.COLLECTION_NAME.deleteOne()`

删除集合下全部文档

```
db.COLLECTION_NAME.deleteMany({})
```

删除多条数据

```
db.COLLECTION_NAME.deleteMany({ <field1>: <value1>, ... })

>db.dora.deleteMany({name:'aaa'})
// 删除 name 等于 aaa 的全部文档
```

删除单条数据

```
// 删除 name 等于 r 的一个文档：
> db.dora.deleteOne({name:'r'})
{ "acknowledged" : true, "deletedCount" : 1 }
```

**4. 用 find() 查询文档**

`db.COLLECTION_NAME.find(query, projection)`
`db.COLLECTION_NAME.findOne(query, projection)`

参数说明：

- `query`：可选，使用查询操作符指定查询条件
- `projection`：可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）。

`pretty()` 方法以数据格式化方式显式数据，使得数据更加易读 `db.COLLECTION_NAME.find().pretty()`

```
> db.author.find()
{ "_id" : ObjectId("5db79a78bc11b847f5d0b1d2"), "name" : "dora", "age" : 18 }
{ "_id" : ObjectId("5db79bd7bc11b847f5d0b1d3"), "name" : "wang", "age" : 18 }
> db.author.find().pretty()
{
	"_id" : ObjectId("5db79a78bc11b847f5d0b1d2"),
	"name" : "dora",
	"age" : 18
}
{
	"_id" : ObjectId("5db79bd7bc11b847f5d0b1d3"),
	"name" : "wang",
	"age" : 18
}
```

## mongoDB 在 node 中的使用

### 初始化项目并安装 mongodb

```
npm init
npm install -D mongodb
```

### index.js 文件

```javascript
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'dora';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  // 数据表
  const db = client.db(dbName);

  // 集合
  const collection = db.collection('author');

  // 插入数据
  collection.insert({ name: "myName", age: "myAge" }, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      console.log("insert result:");
      console.log(result);
    }
  })

  // 查询数据
  collection.find({}).toArray(function (err, docs) {
    if (err) {
      console.error(err);
    } else {
      console.log("find result:");
      console.log(docs);
    }
  });

  // 删除数据
  collection.deleteOne({ name: "myName", age: "myAge" }, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      console.log("delete result:");
      console.log(result);
    }
  });

  // 更新数据
  collection.updateOne({ name: "myName", age: "myAge" }, {
    $set: { name: "dorawang", age: 16 }, function(err, result) {
      if (err) {
        console.error(err);
      } else {
        console.log("update result:");
        console.log(result);
      }
    }
  });


  client.close();
});
```

运行

```
node index.js
```
















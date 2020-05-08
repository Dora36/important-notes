## 数据库分类 (DBA)

### SQL 

- 关系型数据库：`MySQL`、`Oracle`，最常见、最常用，数据之间有关系，速度快、性能高、处理能力强，但数据结构是固定的。大型系统的主数据库。
	- `MySQL`：免费，绝大多数普通应用，性能也高、安全性也高但容灾略差。
	- `Oracle`：付费，金融、医疗。容灾特别强。

- 文件型数据库 `sqlite`：简单、小，不擅长处理大型数据。比如：手机通讯录或通话记录。

- 文档型数据库 `MongoDB`：直接存储异构数据，方便。但性能没有关系型数据库高。

- 其它：空间型数据库

### NoSQL

`SQL` 和 `NoSQL` 比起来，性能略差。

- 没有复杂的关系。
- 对性能有极高的要求。
- `redis`、`memcached`、`hypertable`、`bigtable`

## node 操作 mysql

### 安装

```shell
npm install mysql -D
```

### 使用

```js
const mysql = require('mysql');

//1. 连接池，可默认建立10个连接
let db = mysql.createPool({host: 'localhost', user: 'root', password: '', port: 3306, database: '库名'});

//2. 查询
db.query(`SQL语句;`, (err,data)=>{
  if(err) {
    console.log(err);
  }else {
    console.log(data);
  }
});
```

## node 操作 mongodb

### 安装

```shell
npm install -D mongodb
```

### 使用

```js
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

## node 使用 mongoose

### 安装

```shell
npm install mongoose -D
```

### 使用

```js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mongoose-test');

//调用 mongoose.connect() 时，Mongoose 会自动创建默认连接。 可以使用 mongoose.connection 访问默认连接。

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
  console.log('数据库连接成功')
});
```

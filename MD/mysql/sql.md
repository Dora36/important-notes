## SQL 简介

SQL 指结构化查询语言，全称是 Structured Query Language。

SQL 可用来访问和处理数据库，如数据的增、删、改、查，数据库及表的创建和修改，以及数据访问权限控制。

SQL 对大小写不敏感：`SELECT` 与 `select` 是相同的。每条 SQL 语句的末端需使用分号。

### 一些最重要的 SQL 命令

- `SELECT`：从数据库中提取数据
- `UPDATE`：更新数据库中的数据
- `DELETE`：从数据库中删除数据
- `INSERT INTO`：向数据库中插入新数据
- `CREATE DATABASE`：创建新数据库
- `ALTER DATABASE`：修改数据库
- `CREATE TABLE`：创建新表
- `ALTER TABLE`：变更（改变）数据库表
- `DROP TABLE`：删除表
- `CREATE INDEX`：创建索引（搜索键）
- `DROP INDEX`：删除索引

## INSERT INTO

向 MySQL 数据表插入数据一般使用 `INSERT INTO` 语法：

```sql
INSERT INTO table_name ( field1, field2,...fieldN )
                       VALUES
                       ( value1, value2,...valueN );
```

添加多行数据，可以将 values 用逗号隔开：

```sql
INSERT INTO table_name  (field1, field2,...fieldN) 
                        VALUES
                        (valueA1,valueA2,...valueAN),
                        (valueB1,valueB2,...valueBN),
                        (valueC1,valueC2,...valueCN)
                        ......;
```

如果需要添加全部列数据，可以省略列名：

```sql
INSERT INTO table_name VALUES (valueA1,valueA2,...valueAN);
```

## DELETE

`DELETE` 语句用于删除表中的记录。

```sql
DELETE FROM table_name
WHERE some_column=some_value;
```

`WHERE` 子句用于规定哪些记录需要删除。如果省略了 `WHERE` 子句，所有的记录都将被删除。

## UPDATE

`UPDATE` 语句用于更新表中的记录。

```sql
UPDATE table_name
SET column1=value1,column2=value2,...
WHERE some_column=some_value;
```

`WHERE` 子句用于规定哪些记录需要更新，如果省略了 `WHERE` 子句，将更新所有记录。

在 MySQL 中可以通过设置 `sql_safe_updates` 这个自带的参数来解决，当该参数开启的情况下，你必须在 `update` 语句后携带 `where` 条件，否则就会报错。

`set sql_safe_updates=1;` 表示开启该参数。

## SELECT

`SELECT` 语句用于从数据库中选取数据：

```sql
SELECT column_name,column_name
FROM table_name;

-- 返回所有记录
SELECT * FROM table_name;
```

### SELECT DISTINCT 语句

`SELECT DISTINCT` 语句用于返回唯一不同的值。

在表中，一个列可能会包含多个重复值，如果需要去掉重复值就可使用 `SELECT DISTINCT` 语句。

```sql
SELECT DISTINCT column_name,column_name
FROM table_name;
```

### LIMIT

```sql
SELECT * FROM table_name  LIMIT [offset,] rows;
-- or
SELECT * FROM table_name  LIMIT rows OFFSET offset;
```

如果只给定一个参数，表示记录数。

```sql
SELECT * FROM table_name LIMIT 5;   -- 检索前5条记录(1-5)
-- 等价于
SELECT * FROM table_name LIMIT 0, 5;
```

两个参数，第一个参数表示 offset, 第二个参数为记录数。

```sql
SELECT * FROM table_name LIMIT 10, 15;  -- 检索记录11-25
-- 等价于
SELECT * FROM table_name LIMIT 15 OFFSET 10;
```

### WHERE 

`WHERE` 子句用于过滤满足指定条件的记录。

```sql
SELECT column_name,column_name
FROM table_name
WHERE column_name operator value;
```

其中 `value` 值如果是字符串需要使用 `''` 单引号括起来；如果是数值，则不要使用引号。

#### operator 运算符

- `=`：等于
- `<>`：不等于。在 SQL 的一些版本中，该操作符可被写成 `!=`。
- `>`：大于
- `<`：小于
- `>=`：大于等于
- `<=`：小于等于
- `BETWEEN AND`：选取介于两个值之间的数据范围内的值。这些值可以是数值、文本或者日期。`WHERE column_name BETWEEN value1 AND value2;`。
- `LIKE`：模糊查询，`%` 表示多个字符，`_` 下划线表示一个字符。`WHERE name LIKE 'D%';`。
- `IN`：指定针对某个列的多个可能值，值用圆括号括起来。`WHERE column_name IN (value1,value2,...);`。
- `IS NULL` / `IS NOT NULL`：判断字段是否为空值。

请注意，在不同的数据库中，`BETWEEN` 操作符针对指定的两个字段值会产生不同的结果，有些包含有些不包含。因此，在使用中应明确数据库是如何处理 `BETWEEN` 操作符的。

#### 逻辑运算符

逻辑运算符可以和任意一个 `operator` 运算符配合使用。

- `AND`：与，条件都成立
- `OR`：或，条件中只要有一个成立
- `NOT`：非，满足不包含该条件的值
- `()`：用来组合复杂的表达式

逻辑运算的优先级：`()` > `NOT` > `AND` > `OR`。

### ORDER BY

`ORDER BY` 关键字用于对结果集按照一个列或者多个列进行排序。默认升序，如果需要降序排序，可以使用 `DESC` 关键字。

```sql
SELECT column_name,column_name
FROM table_name
ORDER BY column_name,column_name ASC|DESC;
```

`ORDER BY` 多列的时候，先按照第一个列名排序，再按照第二个列名排序。且 `DESC` 或者 `ASC` 只对它紧跟着的列名有效，其他不受影响，仍然是默认的升序。

### JOIN ON 联表查询

- `INNER JOIN`：返回两个表中所有匹配的行。
- `LEFT JOIN`：即使右表中没有匹配，也返回左表所有的行。如果右表中没有匹配，则结果为 `NULL`。
- `RIGHT JOIN`：即使左表中没有匹配，也返回右表所有的行。如果左表中没有匹配，则结果为 `NULL`。
- `FULL JOIN`：返回两个表中所有匹配或不匹配的行。没有匹配的值为 `NULL`。

```sql
SELECT column_name(s)
FROM table1
JOIN table2
ON table1.column_name=table2.column_name;
```

### SQL 函数

#### Aggregate 函数

- `AVG()`：返回指定列的平均值，`SELECT AVG(column_name) FROM table_name;`。
- `COUNT()`：返回指定列的数目（`NULL` 不计入），`SELECT COUNT(column_name) FROM table_name;`。
- `MAX()`：返回指定列的最大值，`SELECT MAX(column_name) FROM table_name;`。
- `MIN()`：返回指定列的最小值，`SELECT MIN(column_name) FROM table_name;`。
- `SUM()`：返回指定列的总和，`SELECT SUM(column_name) FROM table_name;`。

```sql
-- 选择数量高于平均值的字段
SELECT site_id, num FROM access_log
WHERE num > (SELECT AVG(num) FROM access_log);

-- 查询表中所有记录的条数
SELECT COUNT(*) FROM table_name;

-- 查询表中指定列不为空的记录的条数
SELECT COUNT(column_name) FROM table_name;

-- 查询表中指定列列不重复的记录条数
SELECT COUNT(DISTINCT column_name) FROM table_name;
```

#### Scalar 函数

- `UCASE()`：将指定字段值转换为大写，`SELECT UCASE(column_name) FROM table_name;`。
- `LCASE()`：将指定字段值转换为小写，`SELECT LCASE(column_name) FROM table_name;`。
- `MID()`：从指定文本字段提取字符，`SELECT MID(column_name,start[,length]) FROM table_name;`。
- `LEN()`：返回指定文本字段的长度，`SELECT LEN(column_name) FROM table_name;`。
- `ROUND(字段,小数位数)`：对指定数值字段进行指定小数位数的四舍五入，`SELECT ROUND(column_name,decimals) FROM table_name;`。
- `NOW()`：返回当前的系统日期和时间。
- `FORMAT()`：格式化指定字段的显示方式，`SELECT FORMAT(column_name,format) FROM table_name;`。

### GROUP BY

`GROUP BY` 语句可结合聚合函数来使用，根据一个或多个列对结果集进行分组。

```sql
SELECT column_name, aggregate_function(column_name)
FROM table_name
WHERE column_name operator value
GROUP BY column_name;
```

#### HAVING 子句

在 SQL 中增加 `HAVING` 子句原因是，`WHERE` 关键字无法与聚合函数一起使用。

`HAVING` 子句可以让我们筛选分组后的各组数据。

```sql
SELECT column_name, aggregate_function(column_name)
FROM table_name
WHERE column_name operator value
GROUP BY column_name
HAVING aggregate_function(column_name) operator value;
```

### CONCAT 函数

#### CONCAT

`CONCAT()` 函数用于将多个字符串连接成一个字符串。返回结果为连接参数产生的字符串，如果有任何一个参数为 `null`，则返回值为 `null`。

```sql
SELECT CONCAT(str1,str2,...) FROM table_name
```

可在每个字符串中间使用 `seperator` 分隔符，返回结果为连接参数产生的字符串并且有分隔符，如果有任何一个参数为 `null`，则返回值为 `null`。

```sql
CONCAT(str1, seperator,str2,seperator,...)
```

#### CONCAT_WS

`CONCAT_WS()` 函数和 `CONCAT()` 一样，将多个字符串连接成一个字符串，但是可以一次性指定分隔符（`CONCAT_WS` 就是concat with separator）。

第一个参数指定分隔符。需要注意的是分隔符不能为 `null`，如果为 `null`，则返回结果为 `null`。

```sql
CONCAT_WS(separator, str1, str2, ...)
```

#### GROUP_CONCAT

`GROUP_CONCAT()` 函数用于将 `GROUP BY` 产生的同一个分组中的值连接起来，返回一个字符串结果。

```sql
SELECT GROUP_CONCAT([DISTINCT] column_name, column_name [ORDER BY column_name ASC/DESC] [SEPARATOR '分隔符'] ) AS group_name FROM table_name GROUP BY column_name
```

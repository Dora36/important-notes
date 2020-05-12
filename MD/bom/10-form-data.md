## FormData 构造函数

`FormData()` 构造函数用来构造表单数据。主要用于上传文件。

### 参数

参数可以是一个表单元素，也可以为空。如果没有参数，就表示生成一个空的表单实例，如果参数是一个表单元素，则会处理表单元素里面的键值对。

```js
let data = new FormData();  // 空表单实例
```

```html
<form id="myForm" name="myForm">
  <div>
    <label for="username">用户名：</label>
    <input type="text" id="username" name="username">
  </div>
  <div>
    <label for="useracc">账号：</label>
    <input type="text" id="useracc" name="useracc">
  </div>
  <input type="submit" value="Submit!">
</form>

<script>
let myForm = document.getElementById('myForm');
let formData = new FormData(myForm);   // 生成表单数据

formData.get('username')          // ""
formData.set('username', '张三');
formData.get('username')          // "张三"
</script>
```

### API

- `get(key)`：获取指定键名对应的键值，参数为键名。如果有多个同名的键值对，则返回第一个键值对的键值。
- `getAll(key)`：返回一个数组，表示指定键名对应的所有键值。如果有多个同名的键值对，数组会包含所有的键值。
- `set(key, value)`：设置指定键名的键值，参数为键名。如果键名不存在，会添加这个键值对，否则会更新指定键名的键值。如果第二个参数是文件，还可以使用第三个参数，表示文件名。
- `append(key, value)`：添加一个键值对。如果键名重复，则会生成两个相同键名的键值对。如果第二个参数是文件，还可以使用第三个参数，表示文件名。
- `delete(key)`：删除一个键值对，参数为键名。
- `has(key)`：返回一个布尔值，表示是否具有该键名的键值对。
- `keys()`：返回一个遍历器对象，用于 `for...of` 循环遍历所有的键名。
- `values()`：返回一个遍历器对象，用于 `for...of` 循环遍历所有的键值。
- `entries()`：返回一个遍历器对象，用于 `for...of` 循环遍历所有的键值对。如果直接用 `for...of` 循环遍历 FormData 实例，默认就会调用这个方法。

## 文件上传

- 利用 FormData 对象，模拟发送到服务器的表单数据。
- 除了发送 FormData 实例，也可以直接 AJAX 发送文件。
- 也可以使用拖拽事件上传文件。

```html
<input type="file" id="file" multiple>
<input type="button" id="submit" value="上传" />

<script>
  let oFile = document.querySelector('#file')
  let submit = document.querySelector('#submit')

  submit.onclick = function(){
    // 1. 利用 FormData 对象，模拟发送到服务器的表单数据
    let formData = new FormData();

    for (let i = 0; i < oFile.files.length; i++) {
      // 只上传图片文件
      if (!files[i].type.match('image.*')) {
        continue;
      }
      formData.append('photos[]', files[i], files[i].name);
    }
    xhr.send(formData);

    // 2. 除了发送 FormData 实例，也可以直接 AJAX 发送文件。
    var file = oFile.files[0];
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'xxx');
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  }
</script>
```

### 拖拽事件上传文件

- `ondragenter`：拖着东西进入
- `ondragleave`：拖着东西离开
- `ondragover`：悬停，只要鼠标没松手，就会一直触发。并且不阻止默认事件，`ondrop` 就不会触发。`return false`
- `ondrop`：松手，要阻止直接打开文件的默认事件。`return false`

### 上传的文件大小

http 协议规定 body 数据 <1G，因此文件也不能大于 1G。如果传输大文件，需要考虑用户体验。

建议超过 50M 的文件可用插件进行上传，支持断点续传之类的技术。


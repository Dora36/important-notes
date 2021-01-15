## JSON Web Token

jwt 是用于用户认证的，适用于分布式站点的单点登录（SSO）场景。JWT 的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服务器获取资源，也可以增加一些额外的其它业务逻辑所必须的声明信息，并且防止信息被篡改。

## JWT 的数据结构

jwt 是一串很长的字符串，包含被点 （`.`）分隔的三个部分：Header、Payload、Signature。

### Header

Header 是一个 JSON 对象，通常由两部分组成：token 的类型（即 JWT）和所使用的签名算法（algorithm），例如 HMAC SHA256 （HS256，默认）或 RSA。

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

最后，将上面的 JSON 对象使用 Base64Url 算法转成字符串作为 jwt 的第一个部分。

### Payload

Payload 部分也是一个 JSON 对象，用来存放实际需要传递的数据。JWT 规定了部分官方字段：

- `iss` (issuer)：签发人
- `exp` (expiration time)：过期时间
- `sub` (subject)：主题
- `aud` (audience)：受众
- `nbf` (Not Before)：生效时间
- `iat` (Issued At)：签发时间
- `jti` (JWT ID)：编号

除了官方字段，还可以在这个部分定义私有字段：

```json
{
  "tel": "1234567890",
  "empId": ""
}
```

注意，JWT 默认是不加密的，任何人都可以读到，所以不要把秘密信息放在这个部分。

这个 JSON 对象也要使用 Base64Url 算法转成字符串作为 jwt 的第二个部分。

### Signature

Signature 部分是对前两部分的签名，防止数据篡改。

要创建签名部分，必须使用前两部分 Header 和 Payload 以及密钥（secret），使用 Header 里面指定的签名算法（默认是 HMAC SHA256），按照下面的公式产生签名：

```js
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret)
```

算出签名以后，把 Header、Payload、Signature 三个部分拼成一个字符串，每个部分之间用"点"（`.`）分隔，然后返回给用户。

## JWT 的使用方式

客户端收到服务器返回的 JWT，可以储存在 Cookie 里面，也可以储存在 localStorage。

此后，客户端每次与服务器通信，都要带上这个 JWT。可以把它放在 Cookie 里面自动发送，但是这样不能跨域，所以更好的做法是放在 HTTP 请求的头信息 `Authorization` 字段里面。

```
Authorization: Bearer <token>
```

另一种做法是，跨域的时候，JWT 就放在 POST 请求的数据体里面。

### 基于 token 的鉴权机制

1. 用户使用用户名密码来请求服务器
2. 服务器进行验证用户的信息
3. 服务器通过验证发送给用户一个 token
4. 客户端存储 token，并在每次请求时附送上这个 token 值
5. 服务端验证 token 值，并返回数据

<img src="./img/flowchart.png" width="800">

## [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) 库

### 安装

```shell
npm install jsonwebtoken
```

### 使用

#### 生成 token

```js
jwt.sign(payload, secretOrPrivateKey, [options])
```

返回 JsonWebToken 的字符串。

- `payload`：可以是 Object 对象或有效的 JSON 字符串，如果是 Object 对象，则会默认调用 `JSON.stringify` 转换为字符串。

- `secretOrPrivateKey`：可以是 HMAC SHA256 的密钥字符串或其他签名算法的密钥格式。

- `options`：jwt 的配置选项
  - `algorithm`：签名算法，默认 HS256。
  - `expiresIn`：有效期，如 "2 days", "10h", "7d"，默认毫秒 ms，单位参考[`zeit/ms`](https://github.com/vercel/ms)。
  - `notBefore`：起始时间，参数同上。

```js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'dorasecret';
let token = jwt.sign({empId: 'xxxxx'}, JWT_SECRET, { expiresIn: '1h' });
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBJZCI6Inh4eHh4IiwiaWF0IjoxNjEwNjkwNzM4LCJleHAiOjE2MTA2OTQzMzh9.eNVkuRbuMpGDIX5vLDX2IsO4j7S2sFsPfh_4jZCy3Fo
```

#### 验证 token

```js
jwt.verify(token, secretOrPublicKey, [options])
```

返回解码后的 `Payload`，如果签名无效或超过有效期或有其他错误，则直接 throw 错误。

- `token`：JsonWebToken 的字符串。

- `secretOrPublicKey`：生成 token 时的密钥。

- `options`
  - `complete`：返回解码后的 `{ payload, header, signature }` 对象，而不只是 `Payload`。

```js
try {
  let payload = jwt.verify(token, JWT_SECRET);
  // { empId: 'xxxxx', iat: 1610690738, exp: 1610694338 }
} catch(e) {
  let error = e.message  // 'jwt expired' / 'invalid signature' / ...
}
```

参考链接：
 [*JSON Web Token 入门教程*](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)
 [*jwt.io*](https://jwt.io/introduction)

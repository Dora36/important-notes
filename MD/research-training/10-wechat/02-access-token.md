## accessToken

通过数据库管理 accessToken。

```js
// config.js
export default {
  db: 'mongodb://localhost:27017/wechat',
  wechat: {
    appID: 'xxx',
    appSecret: 'xxx',
    token: 'xxx'
  }
}
```

```js
// schema/token.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const TokenSchema = new mongoose.Schema({
  name: String,
  token: String,
  expires_in: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

TokenSchema.pre('save', function (next) {
  if(this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now
  }
  next()
})

TokenSchema.statics = {
  async getAccessToken() {
    const token = await this.findOne({
      name: 'access_token'
    }).exec()
    if(token && token.token) {
      token.access_token = token.token
    }
    return token
  },
  async saveAccessToken(data) {
    let token = await this.findOne({
      name: 'access_token'
    }).exec()

    if(token) {
      token.token = data.access_token
      token.expires_in = data.expires_in
    }else {
      token = new Token({
        name: 'access_token',
        token: data.access_token,
        expires_in: data.expires_in
      })
    }
    await token.save()
    return data
  }
}
const Token = mongoose.model('Token', TokenSchema)
```

```js
// wechat-utils.js
import request from 'request-promise'

const base = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
  accessToken: base + 'token?grant_type=client_credential'
}

export default class Wechat {
  constructor(opts) {
    this.opts = Object.assign({}, opts)
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.fetchAccessToken()

  }

  async request (options) {
    options = Object.assign({}, options, {json:true})
    try {
      const response = await request(options)
      return response
    } catch (error) {
      console.log(error)
    }
  }

  async fetchAccessToken() {
    const data = await this.getAccessToken();

    if(!this.isValidAccessToken(data)) {
      data = await this.updateAccessToken()
    }
    await this.saveAccessToken(data)

    return data
  }

  async updateAccessToken(){
    const url = api.accessToken + `&appid=${this.appID}&secret=${this.appSecret}`
    const data = await this.request({url}) // 微信服务器返回新的 accessToken
    const now = (new Date()).getTime()
    const expiresIn = now + (data.expires_in - 20) * 1000
    data.expires_in = expiresIn  // 改为到期时间戳并设置 20s 的缓冲期
    return data
  }

  // 判断 accessToken 是否过期
  isValidAccessToken(data) {
    if(!data || !data.access_token || !data.expires_in) {
      return false
    }

    const expiresIn = data.expires_in
    const now = (new Date()).getTime()

    if(now < expiresIn) {
      return true
    } else {
      return false
    }
  }
}
```

```js
// wechat.js
import mongoose from 'mongoose'
import config from '../config'
import Wechat from '../wechat-utils'

const Token = mongoose.model('Token')

const wechatConfig = {
  wechat: {
    appID: config.wechat.appID,
    appSecret: config.wechat.appSecret,
    token: config.wechat.token,
    getAccessToken: async () => await Token.getAccessToken(),
    saveAccessToken: async (data) => await Token.saveAccessToken(data)
  }
}

export const getWechat = () => {
  const wechatClient = new Wechat(wechatConfig.wechat)
  return wechatClient
}
```


## 微信系产品

### 微信公众平台

- 订阅号：适合个人开发者和小公司，没有门槛。没有支付权限。可以每天发文章。

- 服务号：公司运营的平台，有审核认证的门槛，有支付的权限，如商城。每个月只能发四篇文章。

- 企业号：大公司内部流程的管理

- 小程序：可进行业务试水。

有公司资质的才可以使用对应业务中的支付权限等。

### 公众平台认证

使用邮箱注册账号，每年 300 块钱认证。需要公司营业执照等资质。

### 微信开放平台

## 域名及服务器线上部署

域名需备案  

域名 A记录 和 CNAME

### 环境安装

服务器环境 和 本地环境都要安装

nvm  node  

pm2

yarn：比 npm 对版本约束更加苛刻。切换源：`yarn config set registry https://registry.npm.taobao.org`

vue-cli

mongodb


### nginx 配置

负载均衡   端口映射

### git 权限配置

本地和服务器都要设置 git 的权限，之后就可以通过 pm2 配置自动部署。

## 公众号 API  

- 接收消息  发送消息

- 用户管理  

- 网页接入 - 微信支付

### 小程序

可分别注册公众号账号和小程序账号，并相互关联；也可在公众号中直接注册与公众号关联的小程序。

openid：用户登录小程序或者公众号的唯一id，不同平台 id 都不一样。

unionid：同一个用户在小程序或公众号等不同平台的同一 id。

## 框架

- sass
- koa：与 express 的区别
- webpack：编译小程序模版 .mina  wechat-mina-loader

## Vue SSR

SSR：Server-Side Rendering 服务器端渲染

存在的目的：利于 SEO。

### Nuxt.js


### 模版引擎

- pug  jade

- esj

### GraphQL 和 Restful API

- GraphQL

- Restful API

## 内网穿透代理本地服务

- 花生壳：windows

- 魔法隧道：windows

- ngrok

## nuxt && koa

- ramda：第三方库，函数式编程，import R from 'ramda'; R.map  R.compose

- path：import {resolve} from 'path'; r = path=>resolve(__dirname,path); 返回绝对路径

- sha1：加密

- row-body

- xml2js

- request-promise

- ejs：用于处理微信公众号接收到的消息模版。

## 微信 api

- accessToken

- 微信消息

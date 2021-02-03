import validator from 'validator';

// - isAlpha：只包含字母 (a-zA-Z)

// - isAlphanumeric：只包含字母和数字

// - isNumeric：只包含数字

// - isCurrency：是否是货币表示法

// - isEmail：是否是一个邮箱

// - isLowercase / isUppercase：是否是小写 / 大写

// - isMobilePhone(str, [local])：是否是手机号，['zh-CN', 'zh-HK', 'zh-MO', 'zh-TW']

// - isMongoId：是否是 MongoDB ObjectId 的有效十六进制编码表示形式。

// - isURL：是否是 url

// 是否是符合中国的手机号
validator.isPhone = (str) => {
  return validator.isMobilePhone(str, ['zh-CN', 'zh-HK', 'zh-MO', 'zh-TW'])
}

export default validator
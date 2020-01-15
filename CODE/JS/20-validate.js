const mongoose = require('mongoose');
const Validate = Object.create(null);

Validate.isTelNumber = (phone) => {
  return /^1(3\d|4\d|5\d|6\d|7\d|8\d|9\d)\d{8}$/g.test(phone);
};

Validate.isEmail = (emailStr) => {
  return /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/g.test(emailStr);
};

Validate.isId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

Validate.isUrl = (url) => {
  const strUrl = "^((https|http|ftp|rtsp|mms)?://)" +
    "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" +
    "(([0-9]{1,3}\.){3}[0-9]{1,3}" +
    "|" +
    "([0-9a-z_!~*'()-]+\.)*" +
    "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." +
    "[a-z]{2,6})" +
    "(:[0-9]{1,4})?" +
    "((/?)|" +
    "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
  const urlDemo = new RegExp(strUrl);
  return urlDemo.test(url);
};

// 非零正整数
Validate.isPositiveInteger = (num) => {
  return typeof num === 'number' && /^[1-9][0-9]*$/.test(num);
};

// 非零负整数
Validate.isNegativeInteger = (num) => {
  return typeof num === 'number' && /^\-[1-9][0-9]*$/.test(num);
};

// 小数点后最多保留两位的正数
Validate.isTwoDigits = (num) => {
  return typeof num === 'number' && Number.isInteger(num) || /^[0-9]+\.[0-9]{1,2}$/.test(num);
};

/**
 * @Description: 是否是数组
 * @Param: {type} 
 * @Return: 
 * @Author: D.W
 * @Date: 2020-01-15 15:30:48
*/
Validate.isAarry = (arr) => {
  return Array.isArray(arr);
}

/**
 * @Description: 判断是否是有限的数字
 * @Param: {type} 
 * @Return: 
 * @Author: D.W
 * @Date: 2020-01-15 15:29:14
*/
validTool.isNumber = (num) => {
  return typeof num === 'number' && Number.isFinite(num);
};

exports.Validate = Validate;
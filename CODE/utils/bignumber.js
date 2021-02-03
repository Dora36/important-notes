import { BigNumber } from 'bignumber.js';

let Bn = BigNumber.clone();

// 加法，返回 dp 位小数，不传 dp 返回原运算结果
// 多个数相加，使用 Bn.sum(n...).toNumber()
Bn.plus = (n1, n2, dp) => {
  return common('plus',n1, n2,dp)
}

// 减法，返回 dp 位小数，不传 dp 返回原运算结果
Bn.minus =  (n1, n2, dp) => {
  return common('minus',n1, n2,dp)
}

// 乘法，返回 dp 位小数，不传 dp 返回原运算结果
Bn.times = (n1, n2, dp) => {
  return common('times',n1, n2,dp)
}

// 除法，返回 dp 位小数，不传 dp 返回原运算结果
Bn.div = (n1, n2, dp) => {
  return common('div',n1, n2,dp)
}

// 通过四舍五入保留 dp 位的小数，返回 number 类型，会舍弃多余的 0
Bn.dp = (n, dp) => {
  n = Bn(n);
  let result = Bn.isPositiveInteger(dp) ? n.dp(dp) : n
  return result.toNumber()
}

// 通过四舍五入保留 dp 位的小数，返回字符串，小数后用 0 补位
Bn.toFixed = (n, dp) => {
  n = Bn(n);
  return Bn.isPositiveInteger(dp) ? n.toFixed(dp) : n.toString()
}

// 取反，相当于乘以 -1
Bn.negated = (n) => {
  return Bn(n).negated().toNumber()
}

// 格式化数字，并返回 dp 小数位的字符串。类似于 金额 3,555.00 的显示。
Bn.format = (n, dp) => {
  n = Bn(n);
  return Bn.isPositiveInteger(dp) ? n.toFormat(dp) : n.toFormat() 
}

// 是否是正整数，参数必须为数字
Bn.isPositiveInteger = (n) => {
  return typeof n === 'number' && Bn(n).isPositive() && Bn(n).isInteger()
}

// 是否为指定小数位，默认为 2，参数可以是字符串
Bn.isEqualDecimal = (n, dp) => {
  dp = Bn.isPositiveInteger(dp) ? dp : 2
  return Bn(n).dp() === dp
}

function common(operation, n1, n2, dp) {
  n1 = Bn(n1);
  n2 = Bn(n2);
  let result = n1[operation](n2);
  result = Bn.isPositiveInteger(dp) ? result.dp(dp) : result
  return result.toNumber()
}

export default Bn
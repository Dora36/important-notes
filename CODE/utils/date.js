import dayjs from 'dayjs'

// - diff：返回两个指定日期的差。

// - isBefore / isSame / isAfter：比较两个日期

// - get / set：从 Day.js 对象中 获取 / 设置 相应信息

let date = Object.create(null)

/* 格式化时间，默认返回 2021-2-4 格式
  date：时间 / 时间戳
  type：day / time  精确到天 / 精确到秒 2021-2-4 10:00:00
  format：自定义返回格式，参考 dayjs 语法
*/
date.format = (date, type) => {

  if(!dayjs(date).isValid()) {
    return ''
  }

  let day = dayjs(date).format('YYYY-MM-DD')
  let time = dayjs(date).format('HH:mm:ss')

  return type === 'time' ? `${day} ${time}` : day
}

export { date, dayjs }

// 小数点补零
export function returnFloat(val) {
  let str = val.toString().split('.')
  if (str.length === 1) {
    str += '.00'
    return str
  }
  if (str.length > 1 && str[1].length < 2) {
    str += '0'
    return str
  }
  let strOk = str.join('.')
  return strOk
}

// 时间补零
export function toDouble(str) {
  let arr = str.split(':')
  let temp = []
  arr.forEach(item => {
    if (item.length < 2) {
      item += '0'
    }
    temp.push(item)
  })
  let strOk = temp.join(':')
  return strOk
}

// 节流
export function throttle (fn, interval) {
  console.log('start')
  // last为上一次触发回调的时间
  let last = 0

  return function () {
    let now = +new Date() // 转时间戳

    if (now - last >= interval) {
      last = now
      // fn.apply(context, args)
      fn()
    }
  }
}

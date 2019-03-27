// 节流：减少用户点击支付按钮，interval：1000为1秒
export function throttle (fn, interval) {
  let start = 0
  let now = +new Date() // 获取现在的时间戳
  if(now - start >= interval) {
    fn()
    start = now
  }
}
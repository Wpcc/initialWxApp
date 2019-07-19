// 节流：减少用户点击支付按钮，interval：1000为1秒
export function throttle (fn, interval, that) {
  let now = +new Date() // 获取现在时间
  if(now - that.data.start > interval){
    fn(that)
    that.setData({
      start: now
    })
  }
}
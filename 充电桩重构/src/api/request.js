/**
 * wepy并没有封装post链式promise方法
 */
const host = 'https://backend.quanjieshop.com'

export const request = (method = 'POST', path, args) => {
  const url = host + path
  const {data, header} = args
  console.log('获取的data：' + JSON.stringify(args))
  return new Promise((resolve, reject) => {
    wx.request({
      method: method,
      url: url,
      header: header,
      data: data,
      success(res) {
        res = res.data
        // 如果返回值为0，失败
        if (res.data === 0) {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          // 如果返回值为1，成功
          resolve(res)
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

let host = 'https://backend.quanjieshop.com'

export const request = (method = 'POST', path, args = {}) => {
  const url = host + path
  const {data, header} = args
  return new Promise((resolve, reject) => {
    wx.request({
      method: method,
      url: url,
      header: header,
      data: data,
      success(res) { // 不做拦截处理
        res = res.data
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

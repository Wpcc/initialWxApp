
const app = getApp()
export const placeOrder = (path, args) => {
  const url = app.globalData.url + path
  const {data, header} = args
  console.log(header)
  return new Promise((resolve, reject) => {
    wx.request({
      method: method,
      url: url,
      header: header ? header : {},
      data: data,
      success(res){
        res = res.data
        console.log(res.data)
        // 返回值为0，未登录，弹出提示框
        if(res.status === 0){
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }else{
          // 返回值为1，登录成功
          resolve(res)
        }      
      },
      fail(err){
        reject(err)
      }
    })
  })
}
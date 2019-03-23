/**
 * method默认值为POST，path为路径，arg是一个对象，里面是传递过来的数据
 */
const app = getApp()
export const request = (method = 'POST', path, args) => {
  const url = app.globalData.url + path
  const {data, header} = args
  console.log('获取的data：' + JSON.stringify(args))
  return new Promise((resolve, reject) => {
    wx.request({
      method:method,
      url:url,
      header:header,
      data:data,
      success(res){
        res = res.data
        // 如果返回值为0，失败
        if(res.data === 0){
          wx.showToast({
            title:res.msg,
            icon:'none',
            duration:2000
          })
        }else{
          // 如果返回值为1，成功
          resolve(res)
        }
      },
      fail(err){
        reject(err)
      }
    })
  })
}


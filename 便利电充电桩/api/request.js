/**
 * method默认值为POST，path为路径，arg是一个对象，里面是传递过来的数据
 */
import {login} from '../utils/login'
const app = getApp()
export const request = (method = 'POST', path, args = {}) => {
  const url = app.globalData.url + path
  const {data, header} = args
  return new Promise((resolve, reject) => {
    wx.request({
      method:method,
      url:url,
      header:header,
      data:data,
      success(res){ // 不做拦截处理
        res = res.data
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}


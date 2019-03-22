/**
 * payment页面，请求
 */
const app = getApp()
export function placeOrder(path, args){
  let url = app.global.url + path
  wx.request({
    url:url,
    header:{
      
    }
  })
}
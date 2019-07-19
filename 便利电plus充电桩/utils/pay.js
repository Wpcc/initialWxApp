import MD5 from './md5'
import {request} from './request'
// import {goPayTip} from '../router/routes'
// import {recharge} from './util.js'
// import { tip } from './tip'

const app = getApp()

export const pay = (data, fn) => {
  // let orderNum = data.order_sn  订单号，查询订单用
  let appId = app.globalData.appId
  let timeStamp = Date.now().toString()
  let signType = 'MD5'
  let nonceStr = Date.now().toString() + 'hello world'
  let prepay_id = 'prepay_id=' + data.prepay_id
  let mch_id = app.globalData.mch_id
  let order_id = data.order_id
  console.log('order_id:' + order_id)
  console.log('')
  // 签名,注意：模板字符串空格符也会占位
  let paySign = MD5.hex_md5(`appId=${appId}&nonceStr=${nonceStr}&package=${prepay_id}&signType=${signType}&timeStamp=${timeStamp}&key=${mch_id}`).toUpperCase()
  wx.requestPayment({
    // 所有参数均为string
    timeStamp:timeStamp, // 时间戳
    nonceStr:nonceStr, // 随机字符串
    package:prepay_id, // prepay_id参数
    signType:signType, // 签名算法
    paySign:paySign,  // 签名内容
    success(res){
      console.log('order_id:' + order_id)
      fn(order_id)
    },
    fail(err){
      console.log('支付失败:' + JSON.stringify(err))
      request('POST','/api/order/cancelOrder',{
        header:{
          session3rd: wx.getStorageSync('session3rd')
        },
        data:{
          order_id: order_id
        }
      })
      .then(res => {
        console.log(res)
      })
    }
  })
}

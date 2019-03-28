import MD5 from '../modules/md5'
import {request} from '../api/request'

const app = getApp()

export const pay = (data) => {
  console.log(data)
  let orderNum = data.order_sn // 订单号，查询订单用
  let appId = app.globalData.appId
  let timeStamp = Date.now().toString()
  let signType = 'MD5'
  let nonceStr = data.nonce_str
  let prepay_id = 'prepay_id=' + data.prepay_id
  let mch_id = 'quanjie1234567891234567891234567'

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
      searchOrder(orderNum)
      console.log(JSON.stringify(res))
    },
    fail(err){
      console.log('支付失败:' + JSON.stringify(err))
    }
  })
}

function searchOrder (orderNum) {
  request('POST', '/api/Queryorder/index', {
    header: {
      session3rd: wx.getStorageSync('session3rd')
    },
    data: {
      order_sn: orderNum
    }
  })
  .then((res) => {
    if(res.status === 1) { // 1 支付成功
      console.log('支付成功')
    }else{ // 非1支付失败
      console.log('支付失败')
    }
  })
  .catch((err) => {
    console.log(err)
  })
}
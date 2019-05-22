import MD5 from './md5'
import {goOrderList} from '../router/routes'

export const pay = (data) => {
  let appId = 'wxb5d8d5874dcb2f3e'
  let timeStamp = Date.now().toString()
  let nonceStr = Date.now().toString() + 'hello world'
  let signType = 'MD5'
  let prepayId = 'prepay_id=' + data.data.pay_no
  let mchId = 'quanjie1234567891234567891234567'

  // 签名,注意：模板字符串空格符也会占位
  let paySign = MD5.hex_md5(`appId=${appId}&nonceStr=${nonceStr}&package=${prepayId}&signType=${signType}&timeStamp=${timeStamp}&key=${mchId}`).toUpperCase()
  wx.requestPayment({
    // 所有参数均为string
    timeStamp: timeStamp, // 时间戳
    nonceStr: nonceStr, // 随机字符串
    package: prepayId, // prepay_id参数
    signType: signType, // 签名算法
    paySign: paySign,  // 签名内容
    success(res) {
      console.log(JSON.stringify(res))
      goOrderList()
    },
    fail(err) {
      console.log('支付失败:' + JSON.stringify(err))
    }
  })
}

/* eslint-disable camelcase */
import MD5 from 'md5'

export const pay = (data) => {
  console.log(data)
  let appId = 'wx663da65452ee2d87'
  let timeStamp = Date.now().toString()
  let signType = 'MD5'
  let nonceStr = data.nonce_str
  let prepay_id = 'prepay_id=' + data.prepay_id
  let mch_id = 'quanjie1234567891234567891234567'

  // 签名,注意：模板字符串空格符也会占位
  let paySign = MD5(`appId=${appId}&nonceStr=${nonceStr}&package=${prepay_id}&signType=${signType}&timeStamp=${timeStamp}&key=${mch_id}`).toUpperCase()
  wx.requestPayment({
    // 所有参数均为string
    timeStamp: timeStamp, // 时间戳
    nonceStr: nonceStr, // 随机字符串
    package: prepay_id, // prepay_id参数
    signType: signType, // 签名算法
    paySign: paySign,  // 签名内容
    success(res) {
      console.log('支付成功:' + res)
    },
    fail(res) {
      console.log('支付失败:' + res)
    }
  })
}

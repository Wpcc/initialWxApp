// pages/payment/index.js
import MD5 from '../../utils/md5'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pileNum:[
      { id: 0, content: '0', background: '#ffffff', color: '#23C675' },
      { id: 1, content: '1', background: '#ffffff', color: '#23C675' },
      { id: 2, content: '2', background: '#ffffff', color: '#23C675' },
      { id: 3, content: '3', background: '#ffffff', color: '#23C675' },
      { id: 4, content: '4', background: '#ffffff', color: '#23C675' },
      { id: 5, content: '5', background: '#ffffff', color: '#23C675' },
      { id: 6, content: '6', background: '#ffffff', color: '#23C675' },
      { id: 7, content: '7', background: '#ffffff', color: '#23C675' },
      { id: 8, content: '8', background: '#ffffff', color: '#23C675' },
      { id: 9, content: '9', background: '#ffffff', color: '#23C675' }
    ],
    canIUse: wx.canIUse('button.open-type.getUserInfo') // 获取用户信息兼容：这里没使用
  },
  clickedPileNum: function (e) {
    const currentTarget = e.currentTarget 
    // 通过数据模拟循环设置数据
    for(let i=0; i<this.data.pileNum.length; i++){
      var obj = {}
      var background = 'pileNum[' + i + '].background'
      var color = 'pileNum[' + i + '].color'
      obj[background] = '#ffffff' 
      obj[color] = '#23C675'
      this.setData(obj)
    }
    var obj = {}
    var background = 'pileNum[' + currentTarget.dataset.num + ']background'
    var color = 'pileNum[' + currentTarget.dataset.num + '].color'
    obj[background] = '#23C675'
    obj[color] = '#ffffff'
    this.setData(obj)
  },
  // onLoad生命周期
  onLoad() {
    console.log('userId:' + this.data.userId)
  },
  onPay () {
    let nowtime = Data.now();
    let paySignMD5 = MD5.hex_md5(`appId=wx663da65452ee2d87&nonceStr=XKy12raE1kCqRoWN&package=prepay_id=wx22173055143535c7492dc14c1770562420&signType=MD5&timeStamp=nowtime&key=quanjie1234567891234567891234567`).toUpperCase()
    wx.requestPayment({
      
      timeStamp: nowtime,
      nonceStr: 'XKy12raE1kCqRoWN',
      package: 'prepay_id=wx22173055143535c7492dc14c1770562420',
      signType: 'MD5',
      paySign: paySignMD5,
      success(res) {
        console.log(res);
       },
      fail(res) { }
    })
  },
  getUserInfo: e => {
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
        // 授权
          console.log('授权：' + wx.getStorageSync('userId'))
          // 第一次授权，将用户信息发送给后台
          wx.getUserInfo({
            success(res) {
              const userInfo = res.userInfo
              // 获取code的值
              wx.login({
                success(res) {
                  //将授权信息传递到后台
                  wx.request({
                    url: 'https://backend.quanjieshop.com/api/login/login',
                    method: 'post',
                    data: {
                      nickname: userInfo.nickName,
                      headimgurl: userInfo.avatarUrl,
                      sex: userInfo.gender,
                      code: res.code
                    },
                    success(res) {
                      // 如果
                      let userId = res.data.data.session3rd.toString()
                      // console.log('userId:' + userId)
                      // wx.setStorage({
                      //   key: 'userId',
                      //   data: userId
                      // })
                      // //
                      // let userId = wx.getStorage('userId')
                      // console.log('获取userId的值：' + userId)
                      wx.request({
                        url:'https://backend.quanjieshop.com/api/Build/buildOrder',
                        method:'POST',
                        data:{
                          id:1,
                          port:1
                        },
                        header:{
                          'content-type':'application/json',
                          'session3rd':userId
                        },
                        success(res) {
                          let rr = res.data
                          console.log(rr)
                          let nowtime = Date.now().toString();
                          let nonceStr = rr.data.nonce_str;
                          let prepay_id = rr.data.prepay_id;
                          let paySignMD5 = MD5.hex_md5(`appId=wx663da65452ee2d87&nonceStr=${nonceStr}&package=prepay_id=${prepay_id}&signType=MD5&timeStamp=${nowtime}&key=quanjie1234567891234567891234567`).toUpperCase()
                      
                          wx.requestPayment({
                            timeStamp: nowtime,
                            nonceStr: nonceStr,
                            package: 'prepay_id=' + prepay_id,
                            signType: 'MD5',
                            paySign: paySignMD5,
                            success(res) {
                              console.log(res);
                             },
                            fail(res) { }
                          })                
                        } 
                      })                      
                    }
                  })
                }
              })
            }
          })
          
        } else {
          // 未授权，提示用户授权
          wx.showToast({
            title: '请打开授权，否则无法支付',
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  }
})
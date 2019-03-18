// pages/product/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskIsShow: false,
  },
  popupShow: function () {
    // this.setData({
    //   maskIsShow: true
    // })
    wx.showModal({
      title: '请核对充电桩号是否一致',
      content: '00000001',
      success(res) {
        if (res.confirm) {
          console.log('click confirm')
          wx.requestPayment({
            timeStamp: '',
            nonceStr: '',
            package: '',
            signType: 'MD5',
            paySign: '',
            success(res) { },
            fail(res) { }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
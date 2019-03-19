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
      confirmColor:'#23C675',
      success(res) {
        if (res.confirm) {
          // 点击确认按钮 跳转到支付页面
          wx.navigateTo({
            url:'../payment/index'
          })
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
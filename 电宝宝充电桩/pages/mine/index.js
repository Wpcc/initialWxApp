// pages/mine/index.js
import {goOrder, goBack} from '../../router/routes'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    auth: false
  },
  // 路由
  goOrder,
  goBack,
  // 点击授权
  getUserInfo: function(e) {
    // 这里授权，让点击支付按钮没有弹窗
    console.log(e)
    this.setAuth()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    this.setAuth()
  },
  setAuth: function () {
    let that = this
    wx.getSetting({
      success(res){
        if(res.authSetting['scope.userInfo']){ // 如果授权
          that.setData({
            auth: true
          })
          
        }
      }
    })
  }
})
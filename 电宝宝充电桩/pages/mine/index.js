// pages/mine/index.js
import {goOrder, goBack, goIndex, goService, goRecord} from '../../router/routes'
import {request} from '../../api/request'

Page({
  // 数据
  data: {
    auth: false,
    bindPhone: false,
    phone:0,
    balance: '0'
  },
  // 路由
  goOrder,
  goBack,
  goService,
  goRecord,
  // 点击授权
  getUserInfo: function() {
    this.setAuth()
  },
  getPhoneNumber: function(e) {
    request('POST','/api/User/bindMobile',{
      header:{
        session3rd: wx.getStorageSync('session3rd')
      },
      data:{
        encryptedData:e.detail.encryptedData,
        iv:e.detail.iv
      }
    })
    .then((res) => {
      if(res.status === 1){
        res = res.data
        this.setData({
          bindPhone: true,
          phone:res.mobile
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    this.isAuthAndLogin()
    this.setPhoneAndBalance()
  },
  // 自定义函数
  setPhoneAndBalance: function () {
    request('POST','/api/Center/personal',{
      header:{
        session3rd: wx.getStorageSync('session3rd')
      }
    })
    .then((res) => {
      if(res.status === 1){
        res = res.data
        this.setData({ // 设置金额
          balance:res.balance.toString()
        })
        if(res.isMobile === 1){
          this.setData({
            bindPhone: true,
            phone:res.mobile
          })
        }else{
          this.setData({
            bindPhone: false
          })
        }
      }
    })
    
  },
  isAuthAndLogin() {
    wx.getSetting({
      success(res) {
        if(!res.authSetting['scope.userInfo'] || !wx.getStorageSync('session3rd')) { // 用户未授权
          goIndex()
          return
        }
      }
    })
  }
})
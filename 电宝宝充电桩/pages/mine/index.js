// pages/mine/index.js
import {goOrder, goBack, goRecharge} from '../../router/routes'
import {request} from '../../api/request'

Page({
  // 数据
  data: {
    auth: false,
    balance: '0.00'
  },
  // 路由
  goOrder,
  goBack,
  goRecharge,
  // 点击授权
  getUserInfo: function(e) {
    const that = this
    const userInfo = e.detail.userInfo
    wx.login({ // 获取code的值
      success(res) {
        request('POST', '/api/login/login', {
          data:{
            nickname: userInfo.nickName, // 用户姓名
            headimgurl: userInfo.avatarUrl, // 用户头像
            sex: userInfo.gender, // 性别
            code: res.code  // 后台服务器解析用的code
          }
        })
        .then(res => {
          wx.setStorageSync('session3rd',res.data.session3rd) // 保存用户登录凭证
          that.setAuth()
          that.balance()
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    this.setAuth()
    this.balance()
  },
  // 自定义函数
  setAuth: function () {
    let that = this
    wx.getSetting({
      success(res){
        if(res.authSetting['scope.userInfo']){ // 授权
          if(wx.getStorageSync('session3rd')){ // 并且注册
            that.setData({
              auth: true
            })
          }
        }
      }
    })
  },
  balance: function () {
    request('POST','/api/Center/personal',{
      header:{
        session3rd: wx.getStorageSync('session3rd')
      }
    })
    .then((res) => {
      if(res.status === 1){
        this.setData({
          balance:res.data.balance.toString()
        })
      }
    })
  }
})
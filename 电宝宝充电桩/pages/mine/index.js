// pages/mine/index.js
import {goOrder, goBack} from '../../router/routes'
import {request} from '../../api/request'

Page({
  // 数据
  data: {
    auth: false
  },
  // 路由
  goOrder,
  goBack,
  // 点击授权
  getUserInfo: function(e) {
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
          wx.setStorageSync(res.data.session3rd) // 保存用户登录凭证
          this.setAuth()
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    this.setAuth()
  },
  // 自定义函数
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
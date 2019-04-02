// pages/recharge/index.js
import {pay} from '../../utils/pay'
import {request} from '../../api/request'
import {throttle} from '../../utils/throttle'
Page({
  data:{
    id:'', // 用户选择ID
    start:'', // 节流时间
    money:[]
  },
  onShow() {
    request('POST', '/api/Center/personal', {
      header:{
        session3rd:wx.getStorageSync('session3rd')
      }
    })
    .then((res) => {
      if(res.status === 1){
        this.setData({
          money: res.data.money
        })
        console.log(JSON.stringify(this.data.money))
      }
    })
  },
  onCharge(e) {
    this.setData({ // 设置ID
      id:e.currentTarget.id
    })
    let that = this
    wx.getSetting({
      success(res) {
        if(res.authSetting['scope.userInfo']) { // 如果用户授权
          that.loginThenOrder()
        }else{
          wx.showToast({ // 未授权，提示用户授权
            title: '请打开授权，否则无法支付',
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  },
  // 支付流程
  loginThenOrder: function() {
    const that = this
    if(wx.getStorageSync('session3rd')){ // 是否注册 ==》 注册
      this.placeOrderAndPay() // 下单并支付
    }else{
      wx.getUserInfo({
        success(res) {
          const userInfo = res.userInfo
          throttle(() => { // 节流：减少用户点击支付按钮
            wx.login({ // 获取code的值
              success(res) {
                request('POST','/api/login/login',{ // 注册
                  data:{
                    nickname: userInfo.nickName, // 用户姓名
                    headimgurl: userInfo.avatarUrl, // 用户头像
                    sex: userInfo.gender, // 性别
                    code: res.code  // 后台服务器解析用的code
                  }
                })
                .then(res => {
                  wx.setStorageSync('session3rd',res.data.session3rd)
                  that.placeOrderAndPay() // 下单并支付   
                })
              }
            })
          }, 4000, that)
        }
      })
    }
  },
  placeOrderAndPay: function() {
    request('POST','/api/Build/chargeMoney', { // 下单
      header:{
        'session3rd':wx.getStorageSync('session3rd')
      },
      data:{
        btn_num: this.data.id
      }
    })
    .then(res => { // 下单成功进行支付
      if(res.status === 0) { // 缓存登录态失效处理
        wx.removeStorageSync('session3rd') // 清除缓存
        this.loginThenOrder()
        return
      }
      pay(res.data)
    }) 
  }
})
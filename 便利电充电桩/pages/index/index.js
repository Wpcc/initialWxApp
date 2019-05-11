// pages/index-new/index.js
import {goList, goRecharge, goInstruction, goMine, goStore, goRedPacket} from '../../router/routes'
import {login} from '../../utils/login'
import {tip} from '../../utils/tip'

const app = getApp()

Page({
  data: {
    // 轮播图数据
    imgUrls: [
      '../../static/index/img_banner.png',
      '../../static/index/img_banner.png',
      '../../static/index/img_banner.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000
  },

  // 路由
  goList,
  goRecharge,
  goInstruction,
  goStore,
  goRedPacket,

  // 处理函数
  scan() { // 扫描
    wx.scanCode({
      success(res) {
        wx.navigateTo({
          url: '/' + res.path
        })
      }
    })
  },
  bindGetUserInfo(e) { // 跳转主页：有登录逻辑
    tip.loading()
    login().then(res => {
      tip.loaded()
      if(res) {
        goMine()
      }
    })
  },
  // 生命周期函数
  onShow() {
    wx.getLocation({
      type:'gcj02',
      success(res){
        // 位置信息存储全局变量中
        app.globalData.longitude = res.longitude
        app.globalData.latitude = res.latitude
      },
      fail(){
        tip.alert('请打开位置授权，否则无法正确定位')
      }
    })
  },
  onLoad(options) {
    if(options.key){ // 通过分享进来，存入key值
      wx.setStorageSync('key',options.key)
    }
    wx.openSetting({ // 未获取用户信息，清楚登录态
      success(res) {
        if(!res.authSetting['scope.userInfo']){
          wx.removeStorageSync('session3rd')
        }
      }
    })
  }
})


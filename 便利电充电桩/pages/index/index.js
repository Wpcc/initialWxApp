// pages/index-new/index.js
import {goList, goRecharge, goInstruction, goMine, goStore, goRedPacket} from '../../router/routes'
import {login} from '../../utils/login'
import {tip} from '../../utils/tip'
import { request } from '../../api/request';

const app = getApp()

Page({
  data: {
    // 轮播图数据
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    indexData:[]
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
    // 获取首页信息
    request('GET', '/api/Index/index')
    .then(res => {
      console.log(res)
      this.setData({
        indexData: res.data.icon_info.reverse(),
      })
      let that = this
      res.data.banner_info.forEach((item, index) => {
        that.setData({
          ['imgUrls['+ index + ']']:item.img
        })        
      })
      console.log(this.data.indexData)
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


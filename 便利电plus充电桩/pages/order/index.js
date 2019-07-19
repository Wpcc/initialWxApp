// pages/order/index.js
import {request} from '../../utils/request'
import {goSocket} from '../../utils/routes'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: App.globalData.navHeight,
    pile:{}
  },
  goSocket,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    request('GET','/api/order/orderInfo',{
      header:{
        session3rd:wx.getStorageSync('session3rd')
      },
      data:{
        order_id: options.order_id
      }
    })
    .then(res => {
      this.setData({
        pile: res.data
      })
    })
  },
  
})
// pages/share/index.js
import {goOrder} from '../../router/routes'
import { tip } from '../../utils/tip'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    time:'3'
  },
  onShow(){
    
  },
  goOrder,
  onLoad() {
    wx.hideShareMenu();
  },
  // 自定义函数
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    let openid = wx.getStorageSync('openid');
    return tip.share('分享免费充电', '/pages/index/index?key=' + openid);
  }
})
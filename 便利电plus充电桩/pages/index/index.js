//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // 轮播图数据
    imgUrls:[
      '../../static/images/banner.png',
      '../../static/images/banner.png',
      '../../static/images/banner.png'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    duration: 1000,
    indexData: []
  },

  onLoad: function () {
    
  },
  getUserInfo: function(e) {
    
  }
})

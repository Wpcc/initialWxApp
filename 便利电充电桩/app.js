//app.js
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight + 46
        console.log(this.globalData.navHeight)
      },
      fail(err){
        console.log(err)
      }
    })
  },
  globalData: {
    url:'https://admin.quanjieshop.com',
    appId:'wx663da65452ee2d87',
    // 搜索需要的数据
    longitude: 114.207034,
    latitude: 30.550434,
    navHeight:0
  }
})
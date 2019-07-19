//app.js
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        this.globalData.navHeight = res.statusBarHeight + 46
      },
      fail(err){
        console.log(err)
      }
    })
  },
  globalData: {
    userInfo: null,
    navHeight: 0,
    url: 'https://eze.comeshop.cn',
    appId: 'wx7b16fa0e1303c68e',
    mch_id: 'Z2TJ1PwEydvQTKLluZzCMkVE2nPS8Bx4'
  }
})
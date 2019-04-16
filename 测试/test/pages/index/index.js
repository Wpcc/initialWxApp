//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  showPage() {
    this.toast('弹窗',2000,this.console)
  },
  toast(title,duration,methods) {
    wx.showToast({
      title: title,
      icon: 'none',
      mask: true,
      duration: duration
    });
    setTimeout(()=>{
      methods()
    },duration)
  },
  console(){
    console.log('hello')
  }
})

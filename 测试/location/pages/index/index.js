//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    getLocation: false,
    latitude: 23.099994,
    longitude: 113.324520,
    compassTrue: true,
    markers: [
      {
        id: 0,
        latitude: 23.099994,
        longitude: 113.324520
      },
      {
        id: 1,
        latitude: 56.099994,
        longitude: 113.324520
      },
      {
        id: 2,
        latitude: 23.099994,
        longitude: 100.324520
      }
    ],
  },
  onShow: function () {
    const that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          getLocation: true,
          'latitude':res.latitude,
          'longitude':res.longitude
        })
        console.log(res.latitude)
        console.log(res.longitude)
      }
    })
    console.log(this.data.getLocation)
  },
  openSetter: function () {
    if(!this.data.getLocation){
      wx.openSetting({
        success(res) {
          console.log(res.authSetting)
          // res.authSetting = {
          //   "scope.userInfo": true,
          //   "scope.userLocation": true
          // }
        }
      })
    }else{
      console.log('你已经授权成功了')
    }
  }
})

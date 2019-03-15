//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    getLocation: false,
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [
      {
        id: 0,
        latitude: 23.099994,
        longitude: 113.324520,
        width: 50,
        height: 50
      },
      {
        id: 0,
        latitude: 56.099994,
        longitude: 113.324520,
        width: 50,
        height: 50
      },
      {
        id: 0,
        latitude: 23.099994,
        longitude: 100.324520,
        width: 50,
        height: 50
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
          'markers[0].latitude':res.latitude,
          'markets[0].longitude':res.longitude
        })
        console.log(that.data.getLocation)
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

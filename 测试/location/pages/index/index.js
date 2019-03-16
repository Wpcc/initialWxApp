//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    getLocation: false,
    latitude: 30.565543,
    longitude: 114.206138,
    messageShow: true,
    markers: [
      {
        id: 0,
        latitude: 30.565543,
        longitude: 114.206138,
        iconPath: '../../static/images/location_no.png',
        width:40,
        height:40
      }
    ],
  },
  onShow: function () {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        that.setData({
          getLocation: true,
          latitude:res.latitude,
          longitude:res.longitude
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
  },
  callout: function (e) {
    console.log('clicked marker')
    console.log(e.markerId)
    this.setData({
      'markers[0].width':60,
      'markers[0].height':60
    })
  },
  goMap: function () {
    wx.openLocation({
      latitude:this.data.latitude,
      longitude:this.data.longitude,
      name:'汉西一路',
      address:'汉西一路古五社区',
      scale:18
    })
  }
})

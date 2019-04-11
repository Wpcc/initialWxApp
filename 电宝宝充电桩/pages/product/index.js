// pages/product/index.js
import {request} from '../../api/request'
import {goService} from '../../router/routes'
Page({
  data: {
    maskIsShow: false,
    userLongitude:114.207034,
    userLatitude:30.550434,
    markers:[
      {
        iconPath:'../../static/images/position_go.png',
        id:0,
        longitude:114.207034,
        latitude:30.550434,
        width:40,
        height:38
      }
    ],
    markersContent:{
    }
  },
  goService,
  popupShow: function () {
    var that = this
    wx.showModal({
      title: '请核对充电桩号是否一致',
      content: that.data.markersContent.deviceNum,
      confirmColor:'#23C675',
      success(res) {
        if (res.confirm) {
          // 点击确认按钮 跳转到支付页面
          wx.navigateTo({
            url:'../payment/index?id=' + that.data.markersContent.id
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  openLocation: function () { // 打开内置导航
    const location = {
      latitude: this.data.markers[0].latitude,
      longitude: this.data.markers[0].longitude,
      scale: 14,
      address: this.data.markersContent.address,
      name:'充电桩'
    }
    wx.openLocation(location)
  },
  // 悬浮按钮
  location() {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    })
  },
  // 生命周期函数
  onLoad(option) {
    // option可以获取跳转过来的参数
    if(option){
      // 获取用户信息
      console.log(option.id)
      let that = this
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          that.setData({
            userLongitude: res.longitude,
            userLatitude: res.latitude 
          })
        },
        fail() {
          wx.showToast({
            title:'请打开位置授权，否则无法正确定位',
            icon:'none',
            dutation:3000
          })
        }
      }),
      request('POST', '/api/Chargedetails/details', {
        data:{
          id: option.id
        }
      })
      .then(res => {
        console.log('res:' + JSON.stringify(res))
        // 后台差remaining数据
        that.setData({
          'markers[0].longitude':parseFloat(res.data.lng),
          'markers[0].latitude':parseFloat(res.data.lat),
          'markersContent.address':res.data.address,
          'markersContent.deviceNum':res.data.device_sn,
          'markersContent.port':res.data.remaining,
          'markersContent.id':res.data.id
        })
      })
    }
  }
})
// pages/list/index.js
import {goBack} from '../../router/routes'
import {request} from '../../api/request'
const app = getApp();
Page({
  data: {
    FocusTrue: true, // 焦距显示
    inputVal: "",
    // 后台地址列表
    listData: []
  },
  goBack,
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  // 点击输入框，给全局变量赋值
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  // 点击搜索logo或键盘完成===》跳转到首页
  inputCompleted: function () {
    console.log(this.data.inputVal)
    var that = this
    app.globalData.listInput = this.data.inputVal
    // 用户输入数据校验

    // 用户授权未授权两种状态
    if(!app.globalData.longitude){
      wx.showToast({
        title: '请打开位置授权，否则无法正确定位',
        icon: 'none',
        duration: 3000
      })
    }else{
      // 从后台获取数据
      request('POST','/api/Chargelist/lst',{
        data:{
          search: this.data.inputVal, // 搜索内容
          lng: app.globalData.longitude,
          lat: app.globalData.latitude
        }
      })
      .then(res => {
        res = res.data
        let i = 0
        res.forEach(item => {
          /**
           * value内容
           */
          var longitudeNum = parseFloat(item.lng)
          var latitudeNum = parseFloat(item.lat)
          var distanceStr = parseInt(item.leng).toString() + 'm'
          /**
           * key的内容
           */
          var id = 'listData[' + i + '].id'
          var longitude = 'listData[' + i + '].longitude'
          var latitude = 'listData[' + i + '].latitude'
          var address = 'listData[' + i + '].address'
          var deviceNum = 'listData[' + i + '].deviceNum'
          var port = 'listData[' + i + '].port'
          var distance = 'listData[' + i + '].distance'

          that.setData({
            [id]: item.id,
            [longitude]: longitudeNum,
            [latitude]: latitudeNum,
            [address]: item.address,
            [deviceNum]: item.device_sn,
            [port]: item.remaining,
            [distance]: distanceStr
          })
          i++
        })
      })
    }
  },
  // 点击列表页，跳转到产品详情页
  goProduct: function (e) {
    // 获取DOM自定义数据
    var id = e.currentTarget.dataset.id
    var longitude = e.currentTarget.dataset.longitude
    var latitude = e.currentTarget.dataset.latitude
    var address = e.currentTarget.dataset.address
    var deviceNum = e.currentTarget.dataset.devicenum
    var port = e.currentTarget.dataset.port

    // 通过url传值
    wx.navigateTo({
      url: '../product/index?longitude=' + longitude + '&latitude=' + latitude 
      + '&address=' + address + '&deviceNum=' + deviceNum + '&port=' + port
      + '&id=' + id//赋带详细充电桩坐标
    })
  },
  /**
   * 生命周期函数
   */
  // 页面显示时，初始化input的值
  onShow: function () {
    this.setData({
      inputVal: app.globalData.listInput
    })
  }
});
// pages/list/index.js
const app = getApp();
Page({
  data: {
    FocusTrue: true, // 焦距显示
    inputVal: "",
    // 后台地址列表
    listData: []
  },
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
  goBack: function () {
    wx.navigateBack({
      delte:1
    })
  },
  // 点击搜索logo或键盘完成===》跳转到首页
  inputCompleted: function () {
    console.log(this.data.inputVal)
    var that = this
    app.globalData.listInput = this.data.inputVal
    // 用户输入数据校验

    // 从后台获取数据
    wx.request({
      url: 'https://backend.quanjieshop.com//api/Chargelist/lst',
      methods: 'POST',
      data: {
        search: this.data.inputVal // 搜索内容
      },
      success(res) {
        var res = res.data
        console.log(res)
        var i = 0;
        res.data.forEach(item => {
          /**
           * key内容
           */
          var longitudeNum = parseFloat(item.lng)
          var latitudeNum = parseFloat(item.lat)
          /**
           * value的内容
           */
          var id = 'listData[' + i + '].id'
          var longitude = 'listData[' + i + '].longitude'
          var latitude = 'listData[' + i + '].latitude'
          var address = 'listData[' + i + '].address'
          var deviceNum = 'listData[' + i + '].deviceNum'
          var port = 'listData[' + i + '].port'
          var distance = 'listData[' + i + '].distance'

          that.setData({
            [id]:item.id,
            [longitude]:longitudeNum,
            [latitude]:latitudeNum,
            [address]:item.address,
            [deviceNum]:item.device_sn,
            [port]:item.remaining,
            [distance]:'400m'
          })
          i++
          console.log('listData:' + JSON.stringify(that.data.listData))
        })
      }
    })
  },
  // 点击列表页，跳转到产品详情页
  goProduct: function (e) {
    console.log(e)
    var longitude = e.currentTarget.dataset.longitude
    var latitude = e.currentTarget.dataset.latitude
    console.log('longitude:' + longitude)
    console.log('latitude:' + latitude)
    wx.navigateTo({
      url: '../product/index?longitude=' + longitude + '&latitude=' + latitude //赋带详细充电桩坐标
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
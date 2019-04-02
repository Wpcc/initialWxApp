// pages/list/index.js
import { goBack, goProduct } from '../../router/routes'
import { request } from '../../api/request'

const app = getApp();
Page({
  data: {
    FocusTrue: true, // 焦距显示
    inputVal: "",
    // 后台地址列表
    page:0,
    i:0,
    listData: [],
    loading: false,
    noData: false
  },
  goBack,
  goProduct,
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
    app.globalData.listInput = this.data.inputVal
  },
  // 点击搜索logo或键盘完成===》跳转到首页
  inputCompleted: function () {
    // 清空列表
    this.setData({
      listData: []
    })
    var that = this
    app.globalData.listInput = this.data.inputVal
    // 用户输入数据校验

    // 用户授权未授权两种状态
    wx.getSetting({
      success(res){
        if(!res.authSetting['scope.userLocation']){
          wx.showModal({
            title: '提示',
            content: '请打开位置授权，否则无法正确定位',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res){
                    console.log(res.authSetting)
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          // 从后台获取数据
          request('POST','/api/Chargelist/lst',{
            data:{
              search: that.data.inputVal, // 搜索内容
              lng: app.globalData.longitude,
              lat: app.globalData.latitude,
              p:'0'
            }
          })
          .then(res => {
            // 搜索清空数据
            that.setData({
              listData:[],
              i: 0
            })
            let i = 0
            res = res.data
            if(res.length === 0){
              wx.showToast({
                title: '抱歉，你搜索的内容不存在！',
                icon: 'none',
                duration: 3000
              })
              return
            }
            if(res.length === 10){
              that.setData({
                loading: true
              })
            }
            res.forEach(item => {
              that.setData({
                ['listData[' + i + '].id']: item.id,
                ['listData[' + i + '].longitude']: parseFloat(item.lng),
                ['listData[' + i + '].latitude']: parseFloat(item.lat),
                ['listData[' + i + '].address']: item.address,
                ['listData[' + i + '].deviceNum']: item.device_sn,
                ['listData[' + i + '].port']: item.remaining,
                ['listData[' + i + '].distance']: parseInt(item.leng).toString() + 'm'
              })
              i++
              that.setData({
                i: i
              })
            })
          })
        }
      }
    })
  },
  /**
   * 生命周期函数
   */
  onShow: function () {
    this.setData({ // 页面显示时，初始化input的值
      inputVal: app.globalData.listInput
    })
  },
  // 页面事件处理
  onReachBottom() {
    let page = this.data.page
    // 从后台获取数据
    this.setData({
      page: page + 1,
      loading: true
    })
    request('POST','/api/Chargelist/lst',{
      data:{
        search: this.data.inputVal, // 搜索内容
        lng: app.globalData.longitude,
        lat: app.globalData.latitude,
        p: this.data.page
      }
    })
    .then(res => {
      res = res.data
      if(res.length === 0){
        this.setData({
          noData: true
        })
        return
      }else{
        let i = this.data.i
        res.forEach(item => {
          this.setData({
            ['listData[' + i + '].id']: item.id,
            ['listData[' + i + '].longitude']: parseFloat(item.lng),
            ['listData[' + i + '].latitude']: parseFloat(item.lat),
            ['listData[' + i + '].address']: item.address,
            ['listData[' + i + '].deviceNum']: item.device_sn,
            ['listData[' + i + '].port']: item.remaining,
            ['listData[' + i + '].distance']: parseInt(item.leng).toString() + 'm'
          })
          i++
          this.setData({
            i: i
          })
          console.log(this.data.i)
        })
      }
    })
  }
});
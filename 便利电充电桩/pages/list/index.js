// pages/list/index.js
import { goBack, goProduct } from '../../router/routes'
import { request } from '../../api/request'
import { tip } from '../../utils/tip'

const app = getApp();
Page({
  data: {
    FocusTrue: true, // 焦距显示
    inputVal: "",
    // 后台地址列表
    page:1,
    i:0,
    listData: [],
    centerLoading: false,
    bottomLoading: false,
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
  },
  // 点击搜索logo或键盘完成===》跳转到首页
  inputCompleted: function () {
    // 清空列表
    this.setData({
      listData: [],
      i: 0,
      page: 1,
      centerLoading: true,
      bottomLoading: false,
      noData: false
    })
    // 用户输入数据校验
    this.getPilesList(this.searchLoad)
  },
  onReachBottom(){
    this.getPilesList(this.pullDownLoad)
  },
  /**
   * 生命周期函数
   */
  onShow: function () {
    
  },
  // 自定义事件
  getPilesList(setLoading) {
    // 如果后台无数据
    let that = this
    if(that.data.noData){
      return
    }
    request('POST','/api/Chargelist/lst', { // 从后台获取数据
      data:{
        search: that.data.inputVal, // 搜索内容
        lng: app.globalData.longitude,
        lat: app.globalData.latitude,
        p: that.data.page
      }
    })
    .then(res => {
      that.setData({ // loading 初始化
        centerLoading: false,
        bottomLoading: false,
        noData: false,
        page: that.data.page + 1
      })
      res = res.data
      let i = that.data.i
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
      setLoading(res)
    })
  },
  searchLoad(res) {
    if(res.length < 10 && res.length > 0) { // 没数据
      this.setData({
        bottomLoading: false
      })
    } else if (res.length >= 10) {
      this.setData({
        bottomLoading: true,
      })
    } else if (res.length == 0) {
      tip.error('抱歉，你搜索的内容不存在！')
    }
  },
  pullDownLoad(res) {
    if(res.length < 10) {
      this.setData({
        bottomLoading: true,
        noData: true
      })
    } else if(res.length >= 10) {
      this.setData({
        bottomLoading: true,
        noData: false,
      })
    }
  }
});